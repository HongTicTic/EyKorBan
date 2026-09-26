import * as React from "react"
import { Image as ImageIcon, Heart, Eye } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ProjectCard as IProjectCard } from "@/interface/projectCard"
import { getCategoryName } from "@/interface/category"

export interface CardTag {
  label: string
  variant?: "default" | "secondary" | "outline"
}

export interface ProjectCardProps {
  /** Optional project object conforming to the ProjectCard interface */
  project?: IProjectCard
  /** Identifier used for target page routing (e.g. `/project/:id`) */
  id?: string
  /** Project title */
  title?: string
  /** Subtitle or secondary description */
  subtitle?: string
  /** Project cover image URL */
  image?: string
  /** Author or creator display name */
  authorName?: string
  /** Author avatar image URL */
  authorAvatar?: string
  /** Author avatar fallback initials */
  authorInitials?: string
  /** Likes metric */
  likeCount?: number
  /** Views metric */
  viewCount?: number
  /** List of tag names or tag objects */
  tags?: (CardTag | string)[]
  /** URL / path to navigate to when clicked */
  href?: string
  /** Optional click handler for client-side navigation */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  /** Optional additional CSS classes */
  className?: string
  /** Optional anchor target (e.g. '_blank') */
  target?: string
}

function getInitials(name?: string): string {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatMetric(count?: number): string {
  if (count === undefined || count === null) return "0"
  if (count >= 1_000_000)
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (count >= 1_000)
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}k`
  return count.toString()
}

export function ProjectCard({
  project,
  id = project?.id,
  title = project?.title ?? "Roaster identity and packaging",
  subtitle = project?.subtitle,
  image = project?.coverImageUrl,
  authorName = "Mira Renko",
  authorAvatar = "https://github.com/shadcn.png",
  authorInitials,
  likeCount = project?.likeCount,
  viewCount = project?.viewCount,
  tags,
  href,
  onClick,
  className,
  target,
}: ProjectCardProps) {
  const cardHref = href ?? (id ? `/project/${id}` : "#")
  const initials = authorInitials ?? getInitials(authorName)

  // Derive tags from prop, or from project metadata, or fallback default
  const rawTags: (CardTag | string)[] =
    tags ??
    (project
      ? [
        ...(project.categoryId
          ? [
            {
              label: getCategoryName(project.categoryId),
              variant: "secondary" as const,
            },
          ]
          : []),
        ...(subtitle
          ? [{ label: subtitle, variant: "outline" as const }]
          : []),
      ]
      : [
        { label: "Branding", variant: "secondary" as const },
        { label: "Food & drink", variant: "outline" as const },
      ])

  const normalizedTags = rawTags.map((tag, idx) => {
    if (typeof tag === "string") {
      return {
        label: tag,
        variant: (idx === 0 ? "secondary" : "outline") as
          "secondary" | "outline",
      }
    }
    return {
      label: tag.label,
      variant: tag.variant ?? (idx === 0 ? "secondary" : "outline"),
    }
  })

  return (
    <a
      href={cardHref}
      onClick={onClick}
      target={target}
      className={cn(
        "group block w-full max-w-sm md:max-w-[340px] text-left no-underline outline-none cursor-pointer select-none",
        className
      )}
    >
      <Card className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white !p-0 !gap-0 text-neutral-900 shadow-xs transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md dark:border-neutral-800 dark:bg-card dark:text-neutral-100">
        {/* Top Cover Image / Placeholder */}
        <div className="relative aspect-[1.15/1] w-full overflow-hidden bg-neutral-100/90 dark:bg-neutral-800/70 flex items-center justify-center border-b border-neutral-100 dark:border-neutral-800/60">
          {image ? (
            <img
              width={800}
              height={600}
              loading="lazy"
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="size-12 text-neutral-400/80 dark:text-neutral-500 stroke-[1.25]" />
            </div>
          )}
        </div>

        {/* Title using CardHeader & CardTitle */}
        <CardHeader className="px-4 pt-3.5 pb-0">
          <CardTitle className="line-clamp-1 text-[17px] leading-snug font-medium tracking-tight text-neutral-900 transition-colors group-hover:text-primary dark:text-neutral-100 dark:group-hover:text-primary">
            {title}
          </CardTitle>
        </CardHeader>

        {/* Author & Metrics row using CardContent & Avatar */}
        <CardContent className="px-4 pt-2.5 pb-0 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-6 shrink-0 bg-neutral-100 dark:bg-neutral-800">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
              <AvatarFallback className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] text-neutral-600 dark:text-neutral-400 font-normal truncate">
              {authorName}
            </span>
          </div>

          {(likeCount !== undefined || viewCount !== undefined) && (
            <div className="flex shrink-0 items-center gap-2.5 text-xs font-medium text-neutral-400 dark:text-neutral-500">
              {likeCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Heart className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                  {formatMetric(likeCount)}
                </span>
              )}
              {viewCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                  {formatMetric(viewCount)}
                </span>
              )}
            </div>
          )}
        </CardContent>

        {/* Tags – vertical ticker (pause on hover) */}
        {normalizedTags.length === 1 ? (
          // Single tag – static, no animation needed
          <CardFooter className="flex items-center gap-2 px-4 pt-3 pb-4">
            <Badge
              variant={normalizedTags[0].variant}
              className={cn(
                "rounded-lg px-2.5 py-0.5 text-xs font-normal h-auto pointer-events-none select-none",
                normalizedTags[0].variant === "secondary" &&
                "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-transparent",
                normalizedTags[0].variant === "outline" &&
                "border border-neutral-200 bg-transparent text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
              )}
            >
              {normalizedTags[0].label}
            </Badge>
          </CardFooter>
        ) : (
          // Multiple tags – horizontal marquee
          <CardFooter
            className="badge-ticker-wrap px-4 pt-3 pb-4 overflow-hidden w-full"
          >
            <div
              className="badge-ticker flex flex-row gap-2 w-max"
              style={{
                "--ticker-duration": `${normalizedTags.length * 2.5}s`,
              } as React.CSSProperties}
            >
              {/* Duplicate array for seamless infinite loop */}
              {[...normalizedTags, ...normalizedTags].map((tag, idx) => (
                <Badge
                  key={`${tag.label}-${idx}`}
                  variant={tag.variant}
                  className={cn(
                    "rounded-lg px-2.5 py-0.5 text-xs font-normal h-auto pointer-events-none select-none transition-none shrink-0 max-w-[220px]",
                    tag.variant === "secondary" &&
                    "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    tag.variant === "outline" &&
                    "border border-neutral-200 bg-transparent text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 hover:bg-transparent hover:border-neutral-200"
                  )}
                >
                  <span className="truncate block">{tag.label}</span>
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </a>
  )
}
