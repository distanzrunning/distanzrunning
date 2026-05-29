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
  environment  text        not null check (environment in ('production', 'staging', 'development')),
  created_at   timestamptz not null default now()
);

-- Safe to re-run on existing deployments.
alter table public.consent_records add column if not exists gpc boolean;
-- Environment column migration (production / staging / development).
-- Backfills existing rows as 'staging' since all current data is
-- from staging testing pre-launch.
alter table public.consent_records add column if not exists environment text;
update public.consent_records set environment = 'staging' where environment is null;
alter table public.consent_records alter column environment set not null;
alter table public.consent_records drop constraint if exists consent_records_environment_check;
alter table public.consent_records add constraint consent_records_environment_check
  check (environment in ('production', 'staging', 'development'));

create index if not exists consent_records_created_at_idx
  on public.consent_records (created_at desc);

create index if not exists consent_records_anon_id_idx
  on public.consent_records (anon_id);

create index if not exists consent_records_environment_created_at_idx
  on public.consent_records (environment, created_at desc);

-- ----------------------------------------------------------------------------
-- Retention: weekly delete of consent_records older than 12 months.
-- Lives in pg_cron (managed inside the DB, no app-layer involvement).
-- Runs every Sunday at 03:00 UTC. Documented here for source-of-truth
-- visibility; idempotent if applied via Supabase SQL editor.
-- ----------------------------------------------------------------------------
create extension if not exists pg_cron with schema extensions;

do $$
begin
  perform cron.unschedule('consent-retention-12m');
exception when others then null;
end;
$$;

select cron.schedule(
  'consent-retention-12m',
  '0 3 * * 0',
  $$ delete from public.consent_records where created_at < now() - interval '12 months' $$
);

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

-- ============================================================================
-- Site settings
-- ============================================================================
-- Singleton row of admin-tunable settings — currently just the business
-- timezone used to bucket analytics (consent dashboard etc.). Enforced as
-- single-row via a check on id = 1; updates target that row.
-- Written server-side by /admin/settings actions; reads are server-side
-- via getSiteSettings() in src/lib/site-settings.ts.

create table if not exists public.site_settings (
  id         integer     primary key check (id = 1),
  timezone   text        not null default 'Europe/Brussels',
  updated_at timestamptz not null default now()
);

-- Seed the singleton row on first apply; no-op on subsequent runs.
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon;
revoke all on public.site_settings from authenticated;
