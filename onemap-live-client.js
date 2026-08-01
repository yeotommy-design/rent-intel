const DEFAULT_BASE_URL = "https://www.onemap.gov.sg";
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

function normalizeOneMapQuery(value = "") {
  return String(value).trim().replace(/\s+/g, " ").slice(0, 120);
}

function normalizeOneMapResults(payload = {}) {
  const rows = Array.isArray(payload.results) ? payload.results : [];
  return rows.slice(0, 10).map((row) => ({
    searchValue: String(row.SEARCHVAL || "").trim(),
    address: String(row.ADDRESS || "").trim(),
    block: String(row.BLK_NO || "").trim(),
    roadName: String(row.ROAD_NAME || "").trim(),
    building: String(row.BUILDING || "").trim(),
    postalCode: String(row.POSTAL || "").trim(),
    x: Number(row.X) || 0,
    y: Number(row.Y) || 0,
    latitude: Number(row.LATITUDE) || 0,
    longitude: Number(row.LONGITUDE) || 0
  }));
}

function createOneMapClient(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  const email = String(options.email || "").trim();
  const password = String(options.password || "").trim();
  const directToken = String(options.directToken || "").trim();
  const now = options.now || (() => Date.now());
  const cacheTtlMs = Number(options.cacheTtlMs || DEFAULT_CACHE_TTL_MS);
  const resultCache = new Map();
  let tokenCache = { value: "", expiresAt: 0 };

  function isConfigured() {
    return Boolean(directToken || (email && password));
  }

  function readiness() {
    return {
      configured: isConfigured(),
      mode: isConfigured() ? "live-token-auth" : "static-fallback",
      cacheTtlHours: Math.round(cacheTtlMs / 3600000)
    };
  }

  async function requestJson(url, init, label) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetchImpl(url, { ...init, signal: controller.signal });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.error) {
        const message = String(body.error || body.message || `${label} returned ${response.status}`);
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }
      return body;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function getToken(forceRefresh = false) {
    if (directToken) return directToken;
    if (!email || !password) throw new Error("OneMap credentials are not configured.");
    if (!forceRefresh && tokenCache.value && tokenCache.expiresAt - TOKEN_REFRESH_BUFFER_MS > now()) {
      return tokenCache.value;
    }
    const body = await requestJson(`${baseUrl}/api/auth/post/getToken`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    }, "OneMap authentication");
    const value = String(body.access_token || "").trim();
    if (!value) throw new Error("OneMap authentication did not return an access token.");
    const expirySeconds = Number(body.expiry_timestamp || 0);
    tokenCache = {
      value,
      expiresAt: expirySeconds > 0 ? expirySeconds * 1000 : now() + 72 * 60 * 60 * 1000
    };
    return value;
  }

  async function fetchSearch(query, forceTokenRefresh = false) {
    const token = await getToken(forceTokenRefresh);
    const url = new URL(`${baseUrl}/api/common/elastic/search`);
    url.searchParams.set("searchVal", query);
    url.searchParams.set("returnGeom", "Y");
    url.searchParams.set("getAddrDetails", "Y");
    url.searchParams.set("pageNum", "1");
    return await requestJson(url, {
      method: "GET",
      headers: { Authorization: token }
    }, "OneMap search");
  }

  async function search(value) {
    const query = normalizeOneMapQuery(value);
    if (query.length < 2) throw new Error("Enter at least two characters for a OneMap search.");
    if (!isConfigured()) {
      return { configured: false, live: false, cached: false, query, results: [] };
    }
    const cacheKey = query.toLowerCase();
    const cached = resultCache.get(cacheKey);
    if (cached && cached.expiresAt > now()) {
      return { ...cached.payload, cached: true };
    }
    let payload;
    try {
      payload = await fetchSearch(query);
    } catch (error) {
      if (directToken || ![401, 403].includes(Number(error.status))) throw error;
      tokenCache = { value: "", expiresAt: 0 };
      payload = await fetchSearch(query, true);
    }
    const result = {
      configured: true,
      live: true,
      cached: false,
      query,
      checkedAt: new Date(now()).toISOString(),
      results: normalizeOneMapResults(payload)
    };
    resultCache.set(cacheKey, { expiresAt: now() + cacheTtlMs, payload: result });
    if (resultCache.size > 200) resultCache.delete(resultCache.keys().next().value);
    return result;
  }

  return { readiness, search };
}

module.exports = {
  createOneMapClient,
  normalizeOneMapQuery,
  normalizeOneMapResults
};
