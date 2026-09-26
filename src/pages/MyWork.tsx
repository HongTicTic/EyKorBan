import { useState } from "react"
import { Link } from "react-router"
import {
  AlertTriangle,
  Eye,
  FolderOpen,
  Heart,
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
import type { ProjectCard } from "@/interface/projectCard"
import { getCategoryName } from "@/interface/category"
import { formatCompact } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  deleteWork,
  listWorkByFreelancer,
  updateWork,
} from "@/services/portfolio"

/**
 * FR-011: the freelancer's own work, drafts included. RLS is what actually
 * scopes this to the signed-in user — the freelancerId below only shapes the
 * query.
 */
function WorkRow({
  work,
  busy,
  onPublishToggle,
  onDelete,
}: {
  work: ProjectCard
  busy: boolean
  onPublishToggle: () => void
  onDelete: () => void
}) {
  const isDraft = work.status === "draft"

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
        {work.coverImageUrl && (
          <img
            src={work.coverImageUrl}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-sm font-semibold">{work.title}</h2>
          <Badge variant={isDraft ? "outline" : "secondary"}>
            {isDraft ? "Draft" : "Published"}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {work.subtitle || getCategoryName(work.categoryId) || "No subtitle"}
        </p>
        {!isDraft && (
          <p className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {formatCompact(work.likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatCompact(work.viewCount)}
            </span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={onPublishToggle}
        >
          {isDraft ? "Publish" : "Unpublish"}
        </Button>
        <Link
          to={`/work/${work.id}/edit`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Pencil data-icon="inline-start" />
          Edit
        </Link>
        <Button
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
      </div>
    </li>
  )
}

const MyWork = () => {
  const { user } = useAuth()
  const freelancerId = user?.userId ?? null
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, error, isLoading, refetch } = useAsyncData(
    () => (freelancerId ? listWorkByFreelancer(freelancerId) : Promise.resolve([])),
    [freelancerId]
  )

  const works = data ?? []
  const drafts = works.filter((work) => work.status === "draft").length

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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My work
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <Spinner className="size-3" />
                Loading your work…
              </>
            ) : (
              <>
                {works.length} {works.length === 1 ? "item" : "items"}
                {drafts > 0 && ` · ${drafts} draft${drafts === 1 ? "" : "s"}`}
              </>
            )}
          </p>
        </div>

        <Link to="/work/new" className={cn(buttonVariants())}>
          <PlusCircle data-icon="inline-start" />
          New work
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
          title="Could not load your work"
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
      ) : works.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="You have not added any work yet"
          description="Published work appears in the public catalogue and on your profile."
          action={
            <Link to="/work/new" className={cn(buttonVariants())}>
              Add your first project
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {works.map((work) => (
            <WorkRow
              key={work.id}
              work={work}
              busy={busyId === work.id}
              onPublishToggle={() =>
                run(work.id, () =>
                  updateWork(work.id, {
                    status: work.status === "draft" ? "published" : "draft",
                  })
                )
              }
              onDelete={() => {
                if (
                  !window.confirm(
                    `Delete “${work.title}”? This cannot be undone.`
                  )
                ) {
                  return
                }
                run(work.id, () => deleteWork(work.id))
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyWork
