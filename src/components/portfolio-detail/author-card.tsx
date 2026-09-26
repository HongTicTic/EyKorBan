import type * as React from "react"
import {
  Award,
  CheckCircle,
  MapPin,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/interface/user"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface AuthorStats {
  headline: string
  location: string
  isVerified: boolean
  isPro: boolean
  isOnline: boolean
  rating: string
  reviewCount: number
  responseTime: string
  onTimeRate: string
  experience: string
}

interface AuthorCardProps {
  author: User
  stats: AuthorStats
}

function StatRow({
  icon: Icon,
  iconClassName,
  label,
  children,
}: {
  icon: LucideIcon
  iconClassName: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
        <Icon className={cn("size-4 shrink-0", iconClassName)} />
        <span>{label}</span>
      </div>
      <div className="text-xs font-bold text-foreground">{children}</div>
    </div>
  )
}

/** Who made the work, with their track record. */
export function AuthorCard({ author, stats }: AuthorCardProps) {
  return (
    <div className="space-y-4.5 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <Avatar className="size-13 border border-border">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          {stats.isOnline && (
            <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-foreground">
              {author.name}
            </span>
            {stats.isVerified && (
              <CheckCircle className="size-4 fill-sky-500 text-sky-500" />
            )}
            {stats.isPro && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                PRO
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-primary">
            {stats.headline}
          </div>
          <div className="flex items-center gap-1 pt-0.5 text-xs text-muted-foreground">
            <MapPin className="size-3 text-muted-foreground" />
            <span>{stats.location}</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/60 border-t border-border/60 pt-1">
        <StatRow
          icon={Star}
          iconClassName="fill-amber-500 text-amber-500"
          label="Rating"
        >
          {stats.rating}{" "}
          <span className="font-normal text-muted-foreground">
            ({stats.reviewCount})
          </span>
        </StatRow>
        <StatRow icon={Zap} iconClassName="text-rose-500" label="Response">
          {stats.responseTime}
        </StatRow>
        <StatRow
          icon={CheckCircle}
          iconClassName="text-emerald-500"
          label="On-Time"
        >
          {stats.onTimeRate}
        </StatRow>
        <StatRow icon={Award} iconClassName="text-sky-500" label="Experience">
          {stats.experience}
        </StatRow>
      </div>
    </div>
  )
}
