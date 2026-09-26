import { Heart, ImageIcon, LayoutGrid } from "lucide-react"
import { Link } from "react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { formatCompact, getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"

const VISIBLE_SKILLS = 3

interface FreelancerCardProps {
  user: User
  profile: FreelancerProfile
  works: ProjectCard[]
}

export function FreelancerCard({ user, profile, works }: FreelancerCardProps) {
  const cover = works[0]?.coverImageUrl
  const profileHref = `/profile/${profile.username}`
  const totalLikes = works.reduce((sum, work) => sum + work.likeCount, 0)
  const hiddenSkillCount = profile.skills.length - VISIBLE_SKILLS

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs transition-shadow hover:shadow-md">
      <Link
        to={profileHref}
        tabIndex={-1}
        aria-hidden
        className="block aspect-[16/9] w-full overflow-hidden bg-muted"
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            width={400}
            height={300}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <Avatar className="-mt-8 size-16 ring-4 ring-card">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="text-base font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <h3 className="mt-3 text-base font-semibold tracking-tight">
          <Link to={profileHref} className="hover:underline">
            {user.name}
          </Link>
        </h3>
        {profile.tagline && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {profile.tagline}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, VISIBLE_SKILLS).map((skill) => (
            <Badge key={skill} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
          {hiddenSkillCount > 0 && (
            <Badge variant="outline" className="font-normal">
              +{hiddenSkillCount}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          {profile.hourlyRate !== undefined && (
            <span className="font-semibold">
              ${profile.hourlyRate}
              <span className="font-normal text-muted-foreground">/hr</span>
            </span>
          )}
          <span className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <LayoutGrid className="size-3.5" />
              {works.length} {works.length === 1 ? "work" : "works"}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {formatCompact(totalLikes)}
            </span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={profileHref}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-lg")}
          >
            View profile
          </Link>
          {works[0] ? (
            <Link
              to={`/start-project/work/${works[0].id}`}
              className={cn(buttonVariants(), "rounded-lg")}
            >
              Start a project
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "pointer-events-none rounded-lg opacity-60"
              )}
            >
              No work yet
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
