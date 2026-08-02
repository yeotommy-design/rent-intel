const assert = require("node:assert/strict");
const validator = require("../asking-feed-capture-validator.js");

const now = new Date("2026-08-02T08:00:00.000Z");
const payload = {
  batchId: "manual-asking-2026-08-02",
  capturedAt: "2026-08-02",
  source: {
    name: "RentIntel verified manual capture",
    type: "verified-manual-capture",
    licenseReference: "manual-capture-policy-2026-08",
    termsConfirmed: true
  },
  records: [{
    recordId: "macpherson-retail",
    asking: 13.2,
    latestAskingMedian: 13,
    fairRange: { low: 10, high: 12.7 },
    listingCount: 3,
    capturedAt: "2026-08-02",
    evidence: [
      { reference: "listing-1", observedAt: "2026-08-02" },
      { reference: "listing-2", observedAt: "2026-08-02" },
      { reference: "listing-3", observedAt: "2026-08-02" }
    ]
  }]
};

const valid = validator.validate(payload, now);
assert.equal(valid.ok, true);
assert.equal(valid.recordCount, 1);
const feed = validator.buildFeed(payload, valid, now);
assert.equal(feed.productionReady, false);
assert.equal(feed.records[0].recordId, "macpherson-retail");

const stale = validator.validate({ ...payload, capturedAt: "2026-07-01" }, now);
assert.equal(stale.ok, false);
assert.ok(stale.errors.some((error) => error.field === "capturedAt.age"));

const unapproved = validator.validate({
  ...payload,
  source: { ...payload.source, termsConfirmed: false }
}, now);
assert.equal(unapproved.ok, false);
assert.ok(unapproved.errors.some((error) => error.field === "source.termsConfirmed"));

console.log("Asking-feed browser capture validator tests passed.");
