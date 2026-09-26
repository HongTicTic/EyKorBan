import { costBreakdown, PLATFORM_FEE_RATE } from "@/interface/project"
import { money } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * NFR-008 / STORY-014 AC-2: the fee is itemised before anything is committed,
 * never folded into a single total. The same component renders the live preview
 * while the client types and the receipt after completion, so the numbers they
 * agreed to are the numbers they are shown later.
 */
export function CostBreakdown({
  budget,
  currency = "USD",
  title = "Cost breakdown",
  className,
}: {
  budget: number
  currency?: string
  title?: string
  className?: string
}) {
  const { fee, total } = costBreakdown(budget)

  return (
    <div className={cn("rounded-xl border border-border bg-muted/40 p-4", className)}>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </p>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Project budget</dt>
          <dd className="tabular-nums">{money(budget, currency)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            Platform fee ({PLATFORM_FEE_RATE * 100}%)
          </dt>
          <dd className="tabular-nums">{money(fee, currency)}</dd>
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-border pt-2 font-semibold">
          <dt>You pay</dt>
          <dd className="tabular-nums">{money(total, currency)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        The freelancer receives {money(budget, currency)}. Funds are held by the
        platform and released when you approve the work.
      </p>
    </div>
  )
}
