import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"
import type {
  FreelancerProfileRow,
  PortfolioItemRow,
  ProfileRow,
} from "@/lib/database.types"
import { supabase } from "@/lib/supabase"
import { unwrap } from "@/services/errors"
import { toFreelancerProfile, toProjectCard, toUser } from "@/services/mappers"

export interface CreativeSummary {
  user: User
  profile: FreelancerProfile | null
  works: ProjectCard[]
  totalLikes: number
  totalViews: number
}

const WITH_DETAIL = `
  *,
  freelancer_profile:freelancer_profiles!freelancer_profiles_user_id_fkey(*),
  works:portfolio_items!portfolio_items_freelancer_id_fkey(*)
`

type ProfileJoin = ProfileRow & {
  freelancer_profile: FreelancerProfileRow | null
  works: PortfolioItemRow[] | null
}

function toCreative(row: ProfileJoin, includeDrafts: boolean): CreativeSummary {
  const works = (row.works ?? [])
    .filter((work) => includeDrafts || work.status === "published")
    .map(toProjectCard)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

  return {
    user: toUser(row),
    profile: row.freelancer_profile
      ? toFreelancerProfile(row.freelancer_profile, row.username ?? "")
      : null,
    works,
    totalLikes: works.reduce((sum, work) => sum + work.likeCount, 0),
    totalViews: works.reduce((sum, work) => sum + work.viewCount, 0),
  }
}

/** RLS hides profiles whose owner turned the public toggle off. */
export async function listPublicFreelancers(
  categoryId?: string
): Promise<CreativeSummary[]> {
  const rows = unwrap(
    await supabase
      .from("profiles")
      .select(WITH_DETAIL)
      .eq("role", "FREELANCER")
      .returns<ProfileJoin[]>()
  )

  let creatives = rows
    .map((row) => toCreative(row, false))
    .filter((creative) => creative.profile?.publicProfileEnabled)

  if (categoryId && categoryId !== "all") {
    creatives = creatives.filter((creative) =>
      creative.works.some((work) => work.categoryId === categoryId)
    )
  }

  return creatives
}

export async function getCreativeByUsername(
  username: string,
  includeDrafts = false
): Promise<CreativeSummary | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(WITH_DETAIL)
    .eq("username", username)
    .maybeSingle()
    .returns<ProfileJoin>()

  if (error) throw new Error(error.message)
  if (!data) return null

  return toCreative(data, includeDrafts)
}

export async function getCreativeById(
  userId: string,
  includeDrafts = false
): Promise<CreativeSummary | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(WITH_DETAIL)
    .eq("id", userId)
    .maybeSingle()
    .returns<ProfileJoin>()

  if (error) throw new Error(error.message)
  if (!data) return null

  return toCreative(data, includeDrafts)
}

export interface ProfileInput {
  name?: string
  username?: string
  avatarUrl?: string
}

export async function updateProfile(
  userId: string,
  input: ProfileInput
): Promise<User> {
  return toUser(
    unwrap(
      await supabase
        .from("profiles")
        .update({
          ...(input.name !== undefined && { name: input.name.trim() }),
          ...(input.username !== undefined && {
            username: input.username.trim().toLowerCase() || null,
          }),
          ...(input.avatarUrl !== undefined && {
            avatar_url: input.avatarUrl || null,
          }),
        })
        .eq("id", userId)
        .select("*")
        .single()
        .returns<ProfileRow>()
    )
  )
}

export interface FreelancerProfileInput {
  tagline?: string
  bio?: string
  skills?: string[]
  hourlyRate?: number | null
  currency?: string
  publicProfileEnabled?: boolean
  website?: string
  linkedin?: string
  github?: string
}

export async function upsertFreelancerProfile(
  userId: string,
  username: string,
  input: FreelancerProfileInput
): Promise<FreelancerProfile> {
  return toFreelancerProfile(
    unwrap(
      await supabase
        .from("freelancer_profiles")
        .upsert(
          {
            user_id: userId,
            ...(input.tagline !== undefined && {
              tagline: input.tagline || null,
            }),
            ...(input.bio !== undefined && { bio: input.bio || null }),
            ...(input.skills !== undefined && { skills: input.skills }),
            ...(input.hourlyRate !== undefined && {
              hourly_rate: input.hourlyRate,
            }),
            ...(input.currency !== undefined && { currency: input.currency }),
            ...(input.publicProfileEnabled !== undefined && {
              public_profile_enabled: input.publicProfileEnabled,
            }),
            ...(input.website !== undefined && {
              website_url: input.website || null,
            }),
            ...(input.linkedin !== undefined && {
              linkedin_url: input.linkedin || null,
            }),
            ...(input.github !== undefined && {
              github_url: input.github || null,
            }),
          },
          { onConflict: "user_id" }
        )
        .select("*")
        .single()
        .returns<FreelancerProfileRow>()
    ),
    username
  )
}
