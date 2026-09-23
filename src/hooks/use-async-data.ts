import * as React from "react"

export interface AsyncData<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  /** Re-runs the fetcher, e.g. from a "Try again" button. */
  refetch: () => void
}

/**
 * Minimal data-fetching hook: enough for FR-014's loading / empty / failure
 * states without pulling in a query library. It ignores results from a fetch
 * that has been superseded, so fast filter changes cannot land out of order.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList
): AsyncData<T> {
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reloadToken, setReloadToken] = React.useState(0)

  // Keep the latest fetcher without making it a dependency: callers pass an
  // inline arrow, which would otherwise re-run the effect on every render.
  const fetcherRef = React.useRef(fetcher)
  React.useEffect(() => {
    fetcherRef.current = fetcher
  })

  React.useEffect(() => {
    let active = true

    // The lint rule wants state changes to come from an external event, but a
    // refetch has no event to hang off: when the deps change we must show the
    // loading state before the request starts, or stale rows stay on screen
    // under the new filter.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    fetcherRef
      .current()
      .then((result) => {
        if (!active) return
        setData(result)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setData(null)
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong. Please try again."
        )
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken])

  const refetch = React.useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  return { data, error, isLoading, refetch }
}
