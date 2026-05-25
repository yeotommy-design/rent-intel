# RentIntel Source Refresh Workflow

Weekly review anchor:
- Every `Monday`
- `09:00 AM` Singapore time
- Automation: `RentIntel Weekly Source Update Review`

Daily freshness watch:
- Automation: `Ask Feed Freshness`
- Purpose: specifically monitor the asking-rent pilot feed for stale age and capture gaps

## Source-by-source workflow

### Asking rent feed
- Target cadence: `Daily`
- Current mode: `Pilot manual feed`
- What updates it: manual pilot refresh or a future licensed / verified capture workflow
- Weekly Monday review:
  - check last completed capture date
  - confirm stale age against SLA
  - refresh the manual pilot if still being used
  - record whether licensed-feed or QA-log production readiness is still missing
- Escalate when:
  - stale age exceeds the daily freshness target
  - capture coverage is shrinking
  - QA evidence is missing

### URA benchmark
- Target cadence: `Quarterly`
- Current mode: `Contract-ready, sample-only`
- What updates it: authorised benchmark export or data-service ingestion
- Weekly Monday review:
  - confirm whether a new quarter or benchmark release is available
  - ingest only when a real new benchmark batch exists
  - otherwise keep the source marked as not yet live
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
