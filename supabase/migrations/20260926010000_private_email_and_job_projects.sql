-- Two fixes, both found while wiring job detail pages (STORY-012).

/* ───────────────────────────────────────────────────────────────────────────
   1. Every user's email was readable by anyone (NFR-003, STORY-012 AC-6).

   public.profiles has a `using (true)` select policy so that bylines and the
   creative directory work without an account. But RLS filters rows, not
   columns — so that policy also published the email column. Any anonymous
   request to /rest/v1/profiles?select=email returned every address, and the
   Find Work page was shipping client emails in its own network payload.

   That is the disintermediation leak S5 was written to prevent: scrape the
   address, take the work off-platform.

   Column privileges fix it at the source. A signed-in user reads their own
   email from their auth session, which is the canonical copy anyway.
   ─────────────────────────────────────────────────────────────────────────── */

revoke select on public.profiles from anon, authenticated;

grant select (
  id, name, username, role, avatar_url, status, created_at, updated_at
) on public.profiles to anon, authenticated;

-- last_login_at is left ungranted too: when someone last signed in is
-- personal activity, and nothing in the interface displays it.

/* ───────────────────────────────────────────────────────────────────────────
   2. STORY-012: a freelancer starts a project from an open job.

   The original insert policy allowed only `auth.uid() = client_id`, so the
   job path was blocked. It was also looser than it looked: a client could name
   any freelancer and cite any portfolio item. The replacement binds the
   counterpart to the source, so neither side can address a project to someone
   the source does not actually belong to.
   ─────────────────────────────────────────────────────────────────────────── */

drop policy if exists "clients create their own projects" on public.projects;

create policy "projects start from a real source, addressed to its owner"
  on public.projects for insert to authenticated
  with check (
    -- STORY-004: a client, from a published portfolio item, to its author.
    (
      auth.uid() = client_id
      and source_portfolio_item_id is not null
      and exists (
        select 1 from public.portfolio_items w
        where w.id = source_portfolio_item_id
          and w.freelancer_id = projects.freelancer_id
          and w.status = 'published'
      )
    )
    or
    -- STORY-012: a freelancer, from an open job, to the client who posted it.
    (
      auth.uid() = freelancer_id
      and source_job_id is not null
      and exists (
        select 1 from public.jobs j
        where j.id = source_job_id
          and j.client_id = projects.client_id
          and j.status = 'open'
      )
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'FREELANCER'
      )
    )
  );

/* ───────────────────────────────────────────────────────────────────────────
   3. Who answers an enquiry depends on who sent it.

   FR-021 was written for the portfolio path, where the client asks and the
   freelancer answers. On the job path the freelancer asks, so the client must
   be the one to accept — otherwise a freelancer could accept their own pitch.
   The initiator is derivable from the source, so no new column is needed.
   ─────────────────────────────────────────────────────────────────────────── */

create or replace function public.enforce_project_transition()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  actor uuid := auth.uid();
  -- The party who did not start the project is the one who responds.
  responder uuid := case
    when old.source_job_id is not null then old.client_id
    else old.freelancer_id
  end;
begin
  new.updated_at := now();

  if new.status is distinct from old.status then
    new.last_activity_at := now();

    if old.status in ('completed', 'cancelled', 'declined') then
      raise exception 'Project is already % and cannot change.', old.status
        using errcode = 'check_violation';
    end if;

    case
      when old.status = 'enquiry' and new.status in ('active', 'declined') then
        if actor is not null and actor <> responder then
          raise exception 'Only the % can respond to this enquiry.',
            case when responder = old.client_id then 'client' else 'freelancer' end
            using errcode = 'check_violation';
        end if;

      when old.status = 'active' and new.status = 'delivered' then
        if actor is not null and actor <> old.freelancer_id then
          raise exception 'Only the freelancer can submit a deliverable.'
            using errcode = 'check_violation';
        end if;

      when old.status = 'delivered' and new.status in ('completed', 'active') then
        if actor is not null and actor <> old.client_id then
          raise exception 'Only the client can approve or request a revision.'
            using errcode = 'check_violation';
        end if;

      when new.status = 'cancelled' and old.status in ('enquiry', 'active', 'delivered') then
        null;

      else
        raise exception 'Cannot move a project from % to %.', old.status, new.status
          using errcode = 'check_violation';
    end case;
  end if;

  if new.status = 'completed' and old.payment_status = 'held' then
    new.payment_status := 'released';
  elsif new.status = 'cancelled' and old.payment_status = 'held' then
    new.payment_status := 'returned';
  end if;

  return new;
end;
$$;
