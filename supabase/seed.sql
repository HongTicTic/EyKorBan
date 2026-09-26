-- Seed data converted from the former src/mock-data/mock-data.ts module.

insert into public.users (
  user_id, name, username, role, email, avatar_url, status,
  created_at, updated_at, last_login_at
)
values
  ('u1', 'Alex Vance', 'alexvance', 'FREELANCER', 'alex.vance@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-01-15T08:30:00Z', '2026-09-18T10:00:00Z', '2026-09-19T09:15:00Z'),
  ('u2', 'Sarah Chen', 'sarahchen', 'FREELANCER', 'sarah.chen@example.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-02-10T11:20:00Z', '2026-09-17T15:00:00Z', '2026-09-19T11:45:00Z'),
  ('u3', 'Marcus Aurelius', 'marcus_design', 'FREELANCER', 'marcus.a@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-03-01T09:10:00Z', '2026-09-16T12:00:00Z', '2026-09-18T16:30:00Z'),
  ('u4', 'David Kim', 'davidkim_cloud', 'FREELANCER', 'david.kim@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-01-20T14:40:00Z', '2026-09-15T09:00:00Z', '2026-09-19T08:00:00Z'),
  ('u5', 'Elena Rostova', 'elena_arts', 'FREELANCER', 'elena.rostova@example.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-04-12T16:15:00Z', '2026-09-14T17:00:00Z', '2026-09-17T20:10:00Z'),
  ('u6', 'Liam O''Connor', 'liam_dev', 'FREELANCER', 'liam.oconnor@example.com', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-02-28T10:05:00Z', '2026-09-13T11:00:00Z', '2026-09-19T10:20:00Z'),
  ('u7', 'Maya Patel', 'mayapatel_ui', 'FREELANCER', 'maya.patel@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-03-18T13:25:00Z', '2026-09-12T14:00:00Z', '2026-09-19T12:00:00Z'),
  ('u8', 'Carlos Mendez', 'carlos_growth', 'FREELANCER', 'carlos.mendez@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'PENDING_VERIFICATION', '2026-05-05T08:00:00Z', '2026-09-11T08:00:00Z', '2026-09-15T14:30:00Z'),
  ('u9', 'Sophia Nguyen', 'sophianguyen', 'CLIENT', 'sophia.nguyen@example.com', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2026-01-10T07:45:00Z', '2026-09-10T12:30:00Z', '2026-09-18T18:00:00Z'),
  ('u10', 'Oliver Wright', 'oliverwright', 'ADMIN', 'admin.oliver@eykorban.com', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'ACTIVE', '2025-12-01T09:00:00Z', '2026-09-09T15:30:00Z', '2026-09-19T13:00:00Z')
on conflict (user_id) do update set
  name = excluded.name, username = excluded.username, role = excluded.role,
  email = excluded.email, avatar_url = excluded.avatar_url, status = excluded.status,
  created_at = excluded.created_at, updated_at = excluded.updated_at,
  last_login_at = excluded.last_login_at;

insert into public.freelancer_profiles (
  user_id, username, tagline, bio, skills, hourly_rate, currency,
  public_profile_enabled, social_links
)
values
  ('u1', 'alexvance', 'Full-stack engineer for data-heavy web platforms', 'I design and build web platforms that turn messy data into clear dashboards. Eight years shipping React and Node products for analytics and enterprise teams, from first prototype to production scale.', array['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Data Viz'], 85, 'USD', true, '{"website":"https://alexvance.dev","github":"https://github.com/alexvance"}'::jsonb),
  ('u2', 'sarahchen', 'Mobile designer and developer for fintech', 'I make money apps people actually trust. I work across product design and native development, so the handoff between Figma and Swift or Kotlin never gets lost.', array['Swift', 'Kotlin', 'React Native', 'Fintech UX'], 95, 'USD', true, '{"linkedin":"https://linkedin.com/in/sarahchen"}'::jsonb),
  ('u3', 'marcus_design', 'Brand identity designer for creative studios', 'Identity systems with a point of view. I help studios and agencies find a visual voice, then document it so the whole team can use it.', array['Branding', 'Logo Design', 'Typography', 'Art Direction'], 70, 'USD', true, '{"website":"https://marcus.design"}'::jsonb),
  ('u4', 'davidkim_cloud', 'Cloud architect moving teams to AWS and GCP', 'I plan and run cloud migrations with zero-downtime cutovers, then leave teams with infrastructure as code they can own.', array['AWS', 'Terraform', 'Kubernetes', 'DevOps'], 110, 'USD', true, '{"linkedin":"https://linkedin.com/in/davidkim"}'::jsonb),
  ('u5', 'elena_arts', 'Editorial designer with a Bauhaus streak', 'Grids, bold type and primary colours. I design magazines, reports and editorial systems for print and screen.', array['Editorial Design', 'Layout', 'Print', 'Illustration'], 65, 'USD', true, '{"website":"https://elenarostova.art"}'::jsonb),
  ('u6', 'liam_dev', 'Creative developer for luxury e-commerce', 'I build storefronts that feel like the brand: smooth motion, fast pages and checkout flows that convert.', array['Shopify', 'Next.js', 'GSAP', 'Three.js'], 80, 'USD', true, '{"github":"https://github.com/liamdev"}'::jsonb),
  ('u7', 'mayapatel_ui', 'UI/UX designer for AI and developer tools', 'I simplify complex tools. Most of my work is design systems and interaction design for AI products and developer platforms.', array['Figma', 'Design Systems', 'Prototyping', 'User Research'], 90, 'USD', true, '{"website":"https://mayapatel.design"}'::jsonb),
  ('u8', 'carlos_growth', 'Growth marketer turning data into campaigns', 'Campaign strategy backed by numbers. I run SEO, paid acquisition and reporting for early-stage brands.', array['SEO', 'Paid Ads', 'Analytics', 'Copywriting'], 60, 'USD', true, '{"linkedin":"https://linkedin.com/in/carlosmendez"}'::jsonb)
on conflict (user_id) do update set
  username = excluded.username, tagline = excluded.tagline, bio = excluded.bio,
  skills = excluded.skills, hourly_rate = excluded.hourly_rate, currency = excluded.currency,
  public_profile_enabled = excluded.public_profile_enabled, social_links = excluded.social_links;

insert into public.project_cards (
  id, title, subtitle, cover_image_url, category_id, freelance_id,
  published_at, like_count, view_count
)
values
  ('pc-001', 'Aether Data Platform v2.0', 'Enterprise Web Platform', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', 'web-dev', 'u1', '2026-09-18T09:00:00Z', 428, 12400),
  ('pc-002', 'Nexus Pay — Wealth & Transfers', 'iOS & Android App', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', 'mobile-dev', 'u2', '2026-09-17T14:30:00Z', 812, 28100),
  ('pc-003', 'Kroma Creative Studio Identity', 'Brand Architecture', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80', 'branding', 'u3', '2026-09-16T11:15:00Z', 540, 15300),
  ('pc-004', 'Cloud Infrastructure Migration', 'DevOps & IT Consulting', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'it-software', 'u4', '2026-09-15T08:45:00Z', 1200, 34700),
  ('pc-005', 'Bauhaus Redux Editorial System', 'Print & Poster Design', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80', 'graphic-design', 'u5', '2026-09-14T16:20:00Z', 389, 9800),
  ('pc-006', 'Maison Vesper Fragrances', 'Shopify & Headless Commerce', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 'web-dev', 'u6', '2026-09-13T10:05:00Z', 714, 22600),
  ('pc-007', 'Synapse Studio — Node AI', 'Complex App UX', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80', 'uiux', 'u7', '2026-09-12T13:40:00Z', 960, 31000),
  ('pc-008', 'Q3 Growth Campaign Report', 'Digital Marketing & Analytics', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', 'digital-marketing', 'u8', '2026-09-11T07:50:00Z', 1500, 41200),
  ('pc-009', 'Wanderlust Travel App Redesign', 'Mobile UX Case Study', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80', 'uiux', 'u9', '2026-09-10T12:10:00Z', 623, 18900),
  ('pc-010', 'Verdant Botanicals Brand Launch', 'Product Copy & Content', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', 'writing', 'u10', '2026-09-09T15:25:00Z', 275, 7600)
on conflict (id) do update set
  title = excluded.title, subtitle = excluded.subtitle, cover_image_url = excluded.cover_image_url,
  category_id = excluded.category_id, freelance_id = excluded.freelance_id,
  published_at = excluded.published_at, like_count = excluded.like_count, view_count = excluded.view_count;

insert into public.jobs (
  id, client_id, title, description, category_id, industry_id, status, published_at
)
values
  ('job-001', 'u9', 'Landing page for a fintech savings app', 'We are launching a round-up savings app and need a high-converting landing page with a clear signup flow. Design and build in React; copy is ready.', 'web-dev', 'fintech', 'open', '2026-09-19T08:00:00Z'),
  ('job-002', 'u9', 'Brand identity for an organic skincare line', 'New skincare brand looking for a full identity: logo, colour palette, typography and packaging direction for five products. Earthy, calm and premium.', 'branding', 'ecommerce', 'open', '2026-09-18T13:30:00Z'),
  ('job-003', 'u9', 'iOS app redesign for a telehealth startup', 'Our booking and video-visit flows are dated and confusing for older patients. We need a redesign focused on accessibility, then help implementing it in SwiftUI.', 'mobile-dev', 'healthcare', 'open', '2026-09-17T10:15:00Z'),
  ('job-004', 'u9', 'Attendance dashboard for a school network', 'Build a dashboard that shows attendance trends across twelve schools, with filters by grade and term. Data comes from a CSV export updated weekly.', 'data-analytics', 'education', 'open', '2026-09-16T09:00:00Z'),
  ('job-005', 'u9', 'Explainer video for a property listing platform', 'A 60-second animated explainer showing how buyers find and book viewings on our platform. Script is drafted; we need storyboard, animation and voice-over.', 'video-animation', 'real-estate', 'open', '2026-09-15T16:45:00Z'),
  ('job-006', 'u9', 'Design system audit for a SaaS product', 'Our Figma library has drifted from the code. Audit components, document the gaps and propose a cleaned-up set of tokens and core components.', 'uiux', 'tech', 'open', '2026-09-14T11:20:00Z'),
  ('job-007', 'u9', 'SEO content plan for an online bookstore', 'Plan and write twelve long-form articles around reading lists and gift guides, with keyword research and internal linking recommendations.', 'writing', 'ecommerce', 'open', '2026-09-12T07:30:00Z'),
  ('job-008', 'u9', 'Podcast cover art and social templates', 'Cover art for a weekly film podcast plus editable templates for episode announcements on Instagram and YouTube.', 'graphic-design', 'entertainment', 'closed', '2026-09-10T15:00:00Z')
on conflict (id) do update set
  client_id = excluded.client_id, title = excluded.title, description = excluded.description,
  category_id = excluded.category_id, industry_id = excluded.industry_id,
  status = excluded.status, published_at = excluded.published_at;
