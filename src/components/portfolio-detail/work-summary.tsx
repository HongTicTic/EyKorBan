import { Calendar, Eye, Heart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getCategoryName } from "@/interface/category"
import type { ProjectCard } from "@/interface/projectCard"
import { formatDate } from "@/lib/format"

interface WorkSummaryProps {
  work: ProjectCard
  /** Passed in rather than read from `work`: it includes the viewer's save. */
  saveCount: number
}

/** Category, title and the date / saves / views line. */
export function WorkSummary({ work, saveCount }: WorkSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className="rounded-md border border-primary/20 bg-primary/10 text-xs font-medium text-primary hover:bg-primary/15">
          {getCategoryName(work.categoryId)}
        </Badge>
        <Badge
          variant="secondary"
          className="rounded-md bg-secondary text-xs font-normal text-secondary-foreground"
        >
          {work.subtitle}
        </Badge>
      </div>

      <h1 className="text-xl leading-snug font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
        {work.title}
      </h1>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3" />
          <span>{formatDate(work.publishedAt)}</span>
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3" />
          <span>{saveCount.toLocaleString()} saves</span>
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3" />
          <span>{work.viewCount.toLocaleString()} views</span>
        </span>
      </div>
    </div>
  )
}
