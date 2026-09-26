import { ArrowRight } from "lucide-react"

import { ProjectCard } from "@/components/project-card"
import type { User } from "@/interface/user"
import type { PortfolioListItem } from "@/services/portfolio"

interface RelatedWorkProps {
  author: User
  items: PortfolioListItem[]
  onBrowseAll?: () => void
}

/**
 * FR-005: the grid under the work. Each card is already a link to its own
 * detail page, so this section needs no navigation callback of its own.
 */
export function RelatedWork({ author, items, onBrowseAll }: RelatedWorkProps) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            More from {author.name}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Curated portfolio deliverables and related creative showcase work
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseAll}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>Explore all projects</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(({ card, author: cardAuthor }) => (
          <ProjectCard
            key={card.id}
            project={card}
            authorName={cardAuthor?.name ?? author.name}
            authorAvatar={cardAuthor?.avatarUrl ?? author.avatarUrl}
            className="max-w-none"
          />
        ))}
      </div>
    </section>
  )
}
