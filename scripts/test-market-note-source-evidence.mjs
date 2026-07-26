import assert from "node:assert/strict";
import {
  evaluateMarketNoteSource,
  sourceCaptureSignature
} from "./market-note-source-evidence.mjs";

const freshFeed = {
  version: "capture-2026-07-20",
  updatedAt: "2026-07-20",
  records: [
    {
      recordId: "test-area",
      capturedAt: "2026-07-20",
      asking: 12,
      latestAskingMedian: 12.2,
      listingCount: 5
    }
  ]
};

const freshUnused = evaluateMarketNoteSource({
  askingFeed: freshFeed,
  latestNote: {
    publishedAt: "2026-07-13",
    sourceEvidence: {
      captureSignature: "older-capture"
    }
  },
  targetDate: "2026-07-27"
});
assert.equal(freshUnused.eligible, true);
assert.equal(freshUnused.ageDays, 7);

const reused = evaluateMarketNoteSource({
  askingFeed: freshFeed,
  latestNote: {
    publishedAt: "2026-07-20",
    sourceEvidence: {
      captureSignature: sourceCaptureSignature(freshFeed)
    }
  },
  targetDate: "2026-07-27"
});
assert.equal(reused.eligible, false);
assert.equal(reused.reused, true);

const stale = evaluateMarketNoteSource({
  askingFeed: {
    ...freshFeed,
    version: "capture-2026-06-24",
    updatedAt: "2026-06-24",
    records: freshFeed.records.map((record) => ({
      ...record,
      capturedAt: "2026-06-24"
    }))
  },
  latestNote: null,
  targetDate: "2026-07-27"
});
assert.equal(stale.eligible, false);
assert.equal(stale.stale, true);
assert.equal(stale.ageDays, 33);

const missing = evaluateMarketNoteSource({
  askingFeed: { records: [] },
  latestNote: null,
  targetDate: "2026-07-27"
});
assert.equal(missing.eligible, false);
assert.match(missing.reasons.join(" "), /no approved capture date/);

console.log("Market Note source-evidence tests passed.");
