import assert from "node:assert/strict";
import { buildSourceHealth } from "./update-source-health.mjs";

const status = {
  status: [{
    sourceId: "asking-rent-feed",
    lastCompletedAt: "2026-06-24"
  }]
};

const healthy = buildSourceHealth({
  feed: { updatedAt: "2026-07-25", records: [] },
  sourceStatus: status,
  now: new Date("2026-07-26T01:15:00.000Z")
});
assert.equal(healthy.monitorState, "healthy");
assert.equal(healthy.captureAgeDays, 1);
assert.equal(healthy.consecutiveOverdueChecks, 0);

const warning = buildSourceHealth({
  feed: { updatedAt: "2026-07-15", records: [] },
  sourceStatus: status,
  now: new Date("2026-07-26T01:15:00.000Z")
});
assert.equal(warning.monitorState, "warning");
assert.equal(warning.captureAgeDays, 11);

const overdue = buildSourceHealth({
  feed: { updatedAt: "2026-06-24", records: [] },
  sourceStatus: status,
  previous: { consecutiveOverdueChecks: 2 },
  now: new Date("2026-07-26T01:15:00.000Z")
});
assert.equal(overdue.monitorState, "overdue");
assert.equal(overdue.captureAgeDays, 32);
assert.equal(overdue.consecutiveOverdueChecks, 3);

const missing = buildSourceHealth({
  feed: {},
  sourceStatus: {},
  now: new Date("2026-07-26T01:15:00.000Z")
});
assert.equal(missing.monitorState, "missing");
assert.equal(missing.captureAgeDays, null);

console.log("Source health monitor tests passed.");
