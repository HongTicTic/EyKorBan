import {
    LayoutDashboard,
    FolderOpen,
    PlusCircle,
    MessageSquare,
    BarChart2,
    Settings,
    ShieldCheck,
    Users,
    Flag,
    Database,
} from "lucide-react"
import { RoleName } from "@/interface/user"
import type { SidebarConfig } from "@/interface/sidebar"

// ── Freelancer sidebar config ──────────────────────────────────────────────
export const freelancerSidebarConfig: SidebarConfig = {
    role: RoleName.FREELANCER,
    brandLabel: "Freelancer portal",
    groups: [
        {
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "My work",
                    href: "/my-work",
                    icon: FolderOpen,
                },
                {
                    label: "New work",
                    href: "/new-work",
                    icon: PlusCircle,
                },
            ],
        },
        {
            heading: "Communication",
            items: [
                {
                    label: "Messages",
                    href: "/messages",
                    icon: MessageSquare,
                    badge: 3,
                },
            ],
        },
        {
            heading: "Insights",
            items: [
                {
                    label: "Analytics",
                    href: "/analytics",
                    icon: BarChart2,
                },
                {
                    label: "Settings",
                    href: "/settings",
                    icon: Settings,
                },
            ],
        },
    ],
}

// ── Admin sidebar config (stub — implement later) ──────────────────────────
export const adminSidebarConfig: SidebarConfig = {
    role: RoleName.ADMIN,
    brandLabel: "Admin panel",
    groups: [
        {
            items: [
                {
                    label: "Overview",
                    href: "/admin",
                    icon: ShieldCheck,
                },
                {
                    label: "Users",
                    href: "/admin/users",
                    icon: Users,
                },
                {
                    label: "Reports",
                    href: "/admin/reports",
                    icon: Flag,
                },
            ],
        },
        {
            heading: "System",
            items: [
                {
                    label: "Database",
                    href: "/admin/database",
                    icon: Database,
                },
                {
                    label: "Settings",
                    href: "/admin/settings",
                    icon: Settings,
                },
            ],
        },
    ],
}

// ── Role → config lookup ───────────────────────────────────────────────────
// CLIENT is intentionally excluded — they use the public-facing layout only.
export const sidebarConfigByRole: Partial<Record<RoleName, SidebarConfig>> = {
    [RoleName.FREELANCER]: freelancerSidebarConfig,
    [RoleName.ADMIN]: adminSidebarConfig,
}

/** Roles that are allowed to see the sidebar. */
export const SIDEBAR_ROLES = new Set<RoleName>([
    RoleName.FREELANCER,
    RoleName.ADMIN,
])
