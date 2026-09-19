import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Eye,
  Heart,
  MapPin,
  Maximize2,
  Share2,
  Shield,
  Star,
  Zap,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/project-card"
import { MOCK_PROJECT_CARDS, MOCK_USERS } from "@/mock-data/mock-data"
import { getCategoryName } from "@/interface/category"

// ============================================================================
// Types
// ============================================================================

interface GallerySlide {
  id: string
  label: string
  badgeText: string
  image: string
}

export interface PortfolioDetailProps {
  projectId?: string
  onBack?: () => void
  onSelectProject?: (id: string) => void
  onStartProject?: () => void
  onSendInquiry?: () => void
  className?: string
}

function getInitials(name?: string): string {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ============================================================================
// Main Component
// ============================================================================

export function PortfolioDetail({
  projectId,
  onBack,
  onSelectProject,
  onStartProject,
  onSendInquiry,
  className,
}: PortfolioDetailProps) {
  // Map of users from home mock data
  const userMap = React.useMemo(
    () => new Map(MOCK_USERS.map((user) => [user.userId, user])),
    []
  )

  // Resolve current project from home mock data
  const project = React.useMemo(() => {
    return (
      MOCK_PROJECT_CARDS.find((p) => p.id === projectId) ??
      MOCK_PROJECT_CARDS[0]
    )
  }, [projectId])

  // Resolve project author
  const author = React.useMemo(() => {
    return userMap.get(project.freelanceId) ?? MOCK_USERS[0]
  }, [project.freelanceId, userMap])

  const categoryName = getCategoryName(project.categoryId)

  // Dynamic gallery slides based on the selected project
  const gallerySlides: GallerySlide[] = React.useMemo(
    () => [
      {
        id: "01",
        label: "Flow",
        badgeText: `01 / 04 · ${project.title}`,
        image: project.coverImageUrl,
      },
      {
        id: "02",
        label: "Cards",
        badgeText: `02 / 04 · ${project.subtitle} Interface`,
        image:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "03",
        label: "System",
        badgeText: "03 / 04 · Cross-Platform Architecture & Flow",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "04",
        label: "Tokens",
        badgeText: "04 / 04 · Tokenized Components & Design System",
        image:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    [project.title, project.subtitle, project.coverImageUrl]
  )

  // Gallery Slide State
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0)
  const activeSlide = gallerySlides[activeSlideIndex] ?? gallerySlides[0]

  // Lightbox fullscreen state
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)

  // Save / Heart state
  const [isSaved, setIsSaved] = React.useState(false)
  const [saveCount, setSaveCount] = React.useState(project.likeCount)

  // Reset when project changes
  React.useEffect(() => {
    setActiveSlideIndex(0)
    setIsSaved(false)
    setSaveCount(project.likeCount)
  }, [project.id, project.likeCount])

  // Modals
  const [isProjectDialogOpen, setIsProjectDialogOpen] = React.useState(false)
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = React.useState(false)

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
    showToast("Project link copied to clipboard!")
  }

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev
      setSaveCount((c) => (next ? c + 1 : c - 1))
      return next
    })
  }

  // Format publish date
  const formattedDate = React.useMemo(() => {
    try {
      return new Date(project.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Recent"
    }
  }, [project.publishedAt])

  // Related projects using Home screen standard MOCK_PROJECT_CARDS
  const moreProjects = React.useMemo(() => {
    const fromSameAuthor = MOCK_PROJECT_CARDS.filter(
      (p) => p.freelanceId === project.freelanceId && p.id !== project.id
    )
    if (fromSameAuthor.length >= 4) {
      return fromSameAuthor.slice(0, 4)
    }
    const otherProjects = MOCK_PROJECT_CARDS.filter(
      (p) => p.id !== project.id && !fromSameAuthor.some((f) => f.id === p.id)
    )
    return [...fromSameAuthor, ...otherProjects].slice(0, 4)
  }, [project.id, project.freelanceId])

  return (
    <div
      className={cn(
        "w-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary",
        className
      )}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-lg">
          <CheckCircle className="size-4 text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          Sub-Header: Breadcrumb & Share / Save (Sticky below app Header)
      ==================================================================== */}
      <div className="sticky top-[57px] z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Explore</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8.5 gap-1.5 rounded-lg border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted shadow-2xs cursor-pointer"
            >
              <Share2 className="size-3.5 text-muted-foreground" />
              <span>Share</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSave}
              className={cn(
                "h-8.5 gap-1.5 rounded-lg border-border px-3 text-xs font-medium transition-colors shadow-2xs cursor-pointer",
                isSaved
                  ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              <Heart
                className={cn(
                  "size-3.5",
                  isSaved ? "fill-current text-primary" : "text-muted-foreground"
                )}
              />
              <span>Save {saveCount.toLocaleString()}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          Main Content Body (Follows container mx-auto px-4 py-8 standard)
      ==================================================================== */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ================================================================
              Left Column: Hero Showcase, Thumbnails, Case Study Brief
          ================================================================ */}
          <div className="space-y-6 lg:col-span-8">
            {/* Hero Main Slide Container */}
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-xs">
              <img
                src={activeSlide.image}
                alt={activeSlide.badgeText}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Floating Badge on Main Hero Viewport */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-black/10 bg-black/60 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span>{activeSlide.badgeText}</span>
              </div>

              {/* Expand to fullscreen Lightbox trigger */}
              <button
                type="button"
                aria-label="Expand image"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
              >
                <Maximize2 className="size-4" />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallerySlides.map((slide, index) => {
                const isSelected = activeSlideIndex === index
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(index)}
                    className={cn(
                      "relative aspect-[16/10] w-full overflow-hidden rounded-xl border transition-all cursor-pointer",
                      isSelected
                        ? "border-primary ring-2 ring-primary/25 shadow-xs"
                        : "border-border hover:border-muted-foreground/40"
                    )}
                  >
                    <img
                      src={slide.image}
                      alt={slide.label}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      {slide.label}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Case Study Card */}
            <div className="space-y-8 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 shadow-2xs">
              {/* Header & Strategic Scope */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-bold tracking-wide text-primary uppercase">
                    CASE STUDY BRIEF
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-medium">
                    Completed in 14 days
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-[26px]">
                  The Challenge: {project.title}
                </h2>

                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Delivered for high-growth modern products, this initiative involved crafting an end-to-end
                  solution for {project.subtitle}. From initial discovery and design architecture to final
                  production-ready deliverables, every milestone was executed with rigorous attention to craft and detail.
                </p>
              </div>

              {/* Core Deliverables (2x2 Dot-Bullet Grid matching reference screenshot) */}
              <div className="space-y-4">
                <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  CORE DELIVERABLES
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                  {/* Item 1 */}
                  <div className="flex items-start gap-2.5">
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-foreground">
                        Mobile App Architecture
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        14 core transaction flows and dual-wallet balance management.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-2.5">
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-foreground">
                        Figma Component Library
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        120+ accessible Auto Layout components with dark/light variants.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-2.5">
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-foreground">
                        Micro-Interactions & Motion
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Fluid 60fps haptic transition specs and biometric confirmation states.
                      </p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-2.5">
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-foreground">
                        Escrow Protection Flow
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Milestones, release confirmations, and dispute resolution UX.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flat Metric Highlights (Unboxed) */}
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border/70 pt-6 text-center">
                <div className="px-2 sm:px-4">
                  <div className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                    99.4%
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    Usability Benchmark
                  </div>
                </div>
                <div className="px-2 sm:px-4">
                  <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    14 Days
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    Concept to Prototype
                  </div>
                </div>
                <div className="px-2 sm:px-4">
                  <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center justify-center gap-1">
                    <span>4.9</span>
                    <Star className="size-4.5 text-amber-500 fill-amber-500 inline" />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    Client Milestone Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              Right Column: Sidebar (Freelancer Profile & Fixed Price Package)
          ================================================================ */}
          <div className="space-y-6 lg:col-span-4">
            <div className="sticky top-[120px] space-y-5">
              {/* Badges & Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className="rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 font-medium text-xs">
                    {categoryName}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-secondary text-secondary-foreground font-normal text-xs"
                  >
                    {project.subtitle}
                  </Badge>
                </div>

                <h1 className="text-xl font-bold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
                  {project.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{formattedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3" />
                    <span>{saveCount.toLocaleString()} saves</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{project.viewCount.toLocaleString()} views</span>
                  </span>
                </div>
              </div>

              {/* Freelancer Author Profile Card */}
              <div className="rounded-2xl border border-border bg-card text-card-foreground p-5 space-y-4.5 shadow-2xs">
                {/* Header: Avatar, Name, Verification, PRO Badge, Title, Location */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <Avatar className="size-13 border border-border">
                      <AvatarImage
                        src={author.avatarUrl}
                        alt={author.name}
                      />
                      <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold tracking-tight text-foreground">
                        {author.name}
                      </span>
                      <CheckCircle className="size-4 text-sky-500 fill-sky-500" />
                      <span className="rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        PRO
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-primary">
                      Lead Product & Systems Designer
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span>Phnom Penh (ICT · UTC+7)</span>
                    </div>
                  </div>
                </div>

                {/* 1 Column Metrics List (Directly in card without nested box) */}
                <div className="divide-y divide-border/60 border-t border-border/60 pt-1">
                  {/* Rating */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Star className="size-4 text-amber-500 fill-amber-500 shrink-0" />
                      <span>Rating</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      4.9 <span className="font-normal text-muted-foreground">(42)</span>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Zap className="size-4 text-rose-500 shrink-0" />
                      <span>Response</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      &lt; 1 hour
                    </div>
                  </div>

                  {/* On-Time */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                      <span>On-Time</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      100%
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Award className="size-4 text-sky-500 shrink-0" />
                      <span>Experience</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      8+ Years
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed-Scope Package & Starting Rate Card */}
              <div className="rounded-2xl border border-border bg-card text-card-foreground p-5 space-y-4 shadow-2xs relative overflow-hidden">
                {/* Red Top Accent Line (Primary Brand Token) */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Fixed-scope package
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold tracking-tight text-primary">
                      From $4,500
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estimated timeline</span>
                    <span className="font-medium text-foreground">2-3 weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deliverables</span>
                    <span className="font-medium text-foreground">
                      Full source, Assets, Specs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contract model</span>
                    <span className="font-medium text-primary inline-flex items-center gap-1">
                      <Shield className="size-3 fill-primary/20 text-primary" />
                      <span>Milestone Escrow</span>
                    </span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={() => {
                      setIsProjectDialogOpen(true)
                      onStartProject?.()
                    }}
                    className="w-full h-10.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
                  >
                    <span>Start a project</span>
                    <ArrowRight className="size-3.5" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsInquiryDialogOpen(true)
                      onSendInquiry?.()
                    }}
                    className="w-full h-9.5 rounded-xl border-border bg-card hover:bg-muted text-foreground font-medium text-xs cursor-pointer shadow-2xs"
                  >
                    Inquire availability
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            Bottom Section: Designer Portfolio (More from Author)
            Standard 4-column ProjectCard grid matching Home.tsx
        ==================================================================== */}
        <section className="mt-16 pt-10 border-t border-border">
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
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <span>Explore all projects</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {moreProjects.map((p) => {
              const pAuthor = userMap.get(p.freelanceId) ?? author
              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  authorName={pAuthor.name}
                  authorAvatar={pAuthor.avatarUrl}
                  className="max-w-none"
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectProject?.(p.id)
                  }}
                />
              )
            })}
          </div>
        </section>
      </div>

      {/* ====================================================================
          Interactive Dialog: Start a Project
      ==================================================================== */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Start a project with {author.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Fixed-scope milestone package backed by the Jes Escrow Guarantee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Project Scope
              </label>
              <input
                type="text"
                defaultValue={`${project.title} — ${project.subtitle}`}
                className="mt-1.5 w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Fixed-scope package</span>
                <span className="font-semibold text-foreground">$4,500</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Escrow Fee (10%)</span>
                <span>$450</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xs font-bold text-foreground">
                <span>Total Escrow Deposit</span>
                <span className="text-primary font-bold">$4,950</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProjectDialogOpen(false)}
              className="rounded-xl border-border bg-card text-foreground hover:bg-muted cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsProjectDialogOpen(false)
                showToast(`Milestone project request submitted to ${author.name}!`)
              }}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Confirm Escrow Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================================
          Interactive Dialog: Send Inquiry
      ==================================================================== */}
      <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Inquire with {author.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send a direct question regarding scope, milestones, or availability.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <textarea
              rows={4}
              placeholder={`Hi ${author.name}, I'd like to discuss custom requirements for ${project.title}...`}
              className="w-full rounded-xl border border-border bg-muted/50 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInquiryDialogOpen(false)}
              className="rounded-xl border-border bg-card text-foreground hover:bg-muted cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsInquiryDialogOpen(false)
                showToast(`Inquiry message delivered to ${author.name}!`)
              }}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================================
          Interactive Lightbox Dialog
      ==================================================================== */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl p-2 bg-black/95 border-none text-white rounded-2xl overflow-hidden">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
            <img
              src={activeSlide.image}
              alt={activeSlide.badgeText}
              className="h-full w-full object-contain"
            />
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md">
              {activeSlide.badgeText}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PortfolioDetail
