/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import {
  useOfflineQueue,
  type OperationHandlers,
} from "@/hooks/use-offline-queue"
import { createJob, deleteJob, updateJob, type JobInput } from "@/services/jobs"
import {
  createWork,
  deleteWork,
  updateWork,
  type WorkInput,
} from "@/services/portfolio"

/**
 * The app's single outbox.
 *
 * Handlers live here rather than in the hook so the queue stores plain data:
 * `{ kind: "createWork", payload: {...} }` survives JSON.stringify, a closure
 * does not. When an entry is replayed, `kind` is looked up in this map.
 */
const handlers: OperationHandlers = {
  createWork: ({ userId, input }: { userId: string; input: WorkInput }) =>
    createWork(userId, input),
  updateWork: ({ id, input }: { id: string; input: Partial<WorkInput> }) =>
    updateWork(id, input),
  deleteWork: ({ id }: { id: string }) => deleteWork(id),
  createJob: ({ userId, input }: { userId: string; input: JobInput }) =>
    createJob(userId, input),
  updateJob: ({ id, input }: { id: string; input: Partial<JobInput> }) =>
    updateJob(id, input),
  deleteJob: ({ id }: { id: string }) => deleteJob(id),
} as OperationHandlers

type OutboxValue = ReturnType<typeof useOfflineQueue>

const OutboxContext = React.createContext<OutboxValue | undefined>(undefined)

export function OutboxProvider({ children }: { children: React.ReactNode }) {
  const outbox = useOfflineQueue(handlers)
  return (
    <OutboxContext.Provider value={outbox}>{children}</OutboxContext.Provider>
  )
}

export const useOutbox = () => {
  const context = React.useContext(OutboxContext)

  if (context === undefined) {
    throw new Error("useOutbox must be used within an OutboxProvider")
  }

  return context
}
