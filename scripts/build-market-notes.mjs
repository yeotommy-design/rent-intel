import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");
const archivePath = path.join(projectRoot, "market-notes.html");
const articleRoot = path.join(projectRoot, "market-notes");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
const robotsPath = path.join(projectRoot, "robots.txt");
const homepagePath = path.join(projectRoot, "index.html");

const footerMarkup = `
<footer class="site-footer compact-footer">
  <div class="footer-main">
    <div class="footer-brand">
      <strong><span>Verse</span><span>Intel</span></strong>
      <small>Signals Across Every Verse</small>
      <p>RentIntel is a VerseIntel product.</p>
    </div>
    <nav aria-label="Footer links">
      <a href="/about.html">About</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/contact.html">Contact</a>
      <a href="/disclaimer.html">Disclaimer</a>
      <a href="/user-manual.html">User Manual</a>
    </nav>
    <b>PULSE V26</b>
    <p class="footer-contact">
      Feedback &amp; contact: <a href="mailto:contact@rent-intel.com">contact@rent-intel.com</a>
    </p>
  </div>
</footer>`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDisplayDate(value) {
  return new Date(`${value}T00:00:00+08:00`).toLocaleDateString("en-SG", {
    timeZone: "Asia/Singapore",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function toArticleUrl(baseUrl, slug) {
  return `${baseUrl}/market-notes/${slug}/`;
}

function articleFilePath(slug) {
  return path.join(articleRoot, slug, "index.html");
}

function renderHeader() {
  return `<header class="site-header" aria-label="RentIntel navigation">
  <div class="product-header-card">
    <a class="brand" href="/index.html" aria-label="RentIntel home">
      <img src="/pulse-shared-transparent.png" alt="" aria-hidden="true">
      <span class="brand-product">
        <strong>RentIntel</strong>
        <em>Singapore Rent Intelligence</em>
      </span>
    </a>
  </div>
</header>`;
}

function renderArticleJsonLd(note, site) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.description,
    datePublished: note.publishedAt,
    dateModified: note.publishedAt,
    author: {
      "@type": "Organization",
      name: "RentIntel"
    },
    publisher: {
      "@type": "Organization",
      name: "RentIntel",
      logo: {
        "@type": "ImageObject",
        url: `${site.baseUrl}/pulse-shared-transparent.png`
      }
    },
    mainEntityOfPage: toArticleUrl(site.baseUrl, note.slug),
    url: toArticleUrl(site.baseUrl, note.slug)
  };
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

function renderArchiveHtml(site, notes) {
  const latest = notes[0];
  const pastNotes = notes.slice(1);
  const archiveCards = pastNotes
    .map(
      (note) => `<article class="market-note-entry">
        <span>${escapeHtml(formatDisplayDate(note.publishedAt))}</span>
        <h2><a href="/market-notes/${escapeHtml(note.slug)}/">${escapeHtml(note.title)}</a></h2>
        <p>${escapeHtml(note.summary)}</p>
      </article>`
    )
    .join("\n");

  const latestUseIt = latest.useIt
    .map((item) => `<p><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.text)}</p>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(site.archiveTitle)} | Singapore Retail Rent Updates</title>
    <meta name="description" content="${escapeHtml(site.archiveDescription)}">
    <link rel="icon" href="/pulse-shared-transparent.png">
    <link rel="canonical" href="${escapeHtml(site.baseUrl + site.archivePath)}">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="info-page market-notes-archive-page">
    ${renderHeader()}
    <main class="info-shell market-notes-main">
      <a class="back-link" href="/index.html">Back to RentIntel</a>

      <section class="info-panel">
        <p class="eyebrow">Market Notes</p>
        <h1>Short weekly notes on what changed in Singapore retail rent.</h1>
        <p class="lede">${escapeHtml(latest.lede)}</p>
      </section>

      <section class="info-panel market-notes-latest-panel">
        <p class="eyebrow">Latest Note</p>
        <h2><a href="/market-notes/${escapeHtml(latest.slug)}/">${escapeHtml(latest.title)}</a></h2>
        <p class="market-note-meta">${escapeHtml(formatDisplayDate(latest.publishedAt))}</p>
        ${latest.storyParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
      </section>

      <section class="info-panel">
        <p class="eyebrow">Use It</p>
        <h2>How to use this week’s note</h2>
        ${latestUseIt}
      </section>

      <section class="info-panel market-notes-archive-list">
        <p class="eyebrow">Past Notes</p>
        <h2>Archive</h2>
        <div class="market-notes-list">
          ${archiveCards}
        </div>
      </section>

      <section class="info-panel">
        <p class="eyebrow">Weekly Email</p>
        <h2>Get Market Notes by email</h2>
        <p>
          If you want the Monday note delivered instead of having to remember to check the site, use Saved Tools and opt into weekly Market Notes. That gives you a short weekly read on rent pressure, new coverage, and one practical decision cue without adding a long inbox digest.
        </p>
      </section>

      <section class="info-cta-panel">
        <p class="eyebrow">Explore RentIntel</p>
        <h2>Read the weekly note, then go back into search, Workspace, or Saved Tools.</h2>
        <div class="cta-actions">
          <a class="cta-button cta-button-primary" href="/index.html#search">Search RentIntel</a>
          <a class="cta-button cta-button-secondary" href="/members/toolbench/index.html">Open Workspace</a>
          <a class="cta-button cta-button-secondary" href="/members/account/index.html#marketNotesSignup">Get weekly notes by email</a>
        </div>
      </section>
    </main>
    ${footerMarkup}
  </body>
</html>
`;
}

function renderArticleHtml(site, note, notes) {
  const currentIndex = notes.findIndex((entry) => entry.slug === note.slug);
  const newer = currentIndex > 0 ? notes[currentIndex - 1] : null;
  const older = currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null;
  const useItMarkup = note.useIt
    .map((item) => `<p><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.text)}</p>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(note.title)} | Market Notes</title>
    <meta name="description" content="${escapeHtml(note.description)}">
    <link rel="icon" href="/pulse-shared-transparent.png">
    <link rel="canonical" href="${escapeHtml(toArticleUrl(site.baseUrl, note.slug))}">
    <link rel="stylesheet" href="/styles.css">
    ${renderArticleJsonLd(note, site)}
  </head>
  <body class="info-page market-note-article-page">
    ${renderHeader()}
    <main class="info-shell market-notes-main">
      <a class="back-link" href="/market-notes.html">Back to Market Notes</a>

      <article class="info-panel market-note-article">
        <p class="eyebrow">Market Notes</p>
        <h1>${escapeHtml(note.title)}</h1>
        <p class="market-note-meta">${escapeHtml(formatDisplayDate(note.publishedAt))}</p>
        <p class="lede">${escapeHtml(note.lede)}</p>
        ${note.storyParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
      </article>

      <section class="info-panel">
        <p class="eyebrow">Use It</p>
        <h2>How to use this note</h2>
        ${useItMarkup}
      </section>

      <section class="info-panel market-note-nav">
        <p class="eyebrow">More Notes</p>
        <div class="market-note-nav-grid">
          <article>
            <strong>${newer ? "Newer note" : "Latest note"}</strong>
            <p>${newer ? `<a href="/market-notes/${escapeHtml(newer.slug)}/">${escapeHtml(newer.title)}</a>` : "You are reading the latest note."}</p>
          </article>
          <article>
            <strong>${older ? "Older note" : "Archive"}</strong>
            <p>${older ? `<a href="/market-notes/${escapeHtml(older.slug)}/">${escapeHtml(older.title)}</a>` : `<a href="/market-notes.html">Read the archive</a>`}</p>
          </article>
        </div>
      </section>

      <section class="info-cta-panel">
        <p class="eyebrow">Explore RentIntel</p>
        <h2>Read the weekly note, then go back into search, Workspace, or Saved Tools.</h2>
        <div class="cta-actions">
          <a class="cta-button cta-button-primary" href="/index.html#search">Search RentIntel</a>
          <a class="cta-button cta-button-secondary" href="/members/toolbench/index.html">Open Workspace</a>
          <a class="cta-button cta-button-secondary" href="/members/account/index.html#marketNotesSignup">Get weekly notes by email</a>
        </div>
      </section>
    </main>
    ${footerMarkup}
  </body>
</html>
`;
}

function renderSitemap(site, notes) {
  const staticUrls = [
    { loc: `${site.baseUrl}/`, lastmod: notes[0]?.publishedAt || "2026-05-17" },
    { loc: `${site.baseUrl}/about.html`, lastmod: "2026-05-17" },
    { loc: `${site.baseUrl}/contact.html`, lastmod: "2026-05-17" },
    { loc: `${site.baseUrl}/privacy.html`, lastmod: "2026-05-17" },
    { loc: `${site.baseUrl}/disclaimer.html`, lastmod: "2026-05-17" },
    { loc: `${site.baseUrl}/user-manual.html`, lastmod: "2026-05-17" },
    { loc: `${site.baseUrl}${site.archivePath}`, lastmod: notes[0]?.publishedAt || "2026-05-17" }
  ];

  const noteUrls = notes.map((note) => ({
    loc: toArticleUrl(site.baseUrl, note.slug),
    lastmod: note.publishedAt
  }));

  const rows = [...staticUrls, ...noteUrls]
    .map(
      (item) => `  <url>\n    <loc>${escapeHtml(item.loc)}</loc>\n    <lastmod>${escapeHtml(item.lastmod)}</lastmod>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

function renderRobots(site) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`;
}

function renderHomepageMarketNotesSection(latest) {
  const useIt = Array.isArray(latest?.useIt) ? latest.useIt : [];
  const areaWatch = useIt[0] || { label: "Area Watch", text: latest?.summary || "" };
  const coverageUpdate = useIt[1] || { label: "Coverage Update", text: latest?.summary || "" };
  const decisionCue = useIt[2] || { label: "Decision Cue", text: latest?.summary || "" };

  const areaWatchHeading = latest?.title ? `${latest.title}.` : "Latest weekly rent watch.";
  const coverageHeading = coverageUpdate.text
    ? coverageUpdate.text
    : "The latest weekly note includes one fresh coverage update.";
  const decisionHeading = decisionCue.text
    ? decisionCue.text
    : "The latest weekly note includes one practical decision cue.";

  return `      <section class="market-notes-section" aria-label="RentIntel market notes" style="width:min(1180px, calc(100% - 40px)); margin:0 auto; padding:8px 0 16px;">
        <div class="market-notes-shell" style="width:100%;">
          <div class="section-heading compact">
            <p>Market Notes</p>
            <h2>Short weekly notes on what changed, where pressure is building, and what RentIntel added.</h2>
          </div>
          <div class="market-notes-grid">
            <article class="market-notes-feature">
              <div class="card-label">
                <span>This Week</span>
                <strong>Weekly release every Monday</strong>
              </div>
              <h3>One live rent pattern, one coverage update, and one decision cue.</h3>
              <p>
                Market Notes is the short weekly RentIntel release for people who want to stay close to what
                actually changed in Singapore retail rent without reading a long article every time.
              </p>
              <div class="market-notes-actions">
                <a href="./market-notes.html">Read Market Notes</a>
                <a href="./members/account/index.html#marketNotesSignup">Get weekly notes by email</a>
              </div>
            </article>
            <article class="market-note-card">
              <span>${escapeHtml(areaWatch.label)}</span>
              <strong>${escapeHtml(areaWatchHeading)}</strong>
              <p>${escapeHtml(areaWatch.text || latest?.summary || "")}</p>
            </article>
            <article class="market-note-card">
              <span>${escapeHtml(coverageUpdate.label)}</span>
              <strong>${escapeHtml(coverageHeading)}</strong>
              <p>${escapeHtml(coverageUpdate.text || latest?.summary || "")}</p>
            </article>
            <article class="market-note-card">
              <span>${escapeHtml(decisionCue.label)}</span>
              <strong>${escapeHtml(decisionHeading)}</strong>
              <p>${escapeHtml(decisionCue.text || latest?.summary || "")}</p>
            </article>
          </div>
        </div>
      </section>`;
}

function updateHomepageCopy(latest) {
  let source = fs.readFileSync(homepagePath, "utf8");
  const marketNotesStart = source.indexOf('      <section class="market-notes-section"');
  const coverageStart = source.indexOf('      <section class="coverage-highlights-section"');
  if (marketNotesStart === -1 || coverageStart === -1 || coverageStart <= marketNotesStart) {
    throw new Error("Could not locate homepage Market Notes section for update.");
  }
  source = `${source.slice(0, marketNotesStart)}${renderHomepageMarketNotesSection(latest)}\n\n${source.slice(coverageStart)}`;
  fs.writeFileSync(homepagePath, source);
}

function main() {
  const payload = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  const notes = [...payload.notes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const slugSet = new Set();
  for (const note of notes) {
    if (slugSet.has(note.slug)) throw new Error(`Duplicate market note slug: ${note.slug}`);
    slugSet.add(note.slug);
  }

  fs.mkdirSync(articleRoot, { recursive: true });
  fs.writeFileSync(archivePath, renderArchiveHtml(payload.site, notes));
  for (const note of notes) {
    const filePath = articleFilePath(note.slug);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, renderArticleHtml(payload.site, note, notes));
  }
  fs.writeFileSync(sitemapPath, renderSitemap(payload.site, notes));
  fs.writeFileSync(robotsPath, renderRobots(payload.site));
  updateHomepageCopy(notes[0]);

  console.log(JSON.stringify({
    archivePath,
    notesGenerated: notes.length,
    latestNote: notes[0]?.slug || null,
    sitemapPath,
    robotsPath
  }, null, 2));
}

main();
