(function initRentIntelOneMapAdapter() {
  const liveCache = new Map();

  function normalizeText(value = "") {
    return String(value).trim().toLowerCase().replace(/\s+/g, " ");
  }

  function uniqueStrings(values = []) {
    const seen = new Set();
    const result = [];
    values.forEach((value) => {
      const text = String(value || "").trim();
      const key = normalizeText(text);
      if (!text || seen.has(key)) return;
      seen.add(key);
      result.push(text);
    });
    return result;
  }

  function normalizeEntry(entry = {}) {
    return {
      recordId: String(entry.recordId || "").trim(),
      area: String(entry.area || "").trim(),
      addressLine: String(entry.addressLine || "").trim(),
      postalCode: String(entry.postalCode || "").trim(),
      planningArea: String(entry.planningArea || "").trim(),
      region: String(entry.region || "").trim(),
      aliases: uniqueStrings(entry.aliases || []),
      centroid: entry.centroid && typeof entry.centroid === "object"
        ? {
            x: Number(entry.centroid.x) || 0,
            y: Number(entry.centroid.y) || 0
          }
        : null
    };
  }

  function indexEnrichment(dataset) {
    const source = dataset && typeof dataset === "object" ? dataset : {};
    const entries = Array.isArray(source.records) ? source.records.map(normalizeEntry) : [];
    return {
      version: String(source.version || "").trim(),
      updatedAt: String(source.updatedAt || "").trim(),
      sourceName: String(source.sourceName || "OneMap enrichment").trim(),
      note: String(source.note || "").trim(),
      byRecordId: new Map(entries.filter((entry) => entry.recordId).map((entry) => [entry.recordId, entry])),
      byArea: new Map(entries.filter((entry) => entry.area).map((entry) => [normalizeText(entry.area), entry])),
      byAlias: new Map(entries.flatMap((entry) => entry.aliases.map((alias) => [normalizeText(alias), entry])))
    };
  }

  function findEntry(record, dataset) {
    const indexed = indexEnrichment(dataset);
    if (record?.id && indexed.byRecordId.has(record.id)) return indexed.byRecordId.get(record.id);
    const areaKey = normalizeText(record?.area || "");
    if (areaKey && indexed.byArea.has(areaKey)) return indexed.byArea.get(areaKey);
    const aliases = Array.isArray(record?.aliases) ? record.aliases : [];
    const aliasMatch = aliases
      .map((alias) => indexed.byAlias.get(normalizeText(alias)))
      .find(Boolean);
    return aliasMatch || null;
  }

  function enrichRecord(record, dataset) {
    if (!record || typeof record !== "object") return record;
    const entry = findEntry(record, dataset);
    if (!entry) return record;
    const aliases = uniqueStrings([
      ...(Array.isArray(record.aliases) ? record.aliases : []),
      ...(entry.aliases || []),
      entry.addressLine,
      entry.postalCode,
      entry.planningArea
    ]);
    const oneMap = {
      sourceName: "OneMap prototype enrichment",
      addressLine: entry.addressLine,
      postalCode: entry.postalCode,
      planningArea: entry.planningArea,
      region: entry.region,
      updatedAt: dataset?.updatedAt || ""
    };
    const oneMapSummary = entry.addressLine
      ? `OneMap enrichment: ${entry.addressLine}${entry.postalCode ? `, Singapore ${entry.postalCode}` : ""}${entry.planningArea ? `, ${entry.planningArea} planning area` : ""}.`
      : entry.planningArea
        ? `OneMap enrichment: ${entry.planningArea} planning area${entry.postalCode ? `, postal ${entry.postalCode}` : ""}.`
        : "";
    return {
      ...record,
      aliases,
      oneMap,
      map: record.map || (entry.centroid ? { ...entry.centroid, status: "calm" } : record.map),
      sourceSummary: oneMapSummary && !String(record.sourceSummary || "").includes("OneMap enrichment:")
        ? `${record.sourceSummary || ""} ${oneMapSummary}`.trim()
        : record.sourceSummary
    };
  }

  function enrichRecords(records, dataset) {
    const rows = Array.isArray(records) ? records : [];
    return rows.map((record) => enrichRecord(record, dataset));
  }

  function liveQueryForRecord(record = {}) {
    return String(
      record.oneMap?.postalCode ||
      record.oneMap?.addressLine ||
      record.address ||
      record.title ||
      record.area ||
      ""
    ).trim();
  }

  async function enrichRecordLive(record) {
    if (!record || typeof record !== "object") return record;
    const query = liveQueryForRecord(record);
    if (query.length < 2) return record;
    const cacheKey = normalizeText(query);
    if (liveCache.has(cacheKey)) return liveCache.get(cacheKey);

    const request = fetch(`/api/sources/onemap/search?query=${encodeURIComponent(query)}`, {
      headers: { accept: "application/json" }
    })
      .then(async (response) => {
        if (!response.ok) return record;
        const payload = await response.json();
        const match = Array.isArray(payload.results) ? payload.results[0] : null;
        if (!payload.live || !match) return record;
        const addressLine = match.address || match.searchValue || record.oneMap?.addressLine || "";
        const postalCode = match.postalCode || record.oneMap?.postalCode || "";
        return {
          ...record,
          aliases: uniqueStrings([
            ...(Array.isArray(record.aliases) ? record.aliases : []),
            match.searchValue,
            addressLine,
            postalCode
          ]),
          oneMap: {
            ...(record.oneMap || {}),
            sourceName: "OneMap live search",
            addressLine,
            postalCode,
            latitude: match.latitude,
            longitude: match.longitude,
            x: match.x,
            y: match.y,
            live: true,
            checkedAt: payload.checkedAt || new Date().toISOString()
          },
          map: match.x && match.y
            ? { ...(record.map || {}), x: match.x, y: match.y, status: record.map?.status || "calm" }
            : record.map
        };
      })
      .catch(() => record);
    liveCache.set(cacheKey, request);
    return request;
  }

  window.RentIntelOneMapAdapter = {
    enrichRecord,
    enrichRecordLive,
    enrichRecords,
    findEntry
  };
})();
