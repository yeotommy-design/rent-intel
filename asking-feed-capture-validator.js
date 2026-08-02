(function initAskingFeedCaptureValidator(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RentIntelAskingFeedCaptureValidator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createValidator() {
  const sourceTypes = new Set([
    "licensed-listing-feed",
    "verified-agent-submission",
    "verified-tenant-submission",
    "verified-manual-capture"
  ]);
  const dayMs = 24 * 60 * 60 * 1000;

  function parseDate(value) {
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

  function validate(payload = {}, now = new Date()) {
    const errors = [];
    const warnings = [];
    const checks = [];
    const check = (field, passed, message) => {
      checks.push({ id: field, passed, detail: message });
      if (!passed) errors.push({ field, message });
    };
    const batchId = String(payload.batchId || "").trim();
    const source = payload.source && typeof payload.source === "object" ? payload.source : {};
    const sourceName = String(source.name || "").trim();
    const sourceType = String(source.type || "").trim().toLowerCase();
    const licenseReference = String(source.licenseReference || "").trim();
    const capturedAt = parseDate(payload.capturedAt);
    const records = Array.isArray(payload.records) ? payload.records : [];

    check("batchId", Boolean(batchId) && batchId.length <= 100, "A batch ID of 1 to 100 characters is required.");
    check("source.name", Boolean(sourceName), "The source name is required.");
    check("source.type", sourceTypes.has(sourceType), "Use an approved licensed or verified source type.");
    check("source.licenseReference", Boolean(licenseReference), "A permission or capture-policy reference is required.");
    check("source.termsConfirmed", source.termsConfirmed === true, "Source usage rights must be confirmed.");
    check("capturedAt", Boolean(capturedAt), "A valid batch capture date is required.");
    if (capturedAt) {
      const age = now.getTime() - capturedAt.getTime();
      check("capturedAt.future", age >= -(5 * 60 * 1000), "The capture time cannot be more than five minutes in the future.");
      check("capturedAt.age", age <= 7 * dayMs, "The capture must be no more than seven days old.");
    }
    check("records", records.length > 0 && records.length <= 500, "Provide between 1 and 500 area records.");

    const recordIds = new Set();
    records.forEach((record, index) => {
      const prefix = `records[${index}]`;
      const recordId = String(record?.recordId || "").trim();
      check(`${prefix}.recordId`, Boolean(recordId), "Every area needs a RentIntel record ID.");
      check(`${prefix}.recordId.unique`, Boolean(recordId) && !recordIds.has(recordId), "Area record IDs must be unique within a batch.");
      if (recordId) recordIds.add(recordId);
      check(`${prefix}.asking`, validPsf(record?.asking), "Asking rent must be between S$0.50 and S$500 psf.");
      check(`${prefix}.latestAskingMedian`, validPsf(record?.latestAskingMedian), "The asking median must be between S$0.50 and S$500 psf.");
      const range = record?.fairRange && typeof record.fairRange === "object" ? record.fairRange : {};
      check(
        `${prefix}.fairRange`,
        validPsf(range.low) && validPsf(range.high) && Number(range.low) <= Number(range.high),
        "Fair-range values must be valid and the low value cannot exceed the high value."
      );
      const listingCount = Number(record?.listingCount);
      check(`${prefix}.listingCount`, Number.isInteger(listingCount) && listingCount >= 1, "Listing count must be a whole number of at least one.");
      const recordDate = parseDate(record?.capturedAt);
      check(`${prefix}.capturedAt`, Boolean(recordDate), "Every area needs a valid capture date.");
      if (capturedAt && recordDate) {
        check(`${prefix}.capturedAt.batchMatch`, Math.abs(recordDate.getTime() - capturedAt.getTime()) <= dayMs, "An area capture date must be within 24 hours of the batch date.");
      }
      const evidence = Array.isArray(record?.evidence) ? record.evidence : [];
      check(`${prefix}.evidence`, evidence.length > 0, "Every area needs at least one evidence reference.");
      evidence.forEach((item, evidenceIndex) => {
        check(`${prefix}.evidence[${evidenceIndex}].reference`, Boolean(String(item?.reference || "").trim()), "Evidence reference is required.");
        check(`${prefix}.evidence[${evidenceIndex}].observedAt`, Boolean(parseDate(item?.observedAt)), "Evidence observation time must be valid.");
      });
    });

    if (records.length < 3) {
      warnings.push({ field: "records", message: "Fewer than three areas is acceptable, but each area should still have at least three current evidence references." });
    }
    return {
      ok: errors.length === 0,
      batchId,
      source: { name: sourceName, type: sourceType, licenseReference },
      recordCount: records.length,
      errors,
      warnings,
      checks
    };
  }

  function buildFeed(payload, qa, validatedAt = new Date()) {
    const captureDate = String(payload.capturedAt).slice(0, 10);
    return {
      version: `asking-feed-validated-${captureDate}-${qa.batchId}`,
      updatedAt: captureDate,
      connectionState: "verified-batch-validated",
      sourceName: qa.source.name,
      sourceType: qa.source.type,
      productionReady: false,
      note: "This evidence passed validation. Public release still requires human review and a controlled deployment.",
      ingestion: {
        batchId: qa.batchId,
        licenseReference: qa.source.licenseReference,
        validatedAt: validatedAt.toISOString(),
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
        freshness: "validated manual capture",
        note: String(record.note || "Validated asking-rent evidence batch.").trim(),
        evidence: record.evidence.map((item) => ({
          reference: String(item.reference).trim(),
          observedAt: String(item.observedAt).trim()
        }))
      }))
    };
  }

  return { validate, buildFeed };
});
