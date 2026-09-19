# Jes tae tver tv — Project Pages Specification

<a id="document-status"></a>
## Document Status

- **Status:** Draft for approval
- **Scope:** Frontend-first MVP, page-level screen specification
- **Covers:** Start-project flow (primary), project dashboard (primary), project detail page with escrow-simulated payment states (primary)
- **Upstream sources:** [Freelance.Requirement.md](Freelance.Requirement.md) ([Section 4](Freelance.Requirement.md#project-requirements): FR-020–FR-027, [FR-006](Freelance.Requirement.md#fr-006), [FR-019](Freelance.Requirement.md#fr-019), [NFR-008](Freelance.Requirement.md#nfr-008)), [Freelance.UserStories.md](Freelance.UserStories.md) ([Section 4](Freelance.UserStories.md#project-user-stories))
- **Related page specs:** [Freelance.Page.Discovery.md](Freelance.Page.Discovery.md) (entry points), [Freelance.Page.JobPosting.md](Freelance.Page.JobPosting.md) (job management context)

<a id="traceability"></a>
## Traceability

| Concern | Traces To |
| :--- | :--- |
| Create a project from portfolio/job CTA | [FR-006](Freelance.Requirement.md#fr-006), [FR-019](Freelance.Requirement.md#fr-019), [FR-020](Freelance.Requirement.md#fr-020) |
| Respond to a project enquiry | [FR-021](Freelance.Requirement.md#fr-021) |
| Project dashboard | [FR-022](Freelance.Requirement.md#fr-022) |
| Project detail timeline | [FR-023](Freelance.Requirement.md#fr-023) |
| Deliverable submission | [FR-024](Freelance.Requirement.md#fr-024) |
| Approve / request revision | [FR-025](Freelance.Requirement.md#fr-025) |
| Escrow simulation + 10% fee breakdown | [FR-026](Freelance.Requirement.md#fr-026), [NFR-008](Freelance.Requirement.md#nfr-008) |
| Cancellation | [FR-027](Freelance.Requirement.md#fr-027) |
| Ownership authorization, contact privacy, complete states, visual system | [NFR-004](Freelance.Requirement.md#nfr-004), [NFR-003](Freelance.Requirement.md#nfr-003), [FR-014](Freelance.Requirement.md#fr-014), [FR-015](Freelance.Requirement.md#fr-015) |

<a id="page-summary"></a>
## Page Summary

| Property | Value |
| :--- | :--- |
| Routes | `/projects/new?from=portfolio/:id` or `/projects/new?from=job/:id` · `/projects` (dashboard) · `/projects/:id` (detail) |
| Purpose | Convert discovery contact into an on-platform project and run its lifecycle to completion |
| Actors | Client and Freelancer (authenticated; mock auth in frontend-first phase) |
| Entry points | Portfolio detail CTA, job detail CTA, dashboard navigation |
| Exit points | Project detail page (after creation), dashboard (after cancel/decline) |

Unauthenticated visitors selecting a start-project CTA are presented the sign-in surface first, then returned to the pending start-project flow ([FR-006](Freelance.Requirement.md#fr-006), [FR-007](Freelance.Requirement.md#fr-007) pattern).

<a id="start-project-flow"></a>
## Start-Project Flow (`/projects/new`)

```
┌──────────────────────────────────────────────────────┐
│ Header: brand | Discover | Jobs | Projects            │
├──────────────────────────────────────────────────────┤
│ Context card: linked portfolio item or job post       │
│ (cover/thumb, title, counterpart — read-only)         │
├──────────────────────────────────────────────────────┤
│ Form (single column, max ~640px):                     │
│   Project title *   [input]                           │
│   Scope *           [textarea + length hint]          │
│   Budget (USD) *    [number input, ≥ 0]               │
│   Deadline          [date input, optional]            │
├──────────────────────────────────────────────────────┤
│ Cost preview: Budget $X · Platform fee (10%) $Y ·     │
│               You pay $Z  (updates live)              │
├──────────────────────────────────────────────────────┤
│ Action bar: [Start project] | Cancel                  │
└──────────────────────────────────────────────────────┘
```

| Region | Contents | Behavior |
| :--- | :--- | :--- |
| Context card | The originating portfolio item or job, auto-linked | Included automatically; not editable ([FR-006 AC-3](Freelance.Requirement.md#fr-006)) |
| Cost preview | Live 10% fee breakdown ([NFR-008](Freelance.Requirement.md#nfr-008)) | Fee = budget × 10%; total = budget + fee; shown before submission |
| Action bar | Start project (primary), Cancel | Blocked until valid; creation lands on the project detail page in the enquiry state |

Field rules: title 1–120 chars; scope 1–4000 chars with remaining-count hint; budget a valid non-negative amount; deadline, when provided, a future date. Errors are field-level (`aria-describedby`, `aria-invalid`) and never discard valid input ([FR-020 AC-2](Freelance.Requirement.md#fr-020), [NFR-002](Freelance.Requirement.md#nfr-002)).

<a id="project-dashboard"></a>
## Project Dashboard (`/projects`)

List of the signed-in actor's projects: title, counterpart, budget, status badge, last-activity time, row action → detail page ([FR-022](Freelance.Requirement.md#fr-022)).

- Status badges: `Enquiry` · `Active` · `Delivered` · `Completed` · `Cancelled/Declined`.
- Rows ordered by last activity, newest first, stable for equal timestamps.
- Empty state: "No projects yet" + guidance back to discovery/jobs.
- Loading and failure-with-retry states per [FR-014](Freelance.Requirement.md#fr-014). Accessible as a list/table on mobile (cards) without horizontal overflow ([NFR-001](Freelance.Requirement.md#nfr-001)).

<a id="project-detail"></a>
## Project Detail (`/projects/:id`)

```
┌──────────────────────────────────────────────────────┐
│ Header: brand | Discover | Jobs | Projects            │
├──────────────────────────────────────────────────────┤
│ Title · Status badge · Deadline (if set)              │
│ Parties: Client ↔ Freelancer · Linked source card     │
├──────────────────────────────────────────────────────┤
│ Cost breakdown card:                                  │
│   Budget $100 · Platform fee (10%) $10 · Total $110   │
│   State-dependent: [Fund project] / Funds held badge  │
│   / Receipt (after release)                           │
├──────────────────────────────────────────────────────┤
│ State actions (role- and state-gated):                │
│   Freelancer: Accept / Decline · Submit deliverable   │
│   Client:     Approve · Request revision · Cancel     │
├──────────────────────────────────────────────────────┤
│ Activity timeline (chronological, newest last):       │
│   created → accepted → funded → delivered → …         │
│   Each entry: actor, event label, note, timestamp     │
└──────────────────────────────────────────────────────┘
```

| Region | Behavior |
| :--- | :--- |
| Cost breakdown | Always visible; fee itemized per [NFR-008](Freelance.Requirement.md#nfr-008). Simulation only — no real payment processing ([FR-026 AC-4](Freelance.Requirement.md#fr-026)) |
| State actions | Rendered strictly by (viewer role × project state); see [Actions](#project-actions) |
| Timeline | Lifecycle events with stable chronological ordering ([FR-023 AC-2](Freelance.Requirement.md#fr-023)) |

<a id="project-actions"></a>
## Actions

| Action | Viewer | Precondition (state) | Result |
| :--- | :--- | :--- | :--- |
| Fund project | Client | `Active` (or later pre-completed) | Funds-held badge shown; breakdown unchanged; timeline event ([FR-026 AC-1](Freelance.Requirement.md#fr-026)) |
| Accept enquiry | Freelancer | `Enquiry` | Project → `Active`; timeline event ([FR-021](Freelance.Requirement.md#fr-021)) |
| Decline enquiry | Freelancer | `Enquiry` | Terminal declined state; no further actions |
| Submit deliverable | Freelancer | `Active` | Note + optional images → `Delivered`; timeline event ([FR-024](Freelance.Requirement.md#fr-024)) |
| Approve | Client | `Delivered` | Release presented; receipt in breakdown; project → `Completed` ([FR-025](Freelance.Requirement.md#fr-025), [FR-026 AC-3](Freelance.Requirement.md#fr-026)) |
| Request revision | Client | `Delivered` | Note recorded; project → `Active` ([FR-025 AC-3](Freelance.Requirement.md#fr-025)) |
| Cancel | Either | `Enquiry` or `Active` | Confirm dialog; → `Cancelled`; funded projects show funds returned ([FR-027](Freelance.Requirement.md#fr-027)) |

All mutating actions: disabled with pending label while a request is in progress; success/failure feedback always visible ([FR-020 AC-5](Freelance.Requirement.md#fr-020), [FR-014](Freelance.Requirement.md#fr-014)).

<a id="page-states"></a>
## Page States

Per [FR-014](Freelance.Requirement.md#fr-014):

| State | Trigger | Presentation |
| :--- | :--- | :--- |
| Loading | Fetching dashboard or project | Skeleton rows/timeline; no content flash |
| Empty | No projects (dashboard) | Guidance + discovery CTA |
| Success | Data loaded / action succeeded | Normal render; action feedback |
| Validation error | Invalid form submit | Field-level errors; valid input preserved |
| Request failure | Any request fails | Inline error banner with retry; state unchanged |
| Not found / Forbidden | Unknown or non-member project ID | Clear not-found or not-authorized state; no project content rendered ([FR-023 AC-4](Freelance.Requirement.md#fr-023), [NFR-004](Freelance.Requirement.md#nfr-004)) |

<a id="responsive-and-theme"></a>
## Responsive & Theme

- Forms and detail layout collapse to single column on mobile; controls remain ≥ 44px touch targets ([NFR-001](Freelance.Requirement.md#nfr-001)).
- Inter Variable, semantic tokens, radius scale, and light/dark legibility follow [FR-015](Freelance.Requirement.md#fr-015) and [NFR-007](Freelance.Requirement.md#nfr-007). Status badges must remain distinguishable in both themes.

<a id="data-needs"></a>
## Data Needs (frontend-first, mock data)

| Need | Shape | Notes |
| :--- | :--- | :--- |
| Project | `{ id, title, scope, budget, deadline?, status: "enquiry" \| "active" \| "delivered" \| "completed" \| "cancelled", funded: boolean, clientId, freelancerId, source: { type: "portfolio" \| "job", id }, createdAt, updatedAt }` | `funded` drives the funds-held badge; fee derived as `budget × 0.10` ([NFR-008](Freelance.Requirement.md#nfr-008)) |
| Timeline entry | `{ id, projectId, actorId, type, note?, createdAt }` | Types mirror lifecycle events in [FR-023](Freelance.Requirement.md#fr-023) |
| Deliverable | `{ id, projectId, note, imageUrls?, submittedAt }` | Image-only attachments ([FR-024 AC-2](Freelance.Requirement.md#fr-024)) |
| Mock coverage | ≥ 1 project per status, 1 project in each role view, 1 project with a different member (forbidden state), 1 funded project | Verifies all page states and fee math incl. fractional rounding |

<a id="open-points"></a>
## Open Points

Inherited from [Open Decisions](Freelance.Requirement.md#open-decisions) items 12–15:

1. Real payment provider and fund custody for the future escrow phase.
2. Dispute, refund, and chargeback policy (out of MVP scope).
3. Whether the simulated escrow needs an in-interface disclosure.
4. Future internal chat within the project timeline and contact-detail masking.

<a id="verification"></a>
## Verification Checklist

- [ ] CTA on portfolio/job detail opens start-project flow; unauthenticated visitors see sign-in first ([FR-006](Freelance.Requirement.md#fr-006), [FR-019](Freelance.Requirement.md#fr-019)).
- [ ] No freelancer or client email address is rendered anywhere in project UI or payloads ([NFR-003](Freelance.Requirement.md#nfr-003)).
- [ ] Cost preview and receipt both itemize budget + 10% fee + total, matching for representative budgets ([NFR-008](Freelance.Requirement.md#nfr-008)).
- [ ] State actions render only for the correct role and state (e.g., no Approve in `Active`).
- [ ] Non-member cannot open a project (forbidden state) ([NFR-004](Freelance.Requirement.md#nfr-004)).
- [ ] Fund → held → approve → release → receipt flow completes with timeline events; no real payment call is made.
- [ ] Cancel requires confirmation; funded cancel shows funds returned ([FR-027](Freelance.Requirement.md#fr-027)).
- [ ] All FR-014 states present; no repeated submits while pending.
- [ ] Keyboard-only pass, visible focus, light/dark legibility ([NFR-002](Freelance.Requirement.md#nfr-002), [NFR-007](Freelance.Requirement.md#nfr-007)).
