import { useState } from "react"
import { Link, useParams } from "react-router"
import {
  AlertTriangle,
  Ban,
  Check,
  CircleDot,
  Lock,
  RotateCcw,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { CostBreakdown } from "@/components/cost-breakdown"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useAsyncData } from "@/hooks/use-async-data"
import {
  PAYMENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  type ProjectEvent,
  type ProjectEventType,
} from "@/interface/project"
import { money } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  acceptProject,
  approveProject,
  cancelProject,
  declineProject,
  fundProject,
  getProject,
  requestRevision,
  submitDeliverable,
} from "@/services/projects"

const EVENT_COPY: Record<ProjectEventType, string> = {
  created: "started this project",
  accepted: "accepted the enquiry",
  declined: "declined the enquiry",
  funded: "funded the project",
  delivered: "submitted a deliverable",
  revision_requested: "requested a revision",
  approved: "approved the work",
  released: "released the funds",
  completed: "completed the project",
  cancelled: "cancelled the project",
}

function TimelineRow({
  event,
  actorName,
}: {
  event: ProjectEvent
  actorName: string
}) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <CircleDot className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        <span className="mt-1 w-px flex-1 bg-border" />
      </div>
      <div className="pb-5">
        <p className="text-sm">
          <span className="font-medium">{actorName}</span>{" "}
          {EVENT_COPY[event.type]}
        </p>
        {event.note && (
          <p className="mt-1 rounded-lg bg-muted/60 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
            {event.note}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(event.createdAt).toLocaleString()}
        </p>
      </div>
    </li>
  )
}

/**
 * STORY-015 · 016 · 017 · 018 · 019 on one page.
 *
 * Which buttons appear is derived from (status × viewer). That is a
 * convenience: the database trigger rejects an illegal move regardless, so a
 * forged request fails even though no button was rendered for it.
 */
const ProjectDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [note, setNote] = useState("")

  const { data, error, isLoading, refetch } = useAsyncData(
    () => (id ? getProject(id) : Promise.resolve(null)),
    [id]
  )

  async function run(key: string, action: () => Promise<unknown>) {
    if (busy) return
    setBusy(key)
    setActionError(null)

    try {
      await action()
      setNote("")
      refetch()
    } catch (caught) {
      setActionError(
        caught instanceof Error ? caught.message : "That did not work."
      )
    } finally {
      setBusy(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Could not load this project"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  // AC-4: a non-member gets this, not someone else's project. RLS is what
  // actually returns nothing; this only renders the outcome.
  if (!data || !user) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={Lock}
          title="Project not found"
          description="This project does not exist, or you are not one of the two people involved in it."
          action={
            <Link
              to="/projects"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to projects
            </Link>
          }
        />
      </div>
    )
  }

  const { project, client, freelancer, events, deliverables } = data
  const isClient = user.userId === project.clientId
  const isFreelancer = user.userId === project.freelancerId
  const nameFor = (actorId?: string) =>
    actorId === project.clientId
      ? (client?.name ?? "The client")
      : actorId === project.freelancerId
        ? (freelancer?.name ?? "The freelancer")
        : "Someone"

  const canCancel =
    ["enquiry", "active", "delivered"].includes(project.status) && !busy

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {project.title}
            </h1>
            <Badge variant="secondary">
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {client?.name ?? "Client"} and {freelancer?.name ?? "Freelancer"}
            {project.deadline && ` · due ${new Date(project.deadline).toLocaleDateString()}`}
            {" · from "}
            <Link
              to={
                project.sourceJobId
                  ? "/find-work"
                  : `/work/${project.sourcePortfolioItemId}`
              }
              className="text-primary hover:underline dark:text-rose-400"
            >
              {project.sourceJobId ? "a job post" : "a portfolio item"}
            </Link>
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums">
            {money(project.budget, project.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            {PAYMENT_STATUS_LABELS[project.paymentStatus]}
          </p>
        </div>
      </div>

      {project.paymentStatus === "held" && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="size-4 shrink-0" />
          Funds are held by the platform and released when the client approves.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Scope</h2>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {project.scope}
        </p>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {actionError}
        </p>
      )}

      {/* ── State-appropriate actions (FR-023 AC-3) ───────────────────── */}

      {/* STORY-015: only the addressed freelancer responds. */}
      {project.status === "enquiry" && isFreelancer && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Respond to this enquiry</h2>
          <Textarea
            className="mt-3"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional note if you are declining…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              disabled={Boolean(busy)}
              onClick={() => run("accept", () => acceptProject(project.id, user.userId))}
            >
              {busy === "accept" ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />}
              Accept
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(busy)}
              onClick={() => run("decline", () => declineProject(project.id, user.userId, note))}
            >
              Decline
            </Button>
          </div>
        </div>
      )}

      {project.status === "enquiry" && isClient && (
        <p className="mt-6 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          Waiting for {freelancer?.name ?? "the freelancer"} to accept.
        </p>
      )}

      {/* STORY-018: funding is the client's, from active onward. */}
      {isClient &&
        project.paymentStatus === "unfunded" &&
        ["active", "delivered"].includes(project.status) && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Fund this project</h2>
            <CostBreakdown
              className="mt-3"
              budget={project.budget}
              currency={project.currency}
              title="Cost breakdown"
            />
            <Button
              className="mt-4"
              disabled={Boolean(busy)}
              onClick={() => run("fund", () => fundProject(project.id, user.userId))}
            >
              {busy === "fund" ? <Spinner data-icon="inline-start" /> : <Wallet data-icon="inline-start" />}
              Fund {money(project.clientTotal, project.currency)}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Simulated — no payment is taken and no card is charged.
            </p>
          </div>
        )}

      {/* STORY-017: the freelancer delivers from active. */}
      {project.status === "active" && isFreelancer && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Submit a deliverable</h2>
          <Textarea
            className="mt-3"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What you are handing over, and anything the client should look at first."
          />
          <Button
            className="mt-3"
            disabled={Boolean(busy) || !note.trim()}
            onClick={() =>
              run("deliver", () => submitDeliverable(project.id, user.userId, note))
            }
          >
            {busy === "deliver" ? <Spinner data-icon="inline-start" /> : <Send data-icon="inline-start" />}
            Submit
          </Button>
        </div>
      )}

      {/* STORY-017: the client approves or sends it back. */}
      {project.status === "delivered" && isClient && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Review the delivery</h2>
          <Textarea
            className="mt-3"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What needs changing, if you are asking for a revision…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              disabled={Boolean(busy)}
              onClick={() => run("approve", () => approveProject(project.id, user.userId))}
            >
              {busy === "approve" ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />}
              Approve{project.paymentStatus === "held" && " and release"}
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(busy) || !note.trim()}
              onClick={() =>
                run("revise", () => requestRevision(project.id, user.userId, note))
              }
            >
              <RotateCcw data-icon="inline-start" />
              Request a revision
            </Button>
          </div>
        </div>
      )}

      {project.status === "completed" && (
        <div className="mt-6">
          <CostBreakdown
            budget={project.budget}
            currency={project.currency}
            title="Receipt"
          />
        </div>
      )}

      {/* ── Deliverables ──────────────────────────────────────────────── */}

      {deliverables.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">Deliverables</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {deliverables.map((deliverable) => (
              <li
                key={deliverable.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {deliverable.note}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {nameFor(deliverable.submittedBy)} ·{" "}
                  {new Date(deliverable.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Timeline (FR-023 AC-2) ────────────────────────────────────── */}

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
        <ul className="mt-4">
          {events.map((event) => (
            <TimelineRow
              key={event.id}
              event={event}
              actorName={nameFor(event.actorId)}
            />
          ))}
        </ul>
      </div>

      {/* STORY-019: either actor, before completion, with confirmation. */}
      {canCancel && (
        <div className="mt-6 border-t border-border pt-6">
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              if (!window.confirm("Cancel this project? This cannot be undone.")) {
                return
              }
              run("cancel", () => cancelProject(project.id, user.userId, note))
            }}
          >
            <Ban data-icon="inline-start" />
            Cancel project
          </Button>
          {project.paymentStatus === "held" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Held funds are returned to the client.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
