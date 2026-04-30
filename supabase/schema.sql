-- Consent records schema for Distanz Running
-- Paste this into the Supabase SQL Editor and run it once.

create table if not exists public.consent_records (
  id           bigint generated always as identity primary key,
  anon_id      text        not null,
  marketing    boolean     not null default false,
  analytics    boolean     not null default false,
  functional   boolean     not null default false,
  decision     text        not null check (decision in ('accept_all', 'reject_all', 'custom')),
  version      integer     not null default 1,
  user_agent   text,
  ip_hash      text,
  country      text,
  gpc          boolean,
  created_at   timestamptz not null default now()
);

-- Safe to re-run on existing deployments.
alter table public.consent_records add column if not exists gpc boolean;

create index if not exists consent_records_created_at_idx
  on public.consent_records (created_at desc);

create index if not exists consent_records_anon_id_idx
  on public.consent_records (anon_id);

-- Lock down the table. Writes happen server-side via the service role key,
-- which bypasses RLS. The anon key on the client has no access.
alter table public.consent_records enable row level security;

revoke all on public.consent_records from anon;
revoke all on public.consent_records from authenticated;

-- ============================================================================
-- Feedback records
-- ============================================================================
-- Site feedback collected by the <Feedback*> UI components. Anonymous by
-- default; users may optionally provide an email address for follow-up.
-- Written server-side by POST /api/feedback.

create table if not exists public.feedback_records (
  id           bigint generated always as identity primary key,
  anon_id      text,
  emotion      text        check (emotion in ('hate', 'not-great', 'okay', 'love')),
  feedback     text        not null,
  topic        text,
  email        text,
  page_path    text,
  user_agent   text,
  ip_hash      text,
  country      text,
  created_at   timestamptz not null default now()
);

create index if not exists feedback_records_created_at_idx
  on public.feedback_records (created_at desc);

alter table public.feedback_records enable row level security;
revoke all on public.feedback_records from anon;
revoke all on public.feedback_records from authenticated;
