(function initRentIntelAskingFeedAdapter() {
  const defaultState = {
    version: "asking-feed-adapter-v1",
    updatedAt: "",
    connectionState: "pending-source",
    sourceName: "Pending asking feed",
    sourceType: "unavailable",
    productionReady: false,
    note: "Asking-rent source is not connected yet. Using benchmark-only fallback.",
    records: [],
    feedHealth: "missing",
    fallbackUsed: true,
    fallbackReason: "No asking-rent records available."
  };

  function clampNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function normalizeFairRange(range, fallback) {
    const low = clampNumber(range?.low ?? fallback?.low);
    const high = clampNumber(range?.high ?? fallback?.high);
    if (!Number.isFinite(low) || !Number.isFinite(high)) return fallback || null;
    return {
      low: Number(low.toFixed(1)),
      high: Number(high.toFixed(1))
    };
  }

  function normalizeFeedRecord(record = {}) {
    const asking = clampNumber(record.asking);
    const latestAskingMedian = clampNumber(record.latestAskingMedian);
    return {
      recordId: String(record.recordId || "").trim(),
      asking,
      latestAskingMedian,
      fairRange: normalizeFairRange(record.fairRange, null),
      listingCount: Math.max(0, Number(record.listingCount) || 0),
      capturedAt: String(record.capturedAt || "").trim(),
      freshness: String(record.freshness || "").trim(),
      note: String(record.note || "").trim(),
      usable: Number.isFinite(asking) && asking > 0
    };
  }

  function normalizeFeed(feed, options = {}) {
    const candidate = feed && typeof feed === "object" ? feed : {};
    const records = Array.isArray(candidate.records)
      ? candidate.records.map(normalizeFeedRecord).filter((item) => item.recordId)
      : [];
    const updatedAt = String(candidate.updatedAt || options.fallbackUpdatedAt || "").trim();
    const hasUsable = records.some((item) => item.usable);
    const productionReady = Boolean(candidate.productionReady) && hasUsable;
    const sourceType = String(candidate.sourceType || "").trim() || (productionReady ? "licensed-feed" : "verified-manual-capture");
    const sourceName = String(candidate.sourceName || "").trim() || (productionReady ? "Connected asking feed" : "RentIntel pilot asking feed");
    const connectionState = String(candidate.connectionState || "").trim() || (hasUsable ? "pilot-manual-feed-connected" : "pending-source");
    const fallbackUsed = !hasUsable;
    const feedHealth = productionReady
      ? "production"
      : hasUsable
        ? "pilot"
        : "missing";
    return {
      ...defaultState,
      ...candidate,
      updatedAt,
      sourceName,
      sourceType,
      connectionState,
      productionReady,
      records,
      feedHealth,
      fallbackUsed,
      fallbackReason: fallbackUsed
        ? "No usable asking-rent records. Falling back to benchmark/sample values."
        : "",
      note: String(candidate.note || defaultState.note)
    };
  }

  function feedSummary(feed, record, entry) {
    const captured = entry?.capturedAt || feed.updatedAt || "pending";
    const checks = entry?.listingCount || 0;
    const freshness = entry?.freshness || (feed.productionReady ? "production" : "pilot");
    return `Asking feed: ${feed.sourceName} (${checks} checks, ${freshness}, ${captured}).`;
  }

  function mergeRecords(records, feedInput, options = {}) {
    const normalizedFeed = normalizeFeed(feedInput, {
      fallbackUpdatedAt: options.sampleUpdatedAt || ""
    });
    const byRecordId = new Map(normalizedFeed.records.map((item) => [item.recordId, item]));
    const merged = records.map((record) => {
      const entry = byRecordId.get(record.id);
      const official = Number(record.official);
      const appliedAsking = entry?.usable ? Number(entry.asking) : Number(record.asking);
      const gap = official && Number.isFinite(appliedAsking)
        ? Math.round(((appliedAsking - official) / official) * 100)
        : record.gap;
      const series = Array.isArray(record.series)
        ? record.series.map((point, index, list) =>
            index === list.length - 1 && entry && Number.isFinite(Number(entry.latestAskingMedian))
              ? [point[0], point[1], Number(entry.latestAskingMedian)]
              : point
          )
        : record.series;
      const fairRange = entry?.fairRange
        ? normalizeFairRange(entry.fairRange, record.fairRange)
        : normalizeFairRange(record.fairRange, record.fairRange);
      const summary = feedSummary(normalizedFeed, record, entry);
      const note = entry?.note || normalizedFeed.note || "";
      const sourceStatus = entry?.usable
        ? normalizedFeed.connectionState
        : normalizedFeed.records.length
          ? "feed-record-missing"
          : "pending-source";
      return {
        ...record,
        asking: Number.isFinite(appliedAsking) ? Number(appliedAsking.toFixed(1)) : record.asking,
        fairRange: fairRange || record.fairRange,
        gap,
        series,
        askingSourceStatus: sourceStatus,
        askingSource: {
          sourceName: normalizedFeed.sourceName,
          sourceType: normalizedFeed.sourceType,
          listingCount: entry?.listingCount || 0,
          capturedAt: entry?.capturedAt || normalizedFeed.updatedAt || "",
          productionReady: Boolean(normalizedFeed.productionReady),
          connectionState: normalizedFeed.connectionState,
          feedHealth: normalizedFeed.feedHealth,
          fallbackUsed: !entry?.usable,
          note
        },
        sourceSummary: `${record.sourceSummary || ""} ${summary}`.trim()
      };
    });

    return {
      feed: normalizedFeed,
      records: merged
    };
  }

  window.RentIntelAskingFeedAdapter = {
    normalizeFeed,
    mergeRecords,
    feedSummary
  };
})();
