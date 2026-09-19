# Jes tae tver tv — Freelance Portfolio Discovery User Stories

<a id="document-status"></a>
## Document Status

- **Status:** Draft for approval
- **Scope:** Frontend-first MVP
- **Actors:** Client and Freelancer
- **Primary upstream source:** [Freelance.Requirement.md](Freelance.Requirement.md)
- **Latest scope decision:** [S5](Freelance.Requirement.md#s5) — project-centric engagement; contact CTAs create on-platform projects instead of email enquiries
- **Design reference:** No external design file exists yet; use the [Frontend Screen Inventory](Freelance.Requirement.md#screen-inventory) and supplied product theme.

<a id="story-map"></a>
## Story Map

### Client Flow

`Discover published work → Filter relevant work → Review portfolio details and related work → Contact the freelancer`

| Journey Step | Story | Outcome |
| :--- | :--- | :--- |
| Discover | [STORY-001](#story-001) | Client sees recent, published portfolio work. |
| Narrow | [STORY-002](#story-002) | Client filters by category and industry. |
| Evaluate | [STORY-003](#story-003) | Client reviews project details and related work. |
| Contact | [STORY-004](#story-004) | Client starts a project from a portfolio item *(amended by S5; see [STORY-014](#story-014))*.* |

### Freelancer Flow

`Enter portal → Create image-based work → Save or preview → Publish immediately → Manage published work`

| Journey Step | Story | Outcome |
| :--- | :--- | :--- |
| Access | [STORY-005](#story-005) | Freelancer enters their private portfolio portal. |
| Create | [STORY-006](#story-006) | Freelancer prepares an image-based portfolio item. |
| Prepare | [STORY-007](#story-007) | Freelancer saves a draft and previews its presentation. |
| Publish | [STORY-008](#story-008) | Freelancer publishes valid work without approval. |
| Maintain | [STORY-009](#story-009) | Freelancer edits, unpublishes, or deletes their work. |

### Job Flow (client posts, freelancer discovers)

`Post a job → Discover open jobs → Review job details → Respond → Manage job posts`

| Journey Step | Story | Outcome |
| :--- | :--- | :--- |
| Post | [STORY-010](#story-010) | Client publishes a job opportunity immediately. |
| Discover | [STORY-011](#story-011) | Freelancers find open jobs by category and industry. |
| Respond | [STORY-012](#story-012) | Freelancer starts a project from an open job *(amended by S5; see [STORY-014](#story-014))*.* |
| Maintain | [STORY-013](#story-013) | Client edits, closes, reopens, or deletes their job posts. |

### Project Flow (S5 — both actors, anchored to an engagement)

`Start a project from a portfolio or job → Respond to the enquiry → Track projects on the dashboard → Deliver and review work → Fund and release (simulated) → Complete or cancel`

| Journey Step | Story | Outcome |
| :--- | :--- | :--- |
| Start | [STORY-014](#story-014) | A client or freelancer converts interest into an on-platform project. |
| Respond | [STORY-015](#story-015) | The freelancer accepts or declines the project enquiry. |
| Track | [STORY-016](#story-016) | Both actors follow the engagement from dashboards and the project timeline. |
| Work | [STORY-017](#story-017) | The freelancer delivers work; the client approves or requests a revision. |
| Pay | [STORY-018](#story-018) | The client sees the 10% fee breakdown and simulated escrow fund/release states. |
| Exit | [STORY-019](#story-019) | Either actor cancels an engagement that will not proceed. |

<a id="client-user-stories"></a>
## Section 1: Client User Stories

<a id="story-001"></a>
### STORY-001: Discover Recent Portfolio Work

**Card:** Browse published work in an image-led discovery experience.

**Upstream Source & Rationale:** Traces to [FR-001](Freelance.Requirement.md#fr-001), [FR-002](Freelance.Requirement.md#fr-002), [FR-013](Freelance.Requirement.md#fr-013), and [NFR-006](Freelance.Requirement.md#nfr-006). *Why:* Clients need an immediate visual view of current work before they can identify a suitable freelancer.

**Description:** As a client, I want to browse recently published portfolio work, so that I can discover freelancers through examples of their work.

**Conversation:**

- The discovery page is public and does not require a client account.
- Work imagery is the main visual focus, inspired by Dribbble-style discovery without copying Dribbble's interface.
- Only published work can appear.
- Recent work is ordered from newest publication to oldest.

**Design:** [Public discovery and shared UI states](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-001-ac-01"></a>The client can open the public discovery page without signing in.
2. <a id="story-001-ac-02"></a>The page shows published work in a responsive, image-forward grid.
3. <a id="story-001-ac-03"></a>Each card shows its cover image, project title, freelancer, category, and industry.
4. <a id="story-001-ac-04"></a>The recent view orders work from newest publication to oldest using stable ordering for equal publication times.
5. <a id="story-001-ac-05"></a>Draft and unpublished work never appears in the public grid.
6. <a id="story-001-ac-06"></a>The page provides usable loading, empty, and failure states without causing image-card layout shifts.

<a id="story-002"></a>
### STORY-002: Filter Work by Category and Industry

**Card:** Narrow the public portfolio catalog using relevant filters.

**Upstream Source & Rationale:** Traces to [FR-003](Freelance.Requirement.md#fr-003), [FR-014](Freelance.Requirement.md#fr-014), and [NFR-002](Freelance.Requirement.md#nfr-002). *Why:* A client should not have to inspect unrelated work to find experience that fits the desired discipline and business context.

**Description:** As a client, I want to filter portfolio work by work category and industry, so that I can quickly find relevant freelancers.

**Conversation:**

- Category describes the type of work; industry describes the business context.
- The two filters can be used independently or together.
- Filtering applies only to published work.
- The MVP does not require personalized recommendations.

**Design:** [Filtered discovery state](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-002-ac-01"></a>The client can select a work category, an industry, or both.
2. <a id="story-002-ac-02"></a>The grid updates to show only published work matching all active filters.
3. <a id="story-002-ac-03"></a>Every active filter is visibly identified and operable by keyboard.
4. <a id="story-002-ac-04"></a>The client can remove one filter without clearing the other filters.
5. <a id="story-002-ac-05"></a>The client can reset all filters in one action.
6. <a id="story-002-ac-06"></a>A helpful empty state appears when no published work matches the selected filters.

<a id="story-003"></a>
### STORY-003: Review Portfolio Details and Related Work

**Card:** Open a portfolio item and evaluate the work in context.

**Upstream Source & Rationale:** Traces to [FR-004](Freelance.Requirement.md#fr-004), [FR-005](Freelance.Requirement.md#fr-005), and [NFR-006](Freelance.Requirement.md#nfr-006). *Why:* A cover image alone is not enough for a client to judge the relevance and quality of a freelancer's work.

**Description:** As a client, I want to review a portfolio item's images, project context, and related work, so that I can decide whether the freelancer fits my needs.

**Conversation:**

- Selecting a discovery card opens a dedicated page for that portfolio item.
- The page is image-led but includes enough written context to evaluate the project.
- Related work is based on a shared category or industry.
- An unpublished or unavailable item must not leak stale content.

**Design:** [Portfolio detail page](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-003-ac-01"></a>Selecting a published work card opens the matching portfolio detail page.
2. <a id="story-003-ac-02"></a>The page shows the project title, description, cover image, image gallery, category, industry, and freelancer identity.
3. <a id="story-003-ac-03"></a>The page shows a prominent contact-freelancer call to action.
4. <a id="story-003-ac-04"></a>Related results contain published work sharing the current item's category or industry and exclude the current item.
5. <a id="story-003-ac-05"></a>The page remains complete when no related work is available.
6. <a id="story-003-ac-06"></a>An unavailable or unpublished portfolio URL shows a clear not-found state rather than portfolio content.

<a id="story-004"></a>
### STORY-004: Start a Project from a Portfolio Item

**Card:** Convert interest on a portfolio detail page into an on-platform project.

**Upstream Source & Rationale:** Traces to [FR-006](Freelance.Requirement.md#fr-006), [FR-020](Freelance.Requirement.md#fr-020), and [NFR-003](Freelance.Requirement.md#nfr-003). *Why:* Discovery becomes commercially useful only when an interested client can engage the responsible freelancer on-platform; delivering contact details by email caused disintermediation ([S5](Freelance.Requirement.md#s5)).

**Description:** As a client, I want to start a project about a portfolio item, so that I can engage its freelancer inside the platform.

**Conversation:**

- Amended by [S5](Freelance.Requirement.md#s5): the superseded email-enquiry form is replaced by the start-project flow; see [STORY-014](#story-014) for the shared flow criteria.
- The action is tied to the currently viewed portfolio item.
- The freelancer's email address is not displayed or delivered in public page data.

**Design:** [Start-project flow](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-004-ac-01"></a>Selecting the contact CTA on a portfolio detail page opens the start-project flow associated with that item.
2. <a id="story-004-ac-02"></a>An unauthenticated visitor is presented sign-in first and returned to the flow afterwards.
3. <a id="story-004-ac-03"></a>The portfolio item is automatically included in the project context and does not need to be re-entered.
4. <a id="story-004-ac-04"></a>Invalid or missing input produces accessible field-level feedback before submission.
5. <a id="story-004-ac-05"></a>A valid submission creates the project in the enquiry state, blocks repeated submission while pending, and shows visible success or failure feedback.
6. <a id="story-004-ac-06"></a>The public interface and client-delivered page data do not reveal the freelancer's email address.

<a id="freelancer-user-stories"></a>
## Section 2: Freelancer User Stories

<a id="story-005"></a>
### STORY-005: Access My Freelancer Portal

**Card:** Enter a private surface for managing portfolio work.

**Upstream Source & Rationale:** Traces to [FR-007](Freelance.Requirement.md#fr-007), [FR-013](Freelance.Requirement.md#fr-013), and [NFR-004](Freelance.Requirement.md#nfr-004). *Why:* Portfolio-management actions must belong to the freelancer who owns the work.

**Description:** As a freelancer, I want to access my private portfolio portal, so that I can create and control my own work.

**Conversation:**

- Freelancer authentication may use a mock integration during frontend-first development.
- Both signed-in and signed-out states must still be represented.
- There is no client account or actor-switching flow in the MVP.
- Hiding controls is not enough; ownership must eventually be enforced by the system boundary.

**Design:** [Freelancer portal/dashboard](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-005-ac-01"></a>An unauthenticated visitor cannot use portfolio creation or management actions.
2. <a id="story-005-ac-02"></a>An authenticated freelancer can enter the freelancer portal.
3. <a id="story-005-ac-03"></a>The portal shows the freelancer's own draft, published, and unpublished work with clear status labels.
4. <a id="story-005-ac-04"></a>The portal provides clear navigation to create work and manage existing work.
5. <a id="story-005-ac-05"></a>A freelancer cannot open management actions for another freelancer's work.

<a id="story-006"></a>
### STORY-006: Create Image-Based Portfolio Work

**Card:** Prepare a new portfolio item using project information and images.

**Upstream Source & Rationale:** Traces to [FR-008](Freelance.Requirement.md#fr-008), [FR-014](Freelance.Requirement.md#fr-014), and [NFR-006](Freelance.Requirement.md#nfr-006). *Why:* Freelancer-created work supplies the portfolio catalog that clients browse.

**Description:** As a freelancer, I want to create an image-based portfolio item, so that I can present my completed work to potential clients.

**Conversation:**

- The MVP accepts images only; it does not offer video upload.
- A portfolio item includes a title, description, cover image, optional additional images, category, and industry.
- Exact image count, file size, format, and dimension limits remain an open backend decision.
- Valid input should remain present when another field fails validation.

**Design:** [Create/edit portfolio page](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-006-ac-01"></a>The create page identifies all required information before the freelancer attempts to publish.
2. <a id="story-006-ac-02"></a>The freelancer can enter a title and description and select a work category and industry.
3. <a id="story-006-ac-03"></a>The freelancer can add a cover image and optional additional images, but is not offered video upload.
4. <a id="story-006-ac-04"></a>The selected cover image is clearly identifiable before saving or publishing.
5. <a id="story-006-ac-05"></a>Invalid or incomplete fields show accessible field-level feedback without clearing valid entered content.
6. <a id="story-006-ac-06"></a>The screen provides understandable image-selection, loading, success, and failure states.

<a id="story-007"></a>
### STORY-007: Save and Preview Draft Work

**Card:** Keep incomplete work private and preview its public presentation.

**Upstream Source & Rationale:** Traces to [FR-009](Freelance.Requirement.md#fr-009) and [FR-012](Freelance.Requirement.md#fr-012). *Why:* Freelancers need time to prepare polished work and must be able to inspect its visual presentation without publishing it accidentally.

**Description:** As a freelancer, I want to save unfinished work as a draft and preview it, so that I can refine its presentation before clients see it.

**Conversation:**

- A draft belongs only to its freelancer and is never public.
- Preview uses the current form or saved draft content.
- Preview is a presentation check, not a publication action.
- Returning from preview must preserve the freelancer's work.

**Design:** [Portfolio preview and draft states](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-007-ac-01"></a>The freelancer can save incomplete portfolio work as a draft.
2. <a id="story-007-ac-02"></a>The saved draft appears in its owner's portal with a draft status.
3. <a id="story-007-ac-03"></a>The draft does not appear in public discovery, public detail pages, or related work.
4. <a id="story-007-ac-04"></a>The freelancer can resume editing a saved draft.
5. <a id="story-007-ac-05"></a>Preview reflects the current unsaved or saved draft data without publishing it.
6. <a id="story-007-ac-06"></a>The freelancer can return from preview without losing entered content.

<a id="story-008"></a>
### STORY-008: Publish Work Without Approval

**Card:** Make valid portfolio work public immediately.

**Upstream Source & Rationale:** Traces to [FR-010](Freelance.Requirement.md#fr-010), [FR-001](Freelance.Requirement.md#fr-001), and [FR-004](Freelance.Requirement.md#fr-004). *Why:* Immediate self-publishing removes the administrative bottleneck and makes new freelancer work available to clients quickly.

**Description:** As a freelancer, I want to publish valid portfolio work immediately, so that clients can discover it without waiting for admin approval.

**Conversation:**

- There is no moderation or approval step in the MVP.
- Required content must be valid before publication.
- Successful publication changes the work from private preparation to public discovery.
- Failure must not leave the freelancer uncertain about whether the item became public.

**Design:** [Create/edit portfolio and published states](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-008-ac-01"></a>The publish action is available to the owner of the portfolio work.
2. <a id="story-008-ac-02"></a>Publication is blocked when required information is missing or invalid, with clear corrective feedback.
3. <a id="story-008-ac-03"></a>Valid work publishes without an administrative approval step.
4. <a id="story-008-ac-04"></a>Successful publication creates an accessible public detail page and makes the work eligible for discovery and related results.
5. <a id="story-008-ac-05"></a>The portal shows the item as published after success.
6. <a id="story-008-ac-06"></a>The freelancer receives unambiguous success or failure feedback and cannot accidentally send repeated publish requests while one is pending.

<a id="story-009"></a>
### STORY-009: Manage Existing Portfolio Work

**Card:** Keep portfolio work accurate and control its public availability.

**Upstream Source & Rationale:** Traces to [FR-011](Freelance.Requirement.md#fr-011) and [NFR-004](Freelance.Requirement.md#nfr-004). *Why:* A freelancer's portfolio changes over time, so its owner needs safe control over content and visibility.

**Description:** As a freelancer, I want to edit, unpublish, or delete my portfolio work, so that my public portfolio stays accurate and under my control.

**Conversation:**

- Saved edits to published work become public without review.
- Unpublishing is reversible and keeps the item in the owner's portal.
- Deletion removes the item and requires explicit confirmation.
- Whether deletion has a recovery period remains an open decision.

**Design:** [Freelancer portal and create/edit screens](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-009-ac-01"></a>The freelancer can open and edit only portfolio work they own.
2. <a id="story-009-ac-02"></a>Saved edits to published work become visible on its public detail page without review.
3. <a id="story-009-ac-03"></a>Unpublishing removes the item from discovery, related results, and its public detail page while retaining it in the owner's portal.
4. <a id="story-009-ac-04"></a>The freelancer can publish valid unpublished work again.
5. <a id="story-009-ac-05"></a>Deletion requires explicit confirmation and cancellation leaves the item unchanged.
6. <a id="story-009-ac-06"></a>Confirmed deletion removes the item from the owner's management list and all public surfaces, with visible success or failure feedback.

<a id="job-user-stories"></a>
## Section 3: Job Opportunity User Stories

<a id="story-010"></a>
### STORY-010: Post a Job Opportunity

**Card:** Publish an open job so suitable freelancers can find it.

**Upstream Source & Rationale:** Traces to [FR-016](Freelance.Requirement.md#fr-016), [FR-014](Freelance.Requirement.md#fr-014), and [NFR-003](Freelance.Requirement.md#nfr-003). *Why:* Discovery currently flows one way; clients need a direct way to invite freelancers with matching experience.

**Description:** As a client, I want to post a job opportunity with a title, description, category, and industry, so that freelancers with the right experience can find and respond to it.

**Conversation:**

- Job posting requires a client identity; browsing and responding stay account-free.
- Jobs publish immediately without administrative approval.
- The client's email is collected for delivery but never publicly displayed.
- Exact optional fields (budget, deadline) remain an open decision.

**Design:** [Create/edit job post page](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-010-ac-01"></a>An authenticated client can create a job with a title, description, work category, and industry.
2. <a id="story-010-ac-02"></a>Required fields are identified before publishing, and invalid input shows field-level feedback without discarding valid content.
3. <a id="story-010-ac-03"></a>Publishing is blocked until required information is valid.
4. <a id="story-010-ac-04"></a>Successful publication creates a public job detail page ordered into job discovery by newest first.
5. <a id="story-010-ac-05"></a>The client's email address is not visible on the public job post or in client-delivered page data.
6. <a id="story-010-ac-06"></a>The client receives clear success or failure feedback and cannot send repeated publish requests while one is pending.

<a id="story-011"></a>
### STORY-011: Discover Open Job Opportunities

**Card:** Browse open jobs filtered by relevant discipline and industry.

**Upstream Source & Rationale:** Traces to [FR-017](Freelance.Requirement.md#fr-017), [FR-002](Freelance.Requirement.md#fr-002), and [NFR-006](Freelance.Requirement.md#nfr-006). *Why:* A freelancer should not have to inspect unrelated jobs to find work that fits their discipline and business context.

**Description:** As a freelancer, I want to browse open jobs ordered newest-first and filter them by category and industry, so that I can quickly find relevant opportunities.

**Conversation:**

- Job discovery is public and does not require an account.
- Filters mirror the portfolio discovery behavior for consistency.
- Closed and draft jobs never appear.
- The MVP does not include job alerts or saved searches.

**Design:** [Job discovery page](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-011-ac-01"></a>The freelancer can open the public job discovery page without signing in.
2. <a id="story-011-ac-02"></a>Job cards show title, description snippet, category, industry, and publication date.
3. <a id="story-011-ac-03"></a>Jobs are ordered newest first with stable secondary ordering.
4. <a id="story-011-ac-04"></a>Category and industry filters combine, are individually removable, and resettable in one action.
5. <a id="story-011-ac-05"></a>Closed jobs never appear in discovery.
6. <a id="story-011-ac-06"></a>A helpful empty state appears when no open job matches, and loading/empty/failure states follow FR-014.

<a id="story-012"></a>
### STORY-012: Start a Project from a Job Opportunity

**Card:** Convert interest on an open job post into an on-platform project.

**Upstream Source & Rationale:** Traces to [FR-019](Freelance.Requirement.md#fr-019), [FR-020](Freelance.Requirement.md#fr-020), and [NFR-003](Freelance.Requirement.md#nfr-003). *Why:* A job post creates value only when a matching freelancer's interest becomes an on-platform engagement rather than an off-platform email exchange ([S5](Freelance.Requirement.md#s5)).

**Description:** As a freelancer, I want to start a project about an open job, so that the client can engage me for the work inside the platform.

**Conversation:**

- Amended by [S5](Freelance.Requirement.md#s5): the superseded email-enquiry form is replaced by the start-project flow; see [STORY-014](#story-014) for the shared flow criteria.
- The action is tied to the currently viewed job and is available only while it is open.
- The client's email address is not displayed or delivered in public page data.
- The MVP does not include internal chat or an application tracker.

**Design:** [Start-project flow](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-012-ac-01"></a>Selecting the respond CTA on an open job opens the start-project flow associated with that job.
2. <a id="story-012-ac-02"></a>An unauthenticated freelancer is presented sign-in first and returned to the flow afterwards.
3. <a id="story-012-ac-03"></a>The job is automatically included in the project context.
4. <a id="story-012-ac-04"></a>Invalid input produces accessible field-level feedback before submission.
5. <a id="story-012-ac-05"></a>A valid submission creates the project in the enquiry state, blocks repeat submission while pending, and shows visible success or failure feedback.
6. <a id="story-012-ac-06"></a>The client's email address is not revealed in the interface or network payloads.

<a id="story-013"></a>
### STORY-013: Manage Job Posts

**Card:** Keep job posts accurate and control their availability.

**Upstream Source & Rationale:** Traces to [FR-018](Freelance.Requirement.md#fr-018) and [NFR-004](Freelance.Requirement.md#nfr-004). *Why:* Staffing needs change, so the owning client must control each post's content and visibility.

**Description:** As a client, I want to edit, close, reopen, and delete my job posts, so that my open listings stay accurate and under my control.

**Conversation:**

- Saved edits to open jobs become public without review.
- Closing is reversible; a closed job remains in the owner's management list.
- Deletion removes the post and requires explicit confirmation.
- Ownership is enforced by the system boundary, not by hidden interface controls.

**Design:** [Job management list and create/edit job post pages](Freelance.Requirement.md#screen-inventory)

**Confirmation — Acceptance Criteria:**

1. <a id="story-013-ac-01"></a>The client can open and manage only job posts they own.
2. <a id="story-013-ac-02"></a>Saved edits to an open job become visible on its public detail page without review.
3. <a id="story-013-ac-03"></a>Closing removes the job from discovery and marks its public page as closed while retaining it in the owner's management list.
4. <a id="story-013-ac-04"></a>A closed job can be reopened and becomes publicly visible again.
5. <a id="story-013-ac-05"></a>Deletion requires explicit confirmation; cancellation leaves the post unchanged.
6. <a id="story-013-ac-06"></a>Every management action shows clear success or failure feedback.

<a id="project-user-stories"></a>
## Section 4: Project Engagement User Stories

<a id="story-014"></a>
### STORY-014: Start a Project

**Card:** Convert a contact or respond CTA into a project with scope and budget.

**Upstream Source & Rationale:** Traces to [FR-020](Freelance.Requirement.md#fr-020), [FR-006](Freelance.Requirement.md#fr-006), [FR-019](Freelance.Requirement.md#fr-019), and [NFR-008](Freelance.Requirement.md#nfr-008). *Why:* The disintermediation fix requires every engagement to begin as an on-platform object both actors return to.

**Description:** As an authenticated actor, I want to start a project with a title, scope, budget, and optional deadline from a portfolio item or job, so that our work happens on the platform.

**Conversation:**

- Creation is reachable only from the FR-006/FR-019 CTA contexts in the MVP.
- The cost preview shows the budget, the 10% platform fee, and the client-paid total before submission.
- The project starts in the enquiry state, visible to both parties.
- Budget/deadline limits remain an open decision.

**Design:** [Start-project flow](Freelance.Page.Project.md#start-project-flow)

**Confirmation — Acceptance Criteria:**

1. <a id="story-014-ac-01"></a>The flow identifies required fields before submission and shows the linked source context automatically.
2. <a id="story-014-ac-02"></a>The cost preview itemizes budget, 10% platform fee, and total, updating live with the entered budget.
3. <a id="story-014-ac-03"></a>Invalid input shows field-level feedback without discarding valid content.
4. <a id="story-014-ac-04"></a>A valid submission creates the project in the enquiry state and opens its detail page.
5. <a id="story-014-ac-05"></a>Repeated submission is prevented while pending, with clear success or failure feedback.

<a id="story-015"></a>
### STORY-015: Respond to a Project Enquiry

**Card:** Accept or decline requested work.

**Upstream Source & Rationale:** Traces to [FR-021](Freelance.Requirement.md#fr-021). *Why:* The freelancer must control which engagements they take before effort or payment expectations begin.

**Description:** As a freelancer, I want to accept or decline a project enquiry, so that the client knows immediately whether the work will proceed.

**Conversation:**

- Accepting activates the project; declining ends it without erasing the record.
- Only the addressed freelancer can respond (ownership-enforced).
- The MVP has no chat, so the scope description on the enquiry carries the context.

**Design:** [Project detail page](Freelance.Page.Project.md#project-detail)

**Confirmation — Acceptance Criteria:**

1. <a id="story-015-ac-01"></a>The enquiry presents Accept and Decline actions to the addressed freelancer only.
2. <a id="story-015-ac-02"></a>Accepting moves the project to active and enables delivery actions.
3. <a id="story-015-ac-03"></a>Declining moves the project to a terminal declined state with no further lifecycle actions.
4. <a id="story-015-ac-04"></a>The client sees the response reflected in the project state and timeline.

<a id="story-016"></a>
### STORY-016: Track Projects on the Dashboard and Timeline

**Card:** Follow ongoing engagements from a personal list and a shared detail page.

**Upstream Source & Rationale:** Traces to [FR-022](Freelance.Requirement.md#fr-022), [FR-023](Freelance.Requirement.md#fr-023), and [NFR-004](Freelance.Requirement.md#nfr-004). *Why:* Recurring visibility of live engagements is the retention mechanism that keeps both actors returning to the platform.

**Description:** As an involved actor, I want a dashboard of my projects and a shared timeline per project, so that the engagement's full history and state stay in one place.

**Conversation:**

- Projects are visible only to their two involved actors.
- The dashboard shows status, counterpart, budget, and last activity; rows open the detail page.
- The timeline records every lifecycle event chronologically.

**Design:** [Project dashboard and detail](Freelance.Page.Project.md#project-dashboard)

**Confirmation — Acceptance Criteria:**

1. <a id="story-016-ac-01"></a>The dashboard lists only projects the signed-in actor is involved in, with status badges and last-activity ordering.
2. <a id="story-016-ac-02"></a>Selecting a row opens the project detail page.
3. <a id="story-016-ac-03"></a>The detail page shows title, status, budget, deadline, parties, linked source, and a chronological timeline.
4. <a id="story-016-ac-04"></a>A non-member opening a project URL sees a not-found or not-authorized state.
5. <a id="story-016-ac-05"></a>The empty dashboard offers guidance back to discovery; loading and failure states follow FR-014.

<a id="story-017"></a>
### STORY-017: Deliver and Review Work

**Card:** Move work through delivery, revision, and approval inside the project.

**Upstream Source & Rationale:** Traces to [FR-024](Freelance.Requirement.md#fr-024) and [FR-025](Freelance.Requirement.md#fr-025). *Why:* Work evidence and the approval decision must live on-platform for the engagement (and later, the payment) to stay there.

**Description:** As a freelancer, I want to submit deliverables, and as a client, I want to approve them or request a revision, so that work quality is confirmed before payment release.

**Conversation:**

- Deliverables are a note plus optional images (image-only MVP rule).
- A revision request returns the project to active and is recorded in the timeline; the project can be delivered again.
- Approval completes the project and triggers the release presentation.

**Design:** [Project detail page](Freelance.Page.Project.md#project-detail)

**Confirmation — Acceptance Criteria:**

1. <a id="story-017-ac-01"></a>The freelancer can submit a deliverable on an active project, moving it to delivered.
2. <a id="story-017-ac-02"></a>The client can approve a delivered project, completing it, or request a revision, returning it to active.
3. <a id="story-017-ac-03"></a>Actions are unavailable to the wrong role or in the wrong state.
4. <a id="story-017-ac-04"></a>Every submission, approval, and revision request appears in the timeline with the actor and note.
5. <a id="story-017-ac-05"></a>Repeated submissions are prevented while pending, with clear success or failure feedback.

<a id="story-018"></a>
### STORY-018: Fund and Release Payment (Simulated Escrow)

**Card:** See the platform hold funds until approval, with an upfront 10% fee breakdown.

**Upstream Source & Rationale:** Traces to [FR-026](Freelance.Requirement.md#fr-026) and [NFR-008](Freelance.Requirement.md#nfr-008). *Why:* The visible middleman money model is what makes both actors trust the platform; the MVP presents these states without real payment processing.

**Description:** As a client, I want to fund a project, see that the platform holds the funds, and see them released on my approval with a clear 10% fee breakdown, so that I can trust paying through the platform.

**Conversation:**

- The fee is a flat 10%, paid by the client on top of the budget: budget $100 → fee $10 → total $110.
- The breakdown is shown before funding confirmation and again in the completed receipt.
- Funding and release are simulated interface states; no real money moves in the MVP.

**Design:** [Escrow-simulated payment states](Freelance.Page.Project.md#project-detail)

**Confirmation — Acceptance Criteria:**

1. <a id="story-018-ac-01"></a>The client can fund a project from the active state; a funds-held badge is then visible to both actors.
2. <a id="story-018-ac-02"></a>The cost breakdown itemizes budget, 10% platform fee, and client-paid total before funding is confirmed.
3. <a id="story-018-ac-03"></a>Approval presents the release and the completed state shows a receipt with the same breakdown.
4. <a id="story-018-ac-04"></a>Funding and release cannot be triggered twice while pending and always produce visible feedback.
5. <a id="story-018-ac-05"></a>No real payment processing call is made; the states persist through mock data only.

<a id="story-019"></a>
### STORY-019: Cancel a Project

**Card:** End an engagement that will not proceed, cleanly and visibly.

**Upstream Source & Rationale:** Traces to [FR-027](Freelance.Requirement.md#fr-027). *Why:* Engagements fall through; a clean, recorded exit keeps the platform the system of record even for failed deals.

**Description:** As an involved actor, I want to cancel a project that has not completed, so that both sides see it is closed.

**Conversation:**

- Cancellation is available in the enquiry and active states to either involved actor.
- Cancellation requires explicit confirmation and keeps the record visible as cancelled.
- A funded cancellation presents the held funds as returned to the client (simulation only).

**Design:** [Project detail page](Freelance.Page.Project.md#project-detail)

**Confirmation — Acceptance Criteria:**

1. <a id="story-019-ac-01"></a>Either involved actor can cancel a project in the enquiry or active state.
2. <a id="story-019-ac-02"></a>Cancellation requires explicit confirmation; cancellation leaves the record unchanged in content.
3. <a id="story-019-ac-03"></a>The cancelled project shows no further lifecycle actions other than viewing its timeline.
4. <a id="story-019-ac-04"></a>A funded project's cancellation records the funds returned to the client in the timeline and breakdown.
5. <a id="story-019-ac-05"></a>The cancellation event appears in the timeline with the cancelling actor and timestamp.

<a id="shared-delivery-expectations"></a>
## Shared Delivery Expectations

These conditions apply across the relevant stories and do not represent separate user value slices:

- All Client and Freelancer journeys follow [NFR-001: Responsive Experience](Freelance.Requirement.md#nfr-001).
- Navigation, forms, filters, dialogs, galleries, and management actions follow [NFR-002: Accessible Interaction](Freelance.Requirement.md#nfr-002).
- Every data-driven story includes the applicable states required by [FR-014: Present Complete Interface States](Freelance.Requirement.md#fr-014).
- All screens use the product foundation in [FR-015: Apply the Product Visual System](Freelance.Requirement.md#fr-015) and remain legible under [NFR-007: Theme Legibility](Freelance.Requirement.md#nfr-007).

<a id="dependencies-and-sequencing"></a>
## Dependencies and Suggested Sequence

1. Build [STORY-001](#story-001) before [STORY-002](#story-002) and [STORY-003](#story-003), because filtering and detail navigation start from discovery.
2. Build [STORY-003](#story-003) before [STORY-004](#story-004), because the start-project flow begins from a portfolio detail page.
3. Build [STORY-005](#story-005) before the other Freelancer stories, because management actions require an owner context.
4. Build [STORY-006](#story-006) before [STORY-007](#story-007) and [STORY-008](#story-008), because drafts, previews, and publishing operate on created work.
5. Build [STORY-008](#story-008) before the full public integration of [STORY-001](#story-001) and [STORY-003](#story-003), because public screens consume published work.
6. Build [STORY-009](#story-009) after the create and publish lifecycle is represented.
7. Build [STORY-010](#story-010) before [STORY-011](#story-011) and [STORY-012](#story-012), because job discovery and project starts consume posted jobs.
8. Build [STORY-013](#story-013) after the job publish lifecycle is represented, mirroring the portfolio management sequence.
9. Build [STORY-014](#story-014) with [STORY-004](#story-004)/[STORY-012](#story-012), because the CTA stories are its entry points.
10. Build [STORY-016](#story-016) after [STORY-014](#story-014), because dashboards and timelines consume created projects.
11. Build [STORY-015](#story-015) and [STORY-017](#story-017) before [STORY-018](#story-018), because funding and release gate on the active/delivered/approved states.
12. Build [STORY-019](#story-019) once the enquiry and active states exist, since cancellation targets them.

These dependencies describe a practical implementation sequence; each story remains independently testable with mock data during frontend-first development.

<a id="story-readiness"></a>
## Readiness

The stories are detailed enough for frontend screen design, component planning, and backlog estimation. The escrow states in [STORY-018](#story-018) are simulated by design; real payment behavior, dispute handling, and internal chat remain future scope subject to the unresolved decisions in [Open Decisions](Freelance.Requirement.md#open-decisions).
