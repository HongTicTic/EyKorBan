/**
 * The engagement project (STORY-014 … STORY-019) — distinct from a portfolio
 * item, which the UI also calls a "project". The old interface/project.ts held
 * a portfolio type under this name; that collision is why it was removed.
 */

export type ProjectStatus =
  | "enquiry"
  | "active"
  | "delivered"
  | "completed"
  | "cancelled"
  | "declined"

export type PaymentStatus = "unfunded" | "held" | "released" | "returned"

export type ProjectEventType =
  | "created"
  | "accepted"
  | "declined"
  | "funded"
  | "delivered"
  | "revision_requested"
  | "approved"
  | "released"
  | "completed"
  | "cancelled"

export interface Project {
  id: string
  clientId: string
  freelancerId: string
  title: string
  scope: string
  budget: number
  currency: string
  deadline?: string
  status: ProjectStatus
  paymentStatus: PaymentStatus
  /** Exactly one of these is set — a project always has a CTA origin. */
  sourcePortfolioItemId?: string
  sourceJobId?: string
  /** Computed by Postgres so the figure shown cannot drift from the one agreed. */
  platformFee: number
  clientTotal: number
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

export interface ProjectEvent {
  id: string
  projectId: string
  actorId?: string
  type: ProjectEventType
  note?: string
  createdAt: string
}

export interface Deliverable {
  id: string
  projectId: string
  submittedBy: string
  note: string
  images: string[]
  createdAt: string
}

/** The platform's cut, as a fraction. Mirrors the generated column. */
export const PLATFORM_FEE_RATE = 0.1

/** Live preview while the client types a budget (STORY-014 AC-2). */
export function costBreakdown(budget: number) {
  const fee = Math.round(budget * PLATFORM_FEE_RATE * 100) / 100
  return { budget, fee, total: Math.round((budget + fee) * 100) / 100 }
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  enquiry: "Enquiry",
  active: "Active",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unfunded: "Not funded",
  held: "Funds held by the platform",
  released: "Released to the freelancer",
  returned: "Returned to the client",
}
