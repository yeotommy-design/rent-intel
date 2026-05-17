# RentIntel Soft Launch Checklist

Target launch:

- Monday, June 1, 2026

Readiness deadline:

- Sunday, May 31, 2026

Recommended freeze:

- Friday, May 29, 2026

## Launch Definition

RentIntel soft launch means:

- The public website is live on the real domain
- Visitors can understand what RentIntel does quickly
- Visitors can run a useful public rent check
- Trust, source, and coverage messaging are clear
- Internal admin and ops tools remain gated

This soft launch does **not** require:

- subscriptions
- paid plans
- production-grade monetization
- full premium report product
- complex member onboarding

## Launch Scope

### Must be live

- Public homepage
- Public search and result flow
- Coverage request flow
- Trust/source explanation
- About page
- Contact page
- Privacy page
- Disclaimer page
- Internal admin access still gated

### Can remain prototype/internal

- Member pricing logic
- Activation requests
- Promo-code journey
- Paid upgrade language
- Real mailbox setup for multiple accounts
- Premium downloadable reports

## Dated Plan

## May 14 to May 17

### Positioning reset

- Rewrite homepage for free public positioning
- Replace subscription-first language
- Change account-entry messaging from membership/paywall framing to optional saved tools framing
- Remove or soften `Workspace`, `Pro`, `planned`, and pricing-heavy language

Deliverables:

- Updated `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/index.html`
- Updated `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`
- Updated `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-account.js`

## May 18 to May 21

### Public product polish

- Improve public search clarity
- Improve result explanations and evidence language
- Tighten no-result and coverage-request experience
- Make trust/freshness copy more visible
- Review homepage flow on mobile

Deliverables:

- Cleaner public UX in `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/app.js`
- Supporting layout/style updates in `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/styles.css`

## May 22 to May 25

### Public launch essentials

- Finalize About, Contact, Privacy, Disclaimer content
- Connect domain and confirm routing
- Add analytics
- Add basic SEO metadata and title/description checks
- Confirm favicon/social basics if available

Deliverables:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/about.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/contact.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/privacy.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/disclaimer.html`

## May 26 to May 29

### QA and launch-hardening

- Test homepage, search, results, coverage request, and contact flow
- Test mobile responsiveness
- Test admin gating
- Review trust/source messaging for consistency
- Fix obvious broken links, stale copy, and launch-confusing flows

Deliverables:

- Bugfix pass across public pages
- Freeze-ready launch build

## May 30 to May 31

### Freeze and final checks

- No more feature expansion unless critical
- Only fix launch blockers
- Confirm public pages load cleanly
- Confirm domain resolves correctly
- Confirm analytics is capturing visits
- Confirm no exposed internal/admin tools in public navigation

Deliverables:

- Ready-to-launch soft release candidate

## June 1

### Soft launch

- Site live
- Monitor traffic and coverage requests
- Keep admin ops open for source and freshness checks
- Log immediate bugs and feedback, but avoid same-day feature churn

## Launch Checklist

### Product

- Homepage clearly explains RentIntel in under 10 seconds
- Search works for core example queries
- Result state is understandable
- Trust and source cues are visible
- Coverage request works

### Content

- About page is ready
- Contact page is ready
- Privacy page is ready
- Disclaimer page is ready
- Footer links are complete

### UX

- Mobile homepage is usable
- Search input and result actions are usable on mobile
- No subscription confusion in the main public flow
- Account page does not feel like a forced gate

### Technical

- Domain connected
- Server stable
- Analytics installed
- No broken public navigation
- Admin routes remain gated
- Run `npm run audit:search` before any production deploy
- Run `npm run verify:production` after any production deploy
- After deploy, production-check these queries:
  - `Thomson Plaza`
  - `Palais Renaissance`
  - `Seah Street`
  - `Liat Towers`
  - `Cuppage annexe`
  - `Cuppage Rise annexe retail`
  - `Chinatown shophouse retail`
  - `Tampines Mall retail`
- Confirm those production checks resolve to the expected direct records before closing the release

### Internal ops

- Admin ops dashboard works
- Asking-feed refresh works
- Coverage review tools work
- Source freshness view works

## Launch Risks

### Biggest risk: scope drift

Avoid before launch:

- rebuilding monetization
- polishing every member flow
- real email-account setup for nonessential paths
- over-designing premium/report products

### Main rule

If it helps a first-time public visitor understand and trust RentIntel, it is in scope.

If it mainly supports future subscription complexity, it is out of scope for June 1.

## Recommended Immediate Next Build

Implement the public-positioning reset first:

1. Homepage header and hero copy rewrite
2. Public/free messaging rewrite
3. Account page reframing away from pricing and activation-first language

## Suggested Working Cadence

- May 14 to May 25: build and rewrite
- May 26 to May 29: QA and launch tightening
- May 30 to May 31: freeze and critical fixes only

## Release Workflow

### Before deploy

- Run `npm run audit:search`
- Fix any exact-title, base-title, or exact-alias failures before shipping
- Review shared alias collisions if the release touched search, aliases, or coverage expansion

### After deploy

- Run `npm run verify:production`
- Re-check production for:
  - `Thomson Plaza`
  - `Palais Renaissance`
  - `Seah Street`
  - `Liat Towers`
  - `Cuppage annexe`
  - `Cuppage Rise annexe retail`
  - `Chinatown shophouse retail`
  - `Tampines Mall retail`
- Confirm the production bundle version and sample payload version changed as expected
- Do not treat the release as complete until those checks pass on the live domain

## Success Metric For Soft Launch

RentIntel is ready to soft launch when:

- a first-time visitor understands the product quickly
- can perform a useful rent check in under one minute
- sees enough trust context to believe the result
- and is not confused by subscriptions, locked features, or unfinished commercial flows
