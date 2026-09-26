export interface ProjectCard {
  id: string
  title: string
  subtitle: string
  coverImageUrl: string
  categoryId: string
  /** Set since the move to Supabase; drives the industry filter. */
  industryId?: string
  freelanceId: string
  /** Drafts are visible only to their owner (FR-009). */
  status?: "draft" | "published"
  publishedAt: string
  likeCount: number
  viewCount: number
}
