import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const appPath = path.join(projectRoot, "app.js");
const publicIndexPath = path.join(projectRoot, "index.html");
const memberAccountPath = path.join(projectRoot, "members", "account", "index.html");
const memberToolbenchPath = path.join(projectRoot, "members", "toolbench", "index.html");
const baseJsonPath = path.join(projectRoot, "data", "rentintel-sample-data.json");
const baseJsPath = path.join(projectRoot, "data", "rentintel-sample-data.js");

function mergeSamplePayloads(basePayload, batchPayloads = []) {
  const payloads = [basePayload, ...batchPayloads].filter((payload) => Array.isArray(payload?.records));
  const recordsById = new Map();
  payloads.forEach((payload) => {
    payload.records.forEach((record) => {
      if (record?.id) recordsById.set(record.id, record);
    });
  });
  return {
    version: "prototype-2026-05-17-consolidated",
    updatedAt: payloads
      .map((payload) => String(payload?.updatedAt || ""))
      .filter(Boolean)
      .sort()
      .at(-1) || "2026-05-17",
    sourceNote: "Consolidated RentIntel sample dataset merged from the base payload and historical coverage batches.",
    records: Array.from(recordsById.values())
  };
}

function loadBatchJsonFiles() {
  const appSource = fs.readFileSync(appPath, "utf8");
  return appSource.match(/\.\/data\/rentintel-sample-data-batch-[^"']+\.json/g) || [];
}

function replaceBatchScriptLines(filePath, baseLinePattern) {
  const source = fs.readFileSync(filePath, "utf8");
  const withoutBatchScripts = source.replace(
    /^[ \t]*<script src="(?:\.\.\/\.\.\/|\.\/)data\/rentintel-sample-data-batch-[^"?]+(?:\?[^"]*)?"><\/script>\n/gm,
    ""
  );
  fs.writeFileSync(filePath, withoutBatchScripts);
}

const basePayload = JSON.parse(fs.readFileSync(baseJsonPath, "utf8"));
const batchPayloads = loadBatchJsonFiles().map((relativePath) =>
  JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath.slice(2)), "utf8"))
);
const mergedPayload = mergeSamplePayloads(basePayload, batchPayloads);

fs.writeFileSync(baseJsonPath, JSON.stringify(mergedPayload, null, 2) + "\n");
fs.writeFileSync(baseJsPath, `window.RENTINTEL_SAMPLE_DATA = ${JSON.stringify(mergedPayload, null, 2)};\n`);

const appSource = fs.readFileSync(appPath, "utf8").replace(
  /const rentIntelSampleBatchJsonFiles = \[[\s\S]*?\];/,
  "const rentIntelSampleBatchJsonFiles = [];"
);
fs.writeFileSync(appPath, appSource);

replaceBatchScriptLines(publicIndexPath);
replaceBatchScriptLines(memberAccountPath);
replaceBatchScriptLines(memberToolbenchPath);

console.log(JSON.stringify({
  consolidatedRecords: mergedPayload.records.length,
  updatedAt: mergedPayload.updatedAt,
  sourceNote: mergedPayload.sourceNote
}, null, 2));
