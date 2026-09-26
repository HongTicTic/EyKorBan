import type { Job } from "@/interface/job"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"
import type { ProfileRow } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"

const toUser = (row: ProfileRow): User => ({
  userId: row.id,
  name: row.name,
  username: row.username ?? undefined,
  role: row.role as User["role"],
  email: row.email ?? "",
  avatarUrl: row.avatar_url ?? undefined,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastLoginAt: row.last_login_at ?? undefined,
})

export async function listUsers(): Promise<User[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, username, role, avatar_url, status, created_at, updated_at")
  if (error) throw error
  return data.map(toUser)
}

export async function listFreelancerProfiles(): Promise<FreelancerProfile[]> {
  if (!supabase) return []
  const [{ data, error }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabase.from("freelancer_profiles").select("*"),
      supabase.from("profiles").select("id, username"),
    ])
  if (error) throw error
  if (profilesError) throw profilesError
  const usernames = new Map(profiles.map((profile) => [profile.id, profile.username]))
  return data.map((row) => ({
    userId: row.user_id,
    username: usernames.get(row.user_id) ?? "",
    tagline: row.tagline ?? undefined,
    bio: row.bio ?? undefined,
    skills: row.skills,
    hourlyRate: row.hourly_rate ?? undefined,
    currency: row.currency,
    publicProfileEnabled: row.public_profile_enabled,
    socialLinks: {
      website: row.website_url ?? undefined,
      linkedin: row.linkedin_url ?? undefined,
      github: row.github_url ?? undefined,
    },
  }))
}

export async function listProjectCards(): Promise<ProjectCard[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("portfolio_items").select("*")
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    coverImageUrl: row.cover_image_url ?? "",
    categoryId: row.category_id ?? "",
    industryId: row.industry_id ?? undefined,
    freelanceId: row.freelancer_id,
    status: row.status,
    publishedAt: row.published_at ?? row.created_at,
    likeCount: row.like_count,
    viewCount: row.view_count,
  }))
}

export async function listJobs(): Promise<Job[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("jobs").select("*")
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    description: row.description,
    categoryId: row.category_id ?? "",
    industryId: row.industry_id ?? "",
    status: row.status,
    publishedAt: row.published_at,
  }))
}