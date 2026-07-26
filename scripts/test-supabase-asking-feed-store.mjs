import assert from "node:assert/strict";
import storeModule from "../supabase-asking-feed-store.js";

const requests = [];
const fetchImpl = async (url, options = {}) => {
  requests.push({ url, options });
  if (String(url).includes("status=eq.promoted")) {
    return new Response(JSON.stringify([{
      feed: { version: "promoted-feed-v1", records: [] },
      promoted_at: "2026-07-26T05:00:00.000Z"
    }]), { status: 200 });
  }
  if (String(url).includes("batch_id=eq.")) {
    return new Response(JSON.stringify([{
      batch_id: "batch-1",
      status: "validated",
      promoted_at: null
    }]), { status: 200 });
  }
  if (options.method === "POST") {
    return new Response(options.body, { status: 201 });
  }
  return new Response(JSON.stringify([]), { status: 200 });
};

const env = {
  SUPABASE_URL: "https://rentintel.supabase.co/",
  SUPABASE_SECRET_KEY: "server-secret"
};
assert.equal(storeModule.isConfigured(env), true);
assert.equal(storeModule.isConfigured({ SUPABASE_URL: env.SUPABASE_URL }), false);
assert.equal(
  storeModule.signatureHash("sha256=abc").length,
  64
);
assert.match(
  storeModule.storageBatchId({}, { batchId: "" }),
  /^rejected-[a-f0-9]{24}$/
);

const store = storeModule.createStore({ env, fetchImpl });
const payload = {
  batchId: "batch-1",
  capturedAt: "2026-07-26T04:00:00.000Z",
  records: [{ recordId: "record-1" }]
};
const qa = {
  batchId: "batch-1",
  source: {
    name: "Approved provider",
    type: "licensed-listing-feed",
    licenseReference: "contract-1"
  },
  recordCount: 1,
  warnings: [],
  checks: []
};

const saved = await store.saveBatch({
  payload,
  qa,
  status: "validated",
  signature: "sha256=abc",
  now: new Date("2026-07-26T05:00:00.000Z")
});
assert.equal(saved.batch_id, "batch-1");
assert.equal(saved.status, "validated");
assert.equal(saved.signature_sha256.length, 64);
assert.equal(requests[0].options.headers.apikey, "server-secret");
assert.equal(requests[0].options.headers.authorization, "Bearer server-secret");
assert.match(requests[0].options.headers.prefer, /merge-duplicates/);

const batch = await store.getBatch("batch-1");
assert.equal(batch.status, "validated");

const feed = await store.getLatestPromotedFeed();
assert.equal(feed.version, "promoted-feed-v1");

await store.checkHealth();
assert.equal(requests.length, 4);

console.log("Supabase asking-feed storage tests passed.");
