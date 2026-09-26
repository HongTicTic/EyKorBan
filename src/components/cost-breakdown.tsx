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
  viewer = "client",
  className,
}: {
  budget: number
  currency?: string
  title?: string
  /** Whose side the wording is written from. The numbers never change. */
  viewer?: "client" | "freelancer"
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
          <dt>{viewer === "client" ? "You pay" : "Client pays"}</dt>
          <dd className="tabular-nums">{money(total, currency)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {viewer === "client" ? (
          <>
            The freelancer receives {money(budget, currency)}. Funds are held by
            the platform and released when you approve the work.
          </>
        ) : (
          <>
            You receive the full {money(budget, currency)} — the client covers
            the fee. Funds are held by the platform and released to you when
            the client approves.
          </>
        )}
      </p>
    </div>
  )
}
