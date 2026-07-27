import assert from "node:assert/strict";
import {
  buildBenchmark,
  normalizeRetailRows,
  updateSourceStatus
} from "./sync-ura-commercial-rental-index.mjs";

const records = [
  { quarter: "2025-Q2", property_type: "retail", index: "79.4" },
  { quarter: "2026-Q1", property_type: "retail", index: "80.1" },
  { quarter: "2026-Q2", property_type: "office", index: "201.8" },
  { quarter: "2026-Q2", property_type: "retail", index: "80.6" }
];
assert.deepEqual(normalizeRetailRows(records).at(-1), {
  quarter: "2026-Q2",
  index: 80.6
});

const benchmark = buildBenchmark({
  records,
  metadata: {
    managedBy: "Urban Redevelopment Authority",
    lastUpdatedAt: "2026-07-27T09:40:03+08:00",
    coverageEnd: "2026-06-30T08:00:00+08:00"
  },
  syncedAt: new Date("2026-07-27T02:00:00.000Z")
});
assert.equal(benchmark.latestPeriod, "2026-Q2");
assert.equal(benchmark.latestRetailIndex, 80.6);
assert.equal(benchmark.quarterChangePercent, 0.6);
assert.equal(benchmark.yearChangePercent, 1.5);
assert.match(benchmark.safeUse, /not S\$\/psf/);

const status = updateSourceStatus({
  status: [{
    sourceId: "ura-commercial-retail-rental-analysis",
    currentState: "contract-ready"
  }]
}, benchmark);
assert.equal(status.status[0].currentState, "live-official-index-connected");
assert.equal(status.status[0].displayTimestamp, "Latest release: 2026 Q2");
assert.equal(status.status[0].healthState, "fresh");

console.log("URA commercial rental index tests passed.");
