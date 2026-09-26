import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * Supabase is retiring the legacy `anon` JWT in favour of publishable keys
 * (sb_publishable_...). Prefer the new one, fall back to the old so an existing
 * .env.local keeps working during the switch.
 */
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * False until .env.local carries real credentials. Checked in main.tsx, which
 * shows setup instructions instead of mounting the app — throwing here would
 * blank the page with nothing but a console error.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey)

/**
 * This key ships in the browser bundle, by design — that is what "publishable"
 * means. What protects the data is Row Level Security, not key secrecy, so every
 * table in supabase/migrations has RLS enabled.
 *
 * The secret key (sb_secret_...) bypasses RLS entirely. It must never appear in
 * this file, in any VITE_ variable, or anywhere else in this repo: Vite inlines
 * every VITE_-prefixed variable into the bundle it serves to users.
 */
export const supabase = createClient<Database>(
  // Placeholders keep createClient from throwing at import time when the app is
  // unconfigured; nothing queries it, because main.tsx does not mount the app.
  supabaseUrl || "http://localhost:54321",
  publishableKey || "unconfigured",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

/** Public URL for a file in the portfolio-images bucket. */
export function portfolioImageUrl(path: string): string {
  return supabase.storage.from("portfolio-images").getPublicUrl(path).data
    .publicUrl
}
