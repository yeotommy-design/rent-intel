import process from "node:process";

const siteUrl = process.env.RENTINTEL_SEARCH_CONSOLE_SITE_URL || "sc-domain:rent-intel.com";
const sitemapUrl = process.env.RENTINTEL_SITEMAP_URL || "https://rent-intel.com/sitemap.xml";
const accessToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN;

async function main() {
  if (!accessToken) {
    throw new Error("Missing GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN. Create an OAuth access token with https://www.googleapis.com/auth/webmasters scope before submitting the sitemap.");
  }

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Search Console sitemap submission failed (${response.status}): ${body}`);
  }

  console.log(JSON.stringify({
    siteUrl,
    sitemapUrl,
    endpoint,
    status: "submitted"
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
