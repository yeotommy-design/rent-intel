const colors = {
  ink: "#18201b",
  muted: "#68746e",
  grid: "#dcd8cf",
  official: "#196b55",
  asking: "#b64636",
  gold: "#b47522",
  blue: "#355d7c",
  bg: "#f4f1e8"
};

let rentRecords = [];
let selectedRecord = null;
let selectedRange = "5";
let memberSession = null;
let askingFeedState = null;

const memberSessionKey = "rentintelMemberSession";
const savedReportsKey = "rentintelSavedReports";
const backendSavedReportsKey = "rentintelBackendSavedReports";
const joinedMembersKey = "rentintelJoinedMembers";
const pendingMemberIntentKey = "rentintelPendingMemberIntent";
const askingSourceCandidatesKey = "rentintelAskingSourceCandidates";
const coverageRecordsKey = "rentintelCoverageRecords";
const toolbenchPreviewRecordKey = "rentintelToolbenchPreviewRecord";
const freshnessPolicyKey = "rentintelFreshnessSlaPolicy";
const sourceSyncAutomationKey = "rentintelSourceSyncAutomation";

const el = {
  form: document.getElementById("rentSearch"),
  input: document.getElementById("searchInput"),
  searchSuggestions: document.getElementById("searchSuggestions"),
  resultTitle: document.getElementById("resultTitle"),
  confidenceBadge: document.getElementById("confidenceBadge"),
  confidenceStrip: document.getElementById("confidenceStrip"),
  confidenceSource: document.getElementById("confidenceSource"),
  confidenceEvidence: document.getElementById("confidenceEvidence"),
  confidenceUse: document.getElementById("confidenceUse"),
  trustBadge: document.getElementById("trustBadge"),
  trustBadgeTitle: document.getElementById("trustBadgeTitle"),
  trustBadgeCopy: document.getElementById("trustBadgeCopy"),
  publicTrustBadge: document.getElementById("publicTrustBadge"),
  publicTrustTitle: document.getElementById("publicTrustTitle"),
  publicTrustCopy: document.getElementById("publicTrustCopy"),
  rentDecision: document.getElementById("rentDecision"),
  rentReason: document.getElementById("rentReason"),
  mobileSummary: document.getElementById("mobileSummary"),
  officialMetric: document.getElementById("officialMetric"),
  askingMetric: document.getElementById("askingMetric"),
  gapMetric: document.getElementById("gapMetric"),
  fairRangeMetric: document.getElementById("fairRangeMetric"),
  actionLabel: document.getElementById("actionLabel"),
  actionCopy: document.getElementById("actionCopy"),
  actionChecklist: document.getElementById("actionChecklist"),
  sourceSummary: document.getElementById("sourceSummary"),
  sourceQaPanel: document.getElementById("sourceQaPanel"),
  sourceQaStatus: document.getElementById("sourceQaStatus"),
  sourceQaChecks: document.getElementById("sourceQaChecks"),
  sourceQaCaptured: document.getElementById("sourceQaCaptured"),
  sourceQaProduction: document.getElementById("sourceQaProduction"),
  sourceQaWarning: document.getElementById("sourceQaWarning"),
  publicEvidenceSummary: document.getElementById("publicEvidenceSummary"),
  publicEvidenceList: document.getElementById("publicEvidenceList"),
  signalDrivers: document.getElementById("signalDrivers"),
  heroAnswerTitle: document.getElementById("heroAnswerTitle"),
  heroAnswerCopy: document.getElementById("heroAnswerCopy"),
  heroToolbenchLink: document.getElementById("heroToolbenchLink"),
  heroBriefPanel: document.getElementById("heroBriefPanel"),
  heroBriefTitle: document.getElementById("heroBriefTitle"),
  heroBriefCopy: document.getElementById("heroBriefCopy"),
  heroBriefTrust: document.getElementById("heroBriefTrust"),
  heroBriefRange: document.getElementById("heroBriefRange"),
  heroBriefGap: document.getElementById("heroBriefGap"),
  pulseHeroLabel: document.getElementById("pulseHeroLabel"),
  pulseHeroTitle: document.getElementById("pulseHeroTitle"),
  pulseHeroCopy: document.getElementById("pulseHeroCopy"),
  pulseDecisionLabel: document.getElementById("pulseDecisionLabel"),
  pulseDecisionTitle: document.getElementById("pulseDecisionTitle"),
  pulseDecisionCopy: document.getElementById("pulseDecisionCopy"),
  pulseNextLabel: document.getElementById("pulseNextLabel"),
  pulseNextTitle: document.getElementById("pulseNextTitle"),
  pulseNextCopy: document.getElementById("pulseNextCopy"),
  noMatch: document.getElementById("noMatch"),
  noMatchAlternatives: document.getElementById("noMatchAlternatives"),
  coverageRequestForm: document.getElementById("coverageRequestForm"),
  coverageRequestEmail: document.getElementById("coverageRequestEmail"),
  coverageRequestStatus: document.getElementById("coverageRequestStatus"),
  publicCoverageQueue: document.getElementById("publicCoverageQueue"),
  publicCoverageSummary: document.getElementById("publicCoverageSummary"),
  publicCoverageList: document.getElementById("publicCoverageList"),
  copyCoverageQueueButton: document.getElementById("copyCoverageQueueButton"),
  downloadCoverageQueueButton: document.getElementById("downloadCoverageQueueButton"),
  publicCoverageExportStatus: document.getElementById("publicCoverageExportStatus"),
  coverageRequestArea: document.getElementById("coverageRequestArea"),
  coverageRequestPropertyType: document.getElementById("coverageRequestPropertyType"),
  coverageRequestUseCase: document.getElementById("coverageRequestUseCase"),
  coverageRequestUrgency: document.getElementById("coverageRequestUrgency"),
  searchResultState: document.getElementById("searchResultState"),
  searchResultType: document.getElementById("searchResultType"),
  searchResultLabel: document.getElementById("searchResultLabel"),
  searchResultCopy: document.getElementById("searchResultCopy"),
  publicTrustGuide: document.getElementById("publicTrustGuide"),
  publicTrustGuideSummary: document.getElementById("publicTrustGuideSummary"),
  dailyInsight: document.getElementById("dailyInsight"),
  dailyInsightLink: document.getElementById("dailyInsightLink"),
  rentMoversSummary: document.getElementById("rentMoversSummary"),
  rentMoversList: document.getElementById("rentMoversList"),
  freshnessWatchSummary: document.getElementById("freshnessWatchSummary"),
  freshnessWatchList: document.getElementById("freshnessWatchList"),
  coverageHighlightsSummary: document.getElementById("coverageHighlightsSummary"),
  coverageHighlightsList: document.getElementById("coverageHighlightsList"),
  coverageStatusSummary: document.getElementById("coverageStatusSummary"),
  coveragePendingMetric: document.getElementById("coveragePendingMetric"),
  coverageApprovedMetric: document.getElementById("coverageApprovedMetric"),
  coverageProductionMetric: document.getElementById("coverageProductionMetric"),
  coverageHighlightCopy: document.getElementById("coverageHighlightCopy"),
  membersLoginOpen: document.getElementById("membersLoginOpen"),
  memberAccessLabel: document.getElementById("memberAccessLabel"),
  memberState: document.getElementById("memberState"),
  membersLoginClose: document.getElementById("membersLoginClose"),
  memberLoginPanel: document.getElementById("memberLoginPanel"),
  memberLoginForm: document.getElementById("memberLoginForm"),
  memberEmail: document.getElementById("memberEmail"),
  memberLoginStatus: document.getElementById("memberLoginStatus"),
  memberWorkspace: document.getElementById("memberWorkspace"),
  memberReportTitle: document.getElementById("memberReportTitle"),
  memberReportSummary: document.getElementById("memberReportSummary"),
  saveReportButton: document.getElementById("saveReportButton"),
  exportReportButton: document.getElementById("exportReportButton"),
  areaAlertButton: document.getElementById("areaAlertButton"),
  publicToolbenchLink: document.getElementById("publicToolbenchLink"),
  memberActionStatus: document.getElementById("memberActionStatus"),
  savedReportCount: document.getElementById("savedReportCount"),
  savedReportsList: document.getElementById("savedReportsList"),
  publicInterestTitle: document.getElementById("publicInterestTitle"),
  publicInterestCopy: document.getElementById("publicInterestCopy"),
  publicInterestForm: document.getElementById("publicInterestForm"),
  publicInterestEmail: document.getElementById("publicInterestEmail"),
  publicInterestStatus: document.getElementById("publicInterestStatus"),
  unlockAreaTitle: document.getElementById("unlockAreaTitle"),
  unlockSummary: document.getElementById("unlockSummary"),
  unlockTrustMetric: document.getElementById("unlockTrustMetric"),
  unlockTargetMetric: document.getElementById("unlockTargetMetric"),
  unlockEvidenceMetric: document.getElementById("unlockEvidenceMetric"),
  unlockNoteMetric: document.getElementById("unlockNoteMetric"),
  unlockDrivers: document.getElementById("unlockDrivers"),
  unlockVerification: document.getElementById("unlockVerification"),
  unlockWorkspaceLink: document.getElementById("unlockWorkspaceLink"),
  unlockAccountLink: document.getElementById("unlockAccountLink"),
  decisionNotePreviewTitle: document.getElementById("decisionNotePreviewTitle"),
  decisionNoteDecision: document.getElementById("decisionNoteDecision"),
  decisionNoteRange: document.getElementById("decisionNoteRange"),
  decisionNoteTrust: document.getElementById("decisionNoteTrust"),
  decisionNotePreviewLead: document.getElementById("decisionNotePreviewLead"),
  decisionNotePreviewBody: document.getElementById("decisionNotePreviewBody"),
  decisionNotePreviewNext: document.getElementById("decisionNotePreviewNext"),
  decisionAngleOneLabel: document.getElementById("decisionAngleOneLabel"),
  decisionAngleOneTitle: document.getElementById("decisionAngleOneTitle"),
  decisionAngleOneCopy: document.getElementById("decisionAngleOneCopy"),
  decisionAngleTwoLabel: document.getElementById("decisionAngleTwoLabel"),
  decisionAngleTwoTitle: document.getElementById("decisionAngleTwoTitle"),
  decisionAngleTwoCopy: document.getElementById("decisionAngleTwoCopy"),
  decisionAngleThreeLabel: document.getElementById("decisionAngleThreeLabel"),
  decisionAngleThreeTitle: document.getElementById("decisionAngleThreeTitle"),
  decisionAngleThreeCopy: document.getElementById("decisionAngleThreeCopy"),
  decisionNoteOpenLink: document.getElementById("decisionNoteOpenLink"),
  decisionNoteSaveLink: document.getElementById("decisionNoteSaveLink"),
  chartShell: document.getElementById("chartShell"),
  chartKicker: document.getElementById("chartKicker"),
  chartTitle: document.getElementById("chartTitle"),
  togglePaid: document.getElementById("togglePaid"),
  chartPreviewLink: document.getElementById("chartPreviewLink"),
  rentChart: document.getElementById("rentChart"),
  pressurePanelTitle: document.getElementById("pressurePanelTitle"),
  pressureFocus: document.getElementById("pressureFocus"),
  pressureSignal: document.getElementById("pressureSignal"),
  pressureGap: document.getElementById("pressureGap"),
  pressureAsking: document.getElementById("pressureAsking"),
  pressureFairRange: document.getElementById("pressureFairRange"),
  pressureGauge: document.getElementById("pressureGauge"),
  pressureFairBand: document.getElementById("pressureFairBand"),
  pressureBenchmarkMarker: document.getElementById("pressureBenchmarkMarker"),
  pressureAskingMarker: document.getElementById("pressureAskingMarker"),
  pressureBoardSummary: document.getElementById("pressureBoardSummary"),
  pressureList: document.getElementById("pressureList"),
  dataFreshness: document.getElementById("dataFreshness")
};

let pendingCoverageQuery = "";

function currentAskingFeed() {
  return askingFeedState || window.RENTINTEL_ASKING_RENT_FEED || { records: [] };
}

function money(value) {
  return `S$${value.toFixed(2)} psf`;
}

function moneyRange(range) {
  if (!range) return "Not enough data";
  return `${money(range.low)}-${money(range.high)}`;
}

function formatUpdatedDate(value) {
  if (!value) return "Updated weekly";
  const date = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return "Updated weekly";
  return `Last updated ${date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })}`;
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

function sourceSyncAutomationStatus() {
  const state = loadStoredJson(sourceSyncAutomationKey, {}) || {};
  const enabled = state.enabled !== false;
  const cadence = state.cadence === "12h" ? "12h" : "daily";
  const runHourSgt = Math.max(0, Math.min(23, Number(state.runHourSgt) || 8));
  return {
    enabled,
    schedule: enabled
      ? cadence === "12h"
        ? "Every 12h"
        : `Daily ${String(runHourSgt).padStart(2, "0")}:00 SGT`
      : "Paused",
    breachCount: Number(state.breachCount || 0)
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
      : `${freshness.detail} Pilot manual asking feed is connected, but production still needs licensed feed or verified daily capture workflow with QA logs. Source sync schedule: ${sourceSyncAutomationStatus().schedule}.`
  };
}

function renderDataFreshness(record) {
  if (!el.dataFreshness) return;
  const feed = currentAskingFeed();
  const updated = formatUpdatedDate(feed?.updatedAt || window.RENTINTEL_SAMPLE_DATA?.updatedAt);
  if (!record) {
    el.dataFreshness.textContent = updated;
    return;
  }
  const qa = sourceQaProfile(record);
  const health = String(feed.feedHealth || feed.connectionState || "").replace(/-/g, " ");
  const automation = sourceSyncAutomationStatus();
  el.dataFreshness.textContent = `${updated} | Feed freshness: ${qa.freshnessLabel}${health ? ` | Feed state: ${health}` : ""} | Sync: ${automation.schedule}${automation.breachCount ? ` | Breaches: ${automation.breachCount}` : ""}`;
}

function signalDrivers(record) {
  if (Array.isArray(record.drivers) && record.drivers.length) return record.drivers;
  const property = String(record.propertyType || "").toLowerCase();
  const area = String(record.area || "").toLowerCase();
  if (area.includes("chinatown") || property.includes("shophouse")) {
    return [
      "Tourism and dining activity are supporting stronger asking rents.",
      "Limited shophouse supply keeps comparable options tight.",
      "Recent F&B approvals and frontage premiums can justify part of the gap.",
      "Asking-rent momentum is above the transaction-backed benchmark."
    ];
  }
  if (area.includes("orchard") || property.includes("mall")) {
    return [
      "Prime mall frontage commands a higher rent premium.",
      "Retail footfall and tourist spend can lift asking expectations.",
      "Unit position, floor level, and tenant mix can explain wide rent dispersion.",
      "Asking-rent momentum should be checked against recent transaction evidence."
    ];
  }
  if (property.includes("hdb") || property.includes("heartland")) {
    return [
      "Heartland demand depends on MRT spillover and daily footfall.",
      "Permitted use, corner frontage, and nearby clinics or F&B can move rent materially.",
      "Comparable HDB-linked benchmarks suggest the asking premium needs negotiation.",
      "Recent asking momentum should be validated against unit-specific traffic."
    ];
  }
  return [
    "Comparable area pressure is above the direct benchmark range.",
    "Unit frontage, permitted use, and fit-out value may explain part of the premium.",
    "Asking-rent momentum needs confirmation before committing.",
    "Use the Workspace evidence layer to separate market premium from landlord ask."
  ];
}

function actionChecklist(record) {
  const property = String(record?.propertyType || "").toLowerCase();
  const area = String(record?.area || "").toLowerCase();
  if (area.includes("chinatown") || property.includes("shophouse")) {
    return [
      "Check frontage width and street visibility before accepting the premium.",
      "Confirm F&B approval, exhaust constraints, and late-hour operating limits.",
      "Separate landlord asking momentum from fit-out or takeover value."
    ];
  }
  if (area.includes("orchard") || property.includes("mall")) {
    return [
      "Check floor level, frontage, and traffic path against the asking rent.",
      "Ask for service charge, turnover rent, and promotion levy separately.",
      "Compare anchor tenant draw and nearby vacancy before accepting the premium."
    ];
  }
  if (property.includes("hdb") || property.includes("heartland")) {
    return [
      "Check MRT spillover, daily footfall, and nearby competing units.",
      "Confirm permitted use, clinic or F&B suitability, and exhaust limits.",
      "Push back unless corner frontage or proven traffic supports the premium."
    ];
  }
  return [
    "Confirm direct benchmark coverage before treating the signal as final.",
    "Check unit frontage, permitted use, and service-charge assumptions.",
    "Use Workspace evidence before setting the offer range."
  ];
}

function pulseGuideProfile(record) {
  const gap = Number(record?.gap || 0);
  const fairHigh = record?.fairRange?.high || record?.official || 0;
  const isProduction = Boolean(record?.askingSource?.productionReady) ||
    String(record?.confidence || "").toLowerCase().includes("production");
  const isSample = record?.prototypeSource === "coverage-request" ||
    String(record?.confidence || "").toLowerCase().includes("sample") ||
    String(record?.confidence || "").toLowerCase().includes("comparable");
  const upperLine = fairHigh ? money(fairHigh) : "the fair range";

  if (isSample) {
    return {
      tone: "warning",
      hero: {
        label: "Pulse Read",
        title: "This is a preview signal.",
        copy: "Next: confirm source coverage before using it."
      },
      decision: {
        label: "Pulse Warning",
        title: "Source evidence is not complete.",
        copy: "Next: review benchmark and asking-source status."
      },
      next: {
        label: "Pulse Next Step",
        title: "Move to evidence review.",
        copy: `Next: treat ${upperLine} as temporary until reviewed.`
      }
    };
  }

  if (gap >= 18) {
    return {
      tone: "warning",
      hero: {
        label: "Pulse Read",
        title: "Asking rent looks high.",
        copy: `Next: check proof for rent above ${upperLine}.`
      },
      decision: {
        label: "Pulse Warning",
        title: "Do not accept the ask without evidence.",
        copy: "Next: verify frontage, use, fit-out, and source confidence."
      },
      next: {
        label: "Pulse Next Step",
        title: "Set a defendable upper line.",
        copy: `Next: ${record.actionLabel || "Negotiate"} around ${upperLine} unless premium evidence is clear.`
      }
    };
  }

  if (gap >= 8) {
    return {
      tone: "next",
      hero: {
        label: "Pulse Read",
        title: "Asking rent needs validation.",
        copy: `Next: test whether the premium holds below ${upperLine}.`
      },
      decision: {
        label: "Pulse Warning",
        title: "Validate the premium before deciding.",
        copy: "Next: ask for source confidence and unit-specific proof."
      },
      next: {
        label: "Pulse Next Step",
        title: "Ask for proof of premium.",
        copy: `Next: use ${upperLine} unless the landlord supports the premium.`
      }
    };
  }

  return {
    tone: isProduction ? "summary" : "read",
    hero: {
      label: "Pulse Read",
      title: "Asking rent is closer to range.",
      copy: "Next: check source state and lease terms."
    },
    decision: {
      label: "Pulse Summary",
      title: "The rent signal is not showing a large premium.",
      copy: "Next: compare terms, service charge, use, and handover."
    },
    next: {
      label: "Pulse Next Step",
      title: "Confirm terms before accepting.",
      copy: "Next: confirm benchmark and asking-source state."
    }
  };
}

function renderPulseGuide(record) {
  const pulse = pulseGuideProfile(record);
  const rootNodes = [
    el.pulseHeroLabel?.closest(".pulse-callout"),
    el.pulseDecisionLabel?.closest(".pulse-callout"),
    el.pulseNextLabel?.closest(".pulse-callout")
  ].filter(Boolean);
  rootNodes.forEach((node) => {
    node.dataset.pulseTone = pulse.tone;
  });
  if (el.pulseHeroLabel) {
    el.pulseHeroLabel.textContent = pulse.hero.label;
    el.pulseHeroTitle.textContent = pulse.hero.title;
    el.pulseHeroCopy.textContent = pulse.hero.copy;
  }
  if (el.pulseDecisionLabel) {
    el.pulseDecisionLabel.textContent = pulse.decision.label;
    el.pulseDecisionTitle.textContent = pulse.decision.title;
    el.pulseDecisionCopy.textContent = pulse.decision.copy;
  }
  if (el.pulseNextLabel) {
    el.pulseNextLabel.textContent = pulse.next.label;
    el.pulseNextTitle.textContent = pulse.next.title;
    el.pulseNextCopy.textContent = pulse.next.copy;
  }
}

function renderHeroBrief(record) {
  if (!record || !el.heroBriefTitle) return;
  const pulse = pulseGuideProfile(record);
  const status = pressureStatus(record);
  if (el.heroBriefPanel) {
    el.heroBriefPanel.dataset.status = status.key;
  }
  el.heroBriefTitle.textContent = pulse.hero.title;
  el.heroBriefCopy.textContent = `${record.actionLabel || "Use the fair range first."} ${pulse.next.copy}`;
  el.heroBriefTrust.textContent = record.confidence;
  el.heroBriefRange.textContent = moneyRange(record.fairRange);
  el.heroBriefGap.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
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

function enrichOneMapRecords(records) {
  return window.RentIntelOneMapAdapter?.enrichRecords
    ? window.RentIntelOneMapAdapter.enrichRecords(records, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : records;
}

function enrichOneMapRecord(record) {
  return window.RentIntelOneMapAdapter?.enrichRecord
    ? window.RentIntelOneMapAdapter.enrichRecord(record, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : record;
}

async function loadRentIntelData() {
  const askingFeed = await loadAskingRentFeed();
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("./data/rentintel-sample-data.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
      const payload = await response.json();
      if (Array.isArray(payload.records)) {
        const merged = mergeAskingRentFeed(payload.records, askingFeed, {
          sampleUpdatedAt: payload.updatedAt || window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
        });
        return enrichOneMapRecords(mergeCoverageRecords(merged.records));
      }
    } catch (error) {
      console.warn("RentIntel JSON data load failed; checking local preview mirror.", error);
    }
  }

  if (Array.isArray(window.RENTINTEL_SAMPLE_DATA?.records)) {
    const merged = mergeAskingRentFeed(window.RENTINTEL_SAMPLE_DATA.records, askingFeed, {
      sampleUpdatedAt: window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
    });
    return enrichOneMapRecords(mergeCoverageRecords(merged.records));
  }

  const normalized = window.RentIntelAskingFeedAdapter?.normalizeFeed
    ? window.RentIntelAskingFeedAdapter.normalizeFeed(askingFeed)
    : askingFeed;
  askingFeedState = normalized;
  return [];
}

async function loadAskingRentFeed() {
  if (window.location.protocol !== "file:") {
    try {
      const apiResponse = await fetch("./api/sources/asking-feed", { cache: "no-store" });
      if (apiResponse.ok) {
        const apiPayload = await apiResponse.json();
        if (Array.isArray(apiPayload.feed?.records)) return apiPayload.feed;
      }
    } catch (error) {
      console.warn("RentIntel asking feed API load failed; checking JSON fallback.", error);
    }
    try {
      const response = await fetch("./data/sources/asking-rent-feed.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Asking feed request failed: ${response.status}`);
      const payload = await response.json();
      if (Array.isArray(payload.records)) return payload;
    } catch (error) {
      console.warn("RentIntel asking feed load failed; checking local preview mirror.", error);
    }
  }
  return Array.isArray(window.RENTINTEL_ASKING_RENT_FEED?.records)
    ? window.RENTINTEL_ASKING_RENT_FEED
    : { records: [] };
}

function mergeAskingRentFeed(records, feed, options = {}) {
  if (window.RentIntelAskingFeedAdapter?.mergeRecords) {
    const merged = window.RentIntelAskingFeedAdapter.mergeRecords(records, feed, options);
    askingFeedState = merged.feed;
    return merged;
  }
  const feedRecords = Array.isArray(feed?.records) ? feed.records : [];
  askingFeedState = feed || { records: [] };
  if (!feedRecords.length) return { records };
  const byRecordId = new Map(feedRecords.map((item) => [item.recordId, item]));
  return {
    records: records.map((record) => {
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
    })
  };
}

function coveragePrototypeRecords() {
  return loadStoredJson(coverageRecordsKey, []).filter((record) =>
    record?.id && record?.title && Array.isArray(record?.aliases) && !isInvalidCoverageRecord(record)
  );
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Pulau Tekong is outside RentIntel's retail-rent coverage scope.",
      action: "Do not create HDB-retail or shop-rent samples for this location.",
      alternatives: ["Serangoon HDB retail", "Tampines HDB retail", "Bedok HDB retail"]
    };
  }
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Offshore and special-use islands are not eligible for prototype retail coverage.",
      action: "Keep the request out of public samples until a real classified commercial source exists.",
      alternatives: ["Chinatown shophouse", "Orchard mall", "Ang Mo Kio shop"]
    };
  }
  if (text.includes("farm") && text.includes("hdb retail")) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Farm and HDB retail are conflicting property classifications.",
      action: "Ask for the correct retail property type before a coverage sample is created.",
      alternatives: ["Ang Mo Kio shop", "Serangoon HDB retail", "Chinatown shophouse"]
    };
  }
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "The area and HDB retail property type do not fit together.",
      action: "Use mall, shophouse, or neighbourhood shop where that better matches the location.",
      alternatives: ["Orchard mall", "Raffles Place retail", "Chinatown shophouse"]
    };
  }
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) {
    return {
      status: "manual",
      eligible: false,
      requestable: true,
      sampleAllowed: false,
      reason: "This search needs manual review because it is outside standard retail coverage.",
      action: "Queue it for manual source classification before any sample answer is created.",
      alternatives: ["Neighbourhood shop", "Orchard mall", "Chinatown shophouse"]
    };
  }
  return {
    status: "eligible",
    eligible: true,
    requestable: true,
    sampleAllowed: true,
    reason: "Eligible for coverage review.",
    action: "Review benchmark fit, property type, and asking-rent source availability.",
    alternatives: ["Ang Mo Kio shop", "Serangoon HDB retail", "Chinatown shophouse"]
  };
}

function isInvalidCoverageText(value = "") {
  return coverageEligibilityProfile(value).status === "blocked";
}

function isInvalidCoverageCandidate(candidate = {}) {
  return isInvalidCoverageText([
    candidate.requestedQuery,
    candidate.requestedArea,
    candidate.requestedPropertyType,
    candidate.name
  ].filter(Boolean).join(" "));
}

function coverageEligibilityForCandidate(candidate = {}) {
  return coverageEligibilityProfile([
    candidate.requestedQuery,
    candidate.requestedArea,
    candidate.requestedPropertyType,
    candidate.name
  ].filter(Boolean).join(" "));
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

function sanitizeCoverageStorage() {
  const records = loadStoredJson(coverageRecordsKey, []);
  const cleanRecords = records.filter((record) => !isInvalidCoverageRecord(record));
  if (cleanRecords.length !== records.length) writeStoredJson(coverageRecordsKey, cleanRecords);

  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const cleanCandidates = candidates.filter((candidate) => !isInvalidCoverageCandidate(candidate));
  if (cleanCandidates.length !== candidates.length) writeStoredJson(askingSourceCandidatesKey, cleanCandidates);
}

function productionizeCoverageRecord(record, candidate) {
  if (!record || !candidate?.productionReadyAt) return record;
  const capturedAt = candidate.productionReadyAt.slice(0, 10);
  const source = record.askingSource || {};
  return {
    ...record,
    confidence: "Production verified",
    askingSourceStatus: "production-ready",
    askingSource: {
      ...source,
      sourceName: source.sourceName || "Coverage production source",
      sourceType: source.sourceType || "verified-production-capture",
      listingCount: source.listingCount || 1,
      capturedAt: source.capturedAt || capturedAt,
      productionReady: true,
      note: source.note || `Production verified from coverage review by ${candidate.productionReadyBy || "RentIntel"}.`
    },
    sourceSummary: `${record.sourceSummary || ""} Production verified from coverage review on ${formatShortDate(capturedAt)}.`.trim()
  };
}

function coverageRecordForRequest(candidate) {
  if (!candidate) return null;
  const query = normalizedCoverageQuery(candidate.requestedQuery || candidate.name || "");
  const id = candidate.sampleRecordId || `coverage-${slugify(candidate.requestedQuery || candidate.name || "request")}`;
  const record = coveragePrototypeRecords().find((entry) =>
    entry.id === id ||
    normalizedCoverageQuery(entry.title) === query ||
    entry.aliases.some((alias) => normalizedCoverageQuery(alias) === query)
  ) || null;
  return productionizeCoverageRecord(record, candidate);
}

function mergeCoverageRecords(records) {
  const merged = new Map();
  records.forEach((record) => merged.set(record.id, record));
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  coveragePrototypeRecords().forEach((record) => {
    const candidate = candidates.find((entry) =>
      entry.type === "coverage request" &&
      (entry.sampleRecordId === record.id ||
        `coverage-${slugify(entry.requestedQuery || entry.name || "request")}` === record.id ||
        normalizedCoverageQuery(entry.requestedQuery || entry.name || "") === normalizedCoverageQuery(record.title))
    );
    merged.set(record.id, productionizeCoverageRecord(record, candidate));
  });
  return [...merged.values()];
}

function chooseDailyInsight() {
  const start = new Date("2026-01-01T00:00:00+08:00").getTime();
  const now = new Date();
  const day = Math.floor((now.getTime() - start) / 86400000);
  return rentRecords[Math.abs(day) % rentRecords.length];
}

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

const genericSearchAliases = [
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
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");
}

function inferPropertyType(query, profile) {
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

function fallbackComparableProfile(query) {
  const normalized = query.trim().toLowerCase();
  if (!coverageEligibilityProfile(normalized).eligible) return null;
  const hasRetailIntent = /\b(hdb|retail|shop|shops|shophouse|shop\s*house|mall|plaza|centre|center|commercial|cafe|restaurant|f&b|food)\b/.test(normalized);
  if (!hasRetailIntent) return null;
  const area = normalized
    .replace(/\b(hdb|retail|shop|shops|shophouse|shop\s*house|mall|plaza|centre|center|commercial|unit|rent|rental|asking|cafe|restaurant|f&b|food)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!area || genericSearchAliases.includes(area) || area.length < 3) return null;
  const primeHint = /\b(orchard|marina|raffles|tanjong pagar|cbd|city hall|bugis|holland|clarke quay)\b/.test(area);
  const cityHint = /\b(jalan besar|lavender|geylang|katong|joo chiat|balestier|outram|tiong bahru)\b/.test(area);
  const official = primeHint ? 13.2 : cityHint ? 11.2 : 8.4;
  const asking = primeHint ? 16.8 : cityHint ? 14.3 : 10.9;
  return {
    area: titleCase(area),
    aliases: [area],
    official,
    asking,
    x: primeHint ? 320 : cityHint ? 350 : 300,
    y: primeHint ? 280 : cityHint ? 255 : 210,
    cluster: primeHint ? "prime comparable fallback" : cityHint ? "city fringe comparable fallback" : "heartland comparable fallback"
  };
}

function comparableSeries(official, asking) {
  const labels = ["2021 Q1", "2021 Q3", "2022 Q1", "2022 Q3", "2023 Q1", "2023 Q3", "2024 Q1", "2024 Q3", "2025 Q1", "2025 Q3"];
  const officialCurve = [0.78, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1, 1.02];
  const askingCurve = [0.72, 0.75, 0.79, 0.84, 0.89, 0.93, 0.97, 1, 1, 1.03];
  return labels.map((label, index) => [
    label,
    Number((official * officialCurve[index]).toFixed(1)),
    Number((asking * askingCurve[index]).toFixed(1))
  ]);
}

function createComparableRecord(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  if (!coverageEligibilityProfile(normalized).eligible) return null;
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
  const official = Number((profile.official * inferredType.modifier).toFixed(1));
  const asking = Number((profile.asking * inferredType.modifier).toFixed(1));
  const gap = Math.round(((asking - official) / official) * 100);
  const high = Number(Math.max(official * 1.18, official + 1.2).toFixed(1));
  const low = Number((official * 0.95).toFixed(1));
  const status = gap >= 22 ? "high" : gap >= 10 ? "watch" : "calm";
  const actionLabel = gap >= 22 ? "Push back" : gap >= 10 ? "Validate premium" : "Fair range";
  const titleType = inferredType.label === "HDB retail" ? inferredType.label : inferredType.label.toLowerCase();
  const title = `${profile.area} ${titleType}`;

  return enrichOneMapRecord({
    id: `estimate-${slugify(profile.area)}-${slugify(inferredType.label)}`,
    aliases: [...profile.aliases, `${profile.area.toLowerCase()} ${inferredType.label.toLowerCase()}`],
    title,
    propertyType: inferredType.label,
    area: profile.area,
    confidence: "Comparable estimate",
    decision: gap >= 22 ? "Asking rent looks high against comparable area benchmarks." : "Asking rent needs comparable validation.",
    reason: `No direct RentIntel record is connected for ${profile.area} yet, so this is estimated from comparable ${profile.cluster} retail signals. Treat it as a first-pass guide until the official and asking feeds are connected for this exact area.`,
    official,
    asking,
    gap,
    daily: `${title} is estimated near ${money(asking)}, about ${gap}% above a comparable benchmark of ${money(official)}. Use this as a preview signal until direct ${profile.area} source coverage is connected.`,
    series: comparableSeries(official, asking),
    map: {
      x: profile.x,
      y: profile.y,
      status
    },
    fairRange: {
      low,
      high
    },
    actionLabel,
    action: `${actionLabel} above ${money(high)} unless the unit has strong ${inferredType.actionNoun}.`,
    sourceSummary: `Comparable estimate only: ${profile.area} is recognized, but this exact area is not yet connected to a direct transaction-backed RentIntel record. Production should replace this with URA/HDB benchmark, OneMap classification, and verified asking-rent feed coverage.`,
    mobileSummary: `${gap >= 22 ? "Likely high" : "Needs validation"}. Comparable estimate for ${profile.area}; confirm direct asking evidence before committing.`
  });
}

function confidenceProfile(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  if (record?.askingSource?.productionReady || confidence.includes("production")) {
    return {
      tone: "production",
      source: "Production verified",
      evidence: "Production source + QA controls",
      use: "Decision ready"
    };
  }
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) {
    return {
      tone: "coverage",
      source: "Coverage sample",
      evidence: "Approved request, sample values",
      use: "Prototype only"
    };
  }
  if (confidence.includes("comparable")) {
    return {
      tone: "estimate",
      source: "Comparable estimate",
      evidence: "Area profile, not direct record",
      use: "Confirm source"
    };
  }
  if (confidence.includes("high")) {
    return {
      tone: "high",
      source: "Direct record",
      evidence: "Transaction benchmark + asking signal",
      use: "Decision ready"
    };
  }
  if (confidence.includes("medium")) {
    return {
      tone: "medium",
      source: "Direct record",
      evidence: "Benchmark plus partial asking signal",
      use: "Review evidence"
    };
  }
  return {
    tone: "low",
    source: "Limited signal",
    evidence: "Needs source validation",
    use: "Use cautiously"
  };
}

function benchmarkTrustProfile(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  if (record?.askingSource?.productionReady || confidence.includes("production")) {
    return {
      key: "production",
      title: "Production verified",
      copy: "Official benchmark, asking source, QA gate, and review controls are connected."
    };
  }
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) {
    return {
      key: "coverage",
      title: "Coverage pending",
      copy: "This is a prototype estimate until direct source coverage is connected."
    };
  }
  if (confidence.includes("comparable")) {
    return {
      key: "comparable",
      title: "Comparable estimate",
      copy: "Useful for screening, but direct transaction-backed coverage should be confirmed."
    };
  }
  return {
    key: "direct",
    title: "Direct benchmark",
    copy: "Official benchmark and asking signal are available for comparison and review."
  };
}

function publicTrustProfile(record) {
  const sourceTrust = window.RentIntelSourceTrust?.profile(record, {
    feed: currentAskingFeed()
  }) || {
    level: "sample",
    title: "Sample",
    reason: "Sample benchmark signal.",
    action: "Verify direct asking evidence before committing."
  };
  const level = ["production", "released"].includes(sourceTrust.level)
    ? "production"
    : sourceTrust.level === "pilot"
      ? "pilot"
      : "sample";
  const profiles = {
    sample: {
      title: "Sample",
      reason: "Prototype or comparable signal only.",
      action: "Next: request direct coverage before relying on it."
    },
    pilot: {
      title: "Pilot Verified",
      reason: "Manual asking checks are connected.",
      action: "Next: treat as a working signal until production release."
    },
    production: {
      title: "Production Verified",
      reason: "Production source and QA controls are connected.",
      action: "Next: still check lease terms and unit condition."
    }
  };
  const trust = {
    ...sourceTrust,
    level,
    title: profiles[level].title,
    reason: profiles[level].reason,
    action: profiles[level].action
  };
  return {
    ...trust,
    copy: `${trust.reason} ${trust.action}`
  };
}

function publicTrustGuideLevel(trust) {
  if (["production", "released"].includes(trust.level)) return "production";
  if (trust.level === "pilot") return "pilot";
  return "sample";
}

function renderPublicTrustGuide(trust) {
  if (!el.publicTrustGuide) return;
  const level = publicTrustGuideLevel(trust);
  el.publicTrustGuide.dataset.active = level;
  el.publicTrustGuideSummary.textContent = `${trust.title}: ${trust.reason}`;
  el.publicTrustGuide.querySelectorAll("[data-level]").forEach((item) => {
    item.dataset.active = String(item.dataset.level === level);
  });
}

function publicEvidenceRows(record) {
  const qa = sourceQaProfile(record);
  const trust = benchmarkTrustProfile(record);
  const confidence = confidenceProfile(record);
  const sourceTrust = publicTrustProfile(record);
  const rows = [
    {
      label: "Public badge",
      value: sourceTrust.title,
      detail: sourceTrust.action
    },
    {
      label: "Benchmark source",
      value: trust.title,
      detail: trust.copy
    },
    {
      label: "Asking source",
      value: qa.status,
      detail: `${qa.checks} checks | ${qa.captured}`,
      state: qa.freshnessState
    },
    {
      label: "Freshness SLA",
      value: qa.freshnessLabel,
      detail: qa.freshnessDetail,
      state: qa.freshnessState
    },
    {
      label: "Confidence",
      value: record.confidence || confidence.source,
      detail: confidence.evidence
    },
    {
      label: "Production gate",
      value: qa.production,
      detail: sourceTrust.reason
    }
  ];
  if (record?.oneMap?.planningArea || record?.oneMap?.postalCode) {
    rows.push({
      label: "OneMap context",
      value: record.oneMap.planningArea || "Address enriched",
      detail: [record.oneMap.addressLine, record.oneMap.postalCode ? `Singapore ${record.oneMap.postalCode}` : ""]
        .filter(Boolean)
        .join(" | ")
    });
  }
  return rows;
}

function verificationPrompt(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) {
    return "Confirm the approved coverage record, source owner, and latest asking feed before using this as a final position.";
  }
  if (confidence.includes("comparable")) {
    return "Use Workspace to request direct source coverage, then compare asking evidence before making an offer.";
  }
  if (record?.gap >= 20) {
    return "Check the 5-year chart, source split, and landlord discussion note before accepting the asking rent.";
  }
  if (record?.gap >= 10) {
    return "Review the evidence rows and fair-range upper bound before deciding whether the premium is defensible.";
  }
  return "Use Workspace to confirm the latest benchmark, asking signal, and saved decision note.";
}

function publicDecisionNote(record) {
  const trust = benchmarkTrustProfile(record);
  const qa = sourceQaProfile(record);
  const gapText = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  let lead = `RentIntel reads ${record.title} as ${String(record.decision || "").toLowerCase()} because the current asking rent sits ${record.gap > 0 ? `${gapText} above` : `${gapText.replace("-", "")}% below`} the current fair range.`;
  let body = `The public decision note should anchor on ${trust.title.toLowerCase()} evidence, then test whether permitted use, frontage, unit condition, or rare location advantages actually justify the premium.`;
  let next = `Before acting, verify the asking source freshness (${qa.freshnessLabel.toLowerCase()}), compare against the fair range of ${moneyRange(record.fairRange)}, and only accept the premium if the commercial reasons are unusually strong.`;

  if (record.gap >= 20) {
    body = `The gap is wide enough that the note should push for a meaningful counter based on benchmark evidence, comparable area pressure, and any missing proof behind the landlord's premium.`;
  } else if (record.gap >= 10) {
    body = `The premium may still be defensible, but the note should ask for clearer support on frontage, fit-out condition, and recent comparables before treating the asking rent as fair.`;
  } else if (record.gap <= 0) {
    lead = `RentIntel reads ${record.title} as relatively defensible because the current asking rent sits within or below the current fair range.`;
    body = `The decision note should still confirm source freshness, lease terms, and unit-specific factors, but the public signal does not show an obvious premium problem.`;
    next = `Use the preview to sense-check confidence and trust context, then save the check if you want a fuller written note and follow-up workflow.`;
  }

  return { lead, body, next };
}

function publicDecisionAngles(record) {
  const trust = benchmarkTrustProfile(record);
  const highGap = record.gap >= 15;
  const strongGap = record.gap >= 22;
  const fairRange = moneyRange(record.fairRange);
  const area = record.area;
  const propertyType = String(record.propertyType || "retail space").toLowerCase();

  return [
    {
      label: "New lease",
      title: highGap ? "Anchor below the asking premium" : "Use the fair range as the opening guardrail",
      copy: highGap
        ? `For a new ${propertyType} decision in ${area}, start from the fair range of ${fairRange} and ask the landlord to prove why the premium should hold.`
        : `For a new ${propertyType} decision in ${area}, the note should begin with the fair range of ${fairRange} and then test any unit-specific premium carefully.`
    },
    {
      label: "Renewal",
      title: strongGap ? "Challenge the increase as a market claim" : "Separate true market change from negotiation posture",
      copy: strongGap
        ? `If this is a renewal discussion, RentIntel should treat the gap as a claim that needs stronger proof than ${trust.title.toLowerCase()} alone currently provides.`
        : `If this is a renewal discussion, compare the landlord's requested move against the benchmark trend and freshness before accepting it as a fair reset.`
    },
    {
      label: "Area comparison",
      title: "Check nearby options before conceding pressure",
      copy: `Use comparable areas and source freshness to decide whether ${area} is genuinely tight, or whether nearby options weaken the landlord's position in the note.`
    }
  ];
}

function renderDecisionNotePreview(record) {
  if (!el.decisionNotePreviewTitle) return;
  const trust = benchmarkTrustProfile(record);
  const note = publicDecisionNote(record);
  const angles = publicDecisionAngles(record);
  el.decisionNotePreviewTitle.textContent = record.title;
  el.decisionNoteDecision.textContent = record.decision;
  el.decisionNoteRange.textContent = moneyRange(record.fairRange);
  el.decisionNoteTrust.textContent = trust.title;
  el.decisionNotePreviewLead.textContent = note.lead;
  el.decisionNotePreviewBody.textContent = note.body;
  el.decisionNotePreviewNext.textContent = note.next;
  if (angles[0]) {
    el.decisionAngleOneLabel.textContent = angles[0].label;
    el.decisionAngleOneTitle.textContent = angles[0].title;
    el.decisionAngleOneCopy.textContent = angles[0].copy;
  }
  if (angles[1]) {
    el.decisionAngleTwoLabel.textContent = angles[1].label;
    el.decisionAngleTwoTitle.textContent = angles[1].title;
    el.decisionAngleTwoCopy.textContent = angles[1].copy;
  }
  if (angles[2]) {
    el.decisionAngleThreeLabel.textContent = angles[2].label;
    el.decisionAngleThreeTitle.textContent = angles[2].title;
    el.decisionAngleThreeCopy.textContent = angles[2].copy;
  }
  if (el.decisionNoteOpenLink) el.decisionNoteOpenLink.href = toolbenchPreviewUrl(record);
}

function searchableSuggestions() {
  const direct = rentRecords.map((record) => ({
    query: record.title,
    title: record.title,
    meta: record.prototypeSource === "coverage-request" ? "Coverage sample" : "Direct record",
    confidence: record.confidence,
    tone: confidenceProfile(record).tone,
    type: "direct",
    tokens: [record.title, record.area, record.propertyType, ...record.aliases].join(" ").toLowerCase()
  }));
  const comparable = comparableAreaProfiles.flatMap((profile) => {
    const baseTypes = [
      `${profile.area} HDB retail`,
      `${profile.area} shop`,
      `${profile.area} mall`,
      `${profile.area} shophouse`
    ];
    return baseTypes.map((query) => ({
      query,
      title: query,
      meta: "Comparable estimate",
      confidence: "Estimate",
      tone: "estimate",
      type: "estimate",
      tokens: [query, profile.area, profile.cluster, ...profile.aliases].join(" ").toLowerCase()
    }));
  });
  const coverage = loadStoredJson(askingSourceCandidatesKey, [])
    .filter((candidate) => candidate.type === "coverage request" && candidate.requestedQuery)
    .map((candidate) => {
      const record = coverageRecordForRequest(candidate);
      const approved = candidate.status === "approved for pilot";
      const productionReady = Boolean(candidate.productionReadyAt);
      return {
        query: candidate.requestedQuery,
        title: record?.title || candidate.requestedQuery,
        meta: productionReady && record ? "Production verified" : approved && record ? "Pilot verified sample" : `Coverage ${coverageStatusProfile(candidate.status).label}`,
        type: "coverage",
        status: candidate.status,
        confidence: productionReady ? "Production verified" : approved ? "Pilot verified" : "Requested",
        tone: approved || productionReady ? "coverage" : "requested",
        tokens: [candidate.requestedQuery, candidate.name, candidate.status, candidate.requestEmail, record?.title, record?.area, record?.propertyType]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
      };
    });

  const unique = new Map();
  [...direct, ...coverage, ...comparable].forEach((item) => {
    const key = item.query.toLowerCase();
    if (!unique.has(key)) unique.set(key, item);
  });
  return [...unique.values()];
}

function buildCoverageSuggestion(query) {
  const cleaned = String(query || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return null;
  const existing = findCoverageRequest(cleaned);
  const eligibility = coverageEligibilityProfile(cleaned);
  return {
    query: cleaned,
    title: eligibility.status === "blocked"
      ? `Not coverage eligible: ${cleaned}`
      : eligibility.status === "manual"
        ? `Request manual review: ${cleaned}`
      : existing
        ? `${cleaned} coverage status`
        : `Request coverage: ${cleaned}`,
    meta: eligibility.status === "blocked" || eligibility.status === "manual"
      ? eligibility.reason
      : existing
        ? `Coverage ${coverageStatusProfile(existing.productionReadyAt ? "production ready" : existing.status).label}`
        : "New coverage request",
    confidence: eligibility.status === "blocked" ? "Blocked" : eligibility.status === "manual" ? "Manual" : existing ? "In queue" : "Request",
    tone: eligibility.status === "blocked" ? "blocked" : eligibility.status === "manual" ? "manual" : "requested",
    type: eligibility.status === "blocked" ? "blocked" : "request",
    tokens: cleaned.toLowerCase(),
    score: existing ? 36 : 18
  };
}

function renderSearchSuggestions() {
  if (!el.searchSuggestions) return;
  const normalized = el.input.value.trim().toLowerCase();
  const baseSuggestions = searchableSuggestions()
    .map((item) => {
      const exactPrefix = item.title.toLowerCase().startsWith(normalized) ? 30 : 0;
      const tokenScore = normalized
        ? normalized.split(/\s+/).filter((word) => item.tokens.includes(word)).length * 10
        : 0;
      const coverageBoost = item.type === "coverage" ? 12 : 0;
      const score = normalized ? exactPrefix + tokenScore + coverageBoost : item.type === "direct" ? 20 : item.type === "coverage" ? 12 : 5;
      return { ...item, score };
    })
    .filter((item) => normalized ? item.score > 0 : item.type === "direct" || item.type === "coverage")
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const hasExactKnownMatch = baseSuggestions.some((item) => {
    if (!["direct", "coverage"].includes(item.type)) return false;
    const query = item.query.toLowerCase();
    const title = item.title.toLowerCase();
    return query === normalized || title === normalized || title.startsWith(normalized) || normalized.includes(query);
  });
  const requestSuggestion = normalized && !hasExactKnownMatch ? buildCoverageSuggestion(el.input.value) : null;
  const suggestions = [
    ...baseSuggestions.slice(0, requestSuggestion ? 5 : 6),
    ...(requestSuggestion ? [requestSuggestion] : [])
  ];

  el.searchSuggestions.replaceChildren();
  if (!suggestions.length) {
    const empty = document.createElement("span");
    empty.textContent = "No recognized suggestion yet. Search anyway to request coverage.";
    el.searchSuggestions.append(empty);
    return;
  }

  suggestions.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.suggestionType = item.type;
    button.dataset.confidenceTone = item.tone || "low";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const meta = document.createElement("small");
    meta.textContent = item.meta;
    const confidence = document.createElement("mark");
    confidence.textContent = item.confidence || "Review";
    button.append(title, meta, confidence);
    button.addEventListener("click", () => {
      el.input.value = item.query;
      const result = ["request", "blocked"].includes(item.type) ? null : findRecord(item.query);
      if (result) updateResult(result);
      else showNoMatch(item.query);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.searchSuggestions.append(button);
  });
}

function findRecord(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return selectedRecord;
  if (!coverageEligibilityProfile(normalized).eligible) return null;

  const activeRecords = mergeCoverageRecords(rentRecords);
  const scored = activeRecords
    .map((record) => {
      const haystack = [record.title, record.area, record.propertyType, ...record.aliases]
        .join(" ")
        .toLowerCase();
      const tokens = haystack.split(/\s+/);
      const queryWords = normalized.split(/\s+/).filter(Boolean);
      const area = record.area.toLowerCase();
      const title = record.title.toLowerCase();
      const propertyType = record.propertyType.toLowerCase();
      const phraseScore = [
        normalized === title ? 120 : 0,
        normalized === area ? 100 : 0,
        normalized.includes(area) ? 70 : 0,
        normalized.includes(title) || title.includes(normalized) ? 65 : 0,
        normalized.includes(propertyType) ? 22 : 0
      ].reduce((sum, value) => sum + value, 0);
      const aliasScore = record.aliases.reduce((sum, alias) => {
        const normalizedAlias = alias.toLowerCase();
        if (!normalized.includes(normalizedAlias)) return sum;
        const wordCount = normalizedAlias.split(/\s+/).length;
        const genericPenalty = genericSearchAliases.includes(normalizedAlias) ? 0.35 : 1;
        return sum + Math.round((12 + wordCount * 8) * genericPenalty);
      }, 0);
      const tokenScore = queryWords.filter((word) => tokens.includes(word)).length * 8;
      const score = phraseScore + aliasScore + tokenScore;
      return { record, score };
    })
    .sort((a, b) => b.score - a.score);

  const comparable = createComparableRecord(query);
  if (!scored.length) return comparable;
  const topRecord = scored[0].record;
  const topRecordAreaInQuery = normalized.includes(topRecord.area.toLowerCase()) ||
    topRecord.aliases.some((alias) => normalized.includes(alias.toLowerCase()) && !genericSearchAliases.includes(alias.toLowerCase()));

  if (comparable && !topRecordAreaInQuery) return comparable;
  if (scored[0].score >= 16) return topRecord;
  return comparable;
}

function initialRecordFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("rent");
  if (!requested) return null;
  return rentRecords.find((record) => record.id === requested) || findRecord(requested);
}

function searchResultProfile(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  const isProduction = record?.askingSource?.productionReady || confidence.includes("production");
  const isCoverage = record?.prototypeSource === "coverage-request" || confidence.includes("coverage");
  const isComparable = confidence.includes("comparable") || String(record?.id || "").startsWith("estimate-");

  if (isProduction) {
    return {
      state: "production",
      type: "Production verified",
      label: "Production source and QA controls connected",
      copy: "This answer has production-ready source status. Still check lease terms, unit condition, GST, and permitted use."
    };
  }

  if (isCoverage) {
    return {
      state: "coverage",
      type: "Pilot verified",
      label: "Coverage request approved for pilot review",
      copy: "This answer came from the coverage queue. Treat it as a pilot sample until source QA is released."
    };
  }

  if (isComparable) {
    return {
      state: "comparable",
      type: "Comparable estimate",
      label: "Area recognized, direct record pending",
      copy: "RentIntel is using nearby or category comparables until a direct benchmark and asking feed are connected."
    };
  }

  return {
    state: "direct",
    type: "Direct Record",
    label: "Direct RentIntel record loaded",
    copy: "Official benchmark and asking signal are available for this area."
  };
}

function renderSearchResultState(profile) {
  if (!el.searchResultState) return;
  el.searchResultState.dataset.state = profile.state;
  el.searchResultType.textContent = profile.type;
  el.searchResultLabel.textContent = profile.label;
  el.searchResultCopy.textContent = profile.copy;
}

function renderNoMatchAlternatives(eligibility) {
  if (!el.noMatchAlternatives) return;
  el.noMatchAlternatives.replaceChildren();
  const label = document.createElement("strong");
  label.textContent = eligibility.status === "blocked"
    ? "Try a valid retail search"
    : eligibility.status === "manual"
      ? "Manual review alternatives"
      : "Suggested searches";
  el.noMatchAlternatives.append(label);
  (eligibility.alternatives || []).slice(0, 4).forEach((query) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = query;
    button.addEventListener("click", () => {
      el.input.value = query;
      const result = findRecord(query);
      if (result) updateResult(result);
      else showNoMatch(query);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.noMatchAlternatives.append(button);
  });
}

function updateResult(record) {
  el.noMatch.hidden = true;
  el.noMatch.dataset.coverageStatus = "";
  selectedRecord = record;
  const confidence = confidenceProfile(record);
  renderSearchResultState(searchResultProfile(record));
  el.resultTitle.textContent = record.title;
  el.confidenceBadge.textContent = record.confidence;
  if (el.confidenceStrip) {
    el.confidenceStrip.dataset.confidenceTone = confidence.tone;
    el.confidenceSource.textContent = confidence.source;
    el.confidenceEvidence.textContent = confidence.evidence;
    el.confidenceUse.textContent = confidence.use;
  }
  if (el.trustBadge) {
    const trust = benchmarkTrustProfile(record);
    el.trustBadge.dataset.trust = trust.key;
    el.trustBadgeTitle.textContent = trust.title;
    el.trustBadgeCopy.textContent = trust.copy;
  }
  if (el.publicTrustBadge) {
    const publicTrust = publicTrustProfile(record);
    el.publicTrustBadge.dataset.level = publicTrust.level;
    el.publicTrustTitle.textContent = publicTrust.title;
    el.publicTrustCopy.textContent = publicTrust.copy;
    renderPublicTrustGuide(publicTrust);
  }
  el.rentDecision.textContent = record.decision;
  el.rentReason.textContent = record.reason;
  el.mobileSummary.textContent = record.mobileSummary;
  el.officialMetric.textContent = money(record.official);
  el.askingMetric.textContent = money(record.asking);
  el.gapMetric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  el.fairRangeMetric.textContent = moneyRange(record.fairRange);
  el.actionLabel.textContent = record.actionLabel;
  el.actionCopy.textContent = record.action;
  if (el.actionChecklist) {
    el.actionChecklist.replaceChildren();
    actionChecklist(record).forEach((action) => {
      const item = document.createElement("li");
      item.textContent = action;
      el.actionChecklist.append(item);
    });
  }
  const sourceQa = sourceQaProfile(record);
  el.sourceSummary.textContent = `${record.sourceSummary} Feed freshness: ${sourceQa.freshnessLabel}.`;
  if (el.sourceQaPanel) {
    el.sourceQaPanel.dataset.ready = sourceQa.ready ? "true" : "false";
    el.sourceQaPanel.dataset.freshness = sourceQa.freshnessState;
    el.sourceQaStatus.textContent = sourceQa.status;
    el.sourceQaChecks.textContent = sourceQa.checks;
    el.sourceQaCaptured.textContent = sourceQa.captured;
    el.sourceQaProduction.textContent = sourceQa.production;
    el.sourceQaWarning.textContent = sourceQa.warning;
  }
  renderDataFreshness(record);
  if (el.publicEvidenceList) {
    const rows = publicEvidenceRows(record);
    el.publicEvidenceSummary.textContent = `${rows.length} evidence checks`;
    el.publicEvidenceList.replaceChildren();
    rows.forEach((row) => {
      const item = document.createElement("article");
      if (row.state) item.dataset.state = row.state;
      const label = document.createElement("span");
      label.textContent = row.label;
      const value = document.createElement("strong");
      value.textContent = row.value;
      const detail = document.createElement("em");
      detail.textContent = row.detail;
      item.append(label, value, detail);
      el.publicEvidenceList.append(item);
    });
  }
  el.signalDrivers.replaceChildren();
  signalDrivers(record).forEach((driver) => {
    const item = document.createElement("li");
    item.textContent = driver;
    el.signalDrivers.append(item);
  });
  el.heroAnswerTitle.textContent = record.title;
  el.heroAnswerCopy.textContent = record.mobileSummary;
  renderPulseGuide(record);
  renderHeroBrief(record);
  renderDecisionNotePreview(record);
  el.chartTitle.textContent = `${record.title}: historical rent psf`;
  updateCurrentMemberReport();
  updatePublicInterestPanel();
  updateMemberUnlockPanel(record);
  renderRentMovers();
  renderCoverageHighlights();
  syncToolbenchPreviewRecord(record);
  drawRentChart();
  renderPressurePanel();
}

function normalizedCoverageQuery(query) {
  return String(query).trim().toLowerCase().replace(/\s+/g, " ");
}

function publicCoverageRequests() {
  return loadStoredJson(askingSourceCandidatesKey, [])
    .filter((candidate) =>
      candidate.type === "coverage request" &&
      candidate.requestedQuery &&
      !isInvalidCoverageCandidate(candidate)
    )
    .sort((a, b) => new Date(b.updatedAt || b.addedAt || 0) - new Date(a.updatedAt || a.addedAt || 0));
}

function coverageStatusProfile(status) {
  const normalized = String(status || "candidate review").toLowerCase();
  if (normalized === "production ready") {
    return {
      key: "production",
      label: "Production Verified",
      summaryLabel: "production verified",
      detail: "Admin marked this coverage request ready for production ingestion.",
      nextStep: "Keep scheduled ingestion, source QA, and exception monitoring active."
    };
  }
  if (normalized === "approved for pilot") {
    return {
      key: "approved",
      label: "Pilot verified",
      summaryLabel: "pilot verified",
      detail: "Admin approved this search for pilot evidence capture.",
      nextStep: "Create or review the sample rent signal in Workspace."
    };
  }
  if (normalized === "rejected") {
    return {
      key: "rejected",
      label: "Not added",
      summaryLabel: "not added",
      detail: "Admin marked this request as duplicate, too broad, or outside current coverage.",
      nextStep: "Try a clearer area plus property type."
    };
  }
  if (normalized === "requested") {
    return {
      key: "requested",
      label: "Requested",
      summaryLabel: "requested",
      detail: "The area has been added to the public coverage queue.",
      nextStep: "RentIntel will check whether the area can be mapped to benchmark evidence."
    };
  }
  return {
    key: "reviewing",
    label: "Reviewing",
    summaryLabel: "reviewing",
    detail: "RentIntel is checking benchmark fit, property type, and asking-rent source coverage.",
    nextStep: "If usable, this moves to pilot verified before production release."
  };
}

function coverageStatusCounts(requests) {
  return requests.reduce((counts, request) => {
    const profile = coverageStatusProfile(request.productionReadyAt ? "production ready" : request.status);
    counts[profile.key] += 1;
    if (profile.key === "requested" || profile.key === "reviewing") counts.pending += 1;
    return counts;
  }, { requested: 0, reviewing: 0, pending: 0, approved: 0, rejected: 0, production: 0 });
}

function coverageQueuePayload() {
  const requests = publicCoverageRequests();
  const counts = coverageStatusCounts(requests);
  return {
    contract: "rentintel-public-coverage-queue",
    version: "prototype-v1",
    generatedAt: new Date().toISOString(),
    summary: {
      total: requests.length,
      requested: counts.requested,
      reviewing: counts.reviewing,
      pending: counts.pending,
      approved: counts.approved,
      rejected: counts.rejected,
      production: counts.production
    },
    requests: requests.map((request) => ({
      requestedQuery: request.requestedQuery || "",
      requestedArea: request.requestedArea || "",
      requestedPropertyType: request.requestedPropertyType || "",
      requestedUseCase: request.requestedUseCase || "",
      requestedUrgency: request.requestedUrgency || "normal",
      status: request.status || "candidate review",
      requestEmail: request.requestEmail || "",
      source: request.source || "public-search-no-match",
      addedAt: request.addedAt || "",
      updatedAt: request.updatedAt || "",
      reviewedAt: request.reviewedAt || ""
    }))
  };
}

function setCoverageExportStatus(message) {
  if (el.publicCoverageExportStatus) el.publicCoverageExportStatus.textContent = message;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function copyCoverageQueue() {
  const payload = coverageQueuePayload();
  if (!payload.summary.total) {
    setCoverageExportStatus("No coverage requests to copy yet.");
    return;
  }
  try {
    await copyTextToClipboard(JSON.stringify(payload, null, 2));
    setCoverageExportStatus(`${payload.summary.total} coverage requests copied.`);
  } catch (error) {
    console.warn("Coverage queue copy failed.", error);
    setCoverageExportStatus("Copy failed. Use Download Queue JSON instead.");
  }
}

function downloadCoverageQueue() {
  const payload = coverageQueuePayload();
  if (!payload.summary.total) {
    setCoverageExportStatus("No coverage requests to download yet.");
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `rentintel-coverage-queue-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  setCoverageExportStatus(`${payload.summary.total} coverage requests exported.`);
}

function findCoverageRequest(query) {
  const normalizedQuery = normalizedCoverageQuery(query);
  if (!normalizedQuery) return null;
  return publicCoverageRequests().find((candidate) =>
    (
      normalizedCoverageQuery(candidate.requestedQuery || "") === normalizedQuery ||
      normalizedCoverageQuery(candidate.name || "") === `coverage request: ${normalizedQuery}`
    )
  ) || null;
}

function renderPublicCoverageQueue() {
  if (!el.publicCoverageQueue || !el.publicCoverageList) return;
  const requests = publicCoverageRequests();
  el.publicCoverageQueue.hidden = !requests.length;
  if (el.copyCoverageQueueButton) el.copyCoverageQueueButton.disabled = !requests.length;
  if (el.downloadCoverageQueueButton) el.downloadCoverageQueueButton.disabled = !requests.length;
    if (!requests.length) {
    setCoverageExportStatus("");
    return;
  }

  const counts = coverageStatusCounts(requests);
  el.publicCoverageSummary.textContent =
    `${requests.length} requests | ${counts.pending} in review | ${counts.approved} pilot verified | ${counts.production} production verified`;
  el.publicCoverageList.replaceChildren();

  requests.slice(0, 5).forEach((request) => {
    const profile = coverageStatusProfile(request.productionReadyAt ? "production ready" : request.status);
    const record = coverageRecordForRequest(request);
    const item = document.createElement("button");
    item.type = "button";
    item.className = "public-coverage-item";
    item.dataset.status = profile.key;

    const title = document.createElement("strong");
    title.textContent = request.requestedQuery;
    const detail = document.createElement("span");
    detail.textContent = record ? "Pilot sample record is ready for public preview." : profile.detail;
    const meta = document.createElement("em");
    meta.textContent = record
      ? `${record.title} | Public badge: ${profile.label}`
      : request.requestEmail
      ? `Update email saved | ${profile.nextStep}`
      : profile.nextStep;
    const status = document.createElement("small");
    status.textContent = profile.label;

    item.append(title, detail, meta, status);
    item.addEventListener("click", () => {
      el.input.value = request.requestedQuery;
      const approvedRecord = coverageRecordForRequest(request);
      if (approvedRecord) updateResult(approvedRecord);
      else showNoMatch(request.requestedQuery);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.publicCoverageList.append(item);
  });
}

function showNoMatch(query) {
  pendingCoverageQuery = query;
  const existing = findCoverageRequest(query);
  const displayQuery = String(query).trim().replace(/\s+/g, " ");
  const title = el.noMatch.querySelector("strong");
  const message = el.noMatch.querySelector("span");
  const statusProfile = coverageStatusProfile(existing?.productionReadyAt ? "production ready" : existing?.status);
  const eligibility = coverageEligibilityProfile(displayQuery);
  if (el.coverageRequestArea) el.coverageRequestArea.value = displayQuery;
  renderSearchResultState(eligibility.status === "blocked"
    ? {
        state: "missing",
        type: "Not coverage eligible",
        label: "Unsupported location or property type",
        copy: `${eligibility.reason} ${eligibility.action}`
      }
    : eligibility.status === "manual"
      ? {
          state: "missing",
          type: "Manual review required",
          label: "Coverage needs source classification",
          copy: `${eligibility.reason} ${eligibility.action}`
        }
    : existing
      ? {
        state: "coverage",
        type: statusProfile.label,
        label: "This search is already in the coverage flow",
        copy: `${displayQuery} is ${statusProfile.summaryLabel}. ${statusProfile.nextStep}`
      }
    : {
        state: "missing",
        type: "Coverage not ready",
        label: "No exact or comparable record yet",
        copy: "Request coverage so the area can be reviewed for benchmark and asking-rent source capture."
      });
  el.noMatch.hidden = false;
  el.noMatch.dataset.coverageStatus = eligibility.status === "blocked" ? "blocked" : eligibility.status === "manual" ? "manual" : existing ? statusProfile.key : "new";
  title.textContent = eligibility.status === "blocked"
    ? "Not coverage eligible."
    : eligibility.status === "manual"
      ? "Manual review required."
    : existing
      ? `${statusProfile.label} coverage request.`
      : "No exact match yet.";
  message.textContent = eligibility.status === "blocked"
    ? `${displayQuery} cannot be converted into a RentIntel sample. ${eligibility.reason}`
    : eligibility.status === "manual"
      ? `${displayQuery} needs manual source classification before RentIntel can create any sample answer.`
    : existing
    ? `${displayQuery} is already in RentIntel coverage flow. ${statusProfile.detail}`
    : `No exact match for "${displayQuery}". Add it to Coverage Queue, or try area + property type such as Serangoon HDB retail, Orchard mall, Chinatown shophouse, or Tampines HDB retail.`;
  renderNoMatchAlternatives(eligibility);
  if (el.coverageRequestStatus) {
    el.coverageRequestStatus.textContent = eligibility.status === "blocked" || eligibility.status === "manual"
      ? eligibility.action
      : existing?.requestEmail
      ? `Update already linked to ${existing.requestEmail}.`
      : existing
        ? "Add your email if you want an update when this area is reviewed."
        : "";
  }
  const button = el.coverageRequestForm?.querySelector("button");
  if (button) {
    button.textContent = eligibility.status === "blocked"
      ? "Not Eligible"
      : eligibility.status === "manual"
        ? "Request Manual Review"
      : existing?.requestEmail
        ? "Already Queued"
        : existing
          ? "Add Email to Request"
          : "Add to Coverage Queue";
    button.disabled = !eligibility.requestable || Boolean(existing?.requestEmail);
  }
  renderPublicCoverageQueue();
  renderCoverageHighlights();
}

function saveCoverageRequest(event) {
  event.preventDefault();
  const query = pendingCoverageQuery || el.input.value.trim();
  if (!query) return;

  const email = normalizeEmail(el.coverageRequestEmail?.value || "");
  const requestedArea = (el.coverageRequestArea?.value || query).trim();
  const requestedPropertyType = el.coverageRequestPropertyType?.value || "";
  const requestedUseCase = el.coverageRequestUseCase?.value || "";
  const requestedUrgency = el.coverageRequestUrgency?.value || "normal";
  const proposedCandidate = { requestedQuery: query, requestedArea, requestedPropertyType, name: `Coverage request: ${query}` };
  const eligibility = coverageEligibilityForCandidate(proposedCandidate);
  if (!eligibility.requestable) {
    el.coverageRequestStatus.textContent =
      `${query} was not added. ${eligibility.reason}`;
    renderPublicCoverageQueue();
    renderSearchSuggestions();
    return;
  }
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const normalizedQuery = normalizedCoverageQuery(query);
  const duplicateIndex = candidates.findIndex((candidate) =>
    candidate.type === "coverage request" &&
    (
      normalizedCoverageQuery(candidate.requestedQuery || "") === normalizedQuery ||
      normalizedCoverageQuery(candidate.name || "") === `coverage request: ${normalizedQuery}`
    )
  );
  const duplicate = duplicateIndex >= 0;

  if (!duplicate) {
    candidates.unshift({
      type: "coverage request",
      name: `Coverage request: ${query}`,
      requestedQuery: query,
      requestedArea,
      requestedPropertyType,
      requestedUseCase,
      requestedUrgency,
      coverageEligibilityStatus: eligibility.status,
      coverageEligibilityReason: eligibility.reason,
      requestEmail: email,
      status: eligibility.status === "manual" ? "manual review" : "candidate review",
      addedAt: new Date().toISOString(),
      source: "public-search-no-match"
    });
    writeStoredJson(askingSourceCandidatesKey, candidates.slice(0, 100));
  } else if (email && !candidates[duplicateIndex].requestEmail) {
    candidates[duplicateIndex] = {
      ...candidates[duplicateIndex],
      requestEmail: email,
      requestedArea: requestedArea || candidates[duplicateIndex].requestedArea,
      requestedPropertyType: requestedPropertyType || candidates[duplicateIndex].requestedPropertyType,
      requestedUseCase: requestedUseCase || candidates[duplicateIndex].requestedUseCase,
      requestedUrgency: requestedUrgency || candidates[duplicateIndex].requestedUrgency,
      coverageEligibilityStatus: eligibility.status,
      coverageEligibilityReason: eligibility.reason,
      updatedAt: new Date().toISOString()
    };
    writeStoredJson(askingSourceCandidatesKey, candidates);
  }

  if (email) {
    addPublicWaitlistEmail(email);
  }

  showNoMatch(query);
  const savedProfile = coverageStatusProfile(candidates[duplicateIndex]?.productionReadyAt ? "production ready" : candidates[duplicateIndex]?.status || "candidate review");
  el.coverageRequestStatus.textContent = duplicate
    ? email && candidates[duplicateIndex] && normalizeEmail(candidates[duplicateIndex].requestEmail) === email
      ? `${query} is already ${savedProfile.summaryLabel}. Email update saved.`
      : `${query} is already ${savedProfile.summaryLabel}.`
    : eligibility.status === "manual"
      ? `${query} added for manual source classification.`
      : `${query} added to RentIntel coverage queue for review.`;
  renderPublicCoverageQueue();
  renderSearchSuggestions();
}

function openMembersLogin() {
  el.memberLoginPanel.hidden = false;
  el.memberLoginStatus.textContent = "";
  el.memberEmail.focus();
}

function closeMembersLogin() {
  if (el.memberLoginPanel) el.memberLoginPanel.hidden = true;
}

function hasToolAccess() {
  return memberSession?.access === "active" || memberSession?.access === "promo" || memberSession?.toolsEnabled === true;
}

function publicAccessState() {
  if (!memberSession?.email) {
    return {
      key: "free",
      label: "Free public",
      title: "Account",
      chart: "Market context",
      chartButton: "View Chart Context",
      workspace: false
    };
  }
  if (memberSession.access === "promo") {
    return {
      key: "promo",
      label: "Signed in",
      title: "Account",
      chart: "Market context",
      chartButton: "View Chart Context",
      workspace: true
    };
  }
  if (hasToolAccess()) {
    return {
      key: "active",
      label: "Signed in",
      title: "Account",
      chart: "Market context",
      chartButton: "View Chart Context",
      workspace: true
    };
  }
  return {
    key: "waitlist",
    label: "Signed in",
    title: "Account",
    chart: "Market context",
    chartButton: "View Chart Context",
    workspace: false
  };
}

function goToMemberAccount() {
  window.location.href = "./members/account/";
}

function toolbenchPreviewUrl(record = selectedRecord) {
  const rentParam = encodeURIComponent(record?.id || record?.title || "");
  return `./members/toolbench/?rent=${rentParam}`;
}

function syncToolbenchPreviewRecord(record = selectedRecord) {
  if (!record) return;
  writeStoredJson(toolbenchPreviewRecordKey, {
    ...record,
    previewSource: "public-result",
    previewSyncedAt: new Date().toISOString()
  });
  if (el.publicToolbenchLink) {
    el.publicToolbenchLink.href = toolbenchPreviewUrl(record);
  }
  if (el.heroToolbenchLink) {
    el.heroToolbenchLink.href = toolbenchPreviewUrl(record);
  }
  if (el.chartPreviewLink) {
    el.chartPreviewLink.href = toolbenchPreviewUrl(record);
  }
  if (el.unlockWorkspaceLink) {
    el.unlockWorkspaceLink.href = toolbenchPreviewUrl(record);
  }
}

function openToolbenchPreview() {
  syncToolbenchPreviewRecord();
  window.location.href = toolbenchPreviewUrl();
}

function reportStorageKey(report, email = memberSession?.email) {
  return `${normalizeEmail(report?.memberEmail || email)}:${report?.recordId || ""}`;
}

function normalizeBackendReport(report, email = memberSession?.email) {
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

function getSavedReports() {
  const merged = new Map();
  loadStoredJson(savedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  loadStoredJson(backendSavedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  return [...merged.values()];
}

function writeSavedReports(reports) {
  const normalized = reports.map((report) => normalizeBackendReport(report));
  writeStoredJson(savedReportsKey, normalized);
  writeStoredJson(backendSavedReportsKey, normalized);
}

function getCurrentMemberReports() {
  const email = normalizeEmail(memberSession?.email);
  return getSavedReports().filter((report) => {
    if (!report.memberEmail) return true;
    return normalizeEmail(report.memberEmail) === email;
  });
}

function addPublicWaitlistEmail(email) {
  const joinedMembers = loadStoredJson(joinedMembersKey, []);
  if (joinedMembers.some((member) => normalizeEmail(member.email) === email)) return;
  joinedMembers.unshift({
    email,
    memberStatus: "Waitlist email",
    subscriptionStatus: "Waiting for member activation",
    access: "waitlist",
    promoCode: "",
    toolsEnabled: false,
    joinedAt: new Date().toISOString(),
    source: "public-free-result"
  });
  writeStoredJson(joinedMembersKey, joinedMembers.slice(0, 100));
}

function updatePublicInterestPanel() {
  if (!el.publicInterestTitle || !selectedRecord) return;
  el.publicInterestTitle.textContent = selectedRecord.title;
  el.publicInterestCopy.textContent =
    `${selectedRecord.mobileSummary} Save this result if you want to revisit it later or track related areas.`;
}

function updateMemberUnlockPanel(record = selectedRecord) {
  if (!record || !el.unlockAreaTitle) return;
  const trust = benchmarkTrustProfile(record);
  el.unlockAreaTitle.textContent = record.title;
  el.unlockSummary.textContent =
    `${record.mobileSummary} Continue with the evidence Workspace before making the rent decision.`;
  el.unlockTrustMetric.textContent = trust.title;
  el.unlockTargetMetric.textContent = moneyRange(record.fairRange);
  el.unlockEvidenceMetric.textContent = trust.key === "direct" ? "Chart + source split" : "Comparable preview";
  el.unlockNoteMetric.textContent = record.gap >= 10 ? "Negotiation draft" : "Decision note";
  if (el.unlockDrivers) {
    el.unlockDrivers.replaceChildren();
    signalDrivers(record).slice(0, 3).forEach((driver) => {
      const item = document.createElement("li");
      item.textContent = driver;
      el.unlockDrivers.append(item);
    });
  }
  if (el.unlockVerification) el.unlockVerification.textContent = verificationPrompt(record);
  if (el.unlockWorkspaceLink) el.unlockWorkspaceLink.href = toolbenchPreviewUrl(record);
}

function savePublicInterest(event) {
  event.preventDefault();
  const email = normalizeEmail(el.publicInterestEmail.value);
  if (!email || !selectedRecord) return;
  addPublicWaitlistEmail(email);
  const trust = publicTrustProfile(selectedRecord);
  syncToolbenchPreviewRecord(selectedRecord);
  writeStoredJson(pendingMemberIntentKey, {
    email,
    recordId: selectedRecord.id,
    title: selectedRecord.title,
    area: selectedRecord.area,
    propertyType: selectedRecord.propertyType,
    decision: selectedRecord.decision,
    reason: selectedRecord.reason,
    official: selectedRecord.official,
    asking: selectedRecord.asking,
    fairRange: selectedRecord.fairRange,
    gap: selectedRecord.gap,
    confidence: selectedRecord.confidence,
    action: selectedRecord.action,
    sourceSummary: selectedRecord.sourceSummary,
    mobileSummary: selectedRecord.mobileSummary,
    trustTitle: trust.title,
    trustLevel: trust.level,
    workspaceHref: toolbenchPreviewUrl(selectedRecord),
    createdAt: new Date().toISOString()
  });
  el.publicInterestStatus.textContent =
    `${selectedRecord.title} saved for ${email}. Opening the account area.`;
  window.setTimeout(() => {
    window.location.href = "./members/account/?intent=public-free";
  }, 350);
}

function saveMemberSession(email) {
  memberSession = {
    email,
    signedInAt: new Date().toISOString()
  };
  writeStoredJson(memberSessionKey, memberSession);
  updateMemberState();
}

function updateCurrentMemberReport() {
  if (!selectedRecord || !el.memberReportTitle) return;
  el.memberReportTitle.textContent = selectedRecord.title;
  el.memberReportSummary.textContent =
    `${selectedRecord.decision} ${selectedRecord.mobileSummary} Fair range: ${moneyRange(selectedRecord.fairRange)}.`;
}

function renderSavedReports() {
  const reports = getCurrentMemberReports();
  if (!el.savedReportCount || !el.savedReportsList) return;
  el.savedReportCount.textContent = `${reports.length} saved`;
  el.savedReportsList.replaceChildren();

  if (!reports.length) {
    const empty = document.createElement("p");
    empty.textContent = "No saved rent reports yet.";
    el.savedReportsList.append(empty);
    return;
  }

  reports.slice(0, 6).forEach((report) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "saved-report-item";
    item.dataset.recordId = report.recordId;

    const title = document.createElement("strong");
    title.textContent = report.title;
    const meta = document.createElement("span");
    meta.textContent = `${money(report.asking)} asking | ${report.gap > 0 ? "+" : ""}${report.gap}% gap`;

    item.append(title, meta);
    item.addEventListener("click", () => {
      const record = rentRecords.find((entry) => entry.id === report.recordId);
      if (!record) return;
      el.input.value = record.title;
      updateResult(record);
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.savedReportsList.append(item);
  });
}

function updateMemberState() {
  const state = publicAccessState();
  if (el.memberWorkspace) el.memberWorkspace.hidden = !state.workspace;
  if (el.membersLoginOpen) el.membersLoginOpen.dataset.access = state.key;
  if (el.memberAccessLabel) el.memberAccessLabel.textContent = state.label;
  if (el.memberState) el.memberState.textContent = state.title;
  if (el.chartShell) el.chartShell.dataset.locked = state.workspace ? "false" : "true";
  if (el.chartKicker) el.chartKicker.textContent = state.chart;
  if (el.togglePaid) el.togglePaid.textContent = state.chartButton;
  if (state.workspace) renderSavedReports();
  updateCurrentMemberReport();
}

function requireMember() {
  if (hasToolAccess()) return true;
  if (el.memberActionStatus) {
    el.memberActionStatus.textContent = memberSession?.email
      ? "Your account is signed in, but saved tools are not ready for this session yet."
      : "Sign in through the account area to use saved tools.";
  }
  goToMemberAccount();
  return false;
}

function saveCurrentReport() {
  if (!requireMember()) return;
  const reports = getSavedReports().filter((report) => {
    const sameRecord = report.recordId === selectedRecord.id;
    const sameMember = normalizeEmail(report.memberEmail || memberSession.email) === normalizeEmail(memberSession.email);
    return !(sameRecord && sameMember);
  });
  reports.unshift(normalizeBackendReport({
    recordId: selectedRecord.id,
    memberEmail: normalizeEmail(memberSession.email),
    title: selectedRecord.title,
    decision: selectedRecord.decision,
    asking: selectedRecord.asking,
    official: selectedRecord.official,
    gap: selectedRecord.gap,
    savedAt: new Date().toISOString()
  }));
  writeSavedReports(reports);
  renderSavedReports();
  el.memberActionStatus.textContent = `${selectedRecord.title} saved to your account area and local prototype backend.`;
}

function exportCurrentReport() {
  if (!requireMember()) return;
  const lines = [
    `RentIntel report: ${selectedRecord.title}`,
    `Member: ${memberSession.email}`,
    `Decision: ${selectedRecord.decision}`,
    `Summary: ${selectedRecord.reason}`,
    `Official median: ${money(selectedRecord.official)}`,
    `Current asking: ${money(selectedRecord.asking)}`,
    `Fair range: ${moneyRange(selectedRecord.fairRange)}`,
    `Gap: ${selectedRecord.gap > 0 ? "+" : ""}${selectedRecord.gap}%`,
    `Next action: ${selectedRecord.action}`,
    `Source split: ${selectedRecord.sourceSummary}`
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedRecord.id}-rentintel-summary.txt`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  el.memberActionStatus.textContent = "Summary export prepared.";
}

function setAreaAlert() {
  if (!requireMember()) return;
  el.memberActionStatus.textContent =
    `Area alert set for ${selectedRecord.area}. The production build will send email when the rent signal changes.`;
}

function filteredSeries() {
  if (selectedRange === "all") return selectedRecord.series;
  const points = selectedRange === "3" ? 6 : 10;
  return selectedRecord.series.slice(-points);
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

function drawRentChart() {
  const { context, width, height } = setupCanvas(el.rentChart);
  const series = filteredSeries();
  const values = series.flatMap((point) => [point[1], point[2]]);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const pad = { top: 36, right: 28, bottom: 56, left: 62 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffdf9";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = colors.grid;
  context.lineWidth = 1;
  context.fillStyle = colors.muted;
  context.font = "12px Inter, system-ui, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (chartH / 4) * i;
    const value = max - ((max - min) / 4) * i;
    context.beginPath();
    context.moveTo(pad.left, y);
    context.lineTo(width - pad.right, y);
    context.stroke();
    context.fillText(`S$${value.toFixed(0)}`, 14, y + 4);
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
      const x = xFor(i);
      const y = yFor(point[index]);
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
    });

    const last = series[series.length - 1];
    context.font = "13px Inter, system-ui, sans-serif";
    context.fillText(label, xFor(series.length - 1) - 104, yFor(last[index]) - 12);
  }

  line(1, colors.official, "Official median");
  line(2, colors.asking, "Asking median");

  context.fillStyle = colors.muted;
  context.font = "12px Inter, system-ui, sans-serif";
  series.forEach((point, i) => {
    const label = point[0].replace("20", "'");
    context.fillText(label, xFor(i) - 18, height - 24);
  });

  context.fillStyle = colors.ink;
  context.font = "700 14px Inter, system-ui, sans-serif";
  context.fillText("S$/psf/month", pad.left, 22);
}

function pressureStatus(record) {
  if (record.gap >= 22) return { key: "high", label: "High" };
  if (record.gap >= 10) return { key: "watch", label: "Watch" };
  return { key: "fair", label: "Fair" };
}

function gaugePosition(value, min, max) {
  if (max <= min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function pressurePanelRows() {
  const merged = new Map();
  if (selectedRecord) merged.set(selectedRecord.id, selectedRecord);
  rentRecords.forEach((record) => merged.set(record.id, record));
  return [...merged.values()]
    .sort((a, b) => {
      if (a.id === selectedRecord.id) return -1;
      if (b.id === selectedRecord.id) return 1;
      return b.gap - a.gap;
    })
    .slice(0, 5);
}

function renderPressurePanel() {
  if (!selectedRecord || !el.pressureList) return;
  const status = pressureStatus(selectedRecord);
  const fairLow = selectedRecord.fairRange?.low || selectedRecord.official * 0.95;
  const fairHigh = selectedRecord.fairRange?.high || selectedRecord.official * 1.15;
  const gaugeMin = Math.min(fairLow, selectedRecord.official, selectedRecord.asking) * 0.94;
  const gaugeMax = Math.max(fairHigh, selectedRecord.official, selectedRecord.asking) * 1.06;
  const fairStart = gaugePosition(fairLow, gaugeMin, gaugeMax);
  const fairWidth = Math.max(4, gaugePosition(fairHigh, gaugeMin, gaugeMax) - fairStart);
  const benchmarkPos = gaugePosition(selectedRecord.official, gaugeMin, gaugeMax);
  const askingPos = gaugePosition(selectedRecord.asking, gaugeMin, gaugeMax);

  el.pressurePanelTitle.textContent = selectedRecord.title;
  el.pressureFocus.dataset.status = status.key;
  el.pressureSignal.textContent = status.label;
  el.pressureGap.textContent = `${selectedRecord.gap > 0 ? "+" : ""}${selectedRecord.gap}%`;
  el.pressureAsking.textContent = money(selectedRecord.asking);
  el.pressureFairRange.textContent = moneyRange(selectedRecord.fairRange);
  el.pressureGauge.style.setProperty("--fair-start", `${fairStart}%`);
  el.pressureGauge.style.setProperty("--fair-width", `${fairWidth}%`);
  el.pressureGauge.style.setProperty("--benchmark-pos", `${benchmarkPos}%`);
  el.pressureGauge.style.setProperty("--asking-pos", `${askingPos}%`);
  el.pressureBoardSummary.textContent = `${pressurePanelRows().length} areas compared`;
  el.pressureList.replaceChildren();

  const maxGap = Math.max(...pressurePanelRows().map((record) => Math.abs(record.gap)), 1);
  pressurePanelRows().forEach((record) => {
    const rowStatus = pressureStatus(record);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "pressure-row";
    row.dataset.status = rowStatus.key;
    row.dataset.active = record.id === selectedRecord.id ? "true" : "false";

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = record.id === selectedRecord.id ? `${record.area} selected` : record.area;
    const detail = document.createElement("small");
    detail.textContent = record.propertyType;
    copy.append(title, detail);

    const bar = document.createElement("i");
    bar.style.setProperty("--pressure-width", `${Math.max(6, (Math.abs(record.gap) / maxGap) * 100)}%`);

    const metric = document.createElement("b");
    metric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;

    row.append(copy, bar, metric);
    row.addEventListener("click", () => {
      el.input.value = record.title;
      updateResult(record);
      renderSearchSuggestions();
    });
    el.pressureList.append(row);
  });
}

function topRentMovers() {
  return [...rentRecords]
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 4);
}

function freshnessWatchRows() {
  return [...rentRecords]
    .map((record) => ({ record, freshness: sourceQaProfile(record) }))
    .sort((a, b) => {
      const rank = { stale: 0, watch: 1, fresh: 2 };
      const diff = rank[a.freshness.freshnessState] - rank[b.freshness.freshnessState];
      if (diff !== 0) return diff;
      return Math.abs(b.record.gap) - Math.abs(a.record.gap);
    })
    .slice(0, 4);
}

function renderRentMovers() {
  if (!el.rentMoversList || !el.freshnessWatchList) return;

  const movers = topRentMovers();
  el.rentMoversSummary.textContent = `${movers.length} areas to watch`;
  el.rentMoversList.replaceChildren();
  movers.forEach((record) => {
    const status = pressureStatus(record);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "rent-mover-row";
    row.dataset.status = status.key;
    row.dataset.active = selectedRecord && record.id === selectedRecord.id ? "true" : "false";

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = record.title;
    const detail = document.createElement("small");
    detail.textContent = `${record.decision} | ${moneyRange(record.fairRange)}`;
    copy.append(title, detail);

    const metric = document.createElement("b");
    metric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;

    row.append(copy, metric);
    row.addEventListener("click", () => {
      el.input.value = record.title;
      updateResult(record);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.rentMoversList.append(row);
  });

  const freshnessRows = freshnessWatchRows();
  el.freshnessWatchSummary.textContent = `${freshnessRows.length} source checks`;
  el.freshnessWatchList.replaceChildren();
  freshnessRows.forEach(({ record, freshness }) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "rent-mover-row";
    row.dataset.status = freshness.freshnessState;
    row.dataset.active = selectedRecord && record.id === selectedRecord.id ? "true" : "false";

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = record.area;
    const detail = document.createElement("small");
    detail.textContent = `${freshness.freshnessLabel} | ${freshness.captured}`;
    copy.append(title, detail);

    const metric = document.createElement("b");
    metric.textContent = freshness.status;

    row.append(copy, metric);
    row.addEventListener("click", () => {
      el.input.value = record.title;
      updateResult(record);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.freshnessWatchList.append(row);
  });
}

function renderCoverageHighlights() {
  if (!el.coverageHighlightsList || !el.coverageHighlightsSummary) return;
  const requests = publicCoverageRequests();
  const counts = coverageStatusCounts(requests);
  el.coverageHighlightsSummary.textContent = requests.length
    ? `${requests.length} requested areas`
    : "Queue is open for new areas";
  if (el.coverageStatusSummary) {
    el.coverageStatusSummary.textContent = requests.length
      ? `${counts.pending} in review | ${counts.approved} pilot | ${counts.production} production`
      : "Ready for the first request";
  }
  if (el.coveragePendingMetric) el.coveragePendingMetric.textContent = String(counts.pending);
  if (el.coverageApprovedMetric) el.coverageApprovedMetric.textContent = String(counts.approved);
  if (el.coverageProductionMetric) el.coverageProductionMetric.textContent = String(counts.production);
  if (el.coverageHighlightCopy) {
    el.coverageHighlightCopy.textContent = requests.length
      ? "RentIntel reviews requested areas by benchmark fit, asking-rent source quality, and readiness for public release."
      : "Search an uncovered retail area and RentIntel will move it through benchmark fit, source checks, and public-release readiness.";
  }

  el.coverageHighlightsList.replaceChildren();
  if (!requests.length) {
    const empty = document.createElement("p");
    empty.className = "coverage-highlight-empty";
    empty.textContent = "No public coverage requests yet. Search an uncovered retail area above to add the first one to the queue.";
    el.coverageHighlightsList.append(empty);
    return;
  }

  requests.slice(0, 4).forEach((request) => {
    const profile = coverageStatusProfile(request.productionReadyAt ? "production ready" : request.status);
    const item = document.createElement("button");
    item.type = "button";
    item.className = "coverage-highlight-item";
    item.dataset.status = profile.key;

    const title = document.createElement("strong");
    title.textContent = request.requestedQuery || request.requestedArea || "Requested area";
    const detail = document.createElement("span");
    detail.textContent = [
      request.requestedPropertyType || "",
      request.requestedUseCase || "",
      profile.label
    ].filter(Boolean).join(" | ");
    const next = document.createElement("small");
    next.textContent = profile.nextStep;

    item.append(title, detail, next);
    item.addEventListener("click", () => {
      el.input.value = request.requestedQuery;
      const approvedRecord = coverageRecordForRequest(request);
      if (approvedRecord) updateResult(approvedRecord);
      else showNoMatch(request.requestedQuery);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.coverageHighlightsList.append(item);
  });
}

async function init() {
  sanitizeCoverageStorage();
  memberSession = loadStoredJson(memberSessionKey, null);
  rentRecords = await loadRentIntelData();
  if (!rentRecords.length) {
    el.dailyInsight.textContent = "RentIntel data is unavailable. Check the local data file.";
    return;
  }
  selectedRecord = initialRecordFromUrl() || rentRecords[0];
  renderDataFreshness(selectedRecord);
  renderRentMovers();
  renderCoverageHighlights();
  setupPulseInteractions();

  const daily = chooseDailyInsight();
  el.dailyInsight.textContent = daily.daily;
  el.dailyInsightLink.addEventListener("click", () => {
    updateResult(daily);
    el.input.value = daily.title;
  });

  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = findRecord(button.dataset.query);
      el.input.value = button.dataset.query;
      if (result) updateResult(result);
      else showNoMatch(button.dataset.query);
      renderSearchSuggestions();
      document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  el.input.addEventListener("input", renderSearchSuggestions);
  el.input.addEventListener("focus", renderSearchSuggestions);

  el.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = findRecord(el.input.value);
    if (result) updateResult(result);
    else showNoMatch(el.input.value.trim());
    renderSearchSuggestions();
    document.getElementById("search").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  el.saveReportButton?.addEventListener("click", saveCurrentReport);
  el.exportReportButton?.addEventListener("click", exportCurrentReport);
  el.areaAlertButton?.addEventListener("click", setAreaAlert);
  el.publicInterestForm?.addEventListener("submit", savePublicInterest);
  el.coverageRequestForm?.addEventListener("submit", saveCoverageRequest);
  el.copyCoverageQueueButton?.addEventListener("click", copyCoverageQueue);
  el.downloadCoverageQueueButton?.addEventListener("click", downloadCoverageQueue);

  el.togglePaid?.addEventListener("click", () => {
    el.chartShell?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelectorAll("[data-range]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRange = button.dataset.range;
      document.querySelectorAll("[data-range]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      drawRentChart();
    });
  });

  window.addEventListener("resize", () => {
    drawRentChart();
  });

  el.input.value = selectedRecord.title;
  updateResult(selectedRecord);
  renderSearchSuggestions();
  renderPublicCoverageQueue();
  renderCoverageHighlights();
  updateMemberState();
}

init();
