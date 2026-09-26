import { Link } from "react-router"
import { AlertTriangle, FolderKanban } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAsyncData } from "@/hooks/use-async-data"
import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from "@/interface/project"
import { money } from "@/lib/format"
import { cn } from "@/lib/utils"
import { listMyProjects } from "@/services/projects"

const STATUS_STYLES: Record<ProjectStatus, string> = {
  enquiry: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  active: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  delivered: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
  declined: "bg-muted text-muted-foreground",
}

function relativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return days < 30 ? `${days}d ago` : new Date(value).toLocaleDateString()
}

/**
 * STORY-016: the dashboard.
 *
 * No ownership filter is applied in this file. RLS returns only the projects
 * the signed-in actor is party to, so "list all projects" already means
 * "list mine" — AC-1 enforced by the database, not by a query condition
 * someone could forget.
 */
const Projects = () => {
  const { user } = useAuth()
  const { data, error, isLoading, refetch } = useAsyncData(
    () => (user ? listMyProjects() : Promise.resolve([])),
    [user?.userId]
  )

  const projects = data ?? []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          {isLoading ? (
            <>
              <Spinner className="size-3" />
              Loading your projects…
            </>
          ) : (
            <>
              {projects.length}{" "}
              {projects.length === 1 ? "engagement" : "engagements"} · most
              recent first
            </>
          )}
        </p>
      </div>

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load your projects"
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
              className="h-24 animate-pulse rounded-2xl bg-muted"
              aria-hidden
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* AC-5: the empty state points back at discovery. */
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Projects start from a piece of work you like, or from a job you respond to."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/" className={cn(buttonVariants())}>
                Browse work
              </Link>
              <Link
                to="/find-work"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Find jobs
              </Link>
            </div>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map(({ project, client, freelancer }) => {
            // AC-1: each row names the counterpart, not the viewer.
            const counterpart =
              user?.userId === project.clientId ? freelancer : client

            return (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-semibold">
                        {project.title}
                      </h2>
                      <Badge
                        variant="secondary"
                        className={STATUS_STYLES[project.status]}
                      >
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                      {project.paymentStatus === "held" && (
                        <Badge variant="outline">Funds held</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      With {counterpart?.name ?? "Unknown"} ·{" "}
                      {relativeTime(project.lastActivityAt)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    {money(project.budget, project.currency)}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Projects
