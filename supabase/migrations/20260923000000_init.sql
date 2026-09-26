-- EyKorBan — initial schema
--
-- Scope: the domain the current UI actually renders (profiles, portfolio work,
-- job posts, reference taxonomies). The project-engagement lifecycle from
-- FR-020..FR-027 of doc/Freelance/Freelance.Requirement.md is deliberately NOT
-- modelled here — it has no UI yet. Add it in a later migration.
--
-- Security model: the browser talks to Postgres directly, so Row Level Security
-- is the backend. Ownership rules from NFR-004 are enforced here, not in React.

-- ─── Extensions ────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto" with schema extensions;

-- ─── Enums ─────────────────────────────────────────────────────────────────

create type public.user_role as enum ('CLIENT', 'FREELANCER', 'ADMIN');
create type public.user_status as enum ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
create type public.portfolio_status as enum ('draft', 'published');
create type public.job_status as enum ('open', 'closed');

-- ─── Reference taxonomies ──────────────────────────────────────────────────
-- Text ids (not uuid) so they match the slugs the frontend already ships in
-- src/interface/category.ts and src/components/dropdown.tsx.

create table public.categories (
  id         text primary key,
  name       text not null,
  slug       text not null unique,
  sort_order integer not null default 0
);

create table public.industries (
  id         text primary key,
  name       text not null,
  sort_order integer not null default 0
);

-- ─── Profiles ──────────────────────────────────────────────────────────────
-- One row per auth.users row, created automatically by the trigger below.

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null,
  username      text unique,
  role          public.user_role not null default 'CLIENT',
  email         text not null,
  avatar_url    text,
  status        public.user_status not null default 'ACTIVE',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_login_at timestamptz,

  constraint profiles_username_format
    check (username is null or username ~ '^[a-z0-9_]{3,30}$')
);

create index profiles_role_idx on public.profiles (role);
create index profiles_username_idx on public.profiles (username);

create table public.freelancer_profiles (
  user_id                uuid primary key references public.profiles (id) on delete cascade,
  tagline                text,
  bio                    text,
  skills                 text[] not null default '{}',
  hourly_rate            numeric(10, 2),
  currency               text not null default 'USD',
  public_profile_enabled boolean not null default true,
  website_url            text,
  linkedin_url           text,
  github_url             text,
  updated_at             timestamptz not null default now(),

  constraint freelancer_hourly_rate_non_negative
    check (hourly_rate is null or hourly_rate >= 0)
);

create table public.client_profiles (
  user_id         uuid primary key references public.profiles (id) on delete cascade,
  company_name    text,
  billing_address text,
  notes           text,
  updated_at      timestamptz not null default now()
);

-- ─── Portfolio work ────────────────────────────────────────────────────────
-- What the UI calls a "ProjectCard". Named portfolio_item to keep it distinct
-- from the future project-engagement table.

create table public.portfolio_items (
  id              uuid primary key default gen_random_uuid(),
  freelancer_id   uuid not null references public.profiles (id) on delete cascade,
  title           text not null,
  subtitle        text,
  description     text,
  cover_image_url text,
  images          text[] not null default '{}',
  category_id     text references public.categories (id) on delete set null,
  industry_id     text references public.industries (id) on delete set null,
  status          public.portfolio_status not null default 'draft',
  published_at    timestamptz,
  like_count      integer not null default 0,
  view_count      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint portfolio_title_not_blank check (length(btrim(title)) > 0),
  constraint portfolio_counts_non_negative check (like_count >= 0 and view_count >= 0),
  -- FR-010: a published item must carry a publish timestamp for recent-first ordering.
  constraint portfolio_published_has_timestamp
    check (status <> 'published' or published_at is not null)
);

create index portfolio_items_published_idx
  on public.portfolio_items (published_at desc) where status = 'published';
create index portfolio_items_freelancer_idx on public.portfolio_items (freelancer_id);
create index portfolio_items_category_idx on public.portfolio_items (category_id);
create index portfolio_items_industry_idx on public.portfolio_items (industry_id);

-- ─── Job opportunities ─────────────────────────────────────────────────────

create table public.jobs (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  description  text not null,
  category_id  text references public.categories (id) on delete set null,
  industry_id  text references public.industries (id) on delete set null,
  status       public.job_status not null default 'open',
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint jobs_title_not_blank check (length(btrim(title)) > 0)
);

create index jobs_open_idx on public.jobs (published_at desc) where status = 'open';
create index jobs_client_idx on public.jobs (client_id);
create index jobs_category_idx on public.jobs (category_id);
create index jobs_industry_idx on public.jobs (industry_id);

-- ─── Triggers ──────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger freelancer_profiles_set_updated_at
  before update on public.freelancer_profiles
  for each row execute function public.set_updated_at();

create trigger client_profiles_set_updated_at
  before update on public.client_profiles
  for each row execute function public.set_updated_at();

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- Stamp published_at the first time an item is published (FR-010), and clear it
-- when it goes back to draft (FR-011 unpublish).
create or replace function public.sync_portfolio_published_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  elsif new.status = 'draft' then
    new.published_at = null;
  end if;

  return new;
end;
$$;

create trigger portfolio_items_sync_published_at
  before insert or update on public.portfolio_items
  for each row execute function public.sync_portfolio_published_at();

-- Every new auth user gets a profile row. Reads name/username/role out of the
-- metadata the signup form sends, and falls back to sane defaults.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role public.user_role;
begin
  begin
    meta_role := coalesce(
      (new.raw_user_meta_data ->> 'role')::public.user_role,
      'CLIENT'
    );
  exception when others then
    meta_role := 'CLIENT';
  end;

  insert into public.profiles (id, name, username, role, email, avatar_url)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    nullif(btrim(new.raw_user_meta_data ->> 'username'), ''),
    meta_role,
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), '')
  )
  on conflict (id) do nothing;

  if meta_role = 'FREELANCER' then
    insert into public.freelancer_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.client_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ────────────────────────────────────────────────────

alter table public.categories          enable row level security;
alter table public.industries          enable row level security;
alter table public.profiles            enable row level security;
alter table public.freelancer_profiles enable row level security;
alter table public.client_profiles     enable row level security;
alter table public.portfolio_items     enable row level security;
alter table public.jobs                enable row level security;

-- Taxonomies: read-only reference data for everyone, writable only via the
-- service role (which bypasses RLS entirely).
create policy "categories are readable by everyone"
  on public.categories for select using (true);

create policy "industries are readable by everyone"
  on public.industries for select using (true);

-- Profiles: public directory (Hire Creatives and portfolio author bylines need
-- them without an account). Each user writes only their own row.
create policy "profiles are readable by everyone"
  on public.profiles for select using (true);

create policy "users insert their own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "users update their own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Freelancer profiles: visible when the freelancer opted in, always visible to
-- the owner so they can edit a hidden profile.
create policy "public freelancer profiles are readable"
  on public.freelancer_profiles for select
  using (public_profile_enabled or auth.uid() = user_id);

create policy "freelancers insert their own profile"
  on public.freelancer_profiles for insert to authenticated
  with check (auth.uid() = user_id);

create policy "freelancers update their own profile"
  on public.freelancer_profiles for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Client profiles hold billing details — owner only, never public (NFR-003).
create policy "clients read their own profile"
  on public.client_profiles for select to authenticated
  using (auth.uid() = user_id);

create policy "clients insert their own profile"
  on public.client_profiles for insert to authenticated
  with check (auth.uid() = user_id);

create policy "clients update their own profile"
  on public.client_profiles for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Portfolio work: published items are public (FR-001); drafts are owner-only
-- (FR-009). Writes are owner-only (NFR-004) — enforced here so a forged request
-- fails at the database, not at a hidden button.
create policy "published work is readable by everyone"
  on public.portfolio_items for select
  using (status = 'published' or auth.uid() = freelancer_id);

create policy "freelancers create their own work"
  on public.portfolio_items for insert to authenticated
  with check (auth.uid() = freelancer_id);

create policy "freelancers update their own work"
  on public.portfolio_items for update to authenticated
  using (auth.uid() = freelancer_id) with check (auth.uid() = freelancer_id);

create policy "freelancers delete their own work"
  on public.portfolio_items for delete to authenticated
  using (auth.uid() = freelancer_id);

-- Jobs: open jobs are public (FR-017); a client sees and manages their own
-- closed ones (FR-018).
create policy "open jobs are readable by everyone"
  on public.jobs for select
  using (status = 'open' or auth.uid() = client_id);

create policy "clients create their own jobs"
  on public.jobs for insert to authenticated
  with check (auth.uid() = client_id);

create policy "clients update their own jobs"
  on public.jobs for update to authenticated
  using (auth.uid() = client_id) with check (auth.uid() = client_id);

create policy "clients delete their own jobs"
  on public.jobs for delete to authenticated
  using (auth.uid() = client_id);

-- ─── Storage ───────────────────────────────────────────────────────────────
-- Image-only MVP: portfolio covers and gallery images live here. Each user owns
-- the folder named after their uid, e.g. portfolio-images/<uid>/cover.webp

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

create policy "portfolio images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "users upload to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update their own images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete their own images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
