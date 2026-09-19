export interface Category {
  id: string
  name: string
  slug: string
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All", slug: "all" },
  { id: "it-software", name: "IT & Software", slug: "it-software" },
  { id: "uiux", name: "UI/UX Design", slug: "ui-ux-design" },
  { id: "web-dev", name: "Web Development", slug: "web-development" },
  { id: "mobile-dev", name: "Mobile Development", slug: "mobile-development" },
  { id: "graphic-design", name: "Graphic Design", slug: "graphic-design" },
  { id: "branding", name: "Branding & Identity", slug: "branding-identity" },
  { id: "digital-marketing", name: "Digital Marketing", slug: "digital-marketing" },
  { id: "writing", name: "Writing & Translation", slug: "writing-translation" },
  { id: "video-animation", name: "Video & Animation", slug: "video-animation" },
  { id: "data-analytics", name: "Data & Analytics", slug: "data-analytics" },
  { id: "consulting", name: "Consulting", slug: "consulting" },
];

export function getCategoryName(categoryId?: string): string {
  if (!categoryId) return ""
  const found = CATEGORIES.find((c) => c.id === categoryId)
  return found ? found.name : categoryId
}