import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");
const archivePath = path.join(projectRoot, "market-notes.html");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
const robotsPath = path.join(projectRoot, "robots.txt");
const homepagePath = path.join(projectRoot, "index.html");

function articleFilePath(slug) {
  return path.join(projectRoot, "market-notes", slug, "index.html");
}

function statMs(filePath) {
  return fs.statSync(filePath).mtimeMs;
}

function main() {
  const payload = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  const notes = Array.isArray(payload.notes) ? payload.notes : [];
  const sourceTime = statMs(notesPath);
  const required = [
    archivePath,
    sitemapPath,
    robotsPath,
    homepagePath,
    ...notes
      .map((note) => String(note?.slug || "").trim())
      .filter(Boolean)
      .map(articleFilePath)
  ];

  const stale = required.filter((filePath) => {
    if (!fs.existsSync(filePath)) return true;
    return statMs(filePath) < sourceTime;
  });

  console.log(JSON.stringify({
    source: notesPath,
    sourceUpdatedAt: new Date(sourceTime).toISOString(),
    requiredCount: required.length,
    staleCount: stale.length,
    stale
  }, null, 2));

  if (stale.length) {
    process.exit(1);
  }
}

main();
