# RentIntel Source Refresh Workflow

Weekly review anchor:
- Every `Monday`
- `09:00 AM` Singapore time
- Automation: `RentIntel Weekly Source Update Review`

Daily freshness watch:
- Automation: `Vercel Cron` calls the read-only RentIntel source-health endpoint
- Schedule: `09:10 AM` Singapore time
- Purpose: specifically monitor the asking-rent pilot feed for stale age and capture gaps
- Public status: `/api/sources/health` calculates the current state whenever the page checks it
- Fallback: generated source-health files keep the last known status visible if the live check is unavailable
- Daily record: Vercel keeps the scheduled function run in the project logs
- Safety: read-only; the monitor never changes or invents asking-rent values

Production asking-rent ingestion gate:
- Endpoint: `POST /api/admin/asking-feed/ingest`
- Default mode: validate a signed provider batch without changing the active feed
- Authentication: HMAC signature using `RENTINTEL_ASKING_FEED_WEBHOOK_SECRET`
- Required checks: source rights, capture age, unique record IDs, psf ranges, listing counts, and evidence references
- Promotion lock: a batch cannot be promoted until both controlled promotion and durable storage are explicitly enabled
- Vercel safety: the current temporary function filesystem is never treated as durable promotion storage
- Retired path: `/api/sources/asking-feed/refresh` no longer changes rent figures
- Safety: the ingestion gate never calculates substitute values or advances a capture date by itself

## Source-by-source workflow

### Asking rent feed
- Target cadence: `Daily`
- Current mode: `Pilot manual feed`
- What updates it: only a future signed licensed or verified provider batch after QA
- Weekly Monday review:
  - check last completed capture date
  - confirm stale age against SLA
  - validate a signed provider batch without promoting it
  - record whether licensed-feed or QA-log production readiness is still missing
- Escalate when:
  - stale age exceeds the daily freshness target
  - capture coverage is shrinking
  - QA evidence is missing

### URA benchmark
- Target cadence: `Quarterly`
- Current mode: `Live official quarterly retail-index feed`
- What updates it: data.gov.sg URA commercial rental index under the Singapore Open Data Licence
- Weekly Monday review:
  - automatically check whether a new quarter is available
  - import and deploy only when the official retail-index series changes
  - keep this global trend index separate from S$/psf, area-level benchmarks, and current asking rents
- Escalate when:
  - a new quarter is available but not yet ingested
  - benchmark logic and public card language drift out of sync

### HDB commercial context
- Target cadence: `Monthly or when updated`
- Current mode: `Contract-ready, sample-only`
- What updates it: source mapping of HDB commercial datasets into comparable context
- Weekly Monday review:
  - check whether HDB commercial context fields changed
  - refresh only when a real upstream update exists
  - confirm property-type and comparable-context mapping still makes sense
- Escalate when:
  - HDB classifications are outdated
  - retail-type mapping is incomplete

### OneMap
- Target cadence: `On search with nightly cache`
- Current mode: `Contract-ready enrichment`
- What updates it: live search enrichment plus cache refresh
- Weekly Monday review:
  - test sample searches
  - confirm planning-area, address, and postal lookups still resolve
  - confirm the cache path is healthy
- Escalate when:
  - lookups fail
  - planning-area or postal context disappears
  - cache misses become excessive

### Member data
- Target cadence: `Real time`
- Current mode: `Prototype storage / backend transition`
- What updates it: user interactions, saved reports, sessions, and watchlist activity
- Weekly Monday review:
  - verify sign-in
  - verify saved-report writes
  - verify watchlist or account writes
  - confirm no batch refresh expectation is implied
- Escalate when:
  - session flow breaks
  - writes stop persisting
  - member features behave like stale batch data instead of real-time state
