# Jes tae tver tv — Stitch Prompts (one per screen)

How to use:

- Generate screens in **one Stitch project** so the theme carries over. Paste **00 — Design System first**, then exactly one prompt per screen, in the order below.
- If Stitch drifts from the style, re-paste the "Shared style" line at the end of the prompt.
- Source of truth: [Freelance.Requirement.md](Freelance.Requirement.md) (screen inventory), [Freelance.Page.Project.md](Freelance.Page.Project.md), [Freelance.Page.JobPosting.md](Freelance.Page.JobPosting.md), [Freelance.Page.Discovery.md](Freelance.Page.Discovery.md), and the implemented theme tokens in `src/index.css`.

Shared style line (append to any prompt if needed):

> Style: modern freelance marketplace, image-forward, Dribbble-inspired but original branding; Inter Variable typeface; rounded corners (medium radius ~10px); clean neutral surfaces with a crimson-red primary accent; light theme; generous whitespace; card-based layout; desktop-first, responsive to mobile.

---

<a id="00"></a>
## 00 — Design System (paste this first)

> Design system for a freelance marketplace product called "Jes tae tver tv". Typography: Inter Variable as the only typeface for headings and body; type scale of 12px captions, 14px body, 16px emphasized body, 20px section headings, 28px page headings, 36px hero headings; medium (500) weight for buttons and labels, semibold (600) for headings, regular (400) for body. Color palette, light theme: near-white #FFFFFF background; near-black #1F1F1F foreground; white card surfaces with soft light-gray #EDEDED borders; muted surface #F7F7F7 with muted-foreground #8E8E8E for secondary text; a single strong crimson-red primary #C42B2F used for primary buttons, active navigation links, and key accents, with very light pink #FDEDED as its text-on-color and tinted-background variant; a red destructive color for errors and delete actions. Dark theme variant: near-black #252525 background, #FAFAFA foreground, #333333 card surfaces, white-at-10% borders, same crimson primary slightly brightened. Radius scale based on a 10px base: 6px chips and small elements, 10px inputs and buttons, 14px cards, 22px dialogs and large containers. Shadows soft and minimal — 1px borders do most of the separation. Components: pill-shaped filter chips with primary-tint active state and removable "x"; status badges as small rounded chips (gray for Enquiry/Draft/Closed, blue Active, amber Delivered, green Published/Completed/Open, red Cancelled); buttons in primary (crimson, white text), secondary (muted gray), outline, and destructive variants; text inputs and selects with light borders, 10px radius, and red border plus inline error text on validation failure; cards with 1px border and no heavy elevation; centered dialogs with dim overlay; empty states with a simple illustration placeholder, one-line message, and a primary action; loading represented by shimmer skeleton rows and image blocks. Spacing rhythm on a 4px base with generous section padding (32–48px) and consistent 16–24px card padding, 16px gutters on mobile. General feel: image-forward, modern, trustworthy middleman-brand; Dribbble-inspired layout patterns with an original identity; desktop-first, responsive down to mobile.

---

<a id="01"></a>
## 01 — Public Discovery / Home

> A public discovery home page for a freelance marketplace called "Jes tae tver tv", where clients browse freelancers through image-led portfolio work. Top navigation bar with brand logo on the left, links "Discover", "Jobs", and a "Freelancer portal" button on the right. Below it a compact hero section with a short headline and a search hint. The main content is a responsive grid of portfolio cards, each with a large cover image (4:3, dominant), project title, freelancer name, and small badge chips for work category and industry. Add a horizontal filter bar above the grid with category and industry dropdown chips, active filter chips with remove "x" icons, and a "Reset all" text button. Include a friendly empty-state block for when filters match nothing. Style: modern freelance marketplace, image-forward, Dribbble-inspired but original; Inter Variable; rounded corners; neutral surfaces with one vibrant primary accent; light theme; desktop-first responsive.

<a id="02"></a>
## 02 — Portfolio Detail

> A portfolio item detail page for a freelance marketplace. Top navigation bar with brand, "Discover", "Jobs", and "Freelancer portal" button. Main area in two columns: left column dominated by a large cover image with an image gallery of thumbnails below; right column with the project title, freelancer name with avatar, work category and industry chips, and a written project description. Below the right column, a prominent primary button "Start a project" as the main call to action. At the bottom, a "Related work" section with a row of three smaller portfolio cards using the same card style as discovery (cover image, title, freelancer, category and industry chips). Style: image-forward, Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="03"></a>
## 03 — Job Discovery

> A public job discovery page for a freelance marketplace where freelancers browse open jobs posted by clients. Same top navigation bar as the rest of the app. A horizontal filter bar with category and industry dropdown chips, active filter chips with remove icons, and a "Reset all" button. Below it a vertical list of job cards, each showing the job title, a two-line description snippet, work category and industry chips, and the publication date on the right. Cards ordered newest first. Include a helpful empty state with an illustration placeholder and text "No open jobs match your filters". Style: consistent with the discovery page — Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme, desktop-first responsive.

<a id="04"></a>
## 04 — Job Detail

> A job post detail page for a freelance marketplace. Top navigation bar consistent with the app. Main content in a single centered column with a card: job title, publication date, work category and industry chips, then a full job description. A secondary panel shows a "Looking for" summary with category and industry. The primary action is a button "Respond — start a project" at the bottom of the card. Add a subtle "Closed" state badge variant shown near the title, and show the disabled CTA in that closed state. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="05"></a>
## 05 — Sign In

> A minimal sign-in page for a freelance marketplace, shown when an unauthenticated visitor taps a "Start a project" or "Respond" call to action. Centered card on a soft neutral background: brand logo, heading "Sign in to continue", a short helper line "Your project stays tracked on the platform", an email input, a password input, and a full-width primary button "Sign in". Below, a secondary link "Browse without an account" that returns to discovery. Keep it simple, no social login buttons. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="06"></a>
## 06 — Start Project (from portfolio or job)

> A "Start a project" creation page for a freelance marketplace, reached from a portfolio item or job post. Top navigation bar consistent with the app. Layout: a single-column form card, max width ~640px. At the top, a read-only context card showing the linked portfolio item thumbnail or job title with its owner's name and a small chip "From portfolio" or "From job". The form has: "Project title" text input, "Scope" textarea with a character counter, "Budget (USD)" number input, and an optional "Deadline" date picker. Below the budget, a live cost breakdown box with three rows: "Budget $100", "Platform fee (10%) $10", "Total you pay $110", with the fee row in a lighter tone. Primary button "Start project" and a "Cancel" link at the bottom. Mark required fields with an asterisk and show inline field-level validation errors in red under inputs. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="07"></a>
## 07 — Project Dashboard

> A project dashboard page for a freelance marketplace showing the signed-in user's projects. Top navigation bar with a "Projects" link active. Page heading "My projects". A list (on desktop, a table-like list; on mobile, cards) of project rows, each showing: project title, counterpart name with small avatar, budget amount, a colored status badge (Enquiry in gray, Active in blue, Delivered in amber, Completed in green, Cancelled in red), and "last activity" relative time on the right. Rows are clickable. Include a loading skeleton state with shimmer rows, and an empty state with the text "No projects yet" and a primary button "Discover work". Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme, desktop-first responsive.

<a id="08"></a>
## 08 — Project Detail (timeline + actions)

> A project detail page for a freelance marketplace — the shared workspace for one client and one freelancer. Top navigation bar with "Projects" active. Header area: project title, status badge, optional deadline, and a row showing "Client ↔ Freelancer" with two small avatars, plus a small card linking back to the source portfolio item or job. Below it a cost breakdown card with rows "Budget $100", "Platform fee (10%) $10", "Total $110", and a state-dependent element: a primary "Fund project" button, or a badge "Funds held by platform" with a lock icon, or a green "Released" receipt state. Then a role-gated action bar: for the freelancer "Accept enquiry" / "Decline" buttons in enquiry state, "Submit deliverable" in active state; for the client "Approve" and "Request revision" in delivered state, and a subtle "Cancel project" text button. The lower two-thirds of the page is an activity timeline with a vertical line and dots, entries like "Project created", "Enquiry accepted", "Funds held", "Deliverable submitted", "Revision requested", "Payment released", "Project cancelled" — each with actor name, note text, and timestamp. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="09"></a>
## 09 — Submit Deliverable (dialog)

> A modal dialog on the project detail page of a freelance marketplace, opened by the freelancer's "Submit deliverable" action. Centered dialog card with title "Submit deliverable", a "Note for the client" textarea, an image upload dropzone accepting images only with thumbnail previews, and a character counter. Footer buttons: primary "Submit deliverable" and secondary "Cancel". Show one attached image as a small rounded thumbnail with an "x" remove icon. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="10"></a>
## 10 — Fund Confirmation + Receipt (dialog states)

> Two modal dialog states for the payment simulation on a project detail page of a freelance marketplace. State A "Confirm funding": title "Fund this project?", a cost breakdown with rows "Budget $100", "Platform fee (10%) $10", "Total you pay $110", a helper line "Funds are held by the platform and released only when you approve the work", and buttons "Confirm funding" (primary) and "Cancel". State B "Receipt": title "Payment released", a green check icon, the same three-row breakdown, a divider, a "Freelancer receives $100" row, a helper line "Simulation — no real money moves yet", and a single "Done" button. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="11"></a>
## 11 — Create / Edit Job Post

> A job post creation page for clients on a freelance marketplace. Top navigation bar consistent with the app. Single-column form card, max width ~640px, heading "Post a job". Fields: "Job title" input, "Description" textarea with remaining-character counter, "Work category" select, "Industry" select, and "Reply email" input with helper text "Never shown publicly — used only to deliver freelancer responses". Required fields marked with asterisks. Primary button "Publish" and "Cancel" link. Show an invalid-submit state with red field-level error messages under three fields and the input borders turning red. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="12"></a>
## 12 — Job Management List

> A client's job management list page for a freelance marketplace. Top navigation bar with "Jobs" active. Page heading "My job posts" and a primary button "New job". A list/table of the client's own job posts with columns: title, category, industry, status badge (Open in green, Closed in gray), published date, and row actions as icon buttons "Edit", "Close/Reopen", "Delete". Include a confirm-delete dialog variant with the job title, text "This will permanently remove this job post", and buttons "Delete" (destructive red) and "Cancel". Include an empty state "No job posts yet" with a "Post a job" primary button. Style: Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme, desktop-first responsive.

<a id="13"></a>
## 13 — Freelancer Portal (portfolio management)

> A freelancer portal dashboard for a freelance marketplace where the freelancer manages their published portfolio work. Top navigation bar with "Portal" active. Page heading "My work" and a primary button "Create new work". A grid of the freelancer's own portfolio cards in the same image-forward card style as public discovery (cover image, title, category and industry chips), each card showing a small status badge (Draft in gray, Published in green, Unpublished in amber) and hover actions "Edit", "Unpublish", "Delete". Include one card in draft state and one in published state. Include an empty state with "No work yet" and a "Create new work" button. Style: image-forward, Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="14"></a>
## 14 — Create / Edit Portfolio Work

> A portfolio work creation page for freelancers on a freelance marketplace. Single-column form, max width ~640px, heading "Create new work". Fields: "Title" input, "Description" textarea, "Work category" select, "Industry" select, a "Cover image" upload dropzone with one large preview thumbnail marked with a "Cover" tag, and an "Additional images" dropzone supporting multiple thumbnails with "x" remove icons. Images only — no video option. Required fields marked with asterisks; show a validation-error state with red field-level messages. Primary button "Publish" and secondary "Save draft" plus "Cancel" link. Style: image-forward, Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.

<a id="15"></a>
## 15 — Portfolio Preview

> A portfolio preview screen for freelancers on a freelance marketplace, showing how a portfolio item will appear publicly before publishing. It visually mirrors the portfolio detail page: large cover image with gallery thumbnails, title, freelancer identity, category and industry chips, and description — but wrapped in a preview frame: a top banner strip reading "Preview — not published yet" in amber with a "Back to editing" button, and the public "Start a project" CTA shown disabled/grayed out. Style: image-forward, Inter Variable, rounded corners, neutral surfaces, one vibrant primary accent, light theme.
