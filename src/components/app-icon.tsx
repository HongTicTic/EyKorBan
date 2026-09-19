import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  /**
   * Corner radius for the squircle background.
   * Default is 115 on a 512x512 canvas (~22.5% iOS style).
   */
  radius?: number
  /**
   * Background gradient or color of the squircle container.
   */
  background?: string
}

/**
 * EyKorBan App Icon Component
 * Modern rounded squircle app icon featuring the EyKorBan hexagonal E-K emblem
 * with crimson rose, coral flame, and platinum accents.
 */
export function AppIcon({
  className,
  radius = 115,
  background,
  ...props
}: AppIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      className={cn("inline-block size-12 shrink-0 drop-shadow-md", className)}
      role="img"
      aria-label="EyKorBan App Icon"
      {...props}
    >
      <defs>
        {/* Dark Obsidian Squircle Gradient */}
        <linearGradient id="app-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0C12" />
          <stop offset="50%" stopColor="#12131D" />
          <stop offset="100%" stopColor="#06070A" />
        </linearGradient>

        {/* Crimson Rose Gradient (Primary) */}
        <linearGradient id="app-icon-rose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="60%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        {/* Coral Fire Gradient (Accent) */}
        <linearGradient id="app-icon-coral" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#FFA4B2" />
        </linearGradient>

        {/* Platinum Gradient */}
        <linearGradient id="app-icon-platinum" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Center Ambient Glow */}
        <radialGradient id="app-icon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E11D48" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#FB7185" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </radialGradient>

        {/* Dynamic Drop Shadow */}
        <filter id="app-icon-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.65" />
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#E11D48" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* iOS / Modern Squircle Container */}
      <rect
        width="512"
        height="512"
        rx={radius}
        fill={background ? background : "url(#app-icon-bg)"}
      />
      <rect
        width="508"
        height="508"
        x="2"
        y="2"
        rx={radius - 2}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
      />

      {/* Ambient Light Center */}
      <circle cx="256" cy="256" r="205" fill="url(#app-icon-glow)" />

      {/* Hexagonal Prism Emblem */}
      <g filter="url(#app-icon-shadow)">
        {/* ==================== LEFT: LETTER 'E' ==================== */}
        <path
          d="M 244 126 L 142 185 C 134 190 130 198 130 207 L 130 305 C 130 314 134 322 142 327 L 244 386 C 248 388 252 385 252 380 L 252 344 C 252 340 249 337 245 335 L 172 293 C 166 289 164 284 164 277 L 164 235 C 164 228 166 223 172 219 L 245 177 C 249 175 252 172 252 168 L 252 132 C 252 127 248 124 244 126 Z"
          fill="url(#app-icon-rose)"
        />

        {/* E Center Modern Floating Prong */}
        <path
          d="M 166 242 L 245 242 C 249 242 252 245 252 249 L 252 263 C 252 267 249 270 245 270 L 166 270 C 162 270 160 267 160 263 L 160 249 C 160 245 162 242 166 242 Z"
          fill="url(#app-icon-platinum)"
        />

        {/* ==================== RIGHT: LETTER 'K' ==================== */}
        {/* K Vertical Spine */}
        <path
          d="M 264 132 C 264 127 268 124 273 125 L 291 135 C 295 137 298 141 298 146 L 298 366 C 298 371 295 375 291 377 L 273 387 C 268 388 264 385 264 380 Z"
          fill="url(#app-icon-platinum)"
        />

        {/* K Upper Diagonal Arm */}
        <path
          d="M 298 238 L 370 185 C 378 180 382 188 382 196 L 382 228 C 382 233 379 238 374 241 L 332 265 L 302 248 Z"
          fill="url(#app-icon-coral)"
        />

        {/* K Lower Diagonal Arm */}
        <path
          d="M 302 264 L 332 247 L 374 271 C 379 274 382 279 382 284 L 382 316 C 382 324 378 332 370 327 L 298 274 Z"
          fill="url(#app-icon-rose)"
        />

        {/* K Dynamic Forward Chevron / Velocity Arrow */}
        <path
          d="M 334 256 L 372 232 C 376 229 380 232 380 236 L 380 245 L 396 254 C 399 256 399 258 396 260 L 380 269 L 380 278 C 380 282 376 285 372 282 L 334 258 C 331 257 331 255 334 256 Z"
          fill="url(#app-icon-platinum)"
          opacity="0.95"
        />

        {/* Glowing Accent Spark */}
        <circle cx="410" cy="256" r="3.5" fill="#FB7185" />
      </g>
    </svg>
  )
}

export default AppIcon
