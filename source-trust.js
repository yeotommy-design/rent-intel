(function initRentIntelSourceTrust(global) {
  function text(value) {
    return String(value || "").trim();
  }

  function lower(value) {
    return text(value).toLowerCase();
  }

  function comparableRecord(record) {
    const confidence = lower(record?.confidence);
    return confidence.includes("comparable") || record?.id?.startsWith("estimate-");
  }

  function sampleRecord(record) {
    const confidence = lower(record?.confidence);
    return record?.prototypeSource === "coverage-request" || confidence.includes("coverage");
  }

  function profile(record, context = {}) {
    const release = context.releaseLog || {};
    const exceptions = context.exceptionAlerts || {};
    const feed = context.feed || {};
    const evidence = context.evidence || {};
    const source = record?.askingSource || {};
    const sourceName = source.sourceName || feed.sourceName || evidence.sourceName || "asking-rent source";

    if (release.status === "Rolled back") {
      return {
        key: "rolled-back",
        level: "rolled-back",
        title: "Rolled Back",
        reason: release.rollbackReason || "Production release was rolled back.",
        action: "Review rollback reason, restore QA evidence, and queue a corrected release.",
        sourceName
      };
    }

    if (release.status === "Released") {
      return {
        key: "released-monitor",
        level: "released",
        title: "Released / Monitor",
        reason: `${sourceName} has a production release log.`,
        action: exceptions.total ? "Resolve open source exceptions while monitoring production." : "Monitor ingestion and first production benchmark comparison.",
        sourceName
      };
    }

    if (source.productionReady || feed.productionReady) {
      return {
        key: "production-ready",
        level: "production",
        title: "Source checks complete",
        reason: "The asking-rent source, official benchmark, and quality checks are connected.",
        action: "Keep scheduled updates, issue alerts, and source-owner review active.",
        sourceName
      };
    }

    if (sampleRecord(record)) {
      return {
        key: "pilot-verified",
        level: "pilot",
        title: "Manual checks added",
        reason: "This coverage request has been approved for a manually checked rent signal.",
        action: "Complete the remaining source and quality checks before treating it as fully checked.",
        sourceName
      };
    }

    if (comparableRecord(record)) {
      return {
        key: "sample",
        level: "sample",
        title: "Sample",
        reason: "This is based on comparable area and property-type inference, not a direct RentIntel record.",
        action: "Request direct source coverage before using this as a final rent position.",
        sourceName
      };
    }

    if (source.sourceName || source.sourceType || feed.connectionState) {
      return {
        key: "pilot-verified",
        level: "pilot",
        title: "Manual checks added",
        reason: "Manual asking-rent checks are connected, but the full source review is not complete.",
        action: "Complete the remaining evidence, quality checks, owner review, and release checks.",
        sourceName
      };
    }

    return {
      key: "sample",
      level: "sample",
      title: "Sample",
      reason: "Only sample benchmark data is available for this answer.",
      action: "Verify direct asking evidence before committing.",
      sourceName
    };
  }

  global.RentIntelSourceTrust = { profile };
})(window);
