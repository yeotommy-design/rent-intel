import fs from "node:fs";
import path from "node:path";
import {
  evaluateMarketNoteSource
} from "./market-note-source-evidence.mjs";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");
const archivePath = path.join(projectRoot, "market-notes.html");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
const robotsPath = path.join(projectRoot, "robots.txt");
const askingFeedPath = path.join(projectRoot, "data", "sources", "asking-rent-feed.json");

function toDate(value) {
  const parsed = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid publishedAt date: ${value}`);
  }
  return parsed;
}

function parseNotes(payload) {
  if (!payload?.notes || !Array.isArray(payload.notes) || payload.notes.length === 0) {
    throw new Error("data/market-notes.json has no notes.");
  }

  return payload.notes.map((note, index) => {
    if (!note?.slug || !note?.title || !note?.publishedAt) {
      throw new Error(`Missing required fields in note #${index + 1}.`);
    }

    return {
      ...note,
      publishedDate: toDate(note.publishedAt)
    };
  });
}

function articleFilePath(slug) {
  return path.join(projectRoot, "market-notes", String(slug).trim(), "index.html");
}

function statMs(filePath) {
  return fs.statSync(filePath).mtimeMs;
}

function daysBetween(a, b) {
  const start = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const end = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((end - start) / 86400000);
}

function main() {
  const payload = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  const notes = parseNotes(payload);

  const notesSorted = [...notes].sort((left, right) => right.publishedDate - left.publishedDate);
  if (notesSorted.length > 1 && notesSorted[0].publishedDate < notesSorted[1].publishedDate) {
    throw new Error("Notes are not sorted by newest first after parsing.");
  }

  const latest = notesSorted[0];
  const sourceTime = statMs(notesPath);
  const requiredFiles = [
    archivePath,
    sitemapPath,
    robotsPath,
    ...notesSorted.map((note) => articleFilePath(note.slug))
  ];

  const staleFiles = requiredFiles
    .filter((filePath) => !fs.existsSync(filePath) || statMs(filePath) < sourceTime)
    .map((filePath) => path.relative(projectRoot, filePath));

  const latestDaysGap = daysBetween(latest.publishedDate, new Date());
  const askingFeed = JSON.parse(fs.readFileSync(askingFeedPath, "utf8"));
  const todayParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const todaySgt = [
    todayParts.find((part) => part.type === "year")?.value,
    todayParts.find((part) => part.type === "month")?.value,
    todayParts.find((part) => part.type === "day")?.value
  ].join("-");
  const sourceEvidence = evaluateMarketNoteSource({
    askingFeed,
    latestNote: latest,
    targetDate: todaySgt
  });
  const waitingForFreshSource = !sourceEvidence.eligible;

  const archiveHtml = fs.readFileSync(archivePath, "utf8");
  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  const archiveHasLatest = archiveHtml.includes(`/market-notes/${latest.slug}/`);
  const sitemapHasLatest = sitemapXml.includes(`/market-notes/${latest.slug}/`);
  const overdue = latestDaysGap > 7 && !waitingForFreshSource;
  const pipelineHealthy = staleFiles.length === 0 && archiveHasLatest && sitemapHasLatest && !overdue;
  const failureReasons = [
    ...(staleFiles.length > 0 ? [`${staleFiles.length} generated file(s) are stale`] : []),
    ...(!archiveHasLatest ? ["market-notes archive is missing the latest article link"] : []),
    ...(!sitemapHasLatest ? ["sitemap is missing the latest article URL"] : []),
    ...(overdue ? [`latest article is ${latestDaysGap} days old and missed the weekly Monday cadence`] : [])
  ];
  const notices = waitingForFreshSource
    ? [
        "market-change publishing is paused until a new approved asking-rent capture arrives",
        ...sourceEvidence.reasons
      ]
    : [];

  const result = {
    latestSlug: latest.slug,
    latestTitle: latest.title,
    publishedAt: latest.publishedAt,
    publishedAtGapDays: latestDaysGap,
    notesTotal: notesSorted.length,
    staleFileCount: staleFiles.length,
    staleFiles,
    archiveHasLatest,
    sitemapHasLatest,
    expectedCadence: "Weekly on Monday (recommended)",
    sourceEvidence,
    waitingForFreshSource,
    isPipelineHealthy: pipelineHealthy,
    needsAction: overdue || waitingForFreshSource,
    overdue,
    failureReasons,
    notices
  };

  console.log(JSON.stringify(result, null, 2));

  if (!pipelineHealthy) {
    process.exitCode = 1;
  }
}

main();
