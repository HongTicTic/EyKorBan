import { Link, useLocation } from "react-router"
import { Briefcase, Compass, Search, UserRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { sidebarConfigByRole } from "@/config/sidebar.config"
import type { MessageKey } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Tab {
  label: string
  href: string
  icon: LucideIcon
}

const PUBLIC_TABS: (Omit<Tab, "label"> & { label: MessageKey })[] = [
  { label: "tabs.explore", href: "/", icon: Compass },
  { label: "tabs.creatives", href: "/hire-creatives", icon: Search },
  { label: "tabs.jobs", href: "/find-work", icon: Briefcase },
]

/**
 * Bottom tab bar for phones. The desktop sidebar is 220px of fixed width —
 * more than half a 375px screen — so it is hidden below md and this replaces
 * it. A thumb-reachable bar is also the native pattern users expect once the
 * PWA is installed and the browser chrome is gone.
 */
export function MobileNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { t } = useLanguage()

  // Signed-in users get their portal's first entry (My work / My jobs) as a
  // fourth tab, so the parts the sidebar owns stay reachable on a phone.
  const portalItem = user ? sidebarConfigByRole[user.role]?.groups[0]?.items[0] : undefined

  const tabs: Tab[] = [
    ...PUBLIC_TABS.map((tab) => ({ ...tab, label: t(tab.label) })),
    portalItem
      ? { label: portalItem.label, href: portalItem.href, icon: portalItem.icon }
      : { label: t("tabs.profile"), href: user ? "/profile" : "/login", icon: UserRound },
  ]

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden",
        // Keeps the bar above the iOS home indicator.
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <ul className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)

          return (
            <li key={tab.href} className="flex-1">
              <Link
                to={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // 56px tall: comfortably above the 44px minimum touch target.
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary dark:text-rose-400"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
