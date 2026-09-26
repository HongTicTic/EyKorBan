import { Link } from "react-router"
import { ArrowUpRight, Calendar } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { DEFAULT_INDUSTRY_OPTIONS } from "@/components/dropdown"
import { Badge } from "@/components/ui/badge"
import { getCategoryName } from "@/interface/category"
import type { Job } from "@/interface/job"
import { RoleName } from "@/interface/user"
import { formatDate } from "@/lib/format"

function getIndustryName(industryId: string) {
  return (
    DEFAULT_INDUSTRY_OPTIONS.find((option) => option.value === industryId)
      ?.label ?? industryId
  )
}

/**
 * The whole card opens the job (the title's ::after stretches over it — the
 * accessible "block link" pattern, so there is one link in the tab order, not
 * a clickable <article>). The action on the right is role-aware, and sits
 * above the overlay so it stays independently clickable.
 */
export function JobCard({ job }: { job: Job }) {
  const { user } = useAuth()
  const isOwner = user?.userId === job.clientId

  // STORY-012: freelancers respond. Signed-out visitors get the same link —
  // RequireAuth sends them to sign in and back into the flow (AC-2).
  const action = isOwner
    ? { label: "Manage", href: `/jobs/${job.id}/edit` }
    : user?.role === RoleName.CLIENT
      ? null
      : { label: "Respond", href: `/start-project/job/${job.id}` }

  return (
    <article className="group relative rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xs transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          <Link
            to={`/jobs/${job.id}`}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
          >
            {job.title}
          </Link>
        </h3>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:pt-1">
          <Calendar className="size-3.5" />
          {formatDate(job.publishedAt)}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            {getCategoryName(job.categoryId)}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {getIndustryName(job.industryId)}
          </Badge>
        </div>

        {action && (
          <Link
            to={action.href}
            className="relative z-10 flex items-center gap-1 text-sm font-medium text-primary hover:underline dark:text-rose-400"
          >
            {action.label}
            <ArrowUpRight className="size-4" />
          </Link>
        )}
      </div>
    </article>
  )
}
