(function initRentIntelAuthClient() {
  const memberSessionKey = "rentintelMemberSession";

  function normalizeEmail(email = "") {
    return String(email).trim().toLowerCase();
  }

  function loadStoredJson(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStoredJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function sessionHasAccess(session) {
    return session?.access === "active" || session?.access === "promo" || session?.toolsEnabled === true;
  }

  function sessionIsAdmin(session) {
    const role = String(session?.role || "").toLowerCase();
    return role === "admin" || session?.isAdmin === true;
  }

  function toIsoDate(value, fallback = "") {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toISOString();
  }

  function memberToSession(member, fallbackEmail = "") {
    const email = normalizeEmail(member?.email || fallbackEmail);
    if (!email) return null;
    const role = String(member?.role || (member?.isAdmin ? "admin" : "member")).toLowerCase() === "admin"
      ? "admin"
      : "member";
    return {
      sessionId: member?.sessionId || member?.session_id || `api-${Date.now()}`,
      email,
      memberStatus: member?.memberStatus || member?.member_status || "Member",
      subscriptionStatus: member?.subscriptionStatus || member?.subscription_status || "",
      access: member?.access || "waitlist",
      promoCode: member?.promoCode || member?.promo_code || "",
      role,
      isAdmin: role === "admin",
      toolsEnabled: Boolean(member?.toolsEnabled ?? member?.tools_enabled),
      signedInAt: toIsoDate(member?.signedInAt || member?.signed_in_at, new Date().toISOString()),
      authSource: "api"
    };
  }

  function loadSession() {
    return loadStoredJson(memberSessionKey, null);
  }

  function saveSession(session) {
    if (!session) return null;
    writeStoredJson(memberSessionKey, session);
    return session;
  }

  function clearSession() {
    localStorage.removeItem(memberSessionKey);
  }

  async function logout() {
    const result = await apiRequest("/api/members/logout", { method: "POST" });
    clearSession();
    return result;
  }

  async function apiRequest(path, options = {}) {
    try {
      const response = await fetch(path, {
        method: options.method || "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          data = { raw: text };
        }
      }
      return { ok: response.ok, status: response.status, data };
    } catch (error) {
      return { ok: false, status: 0, data: null, error };
    }
  }

  async function requestCode(email) {
    return apiRequest("/api/members/login/request-code", {
      method: "POST",
      body: { email: normalizeEmail(email) }
    });
  }

  async function verifyCode(email, code) {
    return apiRequest("/api/members/login/verify-code", {
      method: "POST",
      body: { email: normalizeEmail(email), code: String(code || "") }
    });
  }

  async function fetchMemberMe() {
    const result = await apiRequest("/api/members/me");
    if (!result.ok || !result.data) return result;
    const member = result.data.member || result.data.data || result.data;
    const session = memberToSession(member);
    if (session) saveSession(session);
    return { ...result, session };
  }

  async function fetchReports() {
    return apiRequest("/api/members/reports");
  }

  async function saveReport(report) {
    return apiRequest("/api/members/reports", {
      method: "POST",
      body: report
    });
  }

  async function deleteReport(recordId) {
    return apiRequest(`/api/members/reports/${encodeURIComponent(String(recordId || ""))}`, {
      method: "DELETE"
    });
  }

  async function fetchWatchlist() {
    return apiRequest("/api/members/watchlist");
  }

  async function saveWatchlistItem(item) {
    return apiRequest("/api/members/watchlist", {
      method: "POST",
      body: item
    });
  }

  async function deleteWatchlistItem(recordId) {
    return apiRequest(`/api/members/watchlist/${encodeURIComponent(String(recordId || ""))}`, {
      method: "DELETE"
    });
  }

  async function saveAlertRule(rule) {
    return apiRequest("/api/members/alerts", {
      method: "POST",
      body: rule
    });
  }

  async function fetchAlertDeliveries(status = "") {
    const query = status ? `?status=${encodeURIComponent(String(status))}` : "";
    return apiRequest(`/api/members/alerts/deliveries${query}`);
  }

  async function queueAlertDelivery(payload) {
    return apiRequest("/api/members/alerts/queue-delivery", {
      method: "POST",
      body: payload
    });
  }

  async function fetchAlertMessages() {
    return apiRequest("/api/members/alerts/messages");
  }

  async function fetchAlertDeliveryRuns() {
    return apiRequest("/api/members/alerts/delivery-runs");
  }

  async function saveAlertDeliveryRun(payload) {
    return apiRequest("/api/members/alerts/delivery-runs", {
      method: "POST",
      body: payload
    });
  }

  async function fetchAlertAdminActions() {
    return apiRequest("/api/members/alerts/admin-actions");
  }

  async function saveAlertAdminAction(payload) {
    return apiRequest("/api/members/alerts/admin-actions", {
      method: "POST",
      body: payload
    });
  }

  async function saveSourceSyncRun(payload) {
    return apiRequest("/api/sources/sync-runs", {
      method: "POST",
      body: payload
    });
  }

  async function fetchSourceSyncSchedule() {
    return apiRequest("/api/sources/sync-schedule");
  }

  async function saveSourceSyncSchedule(payload) {
    return apiRequest("/api/sources/sync-schedule", {
      method: "POST",
      body: payload
    });
  }

  async function saveFreshnessPolicy(payload) {
    return apiRequest("/api/sources/freshness-policy", {
      method: "POST",
      body: payload
    });
  }

  async function saveFreshnessBreachEvent(payload) {
    return apiRequest("/api/sources/freshness-breach-events", {
      method: "POST",
      body: payload
    });
  }

  async function fetchSourceCandidates() {
    return apiRequest("/api/sources/asking-candidates");
  }

  async function fetchAskingFeed() {
    return apiRequest("/api/sources/asking-feed");
  }

  async function refreshAskingFeed() {
    return apiRequest("/api/sources/asking-feed/refresh", {
      method: "POST"
    });
  }

  async function saveSourceCandidate(payload) {
    return apiRequest("/api/sources/asking-candidates", {
      method: "POST",
      body: payload
    });
  }

  async function fetchCoverageRequests() {
    return apiRequest("/api/sources/coverage-requests");
  }

  async function classifyCoverageRequest(candidateId, payload) {
    return apiRequest(`/api/sources/coverage-requests/${encodeURIComponent(String(candidateId || ""))}/classification`, {
      method: "PATCH",
      body: payload
    });
  }

  async function saveCoverageQaDecision(candidateId, payload) {
    return apiRequest(`/api/sources/coverage-requests/${encodeURIComponent(String(candidateId || ""))}/qa-decision`, {
      method: "POST",
      body: payload
    });
  }

  async function saveCoverageSampleRecord(candidateId, payload) {
    return apiRequest(`/api/sources/coverage-requests/${encodeURIComponent(String(candidateId || ""))}/sample-record`, {
      method: "POST",
      body: payload
    });
  }

  async function fetchProductionEvidence() {
    return apiRequest("/api/sources/production-evidence");
  }

  async function saveProductionEvidence(payload) {
    return apiRequest("/api/sources/production-evidence", {
      method: "POST",
      body: payload
    });
  }

  async function fetchBackendHandoffAudit() {
    return apiRequest("/api/backend/handoff-audit");
  }

  async function saveBackendHandoffAudit(payload) {
    return apiRequest("/api/backend/handoff-audit", {
      method: "POST",
      body: payload
    });
  }

  async function savePreferences(preferences) {
    return apiRequest("/api/members/preferences", {
      method: "POST",
      body: preferences
    });
  }

  async function applyPromoCode(code) {
    return apiRequest("/api/members/promo/apply", {
      method: "POST",
      body: { code: String(code || "") }
    });
  }

  async function requestActivation(payload) {
    return apiRequest("/api/members/activation-requests", {
      method: "POST",
      body: payload
    });
  }

  async function fetchRoleAudit() {
    return apiRequest("/api/members/roles/audit");
  }

  async function updateMemberRole(payload) {
    return apiRequest("/api/members/roles", {
      method: "POST",
      body: payload
    });
  }

  async function fetchAdminOpsReport() {
    return apiRequest("/api/admin/ops-report");
  }

  async function restoreSession() {
    const api = await fetchMemberMe();
    if (api.ok && api.session?.email) {
      return { session: api.session, source: "api", api };
    }
    const local = loadSession();
    if (local?.email) {
      return { session: local, source: "local", api };
    }
    return { session: null, source: "none", api };
  }

  async function requireAccess(options = {}) {
    const requireLogin = options.requireLogin === true;
    const requireTools = options.requireTools === true;
    const requireAdmin = options.requireAdmin === true;
    const accountUrl = options.accountUrl || "/members/account/";
    const nextPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const reason = options.reason || (requireAdmin ? "admin-only" : requireTools ? "workspace-locked" : "login-required");
    const restored = await restoreSession();
    const session = restored.session;

    let blocked = false;
    if (requireLogin && !session?.email) blocked = true;
    if (!blocked && requireTools && !sessionHasAccess(session)) blocked = true;
    if (!blocked && requireAdmin && !sessionIsAdmin(session)) blocked = true;

    if (blocked) {
      const parts = String(accountUrl).split("#");
      const baseUrl = parts[0] || "/members/account/";
      const hash = parts[1] ? `#${parts[1]}` : "";
      const separator = baseUrl.includes("?") ? "&" : "?";
      const redirectUrl = `${baseUrl}${separator}next=${encodeURIComponent(nextPath)}&reason=${encodeURIComponent(reason)}${hash}`;
      window.location.href = redirectUrl;
      return { allowed: false, session };
    }
    return { allowed: true, session };
  }

  window.RentIntelAuth = {
    normalizeEmail,
    loadSession,
    saveSession,
    clearSession,
    logout,
    sessionHasAccess,
    sessionIsAdmin,
    memberToSession,
    requestCode,
    verifyCode,
    fetchMemberMe,
    fetchReports,
    saveReport,
    deleteReport,
    fetchWatchlist,
    saveWatchlistItem,
    deleteWatchlistItem,
    saveAlertRule,
    fetchAlertDeliveries,
    fetchAlertMessages,
    queueAlertDelivery,
    fetchAlertDeliveryRuns,
    saveAlertDeliveryRun,
    fetchAlertAdminActions,
    saveAlertAdminAction,
    saveSourceSyncRun,
    fetchSourceSyncSchedule,
    saveSourceSyncSchedule,
    saveFreshnessPolicy,
    saveFreshnessBreachEvent,
    fetchSourceCandidates,
    fetchAskingFeed,
    refreshAskingFeed,
    saveSourceCandidate,
    fetchCoverageRequests,
    classifyCoverageRequest,
    saveCoverageQaDecision,
    saveCoverageSampleRecord,
    fetchProductionEvidence,
    saveProductionEvidence,
    fetchBackendHandoffAudit,
    saveBackendHandoffAudit,
    savePreferences,
    applyPromoCode,
    requestActivation,
    fetchRoleAudit,
    updateMemberRole,
    fetchAdminOpsReport,
    restoreSession,
    requireAccess
  };
})();
