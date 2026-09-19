# Jes tae tver tv — Freelance Portfolio Discovery Requirements

## Document Status

- **Status:** Draft for approval
- **Scope:** Frontend-first MVP
- **Domain impact:** New domain capability
- **Actors:** Client and Freelancer

<a id="sources-and-precedence"></a>
## Sources and Precedence

| Identifier | Source / Artifact | Date | Use & Authority |
| :--- | :--- | :--- | :--- |
| <a id="s1"></a>`S1` | Initial product-flow discussion | 2026-09-19 | Authoritative product direction for portfolio publishing and client discovery |
| <a id="s2"></a>`S2` | Follow-up product decisions | 2026-09-19 | Authoritative actor, publishing, filtering, contact, and image-only MVP decisions |
| <a id="s3"></a>`S3` | User-supplied Tailwind theme | 2026-09-19 | Authoritative typography, color, radius, component-theme, and dark-mode direction |
| <a id="s4"></a>`S4` | Scope-change decision: add job posting | 2026-09-19 | Authoritative decision adding client-posted job opportunities to the MVP; governs the Section 3 job requirements |
| <a id="s5"></a>`S5` | Scope-change decision: project-centric engagement with escrow-simulated fee display | 2026-09-19 | Authoritative decision replacing the email-delivery contact flow with an on-platform project lifecycle; governs the Section 4 project requirements and amends FR-006/FR-019. Recorded rationale: direct email contact causes disintermediation — once either party obtains the other's contact, both stop using the platform. The fix anchors both actors to a project and displays a trust-building middleman payment model |

Source precedence is `S2` over `S1` where the follow-up discussion clarifies the original flow. `S4` extends the scope decided in `S1`/`S2`. `S5` amends the contact decisions in `S2`/`S4` and extends their scope. `S3` governs presentation only and does not override product behavior.

<a id="product-summary"></a>
## Product Summary

Jes tae tver tv is a web-first, image-led portfolio discovery platform. Freelancers publish completed work without administrative approval. Clients browse the public portfolio catalog, filter it by work category and industry, and open a dedicated work-detail page. From a portfolio item or an open job, a client starts an on-platform **project** that both actors then revolve around.

Clients can also publish job opportunities without administrative approval. Freelancers browse the public job catalog, filter it by work category and industry, and respond to an open job by initiating a project. Job posting and management require a client identity; browsing remains account-free.

Every project is the retention anchor: its scope, activity timeline, deliverables, and simulated payment status are visible only to the two involved actors inside the platform. The platform presents itself as the trusted middleman for money: the client sees a cost breakdown that itemizes a flat 10% platform fee on top of the project budget, a "funds held" state, and release-on-approval — presented as interface states only, without real payment processing.

The experience should take inspiration from Dribbble's image-forward discovery patterns without copying its branding or exact interface.

<a id="actors"></a>
## Actors

### Client

A visitor who discovers portfolio work and starts projects with freelancers. Browsing remains account-free; starting and managing a project requires a client identity. Authentication may be represented by a mock integration during the frontend-first phase, but authenticated and unauthenticated interface states shall both be represented.

### Freelancer

A creator who accesses the freelancer portal to create, publish, edit, unpublish, and delete their own portfolio work, and who discovers and responds to client-posted job opportunities.

There is no MVP requirement for one account to switch between client and freelancer roles.

<a id="scope"></a>
## Scope

### Included in the MVP

- Public portfolio discovery
- Recent-work ordering
- Category and industry filters
- Portfolio detail pages
- Related-work recommendations
- Freelancer publishing and management portal
- Image-only portfolio submissions
- Draft and published portfolio states
- Immediate publishing and immediate updates without admin approval
- Client-to-freelancer project creation from portfolio and job CTAs
- Project lifecycle: enquiry, acceptance, delivery, approval, completion, cancellation
- Project dashboard and project detail timeline for both actors
- Escrow-simulated funding, hold, and release states (interface only, no real money)
- Flat 10% client-paid platform fee shown as an upfront cost-breakdown line item
- Client job posting and management (immediate, no approval)
- Public job discovery with category and industry filters
- Responsive desktop, tablet, and mobile presentation
- Light and dark themes

### Excluded from the MVP

- Full client account system beyond the job-posting and project-creation identity (browsing stays account-free)
- Account-role switching
- Video portfolio content
- Administrative moderation or approval
- Real payment processing, real escrow of funds, contracts, dispute resolution, and refund flows (the MVP simulates escrow states in the interface only)
- An internal chat or messaging inbox
- Ratings and reviews

<a id="functional-requirements"></a>
## Requirements by Actor

The MVP is organized around three primary product sections: the public **Client experience**, the private **Freelancer experience**, and the shared **Job opportunity experience** (posted by clients, discovered by freelancers). Requirements that govern all experiences are defined once under [Cross-Cutting Product Requirements](#cross-cutting-product-requirements).

<a id="client-requirements"></a>
### Section 1: Client Requirements

The Client section covers the public journey from discovering relevant work through evaluating a portfolio and starting a project with its freelancer. Browsing does not require an account; starting and managing a project requires a client identity ([S5](#s5)).

<a id="fr-001"></a>
### FR-001: Browse Published Work

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** Clients need a visual way to discover freelancers through evidence of completed work.  
**Statement:** The system shall provide a public discovery page containing published portfolio work.

**Acceptance Criteria:**

1. The discovery page presents portfolio cards in a responsive, image-forward grid.
2. Each card identifies the cover image, project title, freelancer, work category, and industry.
3. Draft and unpublished work does not appear in public discovery.
4. Selecting a card navigates the client to that portfolio item's detail page.

<a id="fr-002"></a>
### FR-002: View Recent Work

**Source:** [S1](#s1)  
**Why / Business Rationale:** Newly published work must remain discoverable rather than being hidden behind older content.  
**Statement:** The system shall provide a recent-work view ordered from newest publication to oldest publication.

**Acceptance Criteria:**

1. Newly published work appears ahead of older work in the recent view.
2. Items with the same publication time use a stable secondary ordering so the display does not visibly jump between refreshes.

<a id="fr-003"></a>
### FR-003: Filter Work by Category and Industry

**Source:** [S2](#s2)  
**Why / Business Rationale:** Clients need to narrow discovery to work relevant to their desired discipline and business context.  
**Statement:** The system shall allow public portfolio work to be filtered by work category and industry.

**Acceptance Criteria:**

1. Category and industry filters can be applied together.
2. Active filters are visibly identified.
3. The client can clear an individual filter or reset all filters.
4. The displayed work updates to match the active filters.
5. A helpful empty state appears when no published work matches.

<a id="fr-004"></a>
### FR-004: View Portfolio Details

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** A client needs enough context to evaluate a freelancer's work before initiating contact.  
**Statement:** The system shall provide a dedicated detail page for every published portfolio item.

**Acceptance Criteria:**

1. The page presents the project title, description, cover image, image gallery, work category, industry, and freelancer identity.
2. The page presents a prominent contact-freelancer call to action.
3. The page presents related published work when related results are available.
4. An unavailable or unpublished portfolio URL presents a clear not-found state instead of stale portfolio content.

<a id="fr-005"></a>
### FR-005: Show Related Work

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** Relevant recommendations help clients continue discovering suitable work and freelancers.  
**Statement:** The system shall display related published work based on shared category or industry.

**Acceptance Criteria:**

1. The current portfolio item does not appear in its own recommendations.
2. Unpublished work does not appear in recommendations.
3. The interface remains complete when no related work is available.

<a id="fr-006"></a>
### FR-006: Start a Project from a Portfolio Item

**Source:** [S2](#s2), amended by [S5](#s5)  
**Why / Business Rationale:** Discovery must convert into an on-platform engagement; delivering a freelancer's contact by email causes both parties to leave the platform.  
**Statement:** The system shall allow an authenticated client to start a project from a published portfolio item without exposing the freelancer's email address publicly, replacing the superseded email-enquiry form.

**Acceptance Criteria:**

1. Selecting the contact CTA opens a start-project flow associated with the current portfolio item; for an unauthenticated visitor it presents sign-in first ([FR-007](#fr-007) authentication pattern).
2. The flow collects the project title, scope description, and budget amount, with an optional deadline.
3. The portfolio item is included automatically in the project context.
4. Required fields and budget format are validated before submission.
5. A valid submission creates the project in the enquiry state and opens its project detail page ([Section 4](#project-requirements)).
6. The client receives visible success or failure feedback.
7. Repeated submission is prevented while a request is already in progress.
8. The freelancer's email address is not rendered in public content or client-delivered page data ([NFR-003](#nfr-003)).

<a id="freelancer-requirements"></a>
### Section 2: Freelancer Requirements

The Freelancer section covers the authenticated journey for creating, previewing, publishing, and managing the freelancer's own portfolio work. Publishing does not require administrative approval.

<a id="fr-007"></a>
### FR-007: Access the Freelancer Portal

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** Freelancers require a private surface for controlling their own portfolio content.  
**Statement:** The system shall restrict portfolio creation and management capabilities to the owning freelancer.

**Acceptance Criteria:**

1. An unauthenticated visitor cannot access portfolio-management actions.
2. A freelancer can access the portal after authentication.
3. A freelancer cannot edit, unpublish, or delete another freelancer's work.
4. Authentication may be represented by a mock integration during the frontend-first phase, but authenticated and unauthenticated interface states shall both be represented.

<a id="fr-008"></a>
### FR-008: Create Portfolio Work

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** Freelancer-created portfolio work is the core supply-side content of the product.  
**Statement:** A freelancer shall be able to create an image-based portfolio item containing a title, description, cover image, optional additional images, work category, and industry.

**Acceptance Criteria:**

1. The interface identifies required information before the freelancer attempts to publish.
2. The submission supports images and does not offer video upload in the MVP.
3. The cover image is identifiable before saving or publishing.
4. Invalid or incomplete input produces field-level feedback without discarding valid input.

<a id="fr-009"></a>
### FR-009: Save Work as a Draft

**Source:** [S2](#s2)  
**Why / Business Rationale:** Freelancers may need more than one session to prepare a polished portfolio presentation.  
**Statement:** A freelancer shall be able to save incomplete portfolio work as a draft before publication.

**Acceptance Criteria:**

1. Draft work is visible to its owner in the freelancer portal.
2. Draft work is not visible in public discovery, related work, or public detail pages.
3. The freelancer can resume editing a saved draft.

<a id="fr-010"></a>
### FR-010: Publish Work Immediately

**Source:** [S2](#s2)  
**Why / Business Rationale:** The product intentionally avoids an administrative approval bottleneck.  
**Statement:** A freelancer shall be able to publish a valid portfolio item immediately without admin approval.

**Acceptance Criteria:**

1. Publication is blocked until all required information is valid.
2. Successful publication creates a public detail page.
3. Successfully published work becomes eligible for public discovery and related-work results.
4. The freelancer receives clear publication success or failure feedback.

<a id="fr-011"></a>
### FR-011: Manage Existing Work

**Source:** [S2](#s2)  
**Why / Business Rationale:** Freelancers need ongoing control over the accuracy and availability of their portfolios.  
**Statement:** A freelancer shall be able to view, edit, unpublish, and delete their own portfolio work.

**Acceptance Criteria:**

1. Saved edits to published work become publicly visible without review.
2. Unpublished work is removed from public discovery, recommendations, and its public detail page.
3. Unpublished work remains available to its owner in the portal.
4. Deletion requires explicit confirmation.
5. Deleted work is removed from the owner's portfolio-management list and is no longer publicly available.

<a id="fr-012"></a>
### FR-012: Preview Work Before Publishing

**Source:** [S1](#s1), product refinement accepted through the request to define requirements  
**Why / Business Rationale:** Image-led presentation is central to the client's evaluation of a freelancer.  
**Statement:** A freelancer should be able to preview a portfolio item in its public presentation before publishing it.

**Acceptance Criteria:**

1. Preview reflects the current unsaved or draft presentation data.
2. Entering preview does not publish the portfolio item.
3. The freelancer can return to editing without losing entered content.

<a id="job-requirements"></a>
### Section 3: Job Opportunity Requirements

The Job section covers client-posted job opportunities: publication, public discovery, response, and management. Jobs publish immediately without administrative approval and follow the same ownership, privacy, and state-completeness rules as portfolio work.

<a id="fr-016"></a>
### FR-016: Post a Job Opportunity

**Source:** [S4](#s4)
**Why / Business Rationale:** Discovery must flow in both directions; clients need a way to invite relevant freelancers to work with them.
**Statement:** An authenticated client shall be able to create a job opportunity containing a title, description, work category, and industry, and publish it immediately without admin approval.

**Acceptance Criteria:**

1. The posting interface identifies required information (title, description, category, industry) before the client publishes.
2. Publication is blocked until required fields are valid, with field-level feedback that does not discard valid input.
3. Successful publication creates a public job detail page.
4. The client's contact email is collected but not displayed publicly ([NFR-003](#nfr-003)).
5. The client receives clear publication success or failure feedback, and repeated submission is prevented while a request is in progress.

<a id="fr-017"></a>
### FR-017: Discover Job Opportunities

**Source:** [S4](#s4)
**Why / Business Rationale:** Freelancers must be able to find open work that matches their discipline and business context.
**Statement:** The system shall provide a public job discovery view ordered newest-first and filterable by work category and industry.

**Acceptance Criteria:**

1. Job cards identify the title, description snippet, work category, industry, and publication date.
2. Ordering is newest publication first with a stable secondary ordering ([FR-002](#fr-002) pattern).
3. Category and industry filters combine, are visibly identified, individually removable, and resettable in one action ([FR-003](#fr-003) pattern).
4. Draft and closed jobs never appear in public discovery.
5. A helpful empty state appears when no open job matches the active filters.
6. Loading, empty, and failure states follow [FR-014](#fr-014).

<a id="fr-018"></a>
### FR-018: Manage Job Posts

**Source:** [S4](#s4)
**Why / Business Rationale:** A client's staffing need changes over time, so the owner must control the accuracy and availability of their posts.
**Statement:** An authenticated client shall be able to view, edit, close, reopen, and delete their own job posts.

**Acceptance Criteria:**

1. Only the owning client can edit, close, reopen, or delete a job post; authorization is enforced by ownership, not interface visibility ([NFR-004](#nfr-004) pattern).
2. Saved edits to an open job become publicly visible without review.
3. Closing a job removes it from public discovery and marks its public detail page as closed.
4. A closed job can be reopened by its owner and becomes publicly visible again.
5. Deletion requires explicit confirmation; cancellation leaves the post unchanged.
6. The client receives visible success or failure feedback for each action.

<a id="fr-019"></a>
### FR-019: Start a Project from a Job Opportunity

**Source:** [S4](#s4), amended by [S5](#s5)  
**Why / Business Rationale:** A job post creates value only when interest converts into an on-platform engagement rather than an off-platform email exchange.  
**Statement:** The system shall allow an authenticated freelancer to start a project from an open job post without exposing the client's email address publicly, replacing the superseded email-enquiry form.

**Acceptance Criteria:**

1. The start-project action is available only on open job posts and opens a start-project flow associated with the current job; an unauthenticated freelancer presents sign-in first ([FR-007](#fr-007) authentication pattern).
2. The flow collects the project title, scope description, and budget amount, with an optional deadline; the job is included automatically in the project context.
3. Required fields and budget format are validated before submission ([NFR-005](#nfr-005) applies to submission-abuse protection design).
4. A valid submission creates the project in the enquiry state and opens its project detail page ([Section 4](#project-requirements)); repeated submission is prevented while a request is in progress.
5. The freelancer receives visible success or failure feedback.
6. The client's email address is not exposed in visible content or client-delivered page data ([NFR-003](#nfr-003)).

<a id="project-requirements"></a>
### Section 4: Project Engagement Requirements

The Project section covers the on-platform engagement lifecycle introduced by [S5](#s5): a project is created from a portfolio item or open job, moves through enquiry → active → delivered → completed (with cancellation available before completion), and presents escrow-simulated payment states. Projects are private to the two involved actors and are the product's retention anchor.

Project states: `Enquiry` (created, awaiting freelancer response) → `Active` (freelancer accepted) → `Delivered` (freelancer submitted deliverable) → `Completed` (client approved; payment released). A project in any pre-completed state can be `Cancelled`.

<a id="fr-020"></a>
### FR-020: Create a Project

**Source:** [S5](#s5)  
**Why / Business Rationale:** Both actors must revolve around a shared, platform-held object for the relationship to stay on-platform.  
**Statement:** An authenticated actor shall be able to create a project containing a title, scope description, budget amount, and optional deadline, linked to its originating portfolio item or job post.

**Acceptance Criteria:**

1. The creation flow is reachable only from the [FR-006](#fr-006) and [FR-019](#fr-019) CTA contexts (no free-floating project creation in the MVP).
2. Required fields (title, scope, budget) are identified before submission; invalid input produces field-level feedback without discarding valid input.
3. The budget is a non-negative amount; an optional deadline, when provided, is a valid future date.
4. A valid submission creates the project in the enquiry state, visible to both parties, and navigates to its project detail page.
5. The creator receives clear success or failure feedback; repeated submission is prevented while a request is in progress.

<a id="fr-021"></a>
### FR-021: Respond to a Project Enquiry

**Source:** [S5](#s5)  
**Why / Business Rationale:** The receiving freelancer must be able to accept or decline work before effort begins.  
**Statement:** The freelancer addressed by a project enquiry shall be able to accept or decline it, and the client shall see the response reflected in the project state.

**Acceptance Criteria:**

1. Accepting moves the project from enquiry to active and enables delivery actions.
2. Declining moves the project to a declined terminal state (presented with cancelled semantics) and disables further lifecycle actions.
3. The client receives visible feedback of the response and can see the resulting project state.
4. Only the addressed freelancer can respond; responses by other actors are rejected by ownership, not interface visibility ([NFR-004](#nfr-004) pattern).

<a id="fr-022"></a>
### FR-022: View the Project Dashboard

**Source:** [S5](#s5)  
**Why / Business Rationale:** A persistent list of ongoing engagements gives both actors a recurring reason to return to the platform.  
**Statement:** Each authenticated actor shall have a project dashboard listing the projects they are involved in, with status, counterpart, budget, and last-activity information.

**Acceptance Criteria:**

1. A project appears only for its two involved actors; no other user's projects are listed or accessible ([NFR-004](#nfr-004) pattern).
2. Each project row identifies the title, counterpart, budget, status badge, and last-activity time.
3. Selecting a project opens its detail page.
4. The dashboard provides loading, empty, and failure states ([FR-014](#fr-014)); the empty state offers guidance toward discovery.

<a id="fr-023"></a>
### FR-023: View the Project Detail Timeline

**Source:** [S5](#s5)  
**Why / Business Rationale:** A shared activity record is the project's center of gravity and replaces off-platform email threads.  
**Statement:** The system shall provide a project detail page with an activity timeline visible to both involved actors, showing lifecycle events, scope notes, and deliverable submissions.

**Acceptance Criteria:**

1. The page presents the project title, status, budget, optional deadline, linked portfolio item or job, and the two involved actors' identities.
2. Lifecycle events (creation, acceptance/decline, funding, deliverable submission, approval, revision request, release, completion, cancellation) appear in chronological order with stable ordering for equal timestamps.
3. The page presents the state-appropriate action set for the viewing actor ([FR-024](#fr-024)–[FR-027](#fr-027)).
4. An unavailable or unauthorized project URL presents a clear not-found or not-authorized state.

<a id="fr-024"></a>
### FR-024: Submit a Deliverable

**Source:** [S5](#s5)  
**Why / Business Rationale:** Work evidence must live on-platform to keep the engagement anchored.  
**Statement:** The project's freelancer shall be able to submit a deliverable on an active project, moving it to the delivered state.

**Acceptance Criteria:**

1. The submit action is available only to the project's freelancer and only in the active state.
2. A deliverable contains a note and, optionally, image attachments; images follow the image-only MVP rule.
3. Submission moves the project to delivered and notifies the client through the timeline and project state.
4. The freelancer receives clear success or failure feedback; repeated submission is prevented while a request is in progress.

<a id="fr-025"></a>
### FR-025: Approve a Deliverable or Request a Revision

**Source:** [S5](#s5)  
**Why / Business Rationale:** Client approval is the trust event that gates payment release.  
**Statement:** The project's client shall be able to approve a delivered project, completing it, or request a revision, returning it to active.

**Acceptance Criteria:**

1. Both actions are available only to the project's client and only in the delivered state.
2. Approval moves the project to completed and triggers the release presentation ([FR-026](#fr-026)).
3. A revision request moves the project back to active and records the request in the timeline; the project can then be delivered again.
4. The freelancer sees the resulting state and the revision note, if any.

<a id="fr-026"></a>
### FR-026: Present Escrow-Simulated Funding and Release

**Source:** [S5](#s5)  
**Why / Business Rationale:** Presenting the middleman money model builds trust and prepares the interface for real payments, without real payment processing in the MVP.  
**Statement:** The system shall present escrow-simulated payment states on a project — fund, funds held, and release — with a cost breakdown that itemizes a flat 10% client-paid platform fee on top of the project budget.

**Acceptance Criteria:**

1. The funding action is available only to the project's client and only from the active state onward; it presents the project as funded with a visible "funds held by the platform" badge ([NFR-008](#nfr-008)).
2. The cost breakdown shows the budget, the 10% platform fee as a separate line item, and the client-paid total, calculated from the entered budget and shown before funding is confirmed ([NFR-008](#nfr-008)).
3. Release is presented on client approval ([FR-025](#fr-025)); the completed state shows a receipt with the same breakdown.
4. No real money moves: funding and release are simulated interface states with mock persistence and are labeled in code and documentation as simulation.
5. Every funding and release action produces visible success or failure feedback and cannot be triggered twice while pending.

<a id="fr-027"></a>
### FR-027: Cancel a Project

**Source:** [S5](#s5)  
**Why / Business Rationale:** Engagements fall through; both actors need a clean exit that keeps the record honest.  
**Statement:** Either involved actor shall be able to cancel a project that has not completed, with the cancellation recorded in the timeline.

**Acceptance Criteria:**

1. Cancellation is available in the enquiry and active states to either involved actor.
2. Cancellation requires explicit confirmation; cancellation leaves the project record visible to both actors in a cancelled state.
3. A cancelled project presents no further lifecycle actions other than viewing its timeline.
4. A funded project that is cancelled presents the held funds as returned to the client in the timeline and breakdown (simulation only).

<a id="cross-cutting-product-requirements"></a>
### Cross-Cutting Product Requirements

The following requirements apply to both the Client and Freelancer sections and are defined once to prevent conflicting or duplicated behavior.

<a id="fr-013"></a>
### FR-013: Navigate Core Journeys

**Source:** [S1](#s1), [S2](#s2)  
**Why / Business Rationale:** Both actors need clear movement between discovery, evaluation, project engagement, and content management.  
**Statement:** The interface shall provide clear navigation to discover work, view portfolio details, start and manage projects, enter the freelancer portal, create work, and manage existing work.

<a id="fr-014"></a>
### FR-014: Present Complete Interface States

**Source:** Frontend-first scope derived from [S1](#s1)  
**Why / Business Rationale:** A prototype that represents only successful data states cannot safely guide later integration.  
**Statement:** Every data-driven screen shall provide appropriate loading, empty, success, validation-error, and request-failure states.

<a id="fr-015"></a>
### FR-015: Apply the Product Visual System

**Source:** [S3](#s3)  
**Why / Business Rationale:** A consistent design system creates a coherent product and makes later implementation reusable.  
**Statement:** The frontend shall use the supplied Tailwind, shadcn, tw-animate-css, Inter Variable, color, radius, and dark-mode theme foundations.

**Acceptance Criteria:**

1. Inter Variable is used as the primary interface typeface.
2. Primary actions use the supplied primary color tokens.
3. Components use the supplied radius scale.
4. Light and dark modes use their corresponding semantic theme tokens.
5. Work imagery remains the primary visual emphasis on discovery and detail screens.

<a id="non-functional-requirements"></a>
## Non-Functional Requirements

<a id="nfr-001"></a>
### NFR-001: Responsive Experience

**Source:** [S2](#s2)  
**Why / Quality Rationale:** The product is web-first, but core journeys must remain usable when clients or freelancers arrive on smaller devices.  
**Statement:** All client and freelancer MVP journeys shall remain usable across desktop, tablet, and mobile viewport classes.  
**Measurement:** Verify every screen and interaction at representative desktop, tablet, and mobile viewport widths with no clipped controls, inaccessible content, or horizontal page overflow.

<a id="nfr-002"></a>
### NFR-002: Accessible Interaction

**Source:** Product-quality requirement associated with [S2](#s2)  
**Why / Quality Rationale:** Discovery, filtering, form submission, and portfolio management must not depend on pointer input or visual cues alone.  
**Statement:** Core navigation, filters, forms, dialogs, galleries, and management actions shall support keyboard interaction, visible focus, programmatic labels, and meaningful image alternative text.  
**Measurement:** Verify the core journeys by keyboard and automated accessibility checks; exact conformance certification is not part of the current scope.

<a id="nfr-003"></a>
### NFR-003: Contact Privacy

**Source:** [S2](#s2)  
**Why / Quality Rationale:** Directly exposing freelancer email addresses increases scraping and spam risk.  
**Statement:** Public client-facing content shall not expose a freelancer's contact email address in visible content or client-delivered page data.  
**Measurement:** Inspect rendered public pages and client network payloads for direct freelancer email disclosure.

<a id="nfr-004"></a>
### NFR-004: Portfolio Ownership

**Source:** [S2](#s2)  
**Why / Quality Rationale:** A freelancer must not be able to alter another freelancer's professional identity or work.  
**Statement:** Portfolio-management authorization shall be enforced by ownership rather than by interface visibility alone.  
**Measurement:** Attempt edit, unpublish, and delete operations against portfolio work owned by a different freelancer and verify that each is rejected.

<a id="nfr-005"></a>
### NFR-005: Contact Abuse Protection

**Source:** Quality refinement of [FR-006](#fr-006)  
**Why / Quality Rationale:** A public contact form can otherwise become a source of spam or automated abuse.  
**Statement:** The contact-delivery design shall support server-side validation, rate limiting, and automated-abuse protection.  
**Measurement:** Exact rate limits and abuse controls shall be defined before backend implementation; the frontend shall support throttled and rejected-submission feedback states.

<a id="nfr-006"></a>
### NFR-006: Stable Image Presentation

**Source:** Image-only MVP decision in [S2](#s2)  
**Why / Quality Rationale:** Portfolio imagery is the dominant content and must not make discovery feel unstable while loading.  
**Statement:** Portfolio images shall preserve their intended aspect ratio and reserve presentation space before loading completes.  
**Measurement:** Verify that image loading does not cause portfolio controls or surrounding cards to shift outside their allocated layout regions.

<a id="nfr-007"></a>
### NFR-007: Theme Legibility

**Source:** [S3](#s3)  
**Why / Quality Rationale:** Semantic light and dark tokens are useful only when content and interaction states remain understandable in both modes.  
**Statement:** Core screens, controls, focus states, validation states, and image overlays shall remain legible in light and dark themes.  
**Measurement:** Visually verify all core screen states in both themes and run automated contrast checks where applicable.

<a id="nfr-008"></a>
### NFR-008: Fee Transparency

**Source:** [S5](#s5)  
**Why / Quality Rationale:** The platform fee builds the middleman trust model only when it is visible upfront; surprise costs destroy it.  
**Statement:** The 10% client-paid platform fee shall be presented as a separate, itemized line in the project cost breakdown before funding confirmation and in the completed-state receipt, calculated from the project budget.  
**Measurement:** Verify the breakdown on the funding confirmation and receipt states for representative budgets, including rounding behavior for fractional amounts.

<a id="screen-inventory"></a>
## Frontend Screen Inventory

### Client Screens

1. Public discovery/home page
2. Filtered discovery state
3. Portfolio detail page
4. Start-project flow (from portfolio item)
5. Create/edit job post page
6. Job management list

### Freelancer Screens

1. Freelancer portal/dashboard
2. Create/edit portfolio page
3. Portfolio preview

### Job Screens (client and freelancer)

1. Job discovery page
2. Job detail page
3. Start-project flow (from job post)

### Project Screens (client and freelancer)

1. Start-project form (shared by FR-006 and FR-019 entry points)
2. Project dashboard (per actor)
3. Project detail page with activity timeline
4. Escrow-simulated funding confirmation, funds-held, and release/receipt states

Loading, empty, success, validation-error, and request-failure states apply to screens in all sections.

<a id="open-decisions"></a>
## Open Decisions

The following decisions do not block initial frontend design, but must be resolved before backend implementation planning:

1. Maximum image count, file size, accepted formats, and image dimensions.
2. Expected catalog size and the resulting pagination or progressive-loading behavior.
3. Start-project and deliverable-submission rate limits and chosen automated-abuse protection.
4. ~~Email delivery provider and reply-routing behavior.~~ Superseded by [S5](#s5): the email-delivery contact flow was replaced by the project lifecycle.
5. Authentication provider and account-recovery behavior for freelancers.
6. Required performance budgets and expected traffic or concurrency.
7. Whether permanent deletion requires a recovery period.
8. Confirmation that **Jes tae tver tv** is the intended final spelling and capitalization.
9. Job post field set: optional budget range, deadline, and attachment support; maximum lengths.
10. Job lifecycle states: whether jobs also need a draft state like portfolio work, or only open/closed.
11. How a started project's freelancer relates to the responding identity (project is created from a job by the responding freelancer).
12. Payment-provider decision for the future real-escrow phase; whether a licensed partner holds funds rather than the platform ([S5](#s5) future scope).
13. Dispute-resolution and refund policy for the future real-escrow phase, including chargeback handling and payout delay.
14. Whether the MVP's simulated escrow states need an explicit in-interface "simulation" disclosure before real payments arrive.
15. Future-scope internal chat: whether messaging is added inside the project timeline and how contact-detail masking is handled.

<a id="downstream-artifact-registry"></a>
## Downstream Artifact Registry

Downstream artifacts shall cite these `FR-*` and `NFR-*` identifiers instead of duplicating their definitions.

| Artifact | File Path | Status | Generating Skill | Scope & Key Decisions Captured |
| :--- | :--- | :--- | :--- | :--- |
| User Stories | [Freelance.UserStories.md](Freelance.UserStories.md) | Draft for approval | `user-stories` | Client and Freelancer journeys, story slices, acceptance criteria, and delivery sequence |
| Page Specification | [Freelance.Page.Discovery.md](Freelance.Page.Discovery.md) | Draft for approval | Direct authoring | Discovery/home screen layout, card and filter behavior, states, responsive and accessibility rules |
| Page Specification | [Freelance.Page.JobPosting.md](Freelance.Page.JobPosting.md) | Draft for approval | Direct authoring | Job post create/edit and management screens, field rules, and FR-016/FR-018 traceability |
| Page Specification | [Freelance.Page.Project.md](Freelance.Page.Project.md) | Draft for approval | Direct authoring | Start-project flow, project dashboard, project detail timeline, escrow-simulated funding/release states, and FR-020–FR-027 traceability |
| Domain Model | `Freelance.Domain.md` | Not started | `domain-modeling` | Portfolio concepts, ownership, publication lifecycle, and invariants |
| Data Dictionary | `Freelance.DataDictionary.md` | Not started | `attribute-catalog` | Exact attributes, media metadata, nullability, and constraints |
| API Contract | `Freelance.Contract.md` | Not started | `frontend-contract-extractor` | Requests, responses, validation errors, and project-lifecycle contract |
| Implementation Plan | `Freelance.ImplementationPlan.md` | Not started | `implementation-planning` | Frontend-first execution phases, file targets, and verification |
| Component Map | `Freelance.Map.md` | Not started | `post-written-feature-map` | Code-confirmed routes, components, state ownership, and runtime flows |

<a id="readiness"></a>
## Readiness

The functional behavior is coherent enough to proceed to frontend screen design and user-flow definition. The project lifecycle ([Section 4](#project-requirements)) is frontend-first: escrow states are simulated and real payment behavior remains conditional on resolving the applicable decisions in [Open Decisions](#open-decisions).
