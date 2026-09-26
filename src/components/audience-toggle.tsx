import * as React from "react"

import { cn } from "@/lib/utils"

export type Audience = "hire" | "work"

const OPTIONS: { value: Audience; label: string }[] = [
  { value: "hire", label: "Hire talent" },
  { value: "work", label: "Get hired" },
]

/**
 * Segmented control that switches the hero between its two audiences.
 *
 * Built as a radiogroup rather than two buttons so it behaves the way assistive
 * tech expects: arrow keys move between options, only the selected one is a tab
 * stop, and the selection is announced. The sliding indicator is a single
 * absolutely-positioned element rather than a background on each option, so it
 * animates between them instead of blinking.
 */
export function AudienceToggle({
  value,
  onChange,
  className,
}: {
  value: Audience
  onChange: (next: Audience) => void
  className?: string
}) {
  const index = OPTIONS.findIndex((option) => option.value === value)

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const next = event.key === "ArrowRight" ? index + 1 : index - 1
    onChange(OPTIONS[(next + OPTIONS.length) % OPTIONS.length].value)
  }

  return (
    <div
      role="radiogroup"
      aria-label="What brings you here"
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex rounded-full bg-muted p-1",
        className
      )}
    >
      {/* The travelling pill. aria-hidden: it is decoration, the state lives on
          the radio buttons themselves. */}
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{
          width: `calc((100% - 0.5rem) / ${OPTIONS.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />

      {OPTIONS.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex-1 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-colors",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
