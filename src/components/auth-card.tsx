import type { ReactNode } from "react"
import { BadgeCheck, Shield } from "lucide-react"

import { AppIcon } from "@/components/app-icon"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[460px] overflow-hidden rounded-3xl bg-card text-card-foreground shadow-xl ring-1 shadow-black/5 ring-foreground/5",
        className
      )}
    >
      <div className="h-1.5 bg-linear-to-r from-primary/70 via-primary to-primary/70" />

      <div className="px-6 pt-8 pb-7 sm:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <AppIcon className="size-11" />
          </div>

          <Badge className="mt-5 h-auto gap-1.5 bg-primary/10 px-3 py-1 text-primary dark:text-rose-400">
            <Shield />
            Secure Project Inquiries
          </Badge>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="mt-8">{children}</div>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-border/60 bg-muted/40 px-6 py-5 text-center text-sm">
        <div className="text-muted-foreground">{footer}</div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <BadgeCheck className="size-4 shrink-0 text-primary dark:text-rose-400" />
          Protected by Jes Middleman Escrow — 100% verified contracts
        </p>
      </div>
    </div>
  )
}
