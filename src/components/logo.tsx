import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 221 94"
      width="221"
      height="94"
      role="img"
      aria-label="Jes tae tver tv"
      className={cn("h-8 w-auto shrink-0 text-foreground", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M43 0H67V69A33.5 24.5 0 0 1 33.5 93.5A33.5 24.5 0 0 1 0 69V57.5H25V67.5A9 7.5 0 0 0 43 67.5Z"
      />
      <path fill="currentColor" d="M69 0H149V20H121V92H97V20H69Z" />
      <rect
        x="164"
        y="15"
        width="57"
        height="15.5"
        rx="4"
        fill="currentColor"
      />
      <rect x="164" y="42.5" width="57" height="15.5" rx="4" fill="#b8263b" />
      <rect x="164" y="70" width="57" height="15.5" rx="4" fill="#f2a6ae" />
    </svg>
  )
}
