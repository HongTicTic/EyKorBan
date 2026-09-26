import * as React from "react"

/**
 * Lesson 7.3: queue writes while offline, flush them on reconnect.
 *
 * Caching solves reads. Writes are the other half: with no signal, publishing
 * work should not simply fail. The operation is parked in an "outbox" and
 * replayed when the connection returns.
 *
 * Two things the lesson's sketch leaves out that matter in practice:
 *
 * 1. The queue is persisted to localStorage. A queue held only in React state
 *    is lost the moment the user closes the tab — which is exactly what people
 *    do when an app stops responding.
 * 2. Only serialisable descriptors are queued, never closures. You cannot
 *    JSON.stringify a function, so a queue of `() => Promise` cannot survive a
 *    reload. Each entry records what to do; `handlers` says how.
 */

const STORAGE_KEY = "eykorban.outbox.v1"
const MAX_ATTEMPTS = 3

export interface QueuedOperation {
  id: string
  /** Key into the handler map — e.g. "createWork". */
  kind: string
  /** JSON-serialisable arguments for that handler. */
  payload: unknown
  /** For "you published this while offline" messaging. */
  label: string
  queuedAt: number
  attempts: number
}

export type OperationHandlers = Record<
  string,
  (payload: never) => Promise<unknown>
>

function read(): QueuedOperation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QueuedOperation[]) : []
  } catch {
    return []
  }
}

function write(queue: QueuedOperation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {
    // Private mode or a full quota. The in-memory queue still works for this
    // session; it just will not survive a reload.
  }
}

export function useOfflineQueue(handlers: OperationHandlers) {
  const [queue, setQueue] = React.useState<QueuedOperation[]>(read)
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const [isFlushing, setIsFlushing] = React.useState(false)

  // Keep the newest handlers without making them an effect dependency.
  const handlersRef = React.useRef(handlers)
  React.useEffect(() => {
    handlersRef.current = handlers
  })

  const persist = React.useCallback((next: QueuedOperation[]) => {
    write(next)
    setQueue(next)
  }, [])

  /** Adds an operation to the outbox. Returns its id. */
  const enqueue = React.useCallback(
    (kind: string, payload: unknown, label: string) => {
      const operation: QueuedOperation = {
        id: crypto.randomUUID(),
        kind,
        payload,
        label,
        queuedAt: Date.now(),
        attempts: 0,
      }
      persist([...read(), operation])
      return operation.id
    },
    [persist]
  )

  const flush = React.useCallback(async () => {
    const pending = read()
    if (pending.length === 0 || !navigator.onLine) return

    setIsFlushing(true)
    const remaining: QueuedOperation[] = []

    // Sequential, not Promise.all: these are the user's edits and replaying
    // them in order is the only way the result matches what they intended.
    for (const operation of pending) {
      const handler = handlersRef.current[operation.kind]

      if (!handler) {
        // The app changed since this was queued — drop it rather than retry
        // something nothing knows how to perform.
        continue
      }

      try {
        await handler(operation.payload as never)
      } catch {
        const attempts = operation.attempts + 1
        // Give up after MAX_ATTEMPTS so one permanently-rejected write (a
        // deleted row, a revoked permission) cannot block the whole outbox.
        if (attempts < MAX_ATTEMPTS) {
          remaining.push({ ...operation, attempts })
        }
      }
    }

    persist(remaining)
    setIsFlushing(false)
  }, [persist])

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      void flush()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Anything left from a previous session goes out now.
    if (navigator.onLine) void flush()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [flush])

  return { queue, pending: queue.length, isOnline, isFlushing, enqueue, flush }
}
