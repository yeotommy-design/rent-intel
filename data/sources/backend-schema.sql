-- RentIntel backend starter schema
-- Target: Postgres / Supabase-compatible SQL
-- Purpose: move member auth, saved reports, alerts, source intake, and handoff audit
-- from prototype localStorage into database tables.

create extension if not exists pgcrypto;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  member_status text not null default 'Waitlist email',
  subscription_status text not null default 'Waiting for member activation',
  access text not null default 'waitlist',
  member_role text not null default 'member',
  tools_enabled boolean not null default false,
  promo_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint members_access_check check (access in ('waitlist', 'active', 'promo', 'none')),
  constraint members_role_check check (member_role in ('member', 'admin'))
);

create table if not exists public.login_codes (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  session_hash text not null unique,
  access text not null,
  tools_enabled boolean not null default false,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  access text not null default 'promo',
  description text,
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer,
  redeemed_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.member_saved_reports (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  record_id text not null,
  title text not null,
  decision text,
  asking numeric(10, 2),
  official numeric(10, 2),
  gap integer,
  decision_pack jsonb not null default '{}'::jsonb,
  negotiation_note text,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_email, record_id)
);

create table if not exists public.member_watchlist_areas (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  record_id text not null,
  area text not null,
  added_at timestamptz not null default now(),
  unique (member_email, record_id)
);

create table if not exists public.member_alert_rules (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  record_id text not null,
  area text,
  title text,
  trigger text not null,
  target_psf numeric(10, 2),
  gap_limit integer,
  cadence text not null default 'daily',
  condition text,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_email, record_id, trigger),
  constraint alert_trigger_check check (
    trigger in ('asking-falls-to-target', 'gap-above-limit', 'benchmark-changed', 'source-connected')
  ),
  constraint alert_cadence_check check (cadence in ('daily', 'weekly', 'source-refresh'))
);

create table if not exists public.member_alert_deliveries (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  record_id text not null,
  alert_rule_id uuid references public.member_alert_rules(id) on delete set null,
  subject text not null,
  message text not null,
  trigger text not null,
  cadence text not null,
  status text not null default 'queued',
  delivery_channel text not null default 'email',
  delivery_payload jsonb not null default '{}'::jsonb,
  queued_at timestamptz not null default now(),
  sent_at timestamptz,
  skipped_at timestamptz,
  skip_reason text,
  constraint alert_delivery_status_check check (status in ('preview', 'queued', 'sent', 'skipped', 'failed', 'acknowledged', 'dead-letter', 'suppressed')),
  constraint alert_delivery_channel_check check (delivery_channel in ('email', 'dashboard', 'webhook'))
);

create table if not exists public.member_alert_delivery_runs (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  run_id text not null,
  total_queued integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  skipped_count integer not null default 0,
  outcomes_payload jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz not null default now()
);

create table if not exists public.member_alert_delivered_messages (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  run_id text,
  record_id text not null,
  subject text not null,
  delivery_channel text not null default 'email',
  transport_mode text not null default 'file',
  from_email text,
  artifact_path text,
  raw_email_path text,
  provider_response text,
  preview_text text,
  delivery_payload jsonb not null default '{}'::jsonb,
  delivered_at timestamptz not null default now(),
  constraint member_alert_delivered_messages_channel_check check (
    delivery_channel in ('email', 'dashboard', 'webhook')
  ),
  constraint member_alert_delivered_messages_transport_check check (
    transport_mode in ('file', 'smtp')
  )
);

create table if not exists public.member_alert_delivery_admin_log (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  action_type text not null,
  record_id text not null,
  area text,
  title text,
  from_status text,
  to_status text,
  retry_count integer not null default 0,
  max_retries integer not null default 0,
  reason text,
  action_payload jsonb not null default '{}'::jsonb,
  acted_at timestamptz not null default now(),
  constraint member_alert_delivery_admin_action_type_check check (
    action_type in ('requeue', 'resend', 'acknowledge', 'suppress', 'dead-letter', 'skip', 'worker')
  )
);

create table if not exists public.member_role_audit_log (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade,
  actor_email text,
  target_email text not null,
  previous_role text not null default 'member',
  next_role text not null,
  reason text,
  audit_payload jsonb not null default '{}'::jsonb,
  acted_at timestamptz not null default now(),
  constraint member_role_audit_previous_role_check check (previous_role in ('member', 'admin')),
  constraint member_role_audit_next_role_check check (next_role in ('member', 'admin'))
);

create table if not exists public.member_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  member_email text not null references public.members(email) on delete cascade unique,
  daily_brief boolean not null default true,
  activation_updates boolean not null default true,
  watchlist_alerts boolean not null default false,
  source_sync_alerts boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_activation_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  plan text,
  use_case text,
  status text not null default 'pending review',
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text,
  constraint activation_status_check check (status in ('pending review', 'approved', 'rejected'))
);

create table if not exists public.asking_source_candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  status text not null default 'candidate review',
  submitted_by text,
  requested_query text,
  requested_area text,
  requested_property_type text,
  requested_use_case text,
  requested_urgency text,
  request_email text,
  source text not null default 'member-account',
  coverage_eligibility_status text,
  coverage_eligibility_reason text,
  source_classification text,
  coverage_qa_decision text,
  sample_record_id text,
  request_payload jsonb not null default '{}'::jsonb,
  qa_payload jsonb not null default '{}'::jsonb,
  reviewed_by text,
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  classification_reviewed_at timestamptz,
  qa_reviewed_at timestamptz,
  production_ready_at timestamptz,
  constraint asking_source_status_check check (
    status in ('pending review', 'candidate review', 'manual review', 'approved for pilot', 'rejected', 'production ready')
  ),
  constraint asking_source_classification_check check (
    source_classification is null or source_classification in (
      'retail-direct',
      'retail-comparable',
      'non-retail',
      'out-of-scope',
      'needs-source'
    )
  ),
  constraint asking_source_qa_decision_check check (
    coverage_qa_decision is null or coverage_qa_decision in ('pass', 'needs work', 'reject')
  )
);

create table if not exists public.coverage_sample_records (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.asking_source_candidates(id) on delete cascade,
  record_id text not null unique,
  title text not null,
  area text not null,
  property_type text not null,
  public_trust_level text not null default 'Sample',
  source_summary text,
  sample_payload jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  released_at timestamptz,
  constraint coverage_sample_trust_check check (
    public_trust_level in ('Sample', 'Pilot Verified', 'Production Verified')
  )
);

create table if not exists public.source_review_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.asking_source_candidates(id) on delete cascade,
  action text not null,
  from_status text,
  to_status text,
  reviewer_email text,
  reviewer_note text,
  review_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.source_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text,
  source_key text,
  benchmark_layer text,
  records_checked integer not null default 0,
  status text not null,
  run_payload jsonb not null default '{}'::jsonb,
  ran_at timestamptz not null default now()
);

create table if not exists public.source_sync_schedule (
  id uuid primary key default gen_random_uuid(),
  source_name text not null unique,
  enabled boolean not null default true,
  cadence text not null default 'daily',
  run_hour_sgt integer not null default 8,
  next_run_at timestamptz,
  last_run_at timestamptz,
  last_run_status text,
  last_run_mode text,
  updated_by text,
  updated_at timestamptz not null default now(),
  note text,
  constraint source_sync_schedule_cadence_check check (cadence in ('daily', '12h')),
  constraint source_sync_schedule_hour_check check (run_hour_sgt >= 0 and run_hour_sgt <= 23)
);

create table if not exists public.source_freshness_policy (
  id uuid primary key default gen_random_uuid(),
  fresh_max_days integer not null default 7,
  watch_max_days integer not null default 14,
  updated_by text,
  updated_at timestamptz not null default now(),
  note text,
  constraint source_freshness_policy_range_check check (fresh_max_days >= 1 and watch_max_days > fresh_max_days)
);

create table if not exists public.source_freshness_breach_events (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  freshness_state text not null,
  previous_freshness_state text,
  breach_at timestamptz not null default now(),
  queue_trigger text not null default 'freshness-breach',
  delivery_ids jsonb not null default '[]'::jsonb,
  event_payload jsonb not null default '{}'::jsonb,
  note text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.asking_source_production_evidence (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null,
  source_attached_at timestamptz not null,
  qa_log_at timestamptz,
  owner_reviewed_at timestamptz,
  evidence_ready boolean not null default false,
  pilot_connection_state text,
  pilot_source_name text,
  pilot_updated_at timestamptz,
  pilot_production_ready boolean not null default false,
  qa_summary jsonb not null default '{}'::jsonb,
  qa_rows jsonb not null default '[]'::jsonb,
  readiness_gate jsonb not null default '{}'::jsonb,
  source_trust jsonb not null default '{}'::jsonb,
  ops_review jsonb not null default '{}'::jsonb,
  exception_alerts jsonb not null default '{}'::jsonb,
  exception_alert_count integer not null default 0,
  release_status text not null default 'Not released',
  release_queued_at timestamptz,
  released_by text,
  handoff_tasks jsonb not null default '[]'::jsonb,
  controlled_release_next_step text,
  submitted_by text,
  submitted_at timestamptz not null default now(),
  released_at timestamptz,
  release_note text,
  rollback_at timestamptz,
  rollback_reason text,
  release_log jsonb not null default '{}'::jsonb
);

create table if not exists public.backend_handoff_audit (
  id uuid primary key default gen_random_uuid(),
  member_email text,
  contract text not null,
  version text not null,
  payload jsonb not null,
  validation_rows jsonb not null default '[]'::jsonb,
  summary text,
  generated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text
);

create index if not exists login_codes_member_email_idx on public.login_codes(member_email);
create index if not exists sessions_member_email_idx on public.sessions(member_email);
create index if not exists member_saved_reports_email_idx on public.member_saved_reports(member_email);
create index if not exists member_watchlist_email_idx on public.member_watchlist_areas(member_email);
create index if not exists member_alert_rules_email_idx on public.member_alert_rules(member_email);
create index if not exists member_alert_deliveries_email_idx on public.member_alert_deliveries(member_email, queued_at desc);
create index if not exists member_alert_deliveries_status_idx on public.member_alert_deliveries(status, queued_at desc);
create index if not exists member_alert_delivery_runs_email_idx on public.member_alert_delivery_runs(member_email, finished_at desc);
create index if not exists member_alert_delivery_admin_log_email_idx on public.member_alert_delivery_admin_log(member_email, acted_at desc);
create index if not exists member_role_audit_log_member_idx on public.member_role_audit_log(member_email, acted_at desc);
create index if not exists activation_requests_email_idx on public.member_activation_requests(email);
create index if not exists asking_source_candidates_status_idx on public.asking_source_candidates(status, submitted_at desc);
create index if not exists asking_source_candidates_query_idx on public.asking_source_candidates(requested_query);
create index if not exists coverage_sample_candidate_idx on public.coverage_sample_records(candidate_id);
create index if not exists source_review_history_candidate_idx on public.source_review_history(candidate_id, created_at desc);
create index if not exists source_sync_runs_source_idx on public.source_sync_runs(source_name, ran_at desc);
create index if not exists source_sync_schedule_source_idx on public.source_sync_schedule(source_name);
create index if not exists source_freshness_policy_updated_idx on public.source_freshness_policy(updated_at desc);
create index if not exists source_freshness_breach_events_source_idx on public.source_freshness_breach_events(source_name, breach_at desc);
create index if not exists asking_source_production_evidence_source_idx on public.asking_source_production_evidence(source_name, submitted_at desc);
create index if not exists backend_handoff_member_idx on public.backend_handoff_audit(member_email, generated_at desc);

-- Suggested Supabase RLS starting point:
-- alter table public.members enable row level security;
-- alter table public.member_saved_reports enable row level security;
-- alter table public.member_watchlist_areas enable row level security;
-- alter table public.member_alert_rules enable row level security;
-- alter table public.member_alert_deliveries enable row level security;
-- Policies should compare auth email/JWT claim to member_email before production use.
