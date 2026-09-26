import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// Lesson 7.6: `npm run build -- --mode analyze` writes dist/stats.html.
const analyze = process.argv.includes("--mode") && process.argv.includes("analyze")

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt", not "autoUpdate": a silent swap mid-session can replace the
      // running app under the user's feet. PwaStatus offers a Reload instead.
      registerType: "prompt",
      includeAssets: ["apple-touch-icon.png", "favicon-64.png"],
      manifest: {
        name: "EyKorBan — Freelance Portfolio Discovery",
        short_name: "EyKorBan",
        description:
          "Discover freelance portfolio work, browse open jobs, and publish your own.",
        theme_color: "#e11d48",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          { name: "Find Work", url: "/find-work" },
          { name: "Hire Creatives", url: "/hire-creatives" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "index.html",

        // ── Lesson 7.3: a strategy per asset type, not one rule per app ──────
        //
        // SECURITY: a blanket `/^https:\/\/.*\.supabase\.co/` pattern is the
        // trap this lesson warns about. It matches authenticated REST calls
        // too, and the cache is keyed by URL — so a signed-in freelancer's
        // drafts get stored, and the next person to use the browser is served
        // them. The rules below cache only responses that are identical for
        // every viewer, and src/lib/cache.ts additionally wipes the data cache
        // whenever the signed-in user changes.
        runtimeCaching: [
          {
            // CACHE FIRST — files that rarely change. Cover images and avatars
            // are effectively immutable once uploaded.
            urlPattern: ({ url }) =>
              url.hostname === "images.unsplash.com" ||
              url.pathname.includes("/storage/v1/object/public/"),
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // STALE WHILE REVALIDATE — categories and industries are reference
            // data: the same rows for everyone, signed in or not, and rarely
            // edited. Show the cached copy instantly, refresh behind it.
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/rest/v1/categories") ||
              url.pathname.startsWith("/rest/v1/industries"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "reference-data",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            // NETWORK FIRST — the public catalogue. Fresh when there is signal,
            // last-known copy on the underground. Scoped to the two public
            // listing tables, and cleared on any change of signed-in user.
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/rest/v1/portfolio_items") ||
              url.pathname.startsWith("/rest/v1/jobs") ||
              url.pathname.startsWith("/rest/v1/profiles"),
            handler: "NetworkFirst",
            options: {
              cacheName: "catalogue",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            // NETWORK ONLY — tokens and sessions must never be served from a
            // cache, and a stored refresh token is a credential at rest.
            urlPattern: ({ url }) => url.pathname.startsWith("/auth/v1/"),
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: { enabled: false },
    }),
    analyze &&
      visualizer({
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  build: {
    rolldownOptions: {
      output: {
        // Vendor code changes far less often than app code. Splitting it out
        // means a normal deploy only invalidates the small app chunk, and the
        // service worker keeps the big ones precached across releases.
        // Vite 8 bundles with rolldown, whose option is `advancedChunks`
        // rather than rollup's `manualChunks`.
        advancedChunks: {
          groups: [
            { name: "react", test: /node_modules\/(react|react-dom|react-router|scheduler)\// },
            { name: "supabase", test: /node_modules\/@supabase\// },
            { name: "ui", test: /node_modules\/(@base-ui|lucide-react)\// },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
