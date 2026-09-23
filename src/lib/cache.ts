/**
 * Lesson 7.3, security note: the service worker caches responses by URL, and a
 * URL does not say who asked for it. Two people using the same browser hit the
 * same cache keys, so a cached `/rest/v1/portfolio_items` response written
 * while one user was signed in would be served to the next.
 *
 * The runtime rules in vite.config.ts already exclude anything private. This is
 * the second line of defence: whenever the signed-in identity changes, throw
 * away every cached response that could have been shaped by it.
 */

/** Caches that may hold user-shaped responses. Images are viewer-agnostic. */
const IDENTITY_SCOPED_CACHES = ["catalogue", "reference-data"]

export async function clearIdentityScopedCaches(): Promise<void> {
  if (!("caches" in window)) return

  try {
    const names = await caches.keys()
    await Promise.all(
      names
        .filter((name) =>
          IDENTITY_SCOPED_CACHES.some((scoped) => name.includes(scoped))
        )
        .map((name) => caches.delete(name))
    )
  } catch {
    // A private window or blocked storage — nothing cached, nothing to clear.
  }
}
