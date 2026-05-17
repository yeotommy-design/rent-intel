import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const appPath = path.join(projectRoot, "app.js");
const baseJsonPath = path.join(projectRoot, "data", "rentintel-sample-data.json");

const comparableAreaProfiles = [
  { area: "Ang Mo Kio", aliases: ["ang mo kio", "amk"], official: 8.8, asking: 11.5, x: 314, y: 183, cluster: "mature heartland" },
  { area: "Bedok", aliases: ["bedok", "bedok central"], official: 8.6, asking: 11.1, x: 438, y: 258, cluster: "mature heartland" },
  { area: "Bishan", aliases: ["bishan", "junction 8"], official: 9.6, asking: 12.8, x: 304, y: 207, cluster: "mature heartland" },
  { area: "Boon Lay", aliases: ["boon lay", "jurong west"], official: 7.8, asking: 9.9, x: 105, y: 246, cluster: "heartland" },
  { area: "Bukit Batok", aliases: ["bukit batok", "bt batok"], official: 7.9, asking: 10.2, x: 173, y: 222, cluster: "heartland" },
  { area: "Bukit Merah", aliases: ["bukit merah", "redhill", "tiong bahru"], official: 10.2, asking: 13.6, x: 265, y: 279, cluster: "city fringe" },
  { area: "Bukit Panjang", aliases: ["bukit panjang", "bt panjang"], official: 7.6, asking: 9.7, x: 166, y: 176, cluster: "heartland" },
  { area: "Bukit Timah", aliases: ["bukit timah", "sixth avenue", "beauty world"], official: 12.4, asking: 15.7, x: 225, y: 218, cluster: "prime fringe" },
  { area: "Bugis", aliases: ["bugis", "arab street", "kampong glam", "bras basah"], official: 14.2, asking: 18.4, x: 330, y: 270, cluster: "city fringe" },
  { area: "Choa Chu Kang", aliases: ["choa chu kang", "cck"], official: 7.3, asking: 9.3, x: 156, y: 146, cluster: "heartland" },
  { area: "City Hall", aliases: ["city hall", "raffles city", "stamford"], official: 18.6, asking: 22.7, x: 320, y: 282, cluster: "cbd" },
  { area: "Clementi", aliases: ["clementi", "clementi central"], official: 8.7, asking: 11.4, x: 184, y: 260, cluster: "mature heartland" },
  { area: "Geylang", aliases: ["geylang", "aljunied", "paya lebar fringe"], official: 11.6, asking: 15.1, x: 364, y: 250, cluster: "city fringe" },
  { area: "HarbourFront", aliases: ["harbourfront", "vivocity", "telok blangah"], official: 20.2, asking: 23.1, x: 278, y: 318, cluster: "destination mall" },
  { area: "Hougang", aliases: ["hougang", "kovan"], official: 8.4, asking: 10.8, x: 372, y: 196, cluster: "heartland" },
  { area: "Joo Chiat", aliases: ["joo chiat", "katong", "east coast shophouse"], official: 12.2, asking: 15.9, x: 424, y: 280, cluster: "shophouse fringe" },
  { area: "Kallang", aliases: ["kallang", "lavender", "boon keng"], official: 10.7, asking: 13.7, x: 342, y: 249, cluster: "city fringe" },
  { area: "Jalan Besar", aliases: ["jalan besar", "bendemeer", "french road"], official: 11.8, asking: 15.4, x: 333, y: 253, cluster: "city fringe" },
  { area: "Little India", aliases: ["little india", "farrer park", "serangoon road"], official: 12.8, asking: 16.6, x: 323, y: 252, cluster: "city fringe" },
  { area: "Marine Parade", aliases: ["marine parade", "parkway", "east coast"], official: 11.2, asking: 14.2, x: 432, y: 304, cluster: "mature heartland" },
  { area: "Novena", aliases: ["novena", "balestier", "thomson"], official: 13.5, asking: 16.8, x: 306, y: 236, cluster: "city fringe" },
  { area: "Outram", aliases: ["outram", "keong saik", "neil road", "tanjong pagar shophouse"], official: 13.4, asking: 17.4, x: 302, y: 298, cluster: "shophouse fringe" },
  { area: "Pasir Ris", aliases: ["pasir ris", "white sands"], official: 7.4, asking: 9.7, x: 470, y: 204, cluster: "heartland" },
  { area: "Punggol", aliases: ["punggol", "waterway point"], official: 7.7, asking: 10.4, x: 421, y: 148, cluster: "new town" },
  { area: "Queenstown", aliases: ["queenstown", "commonwealth", "holland village"], official: 10.4, asking: 13.4, x: 238, y: 260, cluster: "city fringe" },
  { area: "Raffles Place", aliases: ["raffles place", "cbd", "cecil street", "tanjong pagar"], official: 19.4, asking: 23.8, x: 316, y: 300, cluster: "cbd" },
  { area: "River Valley", aliases: ["river valley", "robertson quay", "clarke quay"], official: 13.8, asking: 17.6, x: 292, y: 276, cluster: "prime fringe" },
  { area: "Serangoon", aliases: ["serangoon", "nex", "serangoon central"], official: 8.9, asking: 11.6, x: 360, y: 205, cluster: "mature heartland" },
  { area: "Sengkang", aliases: ["sengkang", "compassvale", "compass one"], official: 7.8, asking: 10.2, x: 398, y: 166, cluster: "new town" },
  { area: "Sembawang", aliases: ["sembawang"], official: 7.2, asking: 9.1, x: 282, y: 92, cluster: "heartland" },
  { area: "Tampines", aliases: ["tampines", "tampines central", "tampines mall"], official: 8.7, asking: 11.4, x: 455, y: 225, cluster: "mature heartland" },
  { area: "Toa Payoh", aliases: ["toa payoh", "tp hdb hub", "hdb hub"], official: 9.3, asking: 12.1, x: 318, y: 225, cluster: "mature heartland" },
  { area: "Woodlands", aliases: ["woodlands", "causeway point"], official: 7.7, asking: 10.1, x: 226, y: 93, cluster: "heartland" },
  { area: "Yishun", aliases: ["yishun", "northpoint"], official: 7.8, asking: 10.2, x: 302, y: 112, cluster: "heartland" }
];

const genericSearchAliases = new Set([
  "hdb",
  "retail",
  "heartland",
  "hdb retail",
  "hdb shop",
  "shop",
  "shops",
  "shophouse",
  "shop house",
  "mall",
  "shopping centre",
  "shopping center"
]);

function titleCase(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mergeSamplePayloads(basePayload, batchPayloads = []) {
  const payloads = [basePayload, ...batchPayloads].filter((payload) => Array.isArray(payload?.records));
  if (!payloads.length) return null;
  const recordsById = new Map();
  payloads.forEach((payload) => {
    payload.records.forEach((record) => {
      if (record?.id) recordsById.set(record.id, record);
    });
  });
  return {
    version: payloads[payloads.length - 1]?.version || basePayload?.version || "",
    updatedAt: payloads
      .map((payload) => String(payload?.updatedAt || ""))
      .filter(Boolean)
      .sort()
      .at(-1) || "",
    sourceNote: payloads[payloads.length - 1]?.sourceNote || basePayload?.sourceNote || "",
    records: Array.from(recordsById.values())
  };
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) return { eligible: false };
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) return { eligible: false };
  if (text.includes("farm") && text.includes("hdb retail")) return { eligible: false };
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) return { eligible: false };
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) return { eligible: false };
  return { eligible: true };
}

function inferPropertyType(query, profile) {
  if (/\b(shop\s*house|shophouse|conservation)\b/.test(query)) {
    return { label: "Shophouse retail", modifier: 1.28 };
  }
  if (/\b(mall|shopping|plaza|centre|center|point|junction)\b/.test(query)) {
    return { label: "Shopping centre retail", modifier: profile.cluster.includes("mall") ? 1.05 : 1.18 };
  }
  if (/\b(hdb|heartland|coffee\s*shop|coffeeshop|void deck|neighbourhood|neighborhood)\b/.test(query)) {
    return { label: "HDB retail", modifier: 1 };
  }
  return { label: profile.cluster.includes("cbd") ? "CBD retail" : "Neighbourhood retail", modifier: profile.cluster.includes("cbd") ? 1.18 : 1.04 };
}

function fallbackComparableProfile(query) {
  const normalized = query.trim().toLowerCase();
  if (!coverageEligibilityProfile(normalized).eligible) return null;
  const hasRetailIntent = /\b(hdb|retail|shop|shops|shophouse|shop\s*house|mall|plaza|centre|center|commercial|cafe|restaurant|f&b|food)\b/.test(normalized);
  if (!hasRetailIntent) return null;
  const area = normalized
    .replace(/\b(hdb|retail|shop|shops|shophouse|shop\s*house|mall|plaza|centre|center|commercial|unit|rent|rental|asking|cafe|restaurant|f&b|food)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!area || genericSearchAliases.has(area) || area.length < 3) return null;
  const primeHint = /\b(orchard|marina|raffles|tanjong pagar|cbd|city hall|bugis|holland|clarke quay)\b/.test(area);
  const cityHint = /\b(jalan besar|lavender|geylang|katong|joo chiat|balestier|outram|tiong bahru)\b/.test(area);
  return {
    area: titleCase(area),
    aliases: [area],
    official: primeHint ? 13.2 : cityHint ? 11.2 : 8.4,
    asking: primeHint ? 16.8 : cityHint ? 14.3 : 10.9,
    cluster: primeHint ? "prime comparable fallback" : cityHint ? "city fringe comparable fallback" : "heartland comparable fallback"
  };
}

function createComparableRecord(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized || !coverageEligibilityProfile(normalized).eligible) return null;
  const profile = comparableAreaProfiles
    .map((item) => ({
      profile: item,
      match: item.aliases
        .map((alias) => alias.toLowerCase())
        .filter((alias) => normalized.includes(alias))
        .sort((a, b) => b.length - a.length)[0]
    }))
    .filter((item) => item.match)
    .sort((a, b) => b.match.length - a.match.length)[0]?.profile || fallbackComparableProfile(query);
  if (!profile) return null;
  const inferredType = inferPropertyType(normalized, profile);
  return {
    id: `estimate-${slugify(profile.area)}-${slugify(inferredType.label)}`,
    aliases: [...profile.aliases, `${profile.area.toLowerCase()} ${inferredType.label.toLowerCase()}`],
    title: `${profile.area} ${inferredType.label === "HDB retail" ? inferredType.label : inferredType.label.toLowerCase()}`,
    area: profile.area,
    propertyType: inferredType.label
  };
}

function findRecordFactory(rentRecords) {
  return function findRecord(query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return null;
    const activeRecords = rentRecords;
    const normalizedWords = normalized.split(/\s+/).filter(Boolean);
    const exactTitleMatch = activeRecords.find((record) => normalized === String(record.title || "").toLowerCase());
    if (exactTitleMatch) return exactTitleMatch;

    const exactAliasMatches = activeRecords
      .filter((record) => (record.aliases || []).some((alias) => normalized === String(alias).toLowerCase()))
      .sort((a, b) => {
        const aBase = String(a.title || "").toLowerCase().replace(/\s+retail$/, "");
        const bBase = String(b.title || "").toLowerCase().replace(/\s+retail$/, "");
        const aBaseExact = normalized === aBase ? 1 : 0;
        const bBaseExact = normalized === bBase ? 1 : 0;
        if (bBaseExact !== aBaseExact) return bBaseExact - aBaseExact;
        const aStarts = String(a.title || "").toLowerCase().startsWith(normalized) ? 1 : 0;
        const bStarts = String(b.title || "").toLowerCase().startsWith(normalized) ? 1 : 0;
        if (bStarts !== aStarts) return bStarts - aStarts;
        return String(a.title || "").length - String(b.title || "").length;
      });
    if (exactAliasMatches[0]) return exactAliasMatches[0];

    const familyAliasMatch = activeRecords
      .map((record) => {
        const title = String(record.title || "").toLowerCase();
        const aliases = (record.aliases || []).map((alias) => String(alias).toLowerCase());
        const searchFields = [title, ...aliases];
        const matchingField = searchFields.find((field) => normalizedWords.every((word) => field.includes(word)));
        if (!matchingField) return null;
        const extraWordPenalty = matchingField.split(/\s+/).filter((word) => !normalizedWords.includes(word)).length;
        const titleStarts = title.startsWith(normalized) ? 1 : 0;
        const aliasStarts = aliases.some((alias) => alias.startsWith(normalized)) ? 1 : 0;
        return {
          record,
          titleStarts,
          aliasStarts,
          extraWordPenalty
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.titleStarts !== a.titleStarts) return b.titleStarts - a.titleStarts;
        if (b.aliasStarts !== a.aliasStarts) return b.aliasStarts - a.aliasStarts;
        if (a.extraWordPenalty !== b.extraWordPenalty) return a.extraWordPenalty - b.extraWordPenalty;
        return 0;
      });
    if (familyAliasMatch[0] && normalizedWords.length >= 2) return familyAliasMatch[0].record;

    if (!coverageEligibilityProfile(normalized).eligible) return null;
    const scored = activeRecords
      .map((record) => {
        const haystack = [record.title, record.area, record.propertyType, ...(record.aliases || [])]
          .join(" ")
          .toLowerCase();
        const tokens = haystack.split(/\s+/);
        const queryWords = normalized.split(/\s+/).filter(Boolean);
        const area = String(record.area || "").toLowerCase();
        const title = String(record.title || "").toLowerCase();
        const propertyType = String(record.propertyType || "").toLowerCase();
        const phraseScore = [
          normalized === title ? 120 : 0,
          normalized === area ? 100 : 0,
          normalized.includes(area) ? 70 : 0,
          normalized.includes(title) || title.includes(normalized) ? 65 : 0,
          normalized.includes(propertyType) ? 22 : 0
        ].reduce((sum, value) => sum + value, 0);
        const aliasScore = (record.aliases || []).reduce((sum, alias) => {
          const normalizedAlias = String(alias).toLowerCase();
          if (!normalized.includes(normalizedAlias)) return sum;
          const wordCount = normalizedAlias.split(/\s+/).length;
          const genericPenalty = genericSearchAliases.has(normalizedAlias) ? 0.35 : 1;
          return sum + Math.round((12 + wordCount * 8) * genericPenalty);
        }, 0);
        const tokenScore = queryWords.filter((word) => tokens.includes(word)).length * 8;
        return { record, score: phraseScore + aliasScore + tokenScore };
      })
      .sort((a, b) => b.score - a.score);

    const comparable = createComparableRecord(query);
    if (!scored.length) return comparable;
    const topRecord = scored[0].record;
    const topScore = scored[0].score;
    const topRecordTitleMatch = normalized === String(topRecord.title || "").toLowerCase();
    const topRecordAliasMatch = (topRecord.aliases || []).some((alias) => normalized === String(alias).toLowerCase());
    const topRecordAreaInQuery = normalized.includes(String(topRecord.area || "").toLowerCase()) ||
      (topRecord.aliases || []).some((alias) => {
        const normalizedAlias = String(alias).toLowerCase();
        return normalized.includes(normalizedAlias) && !genericSearchAliases.has(normalizedAlias);
      });

    if (topScore >= 16 && (topRecordTitleMatch || topRecordAliasMatch || topRecordAreaInQuery)) return topRecord;
    if (comparable && !topRecordAreaInQuery && topScore < 40) return comparable;
    if (topScore >= 16) return topRecord;
    return comparable;
  };
}

function loadBatchJsonFiles() {
  const appSource = fs.readFileSync(appPath, "utf8");
  return appSource.match(/\.\/data\/rentintel-sample-data-batch-[^"']+\.json/g) || [];
}

function loadMergedPayload() {
  const basePayload = JSON.parse(fs.readFileSync(baseJsonPath, "utf8"));
  const batchPayloads = loadBatchJsonFiles().map((relativePath) => {
    const absolutePath = path.join(projectRoot, relativePath.slice(2));
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  });
  return mergeSamplePayloads(basePayload, batchPayloads);
}

function auditRecords(records) {
  const findRecord = findRecordFactory(records);
  const exactTitleFailures = [];
  const baseTitleFailures = [];
  const aliasFailures = [];
  const duplicateAliasMap = new Map();
  const aliasOwners = new Map();

  for (const record of records) {
    const exact = findRecord(record.title);
    if (!exact || exact.id !== record.id) {
      exactTitleFailures.push({ query: record.title, expected: record.id, got: exact?.id || null });
    }

    const baseTitle = String(record.title || "").replace(/\s+retail$/i, "").trim();
    if (baseTitle) {
      const resolved = findRecord(baseTitle);
      if (!resolved || resolved.id !== record.id) {
        baseTitleFailures.push({ query: baseTitle, expected: record.id, got: resolved?.id || null });
      }
    }

    for (const alias of record.aliases || []) {
      const normalizedAlias = String(alias || "").trim().toLowerCase();
      if (!normalizedAlias || genericSearchAliases.has(normalizedAlias) || normalizedAlias.length < 3) continue;
      if (!aliasOwners.has(normalizedAlias)) aliasOwners.set(normalizedAlias, []);
      aliasOwners.get(normalizedAlias).push(record.id);
    }
  }

  for (const [alias, owners] of aliasOwners.entries()) {
    if (owners.length > 1) duplicateAliasMap.set(alias, owners);
  }

  for (const record of records) {
    for (const alias of record.aliases || []) {
      const normalizedAlias = String(alias || "").trim().toLowerCase();
      if (!normalizedAlias || genericSearchAliases.has(normalizedAlias) || normalizedAlias.length < 3) continue;
      if ((duplicateAliasMap.get(normalizedAlias) || []).length > 1) continue;
      const resolved = findRecord(normalizedAlias);
      if (!resolved || resolved.id !== record.id) {
        aliasFailures.push({ query: normalizedAlias, expected: record.id, got: resolved?.id || null });
      }
    }
  }

  return {
    totalRecords: records.length,
    exactTitleFailures,
    baseTitleFailures,
    aliasFailures,
    duplicateAliasCollisions: Array.from(duplicateAliasMap.entries()).map(([alias, owners]) => ({ alias, owners }))
  };
}

function main() {
  const mergedPayload = loadMergedPayload();
  const audit = auditRecords(mergedPayload.records);
  const summary = {
    version: mergedPayload.version,
    updatedAt: mergedPayload.updatedAt,
    totalRecords: audit.totalRecords,
    exactTitleFailures: audit.exactTitleFailures.length,
    baseTitleFailures: audit.baseTitleFailures.length,
    aliasFailures: audit.aliasFailures.length,
    duplicateAliasCollisions: audit.duplicateAliasCollisions.length
  };

  const wantsJson = process.argv.includes("--json");
  if (wantsJson) {
    process.stdout.write(JSON.stringify({ summary, audit }, null, 2));
  } else {
    console.log("RentIntel search audit");
    console.log(JSON.stringify(summary, null, 2));
    if (audit.exactTitleFailures[0]) console.log("First exact-title failure:", audit.exactTitleFailures[0]);
    if (audit.baseTitleFailures[0]) console.log("First base-title failure:", audit.baseTitleFailures[0]);
    if (audit.aliasFailures[0]) console.log("First alias failure:", audit.aliasFailures[0]);
    if (audit.duplicateAliasCollisions[0]) console.log("First alias collision:", audit.duplicateAliasCollisions[0]);
  }

  const hasFailures =
    audit.exactTitleFailures.length ||
    audit.baseTitleFailures.length ||
    audit.aliasFailures.length;
  process.exit(hasFailures ? 1 : 0);
}

main();
