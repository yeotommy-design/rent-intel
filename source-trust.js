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
        title: "Production Verified",
        reason: "Production asking source is marked ready with official benchmark and QA controls.",
        action: "Keep scheduled ingestion, exception alerts, and source-owner review active.",
        sourceName
      };
    }

    if (sampleRecord(record)) {
      return {
        key: "pilot-verified",
        level: "pilot",
        title: "Pilot Verified",
        reason: "This coverage request has been approved into a pilot rent signal.",
        action: "Complete production source evidence, QA gate, and controlled release before treating it as production verified.",
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
        title: "Pilot Verified",
        reason: "Manual asking checks are connected, but production release is not complete.",
        action: "Complete production evidence, QA gate, owner review, and controlled release.",
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
