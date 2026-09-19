# Jes tae tver tv — Discovery / Home Page Specification

<a id="document-status"></a>
## Document Status

- **Status:** Draft for approval
- **Scope:** Frontend-first MVP, page-level screen specification
- **Covers:** Public discovery/home page (default and filtered states)
- **Upstream sources:** [Freelance.Requirement.md](Freelance.Requirement.md), [Freelance.UserStories.md](Freelance.UserStories.md)

<a id="traceability"></a>
## Traceability

| Concern | Traces To |
| :--- | :--- |
| Browse published work | [FR-001](Freelance.Requirement.md#fr-001), [STORY-001](Freelance.UserStories.md#story-001) |
| Recent-work ordering | [FR-002](Freelance.Requirement.md#fr-002), [STORY-001](Freelance.UserStories.md#story-001) |
| Category & industry filters | [FR-003](Freelance.Requirement.md#fr-003), [STORY-002](Freelance.UserStories.md#story-002) |
| Navigation, complete states, visual system | [FR-013](Freelance.Requirement.md#fr-013), [FR-014](Freelance.Requirement.md#fr-014), [FR-015](Freelance.Requirement.md#fr-015) |
| Responsive, accessible, image stability, theme legibility | [NFR-001](Freelance.Requirement.md#nfr-001), [NFR-002](Freelance.Requirement.md#nfr-002), [NFR-006](Freelance.Requirement.md#nfr-006), [NFR-007](Freelance.Requirement.md#nfr-007) |

<a id="page-summary"></a>
## Page Summary

| Property | Value |
| :--- | :--- |
| Route | `/` (public, no authentication) |
| Purpose | Image-led discovery of recently published freelance portfolio work |
| Actors | Client (public visitor) |
| Entry points | Direct URL, header brand link, links shared from detail pages |
| Exit points | Portfolio detail page (card selection), Freelancer portal (header CTA) |

The page presents published work as a responsive, image-forward grid ordered newest-first, with category and industry filters that can be applied independently or together.

<a id="layout-regions"></a>
## Layout Regions

```
┌──────────────────────────────────────────────────────┐
│ Header: brand | Discover (active) | Freelancer portal CTA │
├──────────────────────────────────────────────────────┤
│ Page heading: "Discover work" + result count          │
├──────────────────────────────────────────────────────┤
│ Filter bar: Category select | Industry select |       │
│             Active-filter chips | Reset all           │
├──────────────────────────────────────────────────────┤
│ Work grid (responsive card grid)                      │
│  [card] [card] [card]                                 │
│  [card] [card] [card]                                 │
├──────────────────────────────────────────────────────┤
│ Footer: minimal product footer                        │
└──────────────────────────────────────────────────────┘
```

| Region | Contents | Behavior |
| :--- | :--- | :--- |
| Header | Brand, "Discover" nav link (active), "Freelancer portal" button | Portal CTA navigates to the freelancer portal entry; portal entry screen handles unauthenticated state per [FR-007](Freelance.Requirement.md#fr-007) |
| Page heading | Title and live result count ("128 works") | Count updates with active filters; announced via `aria-live="polite"` |
| Filter bar | Two select controls (Category, Industry), removable filter chips, "Reset all" | See [Filter Behavior](#filter-behavior) |
| Work grid | Portfolio cards, newest first | See [Portfolio Card](#portfolio-card) |
| Footer | Static product footer | No dynamic content |

<a id="portfolio-card"></a>
## Portfolio Card

A portfolio card is the primary interactive element of the grid. The whole card is one link target to the detail page.

| Element | Requirement | Notes |
| :--- | :--- | :--- |
| Cover image | Dominant element, fixed aspect ratio (e.g. 4:3), space reserved before load | [NFR-006](Freelance.Requirement.md#nfr-006): no layout shift while loading |
| Project title | Single line, truncates with ellipsis | Part of the accessible link name |
| Freelancer | Display name below the title | No email address rendered ([NFR-003](Freelance.Requirement.md#nfr-003)) |
| Work category | Badge | Semantic secondary token |
| Industry | Badge | Semantic secondary token |
| Hover/focus state | Subtle elevation + focus ring on the card link | Keyboard-visible focus ([NFR-002](Freelance.Requirement.md#nfr-002)) |

Card accessibility: the card link's programmatic name follows the pattern
`"{Project title} by {Freelancer}, {Category}, {Industry}"`. The cover image carries meaningful alternative text supplied by the freelancer (title fallback only if the freelancer did not provide one).

<a id="filter-behavior"></a>
## Filter Behavior

- **Category and Industry** are single-select dropdowns that can be combined ([FR-003 AC-1](Freelance.Requirement.md#fr-003)).
- Selecting a value updates the grid (and URL query, e.g. `/?category=branding&industry=healthcare`) without a full page reload.
- Each active filter renders as a **chip** with a remove (`×`) control, operable by keyboard ([STORY-002 AC-3/4](Freelance.UserStories.md#story-002)).
- **Reset all** clears both filters in one action and restores the default recent view ([STORY-002 AC-5](Freelance.UserStories.md#story-002)).
- The filters operate on published work only.
- Deep links with filter query parameters restore the filtered state on load.

<a id="ordering"></a>
## Ordering

1. Default and filtered views order by publication time, newest first ([FR-002](Freelance.Requirement.md#fr-002)).
2. Equal publication times use a stable secondary key (e.g. id) so refreshes do not visibly reorder items ([FR-002 AC-2](Freelance.Requirement.md#fr-002)).
3. Drafts and unpublished work never render on this page ([FR-001 AC-3](Freelance.Requirement.md#fr-001)).

<a id="page-states"></a>
## Page States

Every state below is required by [FR-014](Freelance.Requirement.md#fr-014).

| State | Trigger | Presentation |
| :--- | :--- | :--- |
| Loading | First load or filter change in flight | Skeleton cards matching the final card layout (same aspect ratio, no shift) in place of grid content; filter bar remains interactive or shows a subtle pending indicator |
| Success — default | Published work exists, no filters | Heading shows "Discover work" + total count; full grid |
| Success — filtered | Published work matches active filters | Active-filter chips visible; grid shows only matches; count reflects filtered total |
| Empty — no published work | Catalog has no published work at all | Friendly empty state: illustration/icon, "No work published yet" message, "Check back soon" subtext; no filter controls disabled state confusion — filter bar remains but grid area shows the message |
| Empty — no filter matches | No published work matches the active filters ([FR-003 AC-5](Freelance.Requirement.md#fr-003)) | Message: "No work matches your filters" + **Reset all filters** button as the recovery action |
| Failure | Request for work or filter data fails | Inline error panel with retry button; previously loaded grid content is retained if a filter change fails; retry re-issues the last request |
| Throttled / degraded | Backend rate limiting (future) | Non-blocking notice; grid content unchanged |

<a id="responsive-behavior"></a>
## Responsive Behavior

| Viewport class | Grid columns | Notes |
| :--- | :--- | :--- |
| Mobile (< 640px) | 1–2 columns | Filter bar collapses into a "Filters" disclosure; active chips render above the grid |
| Tablet (640–1024px) | 2–3 columns | Filter bar inline |
| Desktop (> 1024px) | 3–4 columns | Full filter bar inline; comfortable gutters |

No horizontal page overflow at any class ([NFR-001](Freelance.Requirement.md#nfr-001)). Images preserve aspect ratio at all widths ([NFR-006](Freelance.Requirement.md#nfr-006)).

<a id="visual-system"></a>
## Visual System

Per [FR-015](Freelance.Requirement.md#fr-015) and [NFR-007](Freelance.Requirement.md#nfr-007):

- **Typeface:** Inter Variable as the primary interface typeface.
- **Primary actions** (Freelancer portal CTA, Reset all in empty state): supplied primary color tokens.
- **Radius:** supplied radius scale on cards, chips, selects, and buttons.
- **Dark mode:** all semantic tokens (surface, card, border, muted, primary) switch via theme tokens; card image overlays and badge text remain legible in both themes.
- **Imagery emphasis:** cover images dominate card area; metadata stays visually subordinate.

<a id="accessibility"></a>
## Accessibility

Per [NFR-002](Freelance.Requirement.md#nfr-002):

- Filter selects have programmatic labels ("Filter by category", "Filter by industry").
- Filter chips are buttons with accessible names like `Remove category filter: Branding`.
- Result count region is `aria-live="polite"` so filter changes are announced.
- Card grid is a list of links; whole-card link with meaningful name (see [Portfolio Card](#portfolio-card)).
- Full keyboard path: Tab reaches header → filters → chips → cards; Enter/Space activates; visible focus ring on every control.
- Loading skeletons are `aria-hidden` with an `aria-busy` grid container and a polite "Loading work" announcement.
- Empty/failure states are announced once when rendered.

<a id="data-needs"></a>
## Data Needs (frontend-first, mock data)

| Need | Shape | Notes |
| :--- | :--- | :--- |
| Work list item | `{ id, title, coverImageUrl, coverImageAlt, freelancerName, category, industry, publishedAt }` | Only published items are delivered to this page |
| Category options | `{ id, name }` list | Static or fetched; failure falls back to text input disabled state with error |
| Industry options | `{ id, name }` list | Same as categories |
| Ordering input | Sorted by `publishedAt` desc, then `id` asc | Stable secondary ordering ([FR-002 AC-2](Freelance.Requirement.md#fr-002)) |

Mock data must include: items spanning multiple categories and industries, an item pair with identical `publishedAt` (to verify stable ordering), and enough items to exercise all grid column counts.

<a id="open-points"></a>
## Open Points

Inherited from [Open Decisions](Freelance.Requirement.md#open-decisions); they do not block this page's frontend build:

1. Pagination vs progressive loading for large catalogs (page currently assumes an initial batch with a future "load more" affordance point below the grid).
2. Exact image dimensions and aspect-ratio enforcement strategy.
3. Whether category/industry option lists are hard-coded frontend constants or fetched.

<a id="verification"></a>
## Verification Checklist

- [ ] Page opens without authentication ([STORY-001 AC-1](Freelance.UserStories.md#story-001)).
- [ ] Cards show cover image, title, freelancer, category, industry ([STORY-001 AC-3](Freelance.UserStories.md#story-001)).
- [ ] Newest-first ordering with stable tie-break ([STORY-001 AC-4](Freelance.UserStories.md#story-001)).
- [ ] No draft/unpublished item ever renders ([STORY-001 AC-5](Freelance.UserStories.md#story-001)).
- [ ] Loading, empty, and failure states present without layout shift ([STORY-001 AC-6](Freelance.UserStories.md#story-001)).
- [ ] Category + industry combine; single filter removable; reset-all works ([STORY-002 AC-1..5](Freelance.UserStories.md#story-002)).
- [ ] Filter-mismatch empty state with recovery action ([STORY-002 AC-6](Freelance.UserStories.md#story-002)).
- [ ] Keyboard-only pass and visible focus at all breakpoints ([NFR-002](Freelance.Requirement.md#nfr-002)).
- [ ] Light and dark theme visual pass ([NFR-007](Freelance.Requirement.md#nfr-007)).
- [ ] No freelancer email in rendered content or payloads ([NFR-003](Freelance.Requirement.md#nfr-003)).
