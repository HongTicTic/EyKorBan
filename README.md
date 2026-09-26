# EyKorBan — Ship It (PWA)

Installable, offline-capable PWA for freelance portfolio discovery.
React 19 + Vite + Tailwind v4 + Supabase. No backend server: the browser talks
to Postgres directly and **Row Level Security is the authorization layer**.

## Quick start

```bash
npm install
cp .env.example .env.local        # fill in your two Supabase values
npm run dev                       # http://localhost:5173
```

The service worker is disabled in dev. To exercise install / offline / caching:

```bash
npm run build && npm run preview  # http://localhost:4173
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

Then **Settings → Environment Variables**, add both and redeploy once:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |

`vercel.json` already handles the parts people get wrong:

- **SPA rewrites** — without them, refreshing `/my-work` 404s, because that path
  exists only in the client router.
- **`sw.js` served `max-age=0`** — a cached service worker means users never
  receive updates. Hashed assets under `/assets` get a year.
- Baseline security headers.

> Audit the **deployed** URL, not localhost. Lighthouse needs HTTPS and a real
> server to score PWA and caching correctly.

## Performance

Measured, not estimated.

| | Before | After |
| --- | --- | --- |
| JS chunks | 2 | 22 |
| Initial JS (raw) | 762 kB | 697 kB |
| Initial JS (gzip) | ~233 kB | **~207 kB** |
| App code in the entry | — | **50 kB** |

Route splitting via `React.lazy` + `Suspense` in `src/App.tsx`. `Home` is
imported eagerly on purpose: lazy-loading the landing route only adds a round
trip before the first paint.

**Where the weight actually is.** Splitting routes barely moved the initial
number, because the initial load is vendor, not routes:

| Chunk | raw | gzip |
| --- | --- | --- |
| `react` (react, react-dom, react-router) | 251 kB | 81 kB |
| `supabase` (@supabase/supabase-js) | 209 kB | 55 kB |
| `ui` (@base-ui, lucide-react) | 157 kB | 55 kB |
| `index` (all our own code) | 50 kB | 16 kB |

`supabase-js` is larger than React, partly because it bundles `RealtimeClient`
which this app never uses. That is the next real win if you want one.

Run `npm run analyze` for the treemap (`dist/stats.html`).

Images carry `width`/`height` so the browser reserves space (CLS), and
everything below the fold is `loading="lazy"`. The portfolio hero stays eager so
it can serve as the LCP element.

## Caching — a strategy per asset type

`vite.config.ts`:

| What | Strategy | Why |
| --- | --- | --- |
| App shell, icons, fonts | precache | Ships with the build |
| Cover images, avatars | **CacheFirst**, 30d | Immutable once uploaded |
| `categories`, `industries` | **StaleWhileRevalidate**, 7d | Same rows for everyone, rarely edited |
| `portfolio_items`, `jobs`, `profiles` | **NetworkFirst**, 5s timeout | Fresh with signal, last-known without |
| `/auth/v1/*` | **NetworkOnly** | A cached token is a credential at rest |

### The security trap this avoids

A blanket `/^https:\/\/.*\.supabase\.co/` pattern also matches **authenticated**
REST calls. The cache is keyed by URL, and a URL does not record who asked — so
a signed-in freelancer's drafts get stored, and the next person to use that
browser is served them.

Two defences here: the rules above cache only responses identical for every
viewer, and `src/lib/cache.ts` wipes the data caches on every `SIGNED_IN` /
`SIGNED_OUT` event.

## Offline

- `src/components/pwa-status.tsx` — offline banner, and a **Reload** prompt when
  a new version is waiting (`registerType: "prompt"`, so nothing swaps itself in
  mid-session).
- `src/hooks/use-offline-queue.ts` — writes made offline are queued and replayed
  on reconnect. The queue persists to `localStorage`, because a queue held only
  in React state dies when the user closes the tab — which is exactly what
  people do when an app stops responding. Entries are serialisable descriptors,
  not closures, since a function cannot survive `JSON.stringify`.

## Mobile

| Problem | Fix |
| --- | --- |
| Sidebar fixed at 220px — 59% of a 375px screen | Hidden below `md`; bottom tab bar instead |
| `h-screen` jumps as the mobile URL bar collapses | `h-dvh` |
| Content under the notch / home indicator | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| iOS zooms on inputs under 16px | Inputs forced to 16px below `md` |
| Grey tap-highlight flash | `-webkit-tap-highlight-color: transparent` |

Native sharing via `src/components/share-button.tsx`: the Web Share API where
it exists, clipboard fallback otherwise, and a hidden-textarea fallback for
insecure contexts. Cancelling the share sheet throws `AbortError` — that is the
user saying no, so it is swallowed rather than reported as a failure.

## Database

`supabase/migrations/` holds the schema and every RLS policy;
`supabase/seed.sql` loads demo content and ten working accounts
(password `password123`). Run the migration first, then the seed.

## Known gaps

- **Not visually verified.** Every check has been typecheck, build and API-level.
  Open DevTools device mode at 375px and run Lighthouse against the deployed URL.
- The project engagement lifecycle (FR-020 … FR-027) has no tables and no screens.
- `useOfflineQueue` is built and tested but not yet wired into the work/job
  editors — those still fail outright when offline.

//chore