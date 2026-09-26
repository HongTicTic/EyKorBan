import type { Job } from "@/interface/job"
import type { ProjectCard } from "@/interface/projectCard"
import type { FreelancerProfile, User } from "@/interface/user"
import { RoleName } from "@/interface/user"
import type {
  FreelancerProfileRow,
  JobRow,
  PortfolioItemRow,
  ProfileRow,
} from "@/lib/database.types"

/**
 * The database is snake_case; the interfaces in src/interface are camelCase and
 * already wired through every card and page. These functions are the single
 * seam between the two, so components did not have to change shape when the
 * mock arrays were replaced by queries.
 */

export function toUser(row: ProfileRow): User {
  return {
    userId: row.id,
    name: row.name,
    username: row.username ?? undefined,
    role: row.role as RoleName,
    email: row.email,
    avatarUrl: row.avatar_url ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at ?? undefined,
  }
}

export function toFreelancerProfile(
  row: FreelancerProfileRow,
  username: string
): FreelancerProfile {
  const socialLinks = {
    website: row.website_url ?? undefined,
    linkedin: row.linkedin_url ?? undefined,
    github: row.github_url ?? undefined,
  }

  return {
    userId: row.user_id,
    username,
    tagline: row.tagline ?? undefined,
    bio: row.bio ?? undefined,
    skills: row.skills ?? [],
    hourlyRate: row.hourly_rate ?? undefined,
    currency: row.currency,
    publicProfileEnabled: row.public_profile_enabled,
    socialLinks,
  }
}

export function toProjectCard(row: PortfolioItemRow): ProjectCard {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    coverImageUrl: row.cover_image_url ?? "",
    categoryId: row.category_id ?? "",
    industryId: row.industry_id ?? undefined,
    freelanceId: row.freelancer_id,
    status: row.status,
    // Drafts have no published_at; fall back so date formatting stays safe.
    publishedAt: row.published_at ?? row.created_at,
    likeCount: row.like_count,
    viewCount: row.view_count,
  }
}

export function toJob(row: JobRow): Job {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    description: row.description,
    categoryId: row.category_id ?? "",
    industryId: row.industry_id ?? "",
    status: row.status,
    publishedAt: row.published_at,
  }
}
