import * as React from "react"
import { Link } from "react-router"
import { ArrowRight, Check } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { AudienceToggle, type Audience } from "@/components/audience-toggle"
import { useLanguage } from "@/components/language-provider"
import { buttonVariants } from "@/components/ui/button"
import { RoleName } from "@/interface/user"
import type { MessageKey } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "eykorban.audience"

/**
 * Freelancers at work, for the decorative collage. All free under the
 * Unsplash License; served from images.unsplash.com so the service worker's
 * CacheFirst "images" rule (vite.config.ts) keeps them for offline use.
 */
const HERO_PHOTOS = {
  // Van Tay Media — unsplash.com/photos/9iDbe_2R_K0
  laptop: "photo-1565688268889-d080fc73ba0a",
  // Michelle Ding — unsplash.com/photos/eyEXCaFpvvU
  sketching: "photo-1565019011521-b0575cbb57c8",
  // Brooke Cagle — unsplash.com/photos/_ihwcvahzRk
  cafe: "photo-1543270122-f7a11ad44f3a",
  // phyo min — unsplash.com/photos/P002vaEJlvk
  desk: "photo-1684125483810-b4c196bc9162",
}

/** The accent word cycles through the platform's real categories. */
const ROTATING: MessageKey[] = [
  "hero.word.productDesign",
  "hero.word.webDevelopment",
  "hero.word.brandIdentity",
  "hero.word.mobileApps",
  "hero.word.motionVideo",
]

const COPY: Record<
  Audience,
  {
    lead: MessageKey
    points: MessageKey[]
    cta: { label: MessageKey; href: string }
    secondary: { label: MessageKey; href: string }
  }
> = {
  hire: {
    lead: "hero.hire.lead",
    points: ["hero.hire.point1", "hero.hire.point2", "hero.hire.point3"],
    cta: { label: "hero.hire.cta", href: "/hire-creatives" },
    secondary: { label: "hero.hire.secondary", href: "/jobs/new" },
  },
  work: {
    lead: "hero.work.lead",
    points: ["hero.work.point1", "hero.work.point2", "hero.work.point3"],
    cta: { label: "hero.work.cta", href: "/find-work" },
    secondary: { label: "hero.work.secondary", href: "/work/new" },
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
  const { t } = useLanguage()

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
            {t(copy.lead)}{" "}
            {/* aria-live so the rotation is announced once, not on every tick
                of the interval. */}
            <span className="relative inline-block text-primary dark:text-rose-400">
              <span key={wordIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
                {t(ROTATING[wordIndex])}
              </span>
            </span>
          </h1>

          <ul className="mt-7 flex flex-col gap-3">
            {copy.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm sm:text-base">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-rose-400">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-muted-foreground">{t(point)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={copy.cta.href}
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
            >
              {t(copy.cta.label)}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              to={user ? copy.secondary.href : "/signup"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "rounded-full px-5"
              )}
            >
              {user ? t(copy.secondary.label) : t("hero.createAccount")}
            </Link>
          </div>
        </div>

        {/* Decorative collage. aria-hidden and empty alt: it carries no
            information the headline does not already state. */}
        <div aria-hidden className="hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 pt-10">
              <HeroTile
                photo={HERO_PHOTOS.laptop}
                className="aspect-[4/5] bg-linear-to-br from-primary/80 to-rose-400"
              />
              <HeroTile
                photo={HERO_PHOTOS.sketching}
                className="aspect-square bg-linear-to-br from-sky-400 to-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-4">
              <HeroTile
                photo={HERO_PHOTOS.cafe}
                className="aspect-square bg-linear-to-br from-amber-300 to-orange-500"
              />
              <HeroTile
                photo={HERO_PHOTOS.desk}
                className="aspect-[4/5] bg-linear-to-br from-emerald-400 to-teal-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function heroPhotoUrl(photo: string, width: number) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=80`
}

/**
 * The gradient in `className` stays behind the photo, so the tile still has
 * colour while the image loads or when it is offline and not yet cached.
 */
function HeroTile({ photo, className }: { photo: string; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
    >
      {/* lazy: the collage is display:none below lg, and lazy images that
          never enter the viewport are never fetched — phones skip all four. */}
      <img
        src={heroPhotoUrl(photo, 640)}
        srcSet={`${heroPhotoUrl(photo, 420)} 420w, ${heroPhotoUrl(photo, 640)} 640w, ${heroPhotoUrl(photo, 960)} 960w`}
        sizes="(min-width: 1536px) 420px, (min-width: 1024px) 25vw, 1px"
        alt=""
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    </div>
  )
}
