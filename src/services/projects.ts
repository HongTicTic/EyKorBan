import type {
  Deliverable,
  Project,
  ProjectEvent,
  ProjectEventType,
} from "@/interface/project"
import type { User } from "@/interface/user"
import type {
  DeliverableRow,
  ProjectEventRow,
  ProjectRow,
  ProfileRow,
} from "@/lib/database.types"
import { supabase } from "@/lib/supabase"
import { PROFILE_COLUMNS } from "@/services/columns"
import { describeError, unwrap } from "@/services/errors"
import { toUser } from "@/services/mappers"

// ── Mappers ────────────────────────────────────────────────────────────────

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    clientId: row.client_id,
    freelancerId: row.freelancer_id,
    title: row.title,
    scope: row.scope,
    budget: Number(row.budget),
    currency: row.currency,
    deadline: row.deadline ?? undefined,
    status: row.status,
    paymentStatus: row.payment_status,
    sourcePortfolioItemId: row.source_portfolio_item_id ?? undefined,
    sourceJobId: row.source_job_id ?? undefined,
    platformFee: Number(row.platform_fee),
    clientTotal: Number(row.client_total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastActivityAt: row.last_activity_at,
  }
}

function toEvent(row: ProjectEventRow): ProjectEvent {
  return {
    id: row.id,
    projectId: row.project_id,
    actorId: row.actor_id ?? undefined,
    type: row.type,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  }
}

function toDeliverable(row: DeliverableRow): Deliverable {
  return {
    id: row.id,
    projectId: row.project_id,
    submittedBy: row.submitted_by,
    note: row.note,
    images: row.images ?? [],
    createdAt: row.created_at,
  }
}

// ── Reads ──────────────────────────────────────────────────────────────────

export interface ProjectListItem {
  project: Project
  client: User | null
  freelancer: User | null
}

const WITH_PARTIES = `
  *,
  client:profiles!projects_client_id_fkey(${PROFILE_COLUMNS}),
  freelancer:profiles!projects_freelancer_id_fkey(${PROFILE_COLUMNS})
`

type RowWithParties = ProjectRow & {
  client: ProfileRow | null
  freelancer: ProfileRow | null
}

function toListItem(row: RowWithParties): ProjectListItem {
  return {
    project: toProject(row),
    client: row.client ? toUser(row.client) : null,
    freelancer: row.freelancer ? toUser(row.freelancer) : null,
  }
}

/**
 * STORY-016: the dashboard. No `or(client_id.eq…,freelancer_id.eq…)` filter is
 * needed — RLS already returns only the caller's projects, so asking for all of
 * them asks for exactly theirs.
 */
export async function listMyProjects(): Promise<ProjectListItem[]> {
  const rows = unwrap(
    await supabase
      .from("projects")
      .select(WITH_PARTIES)
      .order("last_activity_at", { ascending: false })
      .returns<RowWithParties[]>()
  )

  return rows.map(toListItem)
}

export interface ProjectDetail extends ProjectListItem {
  events: ProjectEvent[]
  deliverables: Deliverable[]
}

/** STORY-016 AC-3/AC-4. A non-member gets null, not someone else's project. */
export async function getProject(id: string): Promise<ProjectDetail | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(WITH_PARTIES)
    .eq("id", id)
    .maybeSingle()
    .returns<RowWithParties>()

  if (error) throw new Error(describeError(error))
  if (!data) return null

  const [events, deliverables] = await Promise.all([
    supabase
      .from("project_events")
      .select("*")
      .eq("project_id", id)
      // FR-023 AC-2: chronological, stable when timestamps tie.
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .returns<ProjectEventRow[]>(),
    supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .returns<DeliverableRow[]>(),
  ])

  return {
    ...toListItem(data),
    events: (events.data ?? []).map(toEvent),
    deliverables: (deliverables.data ?? []).map(toDeliverable),
  }
}

// ── Writes ─────────────────────────────────────────────────────────────────

/**
 * Timeline entries are appended alongside each transition rather than by a
 * trigger, because the note is the user's own words and only the caller has it.
 */
async function recordEvent(
  projectId: string,
  actorId: string,
  type: ProjectEventType,
  note?: string
): Promise<void> {
  const { error } = await supabase.from("project_events").insert({
    project_id: projectId,
    actor_id: actorId,
    type,
    note: note?.trim() || null,
  })

  if (error) throw new Error(describeError(error))
}

export interface CreateProjectInput {
  clientId: string
  freelancerId: string
  title: string
  scope: string
  budget: number
  deadline?: string
  sourcePortfolioItemId?: string
  sourceJobId?: string
}

/**
 * STORY-014: starts in the enquiry state.
 *
 * The actor is whoever is signed in; which party that is depends on the path.
 * From a portfolio item the client initiates (STORY-004); from a job the
 * freelancer does (STORY-012). The insert policy checks the actor against the
 * source, so neither side can address a project to someone it doesn't belong to.
 */
export async function createProject(
  actorId: string,
  input: CreateProjectInput
): Promise<Project> {
  const row = unwrap(
    await supabase
      .from("projects")
      .insert({
        client_id: input.clientId,
        freelancer_id: input.freelancerId,
        title: input.title.trim(),
        scope: input.scope.trim(),
        budget: input.budget,
        deadline: input.deadline || null,
        source_portfolio_item_id: input.sourcePortfolioItemId || null,
        source_job_id: input.sourceJobId || null,
      })
      .select("*")
      .single()
      .returns<ProjectRow>()
  )

  await recordEvent(row.id, actorId, "created")
  return toProject(row)
}

/** Shared shape for the status moves below. */
async function transition(
  projectId: string,
  actorId: string,
  status: Project["status"],
  event: ProjectEventType,
  note?: string
): Promise<Project> {
  const row = unwrap(
    await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId)
      .select("*")
      .single()
      .returns<ProjectRow>()
  )

  await recordEvent(projectId, actorId, event, note)
  return toProject(row)
}

/**
 * The party who answers an enquiry: whoever did not start it. Mirrors the
 * database trigger — kept in one place so the UI and the rule cannot disagree.
 */
export function enquiryResponderId(project: Project): string {
  return project.sourceJobId ? project.clientId : project.freelancerId
}

/** STORY-015: only the responder — enforced by the DB trigger. */
export const acceptProject = (projectId: string, actorId: string) =>
  transition(projectId, actorId, "active", "accepted")

export const declineProject = (
  projectId: string,
  actorId: string,
  note?: string
) => transition(projectId, actorId, "declined", "declined", note)

/** STORY-019: either actor, before completion. */
export const cancelProject = (
  projectId: string,
  actorId: string,
  note?: string
) => transition(projectId, actorId, "cancelled", "cancelled", note)

/** STORY-017: the client approves, completing the project and releasing funds. */
export const approveProject = (projectId: string, actorId: string) =>
  transition(projectId, actorId, "completed", "approved")

/** STORY-017: back to active, with the revision note on the timeline. */
export const requestRevision = (
  projectId: string,
  actorId: string,
  note: string
) => transition(projectId, actorId, "active", "revision_requested", note)

/**
 * STORY-017: submitting a deliverable both records it and moves the project to
 * delivered. Two writes, deliberately in this order — if the status update is
 * refused the evidence is still on the timeline, which is the safer failure.
 */
export async function submitDeliverable(
  projectId: string,
  actorId: string,
  note: string,
  images: string[] = []
): Promise<Project> {
  const { error } = await supabase.from("deliverables").insert({
    project_id: projectId,
    submitted_by: actorId,
    note: note.trim(),
    images,
  })

  if (error) throw new Error(describeError(error))

  return transition(projectId, actorId, "delivered", "delivered", note)
}

/**
 * STORY-018: escrow SIMULATION. Nothing is charged and no money moves — this
 * flips a flag so the interface can show a funds-held state. Release and return
 * are derived by the database trigger from the project's status.
 */
export async function fundProject(
  projectId: string,
  actorId: string
): Promise<Project> {
  const row = unwrap(
    await supabase
      .from("projects")
      .update({ payment_status: "held" })
      .eq("id", projectId)
      .select("*")
      .single()
      .returns<ProjectRow>()
  )

  await recordEvent(projectId, actorId, "funded")
  return toProject(row)
}
