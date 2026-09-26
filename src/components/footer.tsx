import { Fragment, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { MessageKey } from "@/lib/i18n"
import { AppIcon } from "@/components/app-icon"
import { useLanguage } from "@/components/language-provider"
import { Separator } from "@/components/ui/separator"

// ============================================================================
// Types & Interfaces (Interface Segregation & Type Safety)
// ============================================================================

export interface FooterLink {
  label: string
  href: string
  isExternal?: boolean
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  brandName?: string
  brandDescription?: string
  brandLogo?: ReactNode
  sections?: FooterSection[]
  copyright?: string
  badges?: string[]
}

// ============================================================================
// Default Configuration Data (Single Source of Truth)
// ============================================================================

// The defaults hold message keys and are translated at render time; props
// passed in by a caller are used as given.
const DEFAULT_SECTIONS: {
  title: MessageKey
  links: { label: MessageKey; href: string }[]
}[] = [
  {
    title: "footer.freelancers",
    links: [
      { label: "footer.overview", href: "/" },
      { label: "footer.findGigs", href: "/jobs" },
      { label: "footer.portfolio", href: "/freelancer/portal" },
      { label: "footer.escrow", href: "/projects" },
    ],
  },
  {
    title: "footer.clients",
    links: [
      { label: "footer.discoverTalent", href: "/" },
      { label: "footer.postProject", href: "/client/jobs/new" },
      { label: "footer.enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "footer.resources",
    links: [
      { label: "footer.pricing", href: "/pricing" },
      { label: "footer.help", href: "/help" },
      { label: "footer.trust", href: "/trust-safety" },
    ],
  },
  {
    title: "footer.legal",
    links: [
      { label: "footer.terms", href: "/legal/terms" },
      { label: "footer.privacy", href: "/legal/privacy" },
      { label: "footer.cookies", href: "/legal/cookies" },
    ],
  },
]

const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_BADGES: MessageKey[] = ["footer.badgeEscrow", "footer.badgePayouts"]

// ============================================================================
// Internal Sub-components (Single Responsibility Principle)
// ============================================================================

function FooterBrand({
  name,
  description,
  logo,
}: {
  name: string
  description?: string
  logo?: ReactNode
}) {
  return (
    <div className="flex flex-col space-y-3.5">
      <a
        href="/"
        className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85"
      >
        {logo ?? <AppIcon className="size-9" />}
        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {name}
        </span>
      </a>

      {description && (
        <p className="max-w-[290px] text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  )
}

function FooterNavColumn({ section }: { section: FooterSection }) {
  return (
    <div className="flex flex-col">
      <h4 className="mb-3.5 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {section.title}
      </h4>
      <ul className="flex flex-col space-y-2.5">
        {section.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-block text-[13.5px] text-neutral-600 transition-colors duration-150 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FooterBottom({
  copyright,
  badges,
}: {
  copyright: string
  badges?: string[]
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:text-[13px] dark:text-neutral-400">
      <p>{copyright}</p>

      {badges && badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge, index) => (
            <Fragment key={badge}>
              {index > 0 && (
                <span
                  className="text-neutral-400 select-none dark:text-neutral-600"
                  aria-hidden="true"
                >
                  •
                </span>
              )}
              <span>{badge}</span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Footer Component (Orchestrator)
// ============================================================================

export function Footer({
  brandName,
  brandDescription,
  brandLogo,
  sections,
  copyright,
  badges,
  className,
  ...props
}: FooterProps) {
  const { t } = useLanguage()

  brandName ??= t("footer.brand")
  brandDescription ??= t("footer.description")
  sections ??= DEFAULT_SECTIONS.map((section) => ({
    title: t(section.title),
    links: section.links.map((link) => ({ ...link, label: t(link.label) })),
  }))
  copyright ??= t("footer.copyright", { year: CURRENT_YEAR })
  badges ??= DEFAULT_BADGES.map((badge) => t(badge))

  return (
    <footer
      className={cn(
        "w-full border-t border-neutral-200/70 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-background dark:text-neutral-100",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-14 lg:px-8">
        {/* Top Grid: Brand Identity + Navigation Link Columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {/* Brand Column (Spans 2 columns on lg screens) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <FooterBrand
              name={brandName}
              description={brandDescription}
              logo={brandLogo}
            />
          </div>

          {/* 4 Navigation Columns */}
          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <FooterNavColumn section={section} />
            </div>
          ))}
        </div>

        {/* Divider */}
        <Separator className="my-8 md:my-10" />

        {/* Bottom Bar */}
        <FooterBottom copyright={copyright} badges={badges} />
      </div>
    </footer>
  )
}
