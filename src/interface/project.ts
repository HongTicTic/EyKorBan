export interface Tag {
  tagId: string
  tagName: string
}

export const enum Category {
  GENERAL = "GENERAL",
  TECH = "TECH",
  DESIGN = "DESIGN",
  BUSINESS = "BUSINESS",
  OTHER = "OTHER",
}

export interface Project {
  projectId: string
  userId: string
  projectTitle: string
  projectDesc: string
  tag: Tag[]
  img: string[]
  category: Category
  pubDate: Date | string
  subtitle?: string
  likeCount?: number
  viewCount?: number
}
