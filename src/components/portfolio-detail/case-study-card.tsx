import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CaseStudyMetric {
  value: string
  label: string
  /** Shows the value in the brand colour. */
  accent?: boolean
  /** Shows the value as a star rating. */
  rating?: boolean
}

export interface CaseStudy {
  duration: string
  heading: string
  summary: string
  deliverables: { title: string; description: string }[]
  metrics: CaseStudyMetric[]
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="space-y-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xs sm:p-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-bold tracking-wide text-primary uppercase">
            CASE STUDY BRIEF
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium text-muted-foreground">
            Completed in {caseStudy.duration}
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[26px] dark:text-neutral-100">
          {caseStudy.heading}
        </h2>

        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {caseStudy.summary}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          CORE DELIVERABLES
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {caseStudy.deliverables.map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border/70 pt-6 text-center">
        {caseStudy.metrics.map((metric) => (
          <div key={metric.label} className="px-2 sm:px-4">
            <div
              className={cn(
                "text-2xl font-bold tracking-tight sm:text-3xl",
                metric.accent ? "text-primary" : "text-foreground",
                metric.rating && "flex items-center justify-center gap-1"
              )}
            >
              {metric.rating ? (
                <>
                  <span>{metric.value}</span>
                  <Star className="inline size-4.5 fill-amber-500 text-amber-500" />
                </>
              ) : (
                metric.value
              )}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
