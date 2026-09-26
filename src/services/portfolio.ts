import type { ProjectCard } from "@/interface/projectCard"
import type { User } from "@/interface/user"
import type { PortfolioItemRow, ProfileRow } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"
import { PROFILE_COLUMNS } from "@/services/columns"
import { describeError, unwrap } from "@/services/errors"
import { toProjectCard, toUser } from "@/services/mappers"

export type PortfolioSort = "recent" | "oldest" | "likes" | "views" | "popular"

export interface PortfolioFilters {
  /** "all" or undefined means no filter. */
  categoryId?: string
  industryId?: string
  sort?: PortfolioSort
  limit?: number
}

export interface PortfolioListItem {
  card: ProjectCard
  author: User | null
}

const WITH_AUTHOR = `*, author:profiles!portfolio_items_freelancer_id_fkey(${PROFILE_COLUMNS})`

type RowWithAuthor = PortfolioItemRow & { author: ProfileRow | null }

function isFiltered(value?: string): value is string {
  return Boolean(value) && value !== "all"
}

function toListItem(row: RowWithAuthor): PortfolioListItem {
  return {
    card: toProjectCard(row),
    author: row.author ? toUser(row.author) : null,
  }
}

/**
 * FR-001 … FR-003. Filtering and ordering run in Postgres so a phone on a slow
 * connection never downloads rows it is about to discard.
 */
export async function listPublishedWork(
  filters: PortfolioFilters = {}
): Promise<PortfolioListItem[]> {
  let query = supabase
    .from("portfolio_items")
    .select(WITH_AUTHOR)
    .eq("status", "published")

  if (isFiltered(filters.categoryId)) {
    query = query.eq("category_id", filters.categoryId)
  }
  if (isFiltered(filters.industryId)) {
    query = query.eq("industry_id", filters.industryId)
  }

  switch (filters.sort) {
    case "oldest":
      query = query.order("published_at", { ascending: true })
      break
    case "likes":
    case "popular":
      query = query.order("like_count", { ascending: false })
      break
    case "views":
      query = query.order("view_count", { ascending: false })
      break
    default:
      query = query.order("published_at", { ascending: false })
  }

  query = query.order("id", { ascending: true })
  if (filters.limit) query = query.limit(filters.limit)

  const rows = unwrap(await query.returns<RowWithAuthor[]>())
  return rows.map(toListItem)
}

/** FR-004. */
export async function getWorkById(id: string): Promise<PortfolioListItem> {
  return toListItem(
    unwrap(
      await supabase
        .from("portfolio_items")
        .select(WITH_AUTHOR)
        .eq("id", id)
        .maybeSingle()
        .returns<RowWithAuthor>()
    )
  )
}

/** FR-005: related work in the same category. */
export async function listRelatedWork(
  item: ProjectCard,
  limit = 4
): Promise<PortfolioListItem[]> {
  if (!item.categoryId) return []

  const rows = unwrap(
    await supabase
      .from("portfolio_items")
      .select(WITH_AUTHOR)
      .eq("status", "published")
      .eq("category_id", item.categoryId)
      .neq("id", item.id)
      .order("like_count", { ascending: false })
      .limit(limit)
      .returns<RowWithAuthor[]>()
  )

  return rows.map(toListItem)
}

/** The caller's own work. RLS returns drafts only to their owner. */
export async function listWorkByFreelancer(
  freelancerId: string
): Promise<ProjectCard[]> {
  const rows = unwrap(
    await supabase
      .from("portfolio_items")
      .select("*")
      .eq("freelancer_id", freelancerId)
      .order("published_at", { ascending: false, nullsFirst: true })
      .returns<PortfolioItemRow[]>()
  )

  return rows.map(toProjectCard)
}

export interface WorkInput {
  title: string
  subtitle?: string
  description?: string
  coverImageUrl?: string
  categoryId?: string
  industryId?: string
  status: "draft" | "published"
}

/** FR-008 / FR-010. */
export async function createWork(
  freelancerId: string,
  input: WorkInput
): Promise<ProjectCard> {
  return toProjectCard(
    unwrap(
      await supabase
        .from("portfolio_items")
        .insert({
          freelancer_id: freelancerId,
          title: input.title.trim(),
          subtitle: input.subtitle?.trim() || null,
          description: input.description?.trim() || null,
          cover_image_url: input.coverImageUrl || null,
          category_id: input.categoryId || null,
          industry_id: input.industryId || null,
          status: input.status,
        })
        .select("*")
        .single()
        .returns<PortfolioItemRow>()
    )
  )
}

/** FR-011. Ownership is enforced by RLS, not by a check here. */
export async function updateWork(
  id: string,
  input: Partial<WorkInput>
): Promise<ProjectCard> {
  return toProjectCard(
    unwrap(
      await supabase
        .from("portfolio_items")
        .update({
          ...(input.title !== undefined && { title: input.title.trim() }),
          ...(input.subtitle !== undefined && {
            subtitle: input.subtitle || null,
          }),
          ...(input.description !== undefined && {
            description: input.description || null,
          }),
          ...(input.coverImageUrl !== undefined && {
            cover_image_url: input.coverImageUrl || null,
          }),
          ...(input.categoryId !== undefined && {
            category_id: input.categoryId || null,
          }),
          ...(input.industryId !== undefined && {
            industry_id: input.industryId || null,
          }),
          ...(input.status !== undefined && { status: input.status }),
        })
        .eq("id", id)
        .select("*")
        .single()
        .returns<PortfolioItemRow>()
    )
  )
}

export async function deleteWork(id: string): Promise<void> {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id)
  if (error) throw new Error(describeError(error))
}

/** Uploads into the signed-in user's own folder; storage policies enforce it. */
export async function uploadWorkImage(
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const path = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, { cacheControl: "3600", upsert: false })

  if (error) throw new Error(error.message)

  return supabase.storage.from("portfolio-images").getPublicUrl(path).data
    .publicUrl
}
