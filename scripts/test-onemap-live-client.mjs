import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createOneMapClient, normalizeOneMapQuery, normalizeOneMapResults } = require("../onemap-live-client");

assert.equal(normalizeOneMapQuery("  Hougang   Green  "), "Hougang Green");
assert.deepEqual(normalizeOneMapResults({ results: [{
  SEARCHVAL: "HOUGANG GREEN SHOPPING MALL",
  ADDRESS: "21 HOUGANG STREET 51 HOUGANG GREEN SHOPPING MALL SINGAPORE 538719",
  POSTAL: "538719",
  X: "34900.1",
  Y: "39300.2",
  LATITUDE: "1.379",
  LONGITUDE: "103.887"
}] })[0], {
  searchValue: "HOUGANG GREEN SHOPPING MALL",
  address: "21 HOUGANG STREET 51 HOUGANG GREEN SHOPPING MALL SINGAPORE 538719",
  block: "",
  roadName: "",
  building: "",
  postalCode: "538719",
  x: 34900.1,
  y: 39300.2,
  latitude: 1.379,
  longitude: 103.887
});

let authCalls = 0;
let searchCalls = 0;
const fetchImpl = async (url) => {
  if (String(url).includes("getToken")) {
    authCalls += 1;
    return { ok: true, json: async () => ({ access_token: "test-token", expiry_timestamp: 2000000000 }) };
  }
  searchCalls += 1;
  return { ok: true, json: async () => ({ found: 1, results: [{ SEARCHVAL: "TEST", POSTAL: "123456" }] }) };
};
const client = createOneMapClient({ fetchImpl, email: "test@example.com", password: "secret", now: () => 1700000000000 });
const first = await client.search("Test address");
const second = await client.search("Test address");
assert.equal(client.readiness().configured, true);
assert.equal(first.live, true);
assert.equal(second.cached, true);
assert.equal(authCalls, 1);
assert.equal(searchCalls, 1);

const fallback = createOneMapClient({ fetchImpl }).readiness();
assert.equal(fallback.configured, false);
assert.equal(fallback.mode, "static-fallback");

console.log("OneMap live client checks passed.");
