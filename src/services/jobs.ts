import type { Job } from "@/interface/job"
import type { User } from "@/interface/user"
import type { JobRow, ProfileRow } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"
import { describeError, unwrap } from "@/services/errors"
import { toJob, toUser } from "@/services/mappers"

export interface JobFilters {
  /** "all" or undefined means no filter. */
  categoryId?: string
  industryId?: string
}

export interface JobListItem {
  job: Job
  client: User | null
}

const WITH_CLIENT = "*, client:profiles!jobs_client_id_fkey(*)"

type RowWithClient = JobRow & { client: ProfileRow | null }

function isFiltered(value?: string): value is string {
  return Boolean(value) && value !== "all"
}

function toListItem(row: RowWithClient): JobListItem {
  return { job: toJob(row), client: row.client ? toUser(row.client) : null }
}

/** FR-017: public job discovery, newest first. */
export async function listOpenJobs(
  filters: JobFilters = {}
): Promise<JobListItem[]> {
  let query = supabase.from("jobs").select(WITH_CLIENT).eq("status", "open")

  if (isFiltered(filters.categoryId)) {
    query = query.eq("category_id", filters.categoryId)
  }
  if (isFiltered(filters.industryId)) {
    query = query.eq("industry_id", filters.industryId)
  }

  const rows = unwrap(
    await query
      .order("published_at", { ascending: false })
      .order("id", { ascending: true })
      .returns<RowWithClient[]>()
  )

  return rows.map(toListItem)
}

export async function getJobById(id: string): Promise<JobListItem> {
  return toListItem(
    unwrap(
      await supabase
        .from("jobs")
        .select(WITH_CLIENT)
        .eq("id", id)
        .maybeSingle()
        .returns<RowWithClient>()
    )
  )
}

/** FR-018: the caller's own posts, closed ones included. */
export async function listJobsByClient(clientId: string): Promise<Job[]> {
  const rows = unwrap(
    await supabase
      .from("jobs")
      .select("*")
      .eq("client_id", clientId)
      .order("published_at", { ascending: false })
      .returns<JobRow[]>()
  )

  return rows.map(toJob)
}

export interface JobInput {
  title: string
  description: string
  categoryId?: string
  industryId?: string
  status?: "open" | "closed"
}

/** FR-016: post a job. Live immediately, no approval step. */
export async function createJob(
  clientId: string,
  input: JobInput
): Promise<Job> {
  return toJob(
    unwrap(
      await supabase
        .from("jobs")
        .insert({
          client_id: clientId,
          title: input.title.trim(),
          description: input.description.trim(),
          category_id: input.categoryId || null,
          industry_id: input.industryId || null,
          status: input.status ?? "open",
        })
        .select("*")
        .single()
        .returns<JobRow>()
    )
  )
}

/** FR-018: edit or close. Ownership enforced by RLS. */
export async function updateJob(
  id: string,
  input: Partial<JobInput>
): Promise<Job> {
  return toJob(
    unwrap(
      await supabase
        .from("jobs")
        .update({
          ...(input.title !== undefined && { title: input.title.trim() }),
          ...(input.description !== undefined && {
            description: input.description.trim(),
          }),
          ...(input.categoryId !== undefined && {
            category_id: input.categoryId || null,
          }),
          ...(input.industryId !== undefined && {
            industry_id: input.industryId || null,
          }),
          ...(input.status !== undefined && { status: input.status }),
        })
        .eq("id", id)
        .select("*")
        .single()
        .returns<JobRow>()
    )
  )
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id)
  if (error) throw new Error(describeError(error))
}
