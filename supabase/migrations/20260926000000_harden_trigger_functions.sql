-- Fixes two findings from the Supabase security advisor, both introduced by the
-- earlier migrations in this project.

/*
  1. handle_new_user() was reachable as an RPC.

  It is SECURITY DEFINER because it must insert into public.profiles on behalf
  of a brand-new auth user. But PostgREST exposes every function in the public
  schema at /rest/v1/rpc/<name>, so it was also callable directly by anon and
  authenticated callers — a definer-rights function exposed to the internet.

  The trigger on auth.users runs as the table owner and does not need EXECUTE
  granted to API roles, so revoking it closes the endpoint without affecting
  signup.
*/
revoke execute on function public.handle_new_user() from anon, authenticated, public;

/*
  2. Mutable search_path on the trigger functions.

  Without a fixed search_path, an unqualified name inside a function resolves
  against whatever the caller's search_path happens to be, which is the classic
  route to hijacking a definer-rights function.
*/
alter function public.handle_new_user() set search_path = public, pg_temp;
alter function public.set_updated_at() set search_path = public, pg_temp;
alter function public.sync_portfolio_published_at() set search_path = public, pg_temp;
alter function public.enforce_project_transition() set search_path = public, pg_temp;
alter function public.touch_project_activity() set search_path = public, pg_temp;
