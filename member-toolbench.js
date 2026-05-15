const toolbenchColors = {
  ink: "#18201b",
  muted: "#68746e",
  grid: "#dcd8cf",
  official: "#196b55",
  asking: "#b64636",
  bg: "#fffdf9"
};

const memberSessionKey = "rentintelMemberSession";
const savedReportsKey = "rentintelSavedReports";
const backendSavedReportsKey = "rentintelBackendSavedReports";
const watchlistKey = "rentintelWatchlistAreas";
const alertRulesKey = "rentintelAlertRules";
const toolbenchPreviewRecordKey = "rentintelToolbenchPreviewRecord";
const coverageRecordsKey = "rentintelCoverageRecords";
const freshnessPolicyKey = "rentintelFreshnessSlaPolicy";

let toolbenchSession = null;
let toolbenchRecords = [];
let toolbenchRecord = null;
let toolbenchRange = "5";
let toolbenchFeedState = null;

const toolbenchEl = {
  accessCard: document.getElementById("toolbenchAccessCard"),
  accessLabel: document.getElementById("toolbenchAccessLabel"),
  accessTitle: document.getElementById("toolbenchAccessTitle"),
  accessCopy: document.getElementById("toolbenchAccessCopy"),
  accountLink: document.getElementById("toolbenchAccountLink"),
  form: document.getElementById("memberToolbenchSearch"),
  input: document.getElementById("memberToolbenchInput"),
  picks: document.getElementById("memberToolbenchPicks"),
  searchStatus: document.getElementById("memberToolbenchSearchStatus"),
  confidence: document.getElementById("toolbenchConfidence"),
  resultTitle: document.getElementById("toolbenchResultTitle"),
  decision: document.getElementById("toolbenchDecision"),
  reason: document.getElementById("toolbenchReason"),
  pulseToolbenchLabel: document.getElementById("pulseToolbenchLabel"),
  pulseToolbenchTitle: document.getElementById("pulseToolbenchTitle"),
  pulseToolbenchCopy: document.getElementById("pulseToolbenchCopy"),
  official: document.getElementById("toolbenchOfficialMetric"),
  asking: document.getElementById("toolbenchAskingMetric"),
  fairRange: document.getElementById("toolbenchFairRangeMetric"),
  gap: document.getElementById("toolbenchGapMetric"),
  actionLabel: document.getElementById("toolbenchActionLabel"),
  actionCopy: document.getElementById("toolbenchActionCopy"),
  sourceCopy: document.getElementById("toolbenchSourceCopy"),
  sourceQaPanel: document.getElementById("toolbenchSourceQaPanel"),
  sourceQaStatus: document.getElementById("toolbenchSourceQaStatus"),
  sourceQaChecks: document.getElementById("toolbenchSourceQaChecks"),
  sourceQaCaptured: document.getElementById("toolbenchSourceQaCaptured"),
  sourceQaProduction: document.getElementById("toolbenchSourceQaProduction"),
  sourceQaWarning: document.getElementById("toolbenchSourceQaWarning"),
  signalDrivers: document.getElementById("toolbenchSignalDrivers"),
  spineConfidenceTitle: document.getElementById("spineConfidenceTitle"),
  spineConfidenceCopy: document.getElementById("spineConfidenceCopy"),
  spineBenchmarkTrust: document.getElementById("spineBenchmarkTrust"),
  spineBenchmarkCopy: document.getElementById("spineBenchmarkCopy"),
  spineNegotiationPosition: document.getElementById("spineNegotiationPosition"),
  spineNegotiationCopy: document.getElementById("spineNegotiationCopy"),
  spineMemberAccess: document.getElementById("spineMemberAccess"),
  spineMemberCopy: document.getElementById("spineMemberCopy"),
  evidencePack: document.getElementById("workspaceEvidencePack"),
  evidencePackSummary: document.getElementById("workspaceEvidencePackSummary"),
  evidencePackTrust: document.getElementById("evidencePackTrust"),
  evidencePackTrustCopy: document.getElementById("evidencePackTrustCopy"),
  evidencePackBenchmark: document.getElementById("evidencePackBenchmark"),
  evidencePackBenchmarkCopy: document.getElementById("evidencePackBenchmarkCopy"),
  evidencePackAsking: document.getElementById("evidencePackAsking"),
  evidencePackAskingCopy: document.getElementById("evidencePackAskingCopy"),
  evidencePackAction: document.getElementById("evidencePackAction"),
  evidencePackActionCopy: document.getElementById("evidencePackActionCopy"),
  sourceTimeline: document.getElementById("workspaceSourceTimeline"),
  sourceTimelineSummary: document.getElementById("workspaceSourceTimelineSummary"),
  sourceTimelineList: document.getElementById("workspaceSourceTimelineList"),
  chartCard: document.getElementById("memberChartCard"),
  chartKicker: document.getElementById("memberChartKicker"),
  chartTitle: document.getElementById("memberChartTitle"),
  chartFairRangeMetric: document.getElementById("chartFairRangeMetric"),
  chartGapMetric: document.getElementById("chartGapMetric"),
  chartReadMetric: document.getElementById("chartReadMetric"),
  chartContextNote: document.getElementById("chartContextNote"),
  chart: document.getElementById("memberRentChart"),
  evidencePanel: document.getElementById("memberEvidencePanel"),
  evidenceSummary: document.getElementById("evidenceSummary"),
  evidenceSourceStateItem: document.getElementById("evidenceSourceStateItem"),
  evidenceSourceStateMetric: document.getElementById("evidenceSourceStateMetric"),
  evidenceSourceStateCopy: document.getElementById("evidenceSourceStateCopy"),
  evidenceBenchmarkTrustItem: document.getElementById("evidenceBenchmarkTrustItem"),
  evidenceBenchmarkTrustMetric: document.getElementById("evidenceBenchmarkTrustMetric"),
  evidenceBenchmarkTrustCopy: document.getElementById("evidenceBenchmarkTrustCopy"),
  evidenceAskingSourceItem: document.getElementById("evidenceAskingSourceItem"),
  evidenceAskingSourceMetric: document.getElementById("evidenceAskingSourceMetric"),
  evidenceAskingSourceCopy: document.getElementById("evidenceAskingSourceCopy"),
  evidenceProductionReadinessItem: document.getElementById("evidenceProductionReadinessItem"),
  evidenceProductionReadinessMetric: document.getElementById("evidenceProductionReadinessMetric"),
  evidenceProductionReadinessCopy: document.getElementById("evidenceProductionReadinessCopy"),
  evidenceLastCheckedItem: document.getElementById("evidenceLastCheckedItem"),
  evidenceLastCheckedMetric: document.getElementById("evidenceLastCheckedMetric"),
  evidenceLastCheckedCopy: document.getElementById("evidenceLastCheckedCopy"),
  evidencePeriodMetric: document.getElementById("evidencePeriodMetric"),
  evidenceSpreadMetric: document.getElementById("evidenceSpreadMetric"),
  evidenceOfficialMetric: document.getElementById("evidenceOfficialMetric"),
  evidenceAskingMetric: document.getElementById("evidenceAskingMetric"),
  evidenceBenchmarkLayer: document.getElementById("evidenceBenchmarkLayer"),
  evidenceAskingLayer: document.getElementById("evidenceAskingLayer"),
  evidenceCoverageLayer: document.getElementById("evidenceCoverageLayer"),
  evidenceTrustNote: document.getElementById("evidenceTrustNote"),
  exportEvidenceButton: document.getElementById("exportEvidenceButton"),
  evidenceStatus: document.getElementById("evidenceStatus"),
  evidenceTableBody: document.getElementById("evidenceTableBody"),
  calculatorPanel: document.getElementById("negotiationCalculatorPanel"),
  workflowCheckStep: document.getElementById("workflowCheckStep"),
  workflowTargetStep: document.getElementById("workflowTargetStep"),
  workflowOfferStep: document.getElementById("workflowOfferStep"),
  workflowActionStep: document.getElementById("workflowActionStep"),
  calculatorSummary: document.getElementById("calculatorSummary"),
  calculatorForm: document.getElementById("negotiationCalculatorForm"),
  calculatorUnitSize: document.getElementById("calculatorUnitSize"),
  calculatorAskingPsf: document.getElementById("calculatorAskingPsf"),
  calculatorTargetPsf: document.getElementById("calculatorTargetPsf"),
  useFairHighButton: document.getElementById("useFairHighButton"),
  useOfficialButton: document.getElementById("useOfficialButton"),
  calculatorCurrentMonthly: document.getElementById("calculatorCurrentMonthly"),
  calculatorTargetMonthly: document.getElementById("calculatorTargetMonthly"),
  calculatorMonthlyImpact: document.getElementById("calculatorMonthlyImpact"),
  calculatorAnnualImpact: document.getElementById("calculatorAnnualImpact"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  scenarioTableBody: document.getElementById("scenarioTableBody"),
  offerSummary: document.getElementById("offerSummary"),
  offerBuilderForm: document.getElementById("offerBuilderForm"),
  offerPsfInput: document.getElementById("offerPsfInput"),
  walkAwayPsfInput: document.getElementById("walkAwayPsfInput"),
  leaseMonthsInput: document.getElementById("leaseMonthsInput"),
  rentFreeMonthsInput: document.getElementById("rentFreeMonthsInput"),
  useFairLowOfferButton: document.getElementById("useFairLowOfferButton"),
  useFairHighWalkButton: document.getElementById("useFairHighWalkButton"),
  appendOfferNoteButton: document.getElementById("appendOfferNoteButton"),
  offerMonthlyMetric: document.getElementById("offerMonthlyMetric"),
  walkAwayMonthlyMetric: document.getElementById("walkAwayMonthlyMetric"),
  rentFreeValueMetric: document.getElementById("rentFreeValueMetric"),
  leaseExposureMetric: document.getElementById("leaseExposureMetric"),
  offerBuilderStatus: document.getElementById("offerBuilderStatus"),
  calculatorStatus: document.getElementById("calculatorStatus"),
  saveButton: document.getElementById("toolbenchSaveReportButton"),
  watchButton: document.getElementById("toolbenchWatchAreaButton"),
  exportButton: document.getElementById("toolbenchExportButton"),
  publicResultLink: document.getElementById("toolbenchPublicResultLink"),
  actionStatus: document.getElementById("toolbenchActionStatus"),
  saveStateMetric: document.getElementById("saveStateMetric"),
  saveConfidenceMetric: document.getElementById("saveConfidenceMetric"),
  saveTargetMetric: document.getElementById("saveTargetMetric"),
  saveOfferMetric: document.getElementById("saveOfferMetric"),
  saveNoteMetric: document.getElementById("saveNoteMetric"),
  alertRulePanel: document.getElementById("memberAlertRulePanel"),
  alertRuleSummary: document.getElementById("alertRuleSummary"),
  alertRuleForm: document.getElementById("alertRuleForm"),
  alertTriggerSelect: document.getElementById("alertTriggerSelect"),
  alertTargetPsfInput: document.getElementById("alertTargetPsfInput"),
  alertGapLimitInput: document.getElementById("alertGapLimitInput"),
  alertCadenceSelect: document.getElementById("alertCadenceSelect"),
  useWalkAwayAlertButton: document.getElementById("useWalkAwayAlertButton"),
  useAskingGapAlertButton: document.getElementById("useAskingGapAlertButton"),
  appendAlertRuleNoteButton: document.getElementById("appendAlertRuleNoteButton"),
  alertConditionMetric: document.getElementById("alertConditionMetric"),
  alertCadenceMetric: document.getElementById("alertCadenceMetric"),
  alertStoredMetric: document.getElementById("alertStoredMetric"),
  alertRuleStatus: document.getElementById("alertRuleStatus"),
  savedCount: document.getElementById("toolbenchSavedCount"),
  savedReports: document.getElementById("toolbenchSavedReports"),
  watchCount: document.getElementById("toolbenchWatchCount"),
  watchlist: document.getElementById("toolbenchWatchlist"),
  noteLabel: document.getElementById("toolbenchNoteLabel"),
  note: document.getElementById("toolbenchNegotiationNote"),
  copyNoteButton: document.getElementById("toolbenchCopyNoteButton"),
  downloadNoteButton: document.getElementById("toolbenchDownloadNoteButton"),
  noteStatus: document.getElementById("toolbenchNoteStatus")
};

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function loadStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}.`, error);
    return fallback;
  }
}

function writeStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function queryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function currentAskingFeed() {
  return toolbenchFeedState || window.RENTINTEL_ASKING_RENT_FEED || { records: [] };
}

function enrichToolbenchOneMapRecords(records) {
  return window.RentIntelOneMapAdapter?.enrichRecords
    ? window.RentIntelOneMapAdapter.enrichRecords(records, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : records;
}

function enrichToolbenchOneMapRecord(record) {
  return window.RentIntelOneMapAdapter?.enrichRecord
    ? window.RentIntelOneMapAdapter.enrichRecord(record, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : record;
}

async function loadToolbenchAskingFeed() {
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("../../api/sources/asking-feed", { cache: "no-store" });
      if (!response.ok) throw new Error(`Asking feed request failed: ${response.status}`);
      const payload = await response.json();
      if (Array.isArray(payload.feed?.records)) return payload.feed;
    } catch (error) {
      console.warn("RentIntel toolbench feed API load failed; checking local preview mirror.", error);
    }
  }
  return window.RENTINTEL_ASKING_RENT_FEED || { records: [] };
}

function mergeAskingRentFeed(records) {
  const feed = currentAskingFeed();
  if (window.RentIntelAskingFeedAdapter?.mergeRecords) {
    const merged = window.RentIntelAskingFeedAdapter.mergeRecords(records, feed, {
      sampleUpdatedAt: window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
    });
    toolbenchFeedState = merged.feed;
    return merged.records;
  }
  const feedRecords = Array.isArray(feed?.records) ? feed.records : [];
  toolbenchFeedState = feed;
  if (!feedRecords.length) return records;
  const byRecordId = new Map(feedRecords.map((item) => [item.recordId, item]));
  return records.map((record) => {
    const asking = byRecordId.get(record.id);
    if (!asking) return record;
    const official = Number(record.official);
    const askingValue = Number(asking.asking);
    const gap = official ? Math.round(((askingValue - official) / official) * 100) : record.gap;
    const series = Array.isArray(record.series)
      ? record.series.map((point, index, list) =>
          index === list.length - 1 && Number.isFinite(Number(asking.latestAskingMedian))
            ? [point[0], point[1], Number(asking.latestAskingMedian)]
            : point
        )
      : record.series;
    const feedSummary = `Asking feed: ${feed.sourceName || "pilot asking feed"} (${asking.listingCount || 0} checks, ${asking.freshness || "pilot"}, ${asking.capturedAt || feed.updatedAt}).`;
    return {
      ...record,
      asking: askingValue,
      fairRange: asking.fairRange || record.fairRange,
      gap,
      series,
      askingSourceStatus: feed.connectionState || "pilot-manual-feed-connected",
      askingSource: {
        sourceName: feed.sourceName || "",
        sourceType: feed.sourceType || "",
        listingCount: asking.listingCount || 0,
        capturedAt: asking.capturedAt || feed.updatedAt || "",
        productionReady: Boolean(feed.productionReady),
        note: asking.note || feed.note || ""
      },
      sourceSummary: `${record.sourceSummary} ${feedSummary}`
    };
  });
}

function coveragePrototypeRecords() {
  return loadStoredJson(coverageRecordsKey, []).filter((record) =>
    record?.id && record?.title && Array.isArray(record?.aliases) && !isInvalidCoverageRecord(record)
  );
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (text.includes("farm") && text.includes("hdb retail")) {
    return { status: "blocked", eligible: false };
  }
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) {
    return { status: "manual", eligible: false };
  }
  return { status: "eligible", eligible: true };
}

function isInvalidCoverageText(value = "") {
  return coverageEligibilityProfile(value).status === "blocked";
}

function isInvalidCoverageRecord(record = {}) {
  return isInvalidCoverageText([
    record.id,
    record.title,
    record.area,
    record.propertyType,
    ...(Array.isArray(record.aliases) ? record.aliases : [])
  ].filter(Boolean).join(" "));
}

function sanitizeCoverageRecords() {
  const records = loadStoredJson(coverageRecordsKey, []);
  const cleanRecords = records.filter((record) => !isInvalidCoverageRecord(record));
  if (cleanRecords.length !== records.length) writeStoredJson(coverageRecordsKey, cleanRecords);
}

function mergeCoverageRecords(records) {
  const merged = new Map();
  records.forEach((record) => merged.set(record.id, record));
  coveragePrototypeRecords().forEach((record) => merged.set(record.id, record));
  return [...merged.values()];
}

function money(value) {
  return `S$${Number(value).toFixed(2)} psf`;
}

function dollars(value) {
  return `S$${Math.round(Number(value)).toLocaleString("en-SG")}`;
}

function moneyRange(range) {
  if (!range) return "Not available";
  return `${money(range.low)}-${money(range.high)}`;
}

function formatShortDate(value) {
  if (!value) return "Not connected";
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function freshnessPolicy() {
  const stored = loadStoredJson(freshnessPolicyKey, {}) || {};
  const freshMaxDays = Math.max(1, Math.min(60, Number(stored.freshMaxDays) || 7));
  const watchCandidate = Math.max(freshMaxDays + 1, Number(stored.watchMaxDays) || 14);
  const watchMaxDays = Math.max(freshMaxDays + 1, Math.min(90, watchCandidate));
  return {
    freshMaxDays,
    watchMaxDays
  };
}

function sourceFreshnessProfile(value) {
  const policy = freshnessPolicy();
  const freshMaxDays = Number(policy.freshMaxDays);
  const watchMaxDays = Number(policy.watchMaxDays);
  const watchLower = freshMaxDays + 1;
  if (!value) {
    return {
      state: "stale",
      label: "Stale",
      detail: "No captured date is connected."
    };
  }
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      state: "stale",
      label: "Stale",
      detail: "Captured date format is invalid."
    };
  }
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days <= freshMaxDays) {
    return {
      state: "fresh",
      label: "Fresh",
      detail: `${days} day${days === 1 ? "" : "s"} since latest capture (SLA <= ${freshMaxDays} days).`
    };
  }
  if (days <= watchMaxDays) {
    return {
      state: "watch",
      label: "Watch",
      detail: `${days} days since latest capture (SLA watch: ${watchLower}-${watchMaxDays} days).`
    };
  }
  return {
    state: "stale",
    label: "Stale",
    detail: `${days} days since latest capture (SLA stale: >${watchMaxDays} days).`
  };
}

function sourceQaProfile(record) {
  const feed = currentAskingFeed();
  const source = record?.askingSource;
  if (!source) {
    return {
      status: "Comparable estimate",
      checks: "0",
      captured: "Not connected",
      freshnessState: "stale",
      freshnessLabel: "Stale",
      freshnessDetail: "No captured date is connected.",
      production: "Not ready",
      ready: false,
      warning: "Direct asking-rent source is not connected for this comparable estimate. Request source coverage before relying on it."
    };
  }
  const freshness = sourceFreshnessProfile(source.capturedAt || feed.updatedAt || "");
  const productionReady = Boolean(source.productionReady);
  const status = source.sourceType === "verified-manual-capture" ? "Pilot manual feed" : source.sourceName || "Asking feed";
  return {
    status,
    checks: `${source.listingCount || 0}`,
    captured: formatShortDate(source.capturedAt || feed.updatedAt || ""),
    freshnessState: freshness.state,
    freshnessLabel: freshness.label,
    freshnessDetail: freshness.detail,
    production: productionReady ? "Ready" : "Not ready",
    ready: productionReady,
    warning: productionReady
      ? `${freshness.detail} Asking-rent source is production-ready; still verify unit-specific lease terms, GST, service charge, and permitted use.`
      : `${freshness.detail} Pilot manual asking feed is connected, but production still needs licensed feed or verified daily capture workflow with QA logs.`
  };
}

const toolbenchComparableProfiles = [
  { area: "Ang Mo Kio", aliases: ["ang mo kio", "amk"], official: 8.8, asking: 11.5, cluster: "mature heartland" },
  { area: "Bedok", aliases: ["bedok", "bedok central"], official: 8.6, asking: 11.1, cluster: "mature heartland" },
  { area: "Bishan", aliases: ["bishan", "junction 8"], official: 9.6, asking: 12.8, cluster: "mature heartland" },
  { area: "Boon Lay", aliases: ["boon lay", "jurong west"], official: 7.8, asking: 9.9, cluster: "heartland" },
  { area: "Bukit Batok", aliases: ["bukit batok", "bt batok"], official: 7.9, asking: 10.2, cluster: "heartland" },
  { area: "Bukit Merah", aliases: ["bukit merah", "redhill", "tiong bahru"], official: 10.2, asking: 13.6, cluster: "city fringe" },
  { area: "Bukit Panjang", aliases: ["bukit panjang", "bt panjang"], official: 7.6, asking: 9.7, cluster: "heartland" },
  { area: "Bukit Timah", aliases: ["bukit timah", "sixth avenue", "beauty world"], official: 12.4, asking: 15.7, cluster: "prime fringe" },
  { area: "Bugis", aliases: ["bugis", "arab street", "kampong glam", "bras basah"], official: 14.2, asking: 18.4, cluster: "city fringe" },
  { area: "Choa Chu Kang", aliases: ["choa chu kang", "cck"], official: 7.3, asking: 9.3, cluster: "heartland" },
  { area: "City Hall", aliases: ["city hall", "raffles city", "stamford"], official: 18.6, asking: 22.7, cluster: "cbd" },
  { area: "Clementi", aliases: ["clementi", "clementi central"], official: 8.7, asking: 11.4, cluster: "mature heartland" },
  { area: "Geylang", aliases: ["geylang", "aljunied", "paya lebar fringe"], official: 11.6, asking: 15.1, cluster: "city fringe" },
  { area: "HarbourFront", aliases: ["harbourfront", "vivocity", "telok blangah"], official: 20.2, asking: 23.1, cluster: "destination mall" },
  { area: "Hougang", aliases: ["hougang", "kovan"], official: 8.4, asking: 10.8, cluster: "heartland" },
  { area: "Joo Chiat", aliases: ["joo chiat", "katong", "east coast shophouse"], official: 12.2, asking: 15.9, cluster: "shophouse fringe" },
  { area: "Kallang", aliases: ["kallang", "lavender", "boon keng"], official: 10.7, asking: 13.7, cluster: "city fringe" },
  { area: "Little India", aliases: ["little india", "farrer park", "serangoon road"], official: 12.8, asking: 16.6, cluster: "city fringe" },
  { area: "Marine Parade", aliases: ["marine parade", "parkway", "east coast"], official: 11.2, asking: 14.2, cluster: "mature heartland" },
  { area: "Novena", aliases: ["novena", "balestier", "thomson"], official: 13.5, asking: 16.8, cluster: "city fringe" },
  { area: "Outram", aliases: ["outram", "keong saik", "neil road", "tanjong pagar shophouse"], official: 13.4, asking: 17.4, cluster: "shophouse fringe" },
  { area: "Pasir Ris", aliases: ["pasir ris", "white sands"], official: 7.4, asking: 9.7, cluster: "heartland" },
  { area: "Punggol", aliases: ["punggol", "waterway point"], official: 7.7, asking: 10.4, cluster: "new town" },
  { area: "Queenstown", aliases: ["queenstown", "commonwealth", "holland village"], official: 10.4, asking: 13.4, cluster: "city fringe" },
  { area: "Raffles Place", aliases: ["raffles place", "cbd", "cecil street", "tanjong pagar"], official: 19.4, asking: 23.8, cluster: "cbd" },
  { area: "River Valley", aliases: ["river valley", "robertson quay", "clarke quay"], official: 13.8, asking: 17.6, cluster: "prime fringe" },
  { area: "Sengkang", aliases: ["sengkang", "compassvale", "compass one"], official: 7.8, asking: 10.2, cluster: "new town" },
  { area: "Sembawang", aliases: ["sembawang"], official: 7.2, asking: 9.1, cluster: "heartland" },
  { area: "Toa Payoh", aliases: ["toa payoh", "tp hdb hub", "hdb hub"], official: 9.3, asking: 12.1, cluster: "mature heartland" },
  { area: "Woodlands", aliases: ["woodlands", "causeway point"], official: 7.7, asking: 10.1, cluster: "heartland" },
  { area: "Yishun", aliases: ["yishun", "northpoint"], official: 7.8, asking: 10.2, cluster: "heartland" }
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferToolbenchPropertyType(query, profile) {
  if (/\b(shop\s*house|shophouse|conservation)\b/.test(query)) {
    return { label: "Shophouse retail", modifier: 1.28, actionNoun: "frontage and approved use" };
  }
  if (/\b(mall|shopping|plaza|centre|center|point|junction)\b/.test(query)) {
    return { label: "Shopping centre retail", modifier: profile.cluster.includes("mall") ? 1.05 : 1.18, actionNoun: "mall traffic and floor position" };
  }
  if (/\b(hdb|heartland|coffee\s*shop|coffeeshop|void deck|neighbourhood|neighborhood)\b/.test(query)) {
    return { label: "HDB retail", modifier: 1, actionNoun: "frontage, permitted use, and observed footfall" };
  }
  return { label: profile.cluster.includes("cbd") ? "CBD retail" : "Neighbourhood retail", modifier: profile.cluster.includes("cbd") ? 1.18 : 1.04, actionNoun: "frontage, permitted use, and footfall" };
}

function toolbenchComparableSeries(official, asking) {
  const labels = ["2021 Q1", "2021 Q3", "2022 Q1", "2022 Q3", "2023 Q1", "2023 Q3", "2024 Q1", "2024 Q3", "2025 Q1", "2025 Q3"];
  const officialCurve = [0.78, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1, 1.02];
  const askingCurve = [0.72, 0.75, 0.79, 0.84, 0.89, 0.93, 0.97, 1, 1, 1.03];
  return labels.map((label, index) => [
    label,
    Number((official * officialCurve[index]).toFixed(1)),
    Number((asking * askingCurve[index]).toFixed(1))
  ]);
}

function createToolbenchComparableRecord(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!coverageEligibilityProfile(normalized).eligible) return null;
  const profile = toolbenchComparableProfiles
    .map((item) => ({
      profile: item,
      match: item.aliases
        .map((alias) => alias.toLowerCase())
        .filter((alias) => normalized.includes(alias))
        .sort((a, b) => b.length - a.length)[0]
    }))
    .filter((item) => item.match)
    .sort((a, b) => b.match.length - a.match.length)[0]?.profile;
  if (!profile) return null;

  const inferredType = inferToolbenchPropertyType(normalized, profile);
  const official = Number((profile.official * inferredType.modifier).toFixed(1));
  const asking = Number((profile.asking * inferredType.modifier).toFixed(1));
  const gap = Math.round(((asking - official) / official) * 100);
  const high = Number(Math.max(official * 1.18, official + 1.2).toFixed(1));
  const low = Number((official * 0.95).toFixed(1));
  const titleType = inferredType.label === "HDB retail" ? inferredType.label : inferredType.label.toLowerCase();
  const title = `${profile.area} ${titleType}`;

  return enrichToolbenchOneMapRecord({
    id: `estimate-${slugify(profile.area)}-${slugify(inferredType.label)}`,
    aliases: [...profile.aliases, `${profile.area.toLowerCase()} ${inferredType.label.toLowerCase()}`],
    title,
    propertyType: inferredType.label,
    area: profile.area,
    confidence: "Comparable estimate",
    decision: gap >= 22 ? "Asking rent looks high against comparable area benchmarks." : "Asking rent needs comparable validation.",
    reason: `No direct RentIntel record is connected for ${profile.area} yet, so this workspace preview uses comparable ${profile.cluster} retail signals until source coverage is connected.`,
    official,
    asking,
    gap,
    daily: `${title} is estimated near ${money(asking)}, about ${gap}% above a comparable benchmark of ${money(official)}.`,
    series: toolbenchComparableSeries(official, asking),
    fairRange: { low, high },
    actionLabel: gap >= 22 ? "Push back" : gap >= 10 ? "Validate premium" : "Fair range",
    action: `${gap >= 22 ? "Push back" : "Validate premium"} above ${money(high)} unless the unit has strong ${inferredType.actionNoun}.`,
    sourceSummary: `Comparable estimate only. Production should replace this with URA/HDB benchmark, OneMap classification, and verified asking-rent feed coverage.`,
    mobileSummary: `${gap >= 22 ? "Likely high" : "Needs validation"}. Comparable estimate for ${profile.area}; confirm direct asking evidence before committing.`
  });
}

function hasToolbenchAccess() {
  return true;
}

function ensureToolbenchSession() {
  if (toolbenchSession?.email) return toolbenchSession;
  toolbenchSession = {
    email: "free@rent-intel.com",
    memberStatus: "Free tools user",
    subscriptionStatus: "Free access active",
    access: "free",
    toolsEnabled: false,
    signedInAt: new Date().toISOString()
  };
  return toolbenchSession;
}

function toolbenchAccessState() {
  ensureToolbenchSession();
  if (toolbenchSession.access === "free") {
    return {
      key: "free",
      label: "Free access",
      title: "Workspace open",
      copy: "This workspace is free to use. Search, save reports, watch areas, export notes, and review the evidence layer without activation.",
      chart: "Workspace chart"
    };
  }
  if (toolbenchSession.access === "promo") {
    return {
      key: "promo",
      label: "Pilot access",
      title: "Promo Workspace active",
      copy: `Signed in as ${toolbenchSession.email}. Pilot access can save reports, watch areas, and export negotiation notes.`,
      chart: "Pilot workspace chart"
    };
  }
  if (hasToolbenchAccess()) {
    return {
      key: "active",
      label: "Active workspace",
      title: "Workspace active",
      copy: `Signed in as ${toolbenchSession.email}. Save reports, watch areas, and export negotiation notes.`,
      chart: "Workspace chart"
    };
  }
  return {
    key: "free",
    label: "Free access",
    title: "Workspace open",
    copy: `${toolbenchSession.email} can use the workspace freely. Internal admin tools stay restricted elsewhere.`,
    chart: "Workspace chart"
  };
}

function signalDrivers(record) {
  if (Array.isArray(record?.drivers) && record.drivers.length) return record.drivers;
  const property = String(record?.propertyType || "").toLowerCase();
  const area = String(record?.area || "").toLowerCase();
  if (area.includes("chinatown") || property.includes("shophouse")) {
    return [
      "Tourism and dining activity are supporting stronger asking rents.",
      "Limited shophouse supply keeps comparable options tight.",
      "F&B approvals and frontage premiums can justify part of the gap.",
      "Asking-rent momentum is above the transaction-backed benchmark."
    ];
  }
  if (area.includes("orchard") || property.includes("mall")) {
    return [
      "Prime mall frontage supports a higher rent premium.",
      "Footfall, floor level, and tenant mix can explain wide rent dispersion.",
      "Tourist spend can lift asking expectations.",
      "Asking momentum should be checked against recent transaction evidence."
    ];
  }
  if (property.includes("hdb") || property.includes("heartland")) {
    return [
      "MRT spillover and daily neighbourhood traffic can raise asking expectations.",
      "Permitted use, corner frontage, and F&B approval can move rent materially.",
      "Comparable HDB-linked benchmarks suggest the premium needs negotiation.",
      "Recent asking momentum should be validated against observed footfall."
    ];
  }
  return [
    "Comparable area pressure is above the direct benchmark range.",
    "Frontage, permitted use, and fit-out value may explain part of the premium.",
    "Asking-rent momentum needs confirmation before committing.",
    "Use the Workspace evidence layer to separate market premium from landlord ask."
  ];
}

function confidenceProfile(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) {
    return {
      title: "Coverage request",
      copy: "Preview estimate only. Direct benchmark coverage still needs source connection.",
      trust: "Low trust",
      evidence: "Request queue plus comparable estimate"
    };
  }
  if (confidence.includes("comparable")) {
    return {
      title: "Comparable estimate",
      copy: "Uses area similarity and property-type inference until direct transaction coverage is connected.",
      trust: "Comparable trust",
      evidence: "Area profile, not direct record"
    };
  }
  if (confidence.includes("high")) {
    return {
      title: "High confidence",
      copy: "Official benchmark and asking signal are aligned enough for a firmer rent position.",
      trust: "Strong benchmark",
      evidence: "Transaction benchmark plus asking signal"
    };
  }
  if (confidence.includes("medium")) {
    return {
      title: "Medium confidence",
      copy: "Good enough for negotiation framing, but unit-specific frontage, use, and fit-out still matter.",
      trust: "Review evidence",
      evidence: "Benchmark plus partial asking signal"
    };
  }
  return {
    title: record?.confidence || "Review confidence",
    copy: "Use the evidence rows and source split before treating this as a final rent position.",
    trust: "Needs review",
    evidence: "Source validation required"
  };
}

function benchmarkTrust(record) {
  const type = String(record?.propertyType || "").toLowerCase();
  if (record?.prototypeSource === "coverage-request") {
    return {
      officialLayer: "Comparable benchmark",
      askingLayer: "Requested source",
      trustNote: "Do not rely on this until direct coverage is connected."
    };
  }
  if (type.includes("hdb")) {
    return {
      officialLayer: "HDB-linked benchmark",
      askingLayer: "Heartland asking signal",
      trustNote: "Check permitted use, frontage, and MRT spillover before accepting premium."
    };
  }
  if (type.includes("shophouse")) {
    return {
      officialLayer: "URA-linked retail trend",
      askingLayer: "Shophouse listing signal",
      trustNote: "Classification, F&B approval, and frontage can widen rent dispersion."
    };
  }
  if (type.includes("mall") || type.includes("shopping")) {
    return {
      officialLayer: "Prime retail benchmark",
      askingLayer: "Mall asking signal",
      trustNote: "Validate floor level, frontage, traffic, and tenant mix before accepting premium."
    };
  }
  return {
    officialLayer: "Retail benchmark",
    askingLayer: "Asking-rent signal",
    trustNote: "Confirm comparable quality and unit-specific premium before committing."
  };
}

function sourceTrustProfile(record) {
  return window.RentIntelSourceTrust?.profile(record, {
    feed: currentAskingFeed()
  }) || {
    key: "sample",
    level: "sample",
    title: "Sample",
    reason: "Sample benchmark signal.",
    action: "Verify direct asking evidence before committing."
  };
}

function renderToolbenchPulse(record) {
  if (!record || !toolbenchEl.pulseToolbenchLabel) return;
  const pulse = pulseSummaryForRecord(record);
  const root =
    toolbenchEl.pulseToolbenchLabel.closest(".workspace-brief-card") ||
    toolbenchEl.pulseToolbenchLabel.closest(".pulse-callout");
  if (root) root.dataset.pulseTone = pulse.tone;
  toolbenchEl.pulseToolbenchLabel.textContent = pulse.label;
  toolbenchEl.pulseToolbenchTitle.textContent = pulse.title;
  toolbenchEl.pulseToolbenchCopy.textContent = `${pulse.summary} Next: ${pulse.nextStep}`;
}

function setupPulseInteractions(root = document) {
  const placePulsePopover = (pulse) => {
    const popover = pulse.querySelector(":scope > div");
    if (!popover) return;
    pulse.dataset.popoverX = "right";
    pulse.dataset.popoverY = "bottom";
    requestAnimationFrame(() => {
      const rect = popover.getBoundingClientRect();
      const padding = 14;
      if (rect.left < padding) {
        pulse.dataset.popoverX = "left";
      } else if (rect.right > window.innerWidth - padding) {
        pulse.dataset.popoverX = "right";
      }
      if (rect.bottom > window.innerHeight - padding && rect.top > rect.height + padding) {
        pulse.dataset.popoverY = "top";
      }
    });
  };

  root.querySelectorAll(".pulse-callout").forEach((pulse) => {
    if (pulse.dataset.pulseReady === "true") return;
    pulse.dataset.pulseReady = "true";
    pulse.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = pulse.dataset.open !== "true";
      root.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((item) => {
        if (item !== pulse) {
          item.dataset.open = "false";
          item.setAttribute("aria-expanded", "false");
        }
      });
      pulse.dataset.open = String(willOpen);
      pulse.setAttribute("aria-expanded", String(willOpen));
      window.clearTimeout(Number(pulse.dataset.closeTimer || 0));
      if (willOpen) {
        placePulsePopover(pulse);
        const closeTimer = window.setTimeout(() => {
          pulse.dataset.open = "false";
          pulse.setAttribute("aria-expanded", "false");
          pulse.dataset.closeTimer = "";
        }, 7200);
        pulse.dataset.closeTimer = String(closeTimer);
      }
    });
    pulse.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        pulse.dataset.open = "false";
        pulse.setAttribute("aria-expanded", "false");
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      pulse.click();
    });
  });
  if (document.body.dataset.pulseCloseReady === "true") return;
  document.body.dataset.pulseCloseReady = "true";
  document.addEventListener("click", (event) => {
    if (event.target.closest(".pulse-callout")) return;
    document.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((pulse) => {
      pulse.dataset.open = "false";
      pulse.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((pulse) => {
      pulse.dataset.open = "false";
      pulse.setAttribute("aria-expanded", "false");
    });
  });
}

function pulseSummaryForRecord(record) {
  if (!record) {
    return {
      label: "Pulse Summary",
      tone: "member",
      title: "Load a rent signal first.",
      summary: "Search one retail area and Pulse will condense the rent read, source state, and next move.",
      warning: "No report context is selected.",
      nextStep: "Search or select a rent benchmark.",
      caveat: "Pulse explains the RentIntel signal; it is not valuation advice."
    };
  }
  const qa = sourceQaProfile(record);
  const confidence = confidenceProfile(record);
  const sourceTrust = sourceTrustProfile(record);
  const fairHigh = record.fairRange?.high || record.official;
  const gap = Number(record.gap || 0);
  const sourceCaveat = qa.ready
    ? "Production source is marked ready; still check lease terms, GST, service charge, permitted use, and handover condition."
    : `Asking source is ${qa.production.toLowerCase()}; treat this as a working position until source caveats are checked.`;

  if (!qa.ready) {
    return {
      label: "Pulse Warning",
      tone: "warning",
      title: "Use this as a working position, not a final answer.",
      summary: `${confidence.title}. ${sourceTrust.title}.`,
      warning: sourceCaveat,
      nextStep: `Review source caveats before using ${money(fairHigh)}.`,
      caveat: "Pulse explains the RentIntel signal; it is not valuation advice."
    };
  }

  if (gap >= 18) {
    return {
      label: "Pulse Decision Note",
      tone: "member",
      title: "Prepare the negotiation note before speaking to the landlord.",
      summary: `Use ${money(fairHigh)} psf as the working upper line.`,
      warning: "The asking gap is high. Do not accept the premium without unit-specific proof.",
      nextStep: "Save the report, export the note, and ask for comparable evidence.",
      caveat: "Pulse explains the RentIntel signal; it is not valuation advice."
    };
  }

  return {
    label: "Pulse Summary",
    tone: "summary",
    title: "The decision is mainly about evidence quality now.",
    summary: `${confidence.title}. Evidence quality is the key decision point.`,
    warning: gap >= 8 ? "There is still a rent premium. Validate the reason before accepting." : "No large premium flagged, but commercial terms still matter.",
    nextStep: "Save the report if the source caveat and lease terms are acceptable.",
    caveat: "Pulse explains the RentIntel signal; it is not valuation advice."
  };
}

function renderDecisionSpine(record) {
  if (!record || !toolbenchEl.spineConfidenceTitle) return;
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const access = hasToolbenchAccess();
  const fairHigh = record.fairRange?.high || record.official;
  const fairLow = record.fairRange?.low || record.official;

  toolbenchEl.spineConfidenceTitle.textContent = confidence.title;
  toolbenchEl.spineConfidenceCopy.textContent = confidence.copy;
  toolbenchEl.spineBenchmarkTrust.textContent = sourceTrust.title;
  toolbenchEl.spineBenchmarkCopy.textContent = `${trust.officialLayer}; ${trust.askingLayer}. ${sourceTrust.reason}`;
  toolbenchEl.spineNegotiationPosition.textContent = `Target ${moneyRange(record.fairRange)}`;
  toolbenchEl.spineNegotiationCopy.textContent =
    `Offer nearer ${money(fairLow)} and treat ${money(fairHigh)} as the upper defence unless the unit has clear premium evidence.`;
  toolbenchEl.spineMemberAccess.textContent = "Free tools active";
  toolbenchEl.spineMemberCopy.textContent =
    "Save the report, watch the area, export evidence, and prepare the landlord note.";
  renderToolbenchPulse(record);

  if (toolbenchEl.workflowCheckStep) {
    toolbenchEl.workflowCheckStep.textContent = confidence.title;
    toolbenchEl.workflowTargetStep.textContent = `Use ${moneyRange(record.fairRange)}`;
    toolbenchEl.workflowOfferStep.textContent = `${money(fairLow)} offer / ${money(fairHigh)} walk-away`;
    toolbenchEl.workflowActionStep.textContent = "Save report or export note";
  }
}

function renderWorkspaceEvidencePack(record) {
  if (!record || !toolbenchEl.evidencePackSummary) return;
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const qa = sourceQaProfile(record);
  const fairHigh = record.fairRange?.high || record.official;

  toolbenchEl.evidencePack.dataset.level = sourceTrust.level || sourceTrust.key || "sample";
  toolbenchEl.evidencePackSummary.textContent = `${record.title}: ${sourceTrust.title}`;
  toolbenchEl.evidencePackTrust.textContent = sourceTrust.title;
  toolbenchEl.evidencePackTrustCopy.textContent = `${sourceTrust.reason} ${sourceTrust.action}`;
  toolbenchEl.evidencePackBenchmark.textContent = confidence.title;
  toolbenchEl.evidencePackBenchmarkCopy.textContent = `${trust.officialLayer}. ${confidence.evidence}`;
  toolbenchEl.evidencePackAsking.textContent = qa.status;
  toolbenchEl.evidencePackAskingCopy.textContent =
    `${trust.askingLayer}. ${qa.checks} checks, captured ${qa.captured}, freshness ${qa.freshnessLabel.toLowerCase()}, production ${qa.production.toLowerCase()}.`;
  toolbenchEl.evidencePackAction.textContent = `Defend ${money(fairHigh)} psf`;
  toolbenchEl.evidencePackActionCopy.textContent =
    `${record.actionLabel}: ${record.action} Use the note and evidence rows before accepting the asking rent.`;
}

function renderWorkspaceSourceTimeline(record) {
  if (!record || !toolbenchEl.sourceTimelineList) return;
  const sourceTrust = sourceTrustProfile(record);
  const qa = sourceQaProfile(record);
  const source = record.askingSource || {};
  const hasDirectSource = Boolean(source.sourceName || source.sourceType);
  const hasEvidenceRows = evidenceRows(record).length > 0;
  const productionReady = qa.ready || sourceTrust.level === "released" || sourceTrust.title === "Production Verified";
  const steps = [
    {
      label: "Sample",
      title: hasEvidenceRows ? "Benchmark series loaded" : "Sample benchmark pending",
      done: hasEvidenceRows
    },
    {
      label: "Pilot",
      title: hasDirectSource ? source.sourceName || qa.status : "Comparable signal only",
      done: hasDirectSource || record.prototypeSource === "coverage-request"
    },
    {
      label: "QA",
      title: `${qa.checks} checks / ${qa.freshnessLabel.toLowerCase()} / captured ${qa.captured}`,
      done: Number(qa.checks) > 0
    },
    {
      label: "Production",
      title: productionReady ? "Production verified" : "Not ready",
      done: productionReady
    },
    {
      label: "Monitor",
      title: productionReady ? "Ready for release monitoring" : "Monitor after production release",
      done: sourceTrust.level === "released"
    }
  ];
  const currentIndex = Math.max(0, steps.findIndex((step) => !step.done));
  toolbenchEl.sourceTimeline.dataset.level = sourceTrust.level || "sample";
  toolbenchEl.sourceTimelineSummary.textContent = `${record.title}: ${sourceTrust.title}`;
  toolbenchEl.sourceTimelineList.replaceChildren();
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.dataset.state = step.done ? "done" : index === currentIndex ? "current" : "pending";
    const label = document.createElement("span");
    label.textContent = step.label;
    const title = document.createElement("strong");
    title.textContent = step.title;
    item.append(label, title);
    toolbenchEl.sourceTimelineList.append(item);
  });
}

function reportSaveMetadata(record, pack = reportDecisionPack()) {
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const target = pack.calculator?.targetPsf || record?.fairRange?.high || record?.official || 0;
  const offer = pack.offer?.offerPsf || record?.fairRange?.low || record?.official || 0;
  return {
    confidence: confidence.title,
    benchmarkTrust: sourceTrust.title,
    sourceTrust,
    officialLayer: trust.officialLayer,
    askingLayer: trust.askingLayer,
    trustNote: trust.trustNote,
    targetPsf: target,
    offerPsf: offer,
    walkAwayPsf: pack.offer?.walkAwayPsf || record?.fairRange?.high || record?.official || 0,
    noteStatus: toolbenchEl.note?.value ? "Ready" : "Draft",
    evidenceRows: pack.evidence?.rowCount || 0,
    latestPeriod: pack.evidence?.latestPeriod || "",
    pulseSummary: pack.pulse || pulseSummaryForRecord(record)
  };
}

function renderSaveState(report = savedReportForRecord(toolbenchRecord?.id)) {
  if (!toolbenchEl.saveStateMetric || !toolbenchRecord) return;
  const pack = report?.decisionPack || reportDecisionPack();
  const metadata = report?.saveMetadata || reportSaveMetadata(toolbenchRecord, pack);
  toolbenchEl.saveStateMetric.textContent = report?.savedAt
    ? `Saved ${new Date(report.savedAt).toLocaleDateString("en-SG", { day: "numeric", month: "short" })}`
    : "Not saved";
  toolbenchEl.saveConfidenceMetric.textContent = metadata.benchmarkTrust || metadata.confidence || toolbenchRecord.confidence;
  toolbenchEl.saveTargetMetric.textContent = metadata.targetPsf ? money(Number(metadata.targetPsf)) : "-";
  toolbenchEl.saveOfferMetric.textContent = metadata.offerPsf ? money(Number(metadata.offerPsf)) : "-";
  toolbenchEl.saveNoteMetric.textContent = metadata.noteStatus || (toolbenchEl.note?.value ? "Ready" : "Draft");
}

function findRecord(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return toolbenchRecord || toolbenchRecords[0];
  if (!coverageEligibilityProfile(normalized).eligible) return null;

  const exact = toolbenchRecords.find((record) =>
    record.id === normalized || record.aliases.some((alias) => normalized.includes(alias))
  );
  if (exact) return exact;

  const scored = toolbenchRecords
    .map((record) => {
      const tokens = [record.title, record.area, record.propertyType, ...record.aliases]
        .join(" ")
        .toLowerCase()
        .split(/\s+/);
      const score = normalized.split(/\s+/).filter((word) => tokens.includes(word)).length;
      return { record, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score >= 2) return scored[0].record;
  const comparable = createToolbenchComparableRecord(normalized);
  if (!comparable) return null;
  const existing = toolbenchRecords.find((record) => record.id === comparable.id);
  if (!existing) toolbenchRecords.push(comparable);
  return existing || comparable;
}

function previewHandoffRecord() {
  const record = loadStoredJson(toolbenchPreviewRecordKey, null);
  return record?.id && record?.title && Array.isArray(record?.series) ? record : null;
}

function mergePreviewHandoffRecord(records) {
  const preview = previewHandoffRecord();
  if (!preview) return records;
  const merged = new Map(records.map((record) => [record.id, record]));
  merged.set(preview.id, preview);
  return [...merged.values()];
}

function initialRecord() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("rent");
  return findRecord(requested) || toolbenchRecords[0] || null;
}

function reportStorageKey(report, email = toolbenchSession?.email) {
  return `${normalizeEmail(report?.memberEmail || email)}:${report?.recordId || ""}`;
}

function normalizeBackendReport(report, email = toolbenchSession?.email) {
  const memberEmail = normalizeEmail(report.memberEmail || email);
  const now = new Date().toISOString();
  return {
    ...report,
    reportId: report.reportId || reportStorageKey(report, memberEmail),
    memberEmail,
    decisionPack: report.decisionPack || null,
    negotiationNote: report.negotiationNote || "",
    savedAt: report.savedAt || now,
    updatedAt: report.updatedAt || now,
    backendStatus: "mock-synced"
  };
}

function savedReportStore() {
  const merged = new Map();
  loadStoredJson(savedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  loadStoredJson(backendSavedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  return [...merged.values()];
}

function writeSavedReportStore(reports) {
  const normalized = reports.map((report) => normalizeBackendReport(report));
  writeStoredJson(savedReportsKey, normalized);
  writeStoredJson(backendSavedReportsKey, normalized);
}

function currentMemberReports() {
  const email = normalizeEmail(toolbenchSession?.email);
  return savedReportStore().filter((report) => {
    if (!report.memberEmail) return true;
    return normalizeEmail(report.memberEmail) === email;
  });
}

function savedReportForRecord(recordId) {
  return currentMemberReports().find((report) => report.recordId === recordId) || null;
}

function savedReportByIdOrRecord(value) {
  if (!value) return null;
  return currentMemberReports().find((report) =>
    report.reportId === value ||
    report.recordId === value ||
    `${normalizeEmail(report.memberEmail)}:${report.recordId}` === value
  ) || null;
}

function initialSavedReport() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("report");
  return requested ? savedReportByIdOrRecord(requested) : null;
}

function watchlistRecords() {
  return loadStoredJson(watchlistKey, []);
}

function currentAlertRules() {
  const email = normalizeEmail(toolbenchSession?.email);
  return loadStoredJson(alertRulesKey, []).filter((rule) => {
    if (!rule.memberEmail) return true;
    return normalizeEmail(rule.memberEmail) === email;
  });
}

function alertRuleForRecord(recordId) {
  return currentAlertRules().find((rule) => rule.recordId === recordId) || null;
}

function filteredSeries() {
  if (!toolbenchRecord) return [];
  if (toolbenchRange === "all") return toolbenchRecord.series;
  return toolbenchRecord.series.slice(toolbenchRange === "3" ? -6 : -10);
}

function evidenceRows() {
  return filteredSeries().map((point) => {
    const official = Number(point[1]);
    const asking = Number(point[2]);
    const spread = Math.round(((asking - official) / official) * 100);
    return {
      period: point[0],
      official,
      asking,
      spread,
      signal: spread >= 20 ? "High asking premium" : spread >= 10 ? "Watch premium" : "Near fair range"
    };
  });
}

function setupCanvas(canvas) {
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  if (!canvas.dataset.baseWidth) {
    canvas.dataset.baseWidth = String(canvas.width);
    canvas.dataset.baseHeight = String(canvas.height);
  }
  const cssWidth = Number(canvas.dataset.baseWidth);
  const cssHeight = Number(canvas.dataset.baseHeight);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.width = cssWidth * ratio;
  canvas.height = cssHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: cssWidth, height: cssHeight };
}

function drawMemberChart() {
  if (!toolbenchRecord) return;
  const { context, width, height } = setupCanvas(toolbenchEl.chart);
  const series = filteredSeries();
  const values = series.flatMap((point) => [point[1], point[2]]);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const pad = { top: 38, right: 28, bottom: 58, left: 64 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  context.clearRect(0, 0, width, height);
  context.fillStyle = toolbenchColors.bg;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = toolbenchColors.grid;
  context.lineWidth = 1;
  context.fillStyle = toolbenchColors.muted;
  context.font = "12px Inter, system-ui, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (chartH / 4) * i;
    const value = max - ((max - min) / 4) * i;
    context.beginPath();
    context.moveTo(pad.left, y);
    context.lineTo(width - pad.right, y);
    context.stroke();
    context.fillText(`S$${value.toFixed(0)}`, 16, y + 4);
  }

  const xFor = (index) => pad.left + (chartW / Math.max(series.length - 1, 1)) * index;
  const yFor = (value) => pad.top + chartH - ((value - min) / (max - min)) * chartH;

  function line(index, stroke, label) {
    context.strokeStyle = stroke;
    context.lineWidth = 3;
    context.beginPath();
    series.forEach((point, i) => {
      const x = xFor(i);
      const y = yFor(point[index]);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();

    context.fillStyle = stroke;
    series.forEach((point, i) => {
      context.beginPath();
      context.arc(xFor(i), yFor(point[index]), 4, 0, Math.PI * 2);
      context.fill();
    });

    const last = series[series.length - 1];
    context.font = "13px Inter, system-ui, sans-serif";
    context.fillText(label, xFor(series.length - 1) - 112, yFor(last[index]) - 12);
  }

  line(1, toolbenchColors.official, "Official median");
  line(2, toolbenchColors.asking, "Asking median");

  context.fillStyle = toolbenchColors.muted;
  context.font = "12px Inter, system-ui, sans-serif";
  series.forEach((point, i) => {
    context.fillText(point[0].replace("20", "'"), xFor(i) - 18, height - 24);
  });

  context.fillStyle = toolbenchColors.ink;
  context.font = "700 14px Inter, system-ui, sans-serif";
  context.fillText("S$/psf/month", pad.left, 23);
}

function generateNote(record) {
  if (!record) return "Search or select a benchmark to generate the decision note.";
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const pulse = pulseSummaryForRecord(record);
  return [
    `RentIntel negotiation note: ${record.title}`,
    `Workspace session: ${toolbenchSession?.email || "No active saved-tools session"}`,
    `Generated: ${new Date().toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "Summary",
    `${record.decision} ${record.mobileSummary}`,
    "",
    "Pulse Summary",
    `${pulse.label}: ${pulse.title}`,
    `Decision: ${pulse.summary}`,
    `Next: ${pulse.nextStep}`,
    pulse.caveat,
    "",
    "Evidence",
    `Official median: ${money(record.official)}`,
    `Current asking: ${money(record.asking)}`,
    `Fair range: ${moneyRange(record.fairRange)}`,
    `Gap: ${record.gap > 0 ? "+" : ""}${record.gap}%`,
    "",
    "Signal confidence",
    `${confidence.title}: ${confidence.copy}`,
    "",
    "Why this signal",
    ...signalDrivers(record).map((driver) => `- ${driver}`),
    "",
    "Benchmark trust",
    `${trust.officialLayer}; ${trust.askingLayer}. ${trust.trustNote}`,
    "",
    "Offer position",
    record.action,
    `Start discussion near ${money(record.fairRange?.low || record.official)} if unit quality is standard.`,
    "",
    "Walk-away position",
    `Treat ${money(record.fairRange?.high || record.official)} as the upper defence unless premium frontage, permitted use, or fit-out value is clearly proven.`,
    "",
    "Landlord discussion points",
    "Ask for recent comparable evidence supporting the asking rent.",
    "Separate rent premium from service charge, fit-out, frontage, and permitted-use value.",
    "Request rent-free period or stepped rent if landlord will not move headline psf.",
    "",
    "Source split",
    record.sourceSummary,
    "",
    "Use this as a discussion note only. Confirm final terms, permitted use, frontage, fit-out condition, and legal/commercial advice before committing."
  ].join("\n");
}

function renderAccess() {
  const access = hasToolbenchAccess();
  const state = toolbenchAccessState();
  toolbenchEl.accessCard.dataset.access = state.key;
  toolbenchEl.chartCard.dataset.access = "active";
  toolbenchEl.evidencePanel.dataset.access = "active";
  toolbenchEl.calculatorPanel.dataset.access = "active";
  toolbenchEl.alertRulePanel.dataset.access = "active";
  toolbenchEl.accessLabel.textContent = state.label;
  toolbenchEl.accessTitle.textContent = state.title;
  toolbenchEl.accessCopy.textContent = state.copy;
  toolbenchEl.accountLink.textContent = "Open Saved Tools";
  toolbenchEl.chartKicker.textContent = state.chart;
  toolbenchEl.saveButton.disabled = false;
  toolbenchEl.watchButton.disabled = false;
  toolbenchEl.exportButton.disabled = false;
  toolbenchEl.exportEvidenceButton.disabled = false;
  [
    toolbenchEl.calculatorUnitSize,
    toolbenchEl.calculatorAskingPsf,
    toolbenchEl.calculatorTargetPsf,
    toolbenchEl.useFairHighButton,
    toolbenchEl.useOfficialButton,
    toolbenchEl.offerPsfInput,
    toolbenchEl.walkAwayPsfInput,
    toolbenchEl.leaseMonthsInput,
    toolbenchEl.rentFreeMonthsInput,
    toolbenchEl.useFairLowOfferButton,
    toolbenchEl.useFairHighWalkButton,
    toolbenchEl.appendOfferNoteButton,
    toolbenchEl.alertTriggerSelect,
    toolbenchEl.alertTargetPsfInput,
    toolbenchEl.alertGapLimitInput,
    toolbenchEl.alertCadenceSelect,
    toolbenchEl.useWalkAwayAlertButton,
    toolbenchEl.useAskingGapAlertButton,
    toolbenchEl.appendAlertRuleNoteButton,
    toolbenchEl.calculatorForm.querySelector("button")
  ].forEach((control) => {
    control.disabled = false;
  });
  toolbenchEl.offerBuilderForm.querySelector("button").disabled = false;
  toolbenchEl.alertRuleForm.querySelector("button").disabled = false;
  toolbenchEl.copyNoteButton.disabled = false;
  toolbenchEl.downloadNoteButton.disabled = false;
  renderDecisionSpine(toolbenchRecord);
}

function renderEvidenceTable() {
  if (!toolbenchRecord || !toolbenchEl.evidenceTableBody) return;
  const rows = evidenceRows();
  const latest = rows[rows.length - 1];
  const access = hasToolbenchAccess();
  const trust = benchmarkTrust(toolbenchRecord);
  const confidence = confidenceProfile(toolbenchRecord);
  const sourceTrust = sourceTrustProfile(toolbenchRecord);
  const qa = sourceQaProfile(toolbenchRecord);
  const source = toolbenchRecord.askingSource || {};
  const productionReady = qa.ready || sourceTrust.level === "released" || sourceTrust.title === "Production Verified";
  const stateFor = (ready, review = false) => ready ? "ready" : review ? "review" : "pending";

  toolbenchEl.evidenceSummary.textContent = `${toolbenchRecord.title}: ${rows.length} periods`;
  if (toolbenchEl.evidenceSourceStateMetric) {
    toolbenchEl.evidenceSourceStateItem.dataset.state = stateFor(Number(qa.checks) > 0, true);
    toolbenchEl.evidenceSourceStateMetric.textContent = qa.status;
    toolbenchEl.evidenceSourceStateCopy.textContent = Number(qa.checks) > 0
      ? `${qa.checks} asking checks captured.`
      : "No direct asking feed connected.";
    toolbenchEl.evidenceBenchmarkTrustItem.dataset.state = stateFor(sourceTrust.level === "production" || sourceTrust.level === "released" || sourceTrust.title.includes("Verified"), true);
    toolbenchEl.evidenceBenchmarkTrustMetric.textContent = sourceTrust.title;
    toolbenchEl.evidenceBenchmarkTrustCopy.textContent = confidence.evidence;
    toolbenchEl.evidenceAskingSourceItem.dataset.state = stateFor(Boolean(source.sourceName || source.sourceType), true);
    toolbenchEl.evidenceAskingSourceMetric.textContent = source.sourceName || qa.status;
    toolbenchEl.evidenceAskingSourceCopy.textContent = trust.askingLayer;
    toolbenchEl.evidenceProductionReadinessItem.dataset.state = stateFor(productionReady);
    toolbenchEl.evidenceProductionReadinessMetric.textContent = qa.production;
    toolbenchEl.evidenceProductionReadinessCopy.textContent = productionReady
      ? "Ready for production evidence use."
      : "Needs licensed feed or verified QA workflow.";
    toolbenchEl.evidenceLastCheckedItem.dataset.state = qa.freshnessState === "stale"
      ? "pending"
      : qa.freshnessState === "watch"
        ? "review"
        : "ready";
    toolbenchEl.evidenceLastCheckedMetric.textContent = `${qa.captured} (${qa.freshnessLabel})`;
    toolbenchEl.evidenceLastCheckedCopy.textContent = latest?.period
      ? `${qa.freshnessDetail} Latest chart period ${latest.period}.`
      : qa.freshnessDetail;
  }
  toolbenchEl.evidencePeriodMetric.textContent = String(rows.length);
  toolbenchEl.evidenceSpreadMetric.textContent = latest ? `${latest.spread > 0 ? "+" : ""}${latest.spread}%` : "-";
  toolbenchEl.evidenceOfficialMetric.textContent = latest ? money(latest.official) : "-";
  toolbenchEl.evidenceAskingMetric.textContent = latest ? money(latest.asking) : "-";
  if (toolbenchEl.evidenceBenchmarkLayer) {
    toolbenchEl.evidenceBenchmarkLayer.textContent = trust.officialLayer;
    toolbenchEl.evidenceAskingLayer.textContent = trust.askingLayer;
    toolbenchEl.evidenceCoverageLayer.textContent = `${sourceTrust.title}: ${rows.length} periods, ${confidence.evidence}`;
    toolbenchEl.evidenceTrustNote.textContent = `${sourceTrust.reason} ${sourceTrust.action}`;
  }
  toolbenchEl.evidenceStatus.textContent = "Evidence rows follow the selected chart range.";
  toolbenchEl.evidenceTableBody.replaceChildren();

  rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    const period = document.createElement("td");
    period.textContent = row.period;
    const official = document.createElement("td");
    official.textContent = money(row.official);
    const asking = document.createElement("td");
    asking.textContent = money(row.asking);
    const spread = document.createElement("td");
    spread.textContent = `${row.spread > 0 ? "+" : ""}${row.spread}%`;
    const signal = document.createElement("td");
    signal.textContent = row.signal;
    tableRow.dataset.signal = row.spread >= 20 ? "high" : row.spread >= 10 ? "watch" : "fair";
    tableRow.append(period, official, asking, spread, signal);
    toolbenchEl.evidenceTableBody.append(tableRow);
  });
}

function resetCalculatorDefaults(record) {
  if (!record || !toolbenchEl.calculatorForm) return;
  if (!toolbenchEl.calculatorUnitSize.value) toolbenchEl.calculatorUnitSize.value = "1000";
  toolbenchEl.calculatorAskingPsf.value = record.asking.toFixed(2);
  toolbenchEl.calculatorTargetPsf.value = (record.fairRange?.high || record.official).toFixed(2);
  renderCalculator();
}

function calculatorScenarioRows(size, asking) {
  if (!toolbenchRecord) return [];
  const fairHigh = toolbenchRecord.fairRange?.high || toolbenchRecord.official;
  const fairLow = toolbenchRecord.fairRange?.low || toolbenchRecord.official;
  return [
    {
      label: "Current asking",
      detail: "Landlord position",
      psf: asking,
      tone: "asking"
    },
    {
      label: "Fair high",
      detail: "Defensible upper target",
      psf: fairHigh,
      tone: "watch"
    },
    {
      label: "Official median",
      detail: "Transaction benchmark",
      psf: toolbenchRecord.official,
      tone: "benchmark"
    },
    {
      label: "Fair low",
      detail: "Aggressive negotiation",
      psf: fairLow,
      tone: "target"
    }
  ].map((row) => {
    const monthly = row.psf * size;
    return {
      ...row,
      monthly,
      annualImpact: (asking * size - monthly) * 12
    };
  });
}

function renderScenarioBoard(size, asking) {
  if (!toolbenchEl.scenarioTableBody) return;
  const rows = calculatorScenarioRows(size, asking);
  toolbenchEl.scenarioSummary.textContent = `${rows.length} target scenarios`;
  toolbenchEl.scenarioTableBody.replaceChildren();

  rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.dataset.tone = row.tone;

    const scenario = document.createElement("td");
    const title = document.createElement("strong");
    title.textContent = row.label;
    const detail = document.createElement("small");
    detail.textContent = row.detail;
    scenario.append(title, detail);

    const psf = document.createElement("td");
    psf.textContent = money(row.psf);
    const monthly = document.createElement("td");
    monthly.textContent = dollars(row.monthly);
    const impact = document.createElement("td");
    impact.textContent = `${row.annualImpact >= 0 ? "Save " : "Add "}${dollars(Math.abs(row.annualImpact))}`;

    const action = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Use target";
    button.disabled = false;
    button.addEventListener("click", () => {
      toolbenchEl.calculatorTargetPsf.value = row.psf.toFixed(2);
      renderCalculator();
    });
    action.append(button);

    tableRow.append(scenario, psf, monthly, impact, action);
    toolbenchEl.scenarioTableBody.append(tableRow);
  });
}

function resetOfferDefaults(record) {
  if (!record || !toolbenchEl.offerBuilderForm) return;
  if (!toolbenchEl.leaseMonthsInput.value) toolbenchEl.leaseMonthsInput.value = "36";
  if (!toolbenchEl.rentFreeMonthsInput.value) toolbenchEl.rentFreeMonthsInput.value = "1";
  toolbenchEl.offerPsfInput.value = (record.fairRange?.low || record.official).toFixed(2);
  toolbenchEl.walkAwayPsfInput.value = (record.fairRange?.high || record.official).toFixed(2);
  renderOfferBuilder();
}

function offerBuilderState() {
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const offer = Math.max(Number(toolbenchEl.offerPsfInput.value) || 0, 0);
  const walkAway = Math.max(Number(toolbenchEl.walkAwayPsfInput.value) || 0, 0);
  const leaseMonths = Math.max(Number(toolbenchEl.leaseMonthsInput.value) || 0, 0);
  const rentFreeMonths = Math.max(Number(toolbenchEl.rentFreeMonthsInput.value) || 0, 0);
  const offerMonthly = size * offer;
  const walkAwayMonthly = size * walkAway;
  const rentFreeValue = offerMonthly * Math.min(rentFreeMonths, leaseMonths);
  const leaseExposure = offerMonthly * Math.max(leaseMonths - rentFreeMonths, 0);
  const annualSaving = (asking * size - offerMonthly) * 12;
  return {
    size,
    asking,
    offer,
    walkAway,
    leaseMonths,
    rentFreeMonths,
    offerMonthly,
    walkAwayMonthly,
    rentFreeValue,
    leaseExposure,
    annualSaving
  };
}

function renderOfferBuilder() {
  if (!toolbenchRecord || !toolbenchEl.offerBuilderForm) return;
  const access = hasToolbenchAccess();
  const offer = offerBuilderState();
  toolbenchEl.offerSummary.textContent = `${money(offer.offer)} offer / ${money(offer.walkAway)} walk-away`;
  toolbenchEl.offerMonthlyMetric.textContent = dollars(offer.offerMonthly);
  toolbenchEl.walkAwayMonthlyMetric.textContent = dollars(offer.walkAwayMonthly);
  toolbenchEl.rentFreeValueMetric.textContent = dollars(offer.rentFreeValue);
  toolbenchEl.leaseExposureMetric.textContent = dollars(offer.leaseExposure);
  toolbenchEl.offerBuilderStatus.textContent =
    `Offer saves ${dollars(Math.abs(offer.annualSaving))} per year versus asking${offer.annualSaving >= 0 ? "." : " if asking is below offer."}`;
  renderSaveState(null);
}

function appendOfferToNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.offerBuilderStatus.textContent = "Open the free workspace to append the offer position.";
    return;
  }
  const offer = offerBuilderState();
  const section = [
    "",
    "Draft offer position",
    `Initial offer: ${money(offer.offer)} (${dollars(offer.offerMonthly)} per month for ${offer.size.toLocaleString("en-SG")} sq ft)`,
    `Walk-away point: ${money(offer.walkAway)} (${dollars(offer.walkAwayMonthly)} per month)`,
    `Lease term: ${offer.leaseMonths} months`,
    `Rent-free ask: ${offer.rentFreeMonths} months (${dollars(offer.rentFreeValue)} value at offer rent)`,
    `Lease exposure after rent-free period: ${dollars(offer.leaseExposure)}`,
    `Annual impact versus asking: ${offer.annualSaving >= 0 ? "save" : "add"} ${dollars(Math.abs(offer.annualSaving))}`
  ].join("\n");
  toolbenchEl.note.value = `${generateNote(toolbenchRecord)}${section}`;
  renderSaveState(null);
  toolbenchEl.offerBuilderStatus.textContent = "Offer position appended to the negotiation note.";
}

function alertCadenceLabel(cadence) {
  if (cadence === "weekly") return "Weekly";
  if (cadence === "source-refresh") return "When source refreshes";
  return "Daily";
}

function alertTriggerLabel(trigger) {
  if (trigger === "gap-above-limit") return "Asking premium rises above limit";
  if (trigger === "benchmark-changed") return "Official benchmark changes";
  if (trigger === "source-connected") return "Asking source sync connected";
  return "Asking rent falls to target";
}

function alertRuleState() {
  const trigger = toolbenchEl.alertTriggerSelect.value;
  const targetPsf = Math.max(Number(toolbenchEl.alertTargetPsfInput.value) || 0, 0);
  const gapLimit = Math.max(Number(toolbenchEl.alertGapLimitInput.value) || 0, 0);
  const cadence = toolbenchEl.alertCadenceSelect.value;
  return {
    trigger,
    targetPsf,
    gapLimit,
    cadence
  };
}

function alertConditionCopy(rule) {
  if (!toolbenchRecord || !rule) return "-";
  if (rule.trigger === "gap-above-limit") {
    return `Alert when asking premium is above +${Math.round(rule.gapLimit)}%. Current gap is ${toolbenchRecord.gap > 0 ? "+" : ""}${toolbenchRecord.gap}%.`;
  }
  if (rule.trigger === "benchmark-changed") {
    return `Alert when official benchmark changes from ${money(toolbenchRecord.official)}.`;
  }
  if (rule.trigger === "source-connected") {
    return "Alert when the live asking-rent source is connected for this area.";
  }
  return `Alert when asking rent is at or below ${money(rule.targetPsf)}. Current asking is ${money(toolbenchRecord.asking)}.`;
}

function resetAlertRuleDefaults(record) {
  if (!record || !toolbenchEl.alertRuleForm) return;
  const saved = alertRuleForRecord(record.id);
  toolbenchEl.alertTriggerSelect.value = saved?.trigger || "asking-below-target";
  toolbenchEl.alertTargetPsfInput.value = (saved?.targetPsf || record.fairRange?.high || record.official).toFixed(2);
  toolbenchEl.alertGapLimitInput.value = String(saved?.gapLimit || Math.max(record.gap, 20));
  toolbenchEl.alertCadenceSelect.value = saved?.cadence || "daily";
  renderAlertRule();
}

function renderAlertRule() {
  if (!toolbenchRecord || !toolbenchEl.alertRuleForm) return;
  const access = hasToolbenchAccess();
  const rule = alertRuleState();
  const saved = alertRuleForRecord(toolbenchRecord.id);
  toolbenchEl.alertRuleSummary.textContent = `${toolbenchRecord.area}: ${alertTriggerLabel(rule.trigger)}`;
  toolbenchEl.alertConditionMetric.textContent = alertConditionCopy(rule);
  toolbenchEl.alertCadenceMetric.textContent = alertCadenceLabel(rule.cadence);
  toolbenchEl.alertStoredMetric.textContent = saved ? "Saved" : "Not saved";
  toolbenchEl.alertRuleStatus.textContent = saved
    ? `Saved ${alertCadenceLabel(saved.cadence).toLowerCase()} alert for ${toolbenchRecord.area}.`
    : "Save this rule to watch the selected area from saved tools.";
}

function saveAlertRule() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.alertRuleStatus.textContent = "Open the free workspace to save area alert rules.";
    return;
  }
  const rule = alertRuleState();
  const rules = loadStoredJson(alertRulesKey, []).filter((item) => {
    const sameRecord = item.recordId === toolbenchRecord.id;
    const sameMember = normalizeEmail(item.memberEmail || toolbenchSession.email) === normalizeEmail(toolbenchSession.email);
    return !(sameRecord && sameMember);
  });
  rules.unshift({
    recordId: toolbenchRecord.id,
    memberEmail: normalizeEmail(toolbenchSession.email),
    area: toolbenchRecord.area,
    title: toolbenchRecord.title,
    trigger: rule.trigger,
    targetPsf: rule.targetPsf,
    gapLimit: rule.gapLimit,
    cadence: rule.cadence,
    condition: alertConditionCopy(rule),
    savedAt: new Date().toISOString()
  });
  writeStoredJson(alertRulesKey, rules);
  watchArea({ silent: true });
  renderAlertRule();
  renderWatchlist();
  toolbenchEl.alertRuleStatus.textContent = `${toolbenchRecord.area} alert rule saved.`;
}

function appendAlertRuleToNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.alertRuleStatus.textContent = "Open the free workspace to append area alert rules.";
    return;
  }
  const rule = alertRuleState();
  const section = [
    "",
    "Area alert rule",
    `Trigger: ${alertTriggerLabel(rule.trigger)}`,
    `Condition: ${alertConditionCopy(rule)}`,
    `Cadence: ${alertCadenceLabel(rule.cadence)}`
  ].join("\n");
  toolbenchEl.note.value = `${generateNote(toolbenchRecord)}${section}`;
  renderSaveState(null);
  toolbenchEl.alertRuleStatus.textContent = "Alert rule appended to the negotiation note.";
}

function reportDecisionPack() {
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const target = Math.max(Number(toolbenchEl.calculatorTargetPsf.value) || 0, 0);
  const offer = offerBuilderState();
  const alert = alertRuleState();
  const rows = evidenceRows();
  const latest = rows[rows.length - 1] || null;
  return {
    calculator: {
      unitSize: size,
      askingPsf: asking,
      targetPsf: target,
      currentMonthly: size * asking,
      targetMonthly: size * target,
      monthlyImpact: size * asking - size * target,
      annualImpact: (size * asking - size * target) * 12
    },
    offer: {
      offerPsf: offer.offer,
      walkAwayPsf: offer.walkAway,
      leaseMonths: offer.leaseMonths,
      rentFreeMonths: offer.rentFreeMonths,
      offerMonthly: offer.offerMonthly,
      walkAwayMonthly: offer.walkAwayMonthly,
      rentFreeValue: offer.rentFreeValue,
      leaseExposure: offer.leaseExposure,
      annualSaving: offer.annualSaving
    },
    alert: {
      trigger: alert.trigger,
      triggerLabel: alertTriggerLabel(alert.trigger),
      targetPsf: alert.targetPsf,
      gapLimit: alert.gapLimit,
      cadence: alert.cadence,
      cadenceLabel: alertCadenceLabel(alert.cadence),
      condition: alertConditionCopy(alert)
    },
    evidence: {
      chartRange: toolbenchRange,
      rowCount: rows.length,
      latestPeriod: latest?.period || "",
      latestSpread: latest?.spread ?? null
    },
    pulse: pulseSummaryForRecord(toolbenchRecord)
  };
}

function setActiveChartRange(range) {
  if (!range) return;
  toolbenchRange = range;
  document.querySelectorAll("[data-member-range]").forEach((button) => {
    button.classList.toggle("active", button.dataset.memberRange === range);
  });
  drawMemberChart();
  renderEvidenceTable();
}

function restoreSavedReport(report, options = {}) {
  if (!report?.decisionPack || !toolbenchRecord) return;
  const { calculator = {}, offer = {}, alert = {}, evidence = {} } = report.decisionPack;

  if (calculator.unitSize) toolbenchEl.calculatorUnitSize.value = String(calculator.unitSize);
  if (calculator.askingPsf) toolbenchEl.calculatorAskingPsf.value = Number(calculator.askingPsf).toFixed(2);
  if (calculator.targetPsf) toolbenchEl.calculatorTargetPsf.value = Number(calculator.targetPsf).toFixed(2);

  if (offer.offerPsf) toolbenchEl.offerPsfInput.value = Number(offer.offerPsf).toFixed(2);
  if (offer.walkAwayPsf) toolbenchEl.walkAwayPsfInput.value = Number(offer.walkAwayPsf).toFixed(2);
  if (offer.leaseMonths) toolbenchEl.leaseMonthsInput.value = String(offer.leaseMonths);
  if (offer.rentFreeMonths || offer.rentFreeMonths === 0) toolbenchEl.rentFreeMonthsInput.value = String(offer.rentFreeMonths);

  if (alert.trigger) toolbenchEl.alertTriggerSelect.value = alert.trigger;
  if (alert.targetPsf) toolbenchEl.alertTargetPsfInput.value = Number(alert.targetPsf).toFixed(2);
  if (alert.gapLimit) toolbenchEl.alertGapLimitInput.value = String(alert.gapLimit);
  if (alert.cadence) toolbenchEl.alertCadenceSelect.value = alert.cadence;

  renderCalculator();
  renderOfferBuilder();
  renderAlertRule();
  if (evidence.chartRange) setActiveChartRange(evidence.chartRange);
  if (report.negotiationNote) toolbenchEl.note.value = report.negotiationNote;
  renderSaveState(report);
  if (options.announce) {
    toolbenchEl.searchStatus.textContent = `${report.title} saved decision pack restored.`;
  }
}

function renderCalculator() {
  if (!toolbenchRecord || !toolbenchEl.calculatorForm) return;
  const access = hasToolbenchAccess();
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const target = Math.max(Number(toolbenchEl.calculatorTargetPsf.value) || 0, 0);
  const currentMonthly = size * asking;
  const targetMonthly = size * target;
  const monthlyImpact = currentMonthly - targetMonthly;
  const annualImpact = monthlyImpact * 12;

  toolbenchEl.calculatorSummary.textContent = `${toolbenchRecord.area}: ${size.toLocaleString("en-SG")} sq ft`;
  toolbenchEl.calculatorCurrentMonthly.textContent = dollars(currentMonthly);
  toolbenchEl.calculatorTargetMonthly.textContent = dollars(targetMonthly);
  toolbenchEl.calculatorMonthlyImpact.textContent = `${monthlyImpact >= 0 ? "Save " : "Add "}${dollars(Math.abs(monthlyImpact))}`;
  toolbenchEl.calculatorAnnualImpact.textContent = `${annualImpact >= 0 ? "Save " : "Add "}${dollars(Math.abs(annualImpact))}`;
  toolbenchEl.calculatorStatus.textContent = `Every S$1.00 psf equals ${dollars(size)} per month for this unit size.`;
  renderScenarioBoard(size, asking);
  renderOfferBuilder();
  renderSaveState(null);
}

function renderRecord(record) {
  if (!record) return;
  toolbenchRecord = record;
  toolbenchEl.input.value = record.title;
  toolbenchEl.confidence.textContent = record.confidence;
  toolbenchEl.resultTitle.textContent = record.title;
  toolbenchEl.decision.textContent = record.decision;
  toolbenchEl.reason.textContent = record.reason;
  toolbenchEl.official.textContent = money(record.official);
  toolbenchEl.asking.textContent = money(record.asking);
  toolbenchEl.fairRange.textContent = moneyRange(record.fairRange);
  toolbenchEl.gap.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  toolbenchEl.actionLabel.textContent = record.actionLabel;
  toolbenchEl.actionCopy.textContent = record.action;
  toolbenchEl.sourceCopy.textContent = record.oneMap?.planningArea
    ? `${record.sourceSummary} OneMap context: ${record.oneMap.planningArea}${record.oneMap.postalCode ? `, Singapore ${record.oneMap.postalCode}` : ""}.`
    : record.sourceSummary;
  if (toolbenchEl.sourceQaPanel) {
    const qa = sourceQaProfile(record);
    toolbenchEl.sourceQaPanel.dataset.ready = qa.ready ? "true" : "false";
    toolbenchEl.sourceQaPanel.dataset.freshness = qa.freshnessState;
    toolbenchEl.sourceQaStatus.textContent = qa.status;
    toolbenchEl.sourceQaChecks.textContent = qa.checks;
    toolbenchEl.sourceQaCaptured.textContent = `${qa.captured} (${qa.freshnessLabel})`;
    toolbenchEl.sourceQaProduction.textContent = qa.production;
    toolbenchEl.sourceQaWarning.textContent = qa.warning;
  }
  if (toolbenchEl.signalDrivers) {
    toolbenchEl.signalDrivers.replaceChildren();
    signalDrivers(record).forEach((driver) => {
      const item = document.createElement("li");
      item.textContent = driver;
      toolbenchEl.signalDrivers.append(item);
    });
  }
  if (toolbenchEl.publicResultLink) {
    const rentParam = encodeURIComponent(record.id || record.title);
    toolbenchEl.publicResultLink.href = `../../index.html?rent=${rentParam}#search`;
  }
  toolbenchEl.chartTitle.textContent = `${record.title}: historical rent psf`;
  if (toolbenchEl.chartFairRangeMetric) {
    toolbenchEl.chartFairRangeMetric.textContent = moneyRange(record.fairRange);
  }
  if (toolbenchEl.chartGapMetric) {
    toolbenchEl.chartGapMetric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  }
  if (toolbenchEl.chartReadMetric) {
    toolbenchEl.chartReadMetric.textContent = confidenceProfile(record).title;
  }
  if (toolbenchEl.chartContextNote) {
    toolbenchEl.chartContextNote.textContent =
      `${record.actionLabel}: compare the asking line against the benchmark trend before accepting the rent.`;
  }
  toolbenchEl.noteLabel.textContent = hasToolbenchAccess() ? "Ready" : "Locked";
  toolbenchEl.note.value = generateNote(record);
  renderDecisionSpine(record);
  renderWorkspaceEvidencePack(record);
  renderWorkspaceSourceTimeline(record);
  renderSaveState(savedReportForRecord(record.id));
  drawMemberChart();
  renderEvidenceTable();
  resetCalculatorDefaults(record);
  resetOfferDefaults(record);
  resetAlertRuleDefaults(record);
}

function renderQuickPicks() {
  toolbenchEl.picks.replaceChildren();
  toolbenchRecords.forEach((record) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = record.title;
    button.addEventListener("click", () => {
      renderRecord(record);
      toolbenchEl.searchStatus.textContent = `${record.title} loaded.`;
    });
    toolbenchEl.picks.append(button);
  });
}

function renderSavedReports() {
  const reports = currentMemberReports();
  toolbenchEl.savedCount.textContent = `${reports.length} saved`;
  toolbenchEl.savedReports.replaceChildren();
  if (!reports.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = "No saved reports yet. Save any workspace brief you want to revisit, compare, or export later.";
    toolbenchEl.savedReports.append(empty);
    return;
  }
  reports.slice(0, 8).forEach((report) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "saved-report-item";
    const title = document.createElement("strong");
    title.textContent = report.title;
    const meta = document.createElement("span");
    const savedAt = report.savedAt
      ? new Date(report.savedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })
      : "Saved report";
    const saveMetadata = report.saveMetadata || {};
    const targetMonthly = report.decisionPack?.calculator?.targetMonthly;
    meta.textContent = targetMonthly
      ? `${money(report.asking)} asking | ${dollars(targetMonthly)} target monthly`
      : `${money(report.asking)} asking | ${report.gap > 0 ? "+" : ""}${report.gap}% gap`;
    const detail = document.createElement("small");
    detail.textContent = `${saveMetadata.benchmarkTrust || report.confidence || "Saved"} | ${saveMetadata.noteStatus || "Note ready"} | ${savedAt}`;
    button.append(title, meta, detail);
    button.addEventListener("click", () => {
      const record = toolbenchRecords.find((item) => item.id === report.recordId);
      if (record) {
        renderRecord(record);
        restoreSavedReport(report, { announce: true });
      }
    });
    toolbenchEl.savedReports.append(button);
  });
}

function renderWatchlist() {
  const watchlist = watchlistRecords();
  toolbenchEl.watchCount.textContent = `${watchlist.length} watching`;
  toolbenchEl.watchlist.replaceChildren();
  if (!watchlist.length) {
    const empty = document.createElement("p");
    empty.textContent = "No watchlist areas yet.";
    toolbenchEl.watchlist.append(empty);
    return;
  }
  watchlist.slice(0, 8).forEach((item) => {
    const record = toolbenchRecords.find((entry) => entry.id === item.recordId);
    if (!record) return;
    const rule = alertRuleForRecord(record.id);
    const row = document.createElement("div");
    row.className = "watchlist-item";
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = record.area;
    const detail = document.createElement("small");
    detail.textContent = rule ? `${alertTriggerLabel(rule.trigger)} | ${alertCadenceLabel(rule.cadence)}` : record.mobileSummary;
    copy.append(title, detail);
    const open = document.createElement("button");
    open.type = "button";
    open.textContent = "Open";
    open.addEventListener("click", () => renderRecord(record));
    row.append(copy, open);
    toolbenchEl.watchlist.append(row);
  });
}

function saveReport() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const decisionPack = reportDecisionPack();
  const saveMetadata = reportSaveMetadata(toolbenchRecord, decisionPack);
  const pulseSummary = decisionPack.pulse || pulseSummaryForRecord(toolbenchRecord);
  const savedAt = new Date().toISOString();
  const reports = savedReportStore().filter((report) => {
    const sameRecord = report.recordId === toolbenchRecord.id;
    const sameMember = normalizeEmail(report.memberEmail || toolbenchSession.email) === normalizeEmail(toolbenchSession.email);
    return !(sameRecord && sameMember);
  });
  reports.unshift(normalizeBackendReport({
    recordId: toolbenchRecord.id,
    memberEmail: normalizeEmail(toolbenchSession.email),
    title: toolbenchRecord.title,
    decision: toolbenchRecord.decision,
    asking: toolbenchRecord.asking,
    official: toolbenchRecord.official,
    gap: toolbenchRecord.gap,
    confidence: toolbenchRecord.confidence,
    pulseSummary,
    saveMetadata,
    decisionPack,
    negotiationNote: toolbenchEl.note.value,
    savedAt
  }));
  writeSavedReportStore(reports);
  renderSavedReports();
  renderSaveState(savedReportForRecord(toolbenchRecord.id));
  toolbenchEl.actionStatus.textContent =
    `${toolbenchRecord.title} saved with ${saveMetadata.benchmarkTrust}, ${money(saveMetadata.targetPsf)} target, and ${saveMetadata.noteStatus.toLowerCase()} negotiation note.`;
}

function watchArea(options = {}) {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const watchlist = watchlistRecords().filter((item) => item.recordId !== toolbenchRecord.id);
  watchlist.unshift({
    recordId: toolbenchRecord.id,
    area: toolbenchRecord.area,
    addedAt: new Date().toISOString()
  });
  writeStoredJson(watchlistKey, watchlist);
  renderWatchlist();
  if (!options.silent) {
    toolbenchEl.actionStatus.textContent = `${toolbenchRecord.area} added to watchlist.`;
  }
}

function downloadNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const blob = new Blob([toolbenchEl.note.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${toolbenchRecord.id}-rentintel-negotiation-note.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toolbenchEl.noteStatus.textContent = "Negotiation note prepared.";
}

function exportEvidenceCsv() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.evidenceStatus.textContent = "Open the free workspace to export evidence rows.";
    return;
  }
  const rows = evidenceRows();
  const csvRows = [
    ["period", "official_median_psf", "asking_median_psf", "spread_percent", "signal"],
    ...rows.map((row) => [
      row.period,
      row.official.toFixed(2),
      row.asking.toFixed(2),
      String(row.spread),
      row.signal
    ])
  ];
  const csv = csvRows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${toolbenchRecord.id}-rentintel-evidence.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toolbenchEl.evidenceStatus.textContent = `${rows.length} evidence rows exported.`;
}

async function copyNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  try {
    await navigator.clipboard.writeText(toolbenchEl.note.value);
    toolbenchEl.noteStatus.textContent = "Negotiation note copied.";
  } catch (error) {
    toolbenchEl.note.select();
    document.execCommand("copy");
    toolbenchEl.noteStatus.textContent = "Copy was blocked by the browser. Note text is selected.";
  }
}

async function initToolbench() {
  sanitizeCoverageRecords();
  if (window.RentIntelAuth?.restoreSession) {
    const restored = await window.RentIntelAuth.restoreSession();
    toolbenchSession = restored.session || loadStoredJson(memberSessionKey, null);
  } else {
    toolbenchSession = loadStoredJson(memberSessionKey, null);
  }
  ensureToolbenchSession();
  const liveFeed = await loadToolbenchAskingFeed();
  toolbenchFeedState = window.RentIntelAskingFeedAdapter?.normalizeFeed
    ? window.RentIntelAskingFeedAdapter.normalizeFeed(liveFeed, {
      fallbackUpdatedAt: window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
    })
    : (liveFeed || { records: [] });
  const sampleRecords = Array.isArray(window.RENTINTEL_SAMPLE_DATA?.records) ? window.RENTINTEL_SAMPLE_DATA.records : [];
  toolbenchRecords = mergePreviewHandoffRecord(enrichToolbenchOneMapRecords(mergeCoverageRecords(mergeAskingRentFeed(sampleRecords))));
  if (!toolbenchRecords.length) {
    toolbenchEl.searchStatus.textContent = "RentIntel sample data is unavailable.";
    return;
  }
  setupPulseInteractions();

  renderAccess();
  renderQuickPicks();
  const savedReport = initialSavedReport();
  const startingRecord = savedReport
    ? toolbenchRecords.find((record) => record.id === savedReport.recordId)
    : initialRecord();
  renderRecord(startingRecord);
  if (savedReport) restoreSavedReport(savedReport, { announce: true });
  renderSavedReports();
  renderWatchlist();

  toolbenchEl.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const record = findRecord(toolbenchEl.input.value);
    if (!record) {
      toolbenchEl.searchStatus.textContent =
        "No recognized area yet. Try Ang Mo Kio shop, Bedok HDB retail, Toa Payoh HDB, Orchard mall, or Chinatown shophouse.";
      return;
    }
    renderRecord(record);
    toolbenchEl.searchStatus.textContent = `${record.title} loaded.`;
  });

  document.querySelectorAll("[data-member-range]").forEach((button) => {
    button.addEventListener("click", () => {
      toolbenchRange = button.dataset.memberRange;
      document.querySelectorAll("[data-member-range]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      drawMemberChart();
      renderEvidenceTable();
    });
  });

  toolbenchEl.saveButton.addEventListener("click", saveReport);
  toolbenchEl.watchButton.addEventListener("click", watchArea);
  toolbenchEl.exportEvidenceButton.addEventListener("click", exportEvidenceCsv);
  toolbenchEl.calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderCalculator();
  });
  [toolbenchEl.calculatorUnitSize, toolbenchEl.calculatorAskingPsf, toolbenchEl.calculatorTargetPsf].forEach((input) => {
    input.addEventListener("input", renderCalculator);
  });
  toolbenchEl.useFairHighButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.calculatorTargetPsf.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderCalculator();
  });
  toolbenchEl.useOfficialButton.addEventListener("click", () => {
    if (!toolbenchRecord) return;
    toolbenchEl.calculatorTargetPsf.value = toolbenchRecord.official.toFixed(2);
    renderCalculator();
  });
  toolbenchEl.offerBuilderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderOfferBuilder();
  });
  [
    toolbenchEl.offerPsfInput,
    toolbenchEl.walkAwayPsfInput,
    toolbenchEl.leaseMonthsInput,
    toolbenchEl.rentFreeMonthsInput
  ].forEach((input) => {
    input.addEventListener("input", renderOfferBuilder);
  });
  toolbenchEl.useFairLowOfferButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.offerPsfInput.value = toolbenchRecord.fairRange.low.toFixed(2);
    renderOfferBuilder();
  });
  toolbenchEl.useFairHighWalkButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.walkAwayPsfInput.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderOfferBuilder();
  });
  toolbenchEl.appendOfferNoteButton.addEventListener("click", appendOfferToNote);
  toolbenchEl.alertRuleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAlertRule();
  });
  [
    toolbenchEl.alertTriggerSelect,
    toolbenchEl.alertTargetPsfInput,
    toolbenchEl.alertGapLimitInput,
    toolbenchEl.alertCadenceSelect
  ].forEach((control) => {
    control.addEventListener("input", renderAlertRule);
    control.addEventListener("change", renderAlertRule);
  });
  toolbenchEl.useWalkAwayAlertButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.alertTriggerSelect.value = "asking-below-target";
    toolbenchEl.alertTargetPsfInput.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderAlertRule();
  });
  toolbenchEl.useAskingGapAlertButton.addEventListener("click", () => {
    if (!toolbenchRecord) return;
    toolbenchEl.alertTriggerSelect.value = "gap-above-limit";
    toolbenchEl.alertGapLimitInput.value = String(Math.max(toolbenchRecord.gap, 1));
    renderAlertRule();
  });
  toolbenchEl.appendAlertRuleNoteButton.addEventListener("click", appendAlertRuleToNote);
  toolbenchEl.exportButton.addEventListener("click", () => {
    toolbenchEl.noteStatus.textContent = hasToolbenchAccess()
      ? "Negotiation note is ready below."
      : "Open the free workspace to prepare the note.";
    toolbenchEl.note.focus();
  });
  toolbenchEl.copyNoteButton.addEventListener("click", copyNote);
  toolbenchEl.downloadNoteButton.addEventListener("click", downloadNote);
  window.addEventListener("resize", drawMemberChart);
}

initToolbench().catch((error) => {
  console.error("Toolbench init failed.", error);
  toolbenchEl.searchStatus.textContent = "Workspace could not initialize. Refresh and try again.";
});
