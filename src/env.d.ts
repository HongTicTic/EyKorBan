/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  /** Current key format: sb_publishable_... */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Legacy anon JWT (eyJ...). Deprecated by Supabase end of 2026. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
