# RentIntel Toolbench Preview PR Handoff

Current recommendation: open a preview-focused PR first, do not merge directly to production yet.

## Goal

Ship the upgraded `members/toolbench` workspace to a preview deployment so the real site route can be validated before merge.

Target route to verify in preview:

- `/members/toolbench/`

Current production gap:

- production route loads, but it is still serving older assets and does not expose the upgraded queue-lane workflow
- current production asset signatures observed:
  - `styles.css?v=20260510-syncschedule`
  - `member-toolbench.js?v=20260510-feedhardening`

Expected upgraded asset signatures:

- `styles.css?v=20260603-filehandoff`
- `member-toolbench.js?v=20260603-filehandoff`

## Recommended branch / PR shape

Suggested branch name:

- `toolbench-preview-upgrade`

Suggested PR title:

- `Upgrade members toolbench workflow and replay recovery for preview validation`

Suggested PR goal statement:

- Upgrade the RentIntel members toolbench route to the new queue-lane workflow, recovery-target behavior, replay history, and preview diagnostics so the actual site route can be validated in preview before merge.

## Files to include in the preview PR

Primary files:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/toolbench/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/member-toolbench.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/styles.css`

Supporting files that are reasonable to include when preparing the preview PR:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/server.js`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/members/account/index.html`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/README.md`
- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel/toolbench-merge-readiness.md`

## Files to keep out of this PR

These are unrelated or broader-scope changes and should not ride along with the toolbench preview PR unless explicitly intended:

- market notes content updates
- sitemap updates
- `data/market-notes.json`
- `market-notes.html`
- `market-notes/...`
- broad sample-data batch additions under `data/rentintel-sample-data-batch-*`
- unrelated source-contract/schema additions unless the preview deployment truly needs them

## Working-tree reality

Current modified tracked files in the repo include unrelated content, so the PR should be intentionally scoped rather than opened from a blanket commit.

Relevant changed files for this preview lane currently include:

- `README.md`
- `member-toolbench.js`
- `members/account/index.html`
- `members/toolbench/index.html`
- `server.js`
- `styles.css`

## Suggested staging commands

Run from:

- `/Users/tommyyeo/Desktop/VerseIntel.nosync/rent-intel`

Create the preview branch:

```bash
git checkout -b toolbench-preview-upgrade
```

Stage only the toolbench-preview files:

```bash
git add members/toolbench/index.html member-toolbench.js styles.css server.js members/account/index.html README.md toolbench-merge-readiness.md toolbench-preview-pr-handoff.md
```

Double-check staged scope:

```bash
git diff --cached --name-only
```

Suggested commit message:

```bash
git commit -m "Upgrade toolbench workflow for preview validation"
```

Push branch:

```bash
git push -u origin toolbench-preview-upgrade
```

## Suggested PR description

Summary:

- upgrades the members toolbench route to the new queue-lane workflow
- adds recovery-target continuity across open/focus/plan/follow actions
- adds recent lane replay with grouped shortcuts, dismiss, clear, undo, and undo expiry
- adds local preview handoff and diagnostics support

Why this is a preview PR:

- local toolbench is ahead of the live site
- production `/members/toolbench/` is still on an older asset set
- preview validation is required before merge

Key user-facing changes:

- smarter lane reopen behavior
- consistent recovery-target actions
- resumable recent lane replay
- safer replay cleanup with undo countdown

## Preview acceptance checklist

Verify on the preview deployment:

1. Open `/members/toolbench/`.
2. Confirm the route is serving the upgraded asset versions.
3. Confirm these controls are present:
   - `Bookmark lane`
   - `Open highest-priority lane`
   - `Follow recovery target`
   - `Recent lane replay`
   - `Undo`
4. Log in with a real member session.
5. Save an attention lane.
6. Reopen the saved lane.
7. Reset the queue lens.
8. Confirm replay chip appears.
9. Replay the lane from the chip.
10. Clear replay history.
11. Undo the clear.
12. Dismiss one replay chip.
13. Undo the dismiss.
14. Confirm undo countdown expires cleanly.
15. Confirm no new console/runtime errors appear.

## Merge gate after preview

Only merge when all are true:

- preview route serves the upgraded toolbench assets
- real member-session acceptance pass succeeds
- no new preview regressions appear
- rollout decision is explicit
