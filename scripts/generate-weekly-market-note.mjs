import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const notesPath = path.join(projectRoot, "data", "market-notes.json");
const askingFeedPath = path.join(projectRoot, "data", "sources", "asking-rent-feed.json");
const sourceStatusPath = path.join(projectRoot, "data", "sources", "source-status.json");

function parseArgs(argv) {
  const args = {
    write: false,
    force: false,
    date: ""
  };

  argv.forEach((arg) => {
    if (arg === "--write") args.write = true;
    else if (arg === "--force") args.force = true;
    else if (arg.startsWith("--date=")) args.date = arg.slice("--date=".length).trim();
  });

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toSgtDate(value) {
  const parsed = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return parsed;
}

function parseIsoDateParts(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) {
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };
}

function isoDateSgt(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function nextMondayAfter(value) {
  const { year, month, day } = parseIsoDateParts(value);
  const next = new Date(Date.UTC(year, month - 1, day));
  const weekday = next.getUTCDay();
  const daysUntilNextMonday = ((8 - weekday) % 7) || 7;
  next.setUTCDate(next.getUTCDate() + daysUntilNextMonday);
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCase(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function percentLabel(value) {
  return `${Math.round(value)}%`;
}

function money(value) {
  return `$${Number(value).toFixed(1)}`;
}

function areaProfile(recordId = "") {
  const normalized = String(recordId).trim().toLowerCase();
  const lookup = {
    "chinatown-shophouse": {
      area: "Chinatown shophouse rows",
      shortArea: "Chinatown shophouses",
      type: "shophouse",
      category: "busy-corner narrative"
    },
    "orchard-mall": {
      area: "Orchard prime mall space",
      shortArea: "Orchard mall renewals",
      type: "mall",
      category: "prime mall urgency"
    },
    "serangoon-hdb": {
      area: "Serangoon heartland HDB rows",
      shortArea: "Serangoon HDB rows",
      type: "heartland",
      category: "heartland benchmark gap"
    },
    "tampines-hdb": {
      area: "Tampines heartland HDB rows",
      shortArea: "Tampines HDB rows",
      type: "heartland",
      category: "heartland benchmark gap"
    },
    "jurong-retail": {
      area: "Jurong suburban retail clusters",
      shortArea: "Jurong suburban clusters",
      type: "suburban",
      category: "suburban fallback cluster"
    }
  };
  return lookup[normalized] || {
    area: titleCase(normalized.replace(/-/g, " ")),
    shortArea: titleCase(normalized.replace(/-/g, " ")),
    type: "retail",
    category: "benchmark gap"
  };
}

function rankSignals(records = []) {
  return [...records]
    .map((record) => {
      const fairHigh = Number(record?.fairRange?.high || 0);
      const asking = Number(record?.asking || 0);
      const premium = fairHigh > 0 ? ((asking - fairHigh) / fairHigh) * 100 : 0;
      return {
        ...record,
        premium,
        profile: areaProfile(record.recordId)
      };
    })
    .sort((left, right) => right.premium - left.premium || right.listingCount - left.listingCount);
}

function manualFeedSummary(sourceStatus = {}, askingFeed = {}) {
  const sourceRow = Array.isArray(sourceStatus.status)
    ? sourceStatus.status.find((row) => row.sourceId === "asking-rent-feed")
    : null;
  const capturedAt = askingFeed.updatedAt || sourceRow?.lastCompletedAt || "";
  return {
    capturedAt,
    refreshTarget: sourceRow?.refreshTarget || "Daily",
    weeklyReviewStep: sourceRow?.weeklyReviewStep || "",
    productionStep: sourceRow?.productionNextStep || ""
  };
}

function chooseTheme(primary, secondary) {
  if (primary.profile.type === "heartland") return "heartland";
  if (primary.profile.type === "mall") return "mall";
  if (primary.profile.type === "suburban") return "suburban";
  if (secondary?.profile?.type === "heartland") return "comparison";
  return "shophouse";
}

function buildTitle(theme, primary, secondary) {
  const primaryGap = percentLabel(primary.premium);
  if (theme === "heartland") {
    return `${primary.profile.shortArea} quotes still need proof after a ${primaryGap} gap`;
  }
  if (theme === "mall") {
    return `${primary.profile.shortArea} still need one calmer fallback cluster`;
  }
  if (theme === "suburban") {
    return `${primary.profile.shortArea} still work better with one calmer comparison set`;
  }
  if (theme === "comparison" && secondary) {
    return `${primary.profile.shortArea} still need one calmer fallback before the premium sticks`;
  }
  return `${primary.profile.shortArea} premiums still need proof, not just a stronger story`;
}

function buildSummary(theme, primary, secondary) {
  const primaryGap = percentLabel(primary.premium);
  if (theme === "heartland") {
    return `${primary.profile.shortArea} are still quoting around ${primaryGap} above the fair range, which means unit-specific proof matters more than a quick acceptance.`;
  }
  if (theme === "mall") {
    return `${primary.profile.shortArea} can sound inevitable too early, which makes one calmer fallback cluster the fastest way to keep the benchmark visible.`;
  }
  if (theme === "suburban") {
    return `${primary.profile.shortArea} look steadier when they are checked against one calmer nearby cluster before the quote becomes the only story in the room.`;
  }
  if (secondary) {
    return `${primary.profile.shortArea} are still asking above the fair range, and one calmer comparison area like ${secondary.profile.shortArea} helps keep the benchmark visible.`;
  }
  return `${primary.profile.shortArea} can deserve a stronger story, but the premium still needs unit-specific proof before it becomes the working benchmark.`;
}

function buildLede(theme, primary) {
  if (theme === "heartland") {
    return `Market Notes is the short weekly RentIntel release for people who want one fast read, not a long blog post. This week's note is about ${primary.profile.area.toLowerCase()} still clearing the benchmark too easily, and why the next move should be proof mode instead of quick acceptance.`;
  }
  if (theme === "mall") {
    return `Market Notes is the short weekly RentIntel release for people who want one fast read, not a long blog post. This week's note is about ${primary.profile.area.toLowerCase()} starting to sound inevitable too early, and why one calmer fallback cluster still protects judgment.`;
  }
  if (theme === "suburban") {
    return `Market Notes is the short weekly RentIntel release for people who want one fast read, not a long blog post. This week's note is about ${primary.profile.area.toLowerCase()} and why one calmer comparison set still matters before the quote becomes the only narrative.`;
  }
  return `Market Notes is the short weekly RentIntel release for people who want one fast read, not a long blog post. This week's note is about ${primary.profile.area.toLowerCase()} arriving with a confident story, and why the premium still needs proof before it outruns the benchmark.`;
}

function buildParagraphs(theme, primary, secondary, feedState) {
  const secondaryCopy = secondary
    ? `${secondary.profile.shortArea} is a useful nearby comparison because its current asking line sits closer to ${money(secondary.fairRange.high)} psf pm while still giving the same operator a live fallback.`
    : "A second nearby comparison still matters because a premium only becomes credible when it survives one calmer live alternative.";

  const paragraphOne = `${primary.profile.area} are currently asking around ${money(primary.asking)} psf pm against a fair-range high of ${money(primary.fairRange.high)} psf pm, which leaves the quote roughly ${percentLabel(primary.premium)} above the calmer benchmark. That does not make the quote automatically wrong. It means the burden should stay on proof. Frontage, approvals, visibility, and operator fit should explain the gap rather than the area story replacing the gap altogether.`;

  const paragraphTwo = `${secondaryCopy} In the current pilot feed, ${primary.listingCount || 0} checks were captured for ${primary.profile.shortArea}, and the latest capture date still reads ${feedState.capturedAt || "not set"}. Faster comparison helps the shortlist move sooner, but it should not lower the proof standard when the premium is still stretching ahead of the benchmark.`;

  if (theme === "mall") {
    return [
      `${primary.profile.area} often get presented with an urgency story before the benchmark work is actually complete. Right now the asking line is around ${money(primary.asking)} psf pm against a fair-range high of ${money(primary.fairRange.high)} psf pm, which still leaves a meaningful premium to explain. If the story gets pushed into inevitability too early, the team can start treating the quote as the only realistic path even before the fallback work is done.`,
      `${secondaryCopy} The current pilot feed still depends on a manual capture completed on ${feedState.capturedAt || "not set"}, so this is exactly the moment to keep one calmer live comparison visible. The benchmark should remain on the table until the mall-specific story is concrete enough to justify the gap instead of just repeating it.`,
      `The decision cue this week is simple: if a renewal or shortlist discussion starts accelerating before the proof is specific, pause and compare it against one calmer nearby cluster first. Benchmark first, urgency second. Then use Workspace only after the premium is clear enough to deserve deeper negotiation work.`
    ];
  }

  if (theme === "heartland") {
    return [
      paragraphOne,
      `${secondaryCopy.replace(" is a useful nearby comparison", " works as a useful nearby comparison")} The current pilot feed is still a manual layer with the latest capture on ${feedState.capturedAt || "not set"}, so faster search should shorten the shortlist stage, not remove the need to pressure-test one live fallback cluster before accepting the premium.`,
      `The decision cue this week is simple: when a heartland quote is still clearing the benchmark by around ${percentLabel(primary.premium)}, shift from area-level confidence into proof mode. That means lease terms, frontage, operator fit, and one calmer nearby comparison before the asking line becomes the new mental anchor.`
    ];
  }

  if (theme === "suburban") {
    return [
      paragraphOne,
      `${secondaryCopy} In the current pilot workflow the feed is still refreshed manually, with the latest capture on ${feedState.capturedAt || "not set"}, which means the safest habit is still to keep one calmer comparison set visible before the premium hardens into the only story in the room.`,
      `The decision cue this week is simple: if the quote only feels strong while the calmer fallback disappears, the premium still needs proof before it becomes the working benchmark. Compare first, story second. Then move into Workspace only after the gap is specific enough to deserve deeper review.`
    ];
  }

  return [
    paragraphOne,
    paragraphTwo,
    `The decision cue this week is simple: when a quote comes with a stronger story, keep the benchmark visible until the proof is specific enough to explain the gap. Story second, evidence first. Then use Workspace only after the premium is clear enough to deserve deeper negotiation work.`
  ];
}

function buildUseIt(primary, secondary, feedState) {
  return [
    {
      label: "Area watch",
      text: `Treat ${primary.profile.shortArea} as a prompt to inspect the exact unit, not as proof that every nearby option repriced upward with it.`
    },
    {
      label: "Coverage update",
      text: secondary
        ? `Use direct-search coverage to compare ${primary.profile.shortArea} against ${secondary.profile.shortArea} before the premium becomes the default anchor.`
        : `Use direct-search coverage to pull one or two calmer nearby comparisons before the premium becomes the default anchor.`
    },
    {
      label: "Decision cue",
      text: `If the premium only works while unit details stay fuzzy, the quote still needs proof before it becomes the working benchmark. Latest pilot capture: ${feedState.capturedAt || "not set"}.`
    }
  ];
}

function createNote({ targetDate, notesPayload, askingFeed, sourceStatus }) {
  const ranked = rankSignals(askingFeed.records || []);
  const primary = ranked[0];
  const secondary = ranked[1] || null;
  if (!primary) {
    throw new Error("asking-rent feed has no records to build a weekly note from.");
  }

  const feedState = manualFeedSummary(sourceStatus, askingFeed);
  const theme = chooseTheme(primary, secondary);
  const title = buildTitle(theme, primary, secondary);
  const summary = buildSummary(theme, primary, secondary);
  const lede = buildLede(theme, primary);
  const storyParagraphs = buildParagraphs(theme, primary, secondary, feedState);
  const useIt = buildUseIt(primary, secondary, feedState);
  const description = `This week's RentIntel note on ${primary.profile.shortArea.toLowerCase()}, why the current asking line still needs proof against the benchmark, and the comparison habit that matters next.`;
  const slugBase = slugify(title);
  const existingSlugs = new Set((notesPayload.notes || []).map((note) => note.slug));
  let slug = slugBase;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${slugBase}-${suffix}`;
    suffix += 1;
  }

  return {
    slug,
    title,
    publishedAt: targetDate,
    description,
    summary,
    lede,
    storyParagraphs,
    useIt
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const notesPayload = readJson(notesPath);
  const askingFeed = readJson(askingFeedPath);
  const sourceStatus = readJson(sourceStatusPath);
  const notes = Array.isArray(notesPayload.notes) ? notesPayload.notes : [];
  if (!notes.length) {
    throw new Error("data/market-notes.json has no existing notes.");
  }

  const latest = [...notes].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))[0];
  const targetDate = args.date || nextMondayAfter(latest.publishedAt);
  const existingForDate = notes.find((note) => note.publishedAt === targetDate);
  const todaySgt = isoDateSgt(new Date());
  const isDue = targetDate <= todaySgt;

  if (existingForDate && !args.force) {
    console.log(JSON.stringify({
      status: "no-op",
      reason: "note already exists for target date",
      targetDate,
      existingSlug: existingForDate.slug
    }, null, 2));
    return;
  }

  if (!isDue && !args.force) {
    console.log(JSON.stringify({
      status: "no-op",
      reason: "next Monday is not due yet",
      latestPublishedAt: latest.publishedAt,
      targetDate,
      todaySgt
    }, null, 2));
    return;
  }

  const generated = createNote({ targetDate, notesPayload, askingFeed, sourceStatus });

  if (args.write) {
    const nextNotes = existingForDate
      ? notes.map((note) => (note.publishedAt === targetDate ? generated : note))
      : [generated, ...notes];
    notesPayload.notes = [...nextNotes].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
    fs.writeFileSync(notesPath, `${JSON.stringify(notesPayload, null, 2)}\n`);
  }

  console.log(JSON.stringify({
    status: args.write ? "written" : "preview",
    targetDate,
    dueToday: isDue,
    latestPublishedAt: latest.publishedAt,
    note: generated,
    dataInputs: {
      askingFeedUpdatedAt: askingFeed.updatedAt || "",
      sourceStatusUpdatedAt: sourceStatus.updatedAt || "",
      refreshTarget: manualFeedSummary(sourceStatus, askingFeed).refreshTarget
    }
  }, null, 2));
}

main();
