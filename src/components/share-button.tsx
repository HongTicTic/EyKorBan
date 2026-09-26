import * as React from "react"
import { Check, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  title: string
  text?: string
  /** Defaults to the current page. */
  url?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

/**
 * Lesson 7.4: native sharing via the Web Share API.
 *
 * On a phone this opens the real share sheet. The API does not exist on most
 * desktop browsers, so the fallback copies the link to the clipboard — and
 * because `navigator.clipboard` needs a secure context and can itself be
 * blocked, there is a final fallback using a hidden textarea.
 *
 * Cancelling the share sheet rejects with AbortError. That is the user saying
 * "no", not a failure, so it is swallowed.
 */
export function ShareButton({
  title,
  text,
  url,
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyToClipboard(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // Insecure context, or permission denied.
      try {
        const field = document.createElement("textarea")
        field.value = value
        field.setAttribute("readonly", "")
        field.style.position = "fixed"
        field.style.opacity = "0"
        document.body.appendChild(field)
        field.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(field)
        return ok
      } catch {
        return false
      }
    }
  }

  async function handleShare() {
    const shareUrl = url ?? window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
        return
      } catch (error) {
        // The user dismissed the sheet — not something to report.
        if (error instanceof Error && error.name === "AbortError") return
        // Anything else: fall through to the clipboard.
      }
    }

    if (await copyToClipboard(shareUrl)) setCopied(true)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label={copied ? "Link copied" : `Share ${title}`}
    >
      {copied ? (
        <>
          <Check data-icon="inline-start" />
          Copied
        </>
      ) : (
        <>
          <Share2 data-icon="inline-start" />
          Share
        </>
      )}
    </Button>
  )
}
