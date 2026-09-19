import * as React from "react"
import { Image as ImageIcon } from "lucide-react"
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

export function ProjectCard({
    project,
    id = project?.id,
    title = project?.title ?? "Roaster identity and packaging",
    subtitle = project?.subtitle,
    image = project?.coverImageUrl,
    authorName = "Mira Renko",
    authorAvatar = "https://github.com/shadcn.png",
    authorInitials,
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
                    ? [{ label: project.categoryId, variant: "secondary" as const }]
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
                variant: (idx === 0 ? "secondary" : "outline") as "secondary" | "outline",
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
                "group block w-full max-w-[340px] text-left no-underline outline-none cursor-pointer select-none",
                className
            )}
        >
            <Card className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white !p-0 !gap-0 text-neutral-900 shadow-xs transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md dark:border-neutral-800 dark:bg-card dark:text-neutral-100">
                {/* Top Cover Image / Placeholder */}
                <div className="relative aspect-[1.15/1] w-full overflow-hidden bg-neutral-100/90 dark:bg-neutral-800/70 flex items-center justify-center border-b border-neutral-100 dark:border-neutral-800/60">
                    {image ? (
                        <img
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
                    <CardTitle className="text-[17px] font-medium leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors group-hover:text-primary dark:group-hover:text-primary">
                        {title}
                    </CardTitle>
                </CardHeader>

                {/* Author row using CardContent & Avatar */}
                <CardContent className="px-4 pt-2.5 pb-0">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-6 bg-neutral-100 dark:bg-neutral-800">
                            {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                            <AvatarFallback className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] text-neutral-600 dark:text-neutral-400 font-normal">
                            {authorName}
                        </span>
                    </div>
                </CardContent>

                {/* Tags row using CardFooter & Badge (no hover) */}
                <CardFooter className="flex items-center gap-2 px-4 pt-3 pb-4">
                    {normalizedTags.map((tag, idx) => (
                        <Badge
                            key={`${tag.label}-${idx}`}
                            variant={tag.variant}
                            className={cn(
                                "rounded-lg px-2.5 py-0.5 text-xs font-normal h-auto pointer-events-none select-none transition-none",
                                tag.variant === "secondary" &&
                                "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200",
                                tag.variant === "outline" &&
                                "border border-neutral-200 bg-transparent text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 hover:bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-200 dark:hover:border-neutral-700"
                            )}
                        >
                            {tag.label}
                        </Badge>
                    ))}
                </CardFooter>
            </Card>
        </a>
    )
}

