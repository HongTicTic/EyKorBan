import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { NavItem, NavGroup, SidebarConfig } from "@/interface/sidebar"
import type { User } from "@/interface/user"
import { RoleName } from "@/interface/user"
import { sidebarConfigByRole, SIDEBAR_ROLES } from "@/config/sidebar.config"

// ── Sub-components ─────────────────────────────────────────────────────────

function SidebarBrand({ label }: { label: string }) {
    return (
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground truncate">
                {label}
            </span>
        </div>
    )
}

function SidebarNavItem({
    item,
    active,
    onNavigate,
}: {
    item: NavItem
    active: boolean
    onNavigate: (href: string) => void
}) {
    const Icon = item.icon

    return (
        <li>
            <a
                href={item.href}
                onClick={(e) => {
                    e.preventDefault()
                    onNavigate(item.href)
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none",
                    active
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
            >
                <Icon
                    className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground"
                    )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold leading-none"
                    >
                        {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                )}
            </a>
        </li>
    )
}

function SidebarNavGroup({
    group,
    activePath,
    onNavigate,
}: {
    group: NavGroup
    activePath: string
    onNavigate: (href: string) => void
}) {
    return (
        <div className="px-2">
            {group.heading && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group.heading}
                </p>
            )}
            <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                    <SidebarNavItem
                        key={item.href}
                        item={item}
                        active={activePath === item.href}
                        onNavigate={onNavigate}
                    />
                ))}
            </ul>
        </div>
    )
}

function SidebarUserFooter({ user }: { user: User }) {
    const initials = user.name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    return (
        <div className="flex shrink-0 items-center gap-3 border-t border-border/80 px-4 py-4">
            <Avatar className="size-8 shrink-0">
                {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                )}
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-none text-foreground">
                    {user.name}
                </p>
                <p className="mt-1 truncate text-[11px] leading-none text-muted-foreground">
                    {user.status === "ACTIVE" ? "Signed in" : user.status.toLowerCase().replace("_", " ")}
                </p>
            </div>
        </div>
    )
}

// ── Main Sidebar ───────────────────────────────────────────────────────────

export interface SidebarProps {
    /** The current authenticated user */
    user: User
    /** Controlled active path — defaults to window.location.pathname */
    activePath?: string
    /** Called when a nav item is clicked */
    onNavigate?: (href: string) => void
    /** Override the role used for nav config (defaults to user.role) */
    role?: RoleName
    /** Additional class names for the root element */
    className?: string
}

export function Sidebar({
    user,
    activePath: activePathProp,
    onNavigate,
    role,
    className,
}: SidebarProps) {
    const effectiveRole = role ?? user.role
    // CLIENT and other public roles are explicitly excluded from the sidebar.
    if (!SIDEBAR_ROLES.has(effectiveRole)) return null

    const config: SidebarConfig | undefined = sidebarConfigByRole[effectiveRole]
    if (!config) return null

    const [activePath, setActivePath] = React.useState(
        activePathProp ?? (typeof window !== "undefined" ? window.location.pathname : "/dashboard")
    )

    // Sync if parent controls activePath
    React.useEffect(() => {
        if (activePathProp !== undefined) setActivePath(activePathProp)
    }, [activePathProp])

    const handleNavigate = React.useCallback(
        (href: string) => {
            setActivePath(href)
            onNavigate?.(href)
        },
        [onNavigate]
    )

    return (
        <aside
            aria-label={config.brandLabel}
            className={cn(
                "flex h-screen w-[220px] shrink-0 flex-col border-r border-border/80 bg-background",
                className
            )}
        >
            {/* Brand / Logo */}
            <SidebarBrand label={config.brandLabel} />

            {/* Nav groups */}
            <nav className="flex flex-1 flex-col gap-4 overflow-y-auto py-3 scrollbar-none">
                {config.groups.map((group, idx) => (
                    <SidebarNavGroup
                        key={idx}
                        group={group}
                        activePath={activePath}
                        onNavigate={handleNavigate}
                    />
                ))}
            </nav>

            {/* User footer */}
            <SidebarUserFooter user={user} />
        </aside>
    )
}
