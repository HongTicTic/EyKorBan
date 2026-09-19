export interface Job {
  id: string
  clientId: string
  title: string
  description: string
  categoryId: string
  industryId: string
  status: "open" | "closed"
  publishedAt: string
}
