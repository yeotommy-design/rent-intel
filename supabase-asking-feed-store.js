const crypto = require("node:crypto");

const TABLE = "rentintel_asking_feed_batches";
const DEFAULT_TIMEOUT_MS = 8000;

function configFromEnv(env = process.env) {
  return {
    url: String(env.SUPABASE_URL || "").trim().replace(/\/+$/, ""),
    secretKey: String(
      env.SUPABASE_SECRET_KEY ||
      env.SUPABASE_SERVICE_ROLE_KEY ||
      ""
    ).trim()
  };
}

function isConfigured(env = process.env) {
  const config = configFromEnv(env);
  return Boolean(config.url && config.secretKey);
}

function signatureHash(signature = "") {
  const value = String(signature || "").trim();
  return value
    ? crypto.createHash("sha256").update(value).digest("hex")
    : null;
}

function storageBatchId(payload, qa) {
  const supplied = String(qa?.batchId || "").trim();
  if (supplied) return supplied;
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload || {}))
    .digest("hex")
    .slice(0, 24);
  return `rejected-${digest}`;
}

function createStore({
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
  const config = configFromEnv(env);

  async function request(pathname, options = {}) {
    if (!config.url || !config.secretKey) {
      throw new Error("Supabase asking-feed storage is not configured.");
    }
    if (typeof fetchImpl !== "function") {
      throw new Error("A fetch implementation is required for Supabase storage.");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`${config.url}/rest/v1/${pathname}`, {
        ...options,
        signal: controller.signal,
        headers: {
          apikey: config.secretKey,
          authorization: `Bearer ${config.secretKey}`,
          "content-type": "application/json",
          ...options.headers
        }
      });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const detail = payload?.message || payload?.hint || `HTTP ${response.status}`;
        throw new Error(`Supabase asking-feed storage request failed: ${detail}`);
      }
      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  async function saveBatch({
    payload,
    qa,
    status,
    signature,
    feed = null,
    now = new Date()
  }) {
    const timestamp = now.toISOString();
    const row = {
      batch_id: storageBatchId(payload, qa),
      captured_at: payload.capturedAt || null,
      source_name: qa.source?.name || null,
      source_type: qa.source?.type || null,
      license_reference: qa.source?.licenseReference || null,
      record_count: qa.recordCount || 0,
      warning_count: Array.isArray(qa.warnings) ? qa.warnings.length : 0,
      status,
      payload,
      qa,
      feed,
      signature_sha256: signatureHash(signature),
      validated_at: timestamp,
      promoted_at: status === "promoted" ? timestamp : null,
      updated_at: timestamp
    };
    const rows = await request(`${TABLE}?on_conflict=batch_id`, {
      method: "POST",
      headers: {
        prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(row)
    });
    return Array.isArray(rows) ? rows[0] || row : row;
  }

  async function getBatch(batchId) {
    const rows = await request(
      `${TABLE}?batch_id=eq.${encodeURIComponent(batchId)}&select=batch_id,status,promoted_at&limit=1`
    );
    return Array.isArray(rows) ? rows[0] || null : null;
  }

  async function getLatestPromotedFeed() {
    const rows = await request(
      `${TABLE}?status=eq.promoted&feed=not.is.null&select=feed,promoted_at&order=promoted_at.desc&limit=1`
    );
    return Array.isArray(rows) && rows[0]?.feed ? rows[0].feed : null;
  }

  async function checkHealth() {
    await request(`${TABLE}?select=batch_id&limit=1`);
    return { ok: true };
  }

  return {
    configured: Boolean(config.url && config.secretKey),
    saveBatch,
    getBatch,
    getLatestPromotedFeed,
    checkHealth
  };
}

module.exports = {
  TABLE,
  configFromEnv,
  isConfigured,
  signatureHash,
  storageBatchId,
  createStore
};
