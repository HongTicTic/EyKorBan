# EyKorBan

## Supabase setup

The browser client uses Supabase's publishable key. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key from the Supabase Connect dialog:

```bash
cp .env.example .env.local
```

Never put a `sb_secret_...` key or the legacy `service_role` key in Vite environment variables. Those keys bypass Row Level Security and must remain server-side.

Run `supabase/migrations/001_initial_schema.sql` and then `supabase/seed.sql` in the Supabase SQL editor. The seed script contains all former mock users, freelancer profiles, project cards, and jobs. The app has no static data fallback, so these tables must be seeded before the main screens have content.
# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
