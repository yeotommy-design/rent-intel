import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    ...options
  }).trim();
}

function runStreaming(command, args) {
  execFileSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    encoding: "utf8"
  });
}

function readLatestNote() {
  const payload = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  const notes = Array.isArray(payload.notes) ? payload.notes : [];
  const latest = [...notes].sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")))[0];
  if (!latest?.slug || !latest?.title || !latest?.publishedAt) {
    throw new Error("Latest Market Note is missing slug, title, or publishedAt.");
  }
  return { latest, notes };
}

function releaseFileList(notes) {
  const notePages = notes
    .map((note) => String(note?.slug || "").trim())
    .filter(Boolean)
    .map((slug) => `market-notes/${slug}/index.html`);

  return [
    "data/market-notes.json",
    "index.html",
    "market-notes.html",
    "robots.txt",
    "sitemap.xml",
    ...notePages
  ];
}

function ensureMainBranch() {
  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch !== "main") {
    throw new Error(`Market Notes release must run from main. Current branch: ${branch}`);
  }
  return branch;
}

function collectChangedFiles(files) {
  const changed = run("git", ["status", "--short", "--", ...files]);
  return changed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.slice(3).trim());
}

function main() {
  const branch = ensureMainBranch();
  const { latest, notes } = readLatestNote();

  runStreaming("npm", ["run", "build:market-notes"]);
  runStreaming("npm", ["run", "check:market-notes"]);

  const files = releaseFileList(notes);
  const changedFiles = collectChangedFiles(files);

  if (!changedFiles.length) {
    console.log(JSON.stringify({
      status: "no-op",
      branch,
      latestSlug: latest.slug,
      latestTitle: latest.title,
      latestPublishedAt: latest.publishedAt,
      changedFiles: []
    }, null, 2));
    return;
  }

  runStreaming("git", ["add", "--", ...files]);

  const commitMessage = `Publish ${latest.publishedAt} Market Note`;
  runStreaming("git", ["commit", "-m", commitMessage]);
  runStreaming("git", ["push", "origin", branch]);

  console.log(JSON.stringify({
    status: "published",
    branch,
    latestSlug: latest.slug,
    latestTitle: latest.title,
    latestPublishedAt: latest.publishedAt,
    changedFiles,
    commitMessage
  }, null, 2));
}

main();
