import * as React from "react"
import { Link } from "react-router"
import { AlertTriangle } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { AuthorCard } from "@/components/portfolio-detail/author-card"
import { CaseStudyCard } from "@/components/portfolio-detail/case-study-card"
import { DetailToolbar } from "@/components/portfolio-detail/detail-toolbar"
import { PackageCard } from "@/components/portfolio-detail/package-card"
import {
  PLACEHOLDER_AUTHOR_STATS,
  PLACEHOLDER_PACKAGE,
  placeholderCaseStudy,
  placeholderGallery,
} from "@/components/portfolio-detail/placeholder-content"
import { RelatedWork } from "@/components/portfolio-detail/related-work"
import { WorkGallery } from "@/components/portfolio-detail/work-gallery"
import { WorkSummary } from "@/components/portfolio-detail/work-summary"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useWorkDetail } from "@/hooks/use-work-detail"
import type { ProjectCard } from "@/interface/projectCard"
import type { User } from "@/interface/user"
import { cn } from "@/lib/utils"
import type { PortfolioListItem } from "@/services/portfolio"

export interface PortfolioDetailProps {
  projectId?: string
  onBack?: () => void
  className?: string
}

interface PortfolioDetailViewProps {
  work: ProjectCard
  author: User
  related: PortfolioListItem[]
  onBack?: () => void
  className?: string
}

/**
 * Lays out the sections. The only state here is the viewer's save, because
 * two sections show it: the toolbar button and the saves count in the summary.
 */
function PortfolioDetailView({
  work,
  author,
  related,
  onBack,
  className,
}: PortfolioDetailViewProps) {
  // Saving is local to this visit for now. The count is derived, not stored,
  // so it cannot drift from the heart.
  const [isSaved, setIsSaved] = React.useState(false)
  const saveCount = work.likeCount + (isSaved ? 1 : 0)

  return (
    <div
      className={cn(
        "w-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary",
        className
      )}
    >
      <DetailToolbar
        shareTitle={work.title}
        shareText={`${work.title} — ${work.subtitle || "on EyKorBan"}`}
        isSaved={isSaved}
        saveCount={saveCount}
        onToggleSave={() => setIsSaved((saved) => !saved)}
        onBack={onBack}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-8">
            <WorkGallery slides={placeholderGallery(work)} />
            <CaseStudyCard caseStudy={placeholderCaseStudy(work)} />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="sticky top-[120px] space-y-5">
              <WorkSummary work={work} saveCount={saveCount} />
              <AuthorCard author={author} stats={PLACEHOLDER_AUTHOR_STATS} />
              <PackageCard workId={work.id} offer={PLACEHOLDER_PACKAGE} />
            </div>
          </div>
        </div>

        <RelatedWork author={author} items={related} onBrowseAll={onBack} />
      </div>
    </div>
  )
}

/**
 * FR-004 / FR-005: the work detail page. Loading, failure and not-found are
 * handled here, so the view below only ever renders a loaded item.
 */
export function PortfolioDetail({
  projectId,
  onBack,
  className,
}: PortfolioDetailProps) {
  const { data, error, isLoading, refetch } = useWorkDetail(projectId)

  if (isLoading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Could not load this project"
          description={error}
          action={
            <Button variant="outline" onClick={refetch}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!data || !data.item.author) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Project not found"
          description="This work may have been unpublished or removed."
          action={
            <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Browse published work
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <PortfolioDetailView
      // Keyed so that moving to another work item starts fresh: first slide,
      // lightbox closed, not saved.
      key={data.item.card.id}
      work={data.item.card}
      author={data.item.author}
      related={data.related}
      onBack={onBack}
      className={className}
    />
  )
}

export default PortfolioDetail
