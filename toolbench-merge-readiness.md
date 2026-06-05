# RentIntel Toolbench Merge Readiness

Current status: do not merge yet.

Why:

- Local `members/toolbench` workspace is far ahead of production.
- Production `https://rent-intel.com/members/toolbench/` is still serving the older asset set:
  - `styles.css?v=20260510-syncschedule`
  - `member-toolbench.js?v=20260510-feedhardening`
- The production page does not yet expose the newer queue-lane workflow controls such as:
  - `#workspaceV1RosterBookmarkLens`
  - `#workspaceV1RosterRecentActions`
  - `#workspaceV1RosterRecentActionsUndo`
  - `#workspaceV1RosterFollowRecoveryTarget`

## What is ready locally

- Queue-lane recovery behavior is consistent across:
  - open bookmark
  - open highest-priority lane
  - focus strongest / weakest
  - apply lane plan
  - follow recovery target
- Recent lane replay supports:
  - grouped replay chips
  - replay labels
  - action-type styling
  - per-chip dismiss
  - clear all
  - undo with countdown expiry
- Local regression checks passed for save/open/reset/replay/follow flows.
- `npm run audit:search` passed exact-title and alias checks.
- `npm run verify:production` passed all live public search checks against `https://rent-intel.com`.

## Files that must ship for the upgraded toolbench

Primary front-end files:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/toolbench/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-toolbench.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/styles.css`

Supporting files to review before release:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/server.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/README.md`

## Expected deployed asset signatures

The upgraded `/members/toolbench/` route should serve at least these current local references:

- stylesheet:
  - `styles.css?v=20260603-filehandoff`
- workspace script:
  - `member-toolbench.js?v=20260603-filehandoff`

Current production observation on `https://rent-intel.com/members/toolbench/`:

- stylesheet:
  - `styles.css?v=20260510-syncschedule`
- workspace script:
  - `member-toolbench.js?v=20260510-feedhardening`

This confirms the actual site is still serving an older workspace build.

## Merge gates

Do not merge until all of these are true:

1. A preview or staging deployment serves the new toolbench markup and assets.
2. The preview deployment exposes the new queue controls on `/members/toolbench/`.
3. A real member-session acceptance pass succeeds on that preview deployment.
4. No new console/runtime errors appear in the upgraded preview route.
5. Rollout decision is explicit:
   - internal / soft exposure first
   - or direct production exposure

## Preview acceptance checklist

Run on the preview deployment:

1. Open `/members/toolbench/`.
2. Confirm the page includes:
   - queue-lane sort controls
   - `Bookmark lane`
   - `Open highest-priority lane`
   - `Follow recovery target`
   - `Recent lane replay`
3. Log in with a real member session.
4. Save an attention lane.
5. Reopen the saved lane.
6. Reset the queue lens.
7. Confirm a replay chip appears.
8. Replay the lane from the chip.
9. Clear replay history.
10. Undo the clear.
11. Dismiss one replay chip.
12. Undo the dismiss.
13. Confirm undo countdown expires normally.

## Preview deployment prep

Current local environment notes:

- repo has GitHub origin:
  - `https://github.com/yeotommy-design/rent-intel.git`
- current branch:
  - `main`
- no local `.vercel` link is present in this repo
- `vercel` CLI is not currently installed in this workspace shell

Practical preview options:

1. If Git integration already powers the live site:
   - push the upgraded toolbench branch
   - let the hosting provider create a preview deployment
   - validate `/members/toolbench/` on that preview URL

2. If manual Vercel preview is preferred:
   - link this repo to the correct Vercel project
   - run a preview deploy from the repo root
   - validate `/members/toolbench/` on the preview URL before merge

Preview should not be accepted until the preview route exposes these controls:

- `Bookmark lane`
- `Open highest-priority lane`
- `Follow recovery target`
- `Recent lane replay`
- `Undo`

## Local verification already completed

- `node --check member-toolbench.js`
- local browser regression for:
  - save lane
  - open lane
  - reset lens
  - replay chip
  - clear replay
  - undo countdown
  - recovery follow action
- production route anonymous load check:
  - `https://rent-intel.com/members/toolbench/` returns `200`
  - current production route has no console/page errors on anonymous load

## Current blocker summary

The remaining blocker is deployment parity, not another known toolbench bug.

The local upgraded toolbench should be preview-deployed and member-tested in a real site environment before merge.
