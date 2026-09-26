import * as React from "react"
import { Link } from "react-router"
import { ArrowRight, Check } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { AudienceToggle, type Audience } from "@/components/audience-toggle"
import { buttonVariants } from "@/components/ui/button"
import { RoleName } from "@/interface/user"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "eykorban.audience"

/** The accent word cycles through the platform's real categories. */
const ROTATING = [
  "product design",
  "web development",
  "brand identity",
  "mobile apps",
  "motion and video",
]

const COPY: Record<
  Audience,
  {
    lead: string
    points: string[]
    cta: { label: string; href: string }
    secondary: { label: string; href: string }
  }
> = {
  hire: {
    lead: "Work with independent talent in",
    points: [
      "Browse finished work, not promises",
      "Agree scope and budget up front",
      "Funds held until you approve the result",
    ],
    cta: { label: "Browse creatives", href: "/hire-creatives" },
    secondary: { label: "Post a job", href: "/jobs/new" },
  },
  work: {
    lead: "Get hired for what you are best at, in",
    points: [
      "Publish your work with no approval queue",
      "Answer briefs from clients who are ready",
      "Every project tracked to completion",
    ],
    cta: { label: "Find work", href: "/find-work" },
    secondary: { label: "Show your work", href: "/work/new" },
  },
}

function readStored(): Audience | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "hire" || value === "work" ? value : null
  } catch {
    // Private mode or blocked storage — fall back to the role default.
    return null
  }
}

/**
 * The landing hero: an audience switch, a headline whose accent word cycles
 * through real categories, three concrete promises, and one clear action.
 *
 * Which side it opens on is a small courtesy — a signed-in freelancer sees
 * "Get hired" first — remembered per viewer in localStorage. That is exactly
 * the sort of per-device preference localStorage is for; nothing here needs to
 * survive to another browser.
 */
export function HomeHero() {
  const { user } = useAuth()

  const [audience, setAudience] = React.useState<Audience>(
    () => readStored() ?? (user?.role === RoleName.FREELANCER ? "work" : "hire")
  )
  const [wordIndex, setWordIndex] = React.useState(0)

  function choose(next: Audience) {
    setAudience(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not being able to remember the choice is not worth surfacing.
    }
  }

  React.useEffect(() => {
    // Respect a reduced-motion preference: hold the first word instead.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = setInterval(
      () => setWordIndex((current) => (current + 1) % ROTATING.length),
      2600
    )
    return () => clearInterval(timer)
  }, [])

  const copy = COPY[audience]

  return (
    <section className="border-b border-border/60">
      <div className="container mx-auto grid gap-10 px-4 py-10 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <AudienceToggle
            value={audience}
            onChange={choose}
            className="w-full max-w-xs sm:w-auto"
          />

          <h1 className="mt-7 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {copy.lead}{" "}
            {/* aria-live so the rotation is announced once, not on every tick
                of the interval. */}
            <span className="relative inline-block text-primary dark:text-rose-400">
              <span key={wordIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
                {ROTATING[wordIndex]}
              </span>
            </span>
          </h1>

          <ul className="mt-7 flex flex-col gap-3">
            {copy.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm sm:text-base">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-rose-400">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={copy.cta.href}
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
            >
              {copy.cta.label}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              to={user ? copy.secondary.href : "/signup"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "rounded-full px-5"
              )}
            >
              {user ? copy.secondary.label : "Create an account"}
            </Link>
          </div>
        </div>

        {/* Decorative collage. aria-hidden and empty alt: it carries no
            information the headline does not already state. */}
        <div aria-hidden className="hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 pt-10">
              <HeroTile className="aspect-[4/5] bg-linear-to-br from-primary/80 to-rose-400" />
              <HeroTile className="aspect-square bg-linear-to-br from-sky-400 to-indigo-500" />
            </div>
            <div className="flex flex-col gap-4">
              <HeroTile className="aspect-square bg-linear-to-br from-amber-300 to-orange-500" />
              <HeroTile className="aspect-[4/5] bg-linear-to-br from-emerald-400 to-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
    />
  )
}
