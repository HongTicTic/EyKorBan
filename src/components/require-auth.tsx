import { Link, Navigate, Outlet, useLocation } from "react-router"
import { Lock } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { EmptyState } from "@/components/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { RoleName } from "@/interface/user"
import { cn } from "@/lib/utils"

const ROLE_LABELS: Record<RoleName, string> = {
  [RoleName.FREELANCER]: "freelancer",
  [RoleName.CLIENT]: "client",
  [RoleName.ADMIN]: "admin",
}

/**
 * Gate for the portal routes. This is a convenience, not a security boundary —
 * the real rule is the RLS policy on each table, which rejects a write from the
 * wrong user even if someone reaches the screen another way (NFR-004).
 */
export function RequireAuth({ role }: { role?: RoleName }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          icon={Lock}
          title={`This page is for ${ROLE_LABELS[role]} accounts`}
          description={`You are signed in as a ${ROLE_LABELS[user.role]}. Roles cannot be switched in this version.`}
          action={
            <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Back to browsing
            </Link>
          }
        />
      </div>
    )
  }

  return <Outlet />
}
