-- EyKorBan — project engagement lifecycle
--
-- Implements STORY-014 … STORY-019 (FR-020 … FR-027): the on-platform object
-- both actors revolve around, with an activity timeline, deliverables, and
-- escrow-simulated payment states.
--
-- SIMULATION: no money moves. payment_status and the fee columns exist so the
-- interface can present a trustworthy middleman model; there is no processor
-- behind them.

-- ─── Enums ─────────────────────────────────────────────────────────────────

-- enquiry → active → delivered → completed, with two terminal exits.
create type public.project_status as enum (
  'enquiry', 'active', 'delivered', 'completed', 'cancelled', 'declined'
);

create type public.payment_status as enum (
  'unfunded', 'held', 'released', 'returned'
);

create type public.project_event_type as enum (
  'created', 'accepted', 'declined', 'funded', 'delivered',
  'revision_requested', 'approved', 'released', 'completed', 'cancelled'
);

-- ─── Projects ──────────────────────────────────────────────────────────────

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles (id) on delete cascade,
  freelancer_id  uuid not null references public.profiles (id) on delete cascade,

  title          text not null,
  scope          text not null,
  budget         numeric(12, 2) not null,
  currency       text not null default 'USD',
  deadline       date,

  status         public.project_status not null default 'enquiry',
  payment_status public.payment_status not null default 'unfunded',

  -- FR-020: every project is linked to the CTA context it came from. Exactly
  -- one of these is set; free-floating creation is out of scope for the MVP.
  source_portfolio_item_id uuid references public.portfolio_items (id) on delete set null,
  source_job_id            uuid references public.jobs (id) on delete set null,

  -- NFR-008: the 10% fee is computed by the database, so the figure the client
  -- is shown cannot drift from the figure that was agreed.
  platform_fee numeric(12, 2)
    generated always as (round(budget * 0.10, 2)) stored,
  client_total numeric(12, 2)
    generated always as (budget + round(budget * 0.10, 2)) stored,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- FR-022: the dashboard orders by this.
  last_activity_at timestamptz not null default now(),

  constraint projects_title_not_blank check (length(btrim(title)) > 0),
  constraint projects_scope_not_blank check (length(btrim(scope)) > 0),
  constraint projects_budget_non_negative check (budget >= 0),
  constraint projects_parties_differ check (client_id <> freelancer_id),
  -- FR-020 AC-1: reachable only from a portfolio item or a job.
  constraint projects_has_one_source check (
    (source_portfolio_item_id is not null)::int
    + (source_job_id is not null)::int = 1
  )
);

create index projects_client_idx on public.projects (client_id, last_activity_at desc);
create index projects_freelancer_idx on public.projects (freelancer_id, last_activity_at desc);

-- ─── Deliverables ──────────────────────────────────────────────────────────

create table public.deliverables (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  submitted_by uuid not null references public.profiles (id) on delete cascade,
  note         text not null,
  -- Image-only MVP, same rule as portfolio work.
  images       text[] not null default '{}',
  created_at   timestamptz not null default now(),

  constraint deliverables_note_not_blank check (length(btrim(note)) > 0)
);

create index deliverables_project_idx on public.deliverables (project_id, created_at desc);

-- ─── Timeline ──────────────────────────────────────────────────────────────

create table public.project_events (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  actor_id   uuid references public.profiles (id) on delete set null,
  type       public.project_event_type not null,
  note       text,
  created_at timestamptz not null default now()
);

-- FR-023 AC-2: chronological with stable ordering when timestamps tie.
create index project_events_timeline_idx
  on public.project_events (project_id, created_at, id);

-- ─── Lifecycle enforcement ─────────────────────────────────────────────────

/*
  State transitions are validated here rather than in the client.

  RLS answers "may this person touch this row?"; it cannot answer "is this a
  legal move, made by the right party?". A client must not accept their own
  enquiry, and a completed project must not reopen. Putting that in a trigger
  means a forged request fails at the database, matching how ownership is
  handled everywhere else in this schema.
*/
create or replace function public.enforce_project_transition()
returns trigger
language plpgsql
as $$
declare
  actor uuid := auth.uid();
begin
  new.updated_at := now();

  if new.status is distinct from old.status then
    new.last_activity_at := now();

    -- Terminal states are terminal.
    if old.status in ('completed', 'cancelled', 'declined') then
      raise exception 'Project is already % and cannot change.', old.status
        using errcode = 'check_violation';
    end if;

    case
      -- FR-021: only the addressed freelancer responds to an enquiry.
      when old.status = 'enquiry' and new.status in ('active', 'declined') then
        if actor is not null and actor <> old.freelancer_id then
          raise exception 'Only the freelancer can respond to this enquiry.'
            using errcode = 'check_violation';
        end if;

      -- FR-024: only the freelancer delivers, and only from active.
      when old.status = 'active' and new.status = 'delivered' then
        if actor is not null and actor <> old.freelancer_id then
          raise exception 'Only the freelancer can submit a deliverable.'
            using errcode = 'check_violation';
        end if;

      -- FR-025: the client approves or sends it back for revision.
      when old.status = 'delivered' and new.status in ('completed', 'active') then
        if actor is not null and actor <> old.client_id then
          raise exception 'Only the client can approve or request a revision.'
            using errcode = 'check_violation';
        end if;

      -- FR-027: either actor may cancel before completion.
      when new.status = 'cancelled' and old.status in ('enquiry', 'active', 'delivered') then
        null;

      else
        raise exception 'Cannot move a project from % to %.', old.status, new.status
          using errcode = 'check_violation';
    end case;
  end if;

  -- FR-026 AC-3: approval releases the held funds. FR-027 AC-4: cancelling a
  -- funded project returns them. Derived here so the two can never disagree.
  if new.status = 'completed' and old.payment_status = 'held' then
    new.payment_status := 'released';
  elsif new.status = 'cancelled' and old.payment_status = 'held' then
    new.payment_status := 'returned';
  end if;

  return new;
end;
$$;

create trigger projects_enforce_transition
  before update on public.projects
  for each row execute function public.enforce_project_transition();

create trigger projects_set_updated_at_on_insert
  before insert on public.projects
  for each row execute function public.set_updated_at();

-- Any deliverable counts as activity, so the dashboard reorders.
create or replace function public.touch_project_activity()
returns trigger
language plpgsql
as $$
begin
  update public.projects
  set last_activity_at = now()
  where id = new.project_id;
  return new;
end;
$$;

create trigger deliverables_touch_project
  after insert on public.deliverables
  for each row execute function public.touch_project_activity();

create trigger project_events_touch_project
  after insert on public.project_events
  for each row execute function public.touch_project_activity();

-- ─── Row Level Security ────────────────────────────────────────────────────
--
-- FR-022 AC-1 / FR-023 AC-4: a project is visible only to its two actors. This
-- is the whole privacy model — not a filter in a React component.

alter table public.projects       enable row level security;
alter table public.deliverables   enable row level security;
alter table public.project_events enable row level security;

create policy "projects are visible to their two actors"
  on public.projects for select to authenticated
  using (auth.uid() = client_id or auth.uid() = freelancer_id);

-- FR-006 / FR-019: the client starts the project from a CTA.
create policy "clients create their own projects"
  on public.projects for insert to authenticated
  with check (auth.uid() = client_id);

-- Either actor may write; which writes are legal is the trigger's job.
create policy "involved actors update their projects"
  on public.projects for update to authenticated
  using (auth.uid() = client_id or auth.uid() = freelancer_id)
  with check (auth.uid() = client_id or auth.uid() = freelancer_id);

create policy "deliverables are visible to the project's actors"
  on public.deliverables for select to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (auth.uid() = p.client_id or auth.uid() = p.freelancer_id)
    )
  );

create policy "the freelancer submits deliverables"
  on public.deliverables for insert to authenticated
  with check (
    auth.uid() = submitted_by
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.freelancer_id = auth.uid()
    )
  );

create policy "timeline is visible to the project's actors"
  on public.project_events for select to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (auth.uid() = p.client_id or auth.uid() = p.freelancer_id)
    )
  );

create policy "involved actors append to the timeline"
  on public.project_events for insert to authenticated
  with check (
    auth.uid() = actor_id
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and (auth.uid() = p.client_id or auth.uid() = p.freelancer_id)
    )
  );
