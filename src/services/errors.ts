import type { PostgrestError } from "@supabase/supabase-js"

/**
 * Postgres errors surface raw in the browser. Turn the ones users can actually
 * hit into something a UI can render, and keep the rest generic.
 */
export function describeError(error: PostgrestError | Error | null): string {
  if (!error) return "Something went wrong. Please try again."

  if ("code" in error && typeof error.code === "string") {
    switch (error.code) {
      case "23505":
        return "That value is already taken."
      case "23503":
        return "A linked record is missing or was removed."
      case "23514":
        return "Some of the details are not valid. Please check and try again."
      case "42501":
      case "PGRST301":
        return "You do not have permission to do that."
      case "PGRST116":
        return "Not found."
      default:
        break
    }
  }

  return error.message || "Something went wrong. Please try again."
}

/** Throws on a Supabase error so callers can rely on a plain value. */
export function unwrap<T>(result: {
  data: T | null
  error: PostgrestError | null
}): T {
  if (result.error) throw new Error(describeError(result.error))
  if (result.data === null) throw new Error("Not found.")
  return result.data
}
