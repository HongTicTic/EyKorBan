# Jes tae tver tv — Create / Edit Job Post Page Specification

<a id="document-status"></a>
## Document Status

- **Status:** Draft for approval
- **Scope:** Frontend-first MVP, page-level screen specification
- **Covers:** Create/edit job post page (primary), job management list (secondary)
- **Upstream sources:** [Freelance.Requirement.md](Freelance.Requirement.md) ([FR-016](Freelance.Requirement.md#fr-016), [FR-018](Freelance.Requirement.md#fr-018)), [Freelance.UserStories.md](Freelance.UserStories.md) ([STORY-010](Freelance.UserStories.md#story-010), [STORY-013](Freelance.UserStories.md#story-013))
- **Related page specs:** [Freelance.Page.Discovery.md](Freelance.Page.Discovery.md) (the job discovery page reuses its filter, card, state, and responsive behavior with job content)

<a id="traceability"></a>
## Traceability

| Concern | Traces To |
| :--- | :--- |
| Post a job opportunity | [FR-016](Freelance.Requirement.md#fr-016), [STORY-010](Freelance.UserStories.md#story-010) |
| Manage job posts | [FR-018](Freelance.Requirement.md#fr-018), [STORY-013](Freelance.UserStories.md#story-013) |
| Ownership authorization | [NFR-004](Freelance.Requirement.md#nfr-004) |
| Contact privacy | [NFR-003](Freelance.Requirement.md#nfr-003) |
| Complete interface states, visual system | [FR-014](Freelance.Requirement.md#fr-014), [FR-015](Freelance.Requirement.md#fr-015) |

<a id="page-summary"></a>
## Page Summary

| Property | Value |
| :--- | :--- |
| Route | `/client/jobs/new`, `/client/jobs/:id/edit` (authenticated client) |
| Purpose | Create a job opportunity and publish it immediately, or edit an existing own post |
| Actor | Client (authenticated; mock auth in frontend-first phase) |
| Entry points | Job management list ("New job"), portal navigation |
| Exit points | Public job detail page (after publish), job management list (after save/close/cancel) |

Unauthenticated visitors are redirected to the portal entry screen per [FR-007](Freelance.Requirement.md#fr-007)'s authentication pattern; both signed-in and signed-out states are represented.

<a id="layout-regions"></a>
## Layout Regions

```
┌──────────────────────────────────────────────────────┐
│ Header: brand | Discover | Jobs | Portal CTA          │
├──────────────────────────────────────────────────────┤
│ Page heading: "Post a job" / "Edit job"               │
├──────────────────────────────────────────────────────┤
│ Form (single column, max ~640px):                     │
│   Job title *        [input]                          │
│   Description *      [textarea + length hint]         │
│   Work category *    [select]                         │
│   Industry *         [select]                         │
│   Reply email *      [input, never shown publicly]    │
├──────────────────────────────────────────────────────┤
│ Action bar: [Save draft*] [Publish] | Cancel          │
└──────────────────────────────────────────────────────┘
```

*Draft state is an [open decision](#open-points); MVP default ships without it.

| Region | Contents | Behavior |
| :--- | :--- | :--- |
| Header | Shared navigation; "Jobs" link active in client context | Navigation per [FR-013](Freelance.Requirement.md#fr-013) |
| Form | Five fields; all required ones marked with `*` and a visible "required" note before first input | Identifies required information up front ([FR-016 AC-1](Freelance.Requirement.md#fr-016)) |
| Reply email | Collected for enquiry delivery only | Helper text: "Never shown publicly — used only to deliver freelancer responses" ([NFR-003](Freelance.Requirement.md#nfr-003)) |
| Action bar | Publish (primary), Cancel, optionally Save draft | Publish blocked until valid; see [Actions](#actions) |

<a id="field-rules"></a>
## Field Rules

| Field | Type | Required | Validation |
| :--- | :--- | :--- | :--- |
| Job title | Text input | Yes | 1–120 chars (limit is an open decision) |
| Description | Textarea | Yes | 1–4000 chars; visible remaining-count hint |
| Work category | Select | Yes | Must match a known category option |
| Industry | Select | Yes | Must match a known industry option |
| Reply email | Email input | Yes | Valid email format; used for [FR-019](Freelance.Requirement.md#fr-019) delivery |

Validation errors render as accessible field-level messages (`aria-describedby`, `aria-invalid`) and never discard valid input ([FR-016 AC-2](Freelance.Requirement.md#fr-016), [NFR-002](Freelance.Requirement.md#nfr-002)).

<a id="actions"></a>
## Actions

| Action | Precondition | Result | Feedback |
| :--- | :--- | :--- | :--- |
| Publish | All required fields valid | Creates/updates public job detail page; job enters discovery newest-first | Success banner with link to the public page ([FR-016 AC-3/4](Freelance.Requirement.md#fr-016)) |
| Publish (invalid) | Any required field invalid | Blocked; focus moves to first invalid field | Inline errors; nothing submitted |
| Save draft *(open decision)* | — | Private draft visible only in own management list | [FR-018](Freelance.Requirement.md#fr-018) draft semantics if adopted |
| Cancel | Any editing state | Returns to management list | Unsaved-changes confirmation when the form is dirty |
| Close *(edit page only)* | Job is open | Removed from discovery; public page shows closed state; reversible | [FR-018 AC-3/4](Freelance.Requirement.md#fr-018) |
| Delete *(edit page only)* | — | Requires explicit confirm dialog; cancel leaves post unchanged | [FR-018 AC-5](Freelance.Requirement.md#fr-018) |

Repeated submission is prevented while any request is pending (submit button disabled + pending label) ([FR-016 AC-5](Freelance.Requirement.md#fr-016)).

<a id="page-states"></a>
## Page States

Per [FR-014](Freelance.Requirement.md#fr-014):

| State | Trigger | Presentation |
| :--- | :--- | :--- |
| Loading (edit route) | Fetching the job to edit | Form skeleton; no editable controls flash empty values |
| Success — create | New empty form | Empty fields, publish disabled until minimally valid |
| Success — edit | Own job loaded | Fields populated; Close/Delete available; ownership enforced server-side ([NFR-004](Freelance.Requirement.md#nfr-004)) |
| Validation error | Invalid submit | Field-level errors; valid input preserved |
| Request failure | Publish/save fails | Inline error banner with retry; form content retained; user is never left unsure whether the job became public ([STORY-010 AC-6](Freelance.UserStories.md#story-010)) |
| Forbidden | Job owned by another client | Clear not-authorized state; no post content rendered |

<a id="responsive-and-theme"></a>
## Responsive & Theme

- Single-column form holds to full width on mobile; selects and inputs remain ≥ 44px touch targets ([NFR-001](Freelance.Requirement.md#nfr-001)).
- Inter Variable, semantic tokens, radius scale, and light/dark legibility follow [FR-015](Freelance.Requirement.md#fr-015) and [NFR-007](Freelance.Requirement.md#nfr-007).

<a id="job-management-list"></a>
## Job Management List (secondary screen)

Route `/client/jobs`. Table/list of own posts: title, category, industry, status (Open/Closed), published date, row actions (Edit, Close/Reopen, Delete).

- Open and closed posts both appear; drafts appear only if the draft decision is adopted.
- Closed rows carry a visible status badge and stay non-public ([FR-018 AC-3](Freelance.Requirement.md#fr-018)).
- Empty state: "No job posts yet" + "Post a job" primary action.
- Loading, failure-with-retry, and post-action success feedback follow FR-014.

<a id="data-needs"></a>
## Data Needs (frontend-first, mock data)

| Need | Shape | Notes |
| :--- | :--- | :--- |
| Job post | `{ id, title, description, category, industry, status: "open" \| "closed", publishedAt, replyEmail }` | `replyEmail` is write-only from the UI; never echoed in public data ([NFR-003](Freelance.Requirement.md#nfr-003)) |
| Category / industry options | Same option lists as portfolio discovery | Reuse keeps filters consistent ([FR-017](Freelance.Requirement.md#fr-017)) |
| Mock coverage | ≥ 1 open job, 1 closed job, 1 job owned by a different client (for the forbidden state) | Verifies all page states |

<a id="open-points"></a>
## Open Points

Inherited from [Open Decisions](Freelance.Requirement.md#open-decisions) items 9–10:

1. Optional fields (budget range, deadline, attachments) and exact length limits.
2. Whether jobs get a draft state in addition to open/closed.
3. Whether the reply email is editable after publication and how replies are routed.

<a id="verification"></a>
## Verification Checklist

- [ ] Required fields identified before first publish attempt ([FR-016 AC-1](Freelance.Requirement.md#fr-016)).
- [ ] Invalid publish blocked with preserved input ([FR-016 AC-2](Freelance.Requirement.md#fr-016)).
- [ ] Published job appears in public discovery newest-first ([FR-017 AC-2](Freelance.Requirement.md#fr-017)).
- [ ] Reply email never appears in public content or payloads ([NFR-003](Freelance.Requirement.md#nfr-003)).
- [ ] Another client's job cannot be opened for edit (forbidden state) ([NFR-004](Freelance.Requirement.md#nfr-004)).
- [ ] Close/reopen/delete behave per [FR-018](Freelance.Requirement.md#fr-018) with confirmation on delete.
- [ ] All FR-014 states present; no repeated submits while pending.
- [ ] Keyboard-only pass, visible focus, light/dark legibility ([NFR-002](Freelance.Requirement.md#nfr-002), [NFR-007](Freelance.Requirement.md#nfr-007)).
