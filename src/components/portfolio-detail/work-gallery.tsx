import * as React from "react"
import { Maximize2 } from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface GallerySlide {
  id: string
  /** Short name on the thumbnail. */
  label: string
  /** Follows the "01 / 04" position on the badge. */
  caption: string
  image: string
}

function slideBadge(index: number, total: number, caption: string) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(index + 1)} / ${pad(total)} · ${caption}`
}

/**
 * The hero image, its thumbnails and a fullscreen lightbox. Which slide is
 * showing is state only this section needs, so it lives here; the page keys
 * the whole view by work id, which starts every new item on the first slide.
 */
export function WorkGallery({ slides }: { slides: GallerySlide[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)

  const active = slides[activeIndex] ?? slides[0]
  const badge = slideBadge(activeIndex, slides.length, active.caption)

  return (
    <div className="space-y-6">
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-xs">
        <img
          width={1200}
          height={800}
          src={active.image}
          alt={badge}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />

        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-black/10 bg-black/60 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          <span>{badge}</span>
        </div>

        <button
          type="button"
          aria-label="Expand image"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:scale-110"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border transition-all",
              index === activeIndex
                ? "border-primary shadow-xs ring-2 ring-primary/25"
                : "border-border hover:border-muted-foreground/40"
            )}
          >
            <img
              width={400}
              height={300}
              loading="lazy"
              src={slide.image}
              alt={slide.label}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
              {slide.label}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] overflow-hidden rounded-2xl border-none bg-black/95 p-2 text-white sm:max-w-4xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
            <img
              width={400}
              height={300}
              loading="lazy"
              src={active.image}
              alt={badge}
              className="h-full w-full object-contain"
            />
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md">
              {badge}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
