export const MAX_SOURCE_AGE_DAYS = 14;

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || "").trim());
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function daysBetween(startValue, endValue) {
  const start = parseIsoDate(startValue);
  const end = parseIsoDate(endValue);
  if (!start || !end) return null;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

export function sourceCaptureDate(askingFeed = {}) {
  const recordDates = (askingFeed.records || [])
    .map((record) => String(record?.capturedAt || "").trim())
    .filter(Boolean)
    .sort()
    .reverse();
  return String(askingFeed.updatedAt || recordDates[0] || "").trim();
}

export function sourceCaptureSignature(askingFeed = {}) {
  const recordSignature = (askingFeed.records || [])
    .map((record) => [
      record?.recordId || "",
      record?.capturedAt || "",
      record?.asking ?? "",
      record?.latestAskingMedian ?? "",
      record?.listingCount ?? ""
    ].join(":"))
    .sort()
    .join("|");
  return [
    askingFeed.version || "",
    sourceCaptureDate(askingFeed),
    recordSignature
  ].join("::");
}

export function evaluateMarketNoteSource({
  askingFeed = {},
  latestNote = null,
  targetDate = ""
} = {}) {
  const captureDate = sourceCaptureDate(askingFeed);
  const captureSignature = sourceCaptureSignature(askingFeed);
  const ageDays = daysBetween(captureDate, targetDate);
  const latestEvidence = latestNote?.sourceEvidence || {};
  const legacyNoteUsesCapture = Boolean(
    captureDate &&
    latestNote &&
    JSON.stringify(latestNote).includes(captureDate)
  );
  const reused = Boolean(
    latestNote &&
    (
      latestEvidence.captureSignature === captureSignature ||
      (!latestEvidence.captureSignature && legacyNoteUsesCapture)
    )
  );
  const stale = ageDays === null || ageDays > MAX_SOURCE_AGE_DAYS;
  const reasons = [
    ...(!captureDate ? ["asking-rent feed has no approved capture date"] : []),
    ...(ageDays === null && captureDate ? [`asking-rent capture date is invalid: ${captureDate}`] : []),
    ...(Number.isFinite(ageDays) && ageDays > MAX_SOURCE_AGE_DAYS
      ? [`asking-rent capture is ${ageDays} days old; maximum is ${MAX_SOURCE_AGE_DAYS} days`]
      : []),
    ...(reused ? ["latest Market Note already uses this asking-rent capture"] : [])
  ];

  return {
    eligible: !stale && !reused,
    stale,
    reused,
    captureDate,
    captureSignature,
    feedVersion: String(askingFeed.version || ""),
    ageDays,
    maxAgeDays: MAX_SOURCE_AGE_DAYS,
    reasons
  };
}
