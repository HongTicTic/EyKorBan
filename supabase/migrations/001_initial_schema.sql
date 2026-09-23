create table if not exists public.users (
  user_id text primary key,
  name text not null,
  username text unique,
  role text not null check (role in ('CLIENT', 'FREELANCER', 'ADMIN')),
  email text not null unique,
  avatar_url text,
  status text not null check (status in ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.freelancer_profiles (
  user_id text primary key references public.users(user_id) on delete cascade,
  username text not null unique,
  tagline text,
  bio text,
  skills text[] not null default '{}',
  hourly_rate numeric(10, 2),
  currency text not null default 'USD',
  public_profile_enabled boolean not null default true,
  social_links jsonb not null default '{}'::jsonb
);

create table if not exists public.project_cards (
  id text primary key,
  title text not null,
  subtitle text not null,
  cover_image_url text not null,
  category_id text not null,
  freelance_id text not null references public.users(user_id) on delete cascade,
  published_at timestamptz not null,
  like_count integer not null default 0 check (like_count >= 0),
  view_count integer not null default 0 check (view_count >= 0)
);

create table if not exists public.jobs (
  id text primary key,
  client_id text not null references public.users(user_id) on delete cascade,
  title text not null,
  description text not null,
  category_id text not null,
  industry_id text not null,
  status text not null check (status in ('open', 'closed')),
  published_at timestamptz not null
);

alter table public.users enable row level security;
alter table public.freelancer_profiles enable row level security;
alter table public.project_cards enable row level security;
alter table public.jobs enable row level security;

create policy "Public can read active users"
  on public.users for select
  to anon, authenticated
  using (status = 'ACTIVE');

create policy "Public can read public freelancer profiles"
  on public.freelancer_profiles for select
  to anon, authenticated
  using (public_profile_enabled = true);

create policy "Public can read project cards"
  on public.project_cards for select
  to anon, authenticated
  using (true);

create policy "Public can read open jobs"
  on public.jobs for select
  to anon, authenticated
  using (status = 'open');

create index if not exists project_cards_published_at_idx
  on public.project_cards (published_at desc);
create index if not exists jobs_published_at_idx
  on public.jobs (published_at desc);