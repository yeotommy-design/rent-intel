import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATASET_ID = "d_862c74b13138382b9f0c50c68d436b95";
const DATA_ENDPOINT = `https://data.gov.sg/api/action/datastore_search?resource_id=${DATASET_ID}&limit=1000`;
const METADATA_ENDPOINT = `https://api-production.data.gov.sg/v2/public/api/datasets/${DATASET_ID}/metadata`;
const BENCHMARK_JSON_FILE = path.join(ROOT_DIR, "data", "sources", "ura-commercial-rental-index.json");
const BENCHMARK_JS_FILE = path.join(ROOT_DIR, "data", "sources", "ura-commercial-rental-index.js");
const STATUS_JSON_FILE = path.join(ROOT_DIR, "data", "sources", "source-status.json");
const STATUS_JS_FILE = path.join(ROOT_DIR, "data", "sources", "source-status.js");

function numericIndex(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function quarterRank(value = "") {
  const match = String(value).match(/^(\d{4})-Q([1-4])$/);
  return match ? Number(match[1]) * 4 + Number(match[2]) : -1;
}

function percentChange(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function normalizeRetailRows(records = []) {
  return records
    .filter((record) => String(record?.property_type || "").trim().toLowerCase() === "retail")
    .map((record) => ({
      quarter: String(record.quarter || "").trim(),
      index: numericIndex(record.index)
    }))
    .filter((record) => quarterRank(record.quarter) > 0 && Number.isFinite(record.index))
    .sort((a, b) => quarterRank(a.quarter) - quarterRank(b.quarter));
}

export function buildBenchmark({
  records = [],
  metadata = {},
  syncedAt = new Date()
} = {}) {
  const retail = normalizeRetailRows(records);
  if (!retail.length) throw new Error("The URA dataset did not return any valid retail index rows.");
  const latest = retail.at(-1);
  const previous = retail.at(-2) || null;
  const priorYear = retail.find((record) => quarterRank(record.quarter) === quarterRank(latest.quarter) - 4) || null;
  const fingerprint = crypto
    .createHash("sha256")
    .update(JSON.stringify(retail))
    .digest("hex");

  return {
    version: `ura-commercial-rental-index-${latest.quarter.toLowerCase()}`,
    datasetId: DATASET_ID,
    sourceName: metadata.managedBy || "Urban Redevelopment Authority",
    sourceUrl: `https://data.gov.sg/datasets/${DATASET_ID}/view`,
    licence: "Singapore Open Data Licence",
    licenceUrl: "https://data.gov.sg/open-data-licence",
    datasetName: metadata.name || "Commercial Rental Index, Quarterly",
    definition: "Quarterly retail rental index compiled from tenancy agreement data. Base quarter 1998-Q4 = 100.",
    safeUse: "Official national trend context only. This index is not S$/psf and must not be presented as a unit-level asking or transacted rent.",
    latestPeriod: latest.quarter,
    latestRetailIndex: latest.index,
    previousPeriod: previous?.quarter || "",
    previousRetailIndex: previous?.index ?? null,
    quarterChangePercent: previous ? percentChange(latest.index, previous.index) : null,
    priorYearPeriod: priorYear?.quarter || "",
    priorYearRetailIndex: priorYear?.index ?? null,
    yearChangePercent: priorYear ? percentChange(latest.index, priorYear.index) : null,
    sourceLastUpdatedAt: metadata.lastUpdatedAt || "",
    coverageEnd: metadata.coverageEnd || "",
    syncedAt: syncedAt.toISOString(),
    sourceFingerprint: fingerprint,
    records: retail
  };
}

export function updateSourceStatus(sourceStatus = {}, benchmark = {}) {
  const releaseLabel = benchmark.latestPeriod.replace("-", " ");
  const statuses = Array.isArray(sourceStatus.status) ? sourceStatus.status : [];
  const updated = statuses.map((status) => status.sourceId === "ura-commercial-retail-rental-analysis"
    ? {
        ...status,
        currentState: "live-official-index-connected",
        prototypeState: "Official URA quarterly retail rental index connected",
        productionNextStep: "Add authorised granular retail rental-contract analysis when unit or area-level benchmark detail is required.",
        lastCompletedAt: benchmark.sourceLastUpdatedAt || benchmark.syncedAt,
        timestampLabel: null,
        displayTimestamp: `Latest release: ${releaseLabel}`,
        healthState: "fresh",
        latestPeriod: benchmark.latestPeriod,
        latestRetailIndex: benchmark.latestRetailIndex,
        weeklyReviewStep: "Automatic Monday check: import only when data.gov.sg publishes a real new URA retail-index quarter."
      }
    : status);

  const date = benchmark.syncedAt.slice(0, 10);
  return {
    ...sourceStatus,
    version: `source-status-${date}`,
    updatedAt: date,
    lastReviewedAt: date,
    status: updated
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "RentIntel official-source-sync/1.0"
    }
  });
  if (!response.ok) throw new Error(`Official source request failed with HTTP ${response.status}.`);
  return await response.json();
}

async function readJson(file, fallback = {}) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonAndBrowserGlobal(jsonFile, jsFile, globalName, value) {
  await fs.writeFile(jsonFile, `${JSON.stringify(value, null, 2)}\n`);
  await fs.writeFile(jsFile, `window.${globalName} = ${JSON.stringify(value, null, 2)};\n`);
}

async function main() {
  const [dataResponse, metadataResponse, existingBenchmark, sourceStatus] = await Promise.all([
    fetchJson(DATA_ENDPOINT),
    fetchJson(METADATA_ENDPOINT),
    readJson(BENCHMARK_JSON_FILE),
    readJson(STATUS_JSON_FILE)
  ]);
  if (dataResponse.success !== true || !Array.isArray(dataResponse.result?.records)) {
    throw new Error("data.gov.sg returned an unexpected URA dataset response.");
  }
  if (metadataResponse.code !== 0 || !metadataResponse.data) {
    throw new Error("data.gov.sg returned an unexpected URA metadata response.");
  }

  const benchmark = buildBenchmark({
    records: dataResponse.result.records,
    metadata: metadataResponse.data,
    syncedAt: new Date()
  });
  if (existingBenchmark.sourceFingerprint === benchmark.sourceFingerprint) {
    console.log(`URA retail benchmark is unchanged at ${benchmark.latestPeriod} (${benchmark.latestRetailIndex}).`);
    return;
  }

  const updatedStatus = updateSourceStatus(sourceStatus, benchmark);
  await Promise.all([
    writeJsonAndBrowserGlobal(
      BENCHMARK_JSON_FILE,
      BENCHMARK_JS_FILE,
      "RENTINTEL_URA_RETAIL_INDEX",
      benchmark
    ),
    writeJsonAndBrowserGlobal(
      STATUS_JSON_FILE,
      STATUS_JS_FILE,
      "RENTINTEL_SOURCE_STATUS",
      updatedStatus
    )
  ]);
  console.log(
    `Imported URA retail benchmark ${benchmark.latestPeriod}: ${benchmark.latestRetailIndex} ` +
    `(QoQ ${benchmark.quarterChangePercent >= 0 ? "+" : ""}${benchmark.quarterChangePercent}%).`
  );
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
