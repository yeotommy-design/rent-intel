import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FEED_FILE = path.join(ROOT_DIR, "data", "sources", "asking-rent-feed.json");
const STATUS_FILE = path.join(ROOT_DIR, "data", "sources", "source-status.json");
const HEALTH_JSON_FILE = path.join(ROOT_DIR, "data", "sources", "source-sync-health.json");
const HEALTH_JS_FILE = path.join(ROOT_DIR, "data", "sources", "source-sync-health.js");
const DAY_MS = 24 * 60 * 60 * 1000;

function parseDate(value) {
  if (!value) return null;
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateOnly(value) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function latestCaptureAt(feed = {}, sourceStatus = {}) {
  const askingStatus = (sourceStatus.status || []).find((item) => item.sourceId === "asking-rent-feed") || {};
  const candidates = [
    feed.updatedAt,
    askingStatus.lastCompletedAt,
    ...(Array.isArray(feed.records) ? feed.records.map((record) => record.capturedAt) : [])
  ]
    .map((value) => ({ value, date: parseDate(value) }))
    .filter((entry) => entry.date)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return candidates[0]?.value || "";
}

export function nextDailyCheck(now = new Date()) {
  const singaporeParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const part = (type) => singaporeParts.find((item) => item.type === type)?.value || "";
  const todayAtCheck = new Date(`${part("year")}-${part("month")}-${part("day")}T09:10:00+08:00`);
  if (todayAtCheck.getTime() > now.getTime()) return todayAtCheck.toISOString();
  return new Date(todayAtCheck.getTime() + DAY_MS).toISOString();
}

export function buildSourceHealth({
  feed = {},
  sourceStatus = {},
  previous = {},
  now = new Date()
} = {}) {
  const capturedValue = latestCaptureAt(feed, sourceStatus);
  const capturedDate = parseDate(capturedValue);
  const ageDays = capturedDate
    ? Math.max(0, Math.floor((now.getTime() - capturedDate.getTime()) / DAY_MS))
    : null;
  const state = !capturedDate
    ? "missing"
    : ageDays <= 7
      ? "healthy"
      : ageDays <= 14
        ? "warning"
        : "overdue";
  const consecutiveOverdueChecks = state === "overdue" || state === "missing"
    ? Math.max(0, Number(previous.consecutiveOverdueChecks || 0)) + 1
    : 0;
  const summary = state === "healthy"
    ? `Asking-rent data is current. The latest capture is ${ageDays} day${ageDays === 1 ? "" : "s"} old.`
    : state === "warning"
      ? `Asking-rent data is ${ageDays} days old and should be refreshed soon.`
      : state === "overdue"
        ? `Asking-rent data is overdue. The latest capture is ${ageDays} days old.`
        : "No valid asking-rent capture date is connected.";
  const action = state === "healthy"
    ? "No action needed. The monitor will check again automatically."
    : state === "warning"
      ? "Prepare a verified asking-rent refresh before the data becomes overdue."
      : "Keep current rent verdicts paused until a new verified asking-rent capture passes review.";
  return {
    version: "source-sync-health-v1",
    sourceId: "asking-rent-feed",
    schedule: "Daily 09:10 SGT",
    monitorState: state,
    monitorLabel: state === "healthy"
      ? "Working normally"
      : state === "warning"
        ? "Refresh soon"
        : state === "overdue"
          ? "Update overdue"
          : "Capture missing",
    summary,
    action,
    lastCheckedAt: now.toISOString(),
    nextCheckAt: nextDailyCheck(now),
    latestCaptureAt: dateOnly(capturedValue),
    captureAgeDays: ageDays,
    consecutiveOverdueChecks,
    monitorCompleted: true
  };
}

async function readJson(file, fallback = {}) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const feed = await readJson(FEED_FILE);
  const sourceStatus = await readJson(STATUS_FILE);
  const previous = await readJson(HEALTH_JSON_FILE);
  const now = process.env.RENTINTEL_MONITOR_NOW
    ? new Date(process.env.RENTINTEL_MONITOR_NOW)
    : new Date();
  if (Number.isNaN(now.getTime())) throw new Error("RENTINTEL_MONITOR_NOW is not a valid date.");
  const health = buildSourceHealth({ feed, sourceStatus, previous, now });
  const json = `${JSON.stringify(health, null, 2)}\n`;
  const js = `window.RENTINTEL_SOURCE_SYNC_HEALTH = ${JSON.stringify(health, null, 2)};\n`;
  await fs.writeFile(HEALTH_JSON_FILE, json);
  await fs.writeFile(HEALTH_JS_FILE, js);
  console.log(`${health.monitorLabel}: ${health.summary}`);
  if (health.monitorState !== "healthy") {
    console.log(`::warning title=RentIntel source health::${health.summary} ${health.action}`);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
