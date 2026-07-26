import assert from "node:assert/strict";
import ingestion from "../asking-feed-ingestion.js";

const now = new Date("2026-07-26T04:00:00.000Z");
const validBatch = {
  batchId: "licensed-feed-2026-07-26",
  capturedAt: "2026-07-26T03:30:00.000Z",
  source: {
    name: "Approved provider",
    type: "licensed-listing-feed",
    licenseReference: "contract-2026-01",
    termsConfirmed: true
  },
  records: [{
    recordId: "chinatown-shophouse",
    asking: 15.4,
    latestAskingMedian: 15.8,
    fairRange: { low: 11.8, high: 14.6 },
    listingCount: 8,
    capturedAt: "2026-07-26T03:30:00.000Z",
    evidence: [{ reference: "provider-row-1001", observedAt: "2026-07-26T03:20:00.000Z" }]
  }]
};

const qa = ingestion.validateAskingFeedBatch(validBatch, now);
assert.equal(qa.ok, true);
assert.equal(qa.recordCount, 1);
assert.equal(qa.warnings.length, 1);

const invalid = ingestion.validateAskingFeedBatch({
  ...validBatch,
  capturedAt: "2026-06-01",
  source: { ...validBatch.source, termsConfirmed: false },
  records: [
    { ...validBatch.records[0], fairRange: { low: 20, high: 10 }, evidence: [] },
    { ...validBatch.records[0] }
  ]
}, now);
assert.equal(invalid.ok, false);
assert.ok(invalid.errors.some((error) => error.field === "capturedAt.age"));
assert.ok(invalid.errors.some((error) => error.field === "source.termsConfirmed"));
assert.ok(invalid.errors.some((error) => error.field === "records[0].fairRange"));
assert.ok(invalid.errors.some((error) => error.field === "records[0].evidence"));
assert.ok(invalid.errors.some((error) => error.field === "records[1].recordId.unique"));

const secret = "test-secret";
const signature = ingestion.signatureForBatch(validBatch, secret);
assert.equal(ingestion.verifyBatchSignature(validBatch, signature, [secret]), true);
assert.equal(ingestion.verifyBatchSignature(validBatch, signature, ["wrong-secret"]), false);

const feed = ingestion.buildPromotedFeed(validBatch, qa, now);
assert.equal(feed.connectionState, "verified-batch-ingested");
assert.equal(feed.productionReady, false);
assert.equal(feed.records[0].evidence[0].reference, "provider-row-1001");

console.log("Asking-feed ingestion tests passed.");
