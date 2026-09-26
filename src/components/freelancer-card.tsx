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
  const totalLikes = works.reduce((sum, work) => sum + work.likeCount, 0)
  const hiddenSkillCount = profile.skills.length - VISIBLE_SKILLS

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs transition-shadow hover:shadow-md">
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
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
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <Avatar className="-mt-8 size-16 ring-4 ring-card">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="text-base font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <h3 className="mt-3 text-base font-semibold tracking-tight">
          {user.name}
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
          <a
            href={`/profile/${profile.username}`}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-lg")}
          >
            View profile
          </a>
          <Link to="/login" className={cn(buttonVariants(), "rounded-lg")}>
            Start a project
          </Link>
        </div>
      </div>
    </article>
  )
}
