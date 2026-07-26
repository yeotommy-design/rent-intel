create table if not exists public.rentintel_asking_feed_batches (
  batch_id text primary key,
  captured_at timestamptz,
  source_name text,
  source_type text,
  license_reference text,
  record_count integer not null default 0 check (record_count >= 0),
  warning_count integer not null default 0 check (warning_count >= 0),
  status text not null check (status in ('validated', 'rejected', 'promoted')),
  payload jsonb not null,
  qa jsonb not null,
  feed jsonb,
  signature_sha256 text,
  validated_at timestamptz not null default timezone('utc', now()),
  promoted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (status = 'promoted' and feed is not null and promoted_at is not null)
    or status <> 'promoted'
  )
);

create index if not exists rentintel_asking_feed_batches_status_promoted_idx
  on public.rentintel_asking_feed_batches (status, promoted_at desc);

create index if not exists rentintel_asking_feed_batches_captured_at_idx
  on public.rentintel_asking_feed_batches (captured_at desc);

alter table public.rentintel_asking_feed_batches enable row level security;

revoke all on table public.rentintel_asking_feed_batches from anon, authenticated;
grant select, insert, update, delete on table public.rentintel_asking_feed_batches to service_role;

comment on table public.rentintel_asking_feed_batches is
  'Server-only audit store for signed RentIntel asking-rent batches, QA results, and explicitly promoted feeds.';
