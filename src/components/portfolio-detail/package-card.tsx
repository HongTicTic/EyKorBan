import { Link } from "react-router"
import { ArrowRight, Shield } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface WorkPackage {
  price: string
  timeline: string
  deliverables: string
  contractModel: string
}

interface PackageCardProps {
  workId: string
  offer: WorkPackage
}

/** The fixed-scope offer and the way into a project. */
export function PackageCard({ workId, offer }: PackageCardProps) {
  return (
    <div className="relative space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xs">
      <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-xs font-medium text-muted-foreground">
          Fixed-scope package
        </span>
        <div className="text-right">
          <span className="text-2xl font-bold tracking-tight text-primary">
            {offer.price}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated timeline</span>
          <span className="font-medium text-foreground">{offer.timeline}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Deliverables</span>
          <span className="font-medium text-foreground">
            {offer.deliverables}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Contract model</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            <Shield className="size-3 fill-primary/20 text-primary" />
            <span>{offer.contractModel}</span>
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {/* STORY-004: the CTA is an entry point into STORY-014, not a dialog
            that collects details and drops them. */}
        <Link
          to={`/start-project/work/${workId}`}
          className={cn(
            buttonVariants(),
            "h-10.5 w-full cursor-pointer gap-1.5 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-[0.99]"
          )}
        >
          <span>Start a project</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
