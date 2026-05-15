# RentIntel Free Public Rewrite Plan

## Goal

Shift RentIntel from an early subscription-shaped prototype into a free public rent intelligence product.

Near-term product rule:

- Public discovery and decision support stays open
- Internal source QA, release control, and ops stay gated
- Login becomes optional convenience, not the main value gate

This plan is meant to simplify the current product without throwing away the backend and ops work already completed.

## Positioning

Recommended public positioning:

- "Free Singapore rent intelligence for faster property decisions."

Core promise:

- Search an area
- Check whether asking rent looks fair
- Review supporting signal context
- Track area changes over time

Primary users to serve first:

- Tenants
- Small landlords
- Agents and brokers
- Small investors
- Operators comparing neighborhoods

## Product Direction

### What RentIntel should be now

- A free public utility for checking rent signals
- A repeat-use destination for area snapshots and market movement
- A trust-building platform that earns future report demand

### What RentIntel should not be now

- A hard-paywalled subscription product
- A membership funnel before traffic exists
- A pricing-first landing experience

## Rewrite Priorities

### Stage 1: Remove paid-product framing

Files most affected:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-account.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/styles.css`

Changes:

- Remove or soften `Workspace`, `Pro`, `planned`, and subscription-style upgrade language
- Replace pricing cards with free-access explanation and optional save-alerts messaging
- Change "Members Login" framing to something like `Saved Alerts` or `My RentIntel`
- Remove payment-adjacent wording such as "payment setup comes later"

### Stage 2: Make public intelligence the center of the product

Files most affected:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/app.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/styles.css`

Changes:

- Promote the public search/result experience as the main product
- Expand area pages, trend summaries, and "what changed" modules
- Add stronger public trust and source-freshness explanation
- Make "coverage queue" feel like public roadmap participation, not a failed lookup

### Stage 3: Reframe account features as optional retention tools

Files most affected:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-account.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/auth-client.js`

Changes:

- Rename the member area to an optional personal workspace, not paid access
- Keep saved reports, watchlist, alerts, and history as optional convenience features
- Keep admin-only routing only for internal workflows
- Remove activation and promo flows from the main visitor journey

### Stage 4: Keep internal ops strong

Files most affected:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/admin/ops/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/admin-ops.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/admin/coverage/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/server.js`

Changes:

- Keep source QA, sync, release, and freshness tools behind admin access
- Continue using the admin dashboard as the internal control tower
- Treat admin tooling as operational infrastructure, not user-facing monetization

## Keep / Remove / Repurpose

### Keep

- Public search flow
- Public result cards and confidence signals
- Asking-rent feed refresh workflow
- OneMap enrichment
- Coverage request intake
- Source freshness and ops dashboards
- Saved reports, watchlist, and alerts as optional retention features
- SQLite-backed backend and admin ops reporting

### Remove or de-emphasize

- Pricing plan cards
- Subscription framing
- Activation-request-first journey
- Promo-code-first access path
- Language that suggests users need to pay to get basic product value

### Repurpose

- `members/account/`
  Shift from paid-membership gate to optional saved-items and alerts hub

- `members/toolbench/`
  Keep as a deeper analysis workspace, but stop implying it is locked behind a paid plan during this stage

- Watchlist
  Reframe as saved areas

- Saved reports
  Reframe as bookmarked checks or saved briefs

- Alerts
  Reframe as free update notifications later, even if email is not turned on yet

- Roles and admin flows
  Keep only for internal control and QA

## Page-by-Page Rewrite Plan

### Homepage

File:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/index.html`

Rewrite goals:

- Make the homepage clearly free
- Reduce references to "preview" if the core product is open
- Make the hero about speed, confidence, and trust
- Highlight search, public trends, and updated areas

Suggested changes:

- Change the top-right button label from `Members Login` to `Saved Alerts` or `My RentIntel`
- Replace `Free public preview` with stronger free-access language
- Add a section for:
  - latest updated areas
  - strongest asking-rent changes
  - most requested coverage additions

### Account Page

File:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`

Rewrite goals:

- Stop presenting this page as the main gateway to product value
- Make it an optional account hub
- Remove the pricing/comparison feel

Suggested changes:

- Rename title from `RentIntel Members Account` to `My RentIntel` or `Saved Alerts & Reports`
- Replace pricing cards with:
  - what gets saved here
  - what stays public
  - what admin tools are internal only
- Hide or remove activation-plan UI from default prototype flow
- Keep login only for save/history convenience

### Toolbench

Files:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/toolbench/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-toolbench.js`

Rewrite goals:

- Reframe from premium workspace to deeper analysis mode
- Keep it available for product testing without heavy access friction

Suggested changes:

- Change "Open Workspace" language to "Open Analysis Workspace"
- Treat it as an advanced view, not a paid-only upgrade

### Admin Ops

Files:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/admin/ops/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/admin-ops.js`

Rewrite goals:

- No major product rewrite needed
- Keep as internal-only
- Continue improving source health, release, and delivery controls

## Member System Simplification Plan

### Keep active

- Sessions
- Saved reports
- Watchlist areas
- Alert rules
- Notification preferences
- Admin roles

### Move out of the main user journey

- Promo-code application
- Activation-request messaging
- Subscription-status framing
- Plan selection (`Workspace`, `Pro`)

### Future role of login

Login should become:

- save my areas
- save my checks
- optionally receive updates

Login should not currently mean:

- pay to unlock core value
- request activation before using RentIntel

## Suggested Build Order

### Build 1

Rewrite homepage copy and header labels around free public access

### Build 2

Rewrite account page from pricing/membership framing to optional saved-items hub

### Build 3

Remove activation and promo emphasis from `member-account.js`

### Build 4

Reframe toolbench copy from paid workspace to advanced analysis workspace

### Build 5

Add public content modules:

- latest updates
- area movers
- coverage requests
- source freshness summary

## Metrics to Watch Before Monetization

Primary signals:

- monthly users
- returning users
- repeat searches per user
- saved areas
- saved reports
- coverage requests
- report/download demand

Practical early read:

- Under 1,000 monthly users: still discovery
- 1,000 to 5,000: promising
- 5,000 to 20,000: good enough to test demand signals
- 20,000 plus: strong foundation for premium reports or sponsorship

## Recommended Immediate Next Build

Start with the smallest high-leverage rewrite:

1. Homepage header/button copy
2. Homepage free-access messaging
3. Account page title and pricing-section rewrite

That gets RentIntel visibly aligned with the new strategy before we do deeper logic cleanup.
