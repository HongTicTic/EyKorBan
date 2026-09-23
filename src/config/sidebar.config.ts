import { Briefcase, FolderOpen, PlusCircle, UserRound } from "lucide-react"

import type { SidebarConfig } from "@/interface/sidebar"
import { RoleName } from "@/interface/user"

/**
 * Only routes that exist belong here. The previous config linked to eleven
 * screens (/dashboard, /messages, /analytics, /admin/*) that were never built,
 * so every sidebar click silently did nothing.
 */

export const freelancerSidebarConfig: SidebarConfig = {
  role: RoleName.FREELANCER,
  brandLabel: "Freelancer portal",
  groups: [
    {
      items: [
        { label: "My work", href: "/my-work", icon: FolderOpen },
        { label: "New work", href: "/work/new", icon: PlusCircle },
      ],
    },
    {
      heading: "Account",
      items: [{ label: "My profile", href: "/profile", icon: UserRound }],
    },
  ],
}

export const clientSidebarConfig: SidebarConfig = {
  role: RoleName.CLIENT,
  brandLabel: "Client portal",
  groups: [
    {
      items: [
        { label: "My jobs", href: "/my-jobs", icon: Briefcase },
        { label: "Post a job", href: "/jobs/new", icon: PlusCircle },
      ],
    },
    {
      heading: "Account",
      items: [{ label: "My profile", href: "/profile", icon: UserRound }],
    },
  ],
}

// ── Role → config lookup ───────────────────────────────────────────────────
// ADMIN has no portal: administrative moderation is excluded from the MVP.
export const sidebarConfigByRole: Partial<Record<RoleName, SidebarConfig>> = {
  [RoleName.FREELANCER]: freelancerSidebarConfig,
  [RoleName.CLIENT]: clientSidebarConfig,
}

/** Roles that are allowed to see the sidebar. */
export const SIDEBAR_ROLES = new Set<RoleName>([
  RoleName.FREELANCER,
  RoleName.CLIENT,
])
