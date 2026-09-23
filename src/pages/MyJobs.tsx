import { useState } from "react"
import { Link } from "react-router"
import {
  AlertTriangle,
  Briefcase,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import { getCategoryName } from "@/interface/category"
import type { Job } from "@/interface/job"
import { cn } from "@/lib/utils"
import { deleteJob, listJobsByClient, updateJob } from "@/services/jobs"

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "Recently"
  }
}

/** FR-018: a client manages their own posts, open and closed. */
const MyJobs = () => {
  const { user } = useAuth()
  const clientId = user?.userId ?? null
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, error, isLoading, refetch } = useAsyncData(
    () => (clientId ? listJobsByClient(clientId) : Promise.resolve([])),
    [clientId]
  )

  const jobs = data ?? []
  const open = jobs.filter((job) => job.status === "open").length

  async function run(id: string, action: () => Promise<unknown>) {
    if (busyId) return
    setBusyId(id)
    setActionError(null)

    try {
      await action()
      refetch()
    } catch (caught) {
      setActionError(
        caught instanceof Error ? caught.message : "That did not work."
      )
    } finally {
      setBusyId(null)
    }
  }

  function renderRow(job: Job) {
    const isOpen = job.status === "open"

    return (
      <li
        key={job.id}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-start"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-sm font-semibold">{job.title}</h2>
            <Badge variant={isOpen ? "secondary" : "outline"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {job.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {getCategoryName(job.categoryId)} · Posted{" "}
            {formatDate(job.publishedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={busyId === job.id}
            onClick={() =>
              run(job.id, () =>
                updateJob(job.id, { status: isOpen ? "closed" : "open" })
              )
            }
          >
            {isOpen ? "Close" : "Reopen"}
          </Button>
          <Link
            to={`/jobs/${job.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
          <Button
            variant="ghost"
            size="sm"
            disabled={busyId === job.id}
            onClick={() => {
              if (
                !window.confirm(`Delete “${job.title}”? This cannot be undone.`)
              ) {
                return
              }
              run(job.id, () => deleteJob(job.id))
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 data-icon="inline-start" />
            Delete
          </Button>
        </div>
      </li>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My jobs
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <Spinner className="size-3" />
                Loading your jobs…
              </>
            ) : (
              <>
                {jobs.length} {jobs.length === 1 ? "post" : "posts"}
                {jobs.length > 0 && ` · ${open} open`}
              </>
            )}
          </p>
        </div>

        <Link to="/jobs/new" className={cn(buttonVariants())}>
          <PlusCircle data-icon="inline-start" />
          Post a job
        </Link>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {actionError}
        </p>
      )}

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load your jobs"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-muted"
              aria-hidden
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="You have not posted a job yet"
          description="Open jobs appear on the Find Work page for freelancers to browse."
          action={
            <Link to="/jobs/new" className={cn(buttonVariants())}>
              Post your first job
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">{jobs.map(renderRow)}</ul>
      )}
    </div>
  )
}

export default MyJobs
