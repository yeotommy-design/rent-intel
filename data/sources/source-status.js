window.RENTINTEL_SOURCE_STATUS = {
  "version": "source-status-2026-06-24",
  "updatedAt": "2026-06-24",
  "lastReviewedAt": "2026-06-24",
  "weeklyReviewSchedule": "Monday 09:00 SGT",
  "environment": "prototype",
  "status": [
    {
      "sourceId": "ura-commercial-retail-rental-analysis",
      "label": "URA benchmark",
      "layer": "Official transaction benchmark",
      "currentState": "contract-ready",
      "prototypeState": "sample data only",
      "productionNextStep": "Add authorised export or data-service ingestion for retail rental benchmark records.",
      "refreshTarget": "Quarterly",
      "visibleTo": "Free and members",
      "lastCompletedAt": null,
      "timestampLabel": "No live ingest yet",
      "weeklyReviewStep": "Monday review: confirm whether a new URA retail benchmark release is available; only ingest on a real quarterly change."
    },
    {
      "sourceId": "hdb-commercial-data",
      "label": "HDB commercial context",
      "layer": "Commercial classification context",
      "currentState": "contract-ready",
      "prototypeState": "sample classification only",
      "productionNextStep": "Map HDB commercial datasets into property type and comparable context fields.",
      "refreshTarget": "Monthly or when updated",
      "visibleTo": "Members",
      "lastCompletedAt": null,
      "timestampLabel": "No live ingest yet",
      "weeklyReviewStep": "Monday review: check whether HDB commercial classifications or related context fields changed; refresh only when a real source update exists."
    },
    {
      "sourceId": "onemap-geospatial",
      "label": "OneMap",
      "layer": "Address and geospatial enrichment",
      "currentState": "contract-ready",
      "prototypeState": "static map coordinates only",
      "productionNextStep": "Connect postal, address, and planning-area lookup to search records.",
      "refreshTarget": "On search with nightly cache",
      "visibleTo": "Free and members",
      "lastCompletedAt": null,
      "timestampLabel": "On-search enrichment",
      "weeklyReviewStep": "Monday review: verify address and planning-area lookups still resolve correctly, and confirm the nightly cache path is healthy."
    },
    {
      "sourceId": "asking-rent-feed",
      "label": "Asking rent feed",
      "layer": "Current market asking signal",
      "currentState": "pilot-manual-feed-connected",
      "prototypeState": "verified manual pilot feed connected from data/sources/asking-rent-feed.json",
      "productionNextStep": "Replace pilot manual feed with licensed listing feed, agent input, tenant input, or verified capture workflow plus daily ingestion QA.",
      "refreshTarget": "Daily",
      "visibleTo": "Members",
      "lastCompletedAt": "2026-06-24",
      "timestampLabel": null,
      "weeklyReviewStep": "Monday review: check stale age, refresh the manual pilot if needed, and confirm daily QA logs or licensed-feed coverage are still missing."
    },
    {
      "sourceId": "rentintel-member-data",
      "label": "Member data",
      "layer": "Private application data",
      "currentState": "prototype-local-storage",
      "prototypeState": "browser storage only",
      "productionNextStep": "Move members, login codes, sessions, saved reports, and watchlists into a backend database.",
      "refreshTarget": "Real time",
      "visibleTo": "Members only",
      "lastCompletedAt": null,
      "timestampLabel": "Real time",
      "weeklyReviewStep": "Monday review: verify sign-in, saved reports, and watchlist writes still work; no batch refresh should be required."
    }
  ]
};
