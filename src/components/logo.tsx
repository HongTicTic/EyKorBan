import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  /**
   * When true (default), the black elements adapt to current text color (`currentColor`),
   * automatically supporting light and dark themes.
   * If false, forces solid black (#0A0A0A).
   */
  adaptive?: boolean
  /**
   * If true, renders only the 3 brand accent bars without the JT letters.
   */
  iconOnly?: boolean
}

/**
 * JT Brand Logo Component
 * - Bold geometric "JT" wordmark with the signature 3 horizontal accent bars:
 *   - Top bar: Black / Theme Adaptive
 *   - Middle bar: Crimson (#C70036)
 *   - Bottom bar: Pastel Pink (#FFA0AD)
 */
export function Logo({
  className,
  adaptive = true,
  iconOnly = false,
  ...props
}: LogoProps) {
  const primaryFill = adaptive ? "currentColor" : "#0A0A0A"

  if (iconOnly) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 138 171"
        fill="none"
        className={cn("inline-block h-8 w-auto text-foreground", className)}
        role="img"
        aria-label="JT Accent Bars"
        {...props}
      >
        <rect width="138" height="38" rx="19" fill={primaryFill} />
        <rect y="66" width="138" height="38" rx="19" fill="#C70036" />
        <rect y="133" width="138" height="38" rx="19" fill="#FFA0AD" />
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 536 227"
      fill="none"
      className={cn("inline-block h-8 w-auto text-foreground", className)}
      role="img"
      aria-label="JT Logo"
      {...props}
    >
      {/* Letter J */}
      <path
        d="M 103 0 L 103 155 L 102 163 L 101 167 L 100 169 L 98 172 L 94 176 L 92 177 L 90 178 L 87 179 L 76 179 L 73 178 L 71 177 L 69 176 L 63 170 L 62 168 L 61 165 L 60 161 L 60 139 L 0 139 L 0 170 L 1 174 L 2 178 L 3 181 L 4 184 L 6 189 L 7 191 L 10 196 L 13 200 L 23 210 L 27 213 L 32 216 L 38 219 L 46 222 L 50 223 L 54 224 L 59 225 L 66 226 L 97 226 L 103 225 L 109 224 L 116 222 L 119 221 L 124 219 L 130 216 L 135 213 L 139 210 L 148 201 L 151 197 L 154 192 L 155 190 L 156 188 L 158 183 L 159 180 L 160 177 L 161 172 L 162 166 L 162 0 Z"
        fill={primaryFill}
      />
      {/* Letter T */}
      <path
        d="M 167 0 H 362 V 49 H 295 V 224 H 234 V 49 H 167 Z"
        fill={primaryFill}
      />
      {/* Three horizontal accent bars */}
      <rect
        x="398"
        y="37"
        width="138"
        height="38"
        rx="19"
        fill={primaryFill}
      />
      <rect
        x="398"
        y="103"
        width="138"
        height="38"
        rx="19"
        fill="#C70036"
      />
      <rect
        x="398"
        y="170"
        width="138"
        height="38"
        rx="19"
        fill="#FFA0AD"
      />
    </svg>
  )
}

export default Logo
