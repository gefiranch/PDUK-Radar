-- PDUK-Radar: run once in Supabase Dashboard > SQL Editor (as postgres).
-- Safe to rerun. Does not delete existing users or case data.
BEGIN;
CREATE TABLE IF NOT EXISTS public.app_users (
 id text PRIMARY KEY, password_hash text, identity_id text UNIQUE,
 email text NOT NULL UNIQUE CHECK (email = lower(email)), name text NOT NULL,
 role text NOT NULL CHECK (role IN ('admin','user')),
 status text NOT NULL CHECK (status IN ('active','inactive')),
 created_by text, created_at text NOT NULL, updated_at text NOT NULL, last_login_at text
);
CREATE TABLE IF NOT EXISTS public.account_audit (
 id text PRIMARY KEY, actor_id text NOT NULL, target_id text NOT NULL,
 action text NOT NULL, created_at text NOT NULL
);
CREATE TABLE IF NOT EXISTS public.app_sessions (
 token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES public.app_users(id),
 created_at bigint NOT NULL, expires_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS app_sessions_user ON public.app_sessions(user_id);
CREATE INDEX IF NOT EXISTS app_sessions_expiry ON public.app_sessions(expires_at);
CREATE TABLE IF NOT EXISTS public.login_attempts (
 key text PRIMARY KEY, failures integer NOT NULL, window_started_at bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS public.case_records (
 employer_id text PRIMARY KEY, payload jsonb NOT NULL,
 version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
 last_change_id text NOT NULL, updated_at text NOT NULL
);
CREATE TABLE IF NOT EXISTS public.case_events (
 id text PRIMARY KEY, employer_id text NOT NULL REFERENCES public.case_records(employer_id),
 version integer NOT NULL, actor_id text NOT NULL, actor_name text NOT NULL,
 actor_role text NOT NULL CHECK (actor_role IN ('admin','user')),
 created_at text NOT NULL, previous_status text NOT NULL, new_status text NOT NULL,
 reason text NOT NULL, payload jsonb NOT NULL,
 CONSTRAINT case_events_employer_version_unique UNIQUE (employer_id,version)
);
CREATE INDEX IF NOT EXISTS case_events_employer_version ON public.case_events(employer_id,version);
CREATE OR REPLACE FUNCTION public.pduk_history_immutable() RETURNS trigger
 LANGUAGE plpgsql SET search_path = public AS $$
 BEGIN RAISE EXCEPTION 'Case history is append-only'; END;
$$;
DROP TRIGGER IF EXISTS case_events_no_change ON public.case_events;
CREATE TRIGGER case_events_no_change BEFORE UPDATE OR DELETE ON public.case_events
 FOR EACH ROW EXECUTE FUNCTION public.pduk_history_immutable();
-- The browser never queries these tables directly. All operations use server API authorization.
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_users,public.account_audit,public.app_sessions,public.login_attempts,public.case_records,public.case_events FROM anon,authenticated;
COMMIT;
