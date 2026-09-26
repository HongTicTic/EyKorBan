import type { ProjectCard } from "@/interface/projectCard"

import type { AuthorStats } from "./author-card"
import type { CaseStudy } from "./case-study-card"
import type { GallerySlide } from "./work-gallery"
import type { WorkPackage } from "./package-card"

/**
 * Stand-in copy and numbers for the work detail page.
 *
 * The page was designed before any of this had a source, so every work item
 * and every freelancer shows the same values. The schema has no columns for
 * reviews, response time, location, experience or a package price, and the
 * page does not yet read the `description` and `images` columns that do exist.
 *
 * Keeping it all here means the section components only render what they are
 * given: swapping a block for real data changes this file and the page that
 * passes it, not the markup.
 */

const STOCK_IMAGE = (photo: string) =>
  `https://images.unsplash.com/${photo}?q=80&w=1200&auto=format&fit=crop`

/** The real cover first, then three stock images unrelated to the work. */
export function placeholderGallery(work: ProjectCard): GallerySlide[] {
  return [
    {
      id: "01",
      label: "Flow",
      caption: work.title,
      image: work.coverImageUrl,
    },
    {
      id: "02",
      label: "Cards",
      caption: `${work.subtitle} Interface`,
      image: STOCK_IMAGE("photo-1563986768609-322da13575f3"),
    },
    {
      id: "03",
      label: "System",
      caption: "Cross-Platform Architecture & Flow",
      image: STOCK_IMAGE("photo-1551288049-bebda4e38f71"),
    },
    {
      id: "04",
      label: "Tokens",
      caption: "Tokenized Components & Design System",
      image: STOCK_IMAGE("photo-1618005182384-a83a8bd57fbe"),
    },
  ]
}

export function placeholderCaseStudy(work: ProjectCard): CaseStudy {
  return {
    duration: "14 days",
    heading: `The Challenge: ${work.title}`,
    summary:
      "Delivered for high-growth modern products, this initiative involved " +
      `crafting an end-to-end solution for ${work.subtitle}. From initial ` +
      "discovery and design architecture to final production-ready " +
      "deliverables, every milestone was executed with rigorous attention to " +
      "craft and detail.",
    deliverables: [
      {
        title: "Mobile App Architecture",
        description:
          "14 core transaction flows and dual-wallet balance management.",
      },
      {
        title: "Figma Component Library",
        description:
          "120+ accessible Auto Layout components with dark/light variants.",
      },
      {
        title: "Micro-Interactions & Motion",
        description:
          "Fluid 60fps haptic transition specs and biometric confirmation states.",
      },
      {
        title: "Escrow Protection Flow",
        description:
          "Milestones, release confirmations, and dispute resolution UX.",
      },
    ],
    metrics: [
      { value: "99.4%", label: "Usability Benchmark", accent: true },
      { value: "14 Days", label: "Concept to Prototype" },
      { value: "4.9", label: "Client Milestone Score", rating: true },
    ],
  }
}

export const PLACEHOLDER_AUTHOR_STATS: AuthorStats = {
  headline: "Lead Product & Systems Designer",
  location: "Phnom Penh (ICT · UTC+7)",
  isVerified: true,
  isPro: true,
  isOnline: true,
  rating: "4.9",
  reviewCount: 42,
  responseTime: "< 1 hour",
  onTimeRate: "100%",
  experience: "8+ Years",
}

export const PLACEHOLDER_PACKAGE: WorkPackage = {
  price: "From $4,500",
  timeline: "2-3 weeks",
  deliverables: "Full source, Assets, Specs",
  contractModel: "Milestone Escrow",
}
