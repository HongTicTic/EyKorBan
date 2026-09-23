-- EyKorBan — demo seed
--
-- Ports src/mock-data/mock-data.ts into the database, including real, loggable
-- auth accounts so signed-in states can be exercised without signing up ten
-- times. Every demo account uses the password: password123
--
-- Safe to re-run: it deletes the fixed demo ids first.
-- DEMO DATA ONLY — do not run against production.

-- ─── Reference taxonomies ──────────────────────────────────────────────────
-- Mirrors CATEGORIES in src/interface/category.ts (minus the synthetic "all"
-- entry, which is a filter affordance, not a category).

insert into public.categories (id, name, slug, sort_order) values
  ('it-software',       'IT & Software',          'it-software',         1),
  ('uiux',              'UI/UX Design',           'ui-ux-design',        2),
  ('web-dev',           'Web Development',        'web-development',     3),
  ('mobile-dev',        'Mobile Development',     'mobile-development',  4),
  ('graphic-design',    'Graphic Design',         'graphic-design',      5),
  ('branding',          'Branding & Identity',    'branding-identity',   6),
  ('digital-marketing', 'Digital Marketing',      'digital-marketing',   7),
  ('writing',           'Writing & Translation',  'writing-translation', 8),
  ('video-animation',   'Video & Animation',      'video-animation',     9),
  ('data-analytics',    'Data & Analytics',       'data-analytics',     10),
  ('consulting',        'Consulting',             'consulting',         11)
on conflict (id) do update
  set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;

-- Mirrors DEFAULT_INDUSTRY_OPTIONS in src/components/dropdown.tsx.
insert into public.industries (id, name, sort_order) values
  ('tech',          'Technology & Software',        1),
  ('fintech',       'Fintech & Finance',            2),
  ('ecommerce',     'E-Commerce & Retail',          3),
  ('healthcare',    'Healthcare & Life Sciences',   4),
  ('education',     'Education & EdTech',           5),
  ('real-estate',   'Real Estate & Architecture',   6),
  ('entertainment', 'Media & Entertainment',        7)
on conflict (id) do update
  set name = excluded.name, sort_order = excluded.sort_order;

-- ─── Reset demo rows ───────────────────────────────────────────────────────
-- Deleting the auth users cascades to profiles, portfolio items and jobs.

delete from auth.users
where id in (
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000010'
);

-- ─── Demo auth accounts ────────────────────────────────────────────────────
-- Writing straight into auth.users is a seeding shortcut, not an app pattern.
-- The public.handle_new_user() trigger picks these up and creates the matching
-- public.profiles row, exactly as a real signup would.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  '00000000-0000-0000-0000-000000000000',
  demo.id, 'authenticated', 'authenticated', demo.email,
  extensions.crypt('password123', extensions.gen_salt('bf')),
  demo.created_at, demo.created_at, demo.updated_at, demo.last_login_at,
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'name', demo.name,
    'username', demo.username,
    'role', demo.role,
    'avatar_url', demo.avatar_url
  ),
  '', '', '', ''
from (values
  ('00000000-0000-4000-8000-000000000001'::uuid, 'Alex Vance',      'alexvance',      'FREELANCER', 'alex.vance@example.com',     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '2026-01-15T08:30:00Z'::timestamptz, '2026-09-18T10:00:00Z'::timestamptz, '2026-09-19T09:15:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000002'::uuid, 'Sarah Chen',      'sarahchen',      'FREELANCER', 'sarah.chen@example.com',     'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', '2026-02-10T11:20:00Z'::timestamptz, '2026-09-17T15:00:00Z'::timestamptz, '2026-09-19T11:45:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000003'::uuid, 'Marcus Aurelius', 'marcus_design',  'FREELANCER', 'marcus.a@example.com',       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '2026-03-01T09:10:00Z'::timestamptz, '2026-09-16T12:00:00Z'::timestamptz, '2026-09-18T16:30:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000004'::uuid, 'David Kim',       'davidkim_cloud', 'FREELANCER', 'david.kim@example.com',      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '2026-01-20T14:40:00Z'::timestamptz, '2026-09-15T09:00:00Z'::timestamptz, '2026-09-19T08:00:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000005'::uuid, 'Elena Rostova',   'elena_arts',     'FREELANCER', 'elena.rostova@example.com',  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', '2026-04-12T16:15:00Z'::timestamptz, '2026-09-14T17:00:00Z'::timestamptz, '2026-09-17T20:10:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000006'::uuid, 'Liam O''Connor',  'liam_dev',       'FREELANCER', 'liam.oconnor@example.com',   'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', '2026-02-28T10:05:00Z'::timestamptz, '2026-09-13T11:00:00Z'::timestamptz, '2026-09-19T10:20:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000007'::uuid, 'Maya Patel',      'mayapatel_ui',   'FREELANCER', 'maya.patel@example.com',     'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', '2026-03-18T13:25:00Z'::timestamptz, '2026-09-12T14:00:00Z'::timestamptz, '2026-09-19T12:00:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000008'::uuid, 'Carlos Mendez',   'carlos_growth',  'FREELANCER', 'carlos.mendez@example.com',  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', '2026-05-05T08:00:00Z'::timestamptz, '2026-09-11T08:00:00Z'::timestamptz, '2026-09-15T14:30:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000009'::uuid, 'Sophia Nguyen',   'sophianguyen',   'CLIENT',     'sophia.nguyen@example.com',  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', '2026-01-10T07:45:00Z'::timestamptz, '2026-09-10T12:30:00Z'::timestamptz, '2026-09-18T18:00:00Z'::timestamptz),
  ('00000000-0000-4000-8000-000000000010'::uuid, 'Oliver Wright',   'oliverwright',   'ADMIN',      'admin.oliver@eykorban.com',  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', '2025-12-01T09:00:00Z'::timestamptz, '2026-09-09T15:30:00Z'::timestamptz, '2026-09-19T13:00:00Z'::timestamptz)
) as demo (id, name, username, role, email, avatar_url, created_at, updated_at, last_login_at);

-- Email/password sign-in needs a matching identity row.
insert into auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', u.created_at, u.created_at, u.updated_at
from auth.users u
where u.id between '00000000-0000-4000-8000-000000000001' and '00000000-0000-4000-8000-000000000010';

-- ─── Profile details the signup trigger cannot know ────────────────────────

update public.profiles p
set status = 'PENDING_VERIFICATION'
where p.id = '00000000-0000-4000-8000-000000000008';

update public.profiles p
set created_at    = u.created_at,
    last_login_at = u.last_sign_in_at
from auth.users u
where u.id = p.id
  and u.id between '00000000-0000-4000-8000-000000000001' and '00000000-0000-4000-8000-000000000010';

insert into public.freelancer_profiles (
  user_id, tagline, bio, skills, hourly_rate, currency,
  public_profile_enabled, website_url, linkedin_url, github_url
) values
  ('00000000-0000-4000-8000-000000000001',
   'Full-stack engineer for data-heavy web platforms',
   'I design and build web platforms that turn messy data into clear dashboards. Eight years shipping React and Node products for analytics and enterprise teams, from first prototype to production scale.',
   array['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Data Viz'], 85, 'USD', true,
   'https://alexvance.dev', null, 'https://github.com/alexvance'),
  ('00000000-0000-4000-8000-000000000002',
   'Mobile designer and developer for fintech',
   'I make money apps people actually trust. I work across product design and native development, so the handoff between Figma and Swift or Kotlin never gets lost.',
   array['Swift', 'Kotlin', 'React Native', 'Fintech UX'], 95, 'USD', true,
   null, 'https://linkedin.com/in/sarahchen', null),
  ('00000000-0000-4000-8000-000000000003',
   'Brand identity designer for creative studios',
   'Identity systems with a point of view. I help studios and agencies find a visual voice, then document it so the whole team can use it.',
   array['Branding', 'Logo Design', 'Typography', 'Art Direction'], 70, 'USD', true,
   'https://marcus.design', null, null),
  ('00000000-0000-4000-8000-000000000004',
   'Cloud architect moving teams to AWS and GCP',
   'I plan and run cloud migrations with zero-downtime cutovers, then leave teams with infrastructure as code they can own.',
   array['AWS', 'Terraform', 'Kubernetes', 'DevOps'], 110, 'USD', true,
   null, 'https://linkedin.com/in/davidkim', null),
  ('00000000-0000-4000-8000-000000000005',
   'Editorial designer with a Bauhaus streak',
   'Grids, bold type and primary colours. I design magazines, reports and editorial systems for print and screen.',
   array['Editorial Design', 'Layout', 'Print', 'Illustration'], 65, 'USD', true,
   'https://elenarostova.art', null, null),
  ('00000000-0000-4000-8000-000000000006',
   'Creative developer for luxury e-commerce',
   'I build storefronts that feel like the brand: smooth motion, fast pages and checkout flows that convert.',
   array['Shopify', 'Next.js', 'GSAP', 'Three.js'], 80, 'USD', true,
   null, null, 'https://github.com/liamdev'),
  ('00000000-0000-4000-8000-000000000007',
   'UI/UX designer for AI and developer tools',
   'I simplify complex tools. Most of my work is design systems and interaction design for AI products and developer platforms.',
   array['Figma', 'Design Systems', 'Prototyping', 'User Research'], 90, 'USD', true,
   'https://mayapatel.design', null, null),
  ('00000000-0000-4000-8000-000000000008',
   'Growth marketer turning data into campaigns',
   'Campaign strategy backed by numbers. I run SEO, paid acquisition and reporting for early-stage brands.',
   array['SEO', 'Paid Ads', 'Analytics', 'Copywriting'], 60, 'USD', true,
   null, 'https://linkedin.com/in/carlosmendez', null)
on conflict (user_id) do update set
  tagline                = excluded.tagline,
  bio                    = excluded.bio,
  skills                 = excluded.skills,
  hourly_rate            = excluded.hourly_rate,
  currency               = excluded.currency,
  public_profile_enabled = excluded.public_profile_enabled,
  website_url            = excluded.website_url,
  linkedin_url           = excluded.linkedin_url,
  github_url             = excluded.github_url;

-- ─── Portfolio work ────────────────────────────────────────────────────────
-- Industry ids are new here: the mock ProjectCard had no industry, so the
-- industry filter on the home page had nothing to filter on.

insert into public.portfolio_items (
  id, freelancer_id, title, subtitle, cover_image_url, category_id, industry_id,
  status, published_at, like_count, view_count, created_at
) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001',
   'Aether Data Platform v2.0', 'Enterprise Web Platform',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
   'web-dev', 'tech', 'published', '2026-09-18T09:00:00Z', 428, 12400, '2026-09-18T09:00:00Z'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002',
   'Nexus Pay — Wealth & Transfers', 'iOS & Android App',
   'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
   'mobile-dev', 'fintech', 'published', '2026-09-17T14:30:00Z', 812, 28100, '2026-09-17T14:30:00Z'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003',
   'Kroma Creative Studio Identity', 'Brand Architecture',
   'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
   'branding', 'entertainment', 'published', '2026-09-16T11:15:00Z', 540, 15300, '2026-09-16T11:15:00Z'),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000004',
   'Cloud Infrastructure Migration', 'DevOps & IT Consulting',
   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
   'it-software', 'tech', 'published', '2026-09-15T08:45:00Z', 1200, 34700, '2026-09-15T08:45:00Z'),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005',
   'Bauhaus Redux Editorial System', 'Print & Poster Design',
   'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
   'graphic-design', 'entertainment', 'published', '2026-09-14T16:20:00Z', 389, 9800, '2026-09-14T16:20:00Z'),
  ('10000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000006',
   'Maison Vesper Fragrances', 'Shopify & Headless Commerce',
   'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
   'web-dev', 'ecommerce', 'published', '2026-09-13T10:05:00Z', 714, 22600, '2026-09-13T10:05:00Z'),
  ('10000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000007',
   'Synapse Studio — Node AI', 'Complex App UX',
   'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
   'uiux', 'tech', 'published', '2026-09-12T13:40:00Z', 960, 31000, '2026-09-12T13:40:00Z'),
  ('10000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000008',
   'Q3 Growth Campaign Report', 'Digital Marketing & Analytics',
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
   'digital-marketing', 'ecommerce', 'published', '2026-09-11T07:50:00Z', 1500, 41200, '2026-09-11T07:50:00Z'),
  ('10000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000009',
   'Wanderlust Travel App Redesign', 'Mobile UX Case Study',
   'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
   'uiux', 'entertainment', 'published', '2026-09-10T12:10:00Z', 623, 18900, '2026-09-10T12:10:00Z'),
  ('10000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000010',
   'Verdant Botanicals Brand Launch', 'Product Copy & Content',
   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
   'writing', 'ecommerce', 'published', '2026-09-09T15:25:00Z', 275, 7600, '2026-09-09T15:25:00Z'),
  -- A draft, so the owner-only draft path (FR-009) has something to show.
  ('10000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000001',
   'Helios Reporting Suite (work in progress)', 'Analytics Dashboard',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
   'data-analytics', 'tech', 'draft', null, 0, 0, '2026-09-20T09:00:00Z');

-- ─── Job opportunities ─────────────────────────────────────────────────────

insert into public.jobs (
  id, client_id, title, description, category_id, industry_id, status, published_at, created_at
) values
  ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000009',
   'Landing page for a fintech savings app',
   'We are launching a round-up savings app and need a high-converting landing page with a clear signup flow. Design and build in React; copy is ready.',
   'web-dev', 'fintech', 'open', '2026-09-19T08:00:00Z', '2026-09-19T08:00:00Z'),
  ('20000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000009',
   'Brand identity for an organic skincare line',
   'New skincare brand looking for a full identity: logo, colour palette, typography and packaging direction for five products. Earthy, calm and premium.',
   'branding', 'ecommerce', 'open', '2026-09-18T13:30:00Z', '2026-09-18T13:30:00Z'),
  ('20000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000009',
   'iOS app redesign for a telehealth startup',
   'Our booking and video-visit flows are dated and confusing for older patients. We need a redesign focused on accessibility, then help implementing it in SwiftUI.',
   'mobile-dev', 'healthcare', 'open', '2026-09-17T10:15:00Z', '2026-09-17T10:15:00Z'),
  ('20000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000009',
   'Attendance dashboard for a school network',
   'Build a dashboard that shows attendance trends across twelve schools, with filters by grade and term. Data comes from a CSV export updated weekly.',
   'data-analytics', 'education', 'open', '2026-09-16T09:00:00Z', '2026-09-16T09:00:00Z'),
  ('20000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000009',
   'Explainer video for a property listing platform',
   'A 60-second animated explainer showing how buyers find and book viewings on our platform. Script is drafted; we need storyboard, animation and voice-over.',
   'video-animation', 'real-estate', 'open', '2026-09-15T16:45:00Z', '2026-09-15T16:45:00Z'),
  ('20000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000009',
   'Design system audit for a SaaS product',
   'Our Figma library has drifted from the code. Audit components, document the gaps and propose a cleaned-up set of tokens and core components.',
   'uiux', 'tech', 'open', '2026-09-14T11:20:00Z', '2026-09-14T11:20:00Z'),
  ('20000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000009',
   'SEO content plan for an online bookstore',
   'Plan and write twelve long-form articles around reading lists and gift guides, with keyword research and internal linking recommendations.',
   'writing', 'ecommerce', 'open', '2026-09-12T07:30:00Z', '2026-09-12T07:30:00Z'),
  ('20000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000009',
   'Podcast cover art and social templates',
   'Cover art for a weekly film podcast plus editable templates for episode announcements on Instagram and YouTube.',
   'graphic-design', 'entertainment', 'closed', '2026-09-10T15:00:00Z', '2026-09-10T15:00:00Z');
