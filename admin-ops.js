const opsEl = {
  membersMetric: document.getElementById("adminOpsMembersMetric"),
  membersCopy: document.getElementById("adminOpsMembersCopy"),
  coverageMetric: document.getElementById("adminOpsCoverageMetric"),
  coverageCopy: document.getElementById("adminOpsCoverageCopy"),
  deliveryMetric: document.getElementById("adminOpsDeliveryMetric"),
  deliveryCopy: document.getElementById("adminOpsDeliveryCopy"),
  freshnessMetric: document.getElementById("adminOpsFreshnessMetric"),
  freshnessCopy: document.getElementById("adminOpsFreshnessCopy"),
  focusFilter: document.getElementById("adminOpsFocusFilter"),
  search: document.getElementById("adminOpsSearch"),
  refresh: document.getElementById("adminOpsRefresh"),
  refreshFeed: document.getElementById("adminOpsRefreshFeed"),
  reloadReport: document.getElementById("adminOpsReloadReport"),
  copy: document.getElementById("adminOpsCopy"),
  status: document.getElementById("adminOpsStatus"),
  attentionTitle: document.getElementById("adminOpsAttentionTitle"),
  attentionList: document.getElementById("adminOpsAttentionList"),
  sourceTitle: document.getElementById("adminOpsSourceTitle"),
  sourceSignals: document.getElementById("adminOpsSourceSignals"),
  syncTitle: document.getElementById("adminOpsSyncTitle"),
  syncFeed: document.getElementById("adminOpsSyncFeed"),
  coverageTitle: document.getElementById("adminOpsCoverageTitle"),
  coverageFeed: document.getElementById("adminOpsCoverageFeed"),
  deliveryTitle: document.getElementById("adminOpsDeliveryTitle"),
  deliveryFeed: document.getElementById("adminOpsDeliveryFeed"),
  handoffTitle: document.getElementById("adminOpsHandoffTitle"),
  evidenceReady: document.getElementById("adminOpsEvidenceReady"),
  queueRelease: document.getElementById("adminOpsQueueRelease"),
  approveHandoff: document.getElementById("adminOpsApproveHandoff"),
  handoffSummary: document.getElementById("adminOpsHandoffSummary"),
  reviewActionTitle: document.getElementById("adminOpsReviewActionTitle"),
  reviewActions: document.getElementById("adminOpsReviewActions"),
  payloadTitle: document.getElementById("adminOpsPayloadTitle"),
  payload: document.getElementById("adminOpsPayload")
};

let latestReport = null;
let currentAdminSession = null;
let refreshFeedBusy = false;
let coverageActionBusy = false;
let releaseActionBusy = false;

function formatDate(value = "") {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function number(value) {
  return Number(value || 0).toLocaleString("en-SG");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function emptyState(container, message) {
  container.replaceChildren();
  const empty = document.createElement("p");
  empty.textContent = message;
  container.append(empty);
}

function focusAllows(sectionKey) {
  const focus = opsEl.focusFilter?.value || "all";
  return focus === "all" || focus === sectionKey;
}

function matchesSearch(values = []) {
  const query = String(opsEl.search?.value || "").trim().toLowerCase();
  if (!query) return true;
  return values.some((value) => String(value || "").toLowerCase().includes(query));
}

function coverageCountByStatus(report, targetStatus) {
  const rows = Array.isArray(report?.coverage?.byStatus) ? report.coverage.byStatus : [];
  const row = rows.find((entry) => String(entry.status || "").toLowerCase() === String(targetStatus || "").toLowerCase());
  return Number(row?.count || 0);
}

function deliveryCountByStatus(report, targetStatus) {
  const rows = Array.isArray(report?.alerts?.byStatus) ? report.alerts.byStatus : [];
  const row = rows.find((entry) => String(entry.status || "").toLowerCase() === String(targetStatus || "").toLowerCase());
  return Number(row?.count || 0);
}

function buildAttentionItems(report) {
  const items = [];
  const latestBreach = report?.sourceOps?.latestBreach || null;
  const evidence = report?.sourceOps?.latestProductionEvidence || null;
  const pendingCoverage = coverageCountByStatus(report, "candidate review");
  const failedDeliveries = deliveryCountByStatus(report, "failed");
  const deadLetterDeliveries = deliveryCountByStatus(report, "dead-letter");

  if (latestBreach) {
    const breachState = String(latestBreach.freshnessState || "").toLowerCase();
    items.push({
      severity: breachState === "stale" ? "critical" : "warning",
      title: breachState === "stale" ? "Source freshness is stale" : "Source freshness needs review",
      copy: `${latestBreach.sourceName || "Source"} moved from ${latestBreach.previousFreshnessState || "unknown"} to ${latestBreach.freshnessState || "unknown"} on ${formatDate(latestBreach.breachAt)}.`,
      actionLabel: "Refresh asking feed",
      actionType: "refresh-feed",
      href: "#source-ops"
    });
  }

  if (failedDeliveries > 0 || deadLetterDeliveries > 0) {
    items.push({
      severity: deadLetterDeliveries > 0 ? "critical" : "warning",
      title: "Alert delivery needs intervention",
      copy: `${number(failedDeliveries)} failed and ${number(deadLetterDeliveries)} dead-letter alert deliveries need follow-up.`,
      actionLabel: "Requeue problem alerts",
      actionType: "requeue-deliveries",
      href: "../../members/account/#accountDeliveryAdmin"
    });
  }

  if (pendingCoverage > 0) {
    items.push({
      severity: pendingCoverage >= 3 ? "warning" : "watch",
      title: "Coverage review queue is active",
      copy: `${number(pendingCoverage)} coverage request${pendingCoverage === 1 ? "" : "s"} remain in candidate review and may block new public samples.`,
      actionLabel: "Open coverage review",
      actionType: "link",
      href: "../coverage/"
    });
  }

  if (!evidence?.evidenceReady) {
    items.push({
      severity: "watch",
      title: "Production evidence is not release-ready",
      copy: evidence?.controlledReleaseNextStep || "Source evidence still needs review before release readiness can be confirmed.",
      actionLabel: "Review handoff state",
      actionType: "link",
      href: "#handoff"
    });
  }

  if (!items.length) {
    items.push({
      severity: "good",
      title: "No urgent ops blockers",
      copy: "Freshness, delivery, coverage, and handoff signals do not currently show a critical blocker.",
      actionLabel: "Refresh report",
      actionType: "reload-report",
      href: "#top"
    });
  }

  return items;
}

function renderHeadlineMetrics(report) {
  const counts = report?.counts || {};
  const membersByAccess = Array.isArray(report?.members?.byAccess) ? report.members.byAccess : [];
  const coverageByStatus = Array.isArray(report?.coverage?.byStatus) ? report.coverage.byStatus : [];
  const alertStatuses = Array.isArray(report?.alerts?.byStatus) ? report.alerts.byStatus : [];
  const latestBreach = report?.sourceOps?.latestBreach || null;
  const schedule = report?.sourceOps?.syncSchedule || null;

  opsEl.membersMetric.textContent = number(counts.members);
  opsEl.membersCopy.textContent = membersByAccess.length
    ? membersByAccess.map((entry) => `${entry.access}: ${entry.count}`).join(" | ")
    : "No member access mix yet.";

  opsEl.coverageMetric.textContent = number(counts.askingSourceCandidates);
  opsEl.coverageCopy.textContent = coverageByStatus.length
    ? coverageByStatus.map((entry) => `${entry.status}: ${entry.count}`).join(" | ")
    : "No coverage queue yet.";

  opsEl.deliveryMetric.textContent = number(counts.alertDeliveries);
  opsEl.deliveryCopy.textContent = alertStatuses.length
    ? alertStatuses.map((entry) => `${entry.status}: ${entry.count}`).join(" | ")
    : "No delivery signals yet.";

  opsEl.freshnessMetric.textContent = latestBreach?.freshnessState
    ? String(latestBreach.freshnessState).toUpperCase()
    : (schedule?.cadence || "Unknown").toUpperCase();
  opsEl.freshnessCopy.textContent = latestBreach
    ? `Latest breach ${formatDate(latestBreach.breachAt)}`
    : schedule
      ? `Cadence ${schedule.cadence || "daily"} at ${schedule.runHourSgt ?? "--"}:00 SGT`
      : "No freshness schedule loaded.";
}

function renderAttentionQueue(report) {
  const items = buildAttentionItems(report).filter((item) =>
    matchesSearch([item.title, item.copy, item.severity, item.actionLabel])
  );
  opsEl.attentionList.replaceChildren();
  opsEl.attentionTitle.textContent = `${items.length} operational signal${items.length === 1 ? "" : "s"} in view`;
  if (!items.length) {
    emptyState(opsEl.attentionList, "No warnings match the current filter.");
    return;
  }
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "admin-ops-attention-item";
    article.dataset.severity = item.severity;
    const body = document.createElement("div");
    body.innerHTML = `
      <span>${item.severity}</span>
      <strong>${item.title}</strong>
      <em>${item.copy}</em>
    `;
    article.append(body);
    if (item.actionType === "refresh-feed" || item.actionType === "reload-report") {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.actionLabel;
      button.dataset.action = item.actionType;
      article.append(button);
    } else {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.actionLabel;
      article.append(link);
    }
    opsEl.attentionList.append(article);
  });
}

function renderSourceSignals(report) {
  if (!focusAllows("watch")) {
    emptyState(opsEl.sourceSignals, "Switch focus to Watchlist or All signals to view source ops.");
    return;
  }
  opsEl.sourceSignals.replaceChildren();
  const sourceOps = report?.sourceOps || {};
  const signals = [
    {
      label: "Sync Cadence",
      value: sourceOps.syncSchedule?.cadence || "Not set",
      copy: sourceOps.syncSchedule ? `Run hour ${sourceOps.syncSchedule.runHourSgt ?? "--"} SGT` : "No schedule saved yet."
    },
    {
      label: "Freshness Policy",
      value: sourceOps.freshnessPolicy ? `${sourceOps.freshnessPolicy.freshMaxDays}/${sourceOps.freshnessPolicy.watchMaxDays} days` : "Not set",
      copy: sourceOps.freshnessPolicy ? "Fresh / watch SLA thresholds." : "No freshness policy saved yet."
    },
    {
      label: "Latest Sync",
      value: sourceOps.latestSyncRun?.status || "Not run",
      copy: sourceOps.latestSyncRun ? `${sourceOps.latestSyncRun.recordsChecked || 0} records checked on ${formatDate(sourceOps.latestSyncRun.at || sourceOps.latestSyncRun.ranAt)}` : "No sync run logged."
    },
    {
      label: "Latest Breach",
      value: sourceOps.latestBreach?.freshnessState || "None",
      copy: sourceOps.latestBreach ? `${sourceOps.latestBreach.note || "Freshness transition"} on ${formatDate(sourceOps.latestBreach.breachAt)}` : "No breach event logged."
    },
    {
      label: "Evidence Gate",
      value: sourceOps.latestProductionEvidence?.evidenceReady ? "Ready" : "Pending",
      copy: sourceOps.latestProductionEvidence?.controlledReleaseNextStep || "No production evidence summary yet."
    }
  ];

  signals.forEach((signal) => {
    if (!matchesSearch([signal.label, signal.value, signal.copy])) return;
    const card = document.createElement("article");
    card.className = "admin-ops-signal-card";
    card.innerHTML = `
      <span>${signal.label}</span>
      <strong>${signal.value}</strong>
      <em>${signal.copy}</em>
    `;
    opsEl.sourceSignals.append(card);
  });

  if (!opsEl.sourceSignals.children.length) {
    emptyState(opsEl.sourceSignals, "No source signals match the current filter.");
  }
  opsEl.sourceTitle.textContent = sourceOps.latestProductionEvidence?.sourceName
    ? `${sourceOps.latestProductionEvidence.sourceName} source loaded`
    : "Source status loaded";
}

function renderFeed(container, items, emptyMessage, renderer) {
  container.replaceChildren();
  const filtered = items.filter(renderer.filter);
  if (!filtered.length) {
    emptyState(container, emptyMessage);
    return;
  }
  filtered.forEach((item) => container.append(renderer.render(item)));
}

function renderSyncFeed(report) {
  const runs = Array.isArray(report?.sourceOps?.recentSyncRuns) ? report.sourceOps.recentSyncRuns : [];
  opsEl.syncTitle.textContent = `${runs.length} recent run${runs.length === 1 ? "" : "s"}`;
  renderFeed(opsEl.syncFeed, runs, "No sync runs match the current view.", {
    filter: (run) => focusAllows("watch") && matchesSearch([run.sourceName, run.status, run.benchmarkLayer, run.ranAt]),
    render: (run) => {
      const item = document.createElement("article");
      item.className = "admin-ops-feed-item";
      item.innerHTML = `
        <strong>${run.sourceName || "Unknown source"}</strong>
        <span>${run.status || "Unknown status"} · ${number(run.recordsChecked)} records · ${run.benchmarkLayer || "No layer"}</span>
        <small>${formatDate(run.ranAt)}</small>
      `;
      return item;
    }
  });
}

function renderCoverageFeed(report) {
  const requests = Array.isArray(report?.coverage?.recentRequests) ? report.coverage.recentRequests : [];
  opsEl.coverageTitle.textContent = `${requests.length} recent request${requests.length === 1 ? "" : "s"}`;
  renderFeed(opsEl.coverageFeed, requests, "No coverage requests match the current view.", {
    filter: (request) => focusAllows("coverage") && matchesSearch([
      request.name,
      request.requestedArea,
      request.sourceClassification,
      request.coverageEligibilityStatus,
      request.coverageQaDecision
    ]),
    render: (request) => {
      const item = document.createElement("article");
      item.className = "admin-ops-feed-item";
      const hasClassification = Boolean(request.sourceClassification);
      const hasQaPass = String(request.coverageQaDecision || "").toLowerCase() === "pass";
      const hasSample = Boolean(request.sampleRecordId || String(request.coverageQaDecision || "").toLowerCase() === "sample-created");
      item.innerHTML = `
        <strong>${request.name || "Unnamed request"}</strong>
        <span>${request.requestedArea || "No area"} · ${request.sourceClassification || "Unclassified"} · ${request.coverageEligibilityStatus || "No eligibility"} · QA ${request.coverageQaDecision || "pending"}</span>
        <small>${formatDate(request.updatedAt)}</small>
        <div class="admin-ops-feed-actions">
          <button type="button" data-coverage-action="classify" data-candidate-id="${request.id}" ${hasClassification ? "disabled" : ""}>Classify Retail</button>
          <button type="button" data-coverage-action="qa-pass" data-candidate-id="${request.id}" ${!hasClassification || hasQaPass ? "disabled" : ""}>Mark QA Pass</button>
          <button type="button" data-coverage-action="create-sample" data-candidate-id="${request.id}" ${!hasQaPass || hasSample ? "disabled" : ""}>Create Sample</button>
        </div>
      `;
      return item;
    }
  });
}

function renderDeliveryFeed(report) {
  const runs = Array.isArray(report?.alerts?.recentRuns) ? report.alerts.recentRuns : [];
  opsEl.deliveryTitle.textContent = `${runs.length} recent delivery run${runs.length === 1 ? "" : "s"}`;
  renderFeed(opsEl.deliveryFeed, runs, "No delivery runs match the current view.", {
    filter: (run) => focusAllows("delivery") && matchesSearch([
      run.runId,
      run.memberEmail,
      run.sentCount,
      run.failedCount,
      run.deadLetterCount
    ]),
    render: (run) => {
      const item = document.createElement("article");
      item.className = "admin-ops-feed-item";
      item.innerHTML = `
        <strong>${run.runId || "Unknown run"}</strong>
        <span>${run.memberEmail || "No member"} · sent ${number(run.sentCount)} · failed ${number(run.failedCount)} · dead-letter ${number(run.deadLetterCount)}</span>
        <small>${formatDate(run.finishedAt)}</small>
      `;
      return item;
    }
  });
}

function renderHandoffSummary(report) {
  if (!focusAllows("handoff")) {
    emptyState(opsEl.handoffSummary, "Switch focus to Handoff or All signals to view readiness.");
    opsEl.handoffTitle.textContent = "Handoff hidden by focus";
    return;
  }
  const latestAudit = report?.handoff?.latestAudit || null;
  if (!latestAudit) {
    emptyState(opsEl.handoffSummary, "No backend handoff audit has been saved yet.");
    opsEl.handoffTitle.textContent = "No handoff audit";
    return;
  }
  opsEl.handoffTitle.textContent = latestAudit.summary || "Latest handoff audit loaded";
  opsEl.handoffSummary.replaceChildren();
  [
    ["Contract", latestAudit.contract || "Unknown"],
    ["Version", latestAudit.version || "Unknown"],
    ["Generated", formatDate(latestAudit.generatedAt)],
    ["Validation Rows", number((latestAudit.validationRows || []).length)],
    ["Reviewer Note", latestAudit.reviewerNote || "No reviewer note"]
  ].forEach(([label, value]) => {
    if (!matchesSearch([label, value, latestAudit.summary])) return;
    const row = document.createElement("div");
    row.className = "admin-ops-detail-row";
    row.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    opsEl.handoffSummary.append(row);
  });
}

function renderReviewActions(report) {
  const actions = Array.isArray(report?.coverage?.reviewActions) ? report.coverage.reviewActions : [];
  opsEl.reviewActionTitle.textContent = `${actions.length} review action type${actions.length === 1 ? "" : "s"}`;
  opsEl.reviewActions.replaceChildren();
  const visibleActions = actions.filter((entry) => matchesSearch([entry.action, entry.count]));
  if (!visibleActions.length) {
    emptyState(opsEl.reviewActions, "No review actions match the current filter.");
    return;
  }
  visibleActions.forEach((entry) => {
    const tag = document.createElement("span");
    tag.className = "admin-ops-tag";
    tag.textContent = `${entry.action}: ${number(entry.count)}`;
    opsEl.reviewActions.append(tag);
  });
}

function renderPayload(report) {
  opsEl.payloadTitle.textContent = `Generated ${formatDate(report?.generatedAt)}`;
  opsEl.payload.textContent = JSON.stringify(report, null, 2);
}

function renderDashboard(report) {
  latestReport = report;
  renderHeadlineMetrics(report);
  renderAttentionQueue(report);
  renderSourceSignals(report);
  renderSyncFeed(report);
  renderCoverageFeed(report);
  renderDeliveryFeed(report);
  renderHandoffSummary(report);
  renderReviewActions(report);
  renderPayload(report);
}

async function loadDashboard() {
  opsEl.status.textContent = "Loading admin ops report...";
  const result = await window.RentIntelAuth.fetchAdminOpsReport();
  if (!result.ok || !result.data?.report) {
    opsEl.status.textContent = result.status === 403
      ? "Admin access is required for the ops dashboard."
      : "Could not load the admin ops report.";
    emptyState(opsEl.sourceSignals, "Admin ops report unavailable.");
    emptyState(opsEl.attentionList, "Admin ops report unavailable.");
    emptyState(opsEl.syncFeed, "Admin ops report unavailable.");
    emptyState(opsEl.coverageFeed, "Admin ops report unavailable.");
    emptyState(opsEl.deliveryFeed, "Admin ops report unavailable.");
    emptyState(opsEl.handoffSummary, "Admin ops report unavailable.");
    emptyState(opsEl.reviewActions, "Admin ops report unavailable.");
    opsEl.payload.textContent = "{}";
    return;
  }
  renderDashboard(result.data.report);
  opsEl.status.textContent = `Admin ops report refreshed at ${formatDate(result.data.report.generatedAt)}.`;
}

async function copyPayload() {
  const text = JSON.stringify(latestReport || {}, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    opsEl.status.textContent = "Ops report JSON copied.";
  } catch (error) {
    opsEl.status.textContent = "Could not copy the ops report JSON.";
  }
}

async function refreshAskingFeedNow() {
  if (refreshFeedBusy) return;
  refreshFeedBusy = true;
  if (opsEl.refreshFeed) opsEl.refreshFeed.disabled = true;
  opsEl.status.textContent = "Refreshing asking feed and logging a sync run...";
  const refreshed = await window.RentIntelAuth.refreshAskingFeed();
  if (!refreshed.ok || !refreshed.data?.feed) {
    opsEl.status.textContent = "Could not refresh the asking feed.";
    refreshFeedBusy = false;
    if (opsEl.refreshFeed) opsEl.refreshFeed.disabled = false;
    return;
  }
  const feed = refreshed.data.feed;
  await window.RentIntelAuth.saveSourceSyncRun({
    sourceName: feed.sourceName || "RentIntel asking-rent feed",
    sourceType: feed.sourceType || "verified-daily-capture",
    sourceKey: "asking-rent",
    status: "admin refresh complete",
    recordsChecked: Array.isArray(feed.records) ? feed.records.length : 0,
    benchmarkLayer: "asking-rent",
    coverageTargets: [],
    varianceFlag: "",
    at: new Date().toISOString(),
    memberEmail: currentAdminSession?.email || ""
  });
  await loadDashboard();
  opsEl.status.textContent = `Asking feed refreshed at ${formatDate(feed.updatedAt || new Date().toISOString())}.`;
  refreshFeedBusy = false;
  if (opsEl.refreshFeed) opsEl.refreshFeed.disabled = false;
}

async function requeueProblemDeliveries() {
  opsEl.status.textContent = "Loading failed and dead-letter deliveries...";
  const result = await window.RentIntelAuth.fetchAlertDeliveries();
  const deliveries = Array.isArray(result.data?.alertDeliveries) ? result.data.alertDeliveries : [];
  const problemRows = deliveries.filter((row) => {
    const status = String(row.deliveryStatus || row.status || "").toLowerCase();
    return status === "failed" || status === "dead-letter";
  });
  if (!problemRows.length) {
    opsEl.status.textContent = "No failed or dead-letter alerts are waiting to be requeued.";
    return;
  }
  let changed = 0;
  for (const row of problemRows) {
    const retryCount = Math.max(0, Number(row.retryCount || 0));
    const maxRetries = Math.max(1, Number(row.maxRetries || row.deliveryPayload?.maxRetries || 2));
    const payload = {
      actionType: "requeue",
      recordId: row.recordId,
      area: row.area || "",
      title: row.title || "",
      fromStatus: row.deliveryStatus || row.status || "failed",
      toStatus: "queued",
      retryCount,
      maxRetries,
      reason: "Requeued from admin ops dashboard for another delivery worker pass."
    };
    const saved = await window.RentIntelAuth.saveAlertAdminAction(payload);
    if (saved.ok && saved.data?.adminAction) changed += 1;
  }
  await loadDashboard();
  opsEl.status.textContent = changed
    ? `${changed} problem alert${changed === 1 ? "" : "s"} requeued from the ops dashboard.`
    : "Could not requeue the problem alerts.";
}

async function markEvidenceReadyNow() {
  if (releaseActionBusy) return;
  releaseActionBusy = true;
  opsEl.status.textContent = "Marking production evidence ready...";
  const currentEvidence = latestReport?.sourceOps?.latestProductionEvidence || {};
  const now = new Date().toISOString();
  const payload = {
    ...currentEvidence,
    sourceName: currentEvidence.sourceName || "asking-rent",
    sourceType: currentEvidence.sourceType || "verified-daily-capture",
    evidenceReady: true,
    ownerReviewedAt: now,
    controlledReleaseNextStep: "Ready for controlled release approval.",
    submittedBy: currentAdminSession?.email || currentEvidence.submittedBy || "",
    releaseLog: {
      ...(currentEvidence.releaseLog || {}),
      status: currentEvidence.releaseLog?.status || "Evidence ready",
      updatedAt: now
    }
  };
  const saved = await window.RentIntelAuth.saveProductionEvidence(payload);
  if (!saved.ok || !saved.data?.productionEvidence) {
    opsEl.status.textContent = "Could not mark production evidence ready.";
    releaseActionBusy = false;
    return;
  }
  await loadDashboard();
  opsEl.status.textContent = "Production evidence marked ready from the ops dashboard.";
  releaseActionBusy = false;
}

async function queueReleaseNow() {
  if (releaseActionBusy) return;
  releaseActionBusy = true;
  opsEl.status.textContent = "Queueing controlled release...";
  const currentEvidence = latestReport?.sourceOps?.latestProductionEvidence || {};
  const now = new Date().toISOString();
  const payload = {
    ...currentEvidence,
    sourceName: currentEvidence.sourceName || "asking-rent",
    sourceType: currentEvidence.sourceType || "verified-daily-capture",
    evidenceReady: true,
    controlledReleaseNextStep: "Monitor first release window and confirm freshness after publish.",
    submittedBy: currentAdminSession?.email || currentEvidence.submittedBy || "",
    releaseLog: {
      ...(currentEvidence.releaseLog || {}),
      status: "Release queued",
      queuedAt: now,
      releasedBy: currentAdminSession?.email || currentEvidence.releaseLog?.releasedBy || "",
      releaseNote: "Queued from admin ops dashboard.",
      updatedAt: now
    }
  };
  const saved = await window.RentIntelAuth.saveProductionEvidence(payload);
  if (!saved.ok || !saved.data?.productionEvidence) {
    opsEl.status.textContent = "Could not queue the controlled release.";
    releaseActionBusy = false;
    return;
  }
  await loadDashboard();
  opsEl.status.textContent = "Controlled release queued from the ops dashboard.";
  releaseActionBusy = false;
}

async function approveHandoffNow() {
  if (releaseActionBusy) return;
  const latestAudit = latestReport?.handoff?.latestAudit;
  if (!latestAudit) {
    opsEl.status.textContent = "No handoff audit is available to approve.";
    return;
  }
  releaseActionBusy = true;
  opsEl.status.textContent = "Approving backend handoff...";
  const payload = {
    ...latestAudit,
    id: latestAudit.id,
    reviewedAt: new Date().toISOString(),
    reviewerNote: "Approved from admin ops dashboard for release-readiness handoff.",
    memberEmail: latestAudit.memberEmail || currentAdminSession?.email || ""
  };
  const saved = await window.RentIntelAuth.saveBackendHandoffAudit(payload);
  if (!saved.ok || !saved.data?.handoffAudit) {
    opsEl.status.textContent = "Could not approve the backend handoff.";
    releaseActionBusy = false;
    return;
  }
  await loadDashboard();
  opsEl.status.textContent = "Backend handoff approved from the ops dashboard.";
  releaseActionBusy = false;
}

function coverageClassificationForCandidate(candidate = {}) {
  const type = String(candidate.requestedPropertyType || candidate.propertyType || "").toLowerCase();
  if (type.includes("hdb")) return "retail-hdb";
  if (type.includes("mall")) return "retail-mall";
  return "retail-shophouse";
}

async function runCoverageAction(action, candidateId) {
  if (coverageActionBusy) return;
  coverageActionBusy = true;
  opsEl.status.textContent = "Loading coverage request details...";
  const result = await window.RentIntelAuth.fetchCoverageRequests();
  const requests = Array.isArray(result.data?.coverageRequests) ? result.data.coverageRequests : [];
  const candidate = requests.find((entry) => String(entry.id || "") === String(candidateId || ""));
  if (!candidate) {
    opsEl.status.textContent = "Could not find that coverage request.";
    coverageActionBusy = false;
    return;
  }

  let saved = null;
  if (action === "classify") {
    const sourceClassification = coverageClassificationForCandidate(candidate);
    saved = await window.RentIntelAuth.classifyCoverageRequest(candidateId, {
      sourceClassification,
      coverageEligibilityStatus: "eligible",
      reviewerNote: `${sourceClassification} classification recorded from admin ops dashboard.`
    });
  }

  if (action === "qa-pass") {
    saved = await window.RentIntelAuth.saveCoverageQaDecision(candidateId, {
      coverageQaDecision: "pass",
      qaChecks: ["ops-dashboard", "source-fit", "sample-ready"],
      reviewerNote: "QA pass recorded from admin ops dashboard."
    });
  }

  if (action === "create-sample") {
    const recordId = `coverage-${slugify(candidate.name || candidate.requestedQuery || candidate.id || "sample")}`;
    saved = await window.RentIntelAuth.saveCoverageSampleRecord(candidateId, {
      sampleRecord: {
        recordId,
        title: candidate.name || candidate.requestedQuery || "Coverage Sample",
        area: candidate.requestedArea || candidate.area || "",
        propertyType: candidate.requestedPropertyType || candidate.propertyType || "Retail"
      },
      sourceSummary: "Sample record created from admin ops dashboard."
    });
  }

  if (!saved?.ok) {
    opsEl.status.textContent = "Could not save that coverage action.";
    coverageActionBusy = false;
    return;
  }

  await loadDashboard();
  const actionLabel = action === "classify"
    ? "classified"
    : action === "qa-pass"
      ? "marked QA pass"
      : "converted into a sample";
  opsEl.status.textContent = `${candidate.name || "Coverage request"} ${actionLabel} from the ops dashboard.`;
  coverageActionBusy = false;
}

async function initAdminOps() {
  const access = await window.RentIntelAuth.requireAccess({
    requireLogin: true,
    requireAdmin: true,
    accountUrl: "/members/account/#accountManualReview",
    reason: "admin-only"
  });
  if (!access.allowed) return;
  currentAdminSession = access.session || null;

  opsEl.refresh?.addEventListener("click", () => {
    loadDashboard();
  });
  opsEl.reloadReport?.addEventListener("click", () => {
    loadDashboard();
  });
  opsEl.refreshFeed?.addEventListener("click", () => {
    refreshAskingFeedNow();
  });
  opsEl.evidenceReady?.addEventListener("click", () => {
    markEvidenceReadyNow();
  });
  opsEl.queueRelease?.addEventListener("click", () => {
    queueReleaseNow();
  });
  opsEl.approveHandoff?.addEventListener("click", () => {
    approveHandoffNow();
  });
  opsEl.copy?.addEventListener("click", () => {
    copyPayload();
  });
  opsEl.focusFilter?.addEventListener("change", () => {
    if (latestReport) renderDashboard(latestReport);
  });
  opsEl.search?.addEventListener("input", () => {
    if (latestReport) renderDashboard(latestReport);
  });
  opsEl.attentionList?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "refresh-feed") {
      refreshAskingFeedNow();
    }
    if (action === "reload-report") {
      loadDashboard();
    }
    if (action === "requeue-deliveries") {
      requeueProblemDeliveries();
    }
  });
  opsEl.coverageFeed?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-coverage-action]");
    if (!button) return;
    runCoverageAction(button.dataset.coverageAction, button.dataset.candidateId);
  });

  await loadDashboard();
}

initAdminOps();
