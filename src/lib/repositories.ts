import type { Job } from "@/interface/job"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"
import { supabase } from "@/lib/supabase"

type DatabaseUser = {
  user_id: string
  name: string
  username: string | null
  role: "CLIENT" | "FREELANCER" | "ADMIN"
  email: string
  avatar_url: string | null
  status: User["status"]
  created_at: string
  updated_at: string
  last_login_at: string | null
}

const toUser = (row: DatabaseUser): User => ({
  userId: row.user_id,
  name: row.name,
  username: row.username ?? undefined,
  role: row.role as User["role"],
  email: row.email,
  avatarUrl: row.avatar_url ?? undefined,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastLoginAt: row.last_login_at ?? undefined,
})

export async function listUsers(): Promise<User[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("users").select("*")
  if (error) throw error
  return data.map(toUser)
}

export async function listFreelancerProfiles(): Promise<FreelancerProfile[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("freelancer_profiles").select("*")
  if (error) throw error
  return data.map((row) => ({
    userId: row.user_id,
    username: row.username,
    tagline: row.tagline ?? undefined,
    bio: row.bio ?? undefined,
    skills: row.skills,
    hourlyRate: row.hourly_rate ?? undefined,
    currency: row.currency,
    publicProfileEnabled: row.public_profile_enabled,
    socialLinks: row.social_links,
  }))
}

export async function listProjectCards(): Promise<ProjectCard[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("project_cards").select("*")
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    coverImageUrl: row.cover_image_url,
    categoryId: row.category_id,
    freelanceId: row.freelance_id,
    publishedAt: row.published_at,
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
    categoryId: row.category_id,
    industryId: row.industry_id,
    status: row.status,
    publishedAt: row.published_at,
  }))
}