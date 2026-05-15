# RentIntel Data Sync Plan

RentIntel separates five data layers. The prototype still uses local sample files, but production sync should follow this contract.

## 1. Official Benchmark Layer

Source: URA Commercial Retail Rental Analysis.

Purpose:
- Transaction-backed retail rent benchmark.
- Historical official median rent series.
- Confidence based on benchmark coverage.

Target fields:
- `official`
- `series[][officialMedian]`
- `confidence`
- `sourceSummary`

Rule:
Official transaction-backed rent is the benchmark. It must not be replaced by listing asking rent.

## 2. HDB Commercial Context Layer

Source: HDB / data.gov.sg commercial datasets.

Purpose:
- HDB commercial property context.
- Classification support for HDB retail versus private retail.
- Additional comparable coverage notes.

Target fields:
- `propertyType`
- `area`
- `confidence`
- `sourceSummary`

## 3. OneMap Geospatial Layer

Source: OneMap.

Purpose:
- Address, postal code, planning area, and map enrichment.
- Search aliases and location normalisation.

Target fields:
- `aliases`
- `area`
- `postalCode`
- `planningArea`
- `map`

Rule:
Map and address data should enrich the rent record but never create or alter rent values.

## 4. Asking Rent Layer

Source: licensed listing feeds, verified agent input, tenant-submitted asking rent, or manual verified capture.

Purpose:
- Current asking-rent estimate.
- Listing-backed asking trend.
- Gap versus official benchmark.

Target fields:
- `asking`
- `series[][askingMedian]`
- `fairRange`
- `gap`
- `sourceSummary`

Rule:
Asking rent is an estimate. It must always be labelled separately from official benchmarks.

## 5. Member Data Layer

Source: RentIntel application database.

Purpose:
- Passwordless members list.
- Login code state.
- Secure session state.
- Saved reports.
- Watchlist areas.
- Promo access.

Target tables:
- `members`
- `login_codes`
- `sessions`
- `saved_reports`
- `watchlist_areas`
- `alert_rules`
- `alert_deliveries`
- `notification_preferences`
- `activation_requests`
- `asking_source_candidates`
- `source_sync_runs`
- `asking_source_production_evidence`
- `backend_handoff_audit`
- `promo_codes`

Starter schema:
- `data/sources/backend-schema.sql`

Starter API contract:
- `data/sources/backend-api-contract.json`

Rule:
Member data is private application data and should not be mixed into public benchmark records.

## Production Build Order

1. Replace `data/rentintel-members.json` with a real `members` database table.
2. Replace local login-code simulation with backend-generated email codes.
3. Replace browser storage for saved reports and watchlists with database tables.
4. Persist production asking-source evidence, QA rows, readiness gate, and source-owner review before setting any asking feed as production-ready.
5. Add source ingestion jobs for URA, HDB, OneMap, and asking-rent feeds.
6. Add record-level `sourceStatus`, `lastSyncedAt`, and `confidenceBreakdown`.
