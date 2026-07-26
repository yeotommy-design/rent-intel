const crypto = require("node:crypto");

const ALLOWED_SOURCE_TYPES = new Set([
  "licensed-listing-feed",
  "verified-agent-submission",
  "verified-tenant-submission",
  "verified-manual-capture"
]);
const MAX_RECORDS = 500;
const MAX_CAPTURE_AGE_DAYS = 7;
const MAX_FUTURE_MINUTES = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function signatureForBatch(payload, secret) {
  return `sha256=${crypto
    .createHmac("sha256", String(secret || ""))
    .update(canonicalJson(payload))
    .digest("hex")}`;
}

function verifyBatchSignature(payload, signature, secrets = []) {
  const supplied = String(signature || "").trim();
  if (!supplied) return false;
  return secrets
    .map((secret) => String(secret || "").trim())
    .filter(Boolean)
    .some((secret) => {
      const expected = signatureForBatch(payload, secret);
      const suppliedBuffer = Buffer.from(supplied);
      const expectedBuffer = Buffer.from(expected);
      return suppliedBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
    });
}

function parseCaptureDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(text)
    ? new Date(`${text}T00:00:00+08:00`)
    : new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function validPsf(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0.5 && number <= 500;
}

function validateAskingFeedBatch(payload = {}, now = new Date()) {
  const errors = [];
  const warnings = [];
  const checks = [];
  const addCheck = (id, passed, detail) => {
    checks.push({ id, passed, detail });
    if (!passed) errors.push({ field: id, message: detail });
  };

  const batchId = String(payload.batchId || "").trim();
  addCheck("batchId", Boolean(batchId) && batchId.length <= 100, "A batch ID of 1 to 100 characters is required.");

  const source = payload.source && typeof payload.source === "object" ? payload.source : {};
  const sourceName = String(source.name || "").trim();
  const sourceType = String(source.type || "").trim().toLowerCase();
  const licenseReference = String(source.licenseReference || "").trim();
  addCheck("source.name", Boolean(sourceName), "The source name is required.");
  addCheck("source.type", ALLOWED_SOURCE_TYPES.has(sourceType), "Use an approved licensed or verified source type.");
  addCheck("source.licenseReference", Boolean(licenseReference), "A licence, permission, or capture-policy reference is required.");
  addCheck("source.termsConfirmed", source.termsConfirmed === true, "Source usage rights must be confirmed.");

  const capturedAt = parseCaptureDate(payload.capturedAt);
  const nowTime = now.getTime();
  addCheck("capturedAt", Boolean(capturedAt), "A valid batch capture date is required.");
  if (capturedAt) {
    const ageMs = nowTime - capturedAt.getTime();
    addCheck(
      "capturedAt.future",
      ageMs >= -(MAX_FUTURE_MINUTES * 60 * 1000),
      "The batch capture time cannot be more than five minutes in the future."
    );
    addCheck(
      "capturedAt.age",
      ageMs <= MAX_CAPTURE_AGE_DAYS * DAY_MS,
      "The batch must be no more than seven days old."
    );
  }

  const records = Array.isArray(payload.records) ? payload.records : [];
  addCheck(
    "records",
    records.length > 0 && records.length <= MAX_RECORDS,
    `Provide between 1 and ${MAX_RECORDS} records.`
  );
  const recordIds = new Set();
  records.forEach((record, index) => {
    const prefix = `records[${index}]`;
    const recordId = String(record?.recordId || "").trim();
    addCheck(`${prefix}.recordId`, Boolean(recordId), "Every record needs a recordId.");
    addCheck(`${prefix}.recordId.unique`, Boolean(recordId) && !recordIds.has(recordId), "Record IDs must be unique within a batch.");
    if (recordId) recordIds.add(recordId);
    addCheck(`${prefix}.asking`, validPsf(record?.asking), "Asking rent must be between S$0.50 and S$500 psf.");
    addCheck(`${prefix}.latestAskingMedian`, validPsf(record?.latestAskingMedian), "The asking median must be between S$0.50 and S$500 psf.");

    const range = record?.fairRange && typeof record.fairRange === "object" ? record.fairRange : {};
    const rangeValid = validPsf(range.low) && validPsf(range.high) && Number(range.low) <= Number(range.high);
    addCheck(`${prefix}.fairRange`, rangeValid, "Fair-range values must be valid and low cannot exceed high.");

    const listingCount = Number(record?.listingCount);
    addCheck(
      `${prefix}.listingCount`,
      Number.isInteger(listingCount) && listingCount >= 1,
      "Listing count must be a whole number of at least one."
    );

    const recordCapturedAt = parseCaptureDate(record?.capturedAt);
    addCheck(`${prefix}.capturedAt`, Boolean(recordCapturedAt), "Every record needs a valid capture date.");
    if (capturedAt && recordCapturedAt) {
      addCheck(
        `${prefix}.capturedAt.batchMatch`,
        Math.abs(recordCapturedAt.getTime() - capturedAt.getTime()) <= DAY_MS,
        "A record capture time must be within 24 hours of the batch capture time."
      );
    }

    const evidence = Array.isArray(record?.evidence) ? record.evidence : [];
    addCheck(`${prefix}.evidence`, evidence.length > 0, "Every record needs at least one evidence reference.");
    evidence.forEach((item, evidenceIndex) => {
      const evidencePrefix = `${prefix}.evidence[${evidenceIndex}]`;
      addCheck(`${evidencePrefix}.reference`, Boolean(String(item?.reference || "").trim()), "Evidence reference is required.");
      addCheck(`${evidencePrefix}.observedAt`, Boolean(parseCaptureDate(item?.observedAt)), "Evidence observation time must be valid.");
    });
  });

  if (records.length < 3) {
    warnings.push({
      field: "records",
      message: "Fewer than three records may be too narrow for a reliable area-level asking median."
    });
  }

  return {
    ok: errors.length === 0,
    batchId,
    source: {
      name: sourceName,
      type: sourceType,
      licenseReference
    },
    recordCount: records.length,
    errors,
    warnings,
    checks
  };
}

function buildPromotedFeed(payload, qa, ingestedAt = new Date()) {
  const captureDate = String(payload.capturedAt).slice(0, 10);
  return {
    version: `asking-feed-ingested-${captureDate}-${qa.batchId}`,
    updatedAt: captureDate,
    connectionState: "verified-batch-ingested",
    sourceName: qa.source.name,
    sourceType: qa.source.type,
    productionReady: false,
    note: "Signed batch passed ingestion validation. Public production release still requires source-owner and operations approval.",
    ingestion: {
      batchId: qa.batchId,
      licenseReference: qa.source.licenseReference,
      validatedAt: ingestedAt.toISOString(),
      qaCheckCount: qa.checks.length,
      warningCount: qa.warnings.length
    },
    records: payload.records.map((record) => ({
      recordId: String(record.recordId).trim(),
      asking: Number(Number(record.asking).toFixed(1)),
      latestAskingMedian: Number(Number(record.latestAskingMedian).toFixed(1)),
      fairRange: {
        low: Number(Number(record.fairRange.low).toFixed(1)),
        high: Number(Number(record.fairRange.high).toFixed(1))
      },
      listingCount: Number(record.listingCount),
      capturedAt: String(record.capturedAt).slice(0, 10),
      freshness: "verified signed batch",
      note: String(record.note || "Validated asking-rent evidence batch.").trim(),
      evidence: record.evidence.map((item) => ({
        reference: String(item.reference).trim(),
        observedAt: String(item.observedAt).trim()
      }))
    }))
  };
}

module.exports = {
  ALLOWED_SOURCE_TYPES,
  canonicalJson,
  signatureForBatch,
  verifyBatchSignature,
  validateAskingFeedBatch,
  buildPromotedFeed
};
