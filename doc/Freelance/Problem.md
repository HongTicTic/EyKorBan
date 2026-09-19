- Client client contact freelancer through cta -> get gain contact they stop using our app

# Solution
- Client and free lancer needs to revolve around a project to keep both of them in touch with our platforms
- We will become the middle man who hold the money to ensure trust
-

# Future scope
- Add payment
- Chat

---

## Resolution (2026-09-19)

Recorded as decision [S5](Freelance.Requirement.md#s5) and implemented across the specs:

- **Project as the anchor.** Contact/respond CTAs ([FR-006](Freelance.Requirement.md#fr-006), [FR-019](Freelance.Requirement.md#fr-019)) no longer deliver an email enquiry; they create an on-platform **project** (title, scope, budget, optional deadline) with a lifecycle of `Enquiry → Active → Delivered → Completed / Cancelled` ([Section 4](Freelance.Requirement.md#project-requirements)).
- **Middleman money model, simulated.** Escrow is presented as interface states only — fund → funds held → release on approval ([FR-026](Freelance.Requirement.md#fr-026)). No real payment processing in the MVP.
- **Fee: flat 10%, paid by the client** on top of the budget (budget $100 → fee $10 → total $110), itemized in the cost breakdown before funding and in the completed receipt ([NFR-008](Freelance.Requirement.md#nfr-008)).
- **Phasing:** Phase 1 project entity + dashboards/timeline → Phase 2 in-app chat → Phase 3 real payments/escrow (provider, dispute policy, and custody decisions tracked in [Open Decisions](Freelance.Requirement.md#open-decisions) items 12–15).

Spec impact: new [Section 4 requirements](Freelance.Requirement.md#project-requirements) (FR-020–FR-027), [project user stories](Freelance.UserStories.md#project-user-stories) (STORY-014–019), and the [project pages spec](Freelance.Page.Project.md).
