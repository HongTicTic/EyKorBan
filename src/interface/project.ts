export interface Project {
  projectId: string
  userId: string
  projectTitle: string
  projectDesc: string
  tag: Tag[]
  img: string[]
  category: Category.GENERAL
  pubDate: Date
}

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
