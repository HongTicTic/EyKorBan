import { Calendar, FolderOpen, Globe, Link2, Pencil, UserX } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { ProjectCard } from "@/components/project-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { RoleName } from "@/interface/user"
import { formatCompact, formatMonthYear, getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import { CURRENT_USER_ID } from "@/mock-data/mock-data"
import { useData } from "@/lib/use-data"

const ROLE_LABELS: Record<RoleName, string> = {
  [RoleName.FREELANCER]: "Freelancer",
  [RoleName.CLIENT]: "Client",
  [RoleName.ADMIN]: "Admin",
}

const SOCIAL_LABELS = {
  website: "Website",
  github: "GitHub",
  linkedin: "LinkedIn",
} as const

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-4 py-3">
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

const Profile = ({ username }: { username?: string }) => {
  const { users, freelancerProfiles, projectCards } = useData()
  const user = username
    ? users.find((candidate) => candidate.username === username)
    : users.find((candidate) => candidate.userId === CURRENT_USER_ID)

  if (!user) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          icon={UserX}
          title="Profile not found"
          description={`There is no one called @${username} on the platform.`}
          action={
            <a
              href="./hire-creatives"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Browse creatives
            </a>
          }
        />
      </div>
    )
  }

  const profile = freelancerProfiles.find(
    (candidate) => candidate.userId === user.userId
  )
  const works = projectCards.filter(
    (card) => card.freelanceId === user.userId
  )
  const isOwnProfile = user.userId === CURRENT_USER_ID
  const totalLikes = works.reduce((sum, work) => sum + work.likeCount, 0)
  const totalViews = works.reduce((sum, work) => sum + work.viewCount, 0)
  const socialLinks = Object.entries(profile?.socialLinks ?? {}).filter(
    (entry): entry is [keyof typeof SOCIAL_LABELS, string] => Boolean(entry[1])
  )

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-xs">
        <div className="h-28 bg-linear-to-r from-primary via-primary/80 to-rose-300 sm:h-40 dark:to-rose-900" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-end justify-between gap-4">
            <Avatar className="-mt-12 size-24 ring-4 ring-card sm:-mt-14 sm:size-28">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="text-2xl font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button variant="outline" className="rounded-lg">
                <Pencil data-icon="inline-start" />
                Edit profile
              </Button>
            ) : (
              <a href="/login" className={cn(buttonVariants(), "rounded-lg")}>
                Start a project
              </a>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.name}
            </h1>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
          {user.username && (
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          )}
          {profile?.tagline && (
            <p className="mt-3 text-base">{profile.tagline}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {profile?.hourlyRate !== undefined && (
              <span>
                <span className="font-semibold text-foreground">
                  ${profile.hourlyRate}
                </span>
                /hr
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              Member since {formatMonthYear(user.createdAt)}
            </span>
            {socialLinks.map(([network, url]) => (
              <a
                key={network}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                {network === "website" ? (
                  <Globe className="size-4" />
                ) : (
                  <Link2 className="size-4" />
                )}
                {SOCIAL_LABELS[network]}
              </a>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
            <Stat label="Works" value={String(works.length)} />
            <Stat label="Likes" value={formatCompact(totalLikes)} />
            <Stat label="Views" value={formatCompact(totalViews)} />
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-6">
          {profile?.bio && (
            <div>
              <h2 className="text-sm font-semibold">About</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            </div>
          )}
          {profile && profile.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {isOwnProfile ? "Your work" : "Work"}
          </h2>
          {works.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {works.map((work) => (
                <ProjectCard
                  key={work.id}
                  project={work}
                  authorName={user.name}
                  authorAvatar={user.avatarUrl}
                  className="max-w-none"
                />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={FolderOpen}
                title="No published work yet"
                description={
                  isOwnProfile
                    ? "Work you publish shows up here for clients to see."
                    : `${user.name} hasn't published any work yet.`
                }
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Profile
