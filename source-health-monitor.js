(function () {
  function formatDateTime(value) {
    if (!value) return "Not recorded";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatCapture(value) {
    if (!value) return "No capture connected";
    const date = new Date(`${value}T00:00:00+08:00`);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-SG", {
      timeZone: "Asia/Singapore",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function render(health = {}) {
    window.RENTINTEL_SOURCE_SYNC_HEALTH = health;
    document.querySelectorAll("[data-source-health-monitor]").forEach((monitor) => {
      const state = health.monitorState || "missing";
      monitor.dataset.state = state;
      const label = monitor.querySelector("[data-source-health-label]");
      const summary = monitor.querySelector("[data-source-health-summary]");
      const action = monitor.querySelector("[data-source-health-action]");
      const checked = monitor.querySelector("[data-source-health-checked]");
      const captured = monitor.querySelector("[data-source-health-captured]");
      const next = monitor.querySelector("[data-source-health-next]");
      if (label) label.textContent = health.monitorLabel || "Status unavailable";
      if (summary) summary.textContent = health.summary || "The automated source check has not recorded a result yet.";
      if (action) action.textContent = health.action || "Check the source workflow before relying on current rent signals.";
      if (checked) checked.textContent = formatDateTime(health.lastCheckedAt);
      if (captured) captured.textContent = formatCapture(health.latestCaptureAt);
      if (next) next.textContent = formatDateTime(health.nextCheckAt);
    });
  }

  render(window.RENTINTEL_SOURCE_SYNC_HEALTH || {});
  fetch("/api/sources/health", {
    headers: { accept: "application/json" },
    cache: "no-store"
  })
    .then((response) => {
      if (!response.ok) throw new Error("Source health check unavailable");
      return response.json();
    })
    .then((payload) => {
      if (payload && payload.ok && payload.health) render(payload.health);
    })
    .catch(() => {
      // Keep the generated fallback visible if the live check is unavailable.
    });
})();
