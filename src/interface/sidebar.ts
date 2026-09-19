import type { LucideIcon } from "lucide-react"
import { RoleName } from "@/interface/user"

// ── Nav item types ─────────────────────────────────────────────────────────

export interface NavItem {
    /** Visible label */
    label: string
    /** Route path */
    href: string
    /** Lucide icon component */
    icon: LucideIcon
    /** Optional badge count (e.g. notifications) */
    badge?: number
    /** Nested sub-items for groups */
    children?: Omit<NavItem, "children">[]
}

export interface NavGroup {
    /** Optional section heading (rendered above the group) */
    heading?: string
    items: NavItem[]
}

// ── Per-role sidebar config ────────────────────────────────────────────────

export interface SidebarConfig {
    role: RoleName
    /** Brand label shown in the logo area */
    brandLabel: string
    /** Ordered nav groups */
    groups: NavGroup[]
}
