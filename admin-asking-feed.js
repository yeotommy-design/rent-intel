const captureEl = {
  form: document.getElementById("askingCaptureForm"),
  batchId: document.getElementById("askingCaptureBatchId"),
  date: document.getElementById("askingCaptureDate"),
  source: document.getElementById("askingCaptureSource"),
  licence: document.getElementById("askingCaptureLicence"),
  terms: document.getElementById("askingCaptureTerms"),
  records: document.getElementById("askingCaptureRecords"),
  recordTemplate: document.getElementById("askingCaptureRecordTemplate"),
  addRecord: document.getElementById("askingCaptureAddRecord"),
  validate: document.getElementById("askingCaptureValidate"),
  mode: document.getElementById("askingCaptureMode"),
  modeCopy: document.getElementById("askingCaptureModeCopy"),
  result: document.getElementById("askingCaptureResult"),
  resultTitle: document.getElementById("askingCaptureResultTitle"),
  resultCopy: document.getElementById("askingCaptureResultCopy"),
  issues: document.getElementById("askingCaptureIssues"),
  downloadBatch: document.getElementById("askingCaptureDownloadBatch"),
  downloadFeed: document.getElementById("askingCaptureDownloadFeed")
};

let validatedCapture = null;

function singaporeDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function batchIdForDate(date) {
  return `manual-asking-${date}-${Date.now().toString(36)}`;
}

function recordCards() {
  return Array.from(captureEl.records.querySelectorAll(".asking-capture-record"));
}

function setRecordTitle(card) {
  const recordId = card.querySelector('[data-field="recordId"]')?.value.trim();
  card.querySelector("[data-record-title]").textContent = recordId || "New area";
}

function addRecord(values = {}) {
  const fragment = captureEl.recordTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".asking-capture-record");
  Object.entries(values).forEach(([field, value]) => {
    const input = card.querySelector(`[data-field="${field}"]`);
    if (input) input.value = value;
  });
  card.querySelector('[data-field="recordId"]').addEventListener("input", () => setRecordTitle(card));
  card.querySelector("[data-remove-record]").addEventListener("click", () => {
    if (recordCards().length <= 1) {
      renderResult("warning", "Keep one area record", "Every batch needs at least one reviewed area.");
      return;
    }
    card.remove();
  });
  captureEl.records.append(fragment);
  setRecordTitle(card);
}

function evidenceLines(card) {
  return card
    .querySelector('[data-field="evidence"]')
    .value.split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberValue(card, field) {
  return Number(card.querySelector(`[data-field="${field}"]`).value);
}

function capturePayload() {
  const capturedAt = captureEl.date.value;
  return {
    batchId: captureEl.batchId.value.trim(),
    capturedAt,
    source: {
      name: captureEl.source.value.trim(),
      type: "verified-manual-capture",
      licenseReference: captureEl.licence.value.trim(),
      termsConfirmed: captureEl.terms.checked
    },
    validateOnly: true,
    records: recordCards().map((card) => ({
      recordId: card.querySelector('[data-field="recordId"]').value.trim(),
      asking: numberValue(card, "asking"),
      latestAskingMedian: numberValue(card, "latestAskingMedian"),
      fairRange: {
        low: numberValue(card, "fairRangeLow"),
        high: numberValue(card, "fairRangeHigh")
      },
      listingCount: numberValue(card, "listingCount"),
      capturedAt,
      evidence: evidenceLines(card).map((reference) => ({
        reference,
        observedAt: capturedAt
      })),
      note: card.querySelector('[data-field="note"]').value.trim()
    }))
  };
}

function localEvidenceIssues(payload) {
  const issues = [];
  payload.records.forEach((record, index) => {
    if (record.evidence.length < 3) {
      issues.push(`Area ${index + 1}: add at least three evidence references for a useful area-level check.`);
    }
    if (record.listingCount < record.evidence.length) {
      issues.push(`Area ${index + 1}: checked-listing count cannot be lower than the evidence-reference count.`);
    }
  });
  return issues;
}

function renderIssues(items = []) {
  captureEl.issues.replaceChildren();
  items.forEach((item) => {
    const row = document.createElement("li");
    row.textContent = item;
    captureEl.issues.append(row);
  });
}

function renderResult(state, title, copy, issues = []) {
  captureEl.result.dataset.state = state;
  captureEl.resultTitle.textContent = title;
  captureEl.resultCopy.textContent = copy;
  renderIssues(issues);
}

function downloadJson(filename, value) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function loadReadiness() {
  const result = await window.RentIntelAuth.fetchAskingFeedCaptureReadiness();
  if (!result.ok || !result.data?.capture) {
    captureEl.mode.textContent = "Validation unavailable";
    captureEl.modeCopy.textContent = "The protected capture service could not be reached.";
    return;
  }
  const capture = result.data.capture;
  captureEl.mode.textContent = capture.promotionAvailable
    ? "Validated release available"
    : "Controlled file release";
  captureEl.modeCopy.textContent = capture.promotionAvailable
    ? "Approved evidence can move into the controlled release flow."
    : "Validated files remain offline until they are reviewed and published through the repository.";
}

async function validateCapture(event) {
  event.preventDefault();
  validatedCapture = null;
  captureEl.downloadBatch.disabled = true;
  captureEl.downloadFeed.disabled = true;
  if (!captureEl.form.reportValidity()) return;

  const payload = capturePayload();
  const localIssues = localEvidenceIssues(payload);
  if (localIssues.length) {
    renderResult(
      "warning",
      "More evidence is needed",
      "The batch has not been sent for validation.",
      localIssues
    );
    return;
  }

  captureEl.validate.disabled = true;
  captureEl.validate.textContent = "Checking evidence...";
  renderResult("working", "Running quality checks", "RentIntel is checking dates, figures, rights, and evidence references.");
  const result = await window.RentIntelAuth.validateAskingFeedCapture(payload);
  captureEl.validate.disabled = false;
  captureEl.validate.textContent = "Validate Evidence";

  if (!result.ok) {
    const errors = Array.isArray(result.data?.qa?.errors)
      ? result.data.qa.errors.map((item) => item.message)
      : [result.data?.error || "The evidence batch could not be validated."];
    renderResult("error", "Evidence did not pass", "Fix the items below and run the checks again.", errors);
    return;
  }

  validatedCapture = result.data;
  const warnings = Array.isArray(result.data?.qa?.warnings)
    ? result.data.qa.warnings.map((item) => item.message)
    : [];
  renderResult(
    "success",
    "Evidence passed validation",
    `${result.data.qa.recordCount} area record${result.data.qa.recordCount === 1 ? "" : "s"} prepared for controlled review. Nothing has been published yet.`,
    warnings
  );
  captureEl.downloadBatch.disabled = false;
  captureEl.downloadFeed.disabled = false;
}

async function initAskingCapture() {
  const access = await window.RentIntelAuth.requireAccess({
    requireLogin: true,
    requireAdmin: true,
    accountUrl: "/members/account/#accountManualReview",
    reason: "admin-only"
  });
  if (!access.allowed) return;

  const today = singaporeDate();
  captureEl.date.value = today;
  captureEl.batchId.value = batchIdForDate(today);
  addRecord({
    recordId: "macpherson-retail",
    note: "MacPherson retail asking-rent evidence review."
  });
  captureEl.addRecord.addEventListener("click", () => addRecord());
  captureEl.form.addEventListener("submit", validateCapture);
  captureEl.downloadBatch.addEventListener("click", () => {
    if (!validatedCapture?.batch) return;
    downloadJson(`${validatedCapture.batch.batchId}.json`, validatedCapture.batch);
  });
  captureEl.downloadFeed.addEventListener("click", () => {
    if (!validatedCapture?.feed) return;
    downloadJson(`${validatedCapture.batch.batchId}-feed.json`, validatedCapture.feed);
  });
  await loadReadiness();
}

initAskingCapture();
