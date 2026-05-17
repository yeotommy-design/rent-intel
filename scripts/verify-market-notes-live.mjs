import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");
const baseUrl = (process.env.RENTINTEL_BASE_URL || "https://rent-intel.com").replace(/\/$/, "");

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

async function fetchStatus(url) {
  const response = await fetch(url, { redirect: "follow" });
  return response.status;
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  const latest = [...payload.notes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  if (!latest) throw new Error("No market notes found in data/market-notes.json");

  const articleUrl = `${baseUrl}/market-notes/${latest.slug}/`;
  const archiveUrl = `${baseUrl}/market-notes.html`;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const [articleStatus, archiveHtml, sitemapXml] = await Promise.all([
    fetchStatus(articleUrl),
    fetchText(archiveUrl),
    fetchText(sitemapUrl)
  ]);

  const archiveHasLatest = archiveHtml.includes(`/market-notes/${latest.slug}/`);
  const sitemapHasLatest = sitemapXml.includes(`/market-notes/${latest.slug}/`);

  console.log(JSON.stringify({
    latestSlug: latest.slug,
    latestTitle: latest.title,
    articleUrl,
    articleStatus,
    archiveUrl,
    archiveHasLatest,
    sitemapUrl,
    sitemapHasLatest
  }, null, 2));

  if (articleStatus !== 200 || !archiveHasLatest || !sitemapHasLatest) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
