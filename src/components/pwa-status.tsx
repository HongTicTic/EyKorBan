import * as React from "react"
import { CloudUpload, WifiOff } from "lucide-react"
import { useRegisterSW } from "virtual:pwa-register/react"

import { useOutbox } from "@/components/outbox-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/**
 * Two things a PWA owes the user that a normal site does not:
 * tell them when they are offline (so stale data is explained rather than
 * looking like a bug), and tell them when a new version is waiting.
 */
export function PwaStatus() {
  const [offline, setOffline] = React.useState(!navigator.onLine)
  const { pending, isFlushing } = useOutbox()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  React.useEffect(() => {
    const online = () => setOffline(false)
    const gone = () => setOffline(true)

    window.addEventListener("online", online)
    window.addEventListener("offline", gone)

    return () => {
      window.removeEventListener("online", online)
      window.removeEventListener("offline", gone)
    }
  }, [])

  if (offline) {
    return (
      <div
        role="status"
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-xs font-medium text-amber-950"
        style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
      >
        <WifiOff className="size-3.5" />
        {pending > 0 ? (
          <>
            Offline — {pending} {pending === 1 ? "change" : "changes"} will sync
            when you reconnect
          </>
        ) : (
          <>Offline — showing the last loaded data</>
        )}
      </div>
    )
  }

  // Back online with a backlog: say so, rather than letting writes land
  // silently minutes after the user pressed Publish.
  if (pending > 0) {
    return (
      <div
        role="status"
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-sky-600 px-4 py-1.5 text-xs font-medium text-white"
        style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
      >
        {isFlushing ? (
          <Spinner className="size-3.5" />
        ) : (
          <CloudUpload className="size-3.5" />
        )}
        Syncing {pending} queued {pending === 1 ? "change" : "changes"}…
      </div>
    )
  }

  if (needRefresh) {
    return (
      <div
        role="status"
        className="fixed inset-x-3 z-[60] flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
        style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
      >
        <p className="text-sm">A new version is ready.</p>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" onClick={() => void updateServiceWorker(true)}>
            Reload
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setNeedRefresh(false)}
          >
            Later
          </Button>
        </div>
      </div>
    )
  }

  return null
}
