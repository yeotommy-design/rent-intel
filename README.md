# RentIntel Prototype

Static prototype for RentIntel, a Singapore retail rent intelligence platform.

Strategy note:

- Free public product rewrite plan: `free-product-rewrite-plan.md`
- June 1, 2026 soft-launch checklist: `launch-checklist-june-1-2026.md`
- Missing coverage tracker: `missing-coverage-list.md`

## Local app server

The project now includes a lightweight Node server for local auth and static-site serving.

Run it from the project root:

```bash
npm start
```

Useful release checks:

```bash
npm run audit:search
```

```bash
npm run consolidate:sample-data
```

```bash
npm run verify:production
```

Then open:

```text
http://127.0.0.1:4173
```

What it supports today:

- Serves the static prototype pages from one local app server
- `GET /api/sources/asking-feed`
- `POST /api/members/login/request-code`
- `POST /api/members/login/verify-code`
- `GET /api/members/me`
- `POST /api/members/logout`
- `GET /api/members/reports`
- `POST /api/members/reports`
- `DELETE /api/members/reports/:recordId`
- `GET /api/members/watchlist`
- `POST /api/members/watchlist`
- `DELETE /api/members/watchlist/:recordId`
- `POST /api/members/alerts`
- `POST /api/members/preferences`
- `POST /api/members/promo/apply`
- `POST /api/members/activation-requests`
- `GET /api/members/roles/audit`
- `POST /api/members/roles`
- `GET /api/admin/ops-report`
  Returns counts plus operational summaries for member access, alert delivery health, source sync/freshness, coverage review queue, and latest backend handoff status
- `GET /api/members/alerts/deliveries`
- `GET /api/members/alerts/messages`
- `POST /api/members/alerts/queue-delivery`
- `GET /api/members/alerts/delivery-runs`
- `POST /api/members/alerts/delivery-runs`
- `GET /api/members/alerts/admin-actions`
- `POST /api/members/alerts/admin-actions`
- `POST /api/sources/sync-runs`
- `GET /api/sources/asking-candidates`
- `POST /api/sources/asking-candidates`
- `POST /api/sources/asking-feed/refresh`
- `GET /api/sources/coverage-requests`
- `PATCH /api/sources/coverage-requests/:candidateId/classification`
- `POST /api/sources/coverage-requests/:candidateId/qa-decision`
- `POST /api/sources/coverage-requests/:candidateId/sample-record`
- `GET /api/sources/production-evidence`
- `POST /api/sources/production-evidence`
- `GET /api/backend/handoff-audit`
- `POST /api/backend/handoff-audit`
- `GET /api/sources/sync-schedule`
- `POST /api/sources/sync-schedule`
- `POST /api/sources/freshness-policy`
- `POST /api/sources/freshness-breach-events`

Current auth persistence:

- Members seed from `data/rentintel-members.json`
- SQLite-backed prototype state persists to `backend/data/prototype.sqlite`
- A JSON mirror is also written to `backend/data/prototype-db.json` for inspection and backup
- In local prototype mode, the API response exposes a debug login code so the UI can complete sign-in without an email sender
- Core member/auth, member-admin, delivery, and source-ops state is now normalized into dedicated SQLite tables for members, login codes, sessions, saved reports, watchlist areas, alert rules, notification preferences, promo codes, activation requests, role audit, asking-source candidates, coverage sample records, source review history, sync runs, sync schedule, freshness policy, freshness breach events, production evidence, backend handoff audit, alert deliveries, delivery runs, admin actions, and delivered messages, while the JSON mirror remains for inspection
- The busiest member flows now read and write those SQLite tables directly for auth, `/members/me`, saved reports, watchlist, alert rules, notification preferences, activation requests, promo redemption, role audit, and admin ops reporting
- Source/admin workflows now also use direct SQLite route reads and transactional writes for source sync runs, sync schedule, freshness policy, freshness breach events, asking-source candidates, coverage requests, production evidence, and backend handoff audit
- SQLite schema versions are tracked in `schema_migrations`

Current alert-delivery transport:

- Default mode is local file delivery with JSON and `.eml` artifacts in `backend/data/alert-deliveries/`
- Set `RENTINTEL_EMAIL_TRANSPORT=smtp` and `RENTINTEL_SMTP_URL` to enable real SMTP delivery
- Optional SMTP auth: `RENTINTEL_SMTP_USER`, `RENTINTEL_SMTP_PASS`
- Sender identity: `RENTINTEL_EMAIL_FROM`
- `GET /api/health` now reports the active email transport mode

Current source-ops persistence:

- Asking-rent feed state persists to the SQLite-backed prototype store with a JSON mirror
- Source sync runs persist to the SQLite-backed prototype store with a JSON mirror
- Asking-source candidates and coverage sample records persist to the SQLite-backed prototype store with a JSON mirror
- Production evidence and controlled-release log persist to the SQLite-backed prototype store with a JSON mirror
- Source sync schedule and freshness policy persist to the SQLite-backed prototype store with a JSON mirror
- Freshness breach events persist to the SQLite-backed prototype store with a JSON mirror
- Delivered alert message artifacts persist to `backend/data/alert-deliveries/`

## What is included

- Daily free-user rent insight ticker
- Search button and query flow
- Free result card with rent signal and confidence label
- Paid preview card for historical S$/psf transaction trends
- Canvas chart for official median rent versus asking median rent
- Method section showing the future data-sync logic

## Data status

The prototype now has a connected manual pilot asking-rent layer, but it is not a licensed production feed. Official benchmark data remains sample data. The production sync contract lives in `data/sources/`.

Source contract files:

- `data/sources/rentintel-source-contract.json`
- `data/sources/asking-rent-feed.json`
- `data/sources/onemap-enrichment.js`
- `data/sources/field-map.json`
- `data/sources/sync-plan.md`
- `data/sources/backend-schema.sql`
- `data/sources/backend-api-contract.json`

A production build should sync:

- URA retail rental analysis and street-level retail rent statistics
- HDB commercial stock and HDB existing building datasets
- OneMap geocoding, planning-area, and postal-code APIs
- Licensed listing feeds for current asking rent
- Manual classification tables for malls, shophouses, HDB retail, and other private retail

Member data should use the RentIntel application database:

- `members`
- `login_codes`
- `sessions`
- `saved_reports`
- `watchlist_areas`
- `alert_rules`
- `notification_preferences`
- `activation_requests`
- `asking_source_candidates`
- `source_sync_runs`
- `asking_source_production_evidence`
- `backend_handoff_audit`
- `promo_codes`
- `member_alert_delivered_messages`

Important rule: official transaction-backed benchmark rent, current asking-rent estimates, geospatial enrichment, and member-owned data must remain separate source layers.

Open `index.html` directly in a browser to view the prototype.

If you want to test the backend auth flow, use the local app server instead of opening `index.html` directly.

## Release guardrails

Before production deploys:

- Run `npm run audit:search`
- Resolve any exact-title, base-title, or exact-alias regressions first

After production deploys:

- Run `npm run verify:production`
- Spot-check these live queries:
  - `Thomson Plaza`
  - `Palais Renaissance`
  - `Seah Street`
  - `Liat Towers`
  - `Cuppage annexe`
  - `Cuppage Rise annexe retail`
  - `Chinatown shophouse retail`
  - `Tampines Mall retail`
