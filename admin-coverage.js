const candidatesKey = "rentintelAskingSourceCandidates";
const coverageRecordsKey = "rentintelCoverageRecords";
const reviewHistoryKey = "rentintelSourceReviewHistory";

const adminEl = {
  total: document.getElementById("adminCoverageTotal"),
  manual: document.getElementById("adminCoverageManual"),
  qaReady: document.getElementById("adminCoverageQaReady"),
  samples: document.getElementById("adminCoverageSamples"),
  search: document.getElementById("adminCoverageSearch"),
  filter: document.getElementById("adminCoverageFilter"),
  seed: document.getElementById("adminCoverageSeed"),
  export: document.getElementById("adminCoverageExport"),
  list: document.getElementById("adminCoverageList"),
  status: document.getElementById("adminCoverageStatus"),
  payloadTitle: document.getElementById("adminCoveragePayloadTitle"),
  payload: document.getElementById("adminCoveragePayload"),
  historyTitle: document.getElementById("adminCoverageHistoryTitle"),
  history: document.getElementById("adminCoverageHistory")
};

function renderAccessBlocked(message) {
  adminEl.list.replaceChildren();
  const empty = document.createElement("p");
  empty.textContent = message;
  adminEl.list.append(empty);
  adminEl.status.textContent = message;
}

function loadStoredJson(key, fallback = []) {
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

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");
}

function money(value) {
  return `S$${Number(value).toFixed(2)} psf`;
}

function coverageCandidates() {
  return loadStoredJson(candidatesKey, [])
    .map((candidate, index) => ({ candidate, index }))
    .filter(({ candidate }) => candidate?.type === "coverage request");
}

function coverageRecords() {
  return loadStoredJson(coverageRecordsKey, []);
}

function sourceCandidateName(candidate) {
  return candidate?.requestedQuery || candidate?.name || "Unnamed coverage request";
}

function coverageRecordId(candidate) {
  return `coverage-${slugify(sourceCandidateName(candidate))}`;
}

function coverageRecordExists(candidate) {
  const id = candidate.sampleRecordId || coverageRecordId(candidate);
  return coverageRecords().some((record) => record.id === id);
}

function classificationLabel(value = "") {
  const labels = {
    "retail-hdb": "Retail: HDB/neighbourhood",
    "retail-shophouse": "Retail: shophouse",
    "retail-mall": "Retail: mall",
    "neighbourhood-shop": "Retail: neighbourhood shop",
    industrial: "Industrial",
    office: "Office",
    warehouse: "Warehouse",
    exclude: "Exclude"
  };
  return labels[value] || "Unclassified";
}

function classificationAllowsSample(value = "") {
  return ["retail-hdb", "retail-shophouse", "retail-mall", "neighbourhood-shop"].includes(value);
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) {
    return {
      status: "blocked",
      sampleAllowed: false,
      reason: "Pulau Tekong is outside RentIntel retail-rent coverage scope.",
      action: "Do not create HDB-retail or shop-rent samples for this location."
    };
  }
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) {
    return {
      status: "blocked",
      sampleAllowed: false,
      reason: "Offshore and special-use islands are not eligible for prototype retail coverage.",
      action: "Keep out of public samples until a real classified commercial source exists."
    };
  }
  if (text.includes("farm") && text.includes("hdb retail")) {
    return {
      status: "blocked",
      sampleAllowed: false,
      reason: "Farm and HDB retail are conflicting property classifications.",
      action: "Ask for the correct retail property type before review."
    };
  }
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) {
    return {
      status: "blocked",
      sampleAllowed: false,
      reason: "The area and HDB retail property type do not fit together.",
      action: "Use mall, shophouse, or neighbourhood shop where that matches the location."
    };
  }
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) {
    return {
      status: "manual",
      sampleAllowed: false,
      reason: "This search needs manual source classification.",
      action: "Classify before any sample answer is created."
    };
  }
  return {
    status: "eligible",
    sampleAllowed: true,
    reason: "Eligible for retail coverage review.",
    action: "Check benchmark fit, property type, and asking-rent source availability."
  };
}

function candidateText(candidate) {
  return [
    candidate.requestedQuery,
    candidate.requestedArea,
    candidate.requestedPropertyType,
    candidate.requestedUseCase,
    candidate.requestEmail,
    candidate.status,
    candidate.sourceClassification,
    candidate.coverageQaDecision,
    candidate.coverageEligibilityReason
  ].filter(Boolean).join(" ");
}

function coverageEligibilityForCandidate(candidate) {
  const profile = coverageEligibilityProfile(candidateText(candidate));
  if (profile.status === "manual" && classificationAllowsSample(candidate.sourceClassification || "")) {
    return {
      ...profile,
      status: "eligible",
      sampleAllowed: true,
      reason: `${classificationLabel(candidate.sourceClassification)} classification approved for retail coverage.`,
      action: "Complete QA and approval before creating a sample."
    };
  }
  return profile;
}

function qaChecks(candidate) {
  const eligibility = coverageEligibilityForCandidate(candidate);
  const approved = candidate.status === "approved for pilot" || Boolean(candidate.productionReadyAt);
  const classification = candidate.sourceClassification || "";
  const decision = candidate.coverageQaDecision || "";
  const hasPropertyType = Boolean(candidate.requestedPropertyType) ||
    /\b(hdb|shop|shophouse|mall|retail)\b/i.test(sourceCandidateName(candidate));
  const checks = [
    { label: "Eligible", done: eligibility.sampleAllowed },
    { label: "Classified", done: Boolean(classification) && classification !== "exclude" },
    { label: "Approved", done: approved },
    { label: "Property type", done: hasPropertyType && eligibility.status !== "blocked" },
    { label: "QA pass", done: decision === "pass" },
    { label: "Not restricted", done: eligibility.status !== "blocked" }
  ];
  return {
    checks,
    ready: checks.every((check) => check.done),
    eligibility
  };
}

function manualReviewNeeded(candidate) {
  const qa = qaChecks(candidate);
  return qa.eligibility.status === "manual" ||
    candidate.status === "manual review" ||
    candidate.coverageQaDecision === "needs-source" ||
    ["industrial", "office", "warehouse"].includes(candidate.sourceClassification);
}

function priorityScore(candidate) {
  let score = 20;
  if (candidate.productionReadyAt) score += 55;
  if (coverageRecordExists(candidate)) score += 40;
  if (candidate.status === "approved for pilot") score += 30;
  if (candidate.coverageQaDecision === "pass") score += 20;
  if (manualReviewNeeded(candidate)) score += 18;
  if (candidate.requestedUrgency === "urgent") score += 28;
  if (candidate.requestedUrgency === "soon") score += 14;
  if (candidate.requestEmail) score += 8;
  if (candidate.status === "rejected") score -= 50;
  return Math.max(0, Math.min(100, score));
}

function priorityLabel(score) {
  if (score >= 75) return "P1";
  if (score >= 50) return "P2";
  return "P3";
}

function addHistory(action, candidate, note = "") {
  const history = loadStoredJson(reviewHistoryKey, []);
  history.unshift({
    action,
    candidate: sourceCandidateName(candidate),
    status: candidate.status || "",
    classification: candidate.sourceClassification || "",
    qaDecision: candidate.coverageQaDecision || "",
    note,
    at: new Date().toISOString()
  });
  writeStoredJson(reviewHistoryKey, history.slice(0, 80));
}

function updateCandidate(index, patch, action, note = "") {
  const candidates = loadStoredJson(candidatesKey, []);
  if (!candidates[index]) return;
  candidates[index] = {
    ...candidates[index],
    ...patch,
    updatedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: "admin-preview"
  };
  writeStoredJson(candidatesKey, candidates);
  addHistory(action, candidates[index], note);
  adminEl.status.textContent = `${sourceCandidateName(candidates[index])}: ${action}.`;
  renderAdminCoverage();
}

function inferCoverageProperty(query) {
  const normalized = String(query).toLowerCase();
  if (/\b(shop\s*house|shophouse|conservation)\b/.test(normalized)) {
    return { label: "Shophouse retail", official: 12.6, asking: 16.1, actionNoun: "frontage, approved use, and conservation constraints" };
  }
  if (/\b(mall|shopping|plaza|centre|center|point|junction)\b/.test(normalized)) {
    return { label: "Shopping centre retail", official: 17.8, asking: 21.4, actionNoun: "floor position, frontage, and mall traffic" };
  }
  return { label: "HDB retail", official: 8.9, asking: 11.4, actionNoun: "frontage, permitted use, and observed footfall" };
}

function inferCoverageArea(query) {
  const propertyWords = /\b(hdb|retail|shop|shops|mall|shopping|centre|center|plaza|point|junction|shophouse|shop house|commercial|unit|rent|rental|asking)\b/gi;
  const cleaned = String(query).replace(propertyWords, " ").replace(/\s+/g, " ").trim();
  return titleCase(cleaned || query);
}

function comparableSeries(official, asking) {
  return [
    [2021, Number((official * 0.86).toFixed(2)), Number((asking * 0.78).toFixed(2))],
    [2022, Number((official * 0.92).toFixed(2)), Number((asking * 0.86).toFixed(2))],
    [2023, Number((official * 0.98).toFixed(2)), Number((asking * 0.93).toFixed(2))],
    [2024, official, Number((asking * 0.98).toFixed(2))],
    [2025, Number((official * 1.03).toFixed(2)), asking]
  ];
}

function coverageRecordForCandidate(candidate) {
  const query = sourceCandidateName(candidate);
  const inferred = inferCoverageProperty(query);
  const area = inferCoverageArea(query);
  const official = inferred.official;
  const asking = inferred.asking;
  const gap = Math.round(((asking - official) / official) * 100);
  const fairHigh = Number(Math.max(official * 1.18, official + 1.2).toFixed(1));
  const fairLow = Number((official * 0.95).toFixed(1));
  const title = `${area} ${inferred.label === "HDB retail" ? "HDB retail" : inferred.label.toLowerCase()}`;
  return {
    id: coverageRecordId(candidate),
    aliases: [query.toLowerCase(), area.toLowerCase(), inferred.label.toLowerCase(), `${area.toLowerCase()} ${inferred.label.toLowerCase()}`],
    title,
    propertyType: inferred.label,
    area,
    confidence: "Coverage sample",
    decision: "Approved coverage request converted to sample rent signal.",
    reason: `Prototype record generated from the approved public coverage request "${query}". Replace with connected source evidence before production use.`,
    official,
    asking,
    gap,
    daily: `${title} has been added as a coverage sample at ${money(asking)}, about ${gap}% above a prototype benchmark of ${money(official)}.`,
    series: comparableSeries(official, asking),
    map: { x: 330, y: 230, status: gap >= 22 ? "high" : "watch" },
    fairRange: { low: fairLow, high: fairHigh },
    actionLabel: gap >= 22 ? "Push back" : "Validate premium",
    action: `${gap >= 22 ? "Push back" : "Validate premium"} above ${money(fairHigh)} unless the unit has strong ${inferred.actionNoun}.`,
    sourceSummary: `Coverage request sample: ${query}. Source sync should replace this with official benchmark, OneMap classification, and verified asking-rent feed records.`,
    mobileSummary: `Coverage sample for ${area}. Treat ${money(fairHigh)} as the prototype push-back line until direct source evidence is connected.`,
    prototypeSource: "coverage-request",
    generatedAt: new Date().toISOString()
  };
}

function classifyCandidate(index, classification) {
  if (!classification) {
    adminEl.status.textContent = "Choose a source classification first.";
    return;
  }
  const sampleAllowed = classificationAllowsSample(classification);
  updateCandidate(index, {
    sourceClassification: classification,
    coverageEligibilityStatus: sampleAllowed ? "eligible" : classification === "exclude" ? "blocked" : "manual",
    coverageEligibilityReason: `${classificationLabel(classification)} classification recorded by admin.`,
    status: classification === "exclude" ? "rejected" : sampleAllowed ? "candidate review" : "manual review",
    requestedPropertyType: sampleAllowed ? classificationLabel(classification) : undefined
  }, `classified as ${classificationLabel(classification)}`);
}

function recordQaDecision(index, decision) {
  const statusPatch = decision === "fail"
    ? { status: "rejected" }
    : decision === "needs-source"
      ? { status: "manual review" }
      : {};
  updateCandidate(index, {
    coverageQaDecision: decision,
    coverageQaDecisionAt: new Date().toISOString(),
    coverageQaDecisionBy: "admin-preview",
    ...statusPatch
  }, decision === "pass" ? "QA passed" : decision === "fail" ? "QA failed" : "marked needs source");
}

function setReviewStatus(index, status) {
  updateCandidate(index, { status }, `marked ${status}`);
}

function createSample(index) {
  const candidates = loadStoredJson(candidatesKey, []);
  const candidate = candidates[index];
  if (!candidate) return;
  const qa = qaChecks(candidate);
  if (!qa.ready) {
    adminEl.status.textContent = `${sourceCandidateName(candidate)} needs classification, approval, and QA pass before sample creation.`;
    return;
  }
  const record = coverageRecordForCandidate(candidate);
  const records = coverageRecords().filter((item) => item.id !== record.id);
  writeStoredJson(coverageRecordsKey, [record, ...records].slice(0, 50));
  candidates[index] = {
    ...candidate,
    sampleRecordId: record.id,
    sampleRecordCreatedAt: candidate.sampleRecordCreatedAt || record.generatedAt,
    updatedAt: new Date().toISOString()
  };
  writeStoredJson(candidatesKey, candidates);
  addHistory("sample created", candidates[index], record.id);
  adminEl.status.textContent = `${record.title} sample created.`;
  renderAdminCoverage();
}

function copyPayload() {
  const entries = filteredEntries().map(({ candidate }) => ({
    requestedQuery: candidate.requestedQuery || "",
    requestedArea: candidate.requestedArea || "",
    requestedPropertyType: candidate.requestedPropertyType || "",
    status: candidate.status || "candidate review",
    sourceClassification: candidate.sourceClassification || "",
    coverageQaDecision: candidate.coverageQaDecision || "",
    sampleRecordId: candidate.sampleRecordId || "",
    requestEmail: candidate.requestEmail || ""
  }));
  const payload = JSON.stringify({
    contract: "rentintel-admin-coverage-review",
    generatedAt: new Date().toISOString(),
    route: "/api/sources/coverage-requests",
    records: entries
  }, null, 2);
  navigator.clipboard?.writeText(payload)
    .then(() => {
      adminEl.status.textContent = `${entries.length} coverage records copied for backend handoff.`;
    })
    .catch(() => {
      adminEl.status.textContent = "Copy unavailable in this browser. Use the payload panel.";
    });
}

function addTestRequest() {
  const candidates = loadStoredJson(candidatesKey, []);
  const query = "Bedok HDB retail";
  const duplicate = candidates.some((candidate) => candidate.type === "coverage request" && sourceCandidateName(candidate).toLowerCase() === query.toLowerCase());
  if (duplicate) {
    adminEl.status.textContent = `${query} is already in the coverage queue.`;
    return;
  }
  candidates.unshift({
    type: "coverage request",
    name: `Coverage request: ${query}`,
    requestedQuery: query,
    requestedArea: "Bedok",
    requestedPropertyType: "HDB retail",
    requestedUseCase: "Renewal negotiation",
    requestedUrgency: "soon",
    requestEmail: "pilot@rent-intel.com",
    coverageEligibilityStatus: "eligible",
    coverageEligibilityReason: "Eligible for coverage review.",
    status: "candidate review",
    addedAt: new Date().toISOString(),
    source: "admin-test-request"
  });
  writeStoredJson(candidatesKey, candidates.slice(0, 100));
  addHistory("test request added", candidates[0]);
  adminEl.status.textContent = `${query} added for admin review.`;
  renderAdminCoverage();
}

function rowMatchesFilter(candidate, qa) {
  const filter = adminEl.filter.value || "all";
  if (filter === "manual") return manualReviewNeeded(candidate);
  if (filter === "pending") return !["approved for pilot", "rejected"].includes(candidate.status) && !candidate.sampleRecordId;
  if (filter === "qa-ready") return qa.ready && !coverageRecordExists(candidate);
  if (filter === "sample") return Boolean(candidate.sampleRecordId) || coverageRecordExists(candidate);
  if (filter === "rejected") return candidate.status === "rejected";
  return true;
}

function filteredEntries() {
  const search = String(adminEl.search.value || "").trim().toLowerCase();
  return coverageCandidates()
    .filter(({ candidate }) => !search || candidateText(candidate).toLowerCase().includes(search))
    .filter(({ candidate }) => rowMatchesFilter(candidate, qaChecks(candidate)))
    .sort((a, b) => priorityScore(b.candidate) - priorityScore(a.candidate));
}

function renderMetrics(entries) {
  const all = coverageCandidates();
  adminEl.total.textContent = String(all.length);
  adminEl.manual.textContent = String(all.filter(({ candidate }) => manualReviewNeeded(candidate)).length);
  adminEl.qaReady.textContent = String(all.filter(({ candidate }) => qaChecks(candidate).ready && !coverageRecordExists(candidate)).length);
  adminEl.samples.textContent = String(all.filter(({ candidate }) => candidate.sampleRecordId || coverageRecordExists(candidate)).length);
  adminEl.payloadTitle.textContent = `${entries.length} visible records`;
  adminEl.payload.textContent = JSON.stringify({
    route: "/api/sources/coverage-requests",
    visible: entries.length,
    total: all.length,
    records: entries.slice(0, 8).map(({ candidate }) => ({
      requestedQuery: candidate.requestedQuery || "",
      status: candidate.status || "",
      classification: candidate.sourceClassification || "",
      qaDecision: candidate.coverageQaDecision || "",
      sampleRecordId: candidate.sampleRecordId || ""
    }))
  }, null, 2);
}

function renderHistory() {
  const history = loadStoredJson(reviewHistoryKey, []);
  adminEl.history.replaceChildren();
  adminEl.historyTitle.textContent = history.length ? `${history.length} admin actions` : "No admin actions yet";
  if (!history.length) {
    const empty = document.createElement("li");
    empty.textContent = "Classification, QA, approval, and sample actions will appear here.";
    adminEl.history.append(empty);
    return;
  }
  history.slice(0, 8).forEach((item) => {
    const row = document.createElement("li");
    const copy = document.createElement("span");
    copy.textContent = `${item.action}: ${item.candidate}`;
    const meta = document.createElement("small");
    meta.textContent = new Date(item.at).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });
    row.append(copy, meta);
    adminEl.history.append(row);
  });
}

function renderChecklist(checks) {
  const list = document.createElement("ul");
  list.className = "admin-coverage-checklist";
  checks.forEach((check) => {
    const item = document.createElement("li");
    item.dataset.done = String(check.done);
    item.textContent = check.label;
    list.append(item);
  });
  return list;
}

function renderRow({ candidate, index }) {
  const qa = qaChecks(candidate);
  const score = priorityScore(candidate);
  const row = document.createElement("article");
  row.className = "admin-coverage-row";
  row.dataset.status = candidate.status || "candidate review";
  row.dataset.eligibility = qa.eligibility.status;

  const title = document.createElement("div");
  title.className = "admin-coverage-row-title";
  title.innerHTML = `
    <mark>${priorityLabel(score)} ${score}</mark>
    <span>
      <strong>${sourceCandidateName(candidate)}</strong>
      <small>${candidate.requestEmail || "No update email"} | ${candidate.requestedUseCase || "No use case"} | ${qa.eligibility.reason}</small>
    </span>
  `;

  const state = document.createElement("div");
  state.className = "admin-coverage-row-state";
  state.innerHTML = `
    <span>${candidate.status || "candidate review"}</span>
    <span>${classificationLabel(candidate.sourceClassification)}</span>
    <span>${candidate.coverageQaDecision || "No QA"}</span>
  `;

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Source classification");
  [
    ["", "Classify source"],
    ["retail-hdb", "Retail: HDB/neighbourhood"],
    ["retail-shophouse", "Retail: shophouse"],
    ["retail-mall", "Retail: mall"],
    ["neighbourhood-shop", "Retail: neighbourhood shop"],
    ["industrial", "Industrial"],
    ["office", "Office"],
    ["warehouse", "Warehouse"],
    ["exclude", "Exclude"]
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
  select.value = candidate.sourceClassification || "";

  const actions = document.createElement("div");
  actions.className = "admin-coverage-actions";
  const classify = document.createElement("button");
  classify.type = "button";
  classify.textContent = "Classify";
  classify.addEventListener("click", () => classifyCandidate(index, select.value));
  const pass = document.createElement("button");
  pass.type = "button";
  pass.textContent = "Pass QA";
  pass.disabled = !classificationAllowsSample(candidate.sourceClassification || "");
  pass.addEventListener("click", () => recordQaDecision(index, "pass"));
  const needsSource = document.createElement("button");
  needsSource.type = "button";
  needsSource.textContent = "Needs Source";
  needsSource.addEventListener("click", () => recordQaDecision(index, "needs-source"));
  const approve = document.createElement("button");
  approve.type = "button";
  approve.textContent = "Approve";
  approve.disabled = candidate.status === "approved for pilot" || candidate.status === "rejected";
  approve.addEventListener("click", () => setReviewStatus(index, "approved for pilot"));
  const reject = document.createElement("button");
  reject.type = "button";
  reject.textContent = "Reject";
  reject.disabled = candidate.status === "rejected";
  reject.addEventListener("click", () => setReviewStatus(index, "rejected"));
  const sample = document.createElement("button");
  sample.type = "button";
  sample.textContent = coverageRecordExists(candidate) ? "Sample Ready" : "Create Sample";
  sample.disabled = coverageRecordExists(candidate) || !qa.ready;
  sample.addEventListener("click", () => createSample(index));
  actions.append(select, classify, pass, needsSource, approve, reject, sample);

  if (candidate.sampleRecordId || coverageRecordExists(candidate)) {
    const open = document.createElement("a");
    open.href = `../../index.html?rent=${encodeURIComponent(candidate.sampleRecordId || coverageRecordId(candidate))}#search`;
    open.textContent = "Open Public Sample";
    actions.append(open);
  }

  row.append(title, state, actions, renderChecklist(qa.checks));
  return row;
}

function renderAdminCoverage() {
  const entries = filteredEntries();
  renderMetrics(entries);
  renderHistory();
  adminEl.list.replaceChildren();

  if (!coverageCandidates().length) {
    const empty = document.createElement("p");
    empty.textContent = "No public coverage requests yet. Use Add Test Request or search an unsupported area on the public page.";
    adminEl.list.append(empty);
    return;
  }

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "No coverage requests match the current filter.";
    adminEl.list.append(empty);
    return;
  }

  entries.forEach((entry) => adminEl.list.append(renderRow(entry)));
}

async function initAdminCoverage() {
  if (window.RentIntelAuth?.requireAccess) {
    const guard = await window.RentIntelAuth.requireAccess({
      requireLogin: true,
      requireAdmin: true,
      reason: "admin-only",
      accountUrl: "../../members/account/#accountManualReview"
    });
    if (!guard.allowed) return;
  }

  adminEl.search.addEventListener("input", renderAdminCoverage);
  adminEl.filter.addEventListener("change", renderAdminCoverage);
  adminEl.seed.addEventListener("click", addTestRequest);
  adminEl.export.addEventListener("click", copyPayload);
  renderAdminCoverage();
}

initAdminCoverage().catch((error) => {
  console.error("Admin coverage init failed.", error);
  renderAccessBlocked("Admin coverage review failed to initialize.");
});
