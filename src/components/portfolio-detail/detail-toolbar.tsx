import { ArrowLeft, Heart } from "lucide-react"

import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DetailToolbarProps {
  shareTitle: string
  shareText: string
  isSaved: boolean
  saveCount: number
  onToggleSave: () => void
  onBack?: () => void
}

/** The bar that sticks under the app header: back, share and save. */
export function DetailToolbar({
  shareTitle,
  shareText,
  isSaved,
  saveCount,
  onToggleSave,
  onBack,
}: DetailToolbarProps) {
  return (
    <div className="sticky top-[57px] z-20 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          <ShareButton
            title={shareTitle}
            text={shareText}
            className="h-8.5 cursor-pointer gap-1.5 rounded-lg border-border bg-card px-3 text-xs font-medium text-foreground shadow-2xs hover:bg-muted"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSave}
            className={cn(
              "h-8.5 cursor-pointer gap-1.5 rounded-lg border-border px-3 text-xs font-medium shadow-2xs transition-colors",
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
  )
}
