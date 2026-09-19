import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  /**
   * Corner radius for the squircle background.
   * Default is 49 on a 219x219 viewBox (~22.5% iOS style).
   */
  radius?: number
  /**
   * Background color of the squircle container.
   * Default is "#0A0A0A".
   */
  background?: string
}

/**
 * JT App Icon Component
 * iOS / Modern rounded squircle app icon featuring the 3 brand accent bars:
 * - Top Bar: White (#FFFFFF)
 * - Middle Bar: Vibrant Crimson (#FF1F57)
 * - Bottom Bar: Pastel Pink (#FFA0AD)
 */
export function AppIcon({
  className,
  radius = 49,
  background = "#0A0A0A",
  ...props
}: AppIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 219 219"
      fill="none"
      className={cn("inline-block size-12 shrink-0 drop-shadow-md", className)}
      role="img"
      aria-label="App Icon"
      {...props}
    >
      {/* Squircle container */}
      <rect width="219" height="219" rx={radius} fill={background} />

      {/* Top Bar (White) */}
      <rect x="57" y="49" width="105" height="27" rx="13.5" fill="#FFFFFF" />

      {/* Middle Bar (Vibrant Crimson) */}
      <rect x="57" y="96" width="105" height="27" rx="13.5" fill="#FF1F57" />

      {/* Bottom Bar (Pastel Pink) */}
      <rect x="57" y="143" width="105" height="27" rx="13.5" fill="#FFA0AD" />
    </svg>
  )
}

export default AppIcon
