/**
 * The profile columns anyone may read.
 *
 * `email` and `last_login_at` are deliberately absent: the database no longer
 * grants SELECT on them to API roles (migration 20260926010000), so a `*`
 * select on profiles now fails outright rather than quietly leaking them.
 * Every query that touches profiles — directly or through an embed — must use
 * this list. A signed-in user's own email comes from their auth session.
 */
export const PROFILE_COLUMNS =
  "id,name,username,role,avatar_url,status,created_at,updated_at"
