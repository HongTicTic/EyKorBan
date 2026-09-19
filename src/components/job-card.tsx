import { ArrowUpRight, Calendar } from "lucide-react"

import { DEFAULT_INDUSTRY_OPTIONS } from "@/components/dropdown"
import { Badge } from "@/components/ui/badge"
import { getCategoryName } from "@/interface/category"
import type { Job } from "@/interface/job"
import { formatDate } from "@/lib/format"

function getIndustryName(industryId: string) {
  return (
    DEFAULT_INDUSTRY_OPTIONS.find((option) => option.value === industryId)
      ?.label ?? industryId
  )
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xs transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          {job.title}
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
        <a
          href="/login"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline dark:text-rose-400"
        >
          Respond
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </article>
  )
}
