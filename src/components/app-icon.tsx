import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function AppIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="100"
      height="100"
      role="img"
      aria-label="Jes tae tver tv"
      className={cn("size-12 shrink-0", className)}
      {...props}
    >
      <rect width="100" height="100" rx="22" className="fill-background" />
      <rect
        x="26"
        y="22.5"
        width="48"
        height="11.5"
        rx="3"
        className="fill-foreground"
      />
      <rect x="26" y="44.25" width="48" height="11.5" rx="3" fill="#eb3d5a" />
      <rect x="26" y="66" width="48" height="11.5" rx="3" fill="#f2a6ae" />
    </svg>
  )
}
