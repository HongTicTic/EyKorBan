import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  /**
   * If true, renders only the geometric EKB hexagonal emblem without the wordmark.
   */
  iconOnly?: boolean
  /**
   * When true, neutral elements automatically adapt using `currentColor`.
   */
  adaptive?: boolean
}

/**
 * EyKorBan Brand Logo Component
 * - Features the iconic hexagonal E-K geometric emblem.
 * - Bold modern wordmark with crimson/rose brand accent on "Ban".
 * - Fully responsive and adaptive to light and dark themes.
 */
export function Logo({
  className,
  iconOnly = false,
  adaptive = true,
  ...props
}: LogoProps) {
  const neutralFill = adaptive ? "currentColor" : "#0F172A"

  if (iconOnly) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 280 280"
        fill="none"
        className={cn("inline-block size-8 text-foreground", className)}
        role="img"
        aria-label="EyKorBan Emblem"
        {...props}
      >
        <defs>
          <linearGradient id="ekb-icon-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF385C" />
            <stop offset="60%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="ekb-icon-coral" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="50%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#FFA4B2" />
          </linearGradient>
          <filter id="ekb-icon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E11D48" floodOpacity="0.25" />
          </filter>
        </defs>

        <g transform="translate(10, 5) scale(0.9)" filter="url(#ekb-icon-glow)">
          {/* E Ribbon */}
          <path
            d="M 132 10 L 30 69 C 22 74 18 82 18 91 L 18 189 C 18 198 22 206 30 211 L 132 270 C 136 272 140 269 140 264 L 140 228 C 140 224 137 221 133 219 L 60 177 C 54 173 52 168 52 161 L 52 119 C 52 112 54 107 60 103 L 133 61 C 137 59 140 56 140 52 L 140 16 C 140 11 136 8 132 10 Z"
            fill="url(#ekb-icon-rose)"
          />
          {/* E Center Prong */}
          <path
            d="M 54 126 L 133 126 C 137 126 140 129 140 133 L 140 147 C 140 151 137 154 133 154 L 54 154 C 50 154 48 151 48 147 L 48 133 C 48 129 50 126 54 126 Z"
            fill={neutralFill}
          />
          {/* K Spine */}
          <path
            d="M 152 16 C 152 11 156 8 161 9 L 179 19 C 183 21 186 25 186 30 L 186 250 C 186 255 183 259 179 261 L 161 271 C 156 272 152 269 152 264 Z"
            fill={neutralFill}
          />
          {/* K Upper Diagonal */}
          <path
            d="M 186 122 L 258 69 C 266 64 270 72 270 80 L 270 112 C 270 117 267 122 262 125 L 220 149 L 190 132 Z"
            fill="url(#ekb-icon-coral)"
          />
          {/* K Lower Diagonal */}
          <path
            d="M 190 148 L 220 131 L 262 155 C 267 158 270 163 270 168 L 270 200 C 270 208 266 216 258 211 L 186 158 Z"
            fill="url(#ekb-icon-rose)"
          />
          {/* K Velocity Arrow */}
          <path
            d="M 222 140 L 260 116 C 264 113 268 116 268 120 L 268 129 L 284 138 C 287 140 287 142 284 144 L 268 153 L 268 162 C 268 166 264 169 260 166 L 222 142 C 219 141 219 139 222 140 Z"
            fill={neutralFill}
            opacity="0.9"
          />
          <circle cx="298" cy="140" r="3.5" fill="#FB7185" />
        </g>
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 540 140"
      fill="none"
      className={cn("inline-block h-9 w-auto text-foreground", className)}
      role="img"
      aria-label="EyKorBan Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logo-comp-rose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="60%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        <linearGradient id="logo-comp-coral" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#FFA4B2" />
        </linearGradient>

        <filter id="logo-comp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E11D48" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Hexagonal E-K Emblem */}
      <g transform="translate(14, 14) scale(0.40)" filter="url(#logo-comp-glow)">
        <circle cx="145" cy="140" r="105" fill="#E11D48" opacity="0.15" />

        {/* E Ribbon */}
        <path
          d="M 132 10 L 30 69 C 22 74 18 82 18 91 L 18 189 C 18 198 22 206 30 211 L 132 270 C 136 272 140 269 140 264 L 140 228 C 140 224 137 221 133 219 L 60 177 C 54 173 52 168 52 161 L 52 119 C 52 112 54 107 60 103 L 133 61 C 137 59 140 56 140 52 L 140 16 C 140 11 136 8 132 10 Z"
          fill="url(#logo-comp-rose)"
        />

        {/* E Center Prong */}
        <path
          d="M 54 126 L 133 126 C 137 126 140 129 140 133 L 140 147 C 140 151 137 154 133 154 L 54 154 C 50 154 48 151 48 147 L 48 133 C 48 129 50 126 54 126 Z"
          fill={neutralFill}
        />

        {/* K Spine */}
        <path
          d="M 152 16 C 152 11 156 8 161 9 L 179 19 C 183 21 186 25 186 30 L 186 250 C 186 255 183 259 179 261 L 161 271 C 156 272 152 269 152 264 Z"
          fill={neutralFill}
        />

        {/* K Upper Diagonal */}
        <path
          d="M 186 122 L 258 69 C 266 64 270 72 270 80 L 270 112 C 270 117 267 122 262 125 L 220 149 L 190 132 Z"
          fill="url(#logo-comp-coral)"
        />

        {/* K Lower Diagonal */}
        <path
          d="M 190 148 L 220 131 L 262 155 C 267 158 270 163 270 168 L 270 200 C 270 208 266 216 258 211 L 186 158 Z"
          fill="url(#logo-comp-rose)"
        />

        {/* K Velocity Arrow */}
        <path
          d="M 222 140 L 260 116 C 264 113 268 116 268 120 L 268 129 L 284 138 C 287 140 287 142 284 144 L 268 153 L 268 162 C 268 166 264 169 260 166 L 222 142 C 219 141 219 139 222 140 Z"
          fill={neutralFill}
          opacity="0.9"
        />

        <circle cx="298" cy="140" r="3.5" fill="#FB7185" />
      </g>

      {/* Divider */}
      <line
        x1="152"
        y1="32"
        x2="152"
        y2="108"
        stroke={neutralFill}
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />

      {/* Wordmark */}
      <text
        x="174"
        y="78"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
        fontSize="44"
        fontWeight="800"
        letterSpacing="-0.5"
        fill={neutralFill}
      >
        EyKor<tspan fill="url(#logo-comp-rose)">Ban</tspan>
      </text>

      {/* Tagline */}
      <text
        x="176"
        y="103"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="4.5"
        fill={neutralFill}
        opacity="0.65"
      >
        ANYTHING IS POSSIBLE
      </text>
    </svg>
  )
}

export default Logo
