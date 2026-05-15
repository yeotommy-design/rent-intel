const memberSessionKey = "rentintelMemberSession";
const savedReportsKey = "rentintelSavedReports";
const backendSavedReportsKey = "rentintelBackendSavedReports";
const watchlistKey = "rentintelWatchlistAreas";
const alertRulesKey = "rentintelAlertRules";
const alertDeliveryQueueKey = "rentintelAlertDeliveryQueue";
const alertDeliveryHistoryKey = "rentintelAlertDeliveryHistory";
const alertDeliveryRunsKey = "rentintelAlertDeliveryRuns";
const alertDeliveredMessagesKey = "rentintelAlertDeliveredMessages";
const alertDeliveryAdminLogKey = "rentintelAlertDeliveryAdminLog";
const roleAuditLogKey = "rentintelMemberRoleAuditLog";
const joinedMembersKey = "rentintelJoinedMembers";
const activityLogKey = "rentintelActivityLog";
const askingSourceCandidatesKey = "rentintelAskingSourceCandidates";
const coverageRecordsKey = "rentintelCoverageRecords";
const sourceSyncLogKey = "rentintelSourceSyncLog";
const sourceSyncAutomationKey = "rentintelSourceSyncAutomation";
const askingFeedQaReviewKey = "rentintelAskingFeedQaReview";
const freshnessPolicyKey = "rentintelFreshnessSlaPolicy";
const productionEvidenceKey = "rentintelProductionSourceEvidence";
const productionReleaseLogKey = "rentintelProductionReleaseLog";
const activationRequestsKey = "rentintelActivationRequests";
const notificationPreferencesKey = "rentintelNotificationPreferences";
const toolbenchPreviewRecordKey = "rentintelToolbenchPreviewRecord";
const pendingLoginKey = "rentintelPendingLogin";
const pendingMemberIntentKey = "rentintelPendingMemberIntent";
const validPromoCode = "RENTINTEL-PILOT";
const defaultAlertMaxRetries = 2;
const freshnessPolicyAdminEmails = new Set(["active@rent-intel.com"]);

let currentMember = null;
let currentSession = null;
let todayBriefRecord = null;
let selectedReport = null;
let activeWatchlistRuleEditorId = "";
let coverageRequestFilter = "all";
let deliveryMessageTransportFilter = "all";
let deliveryMessageRunFilter = "all";
let selectedDeliveryMessage = null;
let savedReportFilters = {
  query: "",
  trust: "all",
  gap: "all"
};

const accountEl = {
  emailForm: document.getElementById("emailLoginForm"),
  emailInput: document.getElementById("accountEmail"),
  emailStatus: document.getElementById("emailStatus"),
  codeStep: document.getElementById("codeStep"),
  codeForm: document.getElementById("codeLoginForm"),
  codeInput: document.getElementById("loginCode"),
  codeStatus: document.getElementById("codeStatus"),
  joinPanel: document.getElementById("joinMemberPanel"),
  joinForm: document.getElementById("joinMemberForm"),
  joinEmail: document.getElementById("joinEmail"),
  joinStatus: document.getElementById("joinStatus"),
  publicIntentPanel: document.getElementById("publicIntentPanel"),
  publicIntentTitle: document.getElementById("publicIntentTitle"),
  publicIntentCopy: document.getElementById("publicIntentCopy"),
  publicIntentAskingMetric: document.getElementById("publicIntentAskingMetric"),
  publicIntentRangeMetric: document.getElementById("publicIntentRangeMetric"),
  publicIntentGapMetric: document.getElementById("publicIntentGapMetric"),
  publicIntentTrustMetric: document.getElementById("publicIntentTrustMetric"),
  openPublicIntentWorkspace: document.getElementById("openPublicIntentWorkspace"),
  requestPublicIntentButton: document.getElementById("requestPublicIntentButton"),
  savePublicIntentButton: document.getElementById("savePublicIntentButton"),
  clearPublicIntentButton: document.getElementById("clearPublicIntentButton"),
  publicIntentStatus: document.getElementById("publicIntentStatus"),
  dashboard: document.getElementById("accountDashboard"),
  accountAccessBanner: document.getElementById("accountAccessBanner"),
  accountAccessLabel: document.getElementById("accountAccessLabel"),
  accountAccessTitle: document.getElementById("accountAccessTitle"),
  accountAccessCopy: document.getElementById("accountAccessCopy"),
  accountSessionMeta: document.getElementById("accountSessionMeta"),
  accountAccessAction: document.getElementById("accountAccessAction"),
  switchAccountButton: document.getElementById("switchAccountButton"),
  signOutButton: document.getElementById("signOutButton"),
  membershipTimelineSummary: document.getElementById("membershipTimelineSummary"),
  membershipTimeline: document.getElementById("membershipTimeline"),
  accountNextActionPanel: document.getElementById("accountNextActionPanel"),
  accountNextActionLabel: document.getElementById("accountNextActionLabel"),
  accountNextActionTitle: document.getElementById("accountNextActionTitle"),
  accountNextActionCopy: document.getElementById("accountNextActionCopy"),
  accountNextActionLink: document.getElementById("accountNextActionLink"),
  memberCommandSummary: document.getElementById("memberCommandSummary"),
  commandSavedMetric: document.getElementById("commandSavedMetric"),
  commandWatchMetric: document.getElementById("commandWatchMetric"),
  commandSourceMetric: document.getElementById("commandSourceMetric"),
  commandAccessMetric: document.getElementById("commandAccessMetric"),
  commandSaveBriefButton: document.getElementById("commandSaveBriefButton"),
  commandWatchAreaButton: document.getElementById("commandWatchAreaButton"),
  commandRunSyncButton: document.getElementById("commandRunSyncButton"),
  commandOpenToolbenchButton: document.getElementById("commandOpenToolbenchButton"),
  memberCommandStatus: document.getElementById("memberCommandStatus"),
  coverageShortcutSummary: document.getElementById("coverageShortcutSummary"),
  coverageShortcutPendingMetric: document.getElementById("coverageShortcutPendingMetric"),
  coverageShortcutPilotMetric: document.getElementById("coverageShortcutPilotMetric"),
  coverageShortcutLiveMetric: document.getElementById("coverageShortcutLiveMetric"),
  coverageShortcutReviewButton: document.getElementById("coverageShortcutReviewButton"),
  coverageShortcutPublicButton: document.getElementById("coverageShortcutPublicButton"),
  coverageShortcutSourceSyncButton: document.getElementById("coverageShortcutSourceSyncButton"),
  coverageShortcutLiveLink: document.getElementById("coverageShortcutLiveLink"),
  coverageShortcutStatus: document.getElementById("coverageShortcutStatus"),
  memberStatus: document.getElementById("memberStatus"),
  subscriptionStatus: document.getElementById("subscriptionStatus"),
  toolbenchStatus: document.getElementById("toolbenchStatus"),
  todayBriefTitle: document.getElementById("todayBriefTitle"),
  todayBriefCopy: document.getElementById("todayBriefCopy"),
  todayAskingMetric: document.getElementById("todayAskingMetric"),
  todayFairRangeMetric: document.getElementById("todayFairRangeMetric"),
  todayGapMetric: document.getElementById("todayGapMetric"),
  saveTodayBriefButton: document.getElementById("saveTodayBriefButton"),
  watchTodayBriefButton: document.getElementById("watchTodayBriefButton"),
  todayBriefStatus: document.getElementById("todayBriefStatus"),
  promoForm: document.getElementById("promoForm"),
  promoInput: document.getElementById("promoCode"),
  promoCodeLabel: document.getElementById("promoCodeLabel"),
  promoStatus: document.getElementById("promoStatus"),
  activationRequestForm: document.getElementById("activationRequestForm"),
  activationPlan: document.getElementById("activationPlan"),
  activationUseCase: document.getElementById("activationUseCase"),
  activationRequestLabel: document.getElementById("activationRequestLabel"),
  activationRequestStatus: document.getElementById("activationRequestStatus"),
  activationRequestList: document.getElementById("activationRequestList"),
  notificationPreferenceForm: document.getElementById("notificationPreferenceForm"),
  notificationPreferenceSummary: document.getElementById("notificationPreferenceSummary"),
  preferenceDailyBrief: document.getElementById("preferenceDailyBrief"),
  preferenceActivationUpdates: document.getElementById("preferenceActivationUpdates"),
  preferenceWatchlistAlerts: document.getElementById("preferenceWatchlistAlerts"),
  preferenceSourceSyncAlerts: document.getElementById("preferenceSourceSyncAlerts"),
  notificationPreferenceStatus: document.getElementById("notificationPreferenceStatus"),
  savedCount: document.getElementById("accountSavedCount"),
  backendReportSummary: document.getElementById("backendReportSummary"),
  syncBackendReportsButton: document.getElementById("syncBackendReportsButton"),
  backendReportStatus: document.getElementById("backendReportStatus"),
  savedReportSearch: document.getElementById("savedReportSearch"),
  savedReportTrustFilter: document.getElementById("savedReportTrustFilter"),
  savedReportGapFilter: document.getElementById("savedReportGapFilter"),
  savedReports: document.getElementById("accountSavedReports"),
  reportDetailTitle: document.getElementById("reportDetailTitle"),
  reportDetailDecision: document.getElementById("reportDetailDecision"),
  reportOfficialMetric: document.getElementById("reportOfficialMetric"),
  reportAskingMetric: document.getElementById("reportAskingMetric"),
  reportFairRangeMetric: document.getElementById("reportFairRangeMetric"),
  reportGapMetric: document.getElementById("reportGapMetric"),
  reportActionCopy: document.getElementById("reportActionCopy"),
  reportSourceCopy: document.getElementById("reportSourceCopy"),
  reportPulseSummary: document.getElementById("reportPulseSummary"),
  reportPulseLabel: document.getElementById("reportPulseLabel"),
  reportPulseTitle: document.getElementById("reportPulseTitle"),
  reportPulseCopy: document.getElementById("reportPulseCopy"),
  reportPulseNext: document.getElementById("reportPulseNext"),
  reportPackSizeMetric: document.getElementById("reportPackSizeMetric"),
  reportPackTargetMetric: document.getElementById("reportPackTargetMetric"),
  reportPackOfferMetric: document.getElementById("reportPackOfferMetric"),
  reportPackAlertMetric: document.getElementById("reportPackAlertMetric"),
  reportPackTrustMetric: document.getElementById("reportPackTrustMetric"),
  reportPackTrustCopy: document.getElementById("reportPackTrustCopy"),
  reportPackBenchmarkMetric: document.getElementById("reportPackBenchmarkMetric"),
  reportPackBenchmarkCopy: document.getElementById("reportPackBenchmarkCopy"),
  reportPackAskingMetric: document.getElementById("reportPackAskingMetric"),
  reportPackAskingCopy: document.getElementById("reportPackAskingCopy"),
  openReportToolbenchButton: document.getElementById("openReportToolbenchButton"),
  watchReportAreaButton: document.getElementById("watchReportAreaButton"),
  deleteReportButton: document.getElementById("deleteReportButton"),
  reportDetailStatus: document.getElementById("reportDetailStatus"),
  negotiationNoteLabel: document.getElementById("negotiationNoteLabel"),
  negotiationNoteText: document.getElementById("negotiationNoteText"),
  copyNegotiationNoteButton: document.getElementById("copyNegotiationNoteButton"),
  downloadNegotiationNoteButton: document.getElementById("downloadNegotiationNoteButton"),
  previewReportExportButton: document.getElementById("previewReportExportButton"),
  downloadReportTxtButton: document.getElementById("downloadReportTxtButton"),
  downloadReportJsonButton: document.getElementById("downloadReportJsonButton"),
  reportPreviewModal: document.getElementById("reportPreviewModal"),
  reportPreviewTitle: document.getElementById("reportPreviewTitle"),
  reportPreviewText: document.getElementById("reportPreviewText"),
  previewDownloadTxtButton: document.getElementById("previewDownloadTxtButton"),
  previewDownloadJsonButton: document.getElementById("previewDownloadJsonButton"),
  closeReportPreviewButton: document.getElementById("closeReportPreviewButton"),
  negotiationNoteStatus: document.getElementById("negotiationNoteStatus"),
  backendHandoffSummary: document.getElementById("backendHandoffSummary"),
  backendHandoffList: document.getElementById("backendHandoffList"),
  backendTableMapSummary: document.getElementById("backendTableMapSummary"),
  backendTableMapList: document.getElementById("backendTableMapList"),
  backendApiMapSummary: document.getElementById("backendApiMapSummary"),
  backendApiMapList: document.getElementById("backendApiMapList"),
  backendRouteMockSummary: document.getElementById("backendRouteMockSummary"),
  backendRouteMockList: document.getElementById("backendRouteMockList"),
  backendImplementationSummary: document.getElementById("backendImplementationSummary"),
  backendImplementationList: document.getElementById("backendImplementationList"),
  backendPayloadSummary: document.getElementById("backendPayloadSummary"),
  backendValidationGrid: document.getElementById("backendValidationGrid"),
  backendPayloadText: document.getElementById("backendPayloadText"),
  backendSqlSummary: document.getElementById("backendSqlSummary"),
  backendSqlText: document.getElementById("backendSqlText"),
  backendPackageSummary: document.getElementById("backendPackageSummary"),
  backendPackageText: document.getElementById("backendPackageText"),
  backendPayloadButton: document.getElementById("backendPayloadButton"),
  validateBackendPayloadButton: document.getElementById("validateBackendPayloadButton"),
  backendSqlButton: document.getElementById("backendSqlButton"),
  backendPackageButton: document.getElementById("backendPackageButton"),
  copyBackendPayloadButton: document.getElementById("copyBackendPayloadButton"),
  downloadBackendPayloadButton: document.getElementById("downloadBackendPayloadButton"),
  copyBackendSqlButton: document.getElementById("copyBackendSqlButton"),
  downloadBackendSqlButton: document.getElementById("downloadBackendSqlButton"),
  copyBackendPackageButton: document.getElementById("copyBackendPackageButton"),
  downloadBackendPackageButton: document.getElementById("downloadBackendPackageButton"),
  backendHandoffButton: document.getElementById("backendHandoffButton"),
  backendHandoffStatus: document.getElementById("backendHandoffStatus"),
  watchlistForm: document.getElementById("watchlistForm"),
  watchlistArea: document.getElementById("watchlistArea"),
  watchlistStatus: document.getElementById("watchlistStatus"),
  watchlistCount: document.getElementById("watchlistCount"),
  watchlistItems: document.getElementById("watchlistItems"),
  watchlistAlertPreview: document.getElementById("watchlistAlertPreview"),
  watchlistAlertLabel: document.getElementById("watchlistAlertLabel"),
  watchlistAlertTitle: document.getElementById("watchlistAlertTitle"),
  watchlistAlertCopy: document.getElementById("watchlistAlertCopy"),
  watchlistAlertTriggerMetric: document.getElementById("watchlistAlertTriggerMetric"),
  watchlistAlertTargetMetric: document.getElementById("watchlistAlertTargetMetric"),
  watchlistAlertCadenceMetric: document.getElementById("watchlistAlertCadenceMetric"),
  watchlistAlertNext: document.getElementById("watchlistAlertNext"),
  watchlistOutboxCount: document.getElementById("watchlistOutboxCount"),
  watchlistOutboxItems: document.getElementById("watchlistOutboxItems"),
  runDeliveryWorkerButton: document.getElementById("runDeliveryWorkerButton"),
  deliveryWorkerStatus: document.getElementById("deliveryWorkerStatus"),
  deliveryWorkerRunCount: document.getElementById("deliveryWorkerRunCount"),
  deliveryWorkerSentMetric: document.getElementById("deliveryWorkerSentMetric"),
  deliveryWorkerFailedMetric: document.getElementById("deliveryWorkerFailedMetric"),
  deliveryWorkerSkippedMetric: document.getElementById("deliveryWorkerSkippedMetric"),
  deliveryWorkerDeadLetterMetric: document.getElementById("deliveryWorkerDeadLetterMetric"),
  deliveryWorkerLastRunAt: document.getElementById("deliveryWorkerLastRunAt"),
  deliveryWorkerRunList: document.getElementById("deliveryWorkerRunList"),
  deliveryMessageCount: document.getElementById("deliveryMessageCount"),
  deliveryMessageTransportFilter: document.getElementById("deliveryMessageTransportFilter"),
  deliveryMessageRunFilter: document.getElementById("deliveryMessageRunFilter"),
  deliveryMessageList: document.getElementById("deliveryMessageList"),
  deliveryMessageModal: document.getElementById("deliveryMessageModal"),
  deliveryMessageModalTitle: document.getElementById("deliveryMessageModalTitle"),
  deliveryMessageModalMeta: document.getElementById("deliveryMessageModalMeta"),
  deliveryMessageModalText: document.getElementById("deliveryMessageModalText"),
  copyDeliveryMessageButton: document.getElementById("copyDeliveryMessageButton"),
  downloadDeliveryMessageButton: document.getElementById("downloadDeliveryMessageButton"),
  closeDeliveryMessageButton: document.getElementById("closeDeliveryMessageButton"),
  alertHistoryCount: document.getElementById("alertHistoryCount"),
  alertHistoryQueuedMetric: document.getElementById("alertHistoryQueuedMetric"),
  alertHistorySentMetric: document.getElementById("alertHistorySentMetric"),
  alertHistorySkippedMetric: document.getElementById("alertHistorySkippedMetric"),
  alertHistoryFailedMetric: document.getElementById("alertHistoryFailedMetric"),
  alertHistoryList: document.getElementById("alertHistoryList"),
  sourceStatusSummary: document.getElementById("sourceStatusSummary"),
  sourceStatusGrid: document.getElementById("sourceStatusGrid"),
  accountSourceQa: document.getElementById("accountSourceQa"),
  accountSourceQaTitle: document.getElementById("accountSourceQaTitle"),
  accountSourceQaRecords: document.getElementById("accountSourceQaRecords"),
  accountSourceQaChecks: document.getElementById("accountSourceQaChecks"),
  accountSourceQaCaptured: document.getElementById("accountSourceQaCaptured"),
  accountSourceQaProduction: document.getElementById("accountSourceQaProduction"),
  accountSourceQaNext: document.getElementById("accountSourceQaNext"),
  freshnessPolicySummary: document.getElementById("freshnessPolicySummary"),
  freshnessPolicyForm: document.getElementById("freshnessPolicyForm"),
  freshnessFreshDays: document.getElementById("freshnessFreshDays"),
  freshnessWatchDays: document.getElementById("freshnessWatchDays"),
  saveFreshnessPolicyButton: document.getElementById("saveFreshnessPolicyButton"),
  freshnessPolicyStatus: document.getElementById("freshnessPolicyStatus"),
  accountSourceGate: document.getElementById("accountSourceGate"),
  accountSourceGateSummary: document.getElementById("accountSourceGateSummary"),
  accountSourceGateList: document.getElementById("accountSourceGateList"),
  accountProductionEvidence: document.getElementById("accountProductionEvidence"),
  productionEvidenceSummary: document.getElementById("productionEvidenceSummary"),
  productionSourceType: document.getElementById("productionSourceType"),
  productionSourceName: document.getElementById("productionSourceName"),
  attachProductionSourceButton: document.getElementById("attachProductionSourceButton"),
  recordProductionQaLogButton: document.getElementById("recordProductionQaLogButton"),
  recordSourceOwnerReviewButton: document.getElementById("recordSourceOwnerReviewButton"),
  clearProductionEvidenceButton: document.getElementById("clearProductionEvidenceButton"),
  productionEvidenceStatus: document.getElementById("productionEvidenceStatus"),
  accountOpsReview: document.getElementById("accountOpsReview"),
  opsReviewStage: document.getElementById("opsReviewStage"),
  opsReviewSummary: document.getElementById("opsReviewSummary"),
  opsReviewEvidenceMetric: document.getElementById("opsReviewEvidenceMetric"),
  opsReviewGateMetric: document.getElementById("opsReviewGateMetric"),
  opsReviewDecisionMetric: document.getElementById("opsReviewDecisionMetric"),
  opsReviewAction: document.getElementById("opsReviewAction"),
  opsReviewBlockers: document.getElementById("opsReviewBlockers"),
  accountReleaseLog: document.getElementById("accountReleaseLog"),
  releaseLogStatus: document.getElementById("releaseLogStatus"),
  releaseLogSummary: document.getElementById("releaseLogSummary"),
  releaseLogTimestampMetric: document.getElementById("releaseLogTimestampMetric"),
  releaseLogByMetric: document.getElementById("releaseLogByMetric"),
  releaseLogRollbackMetric: document.getElementById("releaseLogRollbackMetric"),
  releaseLogNote: document.getElementById("releaseLogNote"),
  queueProductionReleaseButton: document.getElementById("queueProductionReleaseButton"),
  markProductionReleasedButton: document.getElementById("markProductionReleasedButton"),
  rollbackProductionReleaseButton: document.getElementById("rollbackProductionReleaseButton"),
  releaseLogMessage: document.getElementById("releaseLogMessage"),
  accountSourceExceptions: document.getElementById("accountSourceExceptions"),
  sourceExceptionSummary: document.getElementById("sourceExceptionSummary"),
  sourceExceptionCriticalMetric: document.getElementById("sourceExceptionCriticalMetric"),
  sourceExceptionWatchMetric: document.getElementById("sourceExceptionWatchMetric"),
  sourceExceptionStatusMetric: document.getElementById("sourceExceptionStatusMetric"),
  sourceExceptionList: document.getElementById("sourceExceptionList"),
  accountSourceAdminQueue: document.getElementById("accountSourceAdminQueue"),
  sourceAdminQueueSummary: document.getElementById("sourceAdminQueueSummary"),
  sourceAdminQueueList: document.getElementById("sourceAdminQueueList"),
  accountSourceHistory: document.getElementById("accountSourceHistory"),
  sourceHistorySummary: document.getElementById("sourceHistorySummary"),
  sourceHistoryStageMetric: document.getElementById("sourceHistoryStageMetric"),
  sourceHistoryQaMetric: document.getElementById("sourceHistoryQaMetric"),
  sourceHistoryReleaseMetric: document.getElementById("sourceHistoryReleaseMetric"),
  sourceHistoryNextMetric: document.getElementById("sourceHistoryNextMetric"),
  sourceHistoryList: document.getElementById("sourceHistoryList"),
  accountSourceHandoff: document.getElementById("accountSourceHandoff"),
  accountSourceHandoffSummary: document.getElementById("accountSourceHandoffSummary"),
  accountSourceHandoffList: document.getElementById("accountSourceHandoffList"),
  accountSourceQaList: document.getElementById("accountSourceQaList"),
  accountOpsDrawer: document.getElementById("accountOpsDrawer"),
  askingSourceForm: document.getElementById("askingSourceForm"),
  askingSourceType: document.getElementById("askingSourceType"),
  askingSourceName: document.getElementById("askingSourceName"),
  askingSourceStatus: document.getElementById("askingSourceStatus"),
  askingSourceCount: document.getElementById("askingSourceCount"),
  askingSourceList: document.getElementById("askingSourceList"),
  coverageRequestSummary: document.getElementById("coverageRequestSummary"),
  coveragePendingMetric: document.getElementById("coveragePendingMetric"),
  coverageApprovedMetric: document.getElementById("coverageApprovedMetric"),
  coverageRejectedMetric: document.getElementById("coverageRejectedMetric"),
  coverageFilterButtons: document.querySelectorAll("[data-coverage-filter]"),
  coverageRequestList: document.getElementById("coverageRequestList"),
  coverageRequestStatus: document.getElementById("coverageRequestStatus"),
  manualReviewSummary: document.getElementById("manualReviewSummary"),
  manualReviewList: document.getElementById("manualReviewList"),
  sourceSyncSummary: document.getElementById("sourceSyncSummary"),
  approvedSourceMetric: document.getElementById("approvedSourceMetric"),
  latestSyncMetric: document.getElementById("latestSyncMetric"),
  recordsCheckedMetric: document.getElementById("recordsCheckedMetric"),
  coverageTargetMetric: document.getElementById("coverageTargetMetric"),
  coverageTargetList: document.getElementById("coverageTargetList"),
  runSourceSyncButton: document.getElementById("runSourceSyncButton"),
  sourceSyncStatus: document.getElementById("sourceSyncStatus"),
  sourceSyncAutomationSummary: document.getElementById("sourceSyncAutomationSummary"),
  sourceSyncAutomationForm: document.getElementById("sourceSyncAutomationForm"),
  sourceSyncAutomationEnabled: document.getElementById("sourceSyncAutomationEnabled"),
  sourceSyncAutomationCadence: document.getElementById("sourceSyncAutomationCadence"),
  sourceSyncAutomationHour: document.getElementById("sourceSyncAutomationHour"),
  saveSourceSyncAutomationButton: document.getElementById("saveSourceSyncAutomationButton"),
  runSourceSyncAutomationNowButton: document.getElementById("runSourceSyncAutomationNowButton"),
  sourceSyncAutomationNextRun: document.getElementById("sourceSyncAutomationNextRun"),
  sourceSyncAutomationLastRun: document.getElementById("sourceSyncAutomationLastRun"),
  sourceSyncAutomationFreshness: document.getElementById("sourceSyncAutomationFreshness"),
  sourceSyncAutomationBreaches: document.getElementById("sourceSyncAutomationBreaches"),
  sourceSyncAutomationStatus: document.getElementById("sourceSyncAutomationStatus"),
  sourceSyncAutomationLog: document.getElementById("sourceSyncAutomationLog"),
  sourceSyncLog: document.getElementById("sourceSyncLog"),
  activityLogCount: document.getElementById("activityLogCount"),
  activityLogList: document.getElementById("activityLogList"),
  adminReviewSummary: document.getElementById("adminReviewSummary"),
  adminReviewActivationMetric: document.getElementById("adminReviewActivationMetric"),
  adminReviewActivationCopy: document.getElementById("adminReviewActivationCopy"),
  adminReviewBadgeMetric: document.getElementById("adminReviewBadgeMetric"),
  adminReviewBadgeCopy: document.getElementById("adminReviewBadgeCopy"),
  adminReviewGateMetric: document.getElementById("adminReviewGateMetric"),
  adminReviewGateCopy: document.getElementById("adminReviewGateCopy"),
  adminReviewReleaseMetric: document.getElementById("adminReviewReleaseMetric"),
  adminReviewReleaseCopy: document.getElementById("adminReviewReleaseCopy"),
  adminReviewList: document.getElementById("adminReviewList"),
  adminReviewStatus: document.getElementById("adminReviewStatus"),
  deliveryAdminSummary: document.getElementById("deliveryAdminSummary"),
  deliveryAdminFailedMetric: document.getElementById("deliveryAdminFailedMetric"),
  deliveryAdminDeadMetric: document.getElementById("deliveryAdminDeadMetric"),
  deliveryAdminSuppressedMetric: document.getElementById("deliveryAdminSuppressedMetric"),
  deliveryAdminAcknowledgedMetric: document.getElementById("deliveryAdminAcknowledgedMetric"),
  deliveryAdminAuditMetric: document.getElementById("deliveryAdminAuditMetric"),
  deliveryAdminAcknowledgeButton: document.getElementById("deliveryAdminAcknowledgeButton"),
  deliveryAdminRequeueFailedButton: document.getElementById("deliveryAdminRequeueFailedButton"),
  deliveryAdminRequeueDeadButton: document.getElementById("deliveryAdminRequeueDeadButton"),
  deliveryAdminSuppressDeadButton: document.getElementById("deliveryAdminSuppressDeadButton"),
  deliveryAdminList: document.getElementById("deliveryAdminList"),
  deliveryAdminAuditList: document.getElementById("deliveryAdminAuditList"),
  deliveryAdminStatus: document.getElementById("deliveryAdminStatus"),
  memberRegistrySummary: document.getElementById("memberRegistrySummary"),
  memberRegistryList: document.getElementById("memberRegistryList"),
  memberRoleAuditSummary: document.getElementById("memberRoleAuditSummary"),
  memberRoleAuditList: document.getElementById("memberRoleAuditList"),
  memberRegistryStatus: document.getElementById("memberRegistryStatus"),
  toolCards: document.querySelectorAll(".member-tool-card"),
  previewAlertButton: document.getElementById("previewAlertButton"),
  previewExportButton: document.getElementById("previewExportButton"),
  toolbenchPanel: document.getElementById("toolbenchPanel"),
  toolbenchTitle: document.getElementById("toolbenchTitle"),
  toolbenchCopy: document.getElementById("toolbenchCopy"),
  toolbenchLink: document.getElementById("toolbenchLink")
};

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function queryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function safeNextPath(value = "") {
  const next = String(value || "").trim();
  if (!next.startsWith("/")) return "";
  if (next.startsWith("//")) return "";
  return next;
}

function consumeNextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = safeNextPath(params.get("next") || "");
  if (!next) return "";
  params.delete("next");
  params.delete("reason");
  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
  return next;
}

function maybeRedirectToNextPath() {
  const next = consumeNextPath();
  if (!next) return false;
  window.location.href = next;
  return true;
}

function sessionIsAdminLike(session = currentSession) {
  return String(session?.role || "").toLowerCase() === "admin" || session?.isAdmin === true;
}

function clearNextPathCallout() {
  const existing = document.getElementById("accountNextPathCallout");
  if (existing) existing.remove();
}

function nextPathLabel(next = safeNextPath(queryParam("next") || "")) {
  if (!next) return "";
  if (next.startsWith("/admin/ops")) return "Admin Ops Dashboard";
  if (next.startsWith("/admin/coverage")) return "Coverage Review";
  if (next.startsWith("/members/toolbench")) return "Member Toolbench";
  return next.replace(/\/+$/, "") || next;
}

function renderNextPathCallout(session = currentSession) {
  const next = safeNextPath(queryParam("next") || "");
  if (!next) {
    clearNextPathCallout();
    return;
  }
  const reason = String(queryParam("reason") || "").trim().toLowerCase();
  const canContinue = sessionCanContinueReason(session, reason);
  const destination = nextPathLabel(next);
  const title = canContinue ? `Ready to continue to ${destination}` : `This page will continue to ${destination}`;
  const body = canContinue
    ? "Your access is ready. If the redirect does not happen automatically, continue manually."
    : reason === "admin-only"
      ? "An admin session is required before this page can continue."
      : "Complete the required account access step, and this page will continue automatically.";
  const action = canContinue
    ? `<a href="${next}" class="button button-small">Continue</a>`
    : "";
  const existing = document.getElementById("accountNextPathCallout");
  const markup = `
    <div class="card" id="accountNextPathCallout" style="margin: 0 0 1rem; border-color: ${canContinue ? "rgba(43, 122, 79, 0.28)" : "rgba(176, 138, 12, 0.28)"}; background: ${canContinue ? "rgba(240, 249, 242, 0.92)" : "rgba(255, 248, 230, 0.96)"};">
      <div style="display:flex;gap:0.75rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;">
        <div>
          <p class="eyebrow" style="margin-bottom:0.45rem;">Return Destination</p>
          <h3 style="margin:0 0 0.35rem;">${title}</h3>
          <p style="margin:0;color:var(--muted);">${body}</p>
        </div>
        ${action}
      </div>
    </div>
  `;
  if (existing) {
    existing.outerHTML = markup;
    return;
  }
  const anchor =
    document.querySelector(".dashboard-shell") ||
    document.querySelector("main") ||
    document.querySelector(".page-shell") ||
    document.body.firstElementChild ||
    document.body;
  if (!anchor) return;
  anchor.insertAdjacentHTML("afterbegin", markup);
}

function sessionCanContinueReason(session = currentSession, reason = queryParam("reason")) {
  if (!session?.email) return false;
  const normalizedReason = String(reason || "").trim().toLowerCase();
  if (!normalizedReason || normalizedReason === "login-required") return true;
  if (normalizedReason === "admin-only") return sessionIsAdminLike(session);
  if (normalizedReason === "workspace-locked") return sessionHasAccess(session);
  return true;
}

function maybeContinueToNextPath(session = currentSession) {
  const next = safeNextPath(queryParam("next") || "");
  if (!next) {
    clearNextPathCallout();
    return false;
  }
  renderNextPathCallout(session);
  if (!sessionCanContinueReason(session)) return false;
  return maybeRedirectToNextPath();
}

function workspaceHref(options = {}) {
  const params = new URLSearchParams();
  if (options.rent) params.set("rent", options.rent);
  if (options.report) params.set("report", options.report);
  if (options.requireAuth) params.set("auth", "required");
  const query = params.toString();
  return query ? `../toolbench/?${query}` : "../toolbench/";
}

function loadStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}.`, error);
    return fallback;
  }
}

function writeStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function recordActivity(label, detail) {
  const events = loadStoredJson(activityLogKey, []);
  events.unshift({
    label,
    detail,
    at: new Date().toISOString()
  });
  writeStoredJson(activityLogKey, events.slice(0, 20));
  renderActivityLog();
}

function money(value) {
  return `S$${Number(value).toFixed(2)} psf`;
}

function dollars(value) {
  return `S$${Math.round(Number(value)).toLocaleString("en-SG")}`;
}

function moneyRange(range) {
  if (!range) return "Not available";
  return `${money(range.low)}-${money(range.high)}`;
}

function comparableSeries(official, asking) {
  const labels = ["2021 Q1", "2021 Q3", "2022 Q1", "2022 Q3", "2023 Q1", "2023 Q3", "2024 Q1", "2024 Q3", "2025 Q1", "2025 Q3"];
  const officialCurve = [0.78, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1, 1.02];
  const askingCurve = [0.72, 0.75, 0.79, 0.84, 0.89, 0.93, 0.97, 1, 1, 1.03];
  return labels.map((label, index) => [
    label,
    Number((official * officialCurve[index]).toFixed(1)),
    Number((asking * askingCurve[index]).toFixed(1))
  ]);
}

function memberList() {
  const seededMembers = Array.isArray(window.RENTINTEL_MEMBERS?.members) ? window.RENTINTEL_MEMBERS.members : [];
  return [...loadStoredJson(joinedMembersKey, []), ...seededMembers];
}

function uniqueMemberList() {
  const seen = new Set();
  return memberList().filter((member) => {
    const email = normalizeEmail(member.email);
    if (seen.has(email)) return false;
    seen.add(email);
    return true;
  });
}

function memberRole(member = {}) {
  const role = String(member.role || "").toLowerCase();
  if (role === "admin") return "admin";
  return "member";
}

function isAdminMember(member = {}) {
  return memberRole(member) === "admin";
}

function memberRoleAuditLog() {
  return loadStoredJson(roleAuditLogKey, []);
}

function memberRoleAuditLogForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  const adminView = sessionCanEditFreshnessPolicy(currentSession);
  return memberRoleAuditLog()
    .filter((entry) => adminView || !entry.memberEmail || normalizeEmail(entry.memberEmail) === email)
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
}

function writeMemberRoleAuditLogForCurrentMember(rows) {
  const email = normalizeEmail(currentSession?.email);
  if (sessionCanEditFreshnessPolicy(currentSession)) {
    writeStoredJson(roleAuditLogKey, rows.slice(0, 400));
    return;
  }
  const remaining = memberRoleAuditLog().filter((entry) => normalizeEmail(entry.memberEmail || email) !== email);
  writeStoredJson(roleAuditLogKey, [...rows, ...remaining].slice(0, 400));
}

function pushMemberRoleAuditEvent(entry) {
  if (!entry) return;
  const events = memberRoleAuditLogForCurrentMember();
  events.unshift({
    id: `member-role-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    memberEmail: normalizeEmail(currentSession?.email),
    actorEmail: normalizeEmail(currentSession?.email) || "local-prototype",
    at: new Date().toISOString(),
    ...entry
  });
  writeMemberRoleAuditLogForCurrentMember(events.slice(0, 200));
}

async function hydrateMemberRegistryAndRoleAudit() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchRoleAudit) return false;
  const result = await window.RentIntelAuth.fetchRoleAudit();
  if (!result.ok) return false;
  if (Array.isArray(result.data?.members) && result.data.members.length) {
    writeStoredJson(joinedMembersKey, result.data.members.map((member) => ({
      ...member,
      email: normalizeEmail(member.email)
    })));
  }
  if (Array.isArray(result.data?.roleAuditLog)) {
    writeMemberRoleAuditLogForCurrentMember(result.data.roleAuditLog);
  }
  renderMemberRegistry();
  renderMemberRoleAuditLog();
  return true;
}

function coveragePrototypeRecords() {
  return loadStoredJson(coverageRecordsKey, []).filter((record) =>
    record?.id && record?.title && Array.isArray(record?.aliases) && !isInvalidCoverageRecord(record)
  );
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Pulau Tekong is outside RentIntel's retail-rent coverage scope.",
      action: "Do not create HDB-retail or shop-rent samples for this location."
    };
  }
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Offshore and special-use islands are not eligible for prototype retail coverage.",
      action: "Keep the request out of public samples until a real classified commercial source exists."
    };
  }
  if (text.includes("farm") && text.includes("hdb retail")) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "Farm and HDB retail are conflicting property classifications.",
      action: "Ask for the correct retail property type before a coverage sample is created."
    };
  }
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) {
    return {
      status: "blocked",
      eligible: false,
      requestable: false,
      sampleAllowed: false,
      reason: "The area and HDB retail property type do not fit together.",
      action: "Use mall, shophouse, or neighbourhood shop where that better matches the location."
    };
  }
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) {
    return {
      status: "manual",
      eligible: false,
      requestable: true,
      sampleAllowed: false,
      reason: "This search needs manual review because it is outside standard retail coverage.",
      action: "Queue it for manual source classification before any sample answer is created."
    };
  }
  return {
    status: "eligible",
    eligible: true,
    requestable: true,
    sampleAllowed: true,
    reason: "Eligible for coverage review.",
    action: "Review benchmark fit, property type, and asking-rent source availability."
  };
}

function isInvalidCoverageText(value = "") {
  return coverageEligibilityProfile(value).status === "blocked";
}

function isInvalidCoverageCandidate(candidate = {}) {
  return isInvalidCoverageText([
    candidate.requestedQuery,
    candidate.requestedArea,
    candidate.requestedPropertyType,
    candidate.name
  ].filter(Boolean).join(" "));
}

function coverageEligibilityForCandidate(candidate = {}) {
  const profile = coverageEligibilityProfile([
    candidate.requestedQuery,
    candidate.requestedArea,
    candidate.requestedPropertyType,
    candidate.name
  ].filter(Boolean).join(" "));
  if (profile.status === "manual" && classificationAllowsSample(candidate.sourceClassification || "")) {
    return {
      ...profile,
      status: "eligible",
      eligible: true,
      requestable: true,
      sampleAllowed: true,
      reason: `${classificationLabel(candidate.sourceClassification)} classification approved for retail coverage.`,
      action: "Complete QA decision before creating a sample."
    };
  }
  return profile;
}

function isInvalidCoverageRecord(record = {}) {
  return isInvalidCoverageText([
    record.id,
    record.title,
    record.area,
    record.propertyType,
    ...(Array.isArray(record.aliases) ? record.aliases : [])
  ].filter(Boolean).join(" "));
}

function sanitizeCoverageStorage() {
  const records = loadStoredJson(coverageRecordsKey, []);
  const cleanRecords = records.filter((record) => !isInvalidCoverageRecord(record));
  if (cleanRecords.length !== records.length) writeStoredJson(coverageRecordsKey, cleanRecords);

  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const cleanCandidates = candidates.filter((candidate) => !isInvalidCoverageCandidate(candidate));
  if (cleanCandidates.length !== candidates.length) writeStoredJson(askingSourceCandidatesKey, cleanCandidates);
}

function mergeAskingRentFeed(records) {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const feedRecords = Array.isArray(feed?.records) ? feed.records : [];
  if (!feedRecords.length) return records;
  const byRecordId = new Map(feedRecords.map((item) => [item.recordId, item]));
  return records.map((record) => {
    const asking = byRecordId.get(record.id);
    if (!asking) return record;
    const official = Number(record.official);
    const askingValue = Number(asking.asking);
    const gap = official ? Math.round(((askingValue - official) / official) * 100) : record.gap;
    const series = Array.isArray(record.series)
      ? record.series.map((point, index, list) =>
          index === list.length - 1 && Number.isFinite(Number(asking.latestAskingMedian))
            ? [point[0], point[1], Number(asking.latestAskingMedian)]
            : point
        )
      : record.series;
    const feedSummary = `Asking feed: ${feed.sourceName || "pilot asking feed"} (${asking.listingCount || 0} checks, ${asking.freshness || "pilot"}, ${asking.capturedAt || feed.updatedAt}).`;
    return {
      ...record,
      asking: askingValue,
      fairRange: asking.fairRange || record.fairRange,
      gap,
      series,
      askingSourceStatus: feed.connectionState || "pilot-manual-feed-connected",
      askingSource: {
        sourceName: feed.sourceName || "",
        sourceType: feed.sourceType || "",
        listingCount: asking.listingCount || 0,
        capturedAt: asking.capturedAt || feed.updatedAt || "",
        productionReady: Boolean(feed.productionReady),
        note: asking.note || feed.note || ""
      },
      sourceSummary: `${record.sourceSummary} ${feedSummary}`
    };
  });
}

function rentRecordList() {
  const records = Array.isArray(window.RENTINTEL_SAMPLE_DATA?.records) ? window.RENTINTEL_SAMPLE_DATA.records : [];
  const merged = new Map();
  mergeAskingRentFeed(records).forEach((record) => merged.set(record.id, record));
  coveragePrototypeRecords().forEach((record) => merged.set(record.id, record));
  return [...merged.values()];
}

function sourceStatusList() {
  return Array.isArray(window.RENTINTEL_SOURCE_STATUS?.status) ? window.RENTINTEL_SOURCE_STATUS.status : [];
}

function formatShortDate(value) {
  if (!value) return "Not connected";
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatDateTime(value) {
  if (!value) return "Not logged";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });
}

function defaultFreshnessPolicy() {
  return {
    freshMaxDays: 7,
    watchMaxDays: 14,
    updatedAt: "",
    updatedBy: ""
  };
}

function freshnessPolicy() {
  const stored = loadStoredJson(freshnessPolicyKey, defaultFreshnessPolicy()) || {};
  const freshMaxDays = Math.max(1, Math.min(60, Number(stored.freshMaxDays) || 7));
  const watchCandidate = Math.max(freshMaxDays + 1, Number(stored.watchMaxDays) || 14);
  const watchMaxDays = Math.max(freshMaxDays + 1, Math.min(90, watchCandidate));
  return {
    freshMaxDays,
    watchMaxDays,
    updatedAt: stored.updatedAt || "",
    updatedBy: stored.updatedBy || ""
  };
}

function writeFreshnessPolicy(policy) {
  writeStoredJson(freshnessPolicyKey, {
    ...freshnessPolicy(),
    ...policy
  });
}

async function hydrateSourceSyncState() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchSourceSyncSchedule) return false;
  const result = await window.RentIntelAuth.fetchSourceSyncSchedule();
  if (!result.ok) return false;
  if (result.data?.syncSchedule && typeof result.data.syncSchedule === "object") {
    writeStoredJson(sourceSyncAutomationKey, {
      ...defaultSourceSyncAutomation(),
      ...result.data.syncSchedule
    });
  }
  if (result.data?.freshnessPolicy && typeof result.data.freshnessPolicy === "object") {
    writeStoredJson(freshnessPolicyKey, {
      ...defaultFreshnessPolicy(),
      ...result.data.freshnessPolicy
    });
  }
  renderSourceSyncPipeline();
  renderSourceStatus();
  renderMemberCommandCenter();
  return true;
}

async function persistSourceSyncAutomationState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveSourceSyncSchedule) return false;
  const result = await window.RentIntelAuth.saveSourceSyncSchedule(next);
  return Boolean(result.ok && result.data?.syncSchedule);
}

async function persistFreshnessPolicyState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveFreshnessPolicy) return false;
  const result = await window.RentIntelAuth.saveFreshnessPolicy(next);
  return Boolean(result.ok && result.data?.freshnessPolicy);
}

async function persistSourceSyncRunState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveSourceSyncRun) return false;
  const result = await window.RentIntelAuth.saveSourceSyncRun(next);
  return Boolean(result.ok && result.data?.syncRun);
}

async function persistFreshnessBreachState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveFreshnessBreachEvent) return false;
  const result = await window.RentIntelAuth.saveFreshnessBreachEvent(next);
  return Boolean(result.ok && result.data?.breachEvent);
}

function upsertAskingSourceCandidateLocal(candidate) {
  if (!candidate || !candidate.name) return candidate;
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const existingIndex = candidates.findIndex((entry) =>
    (candidate.id && entry.id === candidate.id) ||
    (String(entry.type || "").trim().toLowerCase() === String(candidate.type || "").trim().toLowerCase() &&
      String(entry.name || entry.requestedQuery || "").trim().toLowerCase() === String(candidate.name || candidate.requestedQuery || "").trim().toLowerCase())
  );
  if (existingIndex >= 0) candidates[existingIndex] = candidate;
  else candidates.unshift(candidate);
  writeStoredJson(askingSourceCandidatesKey, candidates.slice(0, 50));
  return candidate;
}

function writeCoverageSampleRecordsLocal(sampleRecords = []) {
  const rows = Array.isArray(sampleRecords) ? sampleRecords : [];
  const normalized = rows
    .map((entry) => entry?.samplePayload && typeof entry.samplePayload === "object"
      ? entry.samplePayload
      : entry)
    .filter((entry) => entry && entry.id);
  writeStoredJson(coverageRecordsKey, normalized.slice(0, 50));
}

function applyProductionEvidencePackageLocal(productionEvidenceRecord = {}) {
  if (!productionEvidenceRecord || typeof productionEvidenceRecord !== "object") return;
  if (!Object.keys(productionEvidenceRecord).length) {
    localStorage.removeItem(productionEvidenceKey);
    localStorage.removeItem(productionReleaseLogKey);
    return;
  }
  const {
    releaseLog,
    sourceName,
    sourceType,
    sourceAttachedAt,
    qaLogAt,
    ownerReviewedAt,
    submittedBy,
    submittedAt,
    updatedAt
  } = productionEvidenceRecord;
  writeProductionEvidence({
    ...productionEvidenceRecord,
    sourceName: sourceName || "",
    sourceType: sourceType || "",
    sourceAttachedAt: sourceAttachedAt || "",
    qaLogAt: qaLogAt || "",
    ownerReviewedAt: ownerReviewedAt || "",
    submittedBy: submittedBy || "",
    submittedAt: submittedAt || "",
    updatedAt: updatedAt || ""
  });
  if (releaseLog && typeof releaseLog === "object") {
    writeProductionReleaseLog(releaseLog);
  }
}

async function hydrateSourceReviewState() {
  if (!currentSession?.email) return false;
  let loaded = false;
  if (window.RentIntelAuth?.fetchSourceCandidates) {
    const result = await window.RentIntelAuth.fetchSourceCandidates();
    if (result.ok && Array.isArray(result.data?.candidates)) {
      writeStoredJson(askingSourceCandidatesKey, result.data.candidates.slice(0, 50));
      if (Array.isArray(result.data?.sampleRecords)) {
        writeCoverageSampleRecordsLocal(result.data.sampleRecords);
      }
      loaded = true;
    }
  }
  if (window.RentIntelAuth?.fetchProductionEvidence) {
    const result = await window.RentIntelAuth.fetchProductionEvidence();
    if (result.ok && result.data?.productionEvidence && typeof result.data.productionEvidence === "object") {
      applyProductionEvidencePackageLocal(result.data.productionEvidence);
      loaded = true;
    }
  }
  renderAskingSourceCandidates();
  renderCoverageRequests();
  renderManualReviewQueue();
  renderAccountSourceQa();
  renderSourceStatus();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
  return loaded;
}

async function persistSourceCandidateState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveSourceCandidate) return null;
  const result = await window.RentIntelAuth.saveSourceCandidate(next);
  return result.ok && result.data?.candidate ? result.data.candidate : null;
}

async function persistCoverageClassificationState(candidateId, next) {
  if (!currentSession?.email || !window.RentIntelAuth?.classifyCoverageRequest) return null;
  const result = await window.RentIntelAuth.classifyCoverageRequest(candidateId, next);
  return result.ok && result.data?.candidate ? result.data.candidate : null;
}

async function persistCoverageQaDecisionState(candidateId, next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveCoverageQaDecision) return null;
  const result = await window.RentIntelAuth.saveCoverageQaDecision(candidateId, next);
  return result.ok && result.data?.candidate ? result.data.candidate : null;
}

async function persistCoverageSampleRecordState(candidateId, next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveCoverageSampleRecord) return null;
  const result = await window.RentIntelAuth.saveCoverageSampleRecord(candidateId, next);
  return result.ok && result.data ? result.data : null;
}

async function persistProductionEvidenceState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveProductionEvidence) return null;
  const result = await window.RentIntelAuth.saveProductionEvidence(next);
  return result.ok && result.data?.productionEvidence ? result.data.productionEvidence : null;
}

async function hydrateBackendHandoffAuditState() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchBackendHandoffAudit) return false;
  const result = await window.RentIntelAuth.fetchBackendHandoffAudit();
  const latestAudit = result.ok ? result.data?.latestAudit : null;
  if (!latestAudit || typeof latestAudit !== "object") return false;
  const packagePayload = latestAudit.payload && typeof latestAudit.payload === "object" ? latestAudit.payload : null;
  const memberPayload = packagePayload?.memberPayload && typeof packagePayload.memberPayload === "object"
    ? packagePayload.memberPayload
    : null;
  if (memberPayload && accountEl.backendPayloadText) {
    const text = JSON.stringify(memberPayload, null, 2);
    accountEl.backendPayloadText.value = text;
    accountEl.backendPayloadSummary.textContent =
      `${memberPayload.reports?.length || 0} reports | ${memberPayload.watchlist?.length || 0} watch | ${memberPayload.alertRules?.length || 0} rules | ` +
      `${memberPayload.alertDeliveries?.length || 0} deliveries | ${memberPayload.alertDeliveryAdminLog?.length || 0} admin actions | ` +
      `${memberPayload.memberRoleAuditLog?.length || 0} role events`;
  }
  if (packagePayload && accountEl.backendPackageText) {
    const packageText = JSON.stringify(packagePayload, null, 2);
    const byteCount = new Blob([packageText]).size;
    accountEl.backendPackageText.value = packageText;
    accountEl.backendPackageSummary.textContent =
      `${packagePayload.readiness?.coverage?.total || 0} coverage | ${packagePayload.readiness?.sourceSyncRuns || 0} sync runs | ${byteCount.toLocaleString("en-SG")} bytes`;
  }
  if (Array.isArray(latestAudit.validationRows)) {
    renderBackendValidation(latestAudit.validationRows);
  }
  accountEl.backendHandoffStatus.textContent = latestAudit.reviewedAt
    ? `Latest backend handoff audit restored. Reviewed ${formatDateTime(latestAudit.reviewedAt)}.`
    : `Latest backend handoff audit restored from ${formatDateTime(latestAudit.generatedAt)}.`;
  return true;
}

async function persistBackendHandoffAuditState(next) {
  if (!currentSession?.email || !window.RentIntelAuth?.saveBackendHandoffAudit) return null;
  const result = await window.RentIntelAuth.saveBackendHandoffAudit(next);
  return result.ok && result.data?.handoffAudit ? result.data.handoffAudit : null;
}

function applyAskingFeedState(feed) {
  if (!feed || typeof feed !== "object") return false;
  window.RENTINTEL_ASKING_RENT_FEED = feed;
  renderSourceStatus();
  renderTodayBrief();
  renderAccountSourceQa();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
  return true;
}

async function hydrateAskingFeedState() {
  if (!window.RentIntelAuth?.fetchAskingFeed) return false;
  const result = await window.RentIntelAuth.fetchAskingFeed();
  if (!result.ok || !result.data?.feed) return false;
  return applyAskingFeedState(result.data.feed);
}

async function refreshAskingFeedState() {
  if (!currentSession?.email || !window.RentIntelAuth?.refreshAskingFeed) return null;
  const result = await window.RentIntelAuth.refreshAskingFeed();
  if (!result.ok || !result.data?.feed) return null;
  applyAskingFeedState(result.data.feed);
  return result.data.feed;
}

function freshnessPolicySummaryText(policy = freshnessPolicy()) {
  const freshUpper = Number(policy.freshMaxDays);
  const watchUpper = Number(policy.watchMaxDays);
  return `Fresh <=${freshUpper} days | Watch ${freshUpper + 1}-${watchUpper} days | Stale >${watchUpper} days`;
}

function sourceFreshnessProfile(value) {
  const policy = freshnessPolicy();
  const freshMaxDays = Number(policy.freshMaxDays);
  const watchMaxDays = Number(policy.watchMaxDays);
  const watchLower = freshMaxDays + 1;
  if (!value) {
    return {
      state: "stale",
      label: "Stale",
      detail: "No captured date is connected.",
      days: null
    };
  }
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      state: "stale",
      label: "Stale",
      detail: "Captured date format is invalid.",
      days: null
    };
  }
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days <= freshMaxDays) {
    return {
      state: "fresh",
      label: "Fresh",
      detail: `${days} day${days === 1 ? "" : "s"} since latest capture (SLA <= ${freshMaxDays} days).`,
      days
    };
  }
  if (days <= watchMaxDays) {
    return {
      state: "watch",
      label: "Watch",
      detail: `${days} days since latest capture (SLA watch: ${watchLower}-${watchMaxDays} days).`,
      days
    };
  }
  return {
    state: "stale",
    label: "Stale",
    detail: `${days} days since latest capture (SLA stale: >${watchMaxDays} days).`,
    days
  };
}

function askingFeedQaSummary() {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const records = Array.isArray(feed?.records) ? feed.records : [];
  const latestCapturedAt = records
    .map((record) => record.capturedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || feed?.updatedAt || "";
  const review = askingFeedQaReview();
  const totalChecks = records.reduce((sum, record) => {
    const extraChecks = Number(review[record.recordId]?.extraChecks) || 0;
    return sum + (Number(record.listingCount) || 0) + extraChecks;
  }, 0);
  const productionReady = Boolean(feed?.productionReady);
  const freshness = sourceFreshnessProfile(latestCapturedAt);
  return {
    title: feed?.sourceName || "No asking feed connected",
    records: records.length,
    checks: totalChecks,
    captured: formatShortDate(latestCapturedAt),
    freshnessState: freshness.state,
    freshnessLabel: freshness.label,
    freshnessDetail: freshness.detail,
    production: productionReady ? "Ready" : "Not ready",
    ready: productionReady,
    next: productionReady
      ? `${freshness.detail} Production asking feed is marked ready. Keep daily ingestion logs, variance checks, and source exception alerts active.`
      : `${freshness.detail} Manual pilot asking feed is connected. Replace it with licensed feed, agent input, tenant input, or verified daily capture workflow plus QA logs.`
  };
}

function askingFeedQaReview() {
  return loadStoredJson(askingFeedQaReviewKey, {});
}

function writeAskingFeedQaReview(review) {
  writeStoredJson(askingFeedQaReviewKey, review);
}

function productionEvidence() {
  return loadStoredJson(productionEvidenceKey, {});
}

function writeProductionEvidence(evidence) {
  writeStoredJson(productionEvidenceKey, evidence);
}

function productionEvidenceReady(evidence = productionEvidence()) {
  return Boolean(evidence.sourceName && evidence.sourceAttachedAt && evidence.qaLogAt && evidence.ownerReviewedAt);
}

function productionReleaseLog() {
  return loadStoredJson(productionReleaseLogKey, {
    status: "Not released",
    queuedAt: "",
    releasedAt: "",
    releasedBy: "",
    releaseNote: "",
    rollbackAt: "",
    rollbackReason: "",
    sourceName: "",
    updatedAt: ""
  });
}

function writeProductionReleaseLog(log) {
  writeStoredJson(productionReleaseLogKey, {
    status: "Not released",
    queuedAt: "",
    releasedAt: "",
    releasedBy: "",
    releaseNote: "",
    rollbackAt: "",
    rollbackReason: "",
    sourceName: "",
    updatedAt: "",
    ...log
  });
}

function askingFeedQaRows() {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const feedRecords = Array.isArray(feed?.records) ? feed.records : [];
  const records = rentRecordList();
  const review = askingFeedQaReview();
  return feedRecords.map((feedRecord) => {
    const record = records.find((item) => item.id === feedRecord.recordId);
    const official = Number(record?.official) || 0;
    const asking = Number(feedRecord.asking) || Number(record?.asking) || 0;
    const gap = official ? Math.round(((asking - official) / official) * 100) : 0;
    const rowReview = review[feedRecord.recordId] || {};
    const checks = (Number(feedRecord.listingCount) || 0) + (Number(rowReview.extraChecks) || 0);
    const varianceReviewed = Boolean(rowReview.varianceReviewedAt);
    const capturedAt = feedRecord.capturedAt || feed?.updatedAt || "";
    const freshness = sourceFreshnessProfile(capturedAt);
    const status = checks < 5
      ? "Needs more checks"
      : gap >= 25 && !varianceReviewed
        ? "High variance"
        : "Review pass";
    return {
      recordId: feedRecord.recordId,
      title: record?.title || feedRecord.recordId,
      official,
      asking,
      gap,
      checks,
      captured: formatShortDate(capturedAt),
      freshnessState: freshness.state,
      freshnessLabel: freshness.label,
      freshnessDetail: freshness.detail,
      status,
      varianceReviewed,
      note: feedRecord.note || "No QA note."
    };
  });
}

function askingFeedReadinessGate() {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const policy = freshnessPolicy();
  const evidence = productionEvidence();
  const evidenceReady = productionEvidenceReady(evidence);
  const rows = askingFeedQaRows();
  const latestCapturedAt = Array.isArray(feed?.records)
    ? feed.records.map((record) => record.capturedAt).filter(Boolean).sort().at(-1)
    : "";
  const latestDate = latestCapturedAt ? new Date(`${latestCapturedAt}T00:00:00+08:00`) : null;
  const daysOld = latestDate && !Number.isNaN(latestDate.getTime())
    ? Math.floor((Date.now() - latestDate.getTime()) / 86400000)
    : null;
  const lowCheckRows = rows.filter((row) => row.checks < 5);
  const highVarianceRows = rows.filter((row) => row.status === "High variance");
  const checks = [
    {
      label: "Feed connected",
      pass: Boolean(feed?.connectionState && rows.length),
      detail: rows.length ? `${rows.length} pilot records loaded` : "No asking feed records loaded"
    },
    {
      label: "Minimum asking checks",
      pass: !lowCheckRows.length && rows.length > 0,
      detail: lowCheckRows.length
        ? `${lowCheckRows.length} row needs at least 5 checks`
        : "Every row has at least 5 checks"
    },
    {
      label: "Variance review",
      pass: !highVarianceRows.length,
      detail: highVarianceRows.length
        ? `${highVarianceRows.length} high-variance row needs manual review`
        : "No high-variance rows"
    },
    {
      label: "Freshness",
      pass: daysOld !== null && daysOld <= policy.freshMaxDays,
      detail: daysOld === null
        ? "No capture date"
        : `${daysOld} day${daysOld === 1 ? "" : "s"} since latest capture (Fresh <= ${policy.freshMaxDays} days)`
    },
    {
      label: "Production source contract",
      pass: Boolean(feed?.productionReady) || evidenceReady,
      detail: feed?.productionReady
        ? "Production source marked ready"
        : evidenceReady
          ? `${evidence.sourceName} evidence attached for backend persistence`
          : "Pilot manual feed still needs licensed feed or verified daily capture workflow"
    }
  ];
  const passed = checks.filter((check) => check.pass).length;
  return {
    ready: passed === checks.length,
    passed,
    total: checks.length,
    checks
  };
}

function askingFeedProductionTasks() {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const policy = freshnessPolicy();
  const evidence = productionEvidence();
  const rows = askingFeedQaRows();
  const gate = askingFeedReadinessGate();
  const lowCheckRows = rows.filter((row) => row.checks < 5);
  const highVarianceRows = rows.filter((row) => row.status === "High variance");
  const tasks = [];

  if (!rows.length) {
    tasks.push("Load at least one asking-rent feed row before production review.");
  }

  lowCheckRows.forEach((row) => {
    tasks.push(`Add ${5 - row.checks} more verified asking check${5 - row.checks === 1 ? "" : "s"} for ${row.title}.`);
  });

  if (highVarianceRows.length) {
    tasks.push(`Manually review high-variance rows: ${highVarianceRows.map((row) => row.title).join(", ")}.`);
  }

  const freshnessCheck = gate.checks.find((check) => check.label === "Freshness");
  if (freshnessCheck && !freshnessCheck.pass) {
    tasks.push(`Refresh the asking feed capture date so the latest source check is within ${policy.freshMaxDays} days.`);
  }

  if (!feed?.productionReady && !evidence.sourceName) {
    tasks.push("Replace the manual pilot feed with a licensed listing feed, verified agent input, tenant input, or controlled daily capture workflow.");
  }

  if (!feed?.productionReady && !evidence.qaLogAt) {
    tasks.push("Attach daily ingestion QA logs, variance exception alerts, and source-owner review before setting productionReady.");
  }

  if (!feed?.productionReady && evidence.sourceName && evidence.qaLogAt && !evidence.ownerReviewedAt) {
    tasks.push("Record source-owner review before backend can persist production source evidence.");
  }

  if (gate.ready) {
    tasks.push("Persist the production source evidence in the backend, then set productionReady through controlled release.");
  }

  return {
    ready: gate.ready,
    summary: gate.ready
      ? "Ready for source-owner approval"
      : `${tasks.length} production handoff task${tasks.length === 1 ? "" : "s"}`,
    tasks
  };
}

function productionOpsReview() {
  const evidence = productionEvidence();
  const gate = askingFeedReadinessGate();
  const checks = [
    {
      label: "Source attached",
      pass: Boolean(evidence.sourceName && evidence.sourceAttachedAt),
      detail: evidence.sourceName || "No production source attached"
    },
    {
      label: "QA log recorded",
      pass: Boolean(evidence.qaLogAt),
      detail: evidence.qaLogAt ? formatShortDate(evidence.qaLogAt) : "No QA log recorded"
    },
    {
      label: "Source-owner reviewed",
      pass: Boolean(evidence.ownerReviewedAt),
      detail: evidence.ownerReviewedAt ? formatShortDate(evidence.ownerReviewedAt) : "No source-owner review"
    }
  ];
  const evidencePassed = checks.filter((check) => check.pass).length;
  const gateBlockers = gate.checks.filter((check) => !check.pass).map((check) => `${check.label}: ${check.detail}`);
  const evidenceBlockers = checks.filter((check) => !check.pass).map((check) => `${check.label}: ${check.detail}`);
  const blockers = [...evidenceBlockers, ...gateBlockers];

  if (gate.ready) {
    return {
      state: "release",
      stage: "Ready for Controlled Release",
      summary: "All production source checks have passed. Persist the evidence server-side, verify ingestion scheduling, then set productionReady.",
      decision: "Approve",
      action: "Generate backend payload and SQL seed, write production evidence, then release productionReady through backend controls.",
      evidencePassed,
      evidenceTotal: checks.length,
      gatePassed: gate.passed,
      gateTotal: gate.total,
      blockers: ["No blockers. Controlled release can proceed after backend persistence is confirmed."]
    };
  }

  if (evidence.sourceName && evidence.qaLogAt && !evidence.ownerReviewedAt) {
    return {
      state: "owner-review",
      stage: "Ready for Owner Review",
      summary: "Source evidence and QA log are present. Source-owner review is the next approval step.",
      decision: "Review",
      action: "Complete source-owner review, then rerun the readiness gate before release.",
      evidencePassed,
      evidenceTotal: checks.length,
      gatePassed: gate.passed,
      gateTotal: gate.total,
      blockers
    };
  }

  if (productionEvidenceReady(evidence) && !gate.ready) {
    return {
      state: "qa-blocked",
      stage: "QA Blocked",
      summary: "Production evidence is complete, but the asking-feed QA gate still has unresolved blockers.",
      decision: "Hold",
      action: "Resolve the failed QA gate checks before backend release.",
      evidencePassed,
      evidenceTotal: checks.length,
      gatePassed: gate.passed,
      gateTotal: gate.total,
      blockers
    };
  }

  if (evidence.sourceName) {
    return {
      state: "evidence-draft",
      stage: "Evidence Draft",
      summary: "A production source has been attached, but the QA log and source-owner review are not complete.",
      decision: "Hold",
      action: evidence.qaLogAt ? "Record source-owner review." : "Record the QA log for this production source.",
      evidencePassed,
      evidenceTotal: checks.length,
      gatePassed: gate.passed,
      gateTotal: gate.total,
      blockers
    };
  }

  return {
    state: "draft",
    stage: "Draft",
    summary: "Production evidence has not been attached yet.",
    decision: "Hold",
    action: "Attach a production asking-rent source before review.",
    evidencePassed,
    evidenceTotal: checks.length,
    gatePassed: gate.passed,
    gateTotal: gate.total,
    blockers
  };
}

function productionReleaseLogPackage() {
  const log = productionReleaseLog();
  const review = productionOpsReview();
  const evidence = productionEvidence();
  const canRelease = review.state === "release";
  const status = log.status || "Not released";
  const timestamp = status === "Rolled back"
    ? log.rollbackAt
    : status === "Released"
      ? log.releasedAt
      : status === "Release queued"
        ? log.queuedAt
        : "";

  if (status === "Rolled back") {
    return {
      ...log,
      state: "rolled-back",
      status,
      timestamp,
      summary: `Production release rolled back${log.rollbackReason ? `: ${log.rollbackReason}` : "."}`,
      nextAction: "Review rollback reason, restore source QA evidence, and queue a corrected release."
    };
  }

  if (status === "Released") {
    return {
      ...log,
      state: "released",
      status,
      timestamp,
      summary: `${log.sourceName || evidence.sourceName || "Production source"} released to production.`,
      nextAction: "Monitor scheduled ingestion, exception alerts, and first production benchmark comparison."
    };
  }

  if (status === "Release queued") {
    return {
      ...log,
      state: "queued",
      status,
      timestamp,
      summary: `${log.sourceName || evidence.sourceName || "Production source"} is queued for controlled release.`,
      nextAction: "Mark released only after backend persistence and productionReady deployment are confirmed."
    };
  }

  return {
    ...log,
    state: canRelease ? "ready" : "blocked",
    status: "Not released",
    timestamp: "",
    sourceName: evidence.sourceName || log.sourceName || "",
    summary: canRelease
      ? "Ops Review is approved. Queue the controlled release after backend persistence is generated."
      : "Release is blocked until Ops Review reaches Ready for Controlled Release.",
    nextAction: canRelease
      ? "Queue release with a short note."
      : review.action
  };
}

function sourceExceptionAlerts() {
  const feed = window.RENTINTEL_ASKING_RENT_FEED;
  const rows = askingFeedQaRows();
  const gate = askingFeedReadinessGate();
  const evidence = productionEvidence();
  const release = productionReleaseLog();
  const alerts = [];
  const latestCapturedAt = Array.isArray(feed?.records)
    ? feed.records.map((record) => record.capturedAt).filter(Boolean).sort().at(-1)
    : "";
  const latestDate = latestCapturedAt ? new Date(`${latestCapturedAt}T00:00:00+08:00`) : null;
  const daysOld = latestDate && !Number.isNaN(latestDate.getTime())
    ? Math.floor((Date.now() - latestDate.getTime()) / 86400000)
    : null;

  if (!feed?.connectionState || !rows.length) {
    alerts.push({
      code: "feed-not-connected",
      severity: "critical",
      title: "Asking feed not connected",
      detail: "No asking-rent feed records are available for QA.",
      action: "Connect source records before any production review.",
      source: feed?.sourceName || "asking-rent-feed",
      recordId: ""
    });
  }

  if (daysOld === null || daysOld > 7) {
    alerts.push({
      code: "stale-feed",
      severity: daysOld === null || daysOld > 14 ? "critical" : "watch",
      title: "Feed freshness exception",
      detail: daysOld === null ? "No latest capture date found." : `${daysOld} days since latest asking-rent capture.`,
      action: "Refresh the asking-rent capture and rerun QA before release.",
      source: feed?.sourceName || "asking-rent-feed",
      recordId: ""
    });
  }

  rows.filter((row) => row.checks < 5).forEach((row) => {
    alerts.push({
      code: "low-check-count",
      severity: "watch",
      title: "Minimum checks not met",
      detail: `${row.title} has ${row.checks}/5 asking checks.`,
      action: `Add ${5 - row.checks} verified asking check${5 - row.checks === 1 ? "" : "s"} for ${row.title}.`,
      source: feed?.sourceName || "asking-rent-feed",
      recordId: row.recordId
    });
  });

  rows.filter((row) => row.status === "High variance").forEach((row) => {
    alerts.push({
      code: "high-variance",
      severity: "critical",
      title: "High variance needs review",
      detail: `${row.title} has a ${row.gap > 0 ? "+" : ""}${row.gap}% asking gap.`,
      action: "Mark variance reviewed or adjust source classification before release.",
      source: feed?.sourceName || "asking-rent-feed",
      recordId: row.recordId
    });
  });

  if (evidence.sourceName && !productionEvidenceReady(evidence)) {
    alerts.push({
      code: "production-evidence-incomplete",
      severity: "watch",
      title: "Production evidence incomplete",
      detail: `${evidence.sourceName} is attached but QA log or source-owner review is missing.`,
      action: "Complete QA log and owner review.",
      source: evidence.sourceName,
      recordId: ""
    });
  }

  gate.checks.filter((check) => !check.pass).forEach((check) => {
    if (alerts.some((alert) => alert.detail === check.detail || alert.title === check.label)) return;
    alerts.push({
      code: `gate-${slugify(check.label)}`,
      severity: check.label === "Production source contract" ? "critical" : "watch",
      title: `${check.label} blocker`,
      detail: check.detail,
      action: "Resolve this readiness gate item before controlled release.",
      source: feed?.sourceName || evidence.sourceName || "asking-rent-feed",
      recordId: ""
    });
  });

  if (release.status === "Rolled back") {
    alerts.push({
      code: "release-rolled-back",
      severity: "critical",
      title: "Production release rolled back",
      detail: release.rollbackReason || "Rollback reason not specified.",
      action: "Review rollback reason, restore QA evidence, and queue a corrected release.",
      source: release.sourceName || evidence.sourceName || "production-source",
      recordId: ""
    });
  } else if (release.status === "Released" && !feed?.productionReady) {
    alerts.push({
      code: "released-before-feed-flag",
      severity: "watch",
      title: "Release logged before feed flag",
      detail: "Release log is marked live, but the asking feed is still not marked productionReady.",
      action: "Confirm backend deployment and update productionReady once ingestion is live.",
      source: release.sourceName || evidence.sourceName || "production-source",
      recordId: ""
    });
  }

  const critical = alerts.filter((alert) => alert.severity === "critical").length;
  const watch = alerts.filter((alert) => alert.severity === "watch").length;
  return {
    generatedAt: new Date().toISOString(),
    status: critical ? "critical" : watch ? "watch" : "clear",
    critical,
    watch,
    total: alerts.length,
    alerts
  };
}

function sourceAdminQueueRows() {
  const evidence = productionEvidence();
  const review = productionOpsReview();
  const release = productionReleaseLogPackage();
  const exceptions = sourceExceptionAlerts();
  const sourceName = evidence.sourceName ||
    window.RENTINTEL_ASKING_RENT_FEED?.sourceName ||
    "Asking-rent source";
  const rows = [];

  exceptions.alerts.forEach((alert) => {
    rows.push({
      group: "Exception",
      priority: alert.severity === "critical" ? "P0" : "P1",
      sourceName: alert.source || sourceName,
      stage: alert.title,
      nextAction: alert.action
    });
  });

  if (!evidence.sourceName || !evidence.qaLogAt) {
    rows.push({
      group: "Needs QA",
      priority: "P1",
      sourceName,
      stage: evidence.sourceName ? "QA log pending" : "Source evidence pending",
      nextAction: evidence.sourceName ? "Record production QA log." : "Attach production source evidence."
    });
  } else if (!evidence.ownerReviewedAt) {
    rows.push({
      group: "Owner Review",
      priority: "P1",
      sourceName,
      stage: "Owner review pending",
      nextAction: "Complete source-owner review."
    });
  }

  if (review.state === "release" && release.status === "Not released") {
    rows.push({
      group: "Ready for Release",
      priority: "P0",
      sourceName,
      stage: "Ops Review approved",
      nextAction: "Queue controlled release after backend persistence."
    });
  }

  if (release.status === "Release queued") {
    rows.push({
      group: "Ready for Release",
      priority: "P0",
      sourceName,
      stage: "Release queued",
      nextAction: "Mark released after productionReady deployment is confirmed."
    });
  }

  if (release.status === "Released") {
    rows.push({
      group: "Released / Monitor",
      priority: exceptions.total ? "P1" : "P2",
      sourceName,
      stage: "Production release logged",
      nextAction: "Monitor ingestion, exception alerts, and first production comparison."
    });
  }

  const unique = new Map();
  rows.forEach((row) => {
    const key = `${row.group}:${row.sourceName}:${row.stage}:${row.nextAction}`;
    if (!unique.has(key)) unique.set(key, row);
  });
  return [...unique.values()].sort((a, b) => {
    const order = { P0: 0, P1: 1, P2: 2 };
    return order[a.priority] - order[b.priority] || a.group.localeCompare(b.group);
  });
}

function sourceHistoryEvents() {
  const evidence = productionEvidence();
  const release = productionReleaseLogPackage();
  const automation = sourceSyncAutomation();
  const events = [];
  const pushEvent = (at, label, detail, state = "done", stage = "Evidence", nextAction = "Continue review") => {
    if (!at) return;
    events.push({ at, label, detail, state, stage, nextAction });
  };

  pushEvent(
    evidence.sourceAttachedAt,
    "Source attached",
    `${evidence.sourceType || "Source"}: ${evidence.sourceName || "Production source"}`,
    "done",
    "Evidence",
    evidence.qaLogAt ? "QA log recorded." : "Record production QA log."
  );
  pushEvent(
    evidence.qaLogAt,
    "QA log recorded",
    "Production asking-rent QA log recorded.",
    "done",
    "QA",
    evidence.ownerReviewedAt ? "Owner review completed." : "Complete source-owner review."
  );
  pushEvent(
    evidence.ownerReviewedAt,
    "Owner reviewed",
    "Source-owner review completed.",
    "done",
    "Owner review",
    release.status === "Release queued" || release.status === "Released"
      ? "Release flow started."
      : "Queue controlled release after backend persistence."
  );
  pushEvent(
    release.queuedAt,
    "Release queued",
    release.releaseNote || "Controlled release queued.",
    "done",
    "Controlled release",
    release.status === "Released" ? "Release confirmed." : "Mark released after productionReady deployment is confirmed."
  );
  pushEvent(
    release.releasedAt,
    "Released",
    `${release.sourceName || evidence.sourceName || "Production source"} marked released.`,
    "done",
    "Production verified",
    "Monitor ingestion, source exceptions, and first production comparison."
  );
  pushEvent(
    release.rollbackAt,
    "Rolled back",
    release.rollbackReason || "Rollback reason not specified.",
    "alert",
    "Rollback",
    "Restore source QA evidence and queue corrected release."
  );

  pushEvent(
    automation.updatedAt,
    "Sync schedule updated",
    automation.enabled
      ? automation.cadence === "12h"
        ? "Source automation cadence set to every 12 hours."
        : `Source automation cadence set to daily ${String(automation.runHourSgt || 8).padStart(2, "0")}:00 SGT.`
      : "Source automation is paused.",
    "done",
    "Automation",
    automation.nextRunAt ? `Next run ${formatDateTime(automation.nextRunAt)}.` : "Resume schedule when source ops are ready."
  );
  pushEvent(
    automation.lastRunAt,
    "Scheduled sync run",
    `${automation.lastRunStatus || "sync complete"} (${automation.lastRunMode || "manual"}).`,
    "done",
    "Automation",
    automation.nextRunAt ? `Next run ${formatDateTime(automation.nextRunAt)}.` : "Set next run cadence."
  );
  pushEvent(
    automation.lastBreachAt,
    "Freshness breach event",
    `Freshness moved below Fresh. Breach count ${Number(automation.breachCount || 0)}.`,
    "alert",
    "Automation",
    "Review source capture freshness and confirm queued member alerts."
  );

  if (!events.length) {
    events.push({
      at: new Date().toISOString(),
      label: "Not started",
      detail: "Attach source evidence to start the source history.",
      state: "pending",
      stage: "Draft",
      nextAction: "Attach production asking-rent source evidence."
    });
  }

  return events.sort((a, b) => new Date(a.at) - new Date(b.at));
}

function sourceHistoryAuditState(events = sourceHistoryEvents()) {
  const evidence = productionEvidence();
  const review = productionOpsReview();
  const release = productionReleaseLogPackage();
  const latest = events.at(-1);
  return {
    stage: release.state === "released" || release.state === "rolled-back" || release.state === "queued"
      ? release.status
      : review.stage || latest?.stage || "Draft",
    qa: evidence.qaLogAt
      ? evidence.ownerReviewedAt
        ? "QA + owner reviewed"
        : "QA logged"
      : evidence.sourceName
        ? "QA pending"
        : "Pending",
    release: release.status || "Not released",
    next: release.nextAction || review.action || latest?.nextAction || "Attach source"
  };
}

function sourceTrustProfile(record = null) {
  return window.RentIntelSourceTrust?.profile(record, {
    feed: window.RENTINTEL_ASKING_RENT_FEED || {},
    evidence: productionEvidence(),
    releaseLog: productionReleaseLogPackage(),
    exceptionAlerts: sourceExceptionAlerts()
  }) || {
    key: "sample",
    level: "sample",
    title: "Sample",
    reason: "Sample benchmark signal.",
    action: "Verify direct asking evidence before committing."
  };
}

function sourceTrustRecordRows() {
  return rentRecordList().map((record) => {
    const trust = sourceTrustProfile(record);
    return {
      recordId: record.id,
      title: record.title,
      area: record.area,
      propertyType: record.propertyType,
      sourceTrustKey: trust.key,
      sourceTrustLevel: trust.level,
      sourceTrustTitle: trust.title,
      sourceTrustReason: trust.reason,
      sourceTrustAction: trust.action,
      sourceName: trust.sourceName
    };
  });
}

function askingSourceCandidates() {
  return loadStoredJson(askingSourceCandidatesKey, []);
}

function coverageRequestEntries() {
  return askingSourceCandidates()
    .map((candidate, index) => ({ candidate, index }))
    .filter((entry) => entry.candidate.type === "coverage request" && !isInvalidCoverageCandidate(entry.candidate));
}

function sourceCandidateEntries() {
  return askingSourceCandidates()
    .map((candidate, index) => ({ candidate, index }))
    .filter((entry) => entry.candidate.type !== "coverage request");
}

function approvedAskingSources() {
  return askingSourceCandidates().filter(
    (candidate) => candidate.status === "approved for pilot"
  );
}

function approvedCoverageTargets() {
  return approvedAskingSources().filter((candidate) => candidate.type === "coverage request");
}

function sourceCandidateName(candidate) {
  return candidate?.requestedQuery || candidate?.name || "Unnamed source";
}

function sourceCandidateKey(candidate) {
  return `${candidate?.type || "source"}:${sourceCandidateName(candidate).toLowerCase()}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");
}

function normalizeCoverageRecordQuery(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function inferCoverageProperty(query) {
  const normalized = query.toLowerCase();
  if (/\b(shop\s*house|shophouse|conservation)\b/.test(normalized)) {
    return {
      label: "Shophouse retail",
      official: 12.6,
      asking: 16.1,
      actionNoun: "frontage, approved use, and conservation constraints"
    };
  }
  if (/\b(mall|shopping|plaza|centre|center|point|junction)\b/.test(normalized)) {
    return {
      label: "Shopping centre retail",
      official: 17.8,
      asking: 21.4,
      actionNoun: "floor position, frontage, and mall traffic"
    };
  }
  return {
    label: "HDB retail",
    official: 8.9,
    asking: 11.4,
    actionNoun: "frontage, permitted use, and observed footfall"
  };
}

function inferCoverageArea(query) {
  const propertyWords = /\b(hdb|retail|shop|shops|mall|shopping|centre|center|plaza|point|junction|shophouse|shop house|commercial|unit|rent|rental|asking)\b/gi;
  const cleaned = String(query)
    .replace(propertyWords, " ")
    .replace(/\s+/g, " ")
    .trim();
  return titleCase(cleaned || query);
}

function coverageRecordId(candidate) {
  return `coverage-${slugify(candidate.requestedQuery || candidate.name || "request")}`;
}

function coverageRecordForCandidate(candidate) {
  const query = candidate.requestedQuery || candidate.name || "";
  const inferred = inferCoverageProperty(query);
  const area = inferCoverageArea(query);
  const id = coverageRecordId(candidate);
  const official = inferred.official;
  const asking = inferred.asking;
  const gap = Math.round(((asking - official) / official) * 100);
  const fairHigh = Number(Math.max(official * 1.18, official + 1.2).toFixed(1));
  const fairLow = Number((official * 0.95).toFixed(1));
  const status = gap >= 22 ? "high" : "watch";
  const actionLabel = gap >= 22 ? "Push back" : "Validate premium";
  const title = `${area} ${inferred.label === "HDB retail" ? "HDB retail" : inferred.label.toLowerCase()}`;
  return {
    id,
    aliases: [
      normalizeCoverageRecordQuery(query),
      area.toLowerCase(),
      inferred.label.toLowerCase(),
      `${area.toLowerCase()} ${inferred.label.toLowerCase()}`
    ],
    title,
    propertyType: inferred.label,
    area,
    confidence: "Coverage sample",
    decision: "Approved coverage request converted to sample rent signal.",
    reason: `This is a prototype record generated from the approved public coverage request "${query}". Replace the benchmark and asking estimate with connected URA/HDB and listing-feed evidence before production use.`,
    official,
    asking,
    gap,
    daily: `${title} has been added as a coverage sample at ${money(asking)}, about ${gap}% above a prototype benchmark of ${money(official)}. Use it to test RentIntel search until source sync replaces the sample values.`,
    series: comparableSeries(official, asking),
    map: {
      x: 330,
      y: 230,
      status
    },
    fairRange: {
      low: fairLow,
      high: fairHigh
    },
    actionLabel,
    action: `${actionLabel} above ${money(fairHigh)} unless the unit has strong ${inferred.actionNoun}.`,
    sourceSummary: `Coverage request sample: ${query}. Source sync should replace this with official benchmark, OneMap classification, and verified asking-rent feed records.`,
    mobileSummary: `Coverage sample for ${area}. Treat ${money(fairHigh)} as the prototype push-back line until direct source evidence is connected.`,
    prototypeSource: "coverage-request",
    coverageRequestKey: sourceCandidateKey(candidate),
    generatedAt: new Date().toISOString()
  };
}

function coverageRecordExists(candidate) {
  const id = coverageRecordId(candidate);
  const query = normalizeCoverageRecordQuery(candidate.requestedQuery || candidate.name || "");
  return coveragePrototypeRecords().some((record) =>
    record.id === id || normalizeCoverageRecordQuery(record.title) === query
  );
}

function sourceSyncRuns() {
  return loadStoredJson(sourceSyncLogKey, []);
}

function defaultSourceSyncAutomation() {
  return {
    enabled: true,
    cadence: "daily",
    runHourSgt: 8,
    nextRunAt: "",
    lastRunAt: "",
    lastRunStatus: "not-run",
    lastRunMode: "",
    lastFreshnessState: "",
    lastFreshnessLabel: "",
    lastBreachAt: "",
    breachCount: 0,
    updatedAt: "",
    updatedBy: "",
    history: []
  };
}

function sourceSyncAutomation() {
  const stored = loadStoredJson(sourceSyncAutomationKey, defaultSourceSyncAutomation()) || {};
  const cadence = stored.cadence === "12h" ? "12h" : "daily";
  const runHourSgt = Math.max(0, Math.min(23, Number(stored.runHourSgt) || 8));
  return {
    ...defaultSourceSyncAutomation(),
    ...stored,
    cadence,
    runHourSgt
  };
}

function writeSourceSyncAutomation(next) {
  writeStoredJson(sourceSyncAutomationKey, {
    ...sourceSyncAutomation(),
    ...next
  });
}

function sourceSyncAutomationNextRun(cadence, runHourSgt, now = new Date()) {
  const cursor = new Date(now.getTime());
  if (cadence === "12h") {
    cursor.setHours(cursor.getHours() + 12, 0, 0, 0);
    return cursor.toISOString();
  }
  const next = new Date(cursor.getTime());
  next.setHours(runHourSgt, 0, 0, 0);
  if (next <= cursor) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

function sourceSyncAutomationEvent(summary, detail, state = "run", at = new Date().toISOString()) {
  return { at, summary, detail, state };
}

function appendSourceSyncAutomationEvent(summary, detail, state = "run", at = new Date().toISOString()) {
  const current = sourceSyncAutomation();
  const history = Array.isArray(current.history) ? current.history.slice(0, 49) : [];
  history.unshift(sourceSyncAutomationEvent(summary, detail, state, at));
  writeSourceSyncAutomation({ history });
  void persistSourceSyncAutomationState(sourceSyncAutomation());
}

function evaluateSourceSyncFreshnessBreach() {
  const automation = sourceSyncAutomation();
  const qa = askingFeedQaSummary();
  const previous = String(automation.lastFreshnessState || "").toLowerCase();
  const current = String(qa.freshnessState || "").toLowerCase();
  const breach = previous === "fresh" && (current === "watch" || current === "stale");
  const nowIso = new Date().toISOString();

  if (breach) {
    const watchlist = watchlistForCurrentMember();
    if (watchlist.length && sessionHasAccess(currentSession)) {
      watchlistOutboxRows(watchlist);
    }
    writeSourceSyncAutomation({
      lastFreshnessState: current,
      lastFreshnessLabel: qa.freshnessLabel,
      lastBreachAt: nowIso,
      breachCount: Number(automation.breachCount || 0) + 1
    });
    appendSourceSyncAutomationEvent(
      "Freshness breach queued",
      `Freshness moved from Fresh to ${qa.freshnessLabel}. Alert queue refreshed for member watchlist areas.`,
      "breach",
      nowIso
    );
    void persistFreshnessBreachState({
      sourceName: "RentIntel verified manual asking-rent pilot",
      freshnessState: current,
      previousFreshnessState: previous,
      breachAt: nowIso,
      queueTrigger: "freshness-breach",
      deliveryIds: watchlistForCurrentMember().map((item) => item.recordId),
      note: `Freshness moved from Fresh to ${qa.freshnessLabel}.`
    });
    recordActivity("Source freshness breach", `${qa.freshnessLabel}: ${qa.freshnessDetail}`);
    return { breached: true, qa };
  }

  if (current && current !== previous) {
    writeSourceSyncAutomation({
      lastFreshnessState: current,
      lastFreshnessLabel: qa.freshnessLabel
    });
  }
  return { breached: false, qa };
}

function sourceFreshnessBreachEvents() {
  const automation = sourceSyncAutomation();
  const history = Array.isArray(automation.history) ? automation.history : [];
  return history
    .filter((event) => event.state === "breach")
    .map((event) => ({
      sourceName: window.RENTINTEL_ASKING_RENT_FEED?.sourceName || "asking-rent-feed",
      breachAt: event.at,
      summary: event.summary,
      detail: event.detail,
      freshnessState: automation.lastFreshnessState || "",
      freshnessLabel: automation.lastFreshnessLabel || "",
      memberEmail: normalizeEmail(currentSession?.email) || "",
      queueTrigger: "freshness-breach"
    }));
}

function activationRequests() {
  return loadStoredJson(activationRequestsKey, []);
}

function notificationPreferences() {
  return loadStoredJson(notificationPreferencesKey, []);
}

function pendingMemberIntent() {
  return loadStoredJson(pendingMemberIntentKey, null);
}

function savedReportsForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return backendSavedReports().filter((report) => {
    if (!report.memberEmail) return true;
    return normalizeEmail(report.memberEmail) === email;
  });
}

function reportStorageKey(report, email = currentSession?.email) {
  return `${normalizeEmail(report?.memberEmail || email)}:${report?.recordId || ""}`;
}

function backendSavedReports() {
  return loadStoredJson(backendSavedReportsKey, []);
}

function normalizeBackendReport(report, email = currentSession?.email) {
  const memberEmail = normalizeEmail(report.memberEmail || email);
  const now = new Date().toISOString();
  return {
    ...report,
    reportId: report.reportId || reportStorageKey(report, memberEmail),
    memberEmail,
    decisionPack: report.decisionPack || null,
    negotiationNote: report.negotiationNote || "",
    savedAt: report.savedAt || now,
    updatedAt: report.updatedAt || now,
    backendStatus: "mock-synced"
  };
}

function writeBackendSavedReports(reports) {
  writeStoredJson(backendSavedReportsKey, reports.map((report) => normalizeBackendReport(report)));
}

function upsertBackendSavedReport(report) {
  const normalized = normalizeBackendReport(report);
  const reports = backendSavedReports().filter((entry) => reportStorageKey(entry) !== reportStorageKey(normalized));
  writeStoredJson(backendSavedReportsKey, [normalized, ...reports].slice(0, 200));
  return normalized;
}

function removeBackendSavedReport(report) {
  const key = reportStorageKey(report);
  writeStoredJson(backendSavedReportsKey, backendSavedReports().filter((entry) => reportStorageKey(entry) !== key));
}

async function loadReportsFromApi() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchReports) return false;
  const result = await window.RentIntelAuth.fetchReports();
  if (!result.ok || !Array.isArray(result.data?.reports)) return false;
  writeBackendSavedReports(result.data.reports);
  return true;
}

async function syncLocalReportsToBackend() {
  const localReports = loadStoredJson(savedReportsKey, []);
  if (!localReports.length) {
    if (accountEl.backendReportStatus) {
      accountEl.backendReportStatus.textContent = "No local saved reports to sync.";
    }
    return;
  }
  if (currentSession?.email && window.RentIntelAuth?.saveReport) {
    let synced = 0;
    for (const report of localReports) {
      const normalized = normalizeBackendReport(report);
      const result = await window.RentIntelAuth.saveReport(normalized);
      if (result.ok && result.data?.report) {
        upsertBackendSavedReport(result.data.report);
        synced += 1;
      }
    }
    renderBackendReportMock();
    renderSavedReports();
    renderBackendHandoff();
    recordActivity("Saved reports API sync", `${synced} reports synced to backend`);
    if (accountEl.backendReportStatus) {
      accountEl.backendReportStatus.textContent = `${synced} saved reports synced to the backend store.`;
    }
    return;
  }
  const existing = new Map(backendSavedReports().map((report) => [reportStorageKey(report), normalizeBackendReport(report)]));
  localReports.forEach((report) => {
    existing.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  writeStoredJson(backendSavedReportsKey, [...existing.values()]);
  renderBackendReportMock();
  renderSavedReports();
  renderBackendHandoff();
  recordActivity("Saved reports mock sync", `${existing.size} reports mirrored to mock backend store`);
  if (accountEl.backendReportStatus) {
    accountEl.backendReportStatus.textContent = `${existing.size} saved reports synced to the mock backend store.`;
  }
}

function ensureBackendReportsMirrored() {
  const localReports = loadStoredJson(savedReportsKey, []);
  if (!localReports.length) return;
  const existing = new Map(backendSavedReports().map((report) => [reportStorageKey(report), normalizeBackendReport(report)]));
  let changed = false;
  localReports.forEach((report) => {
    const key = reportStorageKey(report);
    if (!existing.has(key)) {
      existing.set(key, normalizeBackendReport(report));
      changed = true;
    }
  });
  if (changed) writeStoredJson(backendSavedReportsKey, [...existing.values()]);
}

async function hydrateSavedReports() {
  const loaded = await loadReportsFromApi();
  if (!loaded) ensureBackendReportsMirrored();
  renderBackendReportMock();
  renderSavedReports();
}

function watchlistForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return loadStoredJson(watchlistKey, []).filter((item) => {
    if (!item.memberEmail) return true;
    return normalizeEmail(item.memberEmail) === email;
  });
}

function alertRulesForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return loadStoredJson(alertRulesKey, []).filter((rule) => {
    if (!rule.memberEmail) return true;
    return normalizeEmail(rule.memberEmail) === email;
  });
}

function alertRuleForRecord(recordId) {
  return alertRulesForCurrentMember().find((rule) => rule.recordId === recordId) || null;
}

async function loadWatchlistFromApi() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchWatchlist) return false;
  const result = await window.RentIntelAuth.fetchWatchlist();
  if (!result.ok || !Array.isArray(result.data?.watchlist) || !Array.isArray(result.data?.alertRules)) return false;
  const email = normalizeEmail(currentSession.email);
  const otherWatchlist = loadStoredJson(watchlistKey, []).filter((item) => normalizeEmail(item.memberEmail || "") !== email);
  const otherAlertRules = loadStoredJson(alertRulesKey, []).filter((rule) => normalizeEmail(rule.memberEmail || "") !== email);
  writeStoredJson(watchlistKey, [...result.data.watchlist, ...otherWatchlist]);
  writeStoredJson(alertRulesKey, [...result.data.alertRules, ...otherAlertRules]);
  return true;
}

function ensureWatchlistMirrored() {
  const email = normalizeEmail(currentSession?.email);
  if (!email) return;
  const allWatchlist = loadStoredJson(watchlistKey, []);
  const currentWatchlist = allWatchlist.filter((item) => normalizeEmail(item.memberEmail || email) === email);
  const otherWatchlist = allWatchlist.filter((item) => normalizeEmail(item.memberEmail || email) !== email);
  writeStoredJson(watchlistKey, [...currentWatchlist, ...otherWatchlist]);
  const allAlertRules = loadStoredJson(alertRulesKey, []);
  const currentAlertRules = allAlertRules.filter((rule) => normalizeEmail(rule.memberEmail || email) === email);
  const otherAlertRules = allAlertRules.filter((rule) => normalizeEmail(rule.memberEmail || email) !== email);
  writeStoredJson(alertRulesKey, [...currentAlertRules, ...otherAlertRules]);
}

async function hydrateWatchlistAndAlerts() {
  const loaded = await loadWatchlistFromApi();
  if (!loaded) ensureWatchlistMirrored();
  renderWatchlist();
  renderMemberCommandCenter();
}

function alertCadenceLabel(cadence) {
  if (cadence === "weekly") return "Weekly";
  if (cadence === "source-refresh") return "When source refreshes";
  return "Daily";
}

function alertTriggerLabel(trigger) {
  if (trigger === "gap-above-limit") return "Asking premium rises above limit";
  if (trigger === "benchmark-changed") return "Official benchmark changes";
  if (trigger === "source-connected") return "Asking source sync connected";
  if (trigger === "freshness-breach") return "Feed freshness moved from Fresh";
  return "Asking rent falls to target";
}

function alertTriggerOptions() {
  return [
    { value: "asking-falls-to-target", label: "Asking rent falls to target" },
    { value: "gap-above-limit", label: "Asking premium rises above limit" },
    { value: "benchmark-changed", label: "Official benchmark changes" },
    { value: "source-connected", label: "Asking source sync connected" }
  ];
}

function alertCadenceOptions() {
  return [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "source-refresh", label: "When source refreshes" }
  ];
}

function watchlistState(record) {
  const gap = Number(record?.gap || 0);
  if (gap >= 20) return { key: "high", label: "High pressure" };
  if (gap >= 10) return { key: "watch", label: "Watch" };
  return { key: "fair", label: "Fair range" };
}

function recordFreshnessProfileForAlerts(record) {
  const capturedAt = record?.askingSource?.capturedAt || window.RENTINTEL_ASKING_RENT_FEED?.updatedAt || "";
  return {
    capturedAt,
    ...sourceFreshnessProfile(capturedAt)
  };
}

function watchlistTargetPsf(record) {
  return Number(record?.fairRange?.high || record?.official || record?.asking || 0);
}

function watchlistNextStep(record, rule = null) {
  const state = watchlistState(record);
  const target = rule?.targetPsf || watchlistTargetPsf(record);
  if (state.key === "high") {
    return `Track for a drop near ${money(target)} or ask for stronger evidence before discussion.`;
  }
  if (state.key === "watch") {
    return `Monitor benchmark and asking movement before accepting above ${money(target)}.`;
  }
  return `Keep monitoring source updates; no major asking premium is flagged.`;
}

function defaultAlertRuleForRecord(record) {
  const targetPsf = watchlistTargetPsf(record);
  return {
    memberEmail: normalizeEmail(currentSession?.email),
    recordId: record.id,
    area: record.area,
    title: record.title,
    trigger: "asking-falls-to-target",
    targetPsf,
    gapLimit: Math.max(10, Math.abs(Number(record.gap || 0))),
    cadence: "daily",
    condition: `Alert when asking rent falls near ${money(targetPsf)} or the benchmark source changes materially.`,
    savedAt: new Date().toISOString()
  };
}

async function upsertAlertRuleForRecord(record) {
  if (!record) return null;
  const email = normalizeEmail(currentSession?.email);
  const existingRules = loadStoredJson(alertRulesKey, []);
  const existing = existingRules.find(
    (rule) => rule.recordId === record.id && normalizeEmail(rule.memberEmail || email) === email
  );
  if (existing) return existing;
  const rule = defaultAlertRuleForRecord(record);
  if (currentSession?.email && window.RentIntelAuth?.saveAlertRule) {
    const result = await window.RentIntelAuth.saveAlertRule(rule);
    if (result.ok && result.data?.alertRule) {
      const synced = result.data.alertRule;
      writeStoredJson(alertRulesKey, [synced, ...existingRules].slice(0, 100));
      return synced;
    }
  }
  writeStoredJson(alertRulesKey, [rule, ...existingRules].slice(0, 100));
  return rule;
}

async function saveAlertRuleForRecord(record, updates = {}) {
  if (!record) return null;
  const email = normalizeEmail(currentSession?.email);
  const existingRules = loadStoredJson(alertRulesKey, []);
  const baseline = alertRuleForRecord(record.id) || defaultAlertRuleForRecord(record);
  const triggerValues = new Set(alertTriggerOptions().map((item) => item.value));
  const cadenceValues = new Set(alertCadenceOptions().map((item) => item.value));
  const trigger = triggerValues.has(updates.trigger) ? updates.trigger : baseline.trigger;
  const cadence = cadenceValues.has(updates.cadence) ? updates.cadence : baseline.cadence;
  const targetPsf = Number.isFinite(Number(updates.targetPsf))
    ? Number(Number(updates.targetPsf).toFixed(2))
    : Number(baseline.targetPsf || watchlistTargetPsf(record));
  const gapLimit = Number.isFinite(Number(updates.gapLimit))
    ? Math.max(0, Math.round(Number(updates.gapLimit)))
    : Math.max(0, Number(baseline.gapLimit || 0));
  const condition =
    `Alert when ${alertTriggerLabel(trigger).toLowerCase()} near ${money(targetPsf)}.`;

  const rule = {
    ...baseline,
    memberEmail: email,
    recordId: record.id,
    area: record.area,
    title: record.title,
    trigger,
    targetPsf,
    gapLimit,
    cadence,
    condition,
    updatedAt: new Date().toISOString(),
    savedAt: baseline.savedAt || new Date().toISOString()
  };

  const filtered = existingRules.filter((item) => {
    const sameRecord = item.recordId === record.id;
    const sameMember = normalizeEmail(item.memberEmail || email) === email;
    return !(sameRecord && sameMember);
  });
  if (currentSession?.email && window.RentIntelAuth?.saveAlertRule) {
    const result = await window.RentIntelAuth.saveAlertRule(rule);
    if (result.ok && result.data?.alertRule) {
      const synced = result.data.alertRule;
      writeStoredJson(alertRulesKey, [synced, ...filtered].slice(0, 100));
      return synced;
    }
  }
  writeStoredJson(alertRulesKey, [rule, ...filtered].slice(0, 100));
  return rule;
}

function alertPreviewForWatchlist(watchlist) {
  const firstValid = watchlist
    .map((item) => {
      const record = rentRecordList().find((entry) => entry.id === item.recordId);
      if (!record) return null;
      return { item, record, rule: alertRuleForRecord(record.id) || defaultAlertRuleForRecord(record) };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.record.gap || 0) - Number(a.record.gap || 0))[0];
  if (!firstValid) return null;

  const { record, rule } = firstValid;
  const state = watchlistState(record);
  const trust = sourceTrustProfile(record);
  const target = rule.targetPsf || watchlistTargetPsf(record);
  return {
    state: state.key,
    label: state.key === "high" ? "Alert Preview - Priority" : "Alert Preview",
    title: `${record.title}: ${state.label}`,
    copy:
      `${record.area} is being watched at ${money(record.asking)} asking versus ${money(target)} target. ` +
      `${trust.title || record.confidence}. ${alertTriggerLabel(rule.trigger)}.`,
    trigger: alertTriggerLabel(rule.trigger),
    target: money(target),
    cadence: alertCadenceLabel(rule.cadence),
    next: watchlistNextStep(record, rule)
  };
}

function renderWatchlistAlertPreview(watchlist) {
  if (!accountEl.watchlistAlertPreview) return;
  const preview = alertPreviewForWatchlist(watchlist);
  if (!preview) {
    accountEl.watchlistAlertPreview.dataset.state = "empty";
    accountEl.watchlistAlertLabel.textContent = "Alert Preview";
    accountEl.watchlistAlertTitle.textContent = "No active watch alert";
    accountEl.watchlistAlertCopy.textContent = "Add an area alert to preview the decision message RentIntel would send.";
    accountEl.watchlistAlertTriggerMetric.textContent = "-";
    accountEl.watchlistAlertTargetMetric.textContent = "-";
    accountEl.watchlistAlertCadenceMetric.textContent = "-";
    accountEl.watchlistAlertNext.textContent = "Next alert action will show here.";
    return;
  }

  accountEl.watchlistAlertPreview.dataset.state = preview.state;
  accountEl.watchlistAlertLabel.textContent = preview.label;
  accountEl.watchlistAlertTitle.textContent = preview.title;
  accountEl.watchlistAlertCopy.textContent = preview.copy;
  accountEl.watchlistAlertTriggerMetric.textContent = preview.trigger;
  accountEl.watchlistAlertTargetMetric.textContent = preview.target;
  accountEl.watchlistAlertCadenceMetric.textContent = preview.cadence;
  accountEl.watchlistAlertNext.textContent = `Next: ${preview.next}`;
}

function alertDeliveryQueue() {
  return loadStoredJson(alertDeliveryQueueKey, []);
}

function alertDeliveryQueueForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return alertDeliveryQueue().filter((entry) => normalizeEmail(entry.memberEmail || email) === email);
}

function writeAlertDeliveryQueueForCurrentMember(rows) {
  const email = normalizeEmail(currentSession?.email);
  const remaining = alertDeliveryQueue().filter((entry) => normalizeEmail(entry.memberEmail || email) !== email);
  writeStoredJson(alertDeliveryQueueKey, [...rows, ...remaining].slice(0, 500));
}

async function hydrateAlertDeliveryState() {
  if (!currentSession?.email) return false;
  const email = normalizeEmail(currentSession.email);
  let loaded = false;
  if (window.RentIntelAuth?.fetchAlertDeliveries) {
    const result = await window.RentIntelAuth.fetchAlertDeliveries();
    if (result.ok && Array.isArray(result.data?.alertDeliveries)) {
      const otherRows = alertDeliveryQueue().filter((entry) => normalizeEmail(entry.memberEmail || "") !== email);
      writeStoredJson(alertDeliveryQueueKey, [...result.data.alertDeliveries, ...otherRows].slice(0, 500));
      loaded = true;
    }
  }
  if (window.RentIntelAuth?.fetchAlertDeliveryRuns) {
    const result = await window.RentIntelAuth.fetchAlertDeliveryRuns();
    if (result.ok && Array.isArray(result.data?.deliveryRuns)) {
      const otherRuns = alertDeliveryRuns().filter((entry) => normalizeEmail(entry.memberEmail || "") !== email);
      writeStoredJson(alertDeliveryRunsKey, [...result.data.deliveryRuns, ...otherRuns].slice(0, 300));
      loaded = true;
    }
  }
  if (window.RentIntelAuth?.fetchAlertMessages) {
    const result = await window.RentIntelAuth.fetchAlertMessages();
    if (result.ok && Array.isArray(result.data?.deliveredMessages)) {
      const otherMessages = loadStoredJson(alertDeliveredMessagesKey, []).filter((entry) => normalizeEmail(entry.memberEmail || "") !== email);
      writeStoredJson(alertDeliveredMessagesKey, [...result.data.deliveredMessages, ...otherMessages].slice(0, 400));
      loaded = true;
    }
  }
  if (window.RentIntelAuth?.fetchAlertAdminActions) {
    const result = await window.RentIntelAuth.fetchAlertAdminActions();
    if (result.ok && Array.isArray(result.data?.adminActions)) {
      const otherActions = alertDeliveryAdminLog().filter((entry) => normalizeEmail(entry.memberEmail || "") !== email);
      writeStoredJson(alertDeliveryAdminLogKey, [...result.data.adminActions, ...otherActions].slice(0, 400));
      loaded = true;
    }
  }
  renderWatchlist();
  renderMemberCommandCenter();
  return loaded;
}

async function persistAlertDeliveryRow(row) {
  if (!row || !currentSession?.email || !window.RentIntelAuth?.queueAlertDelivery) return false;
  const result = await window.RentIntelAuth.queueAlertDelivery(row);
  return Boolean(result.ok && result.data?.alertDelivery);
}

async function persistAlertDeliveryRun(run) {
  if (!run || !currentSession?.email || !window.RentIntelAuth?.saveAlertDeliveryRun) return false;
  const result = await window.RentIntelAuth.saveAlertDeliveryRun(run);
  return Boolean(result.ok && result.data?.deliveryRun);
}

async function persistAlertAdminAction(entry) {
  if (!entry || !currentSession?.email || !window.RentIntelAuth?.saveAlertAdminAction) return false;
  const result = await window.RentIntelAuth.saveAlertAdminAction(entry);
  return Boolean(result.ok && result.data?.adminAction);
}

function alertDeliveryStatusLabel(status) {
  const labels = {
    queued: "Queued",
    sent: "Sent",
    failed: "Failed",
    acknowledged: "Acknowledged",
    suppressed: "Suppressed",
    skipped: "Skipped",
    "dead-letter": "Dead Letter"
  };
  return labels[status] || "Queued";
}

function alertDeliveryStatusRank(status) {
  const ranks = {
    queued: 5,
    failed: 4,
    "dead-letter": 3,
    sent: 2,
    acknowledged: 1,
    skipped: 1,
    suppressed: 0
  };
  return ranks[status] || 0;
}

function composeAlertQueueRow(record, rule, existing = {}) {
  const state = watchlistState(record);
  const trust = sourceTrustProfile(record);
  const freshness = recordFreshnessProfileForAlerts(record);
  const previousFreshnessState = String(
    existing.deliveryPayload?.lastFreshnessState || existing.freshnessState || freshness.state || ""
  ).toLowerCase();
  const freshnessBreach = previousFreshnessState === "fresh" && ["watch", "stale"].includes(freshness.state);
  const baselineStatus = existing.deliveryStatus || "queued";
  const deliveryStatus = freshnessBreach && baselineStatus !== "suppressed"
    ? "queued"
    : baselineStatus;
  const freshnessReason = freshnessBreach
    ? `Freshness breach: source moved from Fresh to ${freshness.label}.`
    : "";
  const target = rule?.targetPsf || watchlistTargetPsf(record);
  const triggerKey = freshnessBreach ? "freshness-breach" : (rule?.trigger || "");
  const triggerLabel = freshnessBreach ? "Feed freshness moved from Fresh" : alertTriggerLabel(rule?.trigger);
  const cadenceKey = freshnessBreach ? "source-refresh" : (rule?.cadence || "daily");
  const cadenceLabel = freshnessBreach ? "When source refreshes" : alertCadenceLabel(rule?.cadence);
  const now = new Date().toISOString();
  const queuedAt = existing.queuedAt || now;
  return {
    id: existing.id || `queue-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    recordId: record.id,
    alertRuleId: rule?.id || "",
    state: state.key,
    title: record.title,
    area: record.area,
    memberEmail: normalizeEmail(currentSession?.email) || "member email pending",
    subject: freshnessBreach
      ? `${record.area} freshness alert: ${freshness.label}`
      : `${record.area} rent alert: ${state.label}`,
    message: freshnessBreach
      ? `${record.area}: feed freshness moved from Fresh to ${freshness.label}. ${freshness.detail} Recheck source evidence before using this rent signal.`
      : `${record.area}: asking ${money(record.asking)} vs target ${money(target)}. ${trust.title || record.confidence}. ${watchlistNextStep(record, rule)}`,
    trigger: triggerLabel,
    triggerKey,
    cadence: cadenceLabel,
    cadenceKey,
    deliveryChannel: "email",
    deliveryPayload: {
      source: "watchlist-alert-delivery-queue",
      trust: trust.title || record.confidence,
      targetPsf: target,
      askingPsf: record.asking,
      gap: record.gap,
      nextStep: watchlistNextStep(record, rule),
      freshnessState: freshness.state,
      freshnessLabel: freshness.label,
      freshnessDetail: freshness.detail,
      previousFreshnessState,
      lastFreshnessState: freshness.state,
      freshnessBreach,
      retryCount: Math.max(0, Number(existing.retryCount || 0)),
      maxRetries: Math.max(1, Number(existing.maxRetries || defaultAlertMaxRetries)),
      deliveryStatus,
      failureCode: existing.failureCode || "",
      deadLetterAt: existing.deadLetterAt || "",
      suppressedAt: existing.suppressedAt || ""
    },
    freshnessState: freshness.state,
    freshnessLabel: freshness.label,
    freshnessBreach,
    status: alertDeliveryStatusLabel(deliveryStatus),
    deliveryStatus,
    retryCount: Math.max(0, Number(existing.retryCount || 0)),
    maxRetries: Math.max(1, Number(existing.maxRetries || defaultAlertMaxRetries)),
    failureCode: existing.failureCode || "",
    deadLetterAt: existing.deadLetterAt || "",
    suppressedAt: existing.suppressedAt || "",
    queuedAt,
    updatedAt: freshnessBreach ? now : (existing.updatedAt || queuedAt),
    lastReason: freshnessBreach
      ? freshnessReason
      : existing.lastReason || "Alert queued and waiting for delivery worker."
  };
}

function composeAlertHistoryFromQueueRow(row, status, reason) {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    memberEmail: normalizeEmail(currentSession?.email),
    recordId: row.recordId,
    title: row.title,
    area: row.area,
    status,
    trigger: row.trigger || "Trigger pending",
    cadence: row.cadence || "Daily",
    targetPsf: Number(row.deliveryPayload?.targetPsf || 0),
    askingPsf: Number(row.deliveryPayload?.askingPsf || 0),
    gap: Number(row.deliveryPayload?.gap || 0),
    reason: reason || "Alert delivery event logged.",
    at: new Date().toISOString()
  };
}

function queueReasonForStatus(status) {
  if (status === "sent") return "Delivery worker marked this alert as sent.";
  if (status === "failed") return "Delivery worker marked this alert as failed.";
  if (status === "acknowledged") return "Admin acknowledged this alert for manual follow-up.";
  if (status === "skipped") return "Delivery worker skipped this alert.";
  if (status === "suppressed") return "Admin suppressed this alert from delivery.";
  if (status === "dead-letter") return "Alert moved to dead-letter queue after max retry attempts.";
  return "Alert queued and waiting for delivery worker.";
}

function setAlertQueueStatus(recordId, nextStatus, reason = "", options = {}) {
  const rows = alertDeliveryQueueForCurrentMember();
  let target = rows.find((row) => row.recordId === recordId);

  if (!target && nextStatus === "queued" && options.record) {
    const fallbackRule = options.rule || alertRuleForRecord(options.record.id) || defaultAlertRuleForRecord(options.record);
    target = composeAlertQueueRow(options.record, fallbackRule, { deliveryStatus: "queued" });
    rows.unshift(target);
  }
  if (!target) return;

  const now = new Date().toISOString();
  const retriesAllowed = Math.max(1, Number(target.maxRetries || defaultAlertMaxRetries));
  const nextRetryCount = nextStatus === "failed"
    ? Math.max(0, Number(target.retryCount || 0)) + 1
    : nextStatus === "queued"
      ? 0
      : Math.max(0, Number(target.retryCount || 0));
  const exhaustedRetries = nextStatus === "failed" && nextRetryCount >= retriesAllowed;
  const resolvedStatus = exhaustedRetries ? "dead-letter" : nextStatus;
  target.retryCount = nextRetryCount;
  target.maxRetries = retriesAllowed;
  target.deliveryStatus = resolvedStatus;
  target.status = alertDeliveryStatusLabel(resolvedStatus);
  target.updatedAt = now;
  target.lastReason = exhaustedRetries
    ? `Retry ${nextRetryCount}/${retriesAllowed} failed. Routed to dead-letter queue.`
    : reason || queueReasonForStatus(resolvedStatus);
  if (resolvedStatus === "failed" || resolvedStatus === "dead-letter") {
    target.failureCode = options.failureCode || target.failureCode || "provider-timeout";
  }
  if (resolvedStatus === "dead-letter") {
    target.deadLetterAt = now;
    target.suppressedAt = "";
  } else if (resolvedStatus === "suppressed") {
    target.suppressedAt = now;
    target.deadLetterAt = "";
  } else if (resolvedStatus === "acknowledged") {
    target.suppressedAt = "";
    target.deadLetterAt = "";
  } else if (resolvedStatus === "queued") {
    target.deadLetterAt = "";
    target.suppressedAt = "";
    target.failureCode = "";
  } else {
    target.suppressedAt = "";
  }
  target.deliveryPayload = {
    ...(target.deliveryPayload || {}),
    retryCount: target.retryCount,
    maxRetries: target.maxRetries,
    deliveryStatus: target.deliveryStatus,
    failureCode: target.failureCode || "",
    deadLetterAt: target.deadLetterAt || "",
    suppressedAt: target.suppressedAt || ""
  };
  if (resolvedStatus === "queued") {
    target.queuedAt = now;
    delete target.resultAt;
  } else {
    target.resultAt = now;
  }
  writeAlertDeliveryQueueForCurrentMember(rows);
  void persistAlertDeliveryRow(target);
  pushAlertHistoryEvent(composeAlertHistoryFromQueueRow(target, resolvedStatus, target.lastReason));
  return target;
}

function removeAlertQueueRecord(recordId) {
  const rows = alertDeliveryQueueForCurrentMember().filter((row) => row.recordId !== recordId);
  writeAlertDeliveryQueueForCurrentMember(rows);
}

function syncAlertQueueWithWatchlist(watchlist) {
  const watchRecords = watchlist
    .map((item) => rentRecordList().find((entry) => entry.id === item.recordId))
    .filter(Boolean);
  const watchRecordIds = new Set(watchRecords.map((record) => record.id));
  const byRecordId = new Map(alertDeliveryQueueForCurrentMember().map((row) => [row.recordId, row]));
  const nextRows = watchRecords.map((record) => {
    const rule = alertRuleForRecord(record.id) || defaultAlertRuleForRecord(record);
    const existing = byRecordId.get(record.id);
    const row = composeAlertQueueRow(record, rule, existing || {});
    if (!existing) {
      pushAlertHistoryEvent(
        composeAlertHistoryFromQueueRow(
          row,
          "queued",
          "Watchlist alert queued and waiting for delivery worker."
        )
      );
    } else if (row.freshnessBreach && row.deliveryStatus === "queued") {
      pushAlertHistoryEvent(
        composeAlertHistoryFromQueueRow(
          row,
          "queued",
          row.lastReason || "Freshness breach queued for delivery."
        )
      );
    }
    if (!existing || existing.deliveryStatus !== row.deliveryStatus || existing.updatedAt !== row.updatedAt) {
      void persistAlertDeliveryRow(row);
    }
    return row;
  });
  writeAlertDeliveryQueueForCurrentMember(nextRows);
  return nextRows.sort((a, b) => {
    const rankDiff = alertDeliveryStatusRank(b.deliveryStatus) - alertDeliveryStatusRank(a.deliveryStatus);
    if (rankDiff) return rankDiff;
    return String(b.updatedAt || b.queuedAt || "").localeCompare(String(a.updatedAt || a.queuedAt || ""));
  }).filter((row) => watchRecordIds.has(row.recordId));
}

function watchlistOutboxRows(watchlist) {
  return syncAlertQueueWithWatchlist(watchlist);
}

function alertDeliveryRuns() {
  return loadStoredJson(alertDeliveryRunsKey, []);
}

function alertDeliveryRunsForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return alertDeliveryRuns()
    .filter((run) => !run.memberEmail || normalizeEmail(run.memberEmail) === email)
    .sort((a, b) => String(b.finishedAt || b.startedAt || "").localeCompare(String(a.finishedAt || a.startedAt || "")));
}

function writeAlertDeliveryRunsForCurrentMember(runs) {
  const email = normalizeEmail(currentSession?.email);
  const remaining = alertDeliveryRuns().filter((entry) => normalizeEmail(entry.memberEmail || email) !== email);
  writeStoredJson(alertDeliveryRunsKey, [...runs, ...remaining].slice(0, 300));
}

function alertDeliveredMessages() {
  return loadStoredJson(alertDeliveredMessagesKey, []);
}

function alertDeliveredMessagesForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return alertDeliveredMessages()
    .filter((entry) => !entry.memberEmail || normalizeEmail(entry.memberEmail) === email)
    .sort((a, b) => String(b.deliveredAt || "").localeCompare(String(a.deliveredAt || "")));
}

function filteredDeliveredMessages() {
  return alertDeliveredMessagesForCurrentMember().filter((message) => {
    const transportOk = deliveryMessageTransportFilter === "all" || (message.transportMode || "file") === deliveryMessageTransportFilter;
    const runOk = deliveryMessageRunFilter === "all" || String(message.runId || "") === deliveryMessageRunFilter;
    return transportOk && runOk;
  });
}

function renderDeliveryMessageFilters() {
  if (!accountEl.deliveryMessageTransportFilter || !accountEl.deliveryMessageRunFilter) return;
  accountEl.deliveryMessageTransportFilter.value = deliveryMessageTransportFilter;
  const runs = alertDeliveryRunsForCurrentMember();
  const previousValue = deliveryMessageRunFilter;
  accountEl.deliveryMessageRunFilter.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All runs";
  accountEl.deliveryMessageRunFilter.append(allOption);
  runs.slice(0, 20).forEach((run) => {
    const option = document.createElement("option");
    option.value = run.runId || run.id || "";
    option.textContent = `${run.runId || run.id || "delivery-run"} (${run.sentCount || 0} sent)`;
    accountEl.deliveryMessageRunFilter.append(option);
  });
  const hasPrevious = [...accountEl.deliveryMessageRunFilter.options].some((option) => option.value === previousValue);
  accountEl.deliveryMessageRunFilter.value = hasPrevious ? previousValue : "all";
  deliveryMessageRunFilter = accountEl.deliveryMessageRunFilter.value;
}

function deliveryMessagePreviewText(message) {
  if (!message) return "No delivery message selected.";
  return [
    `From: ${message.fromEmail || "alerts@rent-intel.local"}`,
    `To: ${message.memberEmail || "member email pending"}`,
    `Transport: ${message.transportMode || "file"}`,
    `Run: ${message.runId || "not captured"}`,
    `Subject: ${message.subject || message.title || "Delivered alert"}`,
    `Trigger: ${message.trigger || "Trigger pending"}`,
    `Cadence: ${message.cadence || "Daily"}`,
    `Delivered: ${formatDateTime(message.deliveredAt)}`,
    `Artifact JSON: ${message.artifactPath || "not captured"}`,
    `Artifact EML: ${message.rawEmailPath || "not captured"}`,
    "",
    message.previewText || message.message || "No preview captured."
  ].join("\n");
}

function openDeliveryMessageModal(message) {
  if (!message || !accountEl.deliveryMessageModal) return;
  selectedDeliveryMessage = message;
  accountEl.deliveryMessageModalTitle.textContent = message.subject || message.title || "Delivered message";
  accountEl.deliveryMessageModalMeta.textContent =
    `${message.transportMode || "file"} | ${message.deliveryChannel || "email"} | ${message.runId || "run missing"} | ${message.providerResponse || "No provider response captured."}`;
  accountEl.deliveryMessageModalText.textContent = deliveryMessagePreviewText(message);
  accountEl.deliveryMessageModal.hidden = false;
}

function closeDeliveryMessageModal() {
  if (accountEl.deliveryMessageModal) accountEl.deliveryMessageModal.hidden = true;
}

async function copySelectedDeliveryMessage() {
  if (!selectedDeliveryMessage) return;
  const text = deliveryMessagePreviewText(selectedDeliveryMessage);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
}

function downloadSelectedDeliveryMessage() {
  if (!selectedDeliveryMessage) return;
  const text = deliveryMessagePreviewText(selectedDeliveryMessage);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${String(selectedDeliveryMessage.runId || "delivery-message").replace(/[^a-z0-9-]+/gi, "-")}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderDeliveredMessages() {
  if (!accountEl.deliveryMessageList || !accountEl.deliveryMessageCount) return;
  renderDeliveryMessageFilters();
  const messages = filteredDeliveredMessages();
  accountEl.deliveryMessageCount.textContent = `${messages.length} message${messages.length === 1 ? "" : "s"}`;
  accountEl.deliveryMessageList.replaceChildren();

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.textContent = "No delivered alert messages match the current filters.";
    accountEl.deliveryMessageList.append(empty);
    return;
  }

  messages.slice(0, 6).forEach((message) => {
    const item = document.createElement("article");
    item.className = "delivery-message-item";

    const header = document.createElement("header");
    const label = document.createElement("span");
    label.textContent = `${message.deliveryChannel || "email"} | ${message.transportMode || "file"} | ${message.area || "Area pending"}`;
    const subject = document.createElement("strong");
    subject.textContent = message.subject || message.title || "Delivered alert";
    header.append(label, subject);

    const preview = document.createElement("p");
    preview.textContent = message.previewText || message.message || "No preview captured.";

    const meta = document.createElement("small");
    meta.textContent =
      `${message.trigger || "Trigger pending"} | ${message.cadence || "Daily"} | From ${message.fromEmail || "alerts@rent-intel.local"} | Delivered ${formatDateTime(message.deliveredAt)} | Artifact ${message.artifactFile || "not captured"}`;

    const path = document.createElement("code");
    path.textContent = message.artifactPath || "";

    const actions = document.createElement("div");
    actions.className = "delivery-message-actions";
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      openDeliveryMessageModal(message);
    });
    const traceRun = document.createElement("button");
    traceRun.type = "button";
    traceRun.textContent = "Trace Run";
    traceRun.addEventListener("click", () => {
      deliveryMessageRunFilter = String(message.runId || "all");
      renderDeliveredMessages();
      renderDeliveryWorkerRuns();
    });
    actions.append(inspect, traceRun);

    item.append(header, preview, meta);
    if (message.artifactPath) item.append(path);
    if (message.providerResponse) {
      const provider = document.createElement("small");
      provider.textContent = message.providerResponse;
      item.append(provider);
    }
    item.append(actions);
    accountEl.deliveryMessageList.append(item);
  });
}

function renderDeliveryWorkerRuns() {
  if (!accountEl.deliveryWorkerRunList) return;
  const runs = alertDeliveryRunsForCurrentMember();
  const messages = alertDeliveredMessagesForCurrentMember();
  const totals = runs.reduce(
    (summary, run) => {
      summary.sent += Number(run.sentCount || 0);
      summary.failed += Number(run.failedCount || 0);
      summary.skipped += Number(run.skippedCount || 0);
      summary.deadLetter += Number(run.deadLetterCount || 0);
      return summary;
    },
    { sent: 0, failed: 0, skipped: 0, deadLetter: 0 }
  );
  accountEl.deliveryWorkerRunCount.textContent = `${runs.length} run${runs.length === 1 ? "" : "s"}`;
  accountEl.deliveryWorkerSentMetric.textContent = String(totals.sent);
  accountEl.deliveryWorkerFailedMetric.textContent = String(totals.failed);
  accountEl.deliveryWorkerSkippedMetric.textContent = String(totals.skipped);
  if (accountEl.deliveryWorkerDeadLetterMetric) accountEl.deliveryWorkerDeadLetterMetric.textContent = String(totals.deadLetter);
  accountEl.deliveryWorkerLastRunAt.textContent = runs.length ? formatDateTime(runs[0].finishedAt || runs[0].startedAt) : "-";
  accountEl.deliveryWorkerRunList.replaceChildren();

  if (!runs.length) {
    const empty = document.createElement("p");
    empty.textContent = "No delivery worker runs yet.";
    accountEl.deliveryWorkerRunList.append(empty);
    return;
  }

  runs.slice(0, 6).forEach((run) => {
    const item = document.createElement("article");
    item.className = "delivery-worker-run-item";
    const header = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = run.runId || run.id || "delivery-run";
    const meta = document.createElement("small");
    meta.textContent = `${formatDateTime(run.finishedAt || run.startedAt)} | ${run.totalQueued || 0} queued`;
    header.append(title, meta);

    const metrics = document.createElement("p");
    metrics.textContent =
      `Sent ${run.sentCount || 0} | Failed ${run.failedCount || 0} | Dead-letter ${run.deadLetterCount || 0} | Skipped ${run.skippedCount || 0}`;

    const runMessages = messages.filter((message) => String(message.runId || "") === String(run.runId || run.id || ""));
    const artifacts = document.createElement("small");
    artifacts.textContent =
      runMessages.length
        ? `${runMessages.length} artifact${runMessages.length === 1 ? "" : "s"} | ${runMessages[0].transportMode || "file"} transport`
        : "No artifacts captured for this run.";

    const actions = document.createElement("div");
    actions.className = "delivery-worker-run-actions";
    const trace = document.createElement("button");
    trace.type = "button";
    trace.textContent = "Trace Artifacts";
    trace.disabled = !runMessages.length;
    trace.addEventListener("click", () => {
      deliveryMessageRunFilter = String(run.runId || run.id || "all");
      renderDeliveredMessages();
    });
    actions.append(trace);

    item.append(header, metrics, artifacts, actions);
    accountEl.deliveryWorkerRunList.append(item);
  });
}

async function runDeliveryWorkerBatch() {
  if (!currentSession) {
    if (accountEl.deliveryWorkerStatus) accountEl.deliveryWorkerStatus.textContent = "Sign in first to run delivery worker.";
    return;
  }
  if (!sessionHasAccess(currentSession)) {
    if (accountEl.deliveryWorkerStatus) {
      accountEl.deliveryWorkerStatus.textContent = "Free saved tools can view the queue. Approved internal access is required to run the delivery worker.";
    }
    return;
  }
  const watchlist = watchlistForCurrentMember();
  const queueRows = watchlistOutboxRows(watchlist);
  const queuedRows = queueRows.filter((row) => row.deliveryStatus === "queued");
  if (!queuedRows.length) {
    if (accountEl.deliveryWorkerStatus) {
      accountEl.deliveryWorkerStatus.textContent = "No queued alerts. Requeue at least one alert before running delivery worker.";
    }
    renderDeliveryWorkerRuns();
    return;
  }

  const runId = `run-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12)}-${Math.random().toString(36).slice(2, 5)}`;
  if (window.RentIntelAuth?.saveAlertDeliveryRun) {
    const startedAt = new Date().toISOString();
    const result = await window.RentIntelAuth.saveAlertDeliveryRun({
      runId,
      startedAt,
      queueRows
    });
    if (result.ok && result.data?.deliveryRun) {
      const outcomes = Array.isArray(result.data.deliveryRun.outcomes) ? result.data.deliveryRun.outcomes : [];
      outcomes.forEach((outcome) => {
        const sourceRow = queueRows.find((row) => row.recordId === outcome.recordId);
        if (!sourceRow) return;
        pushAlertHistoryEvent(composeAlertHistoryFromQueueRow(sourceRow, outcome.status, outcome.reason));
      });
      await hydrateAlertDeliveryState();
      if (accountEl.deliveryWorkerStatus) {
        accountEl.deliveryWorkerStatus.textContent =
          `Delivery worker completed: ${queuedRows.length} queued -> ${result.data.deliveryRun.sentCount || 0} sent, ${result.data.deliveryRun.failedCount || 0} failed, ${result.data.deliveryRun.deadLetterCount || 0} dead-letter, ${result.data.deliveryRun.skippedCount || 0} skipped.`;
      }
      renderWatchlist();
      renderMemberCommandCenter();
      return;
    }
  }

  const startedAt = new Date().toISOString();
  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let deadLetterCount = 0;
  const outcomes = [];
  queuedRows.forEach((row) => {
    const gap = Number(row.deliveryPayload?.gap || 0);
    const outcome = row.cadenceKey === "weekly" && Math.abs(gap) < 8
      ? {
        status: "skipped",
        reason: "Cadence hold: weekly rule skipped this cycle due to small gap movement."
      }
      : {
        status: "sent",
        reason: "Delivery worker sent this alert successfully."
      };
    const updatedRow = setAlertQueueStatus(row.recordId, outcome.status, outcome.reason, {
      failureCode: outcome.status === "failed" ? "provider-timeout" : ""
    });
    const finalStatus = updatedRow?.deliveryStatus || outcome.status;
    if (finalStatus === "sent") sentCount += 1;
    if (finalStatus === "failed") failedCount += 1;
    if (finalStatus === "skipped") skippedCount += 1;
    if (finalStatus === "dead-letter") deadLetterCount += 1;
    outcomes.push({
      recordId: row.recordId,
      area: row.area,
      status: finalStatus,
      reason: updatedRow?.lastReason || outcome.reason,
      retryCount: Number(updatedRow?.retryCount || 0),
      maxRetries: Number(updatedRow?.maxRetries || defaultAlertMaxRetries)
    });
  });

  const finishedAt = new Date().toISOString();
  const persistedRun = {
    id: `${runId}-${Date.now()}`,
    runId,
    memberEmail: normalizeEmail(currentSession?.email),
    startedAt,
    finishedAt,
    totalQueued: queuedRows.length,
    sentCount,
    failedCount,
    deadLetterCount,
    skippedCount,
    outcomes
  };
  const nextRuns = alertDeliveryRunsForCurrentMember();
  nextRuns.unshift(persistedRun);
  writeAlertDeliveryRunsForCurrentMember(nextRuns.slice(0, 100));
  await persistAlertDeliveryRun(persistedRun);
  if (accountEl.deliveryWorkerStatus) {
    accountEl.deliveryWorkerStatus.textContent =
      `Delivery worker completed: ${queuedRows.length} queued -> ${sentCount} sent, ${failedCount} failed, ${deadLetterCount} dead-letter, ${skippedCount} skipped.`;
  }
  renderWatchlist();
  renderMemberCommandCenter();
}

function alertDeliveryAdminLog() {
  return loadStoredJson(alertDeliveryAdminLogKey, []);
}

function alertDeliveryAdminLogForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return alertDeliveryAdminLog()
    .filter((entry) => !entry.memberEmail || normalizeEmail(entry.memberEmail) === email)
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
}

function writeAlertDeliveryAdminLogForCurrentMember(rows) {
  const email = normalizeEmail(currentSession?.email);
  const remaining = alertDeliveryAdminLog().filter((entry) => normalizeEmail(entry.memberEmail || email) !== email);
  writeStoredJson(alertDeliveryAdminLogKey, [...rows, ...remaining].slice(0, 400));
}

function pushAlertDeliveryAdminEvent(entry) {
  if (!entry) return;
  const events = alertDeliveryAdminLogForCurrentMember();
  events.unshift({
    id: `delivery-admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    memberEmail: normalizeEmail(currentSession?.email),
    at: new Date().toISOString(),
    ...entry
  });
  writeAlertDeliveryAdminLogForCurrentMember(events.slice(0, 200));
}

async function applyDeliveryAdminAction(recordId, actionType, reason, options = {}) {
  if (!sessionHasAccess(currentSession)) return null;
  const watchlist = watchlistForCurrentMember();
  const rows = watchlistOutboxRows(watchlist);
  const row = rows.find((entry) => entry.recordId === recordId);
  if (!row) return null;
  const record = rentRecordList().find((entry) => entry.id === recordId);
  const rule = alertRuleForRecord(recordId);
  let nextStatus = row.deliveryStatus;
  if (actionType === "requeue" || actionType === "resend") nextStatus = "queued";
  if (actionType === "acknowledge") nextStatus = "acknowledged";
  if (actionType === "dead-letter") nextStatus = "dead-letter";
  if (actionType === "suppress") nextStatus = "suppressed";
  if (actionType === "skip") nextStatus = "skipped";
  const updated = setAlertQueueStatus(recordId, nextStatus, reason, {
    record,
    rule,
    failureCode: options.failureCode || row.failureCode || ""
  });
  if (!updated) return null;
  const adminEntry = {
    actionType,
    recordId: updated.recordId,
    area: updated.area,
    title: updated.title,
    fromStatus: row.deliveryStatus,
    toStatus: updated.deliveryStatus,
    retryCount: Number(updated.retryCount || 0),
    maxRetries: Number(updated.maxRetries || defaultAlertMaxRetries),
    reason: reason || ""
  };
  pushAlertDeliveryAdminEvent(adminEntry);
  await persistAlertAdminAction(adminEntry);
  return updated;
}

async function applyBulkDeliveryAdminAction(fromStatuses, actionType, reason, options = {}) {
  if (!sessionHasAccess(currentSession)) return 0;
  const watchlist = watchlistForCurrentMember();
  const rows = watchlistOutboxRows(watchlist).filter((row) => fromStatuses.includes(row.deliveryStatus));
  let changed = 0;
  for (const row of rows) {
    const updated = await applyDeliveryAdminAction(row.recordId, actionType, reason, options);
    if (updated) changed += 1;
  }
  return changed;
}

function renderDeliveryAdminConsole() {
  if (!accountEl.deliveryAdminList || !accountEl.deliveryAdminAuditList) return;
  const hasAccess = sessionHasAccess(currentSession);
  const watchlist = watchlistForCurrentMember();
  const rows = watchlistOutboxRows(watchlist);
  const deliveredByRecord = new Map(alertDeliveredMessagesForCurrentMember().map((message) => [message.recordId, message]));
  const failedRows = rows.filter((row) => row.deliveryStatus === "failed");
  const deadRows = rows.filter((row) => row.deliveryStatus === "dead-letter");
  const suppressedRows = rows.filter((row) => row.deliveryStatus === "suppressed");
  const acknowledgedRows = rows.filter((row) => row.deliveryStatus === "acknowledged");
  const actionable = rows.filter((row) => ["failed", "dead-letter", "suppressed", "acknowledged"].includes(row.deliveryStatus));
  const audit = alertDeliveryAdminLogForCurrentMember();

  accountEl.deliveryAdminSummary.textContent = `${actionable.length} items`;
  accountEl.deliveryAdminFailedMetric.textContent = String(failedRows.length);
  accountEl.deliveryAdminDeadMetric.textContent = String(deadRows.length);
  accountEl.deliveryAdminSuppressedMetric.textContent = String(suppressedRows.length);
  if (accountEl.deliveryAdminAcknowledgedMetric) {
    accountEl.deliveryAdminAcknowledgedMetric.textContent = String(acknowledgedRows.length);
  }
  accountEl.deliveryAdminAuditMetric.textContent = String(audit.length);

  if (accountEl.deliveryAdminRequeueFailedButton) {
    accountEl.deliveryAdminRequeueFailedButton.disabled = !hasAccess || !failedRows.length;
  }
  if (accountEl.deliveryAdminRequeueDeadButton) {
    accountEl.deliveryAdminRequeueDeadButton.disabled = !hasAccess || !deadRows.length;
  }
  if (accountEl.deliveryAdminSuppressDeadButton) {
    accountEl.deliveryAdminSuppressDeadButton.disabled = !hasAccess || !deadRows.length;
  }
  if (accountEl.deliveryAdminAcknowledgeButton) {
    accountEl.deliveryAdminAcknowledgeButton.disabled = !hasAccess || !(failedRows.length || deadRows.length);
  }

  accountEl.deliveryAdminList.replaceChildren();
  if (!actionable.length) {
    const empty = document.createElement("p");
    empty.textContent = "No failed, dead-letter, suppressed, or acknowledged alerts.";
    accountEl.deliveryAdminList.append(empty);
  } else {
    actionable.slice(0, 12).forEach((row) => {
      const item = document.createElement("article");
      item.className = "delivery-admin-item";
      item.dataset.status = row.deliveryStatus;
      const title = document.createElement("strong");
      title.textContent = row.title;
      const detail = document.createElement("span");
      const freshnessTag = row.triggerKey === "freshness-breach" ? " | Freshness breach" : "";
      detail.textContent = `${alertDeliveryStatusLabel(row.deliveryStatus)} | Retry ${Number(row.retryCount || 0)}/${Number(row.maxRetries || defaultAlertMaxRetries)} | ${row.failureCode || "no code"}${freshnessTag}`;
      const note = document.createElement("small");
      const delivered = deliveredByRecord.get(row.recordId);
      note.textContent = delivered
        ? `${row.lastReason || "No reason captured."} Latest artifact: ${delivered.transportMode || "file"} / ${delivered.runId || "run missing"}.`
        : (row.lastReason || "No reason captured.");
      const actions = document.createElement("div");
      actions.className = "delivery-admin-item-actions";

      const acknowledge = document.createElement("button");
      acknowledge.type = "button";
      acknowledge.textContent = "Acknowledge";
      acknowledge.disabled = !hasAccess || row.deliveryStatus === "acknowledged";
      acknowledge.addEventListener("click", async () => {
        const updated = await applyDeliveryAdminAction(
          row.recordId,
          "acknowledge",
          "Admin acknowledged this alert for manual review."
        );
        if (!updated) return;
        accountEl.deliveryAdminStatus.textContent = `${row.area} acknowledged by admin.`;
        recordActivity("Delivery admin acknowledge", row.area);
        renderWatchlist();
        renderMemberCommandCenter();
      });

      const requeue = document.createElement("button");
      requeue.type = "button";
      requeue.textContent = "Resend";
      requeue.disabled = !hasAccess;
      requeue.addEventListener("click", async () => {
        const updated = await applyDeliveryAdminAction(
          row.recordId,
          "resend",
          "Admin resent this alert for the next delivery cycle."
        );
        if (!updated) return;
        accountEl.deliveryAdminStatus.textContent = `${row.area} resent by admin.`;
        recordActivity("Delivery admin resend", row.area);
        renderWatchlist();
        renderMemberCommandCenter();
      });

      const suppress = document.createElement("button");
      suppress.type = "button";
      suppress.textContent = row.deliveryStatus === "suppressed" ? "Unsuppress" : "Suppress";
      suppress.disabled = !hasAccess;
      suppress.addEventListener("click", async () => {
        const action = row.deliveryStatus === "suppressed" ? "requeue" : "suppress";
        const updated = await applyDeliveryAdminAction(
          row.recordId,
          action,
          row.deliveryStatus === "suppressed"
            ? "Admin removed suppression and requeued this alert."
            : "Admin suppressed this alert pending manual follow-up."
        );
        if (!updated) return;
        accountEl.deliveryAdminStatus.textContent = row.deliveryStatus === "suppressed"
          ? `${row.area} unsuppressed and requeued.`
          : `${row.area} suppressed by admin.`;
        recordActivity("Delivery admin suppress", row.area);
        renderWatchlist();
        renderMemberCommandCenter();
      });

      const toDead = document.createElement("button");
      toDead.type = "button";
      toDead.textContent = "Dead Letter";
      toDead.disabled = !hasAccess || row.deliveryStatus === "dead-letter";
      toDead.addEventListener("click", async () => {
        const updated = await applyDeliveryAdminAction(
          row.recordId,
          "dead-letter",
          "Admin moved this alert to dead-letter for manual resolution.",
          { failureCode: "admin-dead-letter" }
        );
        if (!updated) return;
        accountEl.deliveryAdminStatus.textContent = `${row.area} moved to dead-letter.`;
        recordActivity("Delivery admin dead-letter", row.area);
        renderWatchlist();
        renderMemberCommandCenter();
      });

      actions.append(acknowledge, requeue, suppress, toDead);
      item.append(title, detail, note, actions);
      accountEl.deliveryAdminList.append(item);
    });
  }

  accountEl.deliveryAdminAuditList.replaceChildren();
  if (!audit.length) {
    const empty = document.createElement("p");
    empty.textContent = "No delivery admin actions yet.";
    accountEl.deliveryAdminAuditList.append(empty);
    return;
  }
  audit.slice(0, 10).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "delivery-admin-audit-item";
    const title = document.createElement("strong");
    title.textContent = `${entry.actionType}: ${entry.title || entry.recordId}`;
    const detail = document.createElement("span");
    detail.textContent = `${alertDeliveryStatusLabel(entry.fromStatus || "queued")} -> ${alertDeliveryStatusLabel(entry.toStatus || "queued")} | Retry ${entry.retryCount || 0}/${entry.maxRetries || defaultAlertMaxRetries}`;
    const meta = document.createElement("small");
    meta.textContent = `${entry.reason || "No reason"} | ${formatDateTime(entry.at)}`;
    item.append(title, detail, meta);
    accountEl.deliveryAdminAuditList.append(item);
  });
}

function alertDeliveryHistory() {
  return loadStoredJson(alertDeliveryHistoryKey, []);
}

function alertDeliveryHistoryForCurrentMember() {
  const email = normalizeEmail(currentSession?.email);
  return alertDeliveryHistory()
    .filter((event) => !event.memberEmail || normalizeEmail(event.memberEmail) === email)
    .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
}

function composeAlertHistoryEvent({ record, rule = null, status = "queued", reason = "" }) {
  const target = rule?.targetPsf || watchlistTargetPsf(record);
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    memberEmail: normalizeEmail(currentSession?.email),
    recordId: record.id,
    title: record.title,
    area: record.area,
    status,
    trigger: alertTriggerLabel(rule?.trigger),
    cadence: alertCadenceLabel(rule?.cadence),
    targetPsf: target,
    askingPsf: record.asking,
    gap: record.gap,
    reason: reason || "Member alert event logged.",
    at: new Date().toISOString()
  };
}

function pushAlertHistoryEvent(event) {
  if (!event) return;
  const events = alertDeliveryHistory();
  events.unshift(event);
  writeStoredJson(alertDeliveryHistoryKey, events.slice(0, 300));
}

function renderAlertHistory() {
  if (!accountEl.alertHistoryList) return;
  const events = alertDeliveryHistoryForCurrentMember();
  const queuedCount = events.filter((event) => event.status === "queued").length;
  const sentCount = events.filter((event) => event.status === "sent").length;
  const skippedCount = events.filter((event) =>
    event.status === "skipped" || event.status === "suppressed" || event.status === "acknowledged"
  ).length;
  const failedCount = events.filter((event) => event.status === "failed" || event.status === "dead-letter").length;
  accountEl.alertHistoryCount.textContent = `${events.length} event${events.length === 1 ? "" : "s"}`;
  accountEl.alertHistoryQueuedMetric.textContent = String(queuedCount);
  accountEl.alertHistorySentMetric.textContent = String(sentCount);
  accountEl.alertHistorySkippedMetric.textContent = String(skippedCount);
  accountEl.alertHistoryFailedMetric.textContent = String(failedCount);
  accountEl.alertHistoryList.replaceChildren();

  if (!events.length) {
    const empty = document.createElement("p");
    empty.textContent = "No alert history yet.";
    accountEl.alertHistoryList.append(empty);
    return;
  }

  events.slice(0, 10).forEach((event) => {
    const item = document.createElement("article");
    item.className = "alert-history-item";
    item.dataset.status = event.status;

    const header = document.createElement("div");
    const status = document.createElement("mark");
    status.textContent = event.status;
    const title = document.createElement("strong");
    title.textContent = event.title;
    header.append(status, title);

    const detail = document.createElement("p");
    detail.textContent = event.reason;

    const meta = document.createElement("small");
    meta.textContent =
      `${event.trigger} | ${event.cadence} | ${money(event.targetPsf)} target | ${money(event.askingPsf)} asking | ${event.gap > 0 ? "+" : ""}${event.gap}% | ${formatDateTime(event.at)}`;

    item.append(header, detail, meta);
    accountEl.alertHistoryList.append(item);
  });
}

function renderWatchlistOutbox(watchlist) {
  if (!accountEl.watchlistOutboxItems) return;
  const rows = watchlistOutboxRows(watchlist);
  const deliveredByRecord = new Map(alertDeliveredMessagesForCurrentMember().map((message) => [message.recordId, message]));
  const queuedCount = rows.filter((row) => row.deliveryStatus === "queued").length;
  const failedCount = rows.filter((row) => row.deliveryStatus === "failed").length;
  const acknowledgedCount = rows.filter((row) => row.deliveryStatus === "acknowledged").length;
  const deadLetterCount = rows.filter((row) => row.deliveryStatus === "dead-letter").length;
  accountEl.watchlistOutboxCount.textContent =
    deadLetterCount
      ? `${queuedCount} queued / ${failedCount} failed / ${acknowledgedCount} acknowledged / ${deadLetterCount} dead-letter`
      : failedCount
        ? `${queuedCount} queued / ${failedCount} failed / ${acknowledgedCount} acknowledged`
        : `${queuedCount} queued / ${acknowledgedCount} acknowledged`;
  accountEl.watchlistOutboxItems.replaceChildren();

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = "No alert messages queued yet.";
    accountEl.watchlistOutboxItems.append(empty);
    return;
  }

  rows.slice(0, 4).forEach((row) => {
    const item = document.createElement("article");
    item.className = "watchlist-outbox-item";
    item.dataset.state = row.state;
    item.dataset.deliveryStatus = row.deliveryStatus;

    const header = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = `${row.status} | ${row.cadence}${row.triggerKey === "freshness-breach" ? " | Freshness" : ""}`;
    const title = document.createElement("strong");
    title.textContent = row.subject;
    header.append(label, title);

    const message = document.createElement("p");
    message.textContent = row.message;
    const meta = document.createElement("small");
    const retryMeta = `Retries: ${Number(row.retryCount || 0)}/${Number(row.maxRetries || defaultAlertMaxRetries)}`;
    const delivered = deliveredByRecord.get(row.recordId);
    const transportMeta = delivered ? ` | Last artifact: ${delivered.transportMode || "file"} via ${delivered.runId || "run missing"}` : "";
    const failureMeta = row.failureCode ? ` | Failure: ${row.failureCode}` : "";
    meta.textContent = `To: ${row.memberEmail} | Trigger: ${row.trigger} | ${retryMeta}. Last update: ${formatDateTime(row.updatedAt || row.queuedAt)}${row.freshnessLabel ? ` | Freshness: ${row.freshnessLabel}` : ""}${failureMeta}${transportMeta}`;

    const note = document.createElement("small");
    note.textContent = row.lastReason || "No delivery diagnostic captured yet.";

    const actions = document.createElement("div");
    actions.className = "watchlist-outbox-actions";
    const appendAction = (labelText, nextStatus, reasonText, failureCode = "") => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = labelText;
      button.addEventListener("click", () => {
        const record = rentRecordList().find((entry) => entry.id === row.recordId);
        const rule = alertRuleForRecord(row.recordId);
        const updatedRow = setAlertQueueStatus(row.recordId, nextStatus, reasonText, { record, rule, failureCode });
        const finalStatus = updatedRow?.deliveryStatus || nextStatus;
        accountEl.watchlistStatus.textContent = `${row.area} alert updated to ${alertDeliveryStatusLabel(finalStatus)}.`;
        renderWatchlist();
        renderMemberCommandCenter();
      });
      actions.append(button);
    };
    if (row.deliveryStatus === "queued") {
      appendAction("Mark Sent", "sent", "Delivery worker marked this alert as sent.");
      appendAction("Mark Failed", "failed", "Delivery worker marked this alert as failed.", "manual-failure");
      appendAction("Acknowledge", "acknowledged", "Operator acknowledged this alert for manual review.");
      appendAction("Skip", "skipped", "Delivery worker skipped this alert.");
    } else if (row.deliveryStatus === "failed") {
      appendAction("Resend", "queued", "Alert resent after failed delivery.");
      appendAction("Acknowledge", "acknowledged", "Operator acknowledged this failed alert.");
      appendAction("Skip", "skipped", "Delivery worker skipped this alert after failure.");
    } else if (row.deliveryStatus === "acknowledged") {
      appendAction("Resend", "queued", "Acknowledged alert resent for delivery.");
      appendAction("Suppress", "suppressed", "Acknowledged alert suppressed pending manual follow-up.");
    } else if (row.deliveryStatus === "dead-letter") {
      appendAction("Resend", "queued", "Dead-letter alert requeued by operator override.");
      appendAction("Acknowledge", "acknowledged", "Dead-letter alert acknowledged for manual resolution.");
      appendAction("Skip", "skipped", "Dead-letter alert archived as skipped.");
    } else if (row.deliveryStatus === "suppressed") {
      appendAction("Unsuppress", "queued", "Suppressed alert requeued by operator override.");
    } else {
      appendAction("Requeue", "queued", "Alert requeued for the next delivery cycle.");
    }

    item.append(header, message, meta, note, actions);
    accountEl.watchlistOutboxItems.append(item);
  });
}

function currentActivationRequest() {
  return activationRequests().find(
    (request) => normalizeEmail(request.email) === normalizeEmail(currentSession?.email || "")
  );
}

async function hydrateActivationRequest() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchMemberMe) return false;
  const result = await window.RentIntelAuth.fetchMemberMe();
  const request = result?.data?.activationRequest;
  if (!result.ok) return false;
  const remaining = activationRequests().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
  );
  if (request) {
    writeStoredJson(activationRequestsKey, [request, ...remaining].slice(0, 50));
  } else {
    writeStoredJson(activationRequestsKey, remaining);
  }
  renderActivationRequestPanel();
  renderMembershipTimeline();
  renderNextActionPanel();
  renderMemberCommandCenter();
  return true;
}

function memberFromRequestEmail(email) {
  return findMember(email) || {
    email,
    memberStatus: "Saved tools email",
    subscriptionStatus: "Waiting for member activation",
    access: "waitlist",
    role: "member",
    promoCode: "",
    toolsEnabled: false
  };
}

function defaultNotificationPreference() {
  return {
    dailyBrief: true,
    activationUpdates: true,
    watchlistAlerts: false,
    sourceSyncAlerts: false
  };
}

function currentNotificationPreference() {
  const saved = notificationPreferences().find(
    (preference) => normalizeEmail(preference.email) === normalizeEmail(currentSession?.email || "")
  );
  return {
    ...defaultNotificationPreference(),
    ...saved
  };
}

async function hydrateNotificationPreferences() {
  if (!currentSession?.email || !window.RentIntelAuth?.fetchMemberMe) return false;
  const result = await window.RentIntelAuth.fetchMemberMe();
  const preference = result?.data?.notificationPreferences;
  if (!result.ok || !preference) return false;
  const normalized = {
    email: currentSession.email,
    ...defaultNotificationPreference(),
    ...preference,
    updatedAt: preference.updatedAt || new Date().toISOString()
  };
  const existing = notificationPreferences().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
  );
  writeStoredJson(notificationPreferencesKey, [normalized, ...existing].slice(0, 50));
  renderNotificationPreferences();
  return true;
}

function latestApprovedSourceSync(approvedSources) {
  const approvedKeys = new Set(approvedSources.map(sourceCandidateKey));
  const approvedNames = new Set(approvedSources.map(sourceCandidateName));
  return sourceSyncRuns().find((sync) =>
    approvedKeys.has(sync.sourceKey) || approvedNames.has(sync.sourceName)
  ) || null;
}

function findMember(email) {
  return memberList().find((member) => normalizeEmail(member.email) === normalizeEmail(email));
}

function upsertJoinedMember(member) {
  const email = normalizeEmail(member.email);
  const joinedMembers = loadStoredJson(joinedMembersKey, []).filter(
    (item) => normalizeEmail(item.email) !== email
  );
  writeStoredJson(joinedMembersKey, [{ ...member, email }, ...joinedMembers].slice(0, 100));
}

function createLoginCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createSessionId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function writeSessionCookie(sessionId) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `rentintel_session=${encodeURIComponent(sessionId)}; Path=/; SameSite=Lax; Max-Age=604800${secure}`;
}

function clearSessionCookie() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `rentintel_session=; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

function sessionHasAccess(session) {
  return session?.access === "active" || session?.access === "promo" || session?.toolsEnabled === true;
}

function sessionHasFreeTools(session) {
  return Boolean(session?.email);
}

function freeToolsSession() {
  return {
    email: "free@rent-intel.com",
    memberStatus: "Free tools user",
    subscriptionStatus: "Free access active",
    access: "free",
    promoCode: "",
    toolsEnabled: false,
    signedInAt: new Date().toISOString()
  };
}

function sessionCanEditFreshnessPolicy(session = currentSession) {
  if (!sessionHasAccess(session)) return false;
  if (session?.role) return String(session.role).toLowerCase() === "admin";
  if (session?.isAdmin === true) return true;
  return freshnessPolicyAdminEmails.has(normalizeEmail(session?.email));
}

function accessStateForSession(session = currentSession) {
  if (!session?.email) {
    return {
      key: "free",
      label: "Free tools",
      title: "Free tools active",
      toolbench: "Free"
    };
  }
  if (session.access === "free") {
    return {
      key: "free",
      label: "Free tools",
      title: "Free tools active",
      toolbench: "Free"
    };
  }
  if (session.access === "promo") {
    return {
      key: "promo",
      label: "Pilot access",
      title: "Promo access active",
      toolbench: "Promo active"
    };
  }
  if (sessionHasAccess(session)) {
    return {
      key: "active",
      label: "Active workspace",
      title: "Saved tools ready",
      toolbench: "Active"
    };
  }
  return {
    key: "waitlist",
    label: "Free saved tools",
    title: "Workspace ready",
    toolbench: "Locked"
  };
}

function reportToRecord(report) {
  return rentRecordList().find((record) => record.id === report?.recordId) || null;
}

function intentToRecord(intent) {
  return rentRecordList().find((record) => record.id === intent?.recordId) || null;
}

function benchmarkTrustLabel(record, intent = {}) {
  const confidence = String(record?.confidence || intent.confidence || "").toLowerCase();
  if (record?.askingSource?.productionReady || confidence.includes("production")) return "Production verified";
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) return "Coverage pending";
  if (confidence.includes("comparable")) return "Comparable estimate";
  return "Direct benchmark";
}

function reportFilename(record) {
  return `${record.id}-rentintel-negotiation-note.txt`;
}

function reportExportFilename(record, extension) {
  return `${record?.id || "rentintel-report"}-rentintel-report-pack.${extension}`;
}

function fallbackPulseSummary(record) {
  if (!record) {
    return {
      label: "Pulse Summary",
      tone: "summary",
      title: "Select a saved rent report.",
      summary: "Pulse keeps the saved decision guide with each report.",
      warning: "No report context is selected.",
      nextStep: "Open a saved report.",
      caveat: "Pulse explains RentIntel's signal. It is not valuation advice."
    };
  }
  const highGap = Number(record.gap) >= 15;
  const source = record.askingSource || {};
  const productionReady = Boolean(source.productionReady) || String(record.confidence || "").toLowerCase().includes("production");
  if (highGap) {
    return {
      label: "Pulse Warning",
      tone: "warning",
      title: "Use this as a working position, not a final answer.",
      summary: `${record.confidence}. Asking rent is above the benchmark range.`,
      warning: productionReady
        ? "Production source is connected; unit terms still matter."
        : "Asking source is not production-ready.",
      nextStep: "Review trust, source split, and target psf before discussion.",
      caveat: "Pulse explains RentIntel's signal. It is not valuation advice."
    };
  }
  return {
    label: "Pulse Summary",
    tone: productionReady ? "summary" : "member",
    title: "Saved report is within the working range.",
    summary: `${record.confidence}. No large premium is flagged.`,
    warning: "Still confirm source state and lease terms.",
    nextStep: "Compare terms before accepting.",
    caveat: "Pulse explains RentIntel's signal. It is not valuation advice."
  };
}

function reportPulseSummary(report, record = reportToRecord(report)) {
  const pulse = report?.pulseSummary || report?.decisionPack?.pulse || fallbackPulseSummary(record);
  const compactSentence = (value, fallback) => {
    const text = String(value || fallback || "").trim();
    const sentence = text.match(/^[^.!?]+[.!?]/)?.[0] || text;
    return sentence.replace(/\s+/g, " ").trim();
  };
  const fallback = fallbackPulseSummary(record);
  const summary = compactSentence(pulse.summary || pulse.copy, fallback.summary);
  const warning = compactSentence(pulse.warning, fallback.warning);
  const nextStep = compactSentence(pulse.nextStep || pulse.next, fallback.nextStep);
  return {
    label: pulse.label || "Pulse Summary",
    tone: pulse.tone || "summary",
    title: pulse.title || "Saved Pulse summary",
    summary,
    warning,
    nextStep,
    caveat: pulse.caveat || "Pulse explains RentIntel's signal. It is not valuation advice."
  };
}

function negotiationNoteWithPulse(report, record = reportToRecord(report)) {
  if (!record) return "";
  const pulse = reportPulseSummary(report, record);
  const note = report?.negotiationNote || generateNegotiationNote(record);
  const baseNote = note.includes("\nPulse Summary\n")
    ? note.split("\nPulse Summary\n")[0].trimEnd()
    : note;
  return [
    baseNote,
    "",
    "Pulse Summary",
    `${pulse.label}: ${pulse.title}`,
    `Decision: ${pulse.summary}`,
    `Next: ${pulse.nextStep}`,
    pulse.caveat
  ].join("\n");
}

function selectedReportExportPayload() {
  const record = reportToRecord(selectedReport);
  if (!record || !selectedReport) return null;
  return {
    contract: "rentintel-member-report-pack",
    version: "prototype-v1",
    briefFormat: "rent-discussion-brief-v1",
    exportedAt: new Date().toISOString(),
    memberEmail: normalizeEmail(currentSession?.email),
    report: selectedReport,
    rentSignal: {
      recordId: record.id,
      title: record.title,
      decision: record.decision,
      reason: record.reason,
      official: record.official,
      asking: record.asking,
      fairRange: record.fairRange,
      gap: record.gap,
      action: record.action,
      sourceSummary: record.sourceSummary,
      confidence: record.confidence
    },
    evidencePack: reportEvidencePack(record, selectedReport),
    pulseSummary: reportPulseSummary(selectedReport, record),
    negotiationNote: negotiationNoteWithPulse(selectedReport, record)
  };
}

function selectedReportTxt(payload) {
  const signal = payload.rentSignal;
  const evidence = payload.evidencePack;
  const pack = payload.report?.decisionPack || {};
  const calculator = pack.calculator || {};
  const offer = pack.offer || {};
  const alert = pack.alert || {};
  const targetPsf = calculator.targetPsf || signal.fairRange?.high || signal.official;
  const offerPsf = offer.offerPsf || signal.fairRange?.low || signal.official;
  const walkAwayPsf = offer.walkAwayPsf || targetPsf;
  const targetMonthly = calculator.targetMonthly || null;
  const unitSize = calculator.unitSize || null;
  const alertLine = alert.triggerLabel
    ? `${alert.triggerLabel}${alert.cadenceLabel ? ` / ${alert.cadenceLabel}` : ""}`
    : "No alert rule saved";
  return [
    `RentIntel Rent Discussion Brief: ${signal.title}`,
    `Member: ${payload.memberEmail || "not signed in"}`,
    `Prepared: ${new Date(payload.exportedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}`,
    `Trust status: ${evidence.trust}`,
    "",
    "1. Decision",
    `Signal: ${signal.decision}`,
    `Reason: ${signal.reason}`,
    `Pulse: ${payload.pulseSummary.title}`,
    `Next: ${payload.pulseSummary.nextStep}`,
    "",
    "2. Rent position",
    `Official median: ${money(signal.official)}`,
    `Current asking: ${money(signal.asking)}`,
    `Fair range: ${moneyRange(signal.fairRange)}`,
    `Gap: ${signal.gap > 0 ? "+" : ""}${signal.gap}%`,
    `Working target: ${money(targetPsf)}`,
    "",
    "3. Evidence status",
    `Public trust: ${evidence.trust}`,
    `Benchmark basis: ${evidence.benchmark}`,
    `Asking source: ${evidence.asking}`,
    `Source note: ${evidence.askingCopy}`,
    `Trust note: ${evidence.trustCopy}`,
    "",
    "4. Pulse summary",
    `${payload.pulseSummary.label}: ${payload.pulseSummary.title}`,
    `Decision: ${payload.pulseSummary.summary}`,
    `Next: ${payload.pulseSummary.nextStep}`,
    "",
    "5. Negotiation position",
    `Offer position: ${money(offerPsf)}`,
    `Walk-away line: ${money(walkAwayPsf)}`,
    `Landlord discussion line: ${signal.action}`,
    unitSize ? `Unit size used: ${Number(unitSize).toLocaleString("en-SG")} sq ft` : "Unit size used: not saved",
    targetMonthly ? `Target monthly rent: ${dollars(targetMonthly)}` : "Target monthly rent: not saved",
    "",
    "6. Next steps",
    "Verify source state, lease terms, service charge, permitted use, and handover condition.",
    "Ask for comparable evidence if the landlord wants rent above the working target.",
    `Watch rule: ${alertLine}`,
    "",
    "7. Saved negotiation note",
    payload.negotiationNote
  ].join("\n");
}

function reportDecisionPackSummary(report) {
  const pack = report?.decisionPack;
  if (!pack) {
    return {
      size: "-",
      target: "-",
      offer: "-",
      alert: "-"
    };
  }
  const calculator = pack.calculator || {};
  const offer = pack.offer || {};
  const alert = pack.alert || {};
  return {
    size: calculator.unitSize ? `${Number(calculator.unitSize).toLocaleString("en-SG")} sq ft` : "-",
    target: calculator.targetMonthly ? dollars(calculator.targetMonthly) : "-",
    offer: offer.offerPsf ? `${money(offer.offerPsf)} / ${money(offer.walkAwayPsf)} walk-away` : "-",
    alert: alert.triggerLabel ? `${alert.triggerLabel} | ${alert.cadenceLabel || "Daily"}` : "-"
  };
}

function reportEvidencePack(record, report = {}) {
  if (!record) {
    return {
      trust: "-",
      trustCopy: "Saved report trust level will show here.",
      benchmark: "-",
      benchmarkCopy: "Official benchmark layer will show here.",
      asking: "-",
      askingCopy: "Asking source status will show here."
    };
  }
  const trust = report.saveMetadata?.sourceTrust || sourceTrustProfile(record);
  const source = record.askingSource || {};
  const productionReady = source.productionReady || String(record.confidence || "").toLowerCase().includes("production");
  return {
    trust: trust.title || report.saveMetadata?.benchmarkTrust || record.confidence,
    benchmarkTrust: trust.title || report.saveMetadata?.benchmarkTrust || record.confidence,
    noteStatus: "Note ready",
    sourceTrust: trust,
    trustCopy: `${trust.reason || "Trust level is based on source coverage."} ${trust.action || "Review evidence before committing."}`,
    benchmark: productionReady
      ? "Production benchmark"
      : record.prototypeSource === "coverage-request"
        ? "Coverage sample"
        : String(record.confidence || "").toLowerCase().includes("comparable")
          ? "Comparable benchmark"
          : "Direct benchmark",
    benchmarkCopy: record.sourceSummary || "Official benchmark and asking layers are stored with this report.",
    asking: source.sourceName || source.sourceType || "Asking signal",
    askingCopy: `${source.listingCount || 0} asking checks. Captured ${formatShortDate(source.capturedAt)}. Production ${productionReady ? "ready" : "not ready"}.`
  };
}

function generateNegotiationNote(record) {
  if (!record || !currentSession) return "";
  return [
    `RentIntel negotiation note: ${record.title}`,
    `Member: ${currentSession.email}`,
    `Generated: ${new Date().toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "Decision",
    `${record.decision} ${record.mobileSummary}`,
    "",
    "Rent position",
    `Official median: ${money(record.official)}`,
    `Current asking: ${money(record.asking)}`,
    `Fair range: ${moneyRange(record.fairRange)}`,
    `Gap: ${record.gap > 0 ? "+" : ""}${record.gap}%`,
    "",
    "Negotiation position",
    record.action,
    "",
    "Source split",
    record.sourceSummary,
    "",
    "Use this as a discussion note only. Confirm final terms, permitted use, frontage, fit-out condition, and legal/commercial advice before committing."
  ].join("\n");
}

function basicDecisionPack(record) {
  const unitSize = 1000;
  const targetPsf = record.fairRange?.high || record.official;
  const currentMonthly = record.asking * unitSize;
  const targetMonthly = targetPsf * unitSize;
  return {
    calculator: {
      unitSize,
      askingPsf: record.asking,
      targetPsf,
      currentMonthly,
      targetMonthly,
      monthlyImpact: currentMonthly - targetMonthly,
      annualImpact: (currentMonthly - targetMonthly) * 12
    },
    offer: {
      offerPsf: record.fairRange?.low || record.official,
      walkAwayPsf: targetPsf
    },
    alert: {
      trigger: "asking-falls-to-target",
      triggerLabel: "Asking rent falls to target",
      targetPsf,
      gapLimit: Math.max(record.gap, 20),
      cadence: "daily",
      cadenceLabel: "Daily"
    },
    pulse: fallbackPulseSummary(record)
  };
}

function chooseTodayBrief() {
  const records = rentRecordList();
  if (!records.length) return null;
  const start = new Date("2026-01-01T00:00:00+08:00").getTime();
  const day = Math.floor((Date.now() - start) / 86400000);
  return records[Math.abs(day) % records.length];
}

function sendCode(email, member, options = {}) {
  const remote = options.remote === true;
  const code = remote ? "" : createLoginCode();
  const debugCode = options.debugCode ? String(options.debugCode) : "";
  const expiresAt = options.expiresAt
    ? new Date(options.expiresAt).getTime()
    : Date.now() + 10 * 60 * 1000;
  writeStoredJson(pendingLoginKey, {
    email,
    code,
    remote,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + 10 * 60 * 1000
  });
  accountEl.codeStep.hidden = false;
  accountEl.codeInput.value = "";
  accountEl.codeInput.focus();
  accountEl.emailStatus.textContent =
    remote
      ? `Login code sent to ${options.maskedEmail || email}.${debugCode ? ` Prototype API code: ${debugCode}` : ""}`
      : `Login code sent to ${email}. Prototype test code: ${code}`;
  accountEl.codeStatus.textContent =
    member.access === "waitlist"
      ? "This email is on the list. Saved tools can open after verification."
      : "Enter the code to open your saved tools.";
}

function addJoinedMember(email) {
  const normalized = normalizeEmail(email);
  if (findMember(normalized)) {
    accountEl.joinStatus.textContent = `${normalized} is already on the saved-tools list. Request a login code.`;
    accountEl.emailInput.value = normalized;
    accountEl.joinPanel.hidden = true;
    return;
  }

  upsertJoinedMember({
    email: normalized,
    memberStatus: "Saved tools email",
    subscriptionStatus: "Free saved tools",
    access: "waitlist",
    role: "member",
    promoCode: "",
    toolsEnabled: false,
    joinedAt: new Date().toISOString()
  });
  accountEl.emailInput.value = normalized;
  accountEl.joinStatus.textContent = `${normalized} was added to saved tools. You can now request a login code.`;
  accountEl.emailStatus.textContent = "Saved-tools email added. Send a login code to continue.";
  recordActivity("Added saved-tools email", normalized);
}

function createSession(member) {
  const sessionId = member?.sessionId || member?.session_id || createSessionId();
  const email = normalizeEmail(member.email);
  const role = member.role || (freshnessPolicyAdminEmails.has(email) ? "admin" : "member");
  currentSession = {
    sessionId,
    email,
    memberStatus: member.memberStatus,
    subscriptionStatus: member.subscriptionStatus,
    access: member.access,
    promoCode: member.promoCode,
    role,
    isAdmin: role === "admin",
    toolsEnabled: member.toolsEnabled,
    signedInAt: new Date().toISOString()
  };
  if (window.RentIntelAuth?.saveSession) {
    window.RentIntelAuth.saveSession(currentSession);
  } else {
    writeStoredJson(memberSessionKey, currentSession);
  }
  writeSessionCookie(sessionId);
  localStorage.removeItem(pendingLoginKey);
  currentMember = currentSession;
  renderDashboard();
  hydrateSavedReports();
  hydrateWatchlistAndAlerts();
  hydrateAlertDeliveryState();
  hydrateNotificationPreferences();
  hydrateActivationRequest();
  hydrateMemberRegistryAndRoleAudit();
  hydrateSourceReviewState();
  hydrateBackendHandoffAuditState();
  hydrateAskingFeedState();
  hydrateSourceSyncState();
  recordActivity("Session created", `${currentSession.email} signed in as ${currentSession.memberStatus}.`);
  maybeContinueToNextPath(currentSession);
}

function memberFromApiPayload(payload, fallbackEmail = "") {
  const member = payload?.member || payload?.data || payload || {};
  const email = normalizeEmail(member.email || fallbackEmail);
  if (!email) return null;
  const role = memberRole({
    role: member.role || (member.isAdmin ? "admin" : "member")
  });
  return {
    email,
    sessionId: member.sessionId || member.session_id || "",
    memberStatus: member.memberStatus || member.member_status || "Member",
    subscriptionStatus: member.subscriptionStatus || member.subscription_status || "Status pending",
    access: member.access || "waitlist",
    role,
    promoCode: member.promoCode || member.promo_code || "",
    toolsEnabled: Boolean(member.toolsEnabled ?? member.tools_enabled)
  };
}

async function requestLoginCodeApiFirst(email, member) {
  if (!window.RentIntelAuth?.requestCode) return false;
  const result = await window.RentIntelAuth.requestCode(email);
  if (!result.ok) return false;
  const status = String(result.data?.status || "").toLowerCase();
  if (status.includes("unknown") || status.includes("not")) {
    accountEl.codeStep.hidden = true;
    accountEl.joinPanel.hidden = false;
    accountEl.joinEmail.value = email;
    accountEl.emailStatus.textContent = "This email is not on the saved-tools list. Add it first before requesting a login code.";
    return true;
  }
  sendCode(email, member, {
    remote: true,
    expiresAt: result.data?.expiresAt,
    maskedEmail: result.data?.maskedEmail,
    debugCode: result.data?.debugCode
  });
  return true;
}

async function verifyLoginCodeApiFirst(pendingEmail, code) {
  if (!window.RentIntelAuth?.verifyCode) return null;
  const result = await window.RentIntelAuth.verifyCode(pendingEmail, code);
  if (!result.ok) {
    accountEl.codeStatus.textContent = "Code verification failed. Check the code and try again.";
    return null;
  }
  const member = memberFromApiPayload(result.data, pendingEmail);
  if (!member) {
    accountEl.codeStatus.textContent = "Code verified but member profile is missing.";
    return null;
  }
  if (window.RentIntelAuth?.memberToSession && window.RentIntelAuth?.saveSession) {
    const apiSession = window.RentIntelAuth.memberToSession(member, pendingEmail);
    if (apiSession) window.RentIntelAuth.saveSession(apiSession);
  }
  createSession(member);
  return member;
}

function renderPublicIntent() {
  if (!accountEl.publicIntentPanel) return;
  const intent = pendingMemberIntent();
  if (!intent) {
    accountEl.publicIntentPanel.hidden = true;
    return;
  }

  const record = intentToRecord(intent);
  const title = record?.title || intent.title || "Saved public rent check";
  const asking = record ? money(record.asking) : intent.asking ? money(intent.asking) : "not available";
  const range = record ? moneyRange(record.fairRange) : moneyRange(intent.fairRange);
  const gap = record?.gap ?? intent.gap;
  const trust = benchmarkTrustLabel(record, intent);
  accountEl.publicIntentPanel.hidden = false;
  accountEl.publicIntentTitle.textContent = title;
  accountEl.publicIntentCopy.textContent =
    `${normalizeEmail(intent.email)} sent this public check from RentIntel. Continue the same rent signal into Workspace before deciding.`;
  accountEl.publicIntentAskingMetric.textContent = asking;
  accountEl.publicIntentRangeMetric.textContent = range;
  accountEl.publicIntentGapMetric.textContent = gap || gap === 0 ? `${gap > 0 ? "+" : ""}${gap}%` : "-";
  accountEl.publicIntentTrustMetric.textContent = trust;
  accountEl.openPublicIntentWorkspace.href = record
    ? workspaceHref({ rent: record.id, requireAuth: true })
    : workspaceHref({ requireAuth: true });
  const hasAccess = sessionHasAccess(currentSession);
  accountEl.requestPublicIntentButton.disabled = !currentSession || hasAccess;
  accountEl.savePublicIntentButton.disabled = !currentSession || !hasAccess || !record || Boolean(intent.savedAt);
  accountEl.publicIntentStatus.textContent = currentSession?.email
    ? intent.savedAt
      ? `Saved to member reports on ${formatShortDate(intent.savedAt)}.`
      : hasAccess
      ? "This context can be saved as a member report."
      : "Use this context to request activation for the rent check."
    : "Login with this email to preview the account and activation path.";

  if (!currentSession?.email) {
    accountEl.emailInput.value = normalizeEmail(intent.email);
    accountEl.joinEmail.value = normalizeEmail(intent.email);
  }
}

function requestPublicIntentActivation() {
  const intent = pendingMemberIntent();
  if (!intent || !currentSession) {
    accountEl.publicIntentStatus.textContent = "Login first to request activation from this rent check.";
    return;
  }
  if (sessionHasAccess(currentSession)) {
    accountEl.publicIntentStatus.textContent = "This account already has member tool access.";
    return;
  }

  const record = intentToRecord(intent);
  accountEl.activationPlan.value = "Member";
  accountEl.activationUseCase.value =
    `${record?.title || intent.title || "Public rent check"} - public free result handoff`;
  requestActivation();
  renderPublicIntent();
  accountEl.publicIntentStatus.textContent =
    "Activation request queued from the public rent-check context.";
}

async function savePublicIntentAsReport() {
  const intent = pendingMemberIntent();
  const record = intentToRecord(intent);
  if (!intent || !record) {
    accountEl.publicIntentStatus.textContent = "Public rent-check record is unavailable.";
    return;
  }
  if (!sessionHasFreeTools(currentSession)) {
    accountEl.publicIntentStatus.textContent =
      "Open the free saved tools session to save the public check as a report.";
    return;
  }
  await saveRecordAsReport(record);
  writeStoredJson(pendingMemberIntentKey, {
    ...intent,
    savedAt: new Date().toISOString()
  });
  renderPublicIntent();
  accountEl.publicIntentStatus.textContent = `${record.title} saved as a report.`;
}

function clearPublicIntent() {
  localStorage.removeItem(pendingMemberIntentKey);
  renderPublicIntent();
  recordActivity("Public handoff cleared", "Public free rent-check context removed.");
}

function savedReportTrustBucket(report) {
  const record = reportToRecord(report);
  const trustText = [
    report?.saveMetadata?.benchmarkTrust,
    report?.saveMetadata?.sourceTrust?.title,
    record?.confidence
  ].filter(Boolean).join(" ").toLowerCase();
  if (trustText.includes("production")) return "production";
  if (trustText.includes("comparable") || trustText.includes("estimate")) return "comparable";
  return "pilot";
}

function savedReportMatchesFilters(report) {
  const record = reportToRecord(report);
  const query = savedReportFilters.query.trim().toLowerCase();
  const searchable = [
    report?.title,
    report?.decision,
    record?.area,
    record?.propertyType,
    record?.sourceSummary
  ].filter(Boolean).join(" ").toLowerCase();
  const gap = Math.abs(Number(report?.gap ?? record?.gap ?? 0));
  const trust = savedReportTrustBucket(report);
  const queryMatch = !query || query.split(/\s+/).every((word) => searchable.includes(word));
  const trustMatch = savedReportFilters.trust === "all" || trust === savedReportFilters.trust;
  const gapMatch =
    savedReportFilters.gap === "all" ||
    (savedReportFilters.gap === "high" && gap >= 20) ||
    (savedReportFilters.gap === "watch" && gap >= 10);
  return queryMatch && trustMatch && gapMatch;
}

function filteredSavedReports(reports) {
  return reports.filter(savedReportMatchesFilters);
}

function renderSavedReports() {
  ensureBackendReportsMirrored();
  const allReports = savedReportsForCurrentMember();
  const reports = filteredSavedReports(allReports);
  accountEl.savedCount.textContent = reports.length === allReports.length
    ? `${allReports.length} saved`
    : `${reports.length}/${allReports.length} shown`;
  renderBackendReportMock();
  accountEl.savedReports.replaceChildren();

  if (!allReports.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = "No saved reports yet. Save any public result or workspace brief to build your report library.";
    accountEl.savedReports.append(empty);
    renderReportDetail(null);
    return;
  }

  if (!reports.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = "No saved reports match these filters. Broaden the filters or save a different area to compare.";
    accountEl.savedReports.append(empty);
    renderReportDetail(null);
    return;
  }

  if (!selectedReport || !reports.some((report) => report.recordId === selectedReport.recordId)) {
    selectedReport = reports[0];
  }

  reports.slice(0, 8).forEach((report) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "saved-report-item";
    item.dataset.recordId = report.recordId;
    item.dataset.selected = selectedReport?.recordId === report.recordId ? "true" : "false";

    const title = document.createElement("strong");
    title.textContent = report.title;
    const meta = document.createElement("span");
    meta.textContent = `${report.decision} | ${report.gap > 0 ? "+" : ""}${report.gap}% gap`;
    const detail = document.createElement("small");
    const saveMetadata = report.saveMetadata || {};
    const savedAt = report.savedAt
      ? new Date(report.savedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })
      : "Saved report";
    detail.textContent =
      `${saveMetadata.benchmarkTrust || report.confidence || "Saved"} | ${saveMetadata.noteStatus || "Note ready"} | ${savedAt}`;

    item.append(title, meta, detail);
    item.addEventListener("click", () => {
      selectedReport = report;
      renderSavedReports();
    });
    accountEl.savedReports.append(item);
  });
  renderReportDetail(selectedReport);
}

function renderBackendReportMock() {
  if (!accountEl.backendReportSummary) return;
  const email = normalizeEmail(currentSession?.email);
  const reports = backendSavedReports();
  const memberReports = reports.filter((report) => normalizeEmail(report.memberEmail) === email);
  accountEl.backendReportSummary.textContent =
    `Report store: ${memberReports.length} member reports / ${reports.length} total`;
  if (accountEl.syncBackendReportsButton) {
    accountEl.syncBackendReportsButton.disabled = !loadStoredJson(savedReportsKey, []).length;
  }
}

function renderReportDetail(report) {
  selectedReport = report;
  const record = reportToRecord(report);
  if (!record) {
    accountEl.reportDetailTitle.textContent = report?.title || "Select a saved report";
    accountEl.reportDetailDecision.textContent = report
      ? "This saved report is missing the source rent record."
      : "Save a report from the RentIntel Workspace to view the negotiation note.";
    accountEl.reportOfficialMetric.textContent = "-";
    accountEl.reportAskingMetric.textContent = "-";
    accountEl.reportFairRangeMetric.textContent = "-";
    accountEl.reportGapMetric.textContent = "-";
    accountEl.reportActionCopy.textContent = "Save one report from public search or workspace to keep the decision, fair range, and next move ready here.";
    accountEl.reportSourceCopy.textContent = "This panel becomes your saved benchmark basis, asking source read, and trust context after the first report is stored.";
    if (accountEl.reportPulseSummary) accountEl.reportPulseSummary.dataset.tone = "summary";
    if (accountEl.reportPulseLabel) accountEl.reportPulseLabel.textContent = "Pulse Summary";
    if (accountEl.reportPulseTitle) accountEl.reportPulseTitle.textContent = "Your first saved report will turn this into a reusable rent brief.";
    if (accountEl.reportPulseCopy) accountEl.reportPulseCopy.textContent = "Save one report from Workspace or public search to get a ready-made decision guide, warning, and next step.";
    if (accountEl.reportPulseNext) accountEl.reportPulseNext.textContent = "Best first move: save a result that you want to revisit or compare later.";
    accountEl.reportPackSizeMetric.textContent = "-";
    accountEl.reportPackTargetMetric.textContent = "-";
    accountEl.reportPackOfferMetric.textContent = "-";
    accountEl.reportPackAlertMetric.textContent = "-";
    accountEl.reportPackTrustMetric.textContent = "-";
    accountEl.reportPackTrustCopy.textContent = "The saved report trust level will appear after you store your first report.";
    accountEl.reportPackBenchmarkMetric.textContent = "-";
    accountEl.reportPackBenchmarkCopy.textContent = "The benchmark basis will appear after you save a report from search or workspace.";
    accountEl.reportPackAskingMetric.textContent = "-";
    accountEl.reportPackAskingCopy.textContent = "The asking-rent source status will appear after you save a report.";
    accountEl.openReportToolbenchButton.href = workspaceHref({ requireAuth: true });
    accountEl.watchReportAreaButton.disabled = true;
    accountEl.deleteReportButton.disabled = true;
    accountEl.previewReportExportButton.disabled = true;
    accountEl.downloadReportTxtButton.disabled = true;
    accountEl.downloadReportJsonButton.disabled = true;
    accountEl.reportDetailStatus.textContent = "";
    renderNegotiationNote(null);
    renderBackendHandoff();
    return;
  }

  accountEl.reportDetailTitle.textContent = record.title;
  accountEl.reportDetailDecision.textContent = `${record.decision} ${record.reason}`;
  accountEl.reportOfficialMetric.textContent = money(record.official);
  accountEl.reportAskingMetric.textContent = money(record.asking);
  accountEl.reportFairRangeMetric.textContent = moneyRange(record.fairRange);
  accountEl.reportGapMetric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  accountEl.reportActionCopy.textContent = record.action;
  accountEl.reportSourceCopy.textContent = record.sourceSummary;
  const packSummary = reportDecisionPackSummary(report);
  const evidencePack = reportEvidencePack(record, report);
  const pulseSummary = reportPulseSummary(report, record);
  if (accountEl.reportPulseSummary) accountEl.reportPulseSummary.dataset.tone = pulseSummary.tone;
  if (accountEl.reportPulseLabel) accountEl.reportPulseLabel.textContent = pulseSummary.label;
  if (accountEl.reportPulseTitle) accountEl.reportPulseTitle.textContent = pulseSummary.title;
  if (accountEl.reportPulseCopy) accountEl.reportPulseCopy.textContent = pulseSummary.summary;
  if (accountEl.reportPulseNext) accountEl.reportPulseNext.textContent = `Next: ${pulseSummary.nextStep}`;
  accountEl.reportPackSizeMetric.textContent = packSummary.size;
  accountEl.reportPackTargetMetric.textContent = packSummary.target;
  accountEl.reportPackOfferMetric.textContent = packSummary.offer;
  accountEl.reportPackAlertMetric.textContent = packSummary.alert;
  accountEl.reportPackTrustMetric.textContent = evidencePack.trust;
  accountEl.reportPackTrustCopy.textContent = evidencePack.trustCopy;
  accountEl.reportPackBenchmarkMetric.textContent = evidencePack.benchmark;
  accountEl.reportPackBenchmarkCopy.textContent = evidencePack.benchmarkCopy;
  accountEl.reportPackAskingMetric.textContent = evidencePack.asking;
  accountEl.reportPackAskingCopy.textContent = evidencePack.askingCopy;
  accountEl.openReportToolbenchButton.href = workspaceHref({
    report: report.reportId || record.id,
    requireAuth: true
  });
  accountEl.watchReportAreaButton.disabled = false;
  accountEl.deleteReportButton.disabled = false;
  accountEl.previewReportExportButton.disabled = false;
  accountEl.downloadReportTxtButton.disabled = false;
  accountEl.downloadReportJsonButton.disabled = false;
  accountEl.reportDetailStatus.textContent = report?.savedAt
    ? `Saved ${new Date(report.savedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}. ${report.saveMetadata?.benchmarkTrust || record.confidence}. ${report.saveMetadata?.noteStatus || "Note ready"}.`
    : "";
  renderNegotiationNote(report);
  renderBackendHandoff();
}

function renderNegotiationNote(report) {
  if (!accountEl.negotiationNoteText) return;
  const record = reportToRecord(report);
  const hasAccess = sessionHasAccess(currentSession);
  accountEl.negotiationNoteLabel.textContent = record
    ? hasAccess ? "Ready" : "Locked"
    : "Select report";
  accountEl.negotiationNoteText.value = record
    ? negotiationNoteWithPulse(report, record)
    : "Save or select a report to generate the negotiation note.";
  accountEl.copyNegotiationNoteButton.disabled = !record || !hasAccess;
  accountEl.downloadNegotiationNoteButton.disabled = !record || !hasAccess;
  accountEl.negotiationNoteStatus.textContent = record && !hasAccess
    ? "Export unlocks after active or promo access."
    : "";
}

async function copyNegotiationNote() {
  const record = reportToRecord(selectedReport);
  if (!record || !sessionHasAccess(currentSession)) {
    accountEl.negotiationNoteStatus.textContent = "Select a saved report with active member access first.";
    return;
  }

  const note = accountEl.negotiationNoteText.value;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(note);
    } else {
      accountEl.negotiationNoteText.select();
      document.execCommand("copy");
    }
    accountEl.negotiationNoteStatus.textContent = "Negotiation note copied.";
    recordActivity("Note copied", record.title);
  } catch (error) {
    accountEl.negotiationNoteText.focus();
    accountEl.negotiationNoteText.select();
    accountEl.negotiationNoteStatus.textContent = "Copy was blocked by the browser. Note text is selected.";
  }
}

function downloadNegotiationNote() {
  const record = reportToRecord(selectedReport);
  if (!record || !sessionHasAccess(currentSession)) {
    accountEl.negotiationNoteStatus.textContent = "Select a saved report with active member access first.";
    return;
  }

  const blob = new Blob([accountEl.negotiationNoteText.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = reportFilename(record);
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  accountEl.negotiationNoteStatus.textContent = `${reportFilename(record)} prepared.`;
  recordActivity("Note downloaded", record.title);
}

function downloadSelectedReport(format) {
  const record = reportToRecord(selectedReport);
  if (!record || !sessionHasAccess(currentSession)) {
    accountEl.reportDetailStatus.textContent = "Select a saved report with active member access first.";
    return;
  }
  const payload = selectedReportExportPayload();
  if (!payload) return;
  const isJson = format === "json";
  const text = isJson ? JSON.stringify(payload, null, 2) : selectedReportTxt(payload);
  const blob = new Blob([text], { type: isJson ? "application/json" : "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = reportExportFilename(record, isJson ? "json" : "txt");
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  accountEl.reportDetailStatus.textContent = `${link.download} prepared.`;
  recordActivity(isJson ? "Report JSON exported" : "Report TXT exported", record.title);
}

function openReportPreview() {
  const record = reportToRecord(selectedReport);
  if (!record || !sessionHasAccess(currentSession)) {
    accountEl.reportDetailStatus.textContent = "Select a saved report with active member access first.";
    return;
  }
  const payload = selectedReportExportPayload();
  if (!payload || !accountEl.reportPreviewModal) return;
  accountEl.reportPreviewTitle.textContent = `${payload.rentSignal.title} discussion brief`;
  accountEl.reportPreviewText.textContent = selectedReportTxt(payload);
  accountEl.reportPreviewModal.hidden = false;
  accountEl.reportDetailStatus.textContent =
    "Discussion brief preview opened. Review the decision, evidence status, target, offer, and saved note before export.";
}

function closeReportPreview() {
  if (accountEl.reportPreviewModal) accountEl.reportPreviewModal.hidden = true;
}

function backendHandoffRows() {
  const hasAccess = sessionHasAccess(currentSession);
  const reports = savedReportsForCurrentMember();
  const watchlist = watchlistForCurrentMember();
  const alertDeliveries = watchlistOutboxRows(watchlist);
  const queuedDeliveries = alertDeliveries.filter((delivery) => delivery.deliveryStatus === "queued").length;
  const failedDeliveries = alertDeliveries.filter((delivery) => delivery.deliveryStatus === "failed").length;
  const deadLetterDeliveries = alertDeliveries.filter((delivery) => delivery.deliveryStatus === "dead-letter").length;
  const suppressedDeliveries = alertDeliveries.filter((delivery) => delivery.deliveryStatus === "suppressed").length;
  const deliveryRuns = alertDeliveryRunsForCurrentMember();
  const deliveryAdminEvents = alertDeliveryAdminLogForCurrentMember();
  const roleAuditEvents = memberRoleAuditLogForCurrentMember();
  const preferences = currentNotificationPreference();
  const hasPreferenceRecord = notificationPreferences().some(
    (preference) => normalizeEmail(preference.email) === normalizeEmail(currentSession?.email)
  );
  const approvedSources = approvedAskingSources();
  const latestSync = latestApprovedSourceSync(approvedSources);
  const activationRequest = currentActivationRequest();

  return [
    {
      label: "Member identity",
      value: currentSession?.email || "No session",
      state: currentSession ? "ready" : "blocked",
      next: "Move member list, passwordless codes, and secure sessions into backend auth."
    },
    {
      label: "Access gate",
      value: hasAccess ? currentSession.access : "waitlist",
      state: hasAccess ? "ready" : "pending",
      next: "Connect subscription, promo, and waitlist status to a member entitlement table."
    },
    {
      label: "Saved reports",
      value: `${reports.length} saved`,
      state: reports.length ? "ready" : "pending",
      next: "Persist report records by member email, record id, generated note, and saved timestamp."
    },
    {
      label: "Watchlist alerts",
      value: `${watchlist.length} watching`,
      state: watchlist.length ? "ready" : "pending",
      next: "Persist watched areas and connect alert triggers to daily benchmark changes."
    },
    {
      label: "Alert delivery queue",
      value: `${queuedDeliveries} queued${failedDeliveries ? ` / ${failedDeliveries} failed` : ""}${deadLetterDeliveries ? ` / ${deadLetterDeliveries} dead-letter` : ""}${suppressedDeliveries ? ` / ${suppressedDeliveries} suppressed` : ""}`,
      state: alertDeliveries.length ? "ready" : "pending",
      next: "Persist queued alert messages, retry counters, dead-letter outcomes, and worker status transitions."
    },
    {
      label: "Delivery worker runs",
      value: `${deliveryRuns.length} recorded`,
      state: deliveryRuns.length ? "ready" : "pending",
      next: "Persist delivery run summaries so retries and alert SLA checks are auditable."
    },
    {
      label: "Delivery admin actions",
      value: `${deliveryAdminEvents.length} logged`,
      state: deliveryAdminEvents.length ? "ready" : "pending",
      next: "Persist requeue, dead-letter, and suppression actions with operator audit metadata."
    },
    {
      label: "Role governance audit",
      value: `${roleAuditEvents.length} logged`,
      state: roleAuditEvents.length ? "ready" : "pending",
      next: "Persist admin/member role changes with actor, target, and timestamp."
    },
    {
      label: "Negotiation note",
      value: selectedReport ? "generated" : "select report",
      state: selectedReport ? "ready" : "pending",
      next: "Store generated export notes and make downloads auditable by member."
    },
    {
      label: "Notification preferences",
      value: hasPreferenceRecord
        ? `${[
            preferences.dailyBrief,
            preferences.activationUpdates,
            hasAccess && preferences.watchlistAlerts,
            hasAccess && preferences.sourceSyncAlerts
          ].filter(Boolean).length} enabled`
        : "default only",
      state: hasPreferenceRecord ? "ready" : "pending",
      next: "Move email preferences to backend so alerts survive browser changes."
    },
    {
      label: "Activation queue",
      value: activationRequest ? activationRequest.status : hasAccess ? "not needed" : "not requested",
      state: activationRequest || hasAccess ? "ready" : "pending",
      next: "Route activation requests into admin review before payment is connected."
    },
    {
      label: "Asking rent source sync",
      value: latestSync
        ? `${latestSync.sourceName}: ${latestSync.recordsChecked} checked`
        : productionEvidenceReady()
          ? "production evidence ready"
          : `${approvedSources.length} approved`,
      state: latestSync || productionEvidenceReady() ? "ready" : approvedSources.length ? "pending" : "blocked",
      next: productionEvidenceReady()
        ? "Persist production source evidence and release productionReady through backend controls."
        : "Replace pilot local sync with scheduled source ingestion and validation logs."
    }
  ];
}

function backendTableMapRows() {
  return [
    {
      table: "members",
      payload: "member",
      key: "email",
      status: "required",
      note: "Stores member identity, status, access level, role, promo code, and tool entitlement."
    },
    {
      table: "member_saved_reports",
      payload: "reports[]",
      key: "member.email + recordId",
      status: "required",
      note: "Stores saved report state, decision pack, generated note, and saved timestamp."
    },
    {
      table: "member_watchlist_areas",
      payload: "watchlist[]",
      key: "member.email + recordId",
      status: "required",
      note: "Stores watched rent areas that future alert jobs should evaluate."
    },
    {
      table: "member_alert_rules",
      payload: "alertRules[]",
      key: "member.email + recordId + trigger",
      status: "required",
      note: "Stores trigger, target psf, gap limit, cadence, and alert condition copy."
    },
    {
      table: "member_alert_deliveries",
      payload: "alertDeliveries[]",
      key: "member.email + recordId + queuedAt",
      status: "required",
      note: "Stores queued, sent, skipped, failed, and dead-letter alert messages with retry metadata."
    },
    {
      table: "member_alert_delivery_runs",
      payload: "alertDeliveryRuns[]",
      key: "member.email + runId",
      status: "required",
      note: "Stores each delivery worker batch run with sent, failed, skipped counts and item outcomes."
    },
    {
      table: "member_alert_delivery_admin_log",
      payload: "alertDeliveryAdminLog[]",
      key: "member.email + actionId",
      status: "required",
      note: "Stores admin queue actions (requeue, suppress, dead-letter moves) for audit and rollback review."
    },
    {
      table: "member_role_audit_log",
      payload: "memberRoleAuditLog[]",
      key: "member.email + actedAt + targetEmail",
      status: "required",
      note: "Stores member/admin role transitions with actor, target, previous role, next role, and reason."
    },
    {
      table: "member_notification_preferences",
      payload: "notificationPreferences",
      key: "member.email",
      status: "required",
      note: "Stores daily brief, activation, watchlist, and source-sync notification settings."
    },
    {
      table: "member_activation_requests",
      payload: "activationRequest",
      key: "email + requestedAt",
      status: "pilot",
      note: "Stores waitlist-to-member upgrade requests before payment is connected."
    },
    {
      table: "asking_source_candidates",
      payload: "askingSourceCandidates[]",
      key: "name + type + requestedQuery",
      status: "pilot",
      note: "Stores proposed asking-rent source feeds and public coverage requests for pilot review."
    },
    {
      table: "source_sync_runs",
      payload: "sourceSyncRuns[]",
      key: "sourceName + at",
      status: "pilot",
      note: "Stores pilot source sync checks, record counts, status, and benchmark layer."
    },
    {
      table: "source_sync_schedule",
      payload: "sourceSyncAutomation",
      key: "sourceName",
      status: "pilot",
      note: "Stores scheduled sync cadence, run-hour policy, last run state, next run timestamp, and automation owner."
    },
    {
      table: "source_freshness_policy",
      payload: "freshnessPolicy",
      key: "updatedAt",
      status: "pilot",
      note: "Stores Fresh/Watch/Stale SLA thresholds that drive breach checks and public/member freshness labels."
    },
    {
      table: "source_freshness_breach_events",
      payload: "sourceFreshnessBreaches[]",
      key: "sourceName + breachAt",
      status: "pilot",
      note: "Stores freshness-breach transition events, queue trigger context, and run correlation for delivery audit."
    },
    {
      table: "asking_source_production_evidence",
      payload: "productionSourceEvidence",
      key: "sourceName + sourceAttachedAt",
      status: "production-gate",
      note: "Stores production source attachment, QA log timestamp, source-owner review, readiness gate, and remaining handoff tasks."
    },
    {
      table: "backend_handoff_audit",
      payload: "handoff",
      key: "member.email + generatedAt",
      status: "audit",
      note: "Stores readiness rows, validation summary, and handoff review history."
    }
  ];
}

function backendApiRouteRows() {
  return [
    {
      method: "POST",
      path: "/api/members/login/request-code",
      tables: "members, login_codes",
      purpose: "Create a short-lived passwordless login code for a known member email."
    },
    {
      method: "POST",
      path: "/api/members/login/verify-code",
      tables: "members, login_codes, sessions",
      purpose: "Verify the login code and issue a secure session cookie."
    },
    {
      method: "GET",
      path: "/api/members/me",
      tables: "members, sessions, member_notification_preferences",
      purpose: "Load member status, subscription status, promo state, and Workspace access."
    },
    {
      method: "GET",
      path: "/api/members/roles/audit",
      tables: "member_role_audit_log",
      purpose: "Load member role-change audit events for admin review."
    },
    {
      method: "POST",
      path: "/api/members/roles",
      tables: "members, member_role_audit_log",
      purpose: "Update a member role and persist actor, target, and reason in the role-audit log."
    },
    {
      method: "POST",
      path: "/api/members/promo/apply",
      tables: "members, promo_codes",
      purpose: "Apply a valid promo code and update member access."
    },
    {
      method: "POST",
      path: "/api/members/activation-requests",
      tables: "member_activation_requests",
      purpose: "Queue a waitlist-to-member activation request before payment is connected."
    },
    {
      method: "GET",
      path: "/api/members/reports",
      tables: "member_saved_reports",
      purpose: "Load saved report decision packs and negotiation notes."
    },
    {
      method: "POST",
      path: "/api/members/reports",
      tables: "member_saved_reports",
      purpose: "Save report decision packs and negotiation notes."
    },
    {
      method: "DELETE",
      path: "/api/members/reports/{recordId}",
      tables: "member_saved_reports",
      purpose: "Remove one saved report for the signed-in member."
    },
    {
      method: "GET",
      path: "/api/members/watchlist",
      tables: "member_watchlist_areas",
      purpose: "Load watched rent areas."
    },
    {
      method: "POST",
      path: "/api/members/watchlist",
      tables: "member_watchlist_areas",
      purpose: "Save watched rent areas."
    },
    {
      method: "POST",
      path: "/api/members/alerts",
      tables: "member_alert_rules, member_watchlist_areas",
      purpose: "Save alert trigger, target psf, gap limit, cadence, and condition."
    },
    {
      method: "GET",
      path: "/api/members/alerts/deliveries",
      tables: "member_alert_deliveries, member_alert_rules",
      purpose: "Load queued, sent, skipped, failed, dead-letter, and suppressed alert delivery records."
    },
    {
      method: "POST",
      path: "/api/members/alerts/queue-delivery",
      tables: "member_alert_deliveries, member_alert_rules, member_notification_preferences",
      purpose: "Queue one member-facing alert message with retry metadata before email delivery is attempted."
    },
    {
      method: "GET",
      path: "/api/members/alerts/delivery-runs",
      tables: "member_alert_delivery_runs",
      purpose: "Load delivery worker run logs with status totals and item outcomes."
    },
    {
      method: "POST",
      path: "/api/members/alerts/delivery-runs",
      tables: "member_alert_delivery_runs, member_alert_deliveries",
      purpose: "Persist one delivery worker run and update alert delivery statuses."
    },
    {
      method: "GET",
      path: "/api/members/alerts/admin-actions",
      tables: "member_alert_delivery_admin_log",
      purpose: "Load delivery admin queue actions for audit and review."
    },
    {
      method: "POST",
      path: "/api/members/alerts/admin-actions",
      tables: "member_alert_delivery_admin_log, member_alert_deliveries",
      purpose: "Persist one delivery admin action and apply its delivery status transition."
    },
    {
      method: "POST",
      path: "/api/members/preferences",
      tables: "member_notification_preferences",
      purpose: "Save daily brief, activation, watchlist, and source-sync notification settings."
    },
    {
      method: "GET",
      path: "/api/sources/asking-feed",
      tables: "asking_source_production_evidence",
      purpose: "Load the current asking-rent feed state used by public pages and member tools."
    },
    {
      method: "GET",
      path: "/api/sources/asking-candidates",
      tables: "asking_source_candidates, coverage_sample_records",
      purpose: "Load asking-rent source candidates and linked pilot coverage sample records for source ops review."
    },
    {
      method: "POST",
      path: "/api/sources/asking-feed/refresh",
      tables: "asking_source_production_evidence, source_sync_runs",
      purpose: "Run the verified daily capture workflow and persist a refreshed asking-rent feed snapshot."
    },
    {
      method: "POST",
      path: "/api/sources/asking-candidates",
      tables: "asking_source_candidates",
      purpose: "Submit an asking-rent source candidate for pilot review."
    },
    {
      method: "GET",
      path: "/api/sources/coverage-requests",
      tables: "asking_source_candidates, coverage_sample_records",
      purpose: "Load coverage requests with classification state, QA decision, and linked pilot sample records."
    },
    {
      method: "PATCH",
      path: "/api/sources/coverage-requests/{candidateId}/classification",
      tables: "asking_source_candidates, source_review_history",
      purpose: "Persist coverage request classification before any public sample is created."
    },
    {
      method: "POST",
      path: "/api/sources/coverage-requests/{candidateId}/qa-decision",
      tables: "asking_source_candidates, source_review_history",
      purpose: "Persist coverage QA outcome, fit checks, and readiness notes."
    },
    {
      method: "POST",
      path: "/api/sources/coverage-requests/{candidateId}/sample-record",
      tables: "coverage_sample_records, asking_source_candidates, source_review_history",
      purpose: "Persist one pilot coverage sample record and link it back to the reviewed coverage request."
    },
    {
      method: "POST",
      path: "/api/sources/sync-runs",
      tables: "source_sync_runs",
      purpose: "Record source sync checks, QA status, and benchmark comparison."
    },
    {
      method: "GET",
      path: "/api/sources/sync-schedule",
      tables: "source_sync_schedule, source_freshness_policy",
      purpose: "Load source sync cadence, next-run contract, and freshness SLA policy."
    },
    {
      method: "POST",
      path: "/api/sources/sync-schedule",
      tables: "source_sync_schedule, source_review_history",
      purpose: "Persist source sync cadence, run-hour policy, and schedule ownership for backend automation workers."
    },
    {
      method: "POST",
      path: "/api/sources/freshness-policy",
      tables: "source_freshness_policy, source_review_history",
      purpose: "Persist Freshness SLA policy used by public/member/source checks and freshness-breach alerting."
    },
    {
      method: "POST",
      path: "/api/sources/freshness-breach-events",
      tables: "source_freshness_breach_events, member_alert_deliveries",
      purpose: "Persist freshness transition events and queue metadata when source freshness drops from Fresh."
    },
    {
      method: "GET",
      path: "/api/sources/production-evidence",
      tables: "asking_source_production_evidence",
      purpose: "Load production asking-source evidence, release log, and controlled-release state."
    },
    {
      method: "POST",
      path: "/api/sources/production-evidence",
      tables: "asking_source_production_evidence",
      purpose: "Persist production asking-source evidence, source trust, QA log, source-owner review, readiness gate, exceptions, release log, and controlled-release status."
    },
    {
      method: "GET",
      path: "/api/backend/handoff-audit",
      tables: "backend_handoff_audit",
      purpose: "Load the latest backend handoff audit package and validation history for the signed-in member."
    },
    {
      method: "POST",
      path: "/api/backend/handoff-audit",
      tables: "backend_handoff_audit",
      purpose: "Persist generated payload, validation rows, and handoff summary."
    }
  ];
}

function backendRouteMockRows() {
  return backendApiRouteRows().map((route) => {
    const request = route.method === "GET"
      ? `GET ${route.path}`
      : JSON.stringify(Object.fromEntries(
          route.purpose
            .split(" ")
            .slice(0, 2)
            .map((word, index) => [`field${index + 1}`, word.toLowerCase().replace(/[^a-z0-9]/g, "") || "value"])
        ));
    return {
      method: route.method,
      path: route.path,
      mockUrl: `../../backend/routes/#${slugify(route.method)}-${slugify(route.path)}`,
      purpose: route.purpose,
      tables: route.tables,
      request,
      response: route.method === "DELETE" ? "{ removed: true }" : "{ ok: true, data: {} }"
    };
  });
}

function backendImplementationRows() {
  return backendApiRouteRows().map((route) => {
    const isLogin = route.path.includes("/login/");
    const isRead = route.method.includes("GET");
    const isDelete = route.method.includes("DELETE");
    const isSource = route.path.includes("/sources/");
    const isAudit = route.path.includes("/backend/");
    const phase = isLogin || route.path === "/api/members/me" ? "auth-first" :
      isSource || isAudit ? "ops-pilot" :
        "member-data";
    return {
      route: route.path,
      method: route.method,
      phase,
      auth: isLogin ? "email-code" : "session-cookie",
      operation: isDelete ? "delete" : isRead ? "read" : "write",
      tables: route.tables,
      acceptance: isLogin
        ? "Code creation/verification must expire, consume once, and never expose raw code storage."
        : isRead
          ? "Response must filter records by signed-in member email."
          : "Request must validate member access and persist by signed-in member email.",
      priority: phase === "auth-first" ? "P0" : phase === "member-data" ? "P1" : "P2"
    };
  });
}

function backendPayload() {
  const email = normalizeEmail(currentSession?.email);
  ensureBackendReportsMirrored();
  const allReports = backendSavedReports();
  const allAlertRules = loadStoredJson(alertRulesKey, []);
  const rows = backendHandoffRows();
  const sourceProductionEvidence = sourceProductionEvidencePackage();
  const watchlist = watchlistForCurrentMember();
  const alertDeliveries = watchlistOutboxRows(watchlist);
  const alertDeliveryRuns = alertDeliveryRunsForCurrentMember();
  const alertDeliveryAdminLog = alertDeliveryAdminLogForCurrentMember();
  const memberRoleAuditLog = memberRoleAuditLogForCurrentMember();
  const sourceSyncSchedule = sourceSyncAutomation();
  const sourceFreshnessBreaches = sourceFreshnessBreachEvents();
  return {
    contract: "rentintel-member-backend-payload",
    version: "prototype-v1.1-sync-automation",
    generatedAt: new Date().toISOString(),
    member: {
      email,
      status: currentSession?.memberStatus || "",
      subscriptionStatus: currentSession?.subscriptionStatus || "",
      access: currentSession?.access || "none",
      role: memberRole(currentSession),
      toolsEnabled: Boolean(currentSession?.toolsEnabled),
      promoCode: currentSession?.promoCode || ""
    },
    reports: allReports.filter((report) => normalizeEmail(report.memberEmail || email) === email),
    watchlist,
    alertRules: allAlertRules.filter((rule) => normalizeEmail(rule.memberEmail || email) === email),
    alertDeliveries,
    alertDeliveryRuns,
    alertDeliveryAdminLog,
    memberRoleAuditLog,
    notificationPreferences: currentNotificationPreference(),
    activationRequest: currentActivationRequest(),
    askingSourceCandidates: askingSourceCandidates(),
    sourceSyncRuns: sourceSyncRuns(),
    sourceSyncAutomation: sourceSyncSchedule,
    sourceFreshnessBreaches,
    freshnessPolicy: freshnessPolicy(),
    sourceProductionEvidence,
    sourceAdminQueue: sourceAdminQueueRows(),
    sourceHistory: sourceHistoryEvents(),
    sourceTrust: sourceTrustRecordRows(),
    targetTables: backendTableMapRows(),
    targetApis: backendApiRouteRows(),
    backendRouteMocks: backendRouteMockRows(),
    implementationChecklist: backendImplementationRows(),
    handoff: {
      summary: `${rows.filter((row) => row.state === "ready").length}/${rows.length} ready`,
      rows
    }
  };
}

function sourceProductionEvidencePackage() {
  const evidence = productionEvidence();
  const gate = askingFeedReadinessGate();
  const handoff = askingFeedProductionTasks();
  const qa = askingFeedQaSummary();
  return {
    storageKey: productionEvidenceKey,
    sourceName: evidence.sourceName || "",
    sourceType: evidence.sourceType || "",
    sourceAttachedAt: evidence.sourceAttachedAt || "",
    qaLogAt: evidence.qaLogAt || "",
    ownerReviewedAt: evidence.ownerReviewedAt || "",
    evidenceReady: productionEvidenceReady(evidence),
    pilotFeed: {
      connectionState: window.RENTINTEL_ASKING_RENT_FEED?.connectionState || "",
      sourceName: window.RENTINTEL_ASKING_RENT_FEED?.sourceName || "",
      updatedAt: window.RENTINTEL_ASKING_RENT_FEED?.updatedAt || "",
      productionReady: Boolean(window.RENTINTEL_ASKING_RENT_FEED?.productionReady)
    },
    qaSummary: qa,
    qaRows: askingFeedQaRows(),
    readinessGate: gate,
    sourceTrust: sourceTrustProfile(),
    opsReview: productionOpsReview(),
    releaseLog: productionReleaseLogPackage(),
    exceptionAlerts: sourceExceptionAlerts(),
    handoffTasks: handoff.tasks,
    controlledReleaseNextStep: gate.ready
      ? productionReleaseLogPackage().status === "Released"
        ? "Production release logged. Keep scheduled ingestion and exception alerts under review."
        : "Persist this evidence server-side, verify scheduled ingestion, then set productionReady in a controlled release."
      : "Resolve readiness blockers before backend promotion."
  };
}

function coverageWorkflowPackageRows() {
  return coverageRequestEntries().map(({ candidate }) => {
    const stage = coverageStageState(candidate);
    return {
      sourceKey: sourceCandidateKey(candidate),
      requestedQuery: candidate.requestedQuery || "",
      requestEmail: candidate.requestEmail || "",
      status: candidate.status || "candidate review",
      stage: stage.productionReady
        ? "production-ready"
        : stage.synced
          ? "pilot-synced"
          : stage.sampleReady
            ? "sample-created"
            : stage.approved
              ? "approved"
              : stage.rejected
                ? "rejected"
                : "requested",
      requestedAt: candidate.addedAt || "",
      reviewedAt: candidate.reviewedAt || "",
      sampleRecordId: candidate.sampleRecordId || "",
      sampleRecordCreatedAt: candidate.sampleRecordCreatedAt || "",
      sourceSyncedAt: candidate.sourceSyncedAt || "",
      productionReadyAt: candidate.productionReadyAt || "",
      source: candidate.source || "public-search-no-match"
    };
  });
}

function backendHandoffPackage() {
  const memberPayload = backendPayload();
  const coverageRows = coverageWorkflowPackageRows();
  const validationRows = backendPayloadValidationRows(memberPayload);
  const productionReadyCount = coverageRows.filter((row) => row.stage === "production-ready").length;
  return {
    contract: "rentintel-backend-handoff-package",
    version: "prototype-v2",
    generatedAt: new Date().toISOString(),
    generatedBy: currentSession?.email || "local-prototype",
    manifest: {
      purpose: "Single package for member backend, source sync, public coverage queue, and implementation handoff.",
      packageSections: [
        "memberPayload",
        "alertDeliveryContract",
        "alertDeliveryRuns",
        "alertDeliveryAdminLog",
        "memberRoleAuditLog",
        "sourceSyncAutomation",
        "sourceFreshnessBreaches",
        "freshnessPolicy",
        "sourceProductionEvidence",
        "coverageWorkflow",
        "coveragePrototypeRecords",
        "sourceSyncRuns",
        "publicToolbenchPreview",
        "backendContracts",
        "backendRouteMocks",
        "implementationSequence"
      ],
      storageMode: "localStorage prototype",
      paymentMode: "deferred"
    },
    readiness: {
      validationRows,
      memberPayloadSummary: memberPayload.handoff?.summary || "",
      coverage: {
        total: coverageRows.length,
        pending: coverageRows.filter((row) => row.stage === "requested").length,
        approved: coverageRows.filter((row) => row.stage === "approved").length,
        sampleCreated: coverageRows.filter((row) => row.stage === "sample-created").length,
        pilotSynced: coverageRows.filter((row) => row.stage === "pilot-synced").length,
        productionReady: productionReadyCount,
        rejected: coverageRows.filter((row) => row.stage === "rejected").length
      },
      sourceSyncRuns: sourceSyncRuns().length,
      sourceSyncAutomationEnabled: Boolean(memberPayload.sourceSyncAutomation?.enabled),
      sourceFreshnessBreaches: (memberPayload.sourceFreshnessBreaches || []).length,
      productionEvidenceReady: productionEvidenceReady(),
      productionEvidenceGate: sourceProductionEvidencePackage().readinessGate,
      sourceTrust: sourceTrustProfile(),
      sourceAdminQueue: sourceAdminQueueRows().length,
      sourceHistory: sourceHistoryEvents().length,
      coveragePrototypeRecords: coveragePrototypeRecords().length,
      deliveryRuns: (memberPayload.alertDeliveryRuns || []).length,
      deliveryAdminActions: (memberPayload.alertDeliveryAdminLog || []).length,
      roleAuditEvents: (memberPayload.memberRoleAuditLog || []).length
    },
    memberPayload,
    alertDeliveryContract: {
      table: "member_alert_deliveries",
      routes: [
        "/api/members/alerts/deliveries",
        "/api/members/alerts/queue-delivery",
        "/api/members/alerts/delivery-runs"
      ],
      deliveryStatuses: ["queued", "sent", "skipped", "failed", "dead-letter", "suppressed"],
      queued: memberPayload.alertDeliveries || []
    },
    alertDeliveryRuns: memberPayload.alertDeliveryRuns || [],
    alertDeliveryAdminLog: memberPayload.alertDeliveryAdminLog || [],
    memberRoleAuditLog: memberPayload.memberRoleAuditLog || [],
    sourceProductionEvidence: sourceProductionEvidencePackage(),
    coverageWorkflow: coverageRows,
    coveragePrototypeRecords: coveragePrototypeRecords(),
    sourceSyncRuns: sourceSyncRuns(),
    sourceSyncAutomation: memberPayload.sourceSyncAutomation || {},
    sourceFreshnessBreaches: memberPayload.sourceFreshnessBreaches || [],
    freshnessPolicy: memberPayload.freshnessPolicy || {},
    publicToolbenchPreview: {
      localStorageKey: toolbenchPreviewRecordKey,
      route: "/members/toolbench/?rent={recordId}",
      purpose: "Carries the selected public result into locked Workspace Preview before login or activation.",
      productionReplacement: "Persist preview intent server-side or encode a signed short-lived preview token."
    },
    backendContracts: {
      schemaPath: "data/sources/backend-schema.sql",
      apiContractPath: "data/sources/backend-api-contract.json",
      fieldMapPath: "data/sources/field-map.json",
      sourceContractPath: "data/sources/rentintel-source-contract.json",
      tables: backendTableMapRows(),
      apiRoutes: backendApiRouteRows(),
      routeMockPath: "backend/routes/index.html",
      routeMocks: backendRouteMockRows(),
      implementationChecklist: backendImplementationRows()
    },
    implementationSequence: [
      "Create backend tables and indexes from backend-schema.sql.",
      "Implement passwordless member session routes first.",
      "Support public-to-Workspace preview handoff for /members/toolbench/?rent={recordId}.",
      "Replace rentintelBackendSavedReports with /members/reports persistence.",
      "Replace askingSourceCandidates localStorage with /sources/asking-candidates.",
      "Persist production source evidence with /sources/production-evidence before setting productionReady.",
      "Ingest production-ready coverage rows into the asking-rent source queue.",
      "Run source sync jobs and store source_sync_runs.",
      "Persist source sync cadence in source_sync_schedule and trigger freshness-breach events when freshness drops from Fresh.",
      "Enable row-level/member-email access controls before live member rollout."
    ]
  };
}

function backendPayloadValidationRows(payload) {
  const reportDecisionPacks = payload.reports.filter((report) => report.decisionPack);
  const watchRecordIds = new Set(payload.watchlist.map((item) => item.recordId));
  const unmatchedAlerts = payload.alertRules.filter((rule) => !watchRecordIds.has(rule.recordId));
  const deliveryRecordIds = new Set((payload.alertDeliveries || []).map((delivery) => delivery.recordId));
  const unmatchedDeliveries = (payload.alertDeliveries || []).filter((delivery) => !watchRecordIds.has(delivery.recordId));
  const deliveryRulesMissing = payload.alertRules.filter((rule) => !deliveryRecordIds.has(rule.recordId));
  const sourceReady = payload.sourceProductionEvidence?.evidenceReady ||
    payload.askingSourceCandidates.some((candidate) => candidate.status === "approved for pilot") ||
    payload.sourceSyncRuns.length > 0;
  return [
    {
      label: "Member identity",
      state: payload.member.email ? "pass" : "fail",
      detail: payload.member.email || "Missing member email"
    },
    {
      label: "Payload contract",
      state: payload.contract === "rentintel-member-backend-payload" && payload.version ? "pass" : "fail",
      detail: `${payload.contract || "missing"} | ${payload.version || "missing version"}`
    },
    {
      label: "Saved reports",
      state: payload.reports.length ? "pass" : "warn",
      detail: `${payload.reports.length} reports, ${reportDecisionPacks.length} with decision packs`
    },
    {
      label: "Decision pack coverage",
      state: payload.reports.length === reportDecisionPacks.length ? "pass" : payload.reports.length ? "warn" : "warn",
      detail: payload.reports.length
        ? `${payload.reports.length - reportDecisionPacks.length} legacy reports need refresh`
        : "No saved reports to validate"
    },
    {
      label: "Watch and alert alignment",
      state: unmatchedAlerts.length ? "warn" : "pass",
      detail: unmatchedAlerts.length
        ? `${unmatchedAlerts.length} alert rules do not have a matching watchlist record`
        : `${payload.watchlist.length} watch records aligned`
    },
    {
      label: "Alert delivery contract",
      state: unmatchedDeliveries.length ? "warn" : "pass",
      detail: unmatchedDeliveries.length
        ? `${unmatchedDeliveries.length} queued deliveries do not match a watchlist record`
        : `${payload.alertDeliveries?.length || 0} delivery messages ready; ${deliveryRulesMissing.length} alert rules without queue rows`
    },
    {
      label: "Delivery worker runs",
      state: (payload.alertDeliveryRuns || []).length ? "pass" : "warn",
      detail: (payload.alertDeliveryRuns || []).length
        ? `${payload.alertDeliveryRuns.length} delivery runs logged`
        : "No delivery run logs recorded yet"
    },
    {
      label: "Delivery admin audit",
      state: (payload.alertDeliveryAdminLog || []).length ? "pass" : "warn",
      detail: (payload.alertDeliveryAdminLog || []).length
        ? `${payload.alertDeliveryAdminLog.length} admin actions logged`
        : "No delivery admin actions logged yet"
    },
    {
      label: "Role audit trail",
      state: (payload.memberRoleAuditLog || []).length ? "pass" : "warn",
      detail: (payload.memberRoleAuditLog || []).length
        ? `${payload.memberRoleAuditLog.length} role changes logged`
        : "No role changes logged yet"
    },
    {
      label: "Notification preferences",
      state: payload.notificationPreferences ? "pass" : "fail",
      detail: payload.notificationPreferences ? "Preference object ready" : "Missing preference object"
    },
    {
      label: "Source pipeline",
      state: sourceReady ? "pass" : "warn",
      detail: sourceReady
        ? payload.sourceProductionEvidence?.evidenceReady
          ? `${payload.sourceProductionEvidence.sourceName} production evidence ready`
          : `${payload.askingSourceCandidates.length} candidates, ${payload.sourceSyncRuns.length} sync runs`
        : "No approved asking source or sync run yet"
    },
    {
      label: "Sync automation contract",
      state: payload.sourceSyncAutomation?.enabled ? "pass" : "warn",
      detail: payload.sourceSyncAutomation?.enabled
        ? `${payload.sourceSyncAutomation.cadence || "daily"} cadence, next run ${payload.sourceSyncAutomation.nextRunAt ? formatDateTime(payload.sourceSyncAutomation.nextRunAt) : "not set"}`
        : "Source sync automation is paused"
    },
    {
      label: "Freshness breach audit",
      state: Array.isArray(payload.sourceFreshnessBreaches) ? "pass" : "fail",
      detail: Array.isArray(payload.sourceFreshnessBreaches)
        ? `${payload.sourceFreshnessBreaches.length} breach events logged`
        : "Missing breach event payload"
    },
    {
      label: "Production evidence",
      state: payload.sourceProductionEvidence?.evidenceReady ? "pass" : "warn",
      detail: payload.sourceProductionEvidence?.evidenceReady
        ? `${payload.sourceProductionEvidence.sourceName} | ${payload.sourceProductionEvidence.readinessGate.passed}/${payload.sourceProductionEvidence.readinessGate.total} gate checks`
        : `${payload.sourceProductionEvidence?.readinessGate?.passed || 0}/${payload.sourceProductionEvidence?.readinessGate?.total || 5} gate checks; evidence not complete`
    },
    {
      label: "Handoff rows",
      state: payload.handoff?.rows?.length ? "pass" : "fail",
      detail: payload.handoff?.summary || "Missing handoff summary"
    }
  ];
}

function renderBackendValidation(rows) {
  if (!accountEl.backendValidationGrid) return;
  accountEl.backendValidationGrid.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "payload-validation-item";
    item.dataset.state = row.state;

    const copy = document.createElement("span");
    const label = document.createElement("strong");
    label.textContent = row.label;
    const detail = document.createElement("small");
    detail.textContent = row.detail;
    copy.append(label, detail);

    const state = document.createElement("mark");
    state.textContent = row.state;
    item.append(copy, state);
    accountEl.backendValidationGrid.append(item);
  });
}

function renderBackendTableMap() {
  if (!accountEl.backendTableMapList) return;
  const rows = backendTableMapRows();
  accountEl.backendTableMapSummary.textContent = `${rows.length} tables mapped`;
  accountEl.backendTableMapList.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "backend-table-map-item";
    item.dataset.status = row.status;

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = row.table;
    const detail = document.createElement("small");
    detail.textContent = row.note;
    copy.append(title, detail);

    const payload = document.createElement("em");
    payload.textContent = row.payload;
    const key = document.createElement("code");
    key.textContent = row.key;
    const status = document.createElement("mark");
    status.textContent = row.status;

    item.append(copy, payload, key, status);
    accountEl.backendTableMapList.append(item);
  });
}

function renderBackendApiMap() {
  if (!accountEl.backendApiMapList) return;
  const rows = backendApiRouteRows();
  accountEl.backendApiMapSummary.textContent = `${rows.length} routes mapped`;
  accountEl.backendApiMapList.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "backend-api-map-item";
    item.dataset.method = row.method.split("/")[0].toLowerCase();

    const copy = document.createElement("span");
    const route = document.createElement("strong");
    route.textContent = row.path;
    const purpose = document.createElement("small");
    purpose.textContent = row.purpose;
    copy.append(route, purpose);

    const method = document.createElement("mark");
    method.textContent = row.method;
    const tables = document.createElement("em");
    tables.textContent = row.tables;

    item.append(copy, method, tables);
    accountEl.backendApiMapList.append(item);
  });
}

function renderBackendRouteMocks() {
  if (!accountEl.backendRouteMockList) return;
  const rows = backendRouteMockRows();
  accountEl.backendRouteMockSummary.textContent = `${rows.length} mocks`;
  accountEl.backendRouteMockList.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "backend-route-mock-item";
    item.dataset.method = row.method.toLowerCase();

    const copy = document.createElement("span");
    const link = document.createElement("a");
    link.href = row.mockUrl;
    link.textContent = row.path;
    const detail = document.createElement("small");
    detail.textContent = row.purpose;
    copy.append(link, detail);

    const method = document.createElement("mark");
    method.textContent = row.method;
    const tables = document.createElement("em");
    tables.textContent = row.tables;

    item.append(copy, method, tables);
    accountEl.backendRouteMockList.append(item);
  });
}

function renderBackendImplementationChecklist() {
  if (!accountEl.backendImplementationList) return;
  const rows = backendImplementationRows();
  const p0Count = rows.filter((row) => row.priority === "P0").length;
  const p1Count = rows.filter((row) => row.priority === "P1").length;
  accountEl.backendImplementationSummary.textContent = `${rows.length} items | ${p0Count} P0 | ${p1Count} P1`;
  accountEl.backendImplementationList.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "backend-implementation-item";
    item.dataset.priority = row.priority.toLowerCase();

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = row.route;
    const detail = document.createElement("small");
    detail.textContent = row.acceptance;
    copy.append(title, detail);

    const method = document.createElement("mark");
    method.textContent = row.method;
    const phase = document.createElement("em");
    phase.textContent = `${row.priority} | ${row.phase} | ${row.auth}`;

    item.append(copy, method, phase);
    accountEl.backendImplementationList.append(item);
  });
}

function validateBackendPayload() {
  let payload;
  try {
    payload = accountEl.backendPayloadText?.value?.trim().startsWith("{")
      ? JSON.parse(accountEl.backendPayloadText.value)
      : backendPayload();
  } catch (error) {
    accountEl.backendPayloadSummary.textContent = "Invalid JSON";
    accountEl.backendHandoffStatus.textContent = "Backend payload JSON could not be parsed.";
    renderBackendValidation([
      {
        label: "Payload JSON",
        state: "fail",
        detail: "Textarea content is not valid JSON"
      }
    ]);
    return null;
  }
  const rows = backendPayloadValidationRows(payload);
  renderBackendValidation(rows);
  const failCount = rows.filter((row) => row.state === "fail").length;
  const warnCount = rows.filter((row) => row.state === "warn").length;
  accountEl.backendPayloadSummary.textContent =
    failCount ? `${failCount} failed | ${warnCount} warnings` : `${warnCount} warnings | payload valid`;
  accountEl.backendHandoffStatus.textContent = failCount
    ? "Backend payload validation failed. Resolve required fields before handoff."
    : warnCount
      ? "Backend payload is structurally valid with warnings."
      : "Backend payload passed validation.";
  recordActivity("Backend payload validated", accountEl.backendPayloadSummary.textContent);
  return { payload, rows };
}

function sqlText(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "null";
}

function sqlBoolean(value) {
  return value ? "true" : "false";
}

function sqlJson(value) {
  return `${sqlText(JSON.stringify(value || {}))}::jsonb`;
}

function normalizedActivationStatus(status) {
  if (status === "approved" || status === "rejected") return status;
  return "pending review";
}

function normalizedAskingSourceStatus(status) {
  if (status === "approved for pilot" || status === "rejected") return status;
  return "pending review";
}

function backendSeedSql(payload) {
  const validationRows = backendPayloadValidationRows(payload);
  const lines = [
    "-- RentIntel member backend seed generated from prototype payload",
    `-- Generated at ${payload.generatedAt}`,
    "begin;",
    "",
    "insert into public.members (email, member_status, subscription_status, access, member_role, tools_enabled, promo_code, updated_at)",
    `values (${sqlText(payload.member.email)}, ${sqlText(payload.member.status)}, ${sqlText(payload.member.subscriptionStatus)}, ${sqlText(payload.member.access)}, ${sqlText(payload.member.role || "member")}, ${sqlBoolean(payload.member.toolsEnabled)}, ${sqlText(payload.member.promoCode)}, now())`,
    "on conflict (email) do update set",
    "  member_status = excluded.member_status,",
    "  subscription_status = excluded.subscription_status,",
    "  access = excluded.access,",
    "  member_role = excluded.member_role,",
    "  tools_enabled = excluded.tools_enabled,",
    "  promo_code = excluded.promo_code,",
    "  updated_at = now();",
    ""
  ];

  payload.reports.forEach((report) => {
    lines.push(
      "insert into public.member_saved_reports (member_email, record_id, title, decision, asking, official, gap, decision_pack, negotiation_note, saved_at, updated_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(report.recordId)}, ${sqlText(report.title)}, ${sqlText(report.decision)}, ${sqlNumber(report.asking)}, ${sqlNumber(report.official)}, ${sqlNumber(report.gap)}, ${sqlJson(report.decisionPack)}, ${sqlText(report.negotiationNote)}, ${sqlText(report.savedAt)}, now())`,
      "on conflict (member_email, record_id) do update set",
      "  title = excluded.title,",
      "  decision = excluded.decision,",
      "  asking = excluded.asking,",
      "  official = excluded.official,",
      "  gap = excluded.gap,",
      "  decision_pack = excluded.decision_pack,",
      "  negotiation_note = excluded.negotiation_note,",
      "  saved_at = excluded.saved_at,",
      "  updated_at = now();",
      ""
    );
  });

  payload.watchlist.forEach((item) => {
    lines.push(
      "insert into public.member_watchlist_areas (member_email, record_id, area, added_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(item.recordId)}, ${sqlText(item.area)}, ${sqlText(item.addedAt)})`,
      "on conflict (member_email, record_id) do update set",
      "  area = excluded.area,",
      "  added_at = excluded.added_at;",
      ""
    );
  });

  payload.alertRules.forEach((rule) => {
    lines.push(
      "insert into public.member_alert_rules (member_email, record_id, area, title, trigger, target_psf, gap_limit, cadence, condition, saved_at, updated_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(rule.recordId)}, ${sqlText(rule.area)}, ${sqlText(rule.title)}, ${sqlText(rule.trigger)}, ${sqlNumber(rule.targetPsf)}, ${sqlNumber(rule.gapLimit)}, ${sqlText(rule.cadence)}, ${sqlText(rule.condition)}, ${sqlText(rule.savedAt)}, now())`,
      "on conflict (member_email, record_id, trigger) do update set",
      "  area = excluded.area,",
      "  title = excluded.title,",
      "  target_psf = excluded.target_psf,",
      "  gap_limit = excluded.gap_limit,",
      "  cadence = excluded.cadence,",
      "  condition = excluded.condition,",
      "  saved_at = excluded.saved_at,",
      "  updated_at = now();",
      ""
    );
  });

  (payload.alertDeliveries || []).forEach((delivery) => {
    lines.push(
      "insert into public.member_alert_deliveries (member_email, record_id, subject, message, trigger, cadence, status, delivery_channel, delivery_payload, queued_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(delivery.recordId)}, ${sqlText(delivery.subject)}, ${sqlText(delivery.message)}, ${sqlText(delivery.triggerKey || delivery.trigger)}, ${sqlText(delivery.cadenceKey || delivery.cadence)}, ${sqlText(delivery.deliveryStatus || "queued")}, ${sqlText(delivery.deliveryChannel || "email")}, ${sqlJson(delivery.deliveryPayload)}, ${sqlText(delivery.queuedAt || payload.generatedAt)});`,
      ""
    );
  });

  (payload.alertDeliveryRuns || []).forEach((run) => {
    lines.push(
      "insert into public.member_alert_delivery_runs (member_email, run_id, total_queued, sent_count, failed_count, skipped_count, outcomes_payload, started_at, finished_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(run.runId || run.id)}, ${sqlNumber(run.totalQueued)}, ${sqlNumber(run.sentCount)}, ${sqlNumber(run.failedCount)}, ${sqlNumber(run.skippedCount)}, ${sqlJson(run.outcomes || [])}, ${sqlText(run.startedAt || payload.generatedAt)}, ${sqlText(run.finishedAt || payload.generatedAt)});`,
      ""
    );
  });

  (payload.alertDeliveryAdminLog || []).forEach((entry) => {
    lines.push(
      "insert into public.member_alert_delivery_admin_log (member_email, action_type, record_id, area, title, from_status, to_status, retry_count, max_retries, reason, action_payload, acted_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(entry.actionType)}, ${sqlText(entry.recordId)}, ${sqlText(entry.area)}, ${sqlText(entry.title)}, ${sqlText(entry.fromStatus)}, ${sqlText(entry.toStatus)}, ${sqlNumber(entry.retryCount)}, ${sqlNumber(entry.maxRetries)}, ${sqlText(entry.reason)}, ${sqlJson(entry)}, ${sqlText(entry.at || payload.generatedAt)});`,
      ""
    );
  });

  (payload.memberRoleAuditLog || []).forEach((entry) => {
    lines.push(
      "insert into public.member_role_audit_log (member_email, actor_email, target_email, previous_role, next_role, reason, audit_payload, acted_at)",
      `values (${sqlText(payload.member.email)}, ${sqlText(entry.actorEmail || payload.member.email)}, ${sqlText(entry.targetEmail)}, ${sqlText(entry.previousRole || "member")}, ${sqlText(entry.nextRole || "member")}, ${sqlText(entry.reason)}, ${sqlJson(entry)}, ${sqlText(entry.at || payload.generatedAt)});`,
      ""
    );
  });

  if (payload.notificationPreferences) {
    lines.push(
      "insert into public.member_notification_preferences (member_email, daily_brief, activation_updates, watchlist_alerts, source_sync_alerts, updated_at)",
      `values (${sqlText(payload.member.email)}, ${sqlBoolean(payload.notificationPreferences.dailyBrief)}, ${sqlBoolean(payload.notificationPreferences.activationUpdates)}, ${sqlBoolean(payload.notificationPreferences.watchlistAlerts)}, ${sqlBoolean(payload.notificationPreferences.sourceSyncAlerts)}, now())`,
      "on conflict (member_email) do update set",
      "  daily_brief = excluded.daily_brief,",
      "  activation_updates = excluded.activation_updates,",
      "  watchlist_alerts = excluded.watchlist_alerts,",
      "  source_sync_alerts = excluded.source_sync_alerts,",
      "  updated_at = now();",
      ""
    );
  }

  if (payload.activationRequest) {
    lines.push(
      "insert into public.member_activation_requests (email, plan, use_case, status, requested_at)",
      `values (${sqlText(payload.activationRequest.email)}, ${sqlText(payload.activationRequest.plan)}, ${sqlText(payload.activationRequest.useCase)}, ${sqlText(normalizedActivationStatus(payload.activationRequest.status))}, ${sqlText(payload.activationRequest.requestedAt)});`,
      ""
    );
  }

  payload.askingSourceCandidates.forEach((candidate) => {
    lines.push(
      "insert into public.asking_source_candidates (name, type, status, submitted_by, requested_query, request_email, source, request_payload, submitted_at)",
      `values (${sqlText(candidate.name)}, ${sqlText(candidate.type)}, ${sqlText(normalizedAskingSourceStatus(candidate.status))}, ${sqlText(candidate.requestEmail || payload.member.email)}, ${sqlText(candidate.requestedQuery || "")}, ${sqlText(candidate.requestEmail || "")}, ${sqlText(candidate.source || "member-account")}, ${sqlJson(candidate)}, ${sqlText(candidate.addedAt || candidate.submittedAt)});`,
      ""
    );
  });

  payload.sourceSyncRuns.forEach((sync) => {
    lines.push(
      "insert into public.source_sync_runs (source_name, source_type, source_key, benchmark_layer, records_checked, status, run_payload, ran_at)",
      `values (${sqlText(sync.sourceName)}, ${sqlText(sync.sourceType)}, ${sqlText(sync.sourceKey || "")}, ${sqlText(sync.benchmarkLayer)}, ${sqlNumber(sync.recordsChecked)}, ${sqlText(sync.status)}, ${sqlJson(sync)}, ${sqlText(sync.at)});`,
      ""
    );
  });

  if (payload.sourceProductionEvidence?.sourceName) {
    const evidence = payload.sourceProductionEvidence;
    lines.push(
      "insert into public.asking_source_production_evidence (source_name, source_type, source_attached_at, qa_log_at, owner_reviewed_at, evidence_ready, pilot_connection_state, pilot_source_name, pilot_updated_at, pilot_production_ready, qa_summary, qa_rows, readiness_gate, source_trust, ops_review, exception_alerts, exception_alert_count, release_status, release_queued_at, released_by, handoff_tasks, controlled_release_next_step, submitted_by, submitted_at, released_at, release_note, rollback_at, rollback_reason, release_log)",
      `values (${sqlText(evidence.sourceName)}, ${sqlText(evidence.sourceType)}, ${sqlText(evidence.sourceAttachedAt)}, ${sqlText(evidence.qaLogAt)}, ${sqlText(evidence.ownerReviewedAt)}, ${sqlBoolean(evidence.evidenceReady)}, ${sqlText(evidence.pilotFeed?.connectionState)}, ${sqlText(evidence.pilotFeed?.sourceName)}, ${sqlText(evidence.pilotFeed?.updatedAt)}, ${sqlBoolean(evidence.pilotFeed?.productionReady)}, ${sqlJson(evidence.qaSummary)}, ${sqlJson(evidence.qaRows)}, ${sqlJson(evidence.readinessGate)}, ${sqlJson(evidence.sourceTrust)}, ${sqlJson(evidence.opsReview)}, ${sqlJson(evidence.exceptionAlerts)}, ${sqlNumber(evidence.exceptionAlerts?.total)}, ${sqlText(evidence.releaseLog?.status)}, ${sqlText(evidence.releaseLog?.queuedAt)}, ${sqlText(evidence.releaseLog?.releasedBy)}, ${sqlJson(evidence.handoffTasks)}, ${sqlText(evidence.controlledReleaseNextStep)}, ${sqlText(payload.member.email)}, ${sqlText(payload.generatedAt)}, ${sqlText(evidence.releaseLog?.releasedAt)}, ${sqlText(evidence.releaseLog?.releaseNote)}, ${sqlText(evidence.releaseLog?.rollbackAt)}, ${sqlText(evidence.releaseLog?.rollbackReason)}, ${sqlJson(evidence.releaseLog)});`,
      ""
    );
  }

  lines.push(
    "insert into public.backend_handoff_audit (member_email, contract, version, payload, validation_rows, summary, generated_at)",
    `values (${sqlText(payload.member.email)}, ${sqlText(payload.contract)}, ${sqlText(payload.version)}, ${sqlJson(payload)}, ${sqlJson(validationRows)}, ${sqlText(payload.handoff?.summary)}, ${sqlText(payload.generatedAt)});`,
    "",
    "commit;",
    ""
  );

  return lines.join("\n");
}

function currentBackendPayloadFromText() {
  if (accountEl.backendPayloadText?.value?.trim().startsWith("{")) {
    try {
      return JSON.parse(accountEl.backendPayloadText.value);
    } catch (error) {
      return null;
    }
  }
  return renderBackendPayload({ record: false });
}

function renderBackendSql(options = {}) {
  if (!accountEl.backendSqlText) return null;
  const payload = currentBackendPayloadFromText();
  if (!payload) {
    accountEl.backendSqlSummary.textContent = "Invalid payload";
    accountEl.backendHandoffStatus.textContent = "Generate a valid backend payload before SQL seed export.";
    return null;
  }
  const sql = backendSeedSql(payload);
  const statementCount = sql.split("\n").filter((line) => line.startsWith("insert into ")).length;
  accountEl.backendSqlText.value = sql;
  accountEl.backendSqlSummary.textContent = `${statementCount} insert statements`;
  accountEl.backendHandoffStatus.textContent = "Backend SQL seed generated.";
  if (options.record !== false) {
    recordActivity("Backend SQL generated", `${payload.member.email}: ${statementCount} insert statements`);
  }
  return { payload, sql };
}

async function copyBackendSql() {
  const result = renderBackendSql({ record: false });
  if (!result) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(result.sql);
    } else {
      accountEl.backendSqlText.focus();
      accountEl.backendSqlText.select();
      document.execCommand("copy");
    }
    accountEl.backendHandoffStatus.textContent = "Backend SQL seed copied.";
    recordActivity("Backend SQL copied", result.payload.member.email);
  } catch (error) {
    accountEl.backendSqlText.focus();
    accountEl.backendSqlText.select();
    accountEl.backendHandoffStatus.textContent = "Copy was blocked by the browser. SQL seed text is selected.";
  }
}

function downloadBackendSql() {
  const result = renderBackendSql({ record: false });
  if (!result) return;
  const blob = new Blob([result.sql], { type: "text/sql" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeEmail = result.payload.member.email.replace(/[^a-z0-9]+/gi, "-") || "member";
  link.href = url;
  link.download = `${safeEmail}-rentintel-backend-seed.sql`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  accountEl.backendHandoffStatus.textContent = `${link.download} prepared.`;
  recordActivity("Backend SQL downloaded", result.payload.member.email);
}

function renderBackendPayload(options = {}) {
  if (!accountEl.backendPayloadText) return null;
  const payload = backendPayload();
  const text = JSON.stringify(payload, null, 2);
  const byteCount = new Blob([text]).size;
  accountEl.backendPayloadText.value = text;
  accountEl.backendPayloadSummary.textContent =
    `${payload.reports.length} reports | ${payload.watchlist.length} watch | ${payload.alertRules.length} rules | ` +
    `${payload.alertDeliveries.length} deliveries | ${payload.alertDeliveryAdminLog?.length || 0} admin actions | ` +
    `${payload.memberRoleAuditLog?.length || 0} role events`;
  renderBackendValidation(backendPayloadValidationRows(payload));
  accountEl.backendHandoffStatus.textContent = `${byteCount.toLocaleString("en-SG")} byte backend payload generated.`;
  if (options.record !== false) {
    recordActivity("Backend payload generated", `${payload.member.email}: ${payload.handoff.summary}`);
  }
  return payload;
}

async function copyBackendPayload() {
  const payload = renderBackendPayload({ record: false });
  if (!payload) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(accountEl.backendPayloadText.value);
    } else {
      accountEl.backendPayloadText.focus();
      accountEl.backendPayloadText.select();
      document.execCommand("copy");
    }
    accountEl.backendHandoffStatus.textContent = "Backend payload JSON copied.";
    recordActivity("Backend payload copied", payload.member.email);
  } catch (error) {
    accountEl.backendPayloadText.focus();
    accountEl.backendPayloadText.select();
    accountEl.backendHandoffStatus.textContent = "Copy was blocked by the browser. Payload text is selected.";
  }
}

function downloadBackendPayload() {
  const payload = renderBackendPayload({ record: false });
  if (!payload) return;
  const text = accountEl.backendPayloadText.value;
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeEmail = payload.member.email.replace(/[^a-z0-9]+/gi, "-") || "member";
  link.href = url;
  link.download = `${safeEmail}-rentintel-backend-payload.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  accountEl.backendHandoffStatus.textContent = `${link.download} prepared.`;
  recordActivity("Backend payload downloaded", payload.member.email);
}

function renderBackendPackage(options = {}) {
  if (!accountEl.backendPackageText) return null;
  const handoffPackage = backendHandoffPackage();
  const text = JSON.stringify(handoffPackage, null, 2);
  const byteCount = new Blob([text]).size;
  accountEl.backendPackageText.value = text;
  accountEl.backendPackageSummary.textContent =
    `${handoffPackage.readiness.coverage.total} coverage | ${handoffPackage.readiness.sourceSyncRuns} sync runs | ${byteCount.toLocaleString("en-SG")} bytes`;
  accountEl.backendHandoffStatus.textContent = "Backend handoff package v2 generated.";
  if (options.record !== false) {
    recordActivity(
      "Backend package v2 generated",
      `${handoffPackage.generatedBy}: ${handoffPackage.readiness.coverage.productionReady} production-ready coverage rows`
    );
  }
  return handoffPackage;
}

async function copyBackendPackage() {
  const handoffPackage = renderBackendPackage({ record: false });
  if (!handoffPackage) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(accountEl.backendPackageText.value);
    } else {
      accountEl.backendPackageText.focus();
      accountEl.backendPackageText.select();
      document.execCommand("copy");
    }
    accountEl.backendHandoffStatus.textContent = "Backend handoff package v2 copied.";
    recordActivity("Backend package v2 copied", handoffPackage.generatedBy);
  } catch (error) {
    accountEl.backendPackageText.focus();
    accountEl.backendPackageText.select();
    accountEl.backendHandoffStatus.textContent = "Copy was blocked by the browser. Package text is selected.";
  }
}

function downloadBackendPackage() {
  const handoffPackage = renderBackendPackage({ record: false });
  if (!handoffPackage) return;
  const text = accountEl.backendPackageText.value;
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeEmail = handoffPackage.generatedBy.replace(/[^a-z0-9]+/gi, "-") || "member";
  link.href = url;
  link.download = `${safeEmail}-rentintel-backend-handoff-v2.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  accountEl.backendHandoffStatus.textContent = `${link.download} prepared.`;
  recordActivity("Backend package v2 downloaded", handoffPackage.generatedBy);
}

function renderBackendHandoff() {
  if (!accountEl.backendHandoffList) return;
  const rows = backendHandoffRows();
  const readyCount = rows.filter((row) => row.state === "ready").length;
  accountEl.backendHandoffSummary.textContent = `${readyCount}/${rows.length} ready`;
  accountEl.backendHandoffList.replaceChildren();

  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "backend-handoff-item";
    item.dataset.state = row.state;

    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = row.label;
    const next = document.createElement("small");
    next.textContent = row.next;
    text.append(title, next);

    const value = document.createElement("em");
    value.textContent = row.value;
    const state = document.createElement("mark");
    state.textContent = row.state;

    item.append(text, value, state);
    accountEl.backendHandoffList.append(item);
  });
}

async function markBackendHandoffReviewed() {
  renderBackendHandoff();
  const packagePayload = renderBackendPackage({ record: false });
  const payload = renderBackendPayload({ record: false });
  const validationRows = backendPayloadValidationRows(payload);
  const summary = accountEl.backendHandoffSummary.textContent;
  const persistedAudit = await persistBackendHandoffAuditState({
    payload: packagePayload,
    contract: packagePayload?.contract || "rentintel-backend-handoff-package",
    version: packagePayload?.version || "prototype-v2",
    validationRows,
    summary: payload?.handoff?.summary || summary,
    generatedAt: packagePayload?.generatedAt || new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewerNote: `Reviewed from account ops by ${currentSession?.email || "member"}.`
  });
  accountEl.backendHandoffStatus.textContent = persistedAudit
    ? `Backend handoff reviewed and saved for ${currentSession.email}: ${summary}.`
    : `Backend handoff reviewed for ${currentSession.email}: ${summary}.`;
  recordActivity("Backend handoff reviewed", `${currentSession.email}: ${summary}`);
}

async function saveRecordAsReport(record) {
  const reports = loadStoredJson(savedReportsKey, []).filter((report) => {
    const sameRecord = report.recordId === record.id;
    const sameMember = normalizeEmail(report.memberEmail || currentSession?.email) === normalizeEmail(currentSession?.email);
    return !(sameRecord && sameMember);
  });
  const report = {
    recordId: record.id,
    memberEmail: normalizeEmail(currentSession?.email),
    title: record.title,
    decision: record.decision,
    asking: record.asking,
    official: record.official,
    gap: record.gap,
    pulseSummary: fallbackPulseSummary(record),
    decisionPack: basicDecisionPack(record),
    saveMetadata: reportEvidencePack(record),
    negotiationNote: negotiationNoteWithPulse({ pulseSummary: fallbackPulseSummary(record) }, record),
    savedAt: new Date().toISOString()
  };
  let backendReport = normalizeBackendReport(report);
  if (currentSession?.email && window.RentIntelAuth?.saveReport) {
    const result = await window.RentIntelAuth.saveReport(backendReport);
    if (result.ok && result.data?.report) {
      backendReport = normalizeBackendReport(result.data.report);
      upsertBackendSavedReport(backendReport);
    } else {
      backendReport = upsertBackendSavedReport(report);
    }
  } else {
    backendReport = upsertBackendSavedReport(report);
  }
  reports.unshift(backendReport);
  writeStoredJson(savedReportsKey, reports);
  renderSavedReports();
  renderReportDetail(backendReport);
  renderMemberCommandCenter();
  renderBackendHandoff();
  recordActivity("Report saved", `${record.title} synced to ${backendReport.backendStatus === "api-synced" ? "backend" : "mock backend"}`);
}

async function removeSelectedReport() {
  if (!selectedReport) return;
  const record = reportToRecord(selectedReport);
  const reports = loadStoredJson(savedReportsKey, []).filter((report) => {
    const sameRecord = report.recordId === selectedReport.recordId;
    const sameMember = normalizeEmail(report.memberEmail || currentSession?.email) === normalizeEmail(currentSession?.email);
    return !(sameRecord && sameMember);
  });
  writeStoredJson(savedReportsKey, reports);
  if (currentSession?.email && window.RentIntelAuth?.deleteReport) {
    await window.RentIntelAuth.deleteReport(selectedReport.recordId);
  }
  removeBackendSavedReport(selectedReport);
  selectedReport = null;
  renderSavedReports();
  renderMemberCommandCenter();
  renderBackendHandoff();
  accountEl.reportDetailStatus.textContent = `${record?.title || "Saved report"} removed.`;
  recordActivity("Report removed", `${record?.title || "Saved report removed"} removed from report store`);
}

function renderTodayBrief() {
  todayBriefRecord = chooseTodayBrief();
  if (!todayBriefRecord) return;
  accountEl.todayBriefTitle.textContent = todayBriefRecord.title;
  accountEl.todayBriefCopy.textContent = todayBriefRecord.mobileSummary;
  accountEl.todayAskingMetric.textContent = money(todayBriefRecord.asking);
  accountEl.todayFairRangeMetric.textContent = moneyRange(todayBriefRecord.fairRange);
  accountEl.todayGapMetric.textContent = `${todayBriefRecord.gap > 0 ? "+" : ""}${todayBriefRecord.gap}%`;
}

function seedReportDetailIfEmpty() {
  const reports = backendSavedReports();
  if (reports.length) return;
  const record = rentRecordList()[0];
  if (!record) return;
  renderReportDetail({
    recordId: record.id,
    title: record.title,
    decision: record.decision,
    gap: record.gap
  });
}

function renderWatchlistOptions() {
  accountEl.watchlistArea.replaceChildren();
  rentRecordList().forEach((record) => {
    const option = document.createElement("option");
    option.value = record.id;
    option.textContent = `${record.area} - ${record.propertyType}`;
    accountEl.watchlistArea.append(option);
  });
}

function renderWatchlist() {
  const watchlist = watchlistForCurrentMember();
  accountEl.watchlistCount.textContent = `${watchlist.length} watching`;
  accountEl.watchlistItems.replaceChildren();

  if (!watchlist.length) {
    const empty = document.createElement("p");
    empty.textContent = "No watchlist areas yet.";
    accountEl.watchlistItems.append(empty);
    renderWatchlistAlertPreview(watchlist);
    renderWatchlistOutbox(watchlist);
    renderDeliveryWorkerRuns();
    renderDeliveredMessages();
    renderDeliveryAdminConsole();
    renderAlertHistory();
    return;
  }

  watchlist.forEach((item) => {
    const record = rentRecordList().find((entry) => entry.id === item.recordId);
    if (!record) return;
    const rule = alertRuleForRecord(record.id);
    const state = watchlistState(record);
    const trust = sourceTrustProfile(record);
    const row = document.createElement("div");
    row.className = "watchlist-item";
    row.dataset.state = state.key;

    const copy = document.createElement("div");
    copy.className = "watchlist-copy";
    const title = document.createElement("strong");
    title.textContent = record.title;
    const meta = document.createElement("span");
    meta.className = "watchlist-meta";
    meta.textContent = `${state.label} | ${trust.title || record.confidence}`;
    const detail = document.createElement("small");
    detail.textContent = rule
      ? `${alertTriggerLabel(rule.trigger)} | ${alertCadenceLabel(rule.cadence)}`
      : record.mobileSummary;
    const next = document.createElement("small");
    next.className = "watchlist-next";
    next.textContent = `Next: ${watchlistNextStep(record, rule)}`;
    copy.append(title, meta, detail, next);

    const metrics = document.createElement("dl");
    metrics.className = "watchlist-metrics";
    [
      ["Target", money(rule?.targetPsf || watchlistTargetPsf(record))],
      ["Asking", money(record.asking)],
      ["Gap", `${record.gap > 0 ? "+" : ""}${record.gap}%`]
    ].forEach(([label, value]) => {
      const metric = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = label;
      const data = document.createElement("dd");
      data.textContent = value;
      metric.append(term, data);
      metrics.append(metric);
    });

    const actions = document.createElement("div");
    actions.className = "watchlist-actions";
    const open = document.createElement("a");
    open.href = workspaceHref({ rent: record.id, requireAuth: true });
    open.textContent = "Open";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = activeWatchlistRuleEditorId === record.id ? "Close" : "Edit Rule";
    edit.addEventListener("click", () => {
      activeWatchlistRuleEditorId = activeWatchlistRuleEditorId === record.id ? "" : record.id;
      renderWatchlist();
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", async () => {
      pushAlertHistoryEvent(
        composeAlertHistoryEvent({
          record,
          rule,
          status: "skipped",
          reason: "Watchlist alert was removed before delivery."
        })
      );
      if (currentSession?.email && window.RentIntelAuth?.deleteWatchlistItem) {
        await window.RentIntelAuth.deleteWatchlistItem(item.recordId);
      }
      writeStoredJson(
        watchlistKey,
        loadStoredJson(watchlistKey, []).filter((watch) => {
          const sameRecord = watch.recordId === item.recordId;
          const sameMember = normalizeEmail(watch.memberEmail || currentSession?.email) === normalizeEmail(currentSession?.email);
          return !(sameRecord && sameMember);
        })
      );
      writeStoredJson(
        alertRulesKey,
        loadStoredJson(alertRulesKey, []).filter((ruleItem) => {
          const sameRecord = ruleItem.recordId === item.recordId;
          const sameMember = normalizeEmail(ruleItem.memberEmail || currentSession?.email) === normalizeEmail(currentSession?.email);
          return !(sameRecord && sameMember);
        })
      );
      removeAlertQueueRecord(item.recordId);
      renderWatchlist();
      renderMemberCommandCenter();
    });
    actions.append(open, edit, remove);

    row.append(copy, metrics, actions);

    if (activeWatchlistRuleEditorId === record.id) {
      const editor = document.createElement("form");
      editor.className = "watchlist-rule-editor";

      const triggerField = document.createElement("label");
      triggerField.textContent = "Trigger";
      const triggerSelect = document.createElement("select");
      alertTriggerOptions().forEach((option) => {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        if ((rule?.trigger || defaultAlertRuleForRecord(record).trigger) === option.value) el.selected = true;
        triggerSelect.append(el);
      });
      triggerField.append(triggerSelect);

      const targetField = document.createElement("label");
      targetField.textContent = "Target psf";
      const targetInput = document.createElement("input");
      targetInput.type = "number";
      targetInput.step = "0.1";
      targetInput.min = "0";
      targetInput.value = String(Number(rule?.targetPsf || watchlistTargetPsf(record)).toFixed(1));
      targetField.append(targetInput);

      const gapField = document.createElement("label");
      gapField.textContent = "Gap limit %";
      const gapInput = document.createElement("input");
      gapInput.type = "number";
      gapInput.step = "1";
      gapInput.min = "0";
      gapInput.value = String(Math.max(0, Math.round(Number(rule?.gapLimit || Math.abs(record.gap)))));
      gapField.append(gapInput);

      const cadenceField = document.createElement("label");
      cadenceField.textContent = "Cadence";
      const cadenceSelect = document.createElement("select");
      alertCadenceOptions().forEach((option) => {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        if ((rule?.cadence || "daily") === option.value) el.selected = true;
        cadenceSelect.append(el);
      });
      cadenceField.append(cadenceSelect);

      const editorActions = document.createElement("div");
      editorActions.className = "watchlist-rule-actions";
      const saveButton = document.createElement("button");
      saveButton.type = "submit";
      saveButton.textContent = "Save Rule";
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";
      cancelButton.addEventListener("click", () => {
        activeWatchlistRuleEditorId = "";
        renderWatchlist();
      });
      editorActions.append(saveButton, cancelButton);

      editor.addEventListener("submit", async (event) => {
        event.preventDefault();
        const updatedRule = await saveAlertRuleForRecord(record, {
          trigger: triggerSelect.value,
          targetPsf: targetInput.value,
          gapLimit: gapInput.value,
          cadence: cadenceSelect.value
        });
        activeWatchlistRuleEditorId = "";
        setAlertQueueStatus(
          record.id,
          "queued",
          "Alert rule updated and queued for the next delivery check.",
          { record, rule: updatedRule }
        );
        accountEl.watchlistStatus.textContent = `${record.area} alert rule updated.`;
        recordActivity("Alert rule updated", `${record.area}: ${alertTriggerLabel(updatedRule.trigger)} | ${alertCadenceLabel(updatedRule.cadence)}`);
        renderWatchlist();
      });

      editor.append(triggerField, targetField, gapField, cadenceField, editorActions);
      row.append(editor);
    }
    accountEl.watchlistItems.append(row);
  });
  renderWatchlistAlertPreview(watchlist);
  renderWatchlistOutbox(watchlist);
  renderDeliveryWorkerRuns();
  renderDeliveredMessages();
  renderDeliveryAdminConsole();
  renderAlertHistory();
}

function renderFreshnessPolicyPanel() {
  if (!accountEl.freshnessPolicySummary) return;
  const policy = freshnessPolicy();
  const canEdit = sessionCanEditFreshnessPolicy(currentSession);
  accountEl.freshnessPolicySummary.textContent = freshnessPolicySummaryText(policy);
  if (accountEl.freshnessFreshDays) accountEl.freshnessFreshDays.value = String(policy.freshMaxDays);
  if (accountEl.freshnessWatchDays) accountEl.freshnessWatchDays.value = String(policy.watchMaxDays);
  if (accountEl.freshnessFreshDays) accountEl.freshnessFreshDays.disabled = !canEdit;
  if (accountEl.freshnessWatchDays) accountEl.freshnessWatchDays.disabled = !canEdit;
  if (accountEl.saveFreshnessPolicyButton) accountEl.saveFreshnessPolicyButton.disabled = !canEdit;
  const updatedBy = policy.updatedBy || "RentIntel default";
  const updatedAt = policy.updatedAt ? formatDateTime(policy.updatedAt) : "default policy";
  if (accountEl.freshnessPolicyStatus) {
    accountEl.freshnessPolicyStatus.textContent =
      canEdit
        ? `Current policy: ${freshnessPolicySummaryText(policy)}. Last update by ${updatedBy} at ${updatedAt}.`
        : `View only. Current policy: ${freshnessPolicySummaryText(policy)}. Last update by ${updatedBy} at ${updatedAt}.`;
  }
}

async function saveFreshnessPolicy() {
  if (!currentSession) return;
  if (!sessionCanEditFreshnessPolicy(currentSession)) {
    if (accountEl.freshnessPolicyStatus) {
      accountEl.freshnessPolicyStatus.textContent =
        "Admin access is required to save Freshness SLA policy.";
    }
    return;
  }
  const freshMaxDays = Math.max(1, Math.min(60, Number(accountEl.freshnessFreshDays?.value) || 7));
  const watchInput = Math.max(freshMaxDays + 1, Number(accountEl.freshnessWatchDays?.value) || 14);
  const watchMaxDays = Math.max(freshMaxDays + 1, Math.min(90, watchInput));
  writeFreshnessPolicy({
    freshMaxDays,
    watchMaxDays,
    updatedAt: new Date().toISOString(),
    updatedBy: normalizeEmail(currentSession.email)
  });
  await persistFreshnessPolicyState(freshnessPolicy());
  renderSourceStatus();
  renderWatchlist();
  renderMemberCommandCenter();
  if (accountEl.freshnessPolicyStatus) {
    accountEl.freshnessPolicyStatus.textContent =
      `Freshness SLA saved: ${freshnessPolicySummaryText(freshnessPolicy())}.`;
  }
  recordActivity("Freshness SLA updated", freshnessPolicySummaryText(freshnessPolicy()));
}

function renderSourceStatus() {
  const sources = sourceStatusList();
  const approvedSources = approvedAskingSources();
  const latestSync = latestApprovedSourceSync(approvedSources);
  accountEl.sourceStatusGrid.replaceChildren();
  accountEl.sourceStatusSummary.textContent = `${sources.length} source layers mapped`;
  renderFreshnessPolicyPanel();
  renderAccountSourceQa();

  if (!sources.length) {
    const empty = document.createElement("p");
    empty.textContent = "Source status is unavailable.";
    accountEl.sourceStatusGrid.append(empty);
    return;
  }

  sources.forEach((source) => {
    let displaySource = source;
    if (source.sourceId === "asking-rent-feed" && latestSync) {
      displaySource = {
        ...source,
        currentState: "pilot-sync-complete",
        prototypeState: `Latest pilot sync checked ${latestSync.recordsChecked} sample rent records`,
        productionNextStep: "Connect backend daily ingestion, exception alerts, and source QA reporting."
      };
    } else if (source.sourceId === "asking-rent-feed" && approvedSources.length) {
      displaySource = {
        ...source,
        currentState: "pilot-source-ready",
        prototypeState: `${approvedSources.length} asking-rent source candidate approved for pilot`,
        productionNextStep: "Run a pilot sync and compare asking-rent output against official benchmark records."
      };
    }
    const card = document.createElement("article");
    card.className = "source-status-card";
    card.dataset.state = displaySource.currentState;

    const top = document.createElement("div");
    top.className = "source-status-top";
    const label = document.createElement("strong");
    label.textContent = displaySource.label;
    const badge = document.createElement("span");
    badge.textContent = displaySource.currentState;
    top.append(label, badge);

    const layer = document.createElement("p");
    layer.textContent = displaySource.layer;

    const detail = document.createElement("small");
    detail.textContent = `${displaySource.prototypeState}. Next: ${displaySource.productionNextStep}`;

    const refresh = document.createElement("em");
    refresh.textContent = `Refresh target: ${displaySource.refreshTarget}`;

    card.append(top, layer, detail, refresh);
    accountEl.sourceStatusGrid.append(card);
  });
}

function renderAccountSourceQa() {
  if (!accountEl.accountSourceQa) return;
  const qa = askingFeedQaSummary();
  accountEl.accountSourceQa.dataset.ready = qa.ready ? "true" : "false";
  accountEl.accountSourceQa.dataset.freshness = qa.freshnessState || "stale";
  accountEl.accountSourceQaTitle.textContent = qa.title;
  accountEl.accountSourceQaRecords.textContent = String(qa.records);
  accountEl.accountSourceQaChecks.textContent = String(qa.checks);
  accountEl.accountSourceQaCaptured.textContent = `${qa.captured} (${qa.freshnessLabel})`;
  accountEl.accountSourceQaProduction.textContent = qa.production;
  accountEl.accountSourceQaNext.textContent = qa.next;
  renderProductionEvidence();
  renderAccountSourceGate();
  renderOpsReview();
  renderReleaseLog();
  renderSourceExceptions();
  renderSourceAdminQueue();
  renderSourceHistory();
  renderAccountSourceHandoff();
  renderAccountSourceQaRows();
}

function renderProductionEvidence() {
  if (!accountEl.accountProductionEvidence) return;
  const evidence = productionEvidence();
  const ready = productionEvidenceReady(evidence);
  accountEl.accountProductionEvidence.dataset.ready = ready ? "true" : "false";
  accountEl.productionEvidenceSummary.textContent = ready
    ? `${evidence.sourceName} evidence complete`
    : evidence.sourceName
      ? `${evidence.sourceName} evidence incomplete`
      : "No production source attached";
  accountEl.productionSourceName.value = evidence.sourceName || "";
  if (evidence.sourceType) accountEl.productionSourceType.value = evidence.sourceType;
  accountEl.recordProductionQaLogButton.disabled = !evidence.sourceName;
  accountEl.recordSourceOwnerReviewButton.disabled = !evidence.sourceName || !evidence.qaLogAt;
  accountEl.productionEvidenceStatus.textContent = ready
    ? `Evidence complete: source attached ${formatShortDate(evidence.sourceAttachedAt)}, QA logged ${formatShortDate(evidence.qaLogAt)}, owner reviewed ${formatShortDate(evidence.ownerReviewedAt)}.`
    : evidence.sourceName
      ? `Evidence pending: ${evidence.qaLogAt ? "QA log recorded" : "QA log needed"}; ${evidence.ownerReviewedAt ? "owner reviewed" : "source-owner review needed"}.`
      : "Attach production source evidence, QA log, and source-owner review to clear the final pilot blocker.";
}

function renderAccountSourceGate() {
  if (!accountEl.accountSourceGate) return;
  const gate = askingFeedReadinessGate();
  accountEl.accountSourceGate.dataset.state = gate.ready ? "ready" : "blocked";
  accountEl.accountSourceGateSummary.textContent = gate.ready
    ? `Ready: ${gate.passed}/${gate.total} checks passed`
    : `Blocked: ${gate.passed}/${gate.total} checks passed`;
  accountEl.accountSourceGateList.replaceChildren();
  gate.checks.forEach((check) => {
    const item = document.createElement("li");
    item.dataset.pass = check.pass ? "true" : "false";
    const label = document.createElement("strong");
    label.textContent = check.label;
    const detail = document.createElement("span");
    detail.textContent = check.detail;
    item.append(label, detail);
    accountEl.accountSourceGateList.append(item);
  });
}

function renderOpsReview() {
  if (!accountEl.accountOpsReview) return;
  const review = productionOpsReview();
  accountEl.accountOpsReview.dataset.state = review.state;
  accountEl.opsReviewStage.textContent = review.stage;
  accountEl.opsReviewSummary.textContent = review.summary;
  accountEl.opsReviewEvidenceMetric.textContent = `${review.evidencePassed}/${review.evidenceTotal}`;
  accountEl.opsReviewGateMetric.textContent = `${review.gatePassed}/${review.gateTotal}`;
  accountEl.opsReviewDecisionMetric.textContent = review.decision;
  accountEl.opsReviewAction.textContent = review.action;
  accountEl.opsReviewBlockers.replaceChildren();
  review.blockers.forEach((blocker) => {
    const item = document.createElement("li");
    item.textContent = blocker;
    accountEl.opsReviewBlockers.append(item);
  });
}

function renderReleaseLog() {
  if (!accountEl.accountReleaseLog) return;
  const log = productionReleaseLogPackage();
  accountEl.accountReleaseLog.dataset.state = log.state;
  accountEl.releaseLogStatus.textContent = log.status;
  accountEl.releaseLogSummary.textContent = log.summary;
  accountEl.releaseLogTimestampMetric.textContent = log.timestamp ? formatShortDate(log.timestamp) : "Not set";
  accountEl.releaseLogByMetric.textContent = log.releasedBy || currentSession?.email || "Not assigned";
  accountEl.releaseLogRollbackMetric.textContent = log.rollbackReason || "None";
  if (accountEl.releaseLogNote && !accountEl.releaseLogNote.value) {
    accountEl.releaseLogNote.value = log.releaseNote || "";
  }
  accountEl.queueProductionReleaseButton.disabled = log.state !== "ready";
  accountEl.markProductionReleasedButton.disabled = !(log.state === "queued" || log.state === "ready");
  accountEl.rollbackProductionReleaseButton.disabled = log.state !== "released";
  accountEl.releaseLogMessage.textContent = log.nextAction;
}

function renderSourceExceptions() {
  if (!accountEl.accountSourceExceptions) return;
  const exceptions = sourceExceptionAlerts();
  accountEl.accountSourceExceptions.dataset.state = exceptions.status;
  accountEl.sourceExceptionSummary.textContent = exceptions.total
    ? `${exceptions.total} open`
    : "0 open";
  accountEl.sourceExceptionCriticalMetric.textContent = String(exceptions.critical);
  accountEl.sourceExceptionWatchMetric.textContent = String(exceptions.watch);
  accountEl.sourceExceptionStatusMetric.textContent = exceptions.status === "clear"
    ? "Clear"
    : exceptions.status === "critical"
      ? "Action"
      : "Watch";
  accountEl.sourceExceptionList.replaceChildren();
  if (!exceptions.alerts.length) {
    const empty = document.createElement("p");
    empty.textContent = "No source exceptions detected.";
    accountEl.sourceExceptionList.append(empty);
    return;
  }
  exceptions.alerts.forEach((alert) => {
    const item = document.createElement("article");
    item.className = "source-exception-item";
    item.dataset.severity = alert.severity;
    const title = document.createElement("strong");
    title.textContent = alert.title;
    const detail = document.createElement("span");
    detail.textContent = alert.detail;
    const action = document.createElement("small");
    action.textContent = alert.action;
    item.append(title, detail, action);
    accountEl.sourceExceptionList.append(item);
  });
}

function renderSourceAdminQueue() {
  if (!accountEl.accountSourceAdminQueue) return;
  const rows = sourceAdminQueueRows();
  const p0Count = rows.filter((row) => row.priority === "P0").length;
  accountEl.accountSourceAdminQueue.dataset.state = p0Count ? "critical" : rows.length ? "open" : "clear";
  accountEl.sourceAdminQueueSummary.textContent = rows.length
    ? `${rows.length} items | ${p0Count} P0`
    : "0 items";
  accountEl.sourceAdminQueueList.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = "No source admin items yet.";
    accountEl.sourceAdminQueueList.append(empty);
    return;
  }
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "source-admin-queue-item";
    item.dataset.priority = row.priority.toLowerCase();
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = row.stage;
    const detail = document.createElement("small");
    detail.textContent = `${row.sourceName} | ${row.nextAction}`;
    copy.append(title, detail);
    const group = document.createElement("em");
    group.textContent = row.group;
    const priority = document.createElement("mark");
    priority.textContent = row.priority;
    item.append(copy, group, priority);
    accountEl.sourceAdminQueueList.append(item);
  });
}

function renderSourceHistory() {
  if (!accountEl.accountSourceHistory) return;
  const events = sourceHistoryEvents();
  const audit = sourceHistoryAuditState(events);
  accountEl.sourceHistorySummary.textContent = `${events.length} event${events.length === 1 ? "" : "s"}`;
  accountEl.sourceHistoryStageMetric.textContent = audit.stage;
  accountEl.sourceHistoryQaMetric.textContent = audit.qa;
  accountEl.sourceHistoryReleaseMetric.textContent = audit.release;
  accountEl.sourceHistoryNextMetric.textContent = audit.next;
  accountEl.sourceHistoryList.replaceChildren();
  events.forEach((event) => {
    const item = document.createElement("li");
    item.dataset.state = event.state;
    item.dataset.stage = slugify(event.stage || event.label);

    const copy = document.createElement("span");
    copy.className = "source-history-copy";
    const title = document.createElement("strong");
    title.textContent = event.label;
    const detail = document.createElement("span");
    detail.textContent = event.detail;
    const next = document.createElement("small");
    next.textContent = event.nextAction;
    copy.append(title, detail, next);

    const meta = document.createElement("span");
    meta.className = "source-history-meta";
    const stage = document.createElement("mark");
    stage.textContent = event.stage || "Event";
    const at = document.createElement("em");
    at.textContent = formatShortDate(event.at);
    meta.append(stage, at);

    item.append(copy, meta);
    accountEl.sourceHistoryList.append(item);
  });
}

function renderAccountSourceHandoff() {
  if (!accountEl.accountSourceHandoff) return;
  const handoff = askingFeedProductionTasks();
  accountEl.accountSourceHandoff.dataset.state = handoff.ready ? "ready" : "blocked";
  accountEl.accountSourceHandoffSummary.textContent = handoff.summary;
  accountEl.accountSourceHandoffList.replaceChildren();
  handoff.tasks.forEach((task) => {
    const item = document.createElement("li");
    item.textContent = task;
    accountEl.accountSourceHandoffList.append(item);
  });
}

function renderAccountSourceQaRows() {
  if (!accountEl.accountSourceQaList) return;
  const rows = askingFeedQaRows();
  accountEl.accountSourceQaList.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = "No asking feed QA rows loaded.";
    accountEl.accountSourceQaList.append(empty);
    return;
  }
  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "account-source-qa-row";
    item.dataset.status = row.status.toLowerCase().replace(/\s+/g, "-");
    item.dataset.freshness = row.freshnessState;

    const title = document.createElement("strong");
    title.textContent = row.title;

    const meta = document.createElement("span");
    meta.textContent = `${money(row.asking)} asking | ${money(row.official)} official | ${row.gap > 0 ? "+" : ""}${row.gap}% gap`;

    const checks = document.createElement("small");
    checks.textContent = `${row.checks} checks | ${row.captured} (${row.freshnessLabel})`;

    const status = document.createElement("em");
    status.textContent = row.status;

    const note = document.createElement("p");
    note.textContent = row.varianceReviewed
      ? `${row.freshnessDetail} ${row.note} Variance reviewed by pilot operator.`
      : `${row.freshnessDetail} ${row.note}`;

    const actions = document.createElement("div");
    actions.className = "account-source-qa-actions";
    const addCheck = document.createElement("button");
    addCheck.type = "button";
    addCheck.textContent = "Add check";
    addCheck.addEventListener("click", () => addAskingFeedQaCheck(row.recordId, row.title));
    const reviewVariance = document.createElement("button");
    reviewVariance.type = "button";
    reviewVariance.textContent = row.varianceReviewed ? "Reviewed" : "Mark reviewed";
    reviewVariance.disabled = row.gap < 25 || row.varianceReviewed;
    reviewVariance.addEventListener("click", () => markAskingFeedVarianceReviewed(row.recordId, row.title));
    actions.append(addCheck, reviewVariance);

    item.append(title, meta, checks, status, actions, note);
    accountEl.accountSourceQaList.append(item);
  });
}

function addAskingFeedQaCheck(recordId, title) {
  const review = askingFeedQaReview();
  const current = review[recordId] || {};
  review[recordId] = {
    ...current,
    extraChecks: (Number(current.extraChecks) || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  writeAskingFeedQaReview(review);
  renderAccountSourceQa();
  recordActivity("Asking feed QA check", `${title}: verified check added`);
}

function markAskingFeedVarianceReviewed(recordId, title) {
  const review = askingFeedQaReview();
  const current = review[recordId] || {};
  review[recordId] = {
    ...current,
    varianceReviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  writeAskingFeedQaReview(review);
  renderAccountSourceQa();
  recordActivity("Asking feed variance reviewed", title);
}

async function attachProductionSourceEvidence() {
  const sourceName = accountEl.productionSourceName.value.trim();
  if (!sourceName) {
    accountEl.productionEvidenceStatus.textContent = "Enter a production source name first.";
    return;
  }
  const evidence = productionEvidence();
  const updated = {
    ...evidence,
    sourceName,
    sourceType: accountEl.productionSourceType.value,
    sourceAttachedAt: evidence.sourceAttachedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  writeProductionEvidence(updated);
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production source evidence attached", `${updated.sourceType}: ${updated.sourceName}`);
}

async function recordProductionQaLog() {
  const evidence = productionEvidence();
  if (!evidence.sourceName) {
    accountEl.productionEvidenceStatus.textContent = "Attach a production source before recording a QA log.";
    return;
  }
  writeProductionEvidence({
    ...evidence,
    qaLogAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production QA log recorded", evidence.sourceName);
}

async function recordSourceOwnerReview() {
  const evidence = productionEvidence();
  if (!evidence.sourceName || !evidence.qaLogAt) {
    accountEl.productionEvidenceStatus.textContent = "Attach source evidence and QA log before source-owner review.";
    return;
  }
  writeProductionEvidence({
    ...evidence,
    ownerReviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production source-owner review", evidence.sourceName);
}

function releaseLogNoteValue(fallback) {
  return accountEl.releaseLogNote?.value.trim() || fallback;
}

async function queueProductionRelease() {
  const review = productionOpsReview();
  const evidence = productionEvidence();
  if (review.state !== "release") {
    accountEl.releaseLogMessage.textContent = "Ops Review must reach Ready for Controlled Release before queueing.";
    return;
  }
  const now = new Date().toISOString();
  writeProductionReleaseLog({
    status: "Release queued",
    queuedAt: now,
    releasedAt: "",
    releasedBy: currentSession?.email || "",
    releaseNote: releaseLogNoteValue("Queued after production evidence, QA gate, and source-owner review passed."),
    rollbackAt: "",
    rollbackReason: "",
    sourceName: evidence.sourceName,
    updatedAt: now
  });
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production release queued", evidence.sourceName);
}

async function markProductionReleased() {
  const review = productionOpsReview();
  const evidence = productionEvidence();
  if (review.state !== "release") {
    accountEl.releaseLogMessage.textContent = "Release cannot be marked live while Ops Review is blocked.";
    return;
  }
  const current = productionReleaseLog();
  const now = new Date().toISOString();
  writeProductionReleaseLog({
    ...current,
    status: "Released",
    queuedAt: current.queuedAt || now,
    releasedAt: now,
    releasedBy: currentSession?.email || current.releasedBy || "",
    releaseNote: releaseLogNoteValue(current.releaseNote || "ProductionReady released after backend persistence confirmation."),
    rollbackAt: "",
    rollbackReason: "",
    sourceName: evidence.sourceName,
    updatedAt: now
  });
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production release marked live", evidence.sourceName);
}

async function rollbackProductionRelease() {
  const current = productionReleaseLog();
  if (current.status !== "Released") {
    accountEl.releaseLogMessage.textContent = "Only a released source can be rolled back.";
    return;
  }
  const now = new Date().toISOString();
  writeProductionReleaseLog({
    ...current,
    status: "Rolled back",
    rollbackAt: now,
    rollbackReason: releaseLogNoteValue("Rollback reason not specified."),
    releasedBy: currentSession?.email || current.releasedBy || "",
    updatedAt: now
  });
  const persisted = await persistProductionEvidenceState(sourceProductionEvidencePackage());
  if (persisted) applyProductionEvidencePackageLocal(persisted);
  renderAccountSourceQa();
  recordActivity("Production release rolled back", current.sourceName || "Production source");
}

async function clearProductionEvidence() {
  localStorage.removeItem(productionEvidenceKey);
  localStorage.removeItem(productionReleaseLogKey);
  accountEl.productionSourceName.value = "";
  if (accountEl.releaseLogNote) accountEl.releaseLogNote.value = "";
  await persistProductionEvidenceState({ reset: true });
  renderAccountSourceQa();
  recordActivity("Production evidence cleared", "Asking feed production evidence reset");
}

function renderAskingSourceCandidates() {
  const entries = sourceCandidateEntries();
  accountEl.askingSourceCount.textContent = `${entries.length} source candidates`;
  accountEl.askingSourceList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "No asking-rent source candidates yet.";
    accountEl.askingSourceList.append(empty);
    return;
  }

  entries.slice(0, 6).forEach(({ candidate, index }) => {
    const row = document.createElement("article");
    row.className = "asking-source-item";
    row.dataset.status = candidate.status;
    row.dataset.type = "source";
    const title = document.createElement("strong");
    title.textContent = candidate.name;
    const meta = document.createElement("span");
    meta.textContent = candidate.type;
    const status = document.createElement("small");
    status.textContent = candidate.status;
    const detail = document.createElement("em");
    detail.textContent = candidate.addedAt
      ? `Added ${new Date(candidate.addedAt).toLocaleDateString("en-SG")}`
      : "Manual source candidate";
    const actions = document.createElement("div");
    actions.className = "asking-source-actions";

    const approve = document.createElement("button");
    approve.type = "button";
    approve.textContent = "Approve";
    approve.disabled = candidate.status === "approved for pilot";
    approve.addEventListener("click", async () => await reviewAskingSourceCandidate(index, "approved for pilot"));

    const reject = document.createElement("button");
    reject.type = "button";
    reject.textContent = "Reject";
    reject.disabled = candidate.status === "rejected";
    reject.addEventListener("click", async () => await reviewAskingSourceCandidate(index, "rejected"));

    actions.append(approve, reject);
    row.append(title, meta, detail, status, actions);
    accountEl.askingSourceList.append(row);
  });
}

function coverageRequestStatusCounts(entries) {
  return {
    pending: entries.filter(({ candidate }) => !["approved for pilot", "rejected"].includes(candidate.status)).length,
    approved: entries.filter(({ candidate }) => candidate.status === "approved for pilot" && !candidate.productionReadyAt).length,
    rejected: entries.filter(({ candidate }) => candidate.status === "rejected").length,
    productionReady: entries.filter(({ candidate }) => Boolean(candidate.productionReadyAt)).length
  };
}

function coverageSampleCandidate(entries = coverageRequestEntries()) {
  return entries.find(({ candidate }) => Boolean(candidate.sampleRecordId) || coverageRecordExists(candidate))?.candidate || null;
}

function coverageSampleHref(candidate) {
  if (!candidate) return "../../index.html#search";
  return `../../index.html?rent=${encodeURIComponent(candidate.sampleRecordId || coverageRecordId(candidate))}#search`;
}

function openAccountOpsSection(sectionId) {
  if (accountEl.accountOpsDrawer) accountEl.accountOpsDrawer.open = true;
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  }
}

function renderCoverageShortcut() {
  if (!accountEl.coverageShortcutSummary) return;
  const entries = coverageRequestEntries();
  const counts = coverageRequestStatusCounts(entries);
  const liveCount = entries.filter(({ candidate }) => Boolean(candidate.sampleRecordId) || coverageRecordExists(candidate)).length;
  const liveCandidate = coverageSampleCandidate(entries);
  const hasAccess = sessionHasAccess(currentSession);
  const coverageTargets = approvedCoverageTargets();

  accountEl.coverageShortcutPendingMetric.textContent = String(counts.pending);
  accountEl.coverageShortcutPilotMetric.textContent = String(counts.approved);
  accountEl.coverageShortcutLiveMetric.textContent = String(liveCount);
    accountEl.coverageShortcutSummary.textContent = entries.length
    ? `${counts.pending} pending / ${counts.approved} pilot verified`
    : "Coverage queue is empty right now";

  accountEl.coverageShortcutReviewButton.textContent = counts.pending ? "Review Coverage" : "Open Coverage Review";
  accountEl.coverageShortcutSourceSyncButton.disabled = !hasAccess || !coverageTargets.length;
  accountEl.coverageShortcutSourceSyncButton.textContent = coverageTargets.length ? "Open Source Sync" : "No Sync Target Yet";
  accountEl.coverageShortcutPublicButton.href = "../../index.html#search";

  if (liveCandidate) {
    accountEl.coverageShortcutLiveLink.hidden = false;
    accountEl.coverageShortcutLiveLink.href = coverageSampleHref(liveCandidate);
    accountEl.coverageShortcutLiveLink.textContent = "Public Sample Live";
    accountEl.coverageShortcutStatus.textContent =
      `${sourceCandidateName(liveCandidate)} has a pilot sample live on the public page.`;
  } else if (counts.pending) {
    accountEl.coverageShortcutLiveLink.hidden = true;
    accountEl.coverageShortcutStatus.textContent =
      "Review pending coverage requests to create pilot verified public samples.";
  } else if (counts.approved) {
    accountEl.coverageShortcutLiveLink.hidden = true;
    accountEl.coverageShortcutStatus.textContent =
      "Approved coverage exists. Confirm the sample record or run source sync.";
  } else {
    accountEl.coverageShortcutLiveLink.hidden = true;
    accountEl.coverageShortcutStatus.textContent =
      "When a public search misses coverage, the request will appear here for review and release tracking.";
  }
}

function latestCoverageSyncForCandidate(candidate) {
  const key = sourceCandidateKey(candidate);
  const name = sourceCandidateName(candidate);
  return sourceSyncRuns().find((sync) =>
    sync.coverageTargets?.some((target) => target.sourceKey === key || target.name === name)
  ) || null;
}

function coverageStageState(candidate) {
  const rejected = candidate.status === "rejected";
  const approved = candidate.status === "approved for pilot" || Boolean(candidate.productionReadyAt);
  const sampleReady = Boolean(candidate.sampleRecordId) || coverageRecordExists(candidate);
  const syncRun = latestCoverageSyncForCandidate(candidate);
  const synced = Boolean(candidate.sourceSyncedAt || syncRun);
  const productionReady = Boolean(candidate.productionReadyAt);
  const steps = [
    { key: "requested", label: "Requested", done: true },
    { key: "approved", label: "Approved", done: approved },
    { key: "sample", label: "Sample", done: sampleReady },
    { key: "synced", label: "Synced", done: synced },
    { key: "production", label: "Production Ready", done: productionReady }
  ];
  const current = rejected
    ? "Rejected"
    : productionReady
      ? "Production Ready"
      : steps.find((step) => !step.done)?.label || "Production Ready";
  return { rejected, approved, sampleReady, synced, productionReady, steps, current };
}

function coverageFilterMatches(candidate, filter = coverageRequestFilter) {
  const stage = coverageStageState(candidate);
  if (filter === "pending") return !stage.rejected && !stage.approved;
  if (filter === "pilot") return stage.approved && !stage.productionReady;
  if (filter === "production") return stage.productionReady;
  if (filter === "rejected") return stage.rejected;
  return true;
}

function coveragePriorityScore(candidate) {
  const stage = coverageStageState(candidate);
  let score = 20;
  if (stage.productionReady) score += 65;
  else if (stage.synced) score += 50;
  else if (stage.sampleReady) score += 40;
  else if (stage.approved) score += 30;
  if (stage.rejected) score -= 45;
  if (candidate.requestedUrgency === "urgent") score += 30;
  if (candidate.requestedUrgency === "soon") score += 16;
  if (candidate.requestEmail) score += 8;
  if (candidate.requestedUseCase) score += 8;
  if (/renewal|negotiat|opening|tenant/i.test(candidate.requestedUseCase || "")) score += 6;
  if (candidate.addedAt) {
    const ageDays = Math.max(0, (Date.now() - new Date(candidate.addedAt).getTime()) / 86400000);
    score += Math.min(12, Math.floor(ageDays / 2));
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

function coveragePriorityLabel(score) {
  if (score >= 75) return "P1";
  if (score >= 50) return "P2";
  return "P3";
}

function classificationLabel(value = "") {
  const labels = {
    "retail-hdb": "Retail: HDB/neighbourhood",
    "retail-shophouse": "Retail: shophouse",
    "retail-mall": "Retail: mall",
    "neighbourhood-shop": "Retail: neighbourhood shop",
    industrial: "Industrial",
    office: "Office",
    warehouse: "Warehouse",
    exclude: "Exclude"
  };
  return labels[value] || "Unclassified";
}

function classificationAllowsSample(value = "") {
  return ["retail-hdb", "retail-shophouse", "retail-mall", "neighbourhood-shop"].includes(value);
}

function candidateManualReviewState(candidate) {
  const eligibility = coverageEligibilityForCandidate(candidate);
  return eligibility.status === "manual" ||
    candidate.status === "manual review" ||
    candidate.coverageQaDecision === "needs-source" ||
    ["industrial", "office", "warehouse"].includes(candidate.sourceClassification);
}

function coverageQaChecks(candidate, stage = coverageStageState(candidate)) {
  const eligibility = coverageEligibilityForCandidate(candidate);
  const approved = candidate.status === "approved for pilot" || stage.approved;
  const classification = candidate.sourceClassification || "";
  const decision = candidate.coverageQaDecision || "";
  const hasPropertyType = Boolean(candidate.requestedPropertyType) ||
    /\b(hdb|shop|shophouse|mall|retail)\b/i.test(candidate.requestedQuery || candidate.name || "");
  const checks = [
    { label: "Area/type eligible", done: eligibility.sampleAllowed, detail: eligibility.reason },
    { label: "Source classified", done: Boolean(classification) && classification !== "exclude", detail: "Admin must classify the request before a sample can be created." },
    { label: "Admin approved", done: approved, detail: "Coverage must be approved before a sample exists." },
    { label: "Property type valid", done: hasPropertyType && eligibility.status !== "blocked", detail: "Request must identify a usable retail property type." },
    { label: "Benchmark basis", done: approved && eligibility.status === "eligible", detail: "Prototype benchmark basis can be generated only for eligible retail coverage." },
    { label: "QA decision passed", done: decision === "pass", detail: "Admin must record Pass before creating a sample." },
    { label: "Asking source path", done: approved && eligibility.status === "eligible" && decision === "pass", detail: "Pilot asking-source capture can be queued after approval." },
    { label: "No restricted site", done: eligibility.status !== "blocked", detail: eligibility.action }
  ];
  return {
    checks,
    ready: checks.every((check) => check.done)
  };
}

function updateCoverageCandidate(index, patch, activityLabel, statusTarget = accountEl.coverageRequestStatus) {
  if (!sessionHasAccess(currentSession)) {
    if (statusTarget) statusTarget.textContent = "Active or promo access is required to review coverage requests.";
    return;
  }
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const candidate = candidates[index];
  if (!candidate) return;
  const updated = {
    ...candidate,
    ...patch,
    updatedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: currentSession.email
  };
  candidates[index] = updated;
  writeStoredJson(askingSourceCandidatesKey, candidates);
  const label = sourceCandidateName(updated);
  if (statusTarget) statusTarget.textContent = `${label}: ${activityLabel}.`;
  recordActivity("Coverage review updated", `${label}: ${activityLabel}`);
  renderCoverageRequests();
  renderManualReviewQueue();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
}

async function classifyCoverageCandidate(index, classification, statusTarget = accountEl.coverageRequestStatus) {
  const sampleAllowed = classificationAllowsSample(classification);
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const current = candidates[index];
  if (!current) return;
  const patch = {
    sourceClassification: classification,
    coverageEligibilityStatus: sampleAllowed ? "eligible" : classification === "exclude" ? "blocked" : "manual",
    coverageEligibilityReason: `${classificationLabel(classification)} classification recorded by admin.`,
    status: classification === "exclude" ? "rejected" : sampleAllowed ? "candidate review" : "manual review",
    requestedPropertyType: sampleAllowed ? classificationLabel(classification) : undefined,
    reviewerNote: `${classificationLabel(classification)} classification recorded by admin.`
  };
  updateCoverageCandidate(index, patch, `classified as ${classificationLabel(classification)}`, statusTarget);
  const persistedCandidate = current.id
    ? await persistCoverageClassificationState(current.id, patch)
    : await persistSourceCandidateState({ ...current, ...patch });
  if (persistedCandidate) upsertAskingSourceCandidateLocal(persistedCandidate);
  renderCoverageRequests();
  renderManualReviewQueue();
}

async function recordCoverageQaDecision(index, decision, statusTarget = accountEl.coverageRequestStatus) {
  const status = decision === "fail" ? "rejected" : decision === "needs-source" ? "manual review" : undefined;
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const current = candidates[index];
  if (!current) return;
  const patch = {
    coverageQaDecision: decision,
    coverageQaDecisionAt: new Date().toISOString(),
    coverageQaDecisionBy: currentSession?.email || "",
    ...(status ? { status } : {})
  };
  updateCoverageCandidate(
    index,
    patch,
    decision === "pass" ? "QA passed" : decision === "fail" ? "QA failed" : "needs source classification",
    statusTarget
  );
  const persistedCandidate = current.id
    ? await persistCoverageQaDecisionState(current.id, {
      coverageQaDecision: decision,
      qaChecks: coverageQaChecks({ ...current, ...patch }).checks,
      reviewerNote: decision === "pass" ? "QA passed" : decision === "fail" ? "QA failed" : "Needs source classification"
    })
    : await persistSourceCandidateState({ ...current, ...patch });
  if (persistedCandidate) upsertAskingSourceCandidateLocal(persistedCandidate);
  renderCoverageRequests();
  renderManualReviewQueue();
}

function coverageWorkflowNextAction(candidate, stage = coverageStageState(candidate)) {
  const qa = coverageQaChecks(candidate, stage);
  if (!qa.checks[0].done) return `Blocked: ${qa.checks[0].detail}`;
  if (!qa.ready && candidate.status === "approved for pilot") return "Next: complete QA checks before creating a public sample.";
  if (stage.rejected) return "Rejected: keep for audit or restore only if the request is requalified.";
  if (!stage.approved) return "Next: review request and approve only if the area/type can support a usable benchmark.";
  if (!stage.sampleReady) return "Next: create the pilot sample so the public result can be previewed.";
  if (!stage.synced) return "Next: run pilot source sync before production readiness.";
  if (!stage.productionReady) return "Next: mark production ready after source sync and QA review.";
  return "Live: production verified. Monitor ingestion, source exceptions, and public trust badge.";
}

function renderCoverageReadinessChecklist(candidate, stage = coverageStageState(candidate)) {
  const checklist = document.createElement("ul");
  checklist.className = "coverage-readiness-checklist";
  const checks = coverageQaChecks(candidate, stage).checks;
  checks.forEach((check) => {
    const item = document.createElement("li");
    item.dataset.done = String(Boolean(check.done) && !stage.rejected);
    item.title = check.detail;
    item.textContent = check.label;
    checklist.append(item);
  });
  return checklist;
}

function renderCoverageFilters(counts) {
  if (!accountEl.coverageFilterButtons) return;
  accountEl.coverageFilterButtons.forEach((button) => {
    const filter = button.dataset.coverageFilter || "all";
    button.classList.toggle("active", filter === coverageRequestFilter);
    button.setAttribute("aria-selected", filter === coverageRequestFilter ? "true" : "false");
    if (filter === "pending") button.textContent = `Pending ${counts.pending}`;
    if (filter === "pilot") button.textContent = `Pilot Verified ${counts.approved}`;
    if (filter === "production") button.textContent = `Production Ready ${counts.productionReady}`;
    if (filter === "rejected") button.textContent = `Rejected ${counts.rejected}`;
    if (filter === "all") button.textContent = `All ${counts.total}`;
  });
}

function renderCoverageLifecycle(candidate) {
  const lifecycle = document.createElement("div");
  lifecycle.className = "coverage-lifecycle";
  const state = coverageStageState(candidate);
  lifecycle.dataset.stage = state.rejected ? "rejected" : state.productionReady ? "production" : state.current.toLowerCase().replace(/\s+/g, "-");

  const summary = document.createElement("strong");
  summary.textContent = state.rejected ? "Rejected from coverage flow" : `Next stage: ${state.current}`;

  const steps = document.createElement("ol");
  state.steps.forEach((step) => {
    const item = document.createElement("li");
    item.dataset.done = String(step.done && !state.rejected);
    item.textContent = step.label;
    steps.append(item);
  });

  lifecycle.append(summary, steps);
  return lifecycle;
}

function coverageReviewControls(index, candidate, statusTarget = accountEl.coverageRequestStatus) {
  const controls = document.createElement("div");
  controls.className = "coverage-review-controls";

  const classify = document.createElement("select");
  classify.setAttribute("aria-label", "Source classification");
  [
    ["", "Classify source"],
    ["retail-hdb", "Retail: HDB/neighbourhood"],
    ["retail-shophouse", "Retail: shophouse"],
    ["retail-mall", "Retail: mall"],
    ["neighbourhood-shop", "Retail: neighbourhood shop"],
    ["industrial", "Industrial"],
    ["office", "Office"],
    ["warehouse", "Warehouse"],
    ["exclude", "Exclude"]
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    classify.append(option);
  });
  classify.value = candidate.sourceClassification || "";

  const classifyButton = document.createElement("button");
  classifyButton.type = "button";
  classifyButton.textContent = "Classify";
  classifyButton.addEventListener("click", async () => {
    if (!classify.value) {
      if (statusTarget) statusTarget.textContent = "Choose a source classification first.";
      return;
    }
    await classifyCoverageCandidate(index, classify.value, statusTarget);
  });

  const pass = document.createElement("button");
  pass.type = "button";
  pass.textContent = "Pass QA";
  pass.disabled = !classificationAllowsSample(candidate.sourceClassification || "");
  pass.addEventListener("click", async () => await recordCoverageQaDecision(index, "pass", statusTarget));

  const needsSource = document.createElement("button");
  needsSource.type = "button";
  needsSource.textContent = "Needs Source";
  needsSource.addEventListener("click", async () => await recordCoverageQaDecision(index, "needs-source", statusTarget));

  const fail = document.createElement("button");
  fail.type = "button";
  fail.textContent = "Fail";
  fail.addEventListener("click", async () => await recordCoverageQaDecision(index, "fail", statusTarget));

  const state = document.createElement("span");
  state.textContent = `${classificationLabel(candidate.sourceClassification)} / ${candidate.coverageQaDecision || "No QA decision"}`;

  controls.append(classify, classifyButton, pass, needsSource, fail, state);
  return controls;
}

function renderCoverageRequests() {
  if (!accountEl.coverageRequestList) return;
  const entries = coverageRequestEntries();
  const counts = coverageRequestStatusCounts(entries);
  const rankedEntries = entries
    .map((entry) => ({ ...entry, priority: coveragePriorityScore(entry.candidate) }))
    .sort((a, b) => b.priority - a.priority || new Date(b.candidate.addedAt || 0) - new Date(a.candidate.addedAt || 0));
  const filteredEntries = rankedEntries.filter(({ candidate }) => coverageFilterMatches(candidate));
  accountEl.coverageRequestSummary.textContent = counts.productionReady
    ? `${counts.pending} pending / ${counts.productionReady} production ready`
    : `${counts.pending} pending / ${entries.length} total`;
  accountEl.coveragePendingMetric.textContent = String(counts.pending);
  accountEl.coverageApprovedMetric.textContent = String(counts.approved);
  accountEl.coverageRejectedMetric.textContent = String(counts.rejected);
  renderCoverageFilters({ ...counts, total: entries.length });
  accountEl.coverageRequestList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = "No public coverage requests yet. When someone searches an uncovered retail area, it will land here for review.";
    accountEl.coverageRequestList.append(empty);
    renderCoverageShortcut();
    return;
  }

  if (!filteredEntries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = "No coverage requests match this filter right now. Try another filter or wait for a new public request.";
    accountEl.coverageRequestList.append(empty);
    renderCoverageShortcut();
    return;
  }

  filteredEntries.slice(0, 8).forEach(({ candidate, index, priority }) => {
    const row = document.createElement("article");
    row.className = "coverage-request-item";
    row.dataset.status = candidate.status;

    const title = document.createElement("strong");
    title.textContent = candidate.requestedQuery || candidate.name;
    const detail = document.createElement("span");
    detail.textContent = candidate.requestEmail
      ? `Public search - ${candidate.requestEmail}`
      : "Public search - no email";
    const note = document.createElement("em");
    const requestContext = [
      candidate.requestedPropertyType,
      candidate.requestedUseCase,
      candidate.requestedUrgency && candidate.requestedUrgency !== "normal" ? candidate.requestedUrgency : ""
    ].filter(Boolean).join(" / ");
    note.textContent = candidate.addedAt
      ? `Requested ${new Date(candidate.addedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}${requestContext ? ` - ${requestContext}` : ""}`
      : candidate.name;
    const status = document.createElement("small");
    const stage = coverageStageState(candidate);
    row.dataset.stage = stage.productionReady ? "production" : stage.synced ? "synced" : stage.sampleReady ? "sample" : stage.approved ? "approved" : candidate.status;
    status.textContent = stage.productionReady ? "production ready" : candidate.status;
    const priorityBadge = document.createElement("mark");
    priorityBadge.className = "coverage-priority-badge";
    priorityBadge.dataset.priority = coveragePriorityLabel(priority).toLowerCase();
    priorityBadge.textContent = `${coveragePriorityLabel(priority)} ${priority}`;
    const workflowNote = document.createElement("p");
    workflowNote.className = "coverage-workflow-note";
    workflowNote.textContent = coverageWorkflowNextAction(candidate, stage);

    const actions = document.createElement("div");
    actions.className = "coverage-request-actions";

    const approve = document.createElement("button");
    approve.type = "button";
    approve.textContent = "Approve Coverage";
    approve.disabled = candidate.status === "approved for pilot";
    approve.addEventListener("click", async () => await reviewAskingSourceCandidate(index, "approved for pilot", "coverage"));

    const reject = document.createElement("button");
    reject.type = "button";
    reject.textContent = "Reject";
    reject.disabled = candidate.status === "rejected";
    reject.addEventListener("click", async () => await reviewAskingSourceCandidate(index, "rejected", "coverage"));

    const createRecord = document.createElement("button");
    createRecord.type = "button";
    const hasCoverageRecord = coverageRecordExists(candidate) || Boolean(candidate.sampleRecordId);
    const qa = coverageQaChecks(candidate, stage);
    createRecord.textContent = hasCoverageRecord ? "Record Ready" : "Create Sample";
    createRecord.disabled = candidate.status !== "approved for pilot" || hasCoverageRecord || !qa.ready;
    if (!qa.ready) createRecord.title = "Complete admin QA checklist before creating a sample.";
    createRecord.addEventListener("click", async () => await createCoverageSampleRecord(index));

    actions.append(approve, reject, createRecord);
    if (hasCoverageRecord) {
      const openRecord = document.createElement("a");
      openRecord.href = coverageSampleHref(candidate);
      openRecord.textContent = "Public Sample Live";
      actions.append(openRecord);
    }
    const markReady = document.createElement("button");
    markReady.type = "button";
    markReady.textContent = "Mark Production Ready";
    markReady.disabled = !stage.synced || stage.productionReady || candidate.status === "rejected";
    markReady.addEventListener("click", async () => await markCoverageProductionReady(index));

    actions.append(markReady);
    row.append(
      title,
      detail,
      note,
      status,
      priorityBadge,
      actions,
      workflowNote,
      coverageReviewControls(index, candidate),
      renderCoverageReadinessChecklist(candidate, stage),
      renderCoverageLifecycle(candidate)
    );
    accountEl.coverageRequestList.append(row);
  });
  renderCoverageShortcut();
}

function renderManualReviewQueue() {
  if (!accountEl.manualReviewList) return;
  const entries = coverageRequestEntries().filter(({ candidate }) => candidateManualReviewState(candidate));
  accountEl.manualReviewSummary.textContent = entries.length
    ? `${entries.length} manual review`
    : "0 items";
  accountEl.manualReviewList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "No manual-review searches yet.";
    accountEl.manualReviewList.append(empty);
    return;
  }

  entries.slice(0, 8).forEach(({ candidate, index }) => {
    const row = document.createElement("article");
    row.className = "manual-review-item";
    const title = document.createElement("strong");
    title.textContent = candidate.requestedQuery || candidate.name;
    const detail = document.createElement("span");
    const eligibility = coverageEligibilityForCandidate(candidate);
    detail.textContent = `${eligibility.reason} ${candidate.requestEmail ? `Update: ${candidate.requestEmail}` : "No update email"}`;
    const meta = document.createElement("small");
    meta.textContent = `${classificationLabel(candidate.sourceClassification)} / ${candidate.coverageQaDecision || "no QA decision"}`;
    row.append(title, detail, meta, coverageReviewControls(index, candidate, accountEl.coverageRequestStatus));
    accountEl.manualReviewList.append(row);
  });
}

async function markCoverageProductionReady(index) {
  if (!sessionHasAccess(currentSession)) {
    accountEl.coverageRequestStatus.textContent =
      "Active or promo access is required to mark coverage production ready.";
    return;
  }
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const candidate = candidates[index];
  if (!candidate) return;
  const stage = coverageStageState(candidate);
  if (!stage.synced) {
    accountEl.coverageRequestStatus.textContent =
      "Run pilot source sync before marking this request production ready.";
    return;
  }
  const productionCandidate = {
    ...candidate,
    productionReadyAt: new Date().toISOString(),
    productionReadyBy: currentSession.email
  };
  candidates[index] = productionCandidate;
  writeStoredJson(askingSourceCandidatesKey, candidates);
  const persistedCandidate = await persistSourceCandidateState(productionCandidate);
  if (persistedCandidate) upsertAskingSourceCandidateLocal(persistedCandidate);
  updateCoverageRecordProductionState(productionCandidate);
  accountEl.coverageRequestStatus.textContent =
    `${sourceCandidateName(candidate)} marked production ready for backend ingestion.`;
  recordActivity("Coverage production ready", sourceCandidateName(candidate));
  renderCoverageRequests();
  renderSourceSyncPipeline();
  renderBackendHandoff();
}

function updateCoverageRecordProductionState(candidate) {
  const base = coverageRecordForCandidate(candidate);
  const records = coveragePrototypeRecords();
  const existing = records.find((record) => record.id === (candidate.sampleRecordId || base.id)) || base;
  const capturedAt = (candidate.productionReadyAt || new Date().toISOString()).slice(0, 10);
  const productionRecord = {
    ...existing,
    confidence: "Production verified",
    askingSourceStatus: "production-ready",
    askingSource: {
      ...(existing.askingSource || {}),
      sourceName: existing.askingSource?.sourceName || "Coverage production source",
      sourceType: existing.askingSource?.sourceType || "verified-production-capture",
      listingCount: existing.askingSource?.listingCount || 1,
      capturedAt: existing.askingSource?.capturedAt || capturedAt,
      productionReady: true,
      note: existing.askingSource?.note || `Production verified from coverage review by ${candidate.productionReadyBy || "RentIntel"}.`
    },
    sourceSummary: `${existing.sourceSummary || base.sourceSummary} Production verified from coverage review on ${formatShortDate(capturedAt)}.`,
    productionReadyAt: candidate.productionReadyAt,
    productionReadyBy: candidate.productionReadyBy
  };
  writeStoredJson(coverageRecordsKey, [
    productionRecord,
    ...records.filter((record) => record.id !== productionRecord.id)
  ].slice(0, 50));
}

async function createCoverageSampleRecord(index) {
  if (!sessionHasAccess(currentSession)) {
    accountEl.coverageRequestStatus.textContent =
      "Active or promo access is required to create a sample rent record.";
    recordActivity("Coverage sample blocked", accountEl.coverageRequestStatus.textContent);
    return;
  }

  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const candidate = candidates[index];
  if (!candidate) return;
  const eligibility = coverageEligibilityForCandidate(candidate);
  if (!eligibility.sampleAllowed) {
    accountEl.coverageRequestStatus.textContent =
      `${sourceCandidateName(candidate)} was blocked. ${eligibility.reason}`;
    recordActivity("Coverage sample blocked", accountEl.coverageRequestStatus.textContent);
    if (eligibility.status === "blocked") sanitizeCoverageStorage();
    renderCoverageRequests();
    return;
  }
  const qa = coverageQaChecks(candidate);
  if (!qa.ready) {
    accountEl.coverageRequestStatus.textContent =
      `${sourceCandidateName(candidate)} needs admin QA before a sample can be created.`;
    recordActivity("Coverage sample blocked", accountEl.coverageRequestStatus.textContent);
    renderCoverageRequests();
    return;
  }
  if (candidate.status !== "approved for pilot") {
    accountEl.coverageRequestStatus.textContent =
      "Approve the coverage request before creating a sample record.";
    return;
  }

  const result = saveCoverageSampleRecordForCandidate(candidates, index);
  if (!result) return;
  let persistedCandidateState = candidates[index];
  if (persistedCandidateState && !persistedCandidateState.id) {
    const seededCandidate = await persistSourceCandidateState(persistedCandidateState);
    if (seededCandidate) {
      upsertAskingSourceCandidateLocal(seededCandidate);
      persistedCandidateState = seededCandidate;
    }
  }
  if (persistedCandidateState?.id) {
    const persisted = await persistCoverageSampleRecordState(persistedCandidateState.id, {
      sampleRecord: result.record,
      publicTrustLevel: result.record.confidence || "Sample",
      sourceSummary: result.record.sourceSummary || ""
    });
    if (persisted?.candidate) upsertAskingSourceCandidateLocal(persisted.candidate);
    if (persisted?.sampleRecord) writeCoverageSampleRecordsLocal([persisted.sampleRecord, ...coveragePrototypeRecords()]);
  }
  accountEl.coverageRequestStatus.textContent = result.created
    ? `${result.record.title} sample record created. Open the public page to search it.`
    : `${result.record.title} sample record is already connected.`;
  recordActivity(result.created ? "Coverage sample created" : "Coverage sample confirmed", `${result.record.title}: ${result.record.id}`);
  renderCoverageRequests();
  renderSourceSyncPipeline();
  renderSourceStatus();
  renderTodayBrief();
  renderMemberCommandCenter();
}

function saveCoverageSampleRecordForCandidate(candidates, index) {
  const candidate = candidates[index];
  if (!candidate) return null;
  const record = coverageRecordForCandidate(candidate);
  const existing = coveragePrototypeRecords().find((entry) => entry.id === record.id);
  const records = coveragePrototypeRecords().filter((entry) => entry.id !== record.id);
  if (!existing) writeStoredJson(coverageRecordsKey, [record, ...records].slice(0, 50));
  else writeStoredJson(coverageRecordsKey, [existing, ...records].slice(0, 50));
  candidates[index] = {
    ...candidate,
    sampleRecordId: existing?.id || record.id,
    sampleRecordCreatedAt: candidate.sampleRecordCreatedAt || existing?.generatedAt || record.generatedAt
  };
  writeStoredJson(askingSourceCandidatesKey, candidates);
  return {
    record: existing || record,
    candidate: candidates[index],
    created: !existing
  };
}

async function reviewAskingSourceCandidate(index, status, context = "source") {
  if (!sessionHasAccess(currentSession)) {
    const message =
        "Active or promo access is required to review asking-rent source candidates.";
    if (context === "coverage" && accountEl.coverageRequestStatus) {
      accountEl.coverageRequestStatus.textContent = message;
    } else {
      accountEl.askingSourceStatus.textContent = message;
    }
    recordActivity("Asking source review blocked", message);
    return;
  }

  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  if (!candidates[index]) return;
  candidates[index] = {
    ...candidates[index],
    status,
    reviewedAt: new Date().toISOString()
  };
  writeStoredJson(askingSourceCandidatesKey, candidates);
  const persistedCandidate = await persistSourceCandidateState({
    ...candidates[index],
    reviewedBy: currentSession?.email || ""
  });
  if (persistedCandidate) upsertAskingSourceCandidateLocal(persistedCandidate);
  const reviewedCandidate = candidates[index];
  const label = sourceCandidateName(reviewedCandidate);
  if (context === "coverage" && accountEl.coverageRequestStatus) {
    accountEl.coverageRequestStatus.textContent = `${label} marked ${status}. Complete classification and QA before creating a sample.`;
  } else {
    accountEl.askingSourceStatus.textContent = `${label} marked ${status}.`;
  }
  renderAskingSourceCandidates();
  renderCoverageRequests();
  renderManualReviewQueue();
  renderSourceStatus();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
  recordActivity(context === "coverage" ? "Coverage request reviewed" : "Asking source reviewed", `${label}: ${status}`);
}

async function addAskingSourceCandidate() {
  if (!sessionHasAccess(currentSession)) {
    accountEl.askingSourceStatus.textContent =
      "Free saved tools can view source status. Approved internal access is required to add source candidates.";
    recordActivity("Asking source blocked", accountEl.askingSourceStatus.textContent);
    return;
  }

  const name = accountEl.askingSourceName.value.trim();
  if (!name) return;

  const candidate = {
    type: accountEl.askingSourceType.value,
    name,
    status: "candidate review",
    addedAt: new Date().toISOString(),
    source: "member-account"
  };
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const persistedCandidate = await persistSourceCandidateState(candidate);
  upsertAskingSourceCandidateLocal(persistedCandidate || candidate);
  accountEl.askingSourceName.value = "";
  accountEl.askingSourceStatus.textContent = `${candidate.type} candidate added for asking-rent feed review.`;
  renderAskingSourceCandidates();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
  recordActivity("Asking source candidate", `${candidate.type}: ${candidate.name}`);
}

function renderCoverageTargets(coverageTargets) {
  if (!accountEl.coverageTargetList) return;
  accountEl.coverageTargetList.replaceChildren();

  if (!coverageTargets.length) {
    const empty = document.createElement("p");
    empty.textContent = "No approved coverage targets yet.";
    accountEl.coverageTargetList.append(empty);
    return;
  }

  coverageTargets.slice(0, 8).forEach((target) => {
    const item = document.createElement("article");
    item.className = "coverage-target-item";

    const title = document.createElement("strong");
    title.textContent = sourceCandidateName(target);
    const detail = document.createElement("span");
    detail.textContent = target.requestEmail
      ? `Requested by ${target.requestEmail}`
      : target.source === "public-search-no-match"
        ? "Requested from public search"
        : "Approved source target";
    const status = document.createElement("small");
    status.textContent = "pilot target";

    item.append(title, detail, status);
    accountEl.coverageTargetList.append(item);
  });
}

function renderSourceSyncAutomationPanel() {
  if (!accountEl.sourceSyncAutomationForm) return;
  const hasAccess = sessionHasAccess(currentSession);
  const evaluation = evaluateSourceSyncFreshnessBreach();
  const effectiveQa = evaluation.qa || askingFeedQaSummary();
  const automation = sourceSyncAutomation();
  const enabled = Boolean(automation.enabled);
  const cadence = automation.cadence === "12h" ? "12h" : "daily";
  const runHourSgt = Math.max(0, Math.min(23, Number(automation.runHourSgt) || 8));
  const nextRunAt = enabled
    ? sourceSyncAutomationNextRun(cadence, runHourSgt)
    : "";
  if (automation.nextRunAt !== nextRunAt) {
    writeSourceSyncAutomation({ nextRunAt });
  }

  accountEl.sourceSyncAutomationSummary.textContent = enabled
    ? cadence === "12h"
      ? "Every 12 hours + freshness breach watch"
      : `Daily ${String(runHourSgt).padStart(2, "0")}:00 SGT + freshness breach watch`
    : "Automation paused";
  accountEl.sourceSyncAutomationEnabled.checked = enabled;
  accountEl.sourceSyncAutomationCadence.value = cadence;
  accountEl.sourceSyncAutomationHour.value = String(runHourSgt);
  accountEl.sourceSyncAutomationHour.disabled = cadence === "12h";
  accountEl.sourceSyncAutomationEnabled.disabled = !hasAccess;
  accountEl.sourceSyncAutomationCadence.disabled = !hasAccess;
  accountEl.saveSourceSyncAutomationButton.disabled = !hasAccess;
  accountEl.runSourceSyncAutomationNowButton.disabled = !hasAccess;

  accountEl.sourceSyncAutomationNextRun.textContent = enabled ? formatDateTime(nextRunAt) : "Paused";
  accountEl.sourceSyncAutomationLastRun.textContent = automation.lastRunAt
    ? `${formatDateTime(automation.lastRunAt)} (${automation.lastRunStatus || "ok"})`
    : "Never";
  accountEl.sourceSyncAutomationFreshness.textContent = effectiveQa.freshnessLabel;
  accountEl.sourceSyncAutomationBreaches.textContent = String(Number(automation.breachCount || 0));

  if (!hasAccess) {
    accountEl.sourceSyncAutomationStatus.textContent =
      "Active or promo access is required to save or run source sync automation.";
  } else if (evaluation.breached) {
    accountEl.sourceSyncAutomationStatus.textContent =
      `Freshness breach detected: moved to ${effectiveQa.freshnessLabel}. Member alert queue updated.`;
  } else {
    accountEl.sourceSyncAutomationStatus.textContent =
      `Automation contract ready. Current freshness: ${effectiveQa.freshnessLabel}.`;
  }

  accountEl.sourceSyncAutomationLog.replaceChildren();
  const history = Array.isArray(automation.history) ? automation.history.slice(0, 8) : [];
  if (!history.length) {
    const empty = document.createElement("p");
    empty.textContent = "No automation events yet.";
    accountEl.sourceSyncAutomationLog.append(empty);
    return;
  }

  history.forEach((event) => {
    const item = document.createElement("article");
    item.className = "source-sync-automation-item";
    item.dataset.state = event.state || "run";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = event.summary || "Automation event";
    const detail = document.createElement("span");
    detail.textContent = event.detail || "No detail";
    copy.append(title, detail);
    const at = document.createElement("small");
    at.textContent = formatDateTime(event.at);
    item.append(copy, at);
    accountEl.sourceSyncAutomationLog.append(item);
  });
}

function renderSourceSyncPipeline() {
  if (!accountEl.sourceSyncLog) return;
  const approvedSources = approvedAskingSources();
  const coverageTargets = approvedCoverageTargets();
  const syncRuns = sourceSyncRuns();
  const latestSync = latestApprovedSourceSync(approvedSources);
  const hasAccess = sessionHasAccess(currentSession);

  accountEl.approvedSourceMetric.textContent = String(approvedSources.length);
  accountEl.coverageTargetMetric.textContent = String(coverageTargets.length);
  accountEl.latestSyncMetric.textContent = latestSync
    ? new Date(latestSync.at).toLocaleDateString("en-SG", { day: "2-digit", month: "short" })
    : "Not run";
  accountEl.recordsCheckedMetric.textContent = latestSync ? String(latestSync.recordsChecked) : "0";
  accountEl.sourceSyncSummary.textContent = latestSync
    ? `${latestSync.status}: ${latestSync.recordsChecked} records`
    : approvedSources.length
      ? coverageTargets.length
        ? `${coverageTargets.length} coverage target ready`
        : "Approved source ready"
      : "Approve source first";
  accountEl.runSourceSyncButton.disabled = !hasAccess || !approvedSources.length;
  accountEl.runSourceSyncButton.textContent = approvedSources.length ? "Run Pilot Sync" : "Approve Source First";
  renderSourceSyncAutomationPanel();
  renderCoverageTargets(coverageTargets);
  accountEl.sourceSyncLog.replaceChildren();

  if (!syncRuns.length) {
    const empty = document.createElement("p");
    empty.textContent = approvedSources.length
      ? "Approved source is ready for a pilot sync."
      : "No source sync runs yet.";
    accountEl.sourceSyncLog.append(empty);
    renderCoverageShortcut();
    return;
  }

  syncRuns.slice(0, 6).forEach((sync) => {
    const row = document.createElement("article");
    row.className = "source-sync-item";

    const title = document.createElement("strong");
    title.textContent = sync.sourceName;
    const detail = document.createElement("span");
    detail.textContent = sync.coverageTargets?.length
      ? `${sync.recordsChecked} records checked | ${sync.coverageTargets.length} coverage targets`
      : `${sync.recordsChecked} records checked against ${sync.benchmarkLayer}`;
    const status = document.createElement("small");
    status.textContent = sync.status;
    const time = document.createElement("em");
    time.textContent = new Date(sync.at).toLocaleString("en-SG", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    row.append(title, detail, status, time);
    accountEl.sourceSyncLog.append(row);
  });
  renderCoverageShortcut();
}

async function saveSourceSyncAutomation() {
  if (!sessionHasAccess(currentSession)) {
    accountEl.sourceSyncAutomationStatus.textContent =
      "Active or promo access is required to save source sync automation.";
    return;
  }
  const enabled = Boolean(accountEl.sourceSyncAutomationEnabled.checked);
  const cadence = accountEl.sourceSyncAutomationCadence.value === "12h" ? "12h" : "daily";
  const runHourSgt = Math.max(0, Math.min(23, Number(accountEl.sourceSyncAutomationHour.value) || 8));
  const nextRunAt = enabled ? sourceSyncAutomationNextRun(cadence, runHourSgt) : "";
  const updatedAt = new Date().toISOString();
  writeSourceSyncAutomation({
    enabled,
    cadence,
    runHourSgt,
    nextRunAt,
    updatedAt,
    updatedBy: currentSession?.email || "member"
  });
  await persistSourceSyncAutomationState(sourceSyncAutomation());
  appendSourceSyncAutomationEvent(
    enabled ? "Schedule updated" : "Schedule paused",
    enabled
      ? cadence === "12h"
        ? "Automation cadence set to every 12 hours."
        : `Automation cadence set to daily ${String(runHourSgt).padStart(2, "0")}:00 SGT.`
      : "Automation disabled by member action.",
    "schedule",
    updatedAt
  );
  accountEl.sourceSyncAutomationStatus.textContent = enabled
    ? `Source sync schedule saved. Next run: ${formatDateTime(nextRunAt)}.`
    : "Source sync schedule paused.";
  renderSourceSyncPipeline();
}

async function runSourceSyncAutomationNow() {
  if (!sessionHasAccess(currentSession)) {
    accountEl.sourceSyncAutomationStatus.textContent =
      "Active or promo access is required to run source sync automation.";
    return;
  }
  const syncRun = await runPilotSourceSync("automation");
  if (!syncRun) return;
  accountEl.sourceSyncAutomationStatus.textContent =
    `Automation run complete at ${formatDateTime(syncRun.at)}.`;
}

async function runPilotSourceSync(mode = "manual") {
  const approvedSources = approvedAskingSources();
  if (!sessionHasAccess(currentSession)) {
    accountEl.sourceSyncStatus.textContent =
      "Active or promo access is required to run source sync checks.";
    recordActivity("Source sync blocked", accountEl.sourceSyncStatus.textContent);
    return;
  }

  if (!approvedSources.length) {
    accountEl.sourceSyncStatus.textContent = "Approve at least one asking-rent source before running a pilot sync.";
    return;
  }

  const refreshedFeed = await refreshAskingFeedState();
  const recordsChecked = rentRecordList().length;
  const source = approvedSources[0];
  const coverageTargets = approvedCoverageTargets().map((target) => ({
    name: sourceCandidateName(target),
    sourceKey: sourceCandidateKey(target),
    requestEmail: target.requestEmail || "",
    source: target.source || "member-account",
    sampleRecordId: target.sampleRecordId || "",
    approvedAt: target.reviewedAt || ""
  }));
  const syncRun = {
    sourceName: sourceCandidateName(source),
    sourceType: source.type,
    sourceKey: sourceCandidateKey(source),
    status: "pilot sync complete",
    recordsChecked: recordsChecked + coverageTargets.length,
    benchmarkLayer: "URA benchmark sample",
    coverageTargets,
    varianceFlag: "manual QA required before production",
    at: new Date().toISOString()
  };
  const syncRuns = sourceSyncRuns();
  writeStoredJson(sourceSyncLogKey, [syncRun, ...syncRuns].slice(0, 20));
  await persistSourceSyncRunState(syncRun);
  const syncedAt = syncRun.at;
  const targetKeys = new Set(coverageTargets.map((target) => target.sourceKey));
  const candidates = loadStoredJson(askingSourceCandidatesKey, []);
  const updatedCandidates = candidates.map((candidate) =>
    targetKeys.has(sourceCandidateKey(candidate))
      ? { ...candidate, sourceSyncedAt: syncedAt, sourceSyncRunKey: syncRun.sourceKey }
      : candidate
  );
  writeStoredJson(askingSourceCandidatesKey, updatedCandidates);

  const automation = sourceSyncAutomation();
  const cadence = automation.cadence === "12h" ? "12h" : "daily";
  const runHourSgt = Math.max(0, Math.min(23, Number(automation.runHourSgt) || 8));
  const nextRunAt = automation.enabled ? sourceSyncAutomationNextRun(cadence, runHourSgt) : "";
  writeSourceSyncAutomation({
    lastRunAt: syncRun.at,
    lastRunStatus: syncRun.status,
    lastRunMode: mode,
    nextRunAt
  });
  await persistSourceSyncAutomationState(sourceSyncAutomation());
  appendSourceSyncAutomationEvent(
    mode === "automation" ? "Scheduled sync run complete" : "Pilot sync run complete",
    `${sourceCandidateName(source)} checked ${syncRun.recordsChecked} records with ${coverageTargets.length} coverage targets.`,
    "run",
    syncRun.at
  );

  accountEl.sourceSyncStatus.textContent =
    `${sourceCandidateName(source)} pilot sync complete. ${syncRun.recordsChecked} checks including ${coverageTargets.length} coverage targets.${refreshedFeed?.updatedAt ? ` Feed refreshed ${refreshedFeed.updatedAt}.` : ""}`;
  renderCoverageRequests();
  renderSourceSyncPipeline();
  renderSourceStatus();
  renderAccountSourceQa();
  renderMemberCommandCenter();
  recordActivity("Pilot source sync", `${sourceCandidateName(source)}: ${syncRun.recordsChecked} checks${refreshedFeed?.updatedAt ? `, feed refreshed ${refreshedFeed.updatedAt}` : ""}`);
  return syncRun;
}

function renderActivityLog() {
  if (!accountEl.activityLogList) return;
  const events = loadStoredJson(activityLogKey, []);
  accountEl.activityLogCount.textContent = `${events.length} events`;
  accountEl.activityLogList.replaceChildren();

  if (!events.length) {
    const empty = document.createElement("p");
    empty.textContent = "No member activity yet.";
    accountEl.activityLogList.append(empty);
    return;
  }

  events.slice(0, 8).forEach((event) => {
    const row = document.createElement("article");
    row.className = "activity-log-item";
    const title = document.createElement("strong");
    title.textContent = event.label;
    const detail = document.createElement("span");
    detail.textContent = event.detail;
    const time = document.createElement("small");
    time.textContent = new Date(event.at).toLocaleString("en-SG", {
      dateStyle: "medium",
      timeStyle: "short"
    });
    row.append(title, detail, time);
    accountEl.activityLogList.append(row);
  });
}

function adminReviewConsoleState(requests = activationRequests()) {
  const pending = requests.filter((request) =>
    !["pilot approved", "reviewed - waitlist"].includes(request.status)
  ).length;
  const approved = requests.filter((request) => request.status === "pilot approved").length;
  const waitlist = requests.filter((request) => request.status === "reviewed - waitlist").length;
  const sampleRecord = todayBriefRecord || rentRecordList()[0] || null;
  const trust = sourceTrustProfile(sampleRecord);
  const opsReview = productionOpsReview();
  const release = productionReleaseLogPackage();
  return {
    pending,
    approved,
    waitlist,
    trust,
    opsReview,
    release
  };
}

function adminReviewProfile(request, consoleState = adminReviewConsoleState()) {
  const approved = request.status === "pilot approved";
  const waitlist = request.status === "reviewed - waitlist";
  const member = memberFromRequestEmail(request.email);
  const active = sessionHasAccess(member) || approved;
  const trust = consoleState.trust;
  const gate = consoleState.opsReview;
  const release = consoleState.release;
  const decision = active
    ? "Workspace access active"
    : waitlist
      ? "Login preview only"
      : "Review for pilot access";
  const publicBadge = release.state === "released"
    ? "Production Verified"
    : trust.title || "Sample";
  const nextEvidence = release.state === "released"
    ? "Monitor source exceptions"
    : gate.action || trust.action || "Complete source evidence review.";
  return {
    decision,
    publicBadge,
    sourceGate: gate.stage || "Draft",
    releaseStatus: release.status || "Not released",
    nextEvidence,
    sourceCopy: `${trust.reason || "Source state pending"} ${trust.action || ""}`.trim()
  };
}

function renderAdminReviewQueue() {
  if (!accountEl.adminReviewList) return;
  const requests = activationRequests();
  const consoleState = adminReviewConsoleState(requests);
  accountEl.adminReviewSummary.textContent = `${consoleState.pending} pending`;
  if (accountEl.adminReviewActivationMetric) {
    accountEl.adminReviewActivationMetric.textContent =
      `${consoleState.pending} pending`;
    accountEl.adminReviewActivationCopy.textContent =
      `${consoleState.approved} pilot approved / ${consoleState.waitlist} waitlist reviewed`;
    accountEl.adminReviewBadgeMetric.textContent = consoleState.trust.title || "Sample";
    accountEl.adminReviewBadgeCopy.textContent =
      consoleState.trust.action || "Public trust badge follows source state.";
    accountEl.adminReviewGateMetric.textContent = consoleState.opsReview.stage || "Draft";
    accountEl.adminReviewGateCopy.textContent = consoleState.opsReview.decision
      ? `${consoleState.opsReview.decision}: ${consoleState.opsReview.action}`
      : consoleState.opsReview.action;
    accountEl.adminReviewReleaseMetric.textContent = consoleState.release.status || "Not released";
    accountEl.adminReviewReleaseCopy.textContent = consoleState.release.nextAction || consoleState.release.summary;
  }
  accountEl.adminReviewList.replaceChildren();

  if (!requests.length) {
    const row = document.createElement("article");
    row.className = "admin-review-item admin-review-source-item";
    row.dataset.status = consoleState.opsReview.state || "draft";
    const title = document.createElement("strong");
    title.textContent = "No activation request queued";
    const detail = document.createElement("span");
    detail.textContent = "Use this panel to review member activation together with the public trust badge and source gate.";
    const status = document.createElement("small");
    status.textContent = consoleState.trust.title || "Sample";
    const note = document.createElement("em");
    note.textContent = consoleState.opsReview.stage || "Draft";
    const insight = document.createElement("div");
    insight.className = "admin-review-context";
    [
      ["Public badge", consoleState.trust.title || "Sample", consoleState.trust.action || "Verify source evidence."],
      ["Source gate", consoleState.opsReview.stage || "Draft", consoleState.opsReview.action],
      ["Release", consoleState.release.status || "Not released", consoleState.release.nextAction || consoleState.release.summary]
    ].forEach(([labelText, valueText, detailText]) => {
      const item = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = labelText;
      const value = document.createElement("strong");
      value.textContent = valueText;
      const copy = document.createElement("em");
      copy.textContent = detailText;
      item.append(label, value, copy);
      insight.append(item);
    });
    row.append(title, detail, status, note, insight);
    accountEl.adminReviewList.append(row);
    return;
  }

  requests.slice(0, 8).forEach((request) => {
    const profile = adminReviewProfile(request, consoleState);
    const row = document.createElement("article");
    row.className = "admin-review-item";
    row.dataset.status = request.status;

    const title = document.createElement("strong");
    title.textContent = request.email;
    const detail = document.createElement("span");
    detail.textContent = `${request.plan} - ${request.useCase || "No use case added"}`;
    const status = document.createElement("small");
    status.textContent = request.status;
    const time = document.createElement("em");
    time.textContent = new Date(request.requestedAt).toLocaleString("en-SG", {
      dateStyle: "medium",
      timeStyle: "short"
    });
    const context = document.createElement("div");
    context.className = "admin-review-context";
    [
      ["Access decision", profile.decision, request.plan],
      ["Public badge", profile.publicBadge, profile.sourceCopy],
      ["Source gate", profile.sourceGate, profile.nextEvidence],
      ["Release", profile.releaseStatus, "Public badge upgrades after controlled release."]
    ].forEach(([labelText, valueText, detailText]) => {
      const item = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = labelText;
      const value = document.createElement("strong");
      value.textContent = valueText;
      const copy = document.createElement("em");
      copy.textContent = detailText;
      item.append(label, value, copy);
      context.append(item);
    });

    const actions = document.createElement("div");
    actions.className = "admin-review-actions";
    const approve = document.createElement("button");
    approve.type = "button";
    approve.textContent = "Approve Pilot";
    approve.disabled = request.status === "pilot approved";
    approve.addEventListener("click", () => approveActivationRequestForEmail(request.email));

    const keepWaitlist = document.createElement("button");
    keepWaitlist.type = "button";
    keepWaitlist.textContent = "Keep Waitlist";
    keepWaitlist.disabled = request.status === "reviewed - waitlist";
    keepWaitlist.addEventListener("click", () => keepActivationWaitlistForEmail(request.email));

    actions.append(approve, keepWaitlist);
    row.append(title, detail, status, time, context, actions);
    accountEl.adminReviewList.append(row);
  });
}

function loadMemberEmail(email) {
  resetAccountLogin(`${normalizeEmail(email)} loaded. Send a login code to continue.`);
  accountEl.emailInput.value = normalizeEmail(email);
  accountEl.memberRegistryStatus.textContent = `${normalizeEmail(email)} loaded into login form.`;
}

function grantRegistryPilot(email) {
  const member = memberFromRequestEmail(email);
  const role = memberRole(member);
  const approvedMember = {
    ...member,
    email: normalizeEmail(email),
    memberStatus: "Pilot member",
    subscriptionStatus: "Pilot access active: S$0 registry approval",
    access: "promo",
    role,
    promoCode: "PILOT-REGISTRY",
    toolsEnabled: true,
    activatedAt: new Date().toISOString()
  };
  upsertJoinedMember(approvedMember);
  accountEl.memberRegistryStatus.textContent = `${normalizeEmail(email)} granted pilot access.`;
  if (normalizeEmail(currentSession?.email) === normalizeEmail(email)) {
    currentSession = {
      ...currentSession,
      memberStatus: approvedMember.memberStatus,
      subscriptionStatus: approvedMember.subscriptionStatus,
      access: approvedMember.access,
      role: approvedMember.role,
      isAdmin: approvedMember.role === "admin",
      promoCode: approvedMember.promoCode,
      toolsEnabled: approvedMember.toolsEnabled
    };
    writeStoredJson(memberSessionKey, currentSession);
    renderDashboard();
  } else {
    renderMemberRegistry();
    renderAdminReviewQueue();
    renderBackendHandoff();
  }
  recordActivity("Registry pilot granted", normalizeEmail(email));
}

async function setMemberRegistryRole(email, nextRole) {
  const normalized = normalizeEmail(email);
  const role = nextRole === "admin" ? "admin" : "member";
  if (!sessionCanEditFreshnessPolicy(currentSession)) {
    accountEl.memberRegistryStatus.textContent = "Admin access is required to update member roles.";
    return;
  }
  const members = uniqueMemberList();
  const target = members.find((member) => normalizeEmail(member.email) === normalized);
  if (!target) {
    accountEl.memberRegistryStatus.textContent = `${normalized} was not found in registry.`;
    return;
  }
  const adminCount = members.filter((member) => isAdminMember(member)).length;
  if (isAdminMember(target) && role === "member" && adminCount <= 1) {
    accountEl.memberRegistryStatus.textContent = "At least one admin must remain in the registry.";
    return;
  }
  const previousRole = memberRole(target);
  if (previousRole === role) {
    accountEl.memberRegistryStatus.textContent = `${normalized} is already ${role}.`;
    return;
  }
  if (window.RentIntelAuth?.updateMemberRole) {
    const result = await window.RentIntelAuth.updateMemberRole({
      targetEmail: normalized,
      nextRole: role,
      reason: "Registry admin role update"
    });
    if (result.ok && result.data?.memberRole) {
      const updated = {
        ...target,
        role: result.data.memberRole.nextRole
      };
      upsertJoinedMember(updated);
      if (result.data?.roleAudit) {
        pushMemberRoleAuditEvent(result.data.roleAudit);
      }
      if (normalizeEmail(currentSession?.email) === normalized) {
        currentSession = {
          ...currentSession,
          role: result.data.memberRole.nextRole,
          isAdmin: result.data.memberRole.nextRole === "admin"
        };
        writeStoredJson(memberSessionKey, currentSession);
        renderDashboard();
      } else {
        renderMemberRegistry();
        renderMemberRoleAuditLog();
        renderSourceStatus();
        renderBackendHandoff();
      }
      accountEl.memberRegistryStatus.textContent = `${normalized} role updated to ${result.data.memberRole.nextRole}.`;
      recordActivity("Member role updated", `${normalized} -> ${result.data.memberRole.nextRole}`);
      return;
    }
  }
  const updated = {
    ...target,
    role
  };
  upsertJoinedMember(updated);
  pushMemberRoleAuditEvent({
    targetEmail: normalized,
    previousRole,
    nextRole: role,
    reason: "Registry admin role update"
  });
  if (normalizeEmail(currentSession?.email) === normalized) {
    currentSession = {
      ...currentSession,
      role,
      isAdmin: role === "admin"
    };
    writeStoredJson(memberSessionKey, currentSession);
    renderDashboard();
  } else {
    renderMemberRegistry();
    renderMemberRoleAuditLog();
    renderSourceStatus();
    renderBackendHandoff();
  }
  accountEl.memberRegistryStatus.textContent = `${normalized} role updated to ${role}.`;
  recordActivity("Member role updated", `${normalized} -> ${role}`);
}

function renderMemberRegistry() {
  if (!accountEl.memberRegistryList) return;
  const members = uniqueMemberList();
  const canManageRoles = sessionCanEditFreshnessPolicy(currentSession);
  const activeCount = members.filter((member) => sessionHasAccess(member)).length;
  const waitlistCount = members.filter((member) => !sessionHasAccess(member)).length;
  const adminCount = members.filter((member) => isAdminMember(member)).length;
  accountEl.memberRegistrySummary.textContent =
    `${members.length} total / ${activeCount} active / ${waitlistCount} waitlist / ${adminCount} admin`;
  accountEl.memberRegistryList.replaceChildren();

  if (!members.length) {
    const empty = document.createElement("p");
    empty.textContent = "No members loaded yet.";
    accountEl.memberRegistryList.append(empty);
    return;
  }

  members.slice(0, 10).forEach((member) => {
    const row = document.createElement("article");
    row.className = "member-registry-item";
    row.dataset.access = sessionHasAccess(member) ? "active" : "waitlist";
    row.dataset.role = memberRole(member);

    const email = document.createElement("strong");
    email.textContent = member.email;
    const detail = document.createElement("span");
    detail.textContent = member.subscriptionStatus || "No subscription status";
    const status = document.createElement("small");
    status.textContent = `${member.memberStatus || member.access || "member"} | ${memberRole(member)}`;

    const actions = document.createElement("div");
    actions.className = "member-registry-actions";

    const load = document.createElement("button");
    load.type = "button";
    load.textContent = "Load Email";
    load.addEventListener("click", () => loadMemberEmail(member.email));

    const grant = document.createElement("button");
    grant.type = "button";
    grant.textContent = "Grant Pilot";
    grant.disabled = sessionHasAccess(member);
    grant.addEventListener("click", () => grantRegistryPilot(member.email));

    const roleButton = document.createElement("button");
    roleButton.type = "button";
    const currentlyAdmin = isAdminMember(member);
    const isLastAdmin = currentlyAdmin && adminCount <= 1;
    roleButton.textContent = currentlyAdmin ? "Revoke Admin" : "Make Admin";
    roleButton.disabled = !canManageRoles || isLastAdmin;
    roleButton.addEventListener("click", () => {
      setMemberRegistryRole(member.email, currentlyAdmin ? "member" : "admin");
    });

    actions.append(load, grant, roleButton);
    row.append(email, detail, status, actions);
    accountEl.memberRegistryList.append(row);
  });
}

function renderMemberRoleAuditLog() {
  if (!accountEl.memberRoleAuditList || !accountEl.memberRoleAuditSummary) return;
  const rows = memberRoleAuditLogForCurrentMember();
  accountEl.memberRoleAuditSummary.textContent = `${rows.length} role events`;
  accountEl.memberRoleAuditList.replaceChildren();

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = "No role changes logged yet.";
    accountEl.memberRoleAuditList.append(empty);
    return;
  }

  rows.slice(0, 10).forEach((entry) => {
    const row = document.createElement("article");
    row.className = "member-role-audit-item";
    row.dataset.nextRole = entry.nextRole || "member";

    const title = document.createElement("strong");
    title.textContent = `${entry.targetEmail || "unknown"} -> ${entry.nextRole || "member"}`;
    const detail = document.createElement("span");
    detail.textContent = `${entry.previousRole || "member"} to ${entry.nextRole || "member"} by ${entry.actorEmail || "local-prototype"}`;
    const reason = document.createElement("small");
    reason.textContent = entry.reason || "Role updated from member registry.";
    const at = document.createElement("em");
    at.textContent = formatDateTime(entry.at);

    row.append(title, detail, reason, at);
    accountEl.memberRoleAuditList.append(row);
  });
}

function renderActivationRequestPanel() {
  if (!accountEl.activationRequestList || !currentSession) return;
  const hasAccess = sessionHasAccess(currentSession);
  const request = currentActivationRequest();
  accountEl.activationRequestList.replaceChildren();
  accountEl.activationRequestForm.dataset.access = hasAccess ? "active" : "locked";
  accountEl.activationPlan.disabled = hasAccess;
  accountEl.activationUseCase.disabled = hasAccess;
  accountEl.activationRequestForm.querySelector("button").disabled = hasAccess;

  if (hasAccess) {
    accountEl.activationRequestLabel.textContent = "Access active";
    accountEl.activationRequestStatus.textContent = "This account already has member tool access.";
  } else if (request) {
    accountEl.activationRequestLabel.textContent = request.status;
    accountEl.activationRequestStatus.textContent =
      `${request.plan} activation request is queued. Payment connection comes later.`;
    accountEl.activationPlan.value = request.plan;
    accountEl.activationUseCase.value = request.useCase || "";
  } else {
    accountEl.activationRequestLabel.textContent = "Not requested";
    accountEl.activationRequestStatus.textContent =
      "Request activation now; payment setup will be connected at a later stage.";
  }

  if (!request) {
    const empty = document.createElement("p");
    empty.textContent = hasAccess ? "No activation request needed." : "No activation request yet.";
    accountEl.activationRequestList.append(empty);
    return;
  }

  const item = document.createElement("article");
  item.className = "activation-request-item";
  const title = document.createElement("strong");
  title.textContent = `${request.plan} access`;
  const detail = document.createElement("span");
  detail.textContent = request.useCase || "No use case added";
  const status = document.createElement("small");
  status.textContent = request.status;
  const time = document.createElement("em");
  time.textContent = new Date(request.requestedAt).toLocaleString("en-SG", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  item.append(title, detail, status, time);

  if (!hasAccess) {
    const actions = document.createElement("div");
    actions.className = "activation-review-actions";

    const approve = document.createElement("button");
    approve.type = "button";
    approve.textContent = "Approve Pilot";
    approve.disabled = request.status === "pilot approved";
    approve.addEventListener("click", approveActivationRequest);

    const keepWaitlist = document.createElement("button");
    keepWaitlist.type = "button";
    keepWaitlist.textContent = "Keep Waitlist";
    keepWaitlist.disabled = request.status === "reviewed - waitlist";
    keepWaitlist.addEventListener("click", keepActivationWaitlist);

    actions.append(approve, keepWaitlist);
    item.append(actions);
  }

  accountEl.activationRequestList.append(item);
}

function updateActivationRequestStatus(status) {
  updateActivationRequestStatusForEmail(currentSession.email, status);
}

function updateActivationRequestStatusForEmail(email, status) {
  const requests = activationRequests().map((request) => {
    if (normalizeEmail(request.email) !== normalizeEmail(email)) return request;
    return {
      ...request,
      status,
      reviewedAt: new Date().toISOString(),
      reviewer: "prototype-admin"
    };
  });
  writeStoredJson(activationRequestsKey, requests);
}

function approveActivationRequestForEmail(email) {
  const member = memberFromRequestEmail(email);
  const role = memberRole(member);
  updateActivationRequestStatusForEmail(email, "pilot approved");
  const approvedMember = {
    email: normalizeEmail(email),
    memberStatus: "Pilot member",
    subscriptionStatus: "Pilot access active: S$0 admin approval",
    access: "promo",
    role,
    promoCode: "PILOT-APPROVED",
    toolsEnabled: true,
    activatedAt: new Date().toISOString()
  };
  upsertJoinedMember({ ...member, ...approvedMember });

  if (normalizeEmail(currentSession?.email) === normalizeEmail(email)) {
    currentSession = {
      ...currentSession,
      memberStatus: approvedMember.memberStatus,
      subscriptionStatus: approvedMember.subscriptionStatus,
      access: approvedMember.access,
      role: approvedMember.role,
      isAdmin: approvedMember.role === "admin",
      promoCode: approvedMember.promoCode,
      toolsEnabled: approvedMember.toolsEnabled
    };
    writeStoredJson(memberSessionKey, currentSession);
    renderDashboard();
    maybeContinueToNextPath(currentSession);
  } else {
    renderAdminReviewQueue();
    renderMemberRegistry();
    renderBackendHandoff();
  }

  accountEl.adminReviewStatus.textContent = `${normalizeEmail(email)} approved for pilot access.`;
  recordActivity("Pilot access approved", normalizeEmail(email));
}

function keepActivationWaitlistForEmail(email) {
  updateActivationRequestStatusForEmail(email, "reviewed - waitlist");
  if (normalizeEmail(currentSession?.email) === normalizeEmail(email)) {
    renderActivationRequestPanel();
    renderMembershipTimeline();
    renderNextActionPanel();
  }
  renderAdminReviewQueue();
  renderMemberRegistry();
  renderBackendHandoff();
  accountEl.adminReviewStatus.textContent = `${normalizeEmail(email)} kept on waitlist.`;
  recordActivity("Activation kept waitlist", normalizeEmail(email));
}

function approveActivationRequest() {
  if (!currentSession) return;
  const request = currentActivationRequest();
  if (!request) {
    accountEl.activationRequestStatus.textContent = "No activation request to approve.";
    return;
  }

  approveActivationRequestForEmail(currentSession.email);
  accountEl.activationRequestStatus.textContent =
    `${currentSession.email} approved for pilot access.`;
}

function keepActivationWaitlist() {
  if (!currentSession) return;
  const request = currentActivationRequest();
  if (!request) {
    accountEl.activationRequestStatus.textContent = "No activation request to review.";
    return;
  }

  keepActivationWaitlistForEmail(currentSession.email);
  accountEl.activationRequestStatus.textContent =
    "Activation request reviewed. Account remains on waitlist.";
}

function renderMembershipTimeline() {
  if (!accountEl.membershipTimeline || !currentSession) return;
  const hasAccess = sessionHasAccess(currentSession);
  const request = currentActivationRequest();
  const steps = [
    {
      label: "Login verified",
      detail: currentSession.email,
      state: "complete"
    },
    {
      label: "Saved tools open",
      detail: hasAccess ? "Workspace ready" : "Free tools are available",
      state: "complete"
    },
    {
      label: "Future interest",
      detail: request ? `${request.plan} interest queued` : hasAccess ? "Optional later" : "Not requested",
      state: request || hasAccess ? "complete" : "current"
    },
    {
      label: "Premium rollout",
      detail: hasAccess ? "Not required now" : "Future option only",
      state: hasAccess ? "complete" : request ? "current" : "pending"
    },
    {
      label: "Workspace",
      detail: hasAccess ? "Free workspace ready" : "Open when free tools start",
      state: hasAccess ? "complete" : "pending"
    }
  ];

  accountEl.membershipTimelineSummary.textContent = hasAccess
    ? "Saved tools ready"
    : request
      ? "Future interest saved"
      : "Free tools active";
  accountEl.membershipTimeline.replaceChildren();

  steps.forEach((step, index) => {
    const item = document.createElement("article");
    item.className = "membership-timeline-step";
    item.dataset.state = step.state;

    const number = document.createElement("span");
    number.textContent = String(index + 1);
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = step.label;
    const detail = document.createElement("p");
    detail.textContent = step.detail;
    copy.append(title, detail);
    item.append(number, copy);
    accountEl.membershipTimeline.append(item);
  });
}

function renderNextActionPanel() {
  if (!accountEl.accountNextActionPanel || !currentSession) return;
  const hasAccess = sessionHasFreeTools(currentSession);
  const request = currentActivationRequest();

  if (hasAccess) {
    accountEl.accountNextActionPanel.dataset.state = "active";
    accountEl.accountNextActionLabel.textContent = "Next Action";
    accountEl.accountNextActionTitle.textContent = "Open the rent Workspace";
    accountEl.accountNextActionCopy.textContent =
      "Run a rent check, save the brief, add a watchlist area, or review the evidence layer from the free workspace.";
    accountEl.accountNextActionLink.textContent = "Open Workspace";
    accountEl.accountNextActionLink.href = workspaceHref();
    return;
  }

  if (request) {
    accountEl.accountNextActionPanel.dataset.state = "pending";
    accountEl.accountNextActionLabel.textContent = "Next Action";
    accountEl.accountNextActionTitle.textContent = "Keep track of future premium interest";
    accountEl.accountNextActionCopy.textContent =
      `${request.plan} interest is queued. Premium products can be introduced later without changing the free saved-tools flow.`;
    accountEl.accountNextActionLink.textContent = "Review Future Interest";
    accountEl.accountNextActionLink.href = "#activationRequestForm";
    return;
  }

  accountEl.accountNextActionPanel.dataset.state = "active";
  accountEl.accountNextActionLabel.textContent = "Next Action";
  accountEl.accountNextActionTitle.textContent = "Open the free workspace";
  accountEl.accountNextActionCopy.textContent =
    "Run a rent check, save the brief, add a watched area, or review the evidence layer from the free workspace.";
  accountEl.accountNextActionLink.textContent = "Open Workspace";
  accountEl.accountNextActionLink.href = workspaceHref();
}

function renderMemberCommandCenter() {
  if (!accountEl.memberCommandSummary || !currentSession) return;
  const hasAccess = sessionHasFreeTools(currentSession);
  const reports = savedReportsForCurrentMember();
  const watchlist = watchlistForCurrentMember();
  const approvedSources = approvedAskingSources();
  const latestSync = latestApprovedSourceSync(approvedSources);
  const request = currentActivationRequest();

  accountEl.commandSavedMetric.textContent = String(reports.length);
  accountEl.commandWatchMetric.textContent = String(watchlist.length);
  accountEl.commandSourceMetric.textContent = latestSync
    ? `${latestSync.recordsChecked} checked`
    : approvedSources.length
      ? "Ready"
      : "Preview";
  accountEl.commandAccessMetric.textContent = hasAccess ? "Active" : "Preview";

  accountEl.memberCommandSummary.textContent = hasAccess
    ? "Saved tools available"
    : request
      ? "Future interest queued"
      : "Saved tools ready";
  accountEl.commandSaveBriefButton.disabled = !hasAccess || !todayBriefRecord;
  accountEl.commandWatchAreaButton.disabled = !hasAccess || !todayBriefRecord;
  accountEl.commandRunSyncButton.disabled = !hasAccess || !approvedSources.length;
  accountEl.commandOpenToolbenchButton.textContent = "Open Workspace";
  accountEl.commandOpenToolbenchButton.href = workspaceHref();
  accountEl.commandOpenToolbenchButton.setAttribute("aria-disabled", String(!hasAccess));
}

async function saveCommandBrief() {
  if (!todayBriefRecord) return;
  if (!sessionHasFreeTools(currentSession)) {
    accountEl.memberCommandStatus.textContent =
      "Open the free saved tools session to save today's brief.";
    return;
  }
  await saveRecordAsReport(todayBriefRecord);
  renderMemberCommandCenter();
  accountEl.memberCommandStatus.textContent = `${todayBriefRecord.title} saved from Command Center.`;
}

async function watchCommandArea() {
  if (!todayBriefRecord) return;
  await addRecordToWatchlist(todayBriefRecord, accountEl.memberCommandStatus);
  renderMemberCommandCenter();
}

async function requestActivation() {
  if (!currentSession) return;
  if (sessionHasAccess(currentSession)) {
    accountEl.activationRequestStatus.textContent = "This account already has member tool access.";
    return;
  }

  const plan = accountEl.activationPlan.value;
  const request = {
    email: currentSession.email,
    plan,
    useCase: accountEl.activationUseCase.value.trim(),
    status: "pending activation",
    requestedAt: new Date().toISOString()
  };
  if (window.RentIntelAuth?.requestActivation) {
    const result = await window.RentIntelAuth.requestActivation({
      plan: request.plan,
      useCase: request.useCase
    });
    if (result.ok && result.data?.activationRequest) {
      const synced = result.data.activationRequest;
      const remaining = activationRequests().filter(
        (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
      );
      writeStoredJson(activationRequestsKey, [synced, ...remaining].slice(0, 50));
      accountEl.activationRequestStatus.textContent =
        `${synced.plan} activation request queued. Payment setup will be connected later.`;
      renderActivationRequestPanel();
      renderMembershipTimeline();
      renderNextActionPanel();
      renderMemberCommandCenter();
      recordActivity("Activation requested", `${synced.plan}: ${synced.useCase || currentSession.email}`);
      return;
    }
  }
  const requests = activationRequests().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
  );
  writeStoredJson(activationRequestsKey, [request, ...requests].slice(0, 50));
  accountEl.activationRequestStatus.textContent =
    `${plan} activation request queued. Payment setup will be connected later.`;
  renderActivationRequestPanel();
  renderMembershipTimeline();
  renderNextActionPanel();
  renderMemberCommandCenter();
  recordActivity("Activation requested", `${plan}: ${request.useCase || currentSession.email}`);
}

function renderNotificationPreferences() {
  if (!accountEl.notificationPreferenceForm || !currentSession) return;
  const hasAccess = sessionHasFreeTools(currentSession);
  const preference = currentNotificationPreference();
  accountEl.preferenceDailyBrief.checked = Boolean(preference.dailyBrief);
  accountEl.preferenceActivationUpdates.checked = Boolean(preference.activationUpdates);
  accountEl.preferenceWatchlistAlerts.checked = Boolean(preference.watchlistAlerts);
  accountEl.preferenceSourceSyncAlerts.checked = Boolean(preference.sourceSyncAlerts);
  accountEl.preferenceWatchlistAlerts.disabled = !hasAccess;
  accountEl.preferenceSourceSyncAlerts.disabled = !hasAccess;
  accountEl.notificationPreferenceForm.dataset.access = hasAccess ? "active" : "locked";

  const enabledCount = [
    preference.dailyBrief,
    preference.activationUpdates,
    hasAccess && preference.watchlistAlerts,
    hasAccess && preference.sourceSyncAlerts
  ].filter(Boolean).length;
  accountEl.notificationPreferenceSummary.textContent = `${enabledCount} enabled`;
  accountEl.notificationPreferenceStatus.textContent = hasAccess
    ? "Weekly Market Notes and alert preferences are ready for backend email delivery."
    : "Open the free saved tools session to manage weekly Market Notes and alerts.";
}

async function saveNotificationPreferences() {
  if (!currentSession) return;
  const hasAccess = sessionHasFreeTools(currentSession);
  const preference = {
    email: currentSession.email,
    dailyBrief: accountEl.preferenceDailyBrief.checked,
    activationUpdates: accountEl.preferenceActivationUpdates.checked,
    watchlistAlerts: hasAccess && accountEl.preferenceWatchlistAlerts.checked,
    sourceSyncAlerts: hasAccess && accountEl.preferenceSourceSyncAlerts.checked,
    updatedAt: new Date().toISOString()
  };
  if (window.RentIntelAuth?.savePreferences) {
    const result = await window.RentIntelAuth.savePreferences(preference);
    if (result.ok && result.data?.notificationPreferences) {
      const synced = {
        email: currentSession.email,
        ...defaultNotificationPreference(),
        ...result.data.notificationPreferences
      };
      const remaining = notificationPreferences().filter(
        (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
      );
      writeStoredJson(notificationPreferencesKey, [synced, ...remaining].slice(0, 50));
      renderNotificationPreferences();
      accountEl.notificationPreferenceStatus.textContent = "Weekly Market Notes preferences saved to backend.";
      recordActivity("Notification preferences", `${currentSession.email} updated backend Market Notes and account alerts.`);
      return;
    }
  }
  const preferences = notificationPreferences().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(currentSession.email)
  );
  writeStoredJson(notificationPreferencesKey, [preference, ...preferences].slice(0, 50));
  renderNotificationPreferences();
  accountEl.notificationPreferenceStatus.textContent = "Weekly Market Notes preferences saved.";
  recordActivity("Notification preferences", `${currentSession.email} updated Market Notes and account alerts.`);
}

async function addWatchlistArea() {
  const recordId = accountEl.watchlistArea.value;
  const record = rentRecordList().find((entry) => entry.id === recordId);
  if (!record) return;

  if (!sessionHasFreeTools(currentSession)) {
    accountEl.watchlistStatus.textContent =
      `${record.area} preview selected. Open the free saved tools session to add area alerts.`;
    return;
  }

  const memberEmail = normalizeEmail(currentSession?.email);
  const watchlist = loadStoredJson(watchlistKey, []).filter((item) => {
    const sameRecord = item.recordId === recordId;
    const sameMember = normalizeEmail(item.memberEmail || memberEmail) === memberEmail;
    return !(sameRecord && sameMember);
  });
  watchlist.unshift({
    memberEmail,
    recordId,
    area: record.area,
    addedAt: new Date().toISOString()
  });
  const watchlistItem = watchlist[0];
  if (currentSession?.email && window.RentIntelAuth?.saveWatchlistItem) {
    const result = await window.RentIntelAuth.saveWatchlistItem(watchlistItem);
    if (result.ok && result.data?.watchlistItem) {
      watchlist[0] = result.data.watchlistItem;
    }
  }
  writeStoredJson(watchlistKey, watchlist);
  await upsertAlertRuleForRecord(record);
  accountEl.watchlistStatus.textContent = `${record.area} added to watchlist with a daily target alert.`;
  renderWatchlist();
  renderMemberCommandCenter();
  recordActivity("Watchlist added", record.area);
}

async function addRecordToWatchlist(record, targetStatus) {
  if (!record) return;

  if (!sessionHasFreeTools(currentSession)) {
    targetStatus.textContent =
      `${record.area} preview selected. Open the free saved tools session to add area alerts.`;
    return;
  }

  const memberEmail = normalizeEmail(currentSession?.email);
  const watchlist = loadStoredJson(watchlistKey, []).filter((item) => {
    const sameRecord = item.recordId === record.id;
    const sameMember = normalizeEmail(item.memberEmail || memberEmail) === memberEmail;
    return !(sameRecord && sameMember);
  });
  watchlist.unshift({
    memberEmail,
    recordId: record.id,
    area: record.area,
    addedAt: new Date().toISOString()
  });
  const watchlistItem = watchlist[0];
  if (currentSession?.email && window.RentIntelAuth?.saveWatchlistItem) {
    const result = await window.RentIntelAuth.saveWatchlistItem(watchlistItem);
    if (result.ok && result.data?.watchlistItem) {
      watchlist[0] = result.data.watchlistItem;
    }
  }
  writeStoredJson(watchlistKey, watchlist);
  await upsertAlertRuleForRecord(record);
  targetStatus.textContent = `${record.area} added to watchlist with a daily target alert.`;
  renderWatchlist();
  renderMemberCommandCenter();
  recordActivity("Watchlist added", record.area);
}

function renderAccessBanner(hasAccess) {
  if (!accountEl.accountAccessBanner) return;
  const state = accessStateForSession(currentSession);
  const signedInAt = currentSession?.signedInAt
    ? new Date(currentSession.signedInAt).toLocaleString("en-SG", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : "current session";
  accountEl.accountSessionMeta.textContent =
    `Signed in as ${currentSession.email}. Session started ${signedInAt}.`;

  if (currentSession?.access === "free") {
    accountEl.accountAccessBanner.dataset.access = state.key;
    accountEl.accountAccessLabel.textContent = state.label;
    accountEl.accountAccessTitle.textContent = state.title;
    accountEl.accountAccessCopy.textContent =
      "Free saved tools are open. Use this space to save rent decisions, watch areas, and return to the RentIntel workspace.";
    accountEl.accountAccessAction.textContent = "Open Workspace";
    accountEl.accountAccessAction.href = workspaceHref();
    return;
  }

  if (currentSession?.access === "promo") {
    accountEl.accountAccessBanner.dataset.access = state.key;
    accountEl.accountAccessLabel.textContent = state.label;
    accountEl.accountAccessTitle.textContent = state.title;
    accountEl.accountAccessCopy.textContent =
      "Pilot access is open for this account. Use it to test saved reports, watchlists, source sync, and the RentIntel workspace.";
    accountEl.accountAccessAction.textContent = "Open Workspace";
    accountEl.accountAccessAction.href = workspaceHref({ requireAuth: true });
    return;
  }

  if (hasAccess) {
    accountEl.accountAccessBanner.dataset.access = state.key;
    accountEl.accountAccessLabel.textContent = state.label;
    accountEl.accountAccessTitle.textContent = state.title;
    accountEl.accountAccessCopy.textContent =
      "This account can save rent decisions, watch areas, review asking-rent sources, and use the RentIntel workspace.";
    accountEl.accountAccessAction.textContent = "Open Workspace";
    accountEl.accountAccessAction.href = workspaceHref({ requireAuth: true });
    return;
  }

  accountEl.accountAccessBanner.dataset.access = state.key;
  accountEl.accountAccessLabel.textContent = state.label;
  accountEl.accountAccessTitle.textContent = state.title;
  accountEl.accountAccessCopy.textContent =
    "Free saved tools are open. You can use reports, alerts, and the workspace without activation, while internal admin controls stay restricted.";
  accountEl.accountAccessAction.textContent = "Open Workspace";
  accountEl.accountAccessAction.href = workspaceHref();
}

function resetAccountLogin(message = "Signed out. Enter an email to login again.") {
  if (window.RentIntelAuth?.clearSession) {
    window.RentIntelAuth.clearSession();
  } else {
    localStorage.removeItem(memberSessionKey);
  }
  localStorage.removeItem(pendingLoginKey);
  clearSessionCookie();
  currentMember = null;
  currentSession = null;
  accountEl.dashboard.hidden = true;
  accountEl.codeStep.hidden = true;
  accountEl.joinPanel.hidden = true;
  accountEl.codeInput.value = "";
  accountEl.codeStatus.textContent = "";
  accountEl.emailStatus.textContent = message;
  accountEl.emailInput.focus();
}

function renderDashboard() {
  if (!currentSession) return;
  const hasAccess = sessionHasFreeTools(currentSession);
  const state = accessStateForSession(currentSession);
  accountEl.dashboard.hidden = false;
  renderPublicIntent();
  renderAccessBanner(hasAccess);
  accountEl.memberStatus.textContent = currentSession.memberStatus;
  accountEl.subscriptionStatus.textContent = currentSession.subscriptionStatus;
  accountEl.toolbenchStatus.textContent = state.toolbench;
  accountEl.memberStatus.closest(".account-panel").dataset.access = state.key;
  accountEl.subscriptionStatus.closest(".account-panel").dataset.access = state.key;
  accountEl.toolbenchStatus.closest(".account-panel").dataset.access = state.key;
  if (accountEl.promoCodeLabel) {
    accountEl.promoCodeLabel.textContent = currentSession.promoCode || "No promo applied";
  }
  accountEl.toolbenchPanel.dataset.access = hasAccess ? "active" : "locked";
  accountEl.toolbenchTitle.textContent = hasAccess ? `${state.label} Workspace` : "Workspace locked";
  accountEl.toolbenchCopy.textContent = hasAccess
    ? "Chart context, saved reports, export tools, alerts, and the RentIntel workspace are free to use."
    : "Open the free saved tools session to use the workspace.";
  accountEl.toolbenchLink.textContent = hasAccess ? "Open Workspace" : "Open Workspace";
  accountEl.toolbenchLink.href = workspaceHref();
  accountEl.toolbenchLink.setAttribute("aria-disabled", String(!hasAccess));
  accountEl.toolCards.forEach((card) => {
    card.dataset.access = hasAccess ? "active" : "locked";
  });
  accountEl.previewAlertButton.textContent = hasAccess ? "Preview alerts" : "Preview alerts";
  accountEl.previewExportButton.textContent = hasAccess ? "Preview export" : "Preview export";
  renderMembershipTimeline();
  renderNextActionPanel();
  renderTodayBrief();
  renderSavedReports();
  renderActivationRequestPanel();
  renderNotificationPreferences();
  renderWatchlistOptions();
  renderBackendTableMap();
  renderBackendApiMap();
  renderBackendRouteMocks();
  renderBackendImplementationChecklist();
  renderWatchlist();
  renderSourceStatus();
  renderAskingSourceCandidates();
  renderCoverageRequests();
  renderManualReviewQueue();
  renderSourceSyncPipeline();
  renderMemberCommandCenter();
  renderAdminReviewQueue();
  renderMemberRegistry();
  renderMemberRoleAuditLog();
  renderBackendHandoff();
  renderActivityLog();
  seedReportDetailIfEmpty();
}

async function applyPromoCode(code) {
  if (!currentSession) return;
  if (window.RentIntelAuth?.applyPromoCode) {
    const result = await window.RentIntelAuth.applyPromoCode(code);
    if (result.ok && result.data?.member) {
      const member = memberFromApiPayload(result.data, currentSession.email);
      if (member) {
        currentSession = {
          ...currentSession,
          ...window.RentIntelAuth.memberToSession(member, currentSession.email)
        };
        if (window.RentIntelAuth?.saveSession) {
          window.RentIntelAuth.saveSession(currentSession);
        } else {
          writeStoredJson(memberSessionKey, currentSession);
        }
        if (accountEl.promoStatus) accountEl.promoStatus.textContent = "Promo applied. Workspace access is now active.";
        renderDashboard();
        recordActivity("Promo applied", String(code || "").trim().toUpperCase());
        maybeContinueToNextPath(currentSession);
        return;
      }
    }
    if (String(code || "").trim().toUpperCase() !== validPromoCode) {
      if (accountEl.promoStatus) accountEl.promoStatus.textContent = "Promo code not recognised.";
      return;
    }
  } else if (code.trim().toUpperCase() !== validPromoCode) {
    if (accountEl.promoStatus) accountEl.promoStatus.textContent = "Promo code not recognised.";
    return;
  }
  currentSession = {
    ...currentSession,
    memberStatus: "Promo user",
    subscriptionStatus: "Promo access active: S$0 pilot",
    access: "promo",
    promoCode: validPromoCode,
    toolsEnabled: true
  };
  if (window.RentIntelAuth?.saveSession) {
    window.RentIntelAuth.saveSession(currentSession);
  } else {
    writeStoredJson(memberSessionKey, currentSession);
  }
  if (accountEl.promoStatus) accountEl.promoStatus.textContent = "Promo applied. Workspace access is now active.";
  renderDashboard();
  recordActivity("Promo applied", validPromoCode);
  maybeContinueToNextPath(currentSession);
}

async function initAccount() {
  sanitizeCoverageStorage();
  if (window.RentIntelAuth?.restoreSession) {
    const restored = await window.RentIntelAuth.restoreSession();
    currentSession = restored.session || loadStoredJson(memberSessionKey, null);
  } else {
    currentSession = loadStoredJson(memberSessionKey, null);
  }
  if (!currentSession?.email) {
    currentSession = freeToolsSession();
  }
  renderPublicIntent();
  accountEl.emailStatus.textContent =
    "Free saved tools are already open. Use email sign-in only if you want a separate saved-tools session later.";
  renderDashboard();
  await hydrateSavedReports();
  await hydrateWatchlistAndAlerts();
  await hydrateAlertDeliveryState();
  await hydrateNotificationPreferences();
  await hydrateActivationRequest();
  await hydrateMemberRegistryAndRoleAudit();
  await hydrateSourceReviewState();
  await hydrateBackendHandoffAuditState();
  await hydrateAskingFeedState();
  await hydrateSourceSyncState();
  if (maybeContinueToNextPath(currentSession)) return;
  const reason = queryParam("reason");
  if (reason && currentSession?.access !== "free") {
    accountEl.emailStatus.textContent =
      reason === "admin-only"
        ? "Admin access is required. Login with an admin account."
        : reason === "workspace-locked"
          ? "Workspace access is limited for this path. Use a free saved-tools session or an approved internal account."
          : "Login is required to continue.";
  }

  accountEl.emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = normalizeEmail(accountEl.emailInput.value);
    const member = findMember(email);

    if (!member) {
      accountEl.codeStep.hidden = true;
      accountEl.joinPanel.hidden = false;
      accountEl.joinEmail.value = email;
      accountEl.emailStatus.textContent =
        "This email is not on the saved-tools list yet. Add it first before requesting a login code.";
      return;
    }

    accountEl.joinPanel.hidden = true;
    currentMember = member;
    const apiHandled = await requestLoginCodeApiFirst(email, member);
    if (!apiHandled) sendCode(email, member);
  });

  accountEl.codeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pending = loadStoredJson(pendingLoginKey, null);
    if (!pending || pending.expiresAt < Date.now()) {
      accountEl.codeStatus.textContent = "Login code expired. Request a new login code.";
      return;
    }
    if (pending.remote) {
      const verified = await verifyLoginCodeApiFirst(pending.email, accountEl.codeInput.value);
      if (verified) {
        accountEl.codeStatus.textContent = "Session created. Account dashboard is ready.";
      }
      return;
    }
    if (accountEl.codeInput.value !== pending.code) {
      accountEl.codeStatus.textContent = "Code does not match. Check the 6 digits and try again.";
      return;
    }
    const member = findMember(pending.email);
    if (!member) {
      accountEl.codeStatus.textContent = "Member record is no longer valid.";
      return;
    }
    createSession(member);
    accountEl.codeStatus.textContent = "Session created. Account dashboard is ready.";
  });

  if (accountEl.promoForm && accountEl.promoInput) {
    accountEl.promoForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await applyPromoCode(accountEl.promoInput.value);
    });
  }

  accountEl.activationRequestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await requestActivation();
  });

  accountEl.notificationPreferenceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveNotificationPreferences();
  });

  if (accountEl.freshnessPolicyForm) {
    accountEl.freshnessPolicyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveFreshnessPolicy();
    });
  }

  accountEl.joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addJoinedMember(accountEl.joinEmail.value);
  });

  accountEl.switchAccountButton.addEventListener("click", () => {
    resetAccountLogin("Session cleared. Enter another member email to continue.");
  });

  accountEl.signOutButton.addEventListener("click", async () => {
    if (window.RentIntelAuth?.logout) {
      await window.RentIntelAuth.logout();
    }
    resetAccountLogin();
  });

  accountEl.requestPublicIntentButton.addEventListener("click", () => {
    requestPublicIntentActivation();
  });

  accountEl.savePublicIntentButton.addEventListener("click", async () => {
    await savePublicIntentAsReport();
  });

  accountEl.clearPublicIntentButton.addEventListener("click", () => {
    clearPublicIntent();
  });

  accountEl.askingSourceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addAskingSourceCandidate();
  });

  accountEl.coverageFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      coverageRequestFilter = button.dataset.coverageFilter || "all";
      renderCoverageRequests();
    });
  });

  accountEl.runSourceSyncButton.addEventListener("click", async () => {
    await runPilotSourceSync();
  });
  if (accountEl.sourceSyncAutomationForm) {
    accountEl.sourceSyncAutomationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveSourceSyncAutomation();
    });
  }
  if (accountEl.runSourceSyncAutomationNowButton) {
    accountEl.runSourceSyncAutomationNowButton.addEventListener("click", async () => {
      await runSourceSyncAutomationNow();
    });
  }

  accountEl.attachProductionSourceButton.addEventListener("click", async () => {
    await attachProductionSourceEvidence();
  });

  accountEl.recordProductionQaLogButton.addEventListener("click", async () => {
    await recordProductionQaLog();
  });

  accountEl.recordSourceOwnerReviewButton.addEventListener("click", async () => {
    await recordSourceOwnerReview();
  });

  accountEl.clearProductionEvidenceButton.addEventListener("click", async () => {
    await clearProductionEvidence();
  });

  accountEl.queueProductionReleaseButton.addEventListener("click", async () => {
    await queueProductionRelease();
  });

  accountEl.markProductionReleasedButton.addEventListener("click", async () => {
    await markProductionReleased();
  });

  accountEl.rollbackProductionReleaseButton.addEventListener("click", async () => {
    await rollbackProductionRelease();
  });

  accountEl.commandSaveBriefButton.addEventListener("click", async () => {
    await saveCommandBrief();
  });

  accountEl.commandWatchAreaButton.addEventListener("click", async () => {
    await watchCommandArea();
  });

  accountEl.commandRunSyncButton.addEventListener("click", () => {
    runPilotSourceSync();
    renderMemberCommandCenter();
  });

  accountEl.coverageShortcutReviewButton.addEventListener("click", () => {
    openAccountOpsSection("accountSourceCoverage");
  });

  accountEl.coverageShortcutSourceSyncButton.addEventListener("click", () => {
    openAccountOpsSection("accountSourceSync");
  });

  accountEl.watchlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addWatchlistArea();
  });

  if (accountEl.deliveryAdminRequeueFailedButton) {
    accountEl.deliveryAdminRequeueFailedButton.addEventListener("click", async () => {
      const changed = await applyBulkDeliveryAdminAction(
        ["failed"],
        "resend",
        "Admin bulk-resent failed alerts for the next delivery cycle."
      );
      accountEl.deliveryAdminStatus.textContent = changed
        ? `${changed} failed alerts resent.`
        : "No failed alerts were available to resend.";
      if (changed) recordActivity("Delivery admin bulk resend", `${changed} failed alerts`);
      renderWatchlist();
      renderMemberCommandCenter();
    });
  }

  if (accountEl.deliveryAdminRequeueDeadButton) {
    accountEl.deliveryAdminRequeueDeadButton.addEventListener("click", async () => {
      const changed = await applyBulkDeliveryAdminAction(
        ["dead-letter"],
        "resend",
        "Admin bulk-resent dead-letter alerts."
      );
      accountEl.deliveryAdminStatus.textContent = changed
        ? `${changed} dead-letter alerts resent.`
        : "No dead-letter alerts were available to resend.";
      if (changed) recordActivity("Delivery admin bulk dead-letter resend", `${changed} alerts`);
      renderWatchlist();
      renderMemberCommandCenter();
    });
  }

  if (accountEl.deliveryAdminSuppressDeadButton) {
    accountEl.deliveryAdminSuppressDeadButton.addEventListener("click", async () => {
      const changed = await applyBulkDeliveryAdminAction(
        ["dead-letter"],
        "suppress",
        "Admin bulk-suppressed dead-letter alerts."
      );
      accountEl.deliveryAdminStatus.textContent = changed
        ? `${changed} dead-letter alerts suppressed.`
        : "No dead-letter alerts were available to suppress.";
      if (changed) recordActivity("Delivery admin bulk suppress", `${changed} dead-letter alerts`);
      renderWatchlist();
      renderMemberCommandCenter();
    });
  }

  if (accountEl.deliveryAdminAcknowledgeButton) {
    accountEl.deliveryAdminAcknowledgeButton.addEventListener("click", async () => {
      const changed = await applyBulkDeliveryAdminAction(
        ["failed", "dead-letter"],
        "acknowledge",
        "Admin bulk-acknowledged failed/dead-letter alerts for manual follow-up."
      );
      accountEl.deliveryAdminStatus.textContent = changed
        ? `${changed} failed/dead-letter alerts acknowledged.`
        : "No failed/dead-letter alerts were available to acknowledge.";
      if (changed) recordActivity("Delivery admin bulk acknowledge", `${changed} alerts`);
      renderWatchlist();
      renderMemberCommandCenter();
    });
  }

  if (accountEl.runDeliveryWorkerButton) {
    accountEl.runDeliveryWorkerButton.addEventListener("click", async () => {
      await runDeliveryWorkerBatch();
    });
  }

  if (accountEl.deliveryMessageTransportFilter) {
    accountEl.deliveryMessageTransportFilter.addEventListener("change", () => {
      deliveryMessageTransportFilter = accountEl.deliveryMessageTransportFilter.value;
      renderDeliveredMessages();
    });
  }

  if (accountEl.deliveryMessageRunFilter) {
    accountEl.deliveryMessageRunFilter.addEventListener("change", () => {
      deliveryMessageRunFilter = accountEl.deliveryMessageRunFilter.value;
      renderDeliveredMessages();
    });
  }

  accountEl.saveTodayBriefButton.addEventListener("click", async () => {
    if (!todayBriefRecord) return;
    if (!sessionHasFreeTools(currentSession)) {
      accountEl.todayBriefStatus.textContent =
        "Open the free saved tools session to save reports.";
      return;
    }
    await saveRecordAsReport(todayBriefRecord);
    accountEl.todayBriefStatus.textContent = `${todayBriefRecord.title} saved to reports.`;
  });

  accountEl.watchTodayBriefButton.addEventListener("click", async () => {
    await addRecordToWatchlist(todayBriefRecord, accountEl.todayBriefStatus);
  });

  accountEl.watchReportAreaButton.addEventListener("click", async () => {
    await addRecordToWatchlist(reportToRecord(selectedReport), accountEl.reportDetailStatus);
  });

  accountEl.deleteReportButton.addEventListener("click", async () => {
    await removeSelectedReport();
  });

  accountEl.copyNegotiationNoteButton.addEventListener("click", () => {
    copyNegotiationNote();
  });

  accountEl.downloadNegotiationNoteButton.addEventListener("click", () => {
    downloadNegotiationNote();
  });

  accountEl.previewReportExportButton.addEventListener("click", () => {
    openReportPreview();
  });

  accountEl.downloadReportTxtButton.addEventListener("click", () => {
    downloadSelectedReport("txt");
  });

  accountEl.downloadReportJsonButton.addEventListener("click", () => {
    downloadSelectedReport("json");
  });

  accountEl.previewDownloadTxtButton.addEventListener("click", () => {
    downloadSelectedReport("txt");
  });

  accountEl.previewDownloadJsonButton.addEventListener("click", () => {
    downloadSelectedReport("json");
  });

  accountEl.closeReportPreviewButton.addEventListener("click", () => {
    closeReportPreview();
  });

  accountEl.reportPreviewModal.addEventListener("click", (event) => {
    if (event.target === accountEl.reportPreviewModal) closeReportPreview();
  });

  if (accountEl.copyDeliveryMessageButton) {
    accountEl.copyDeliveryMessageButton.addEventListener("click", async () => {
      await copySelectedDeliveryMessage();
    });
  }

  if (accountEl.downloadDeliveryMessageButton) {
    accountEl.downloadDeliveryMessageButton.addEventListener("click", () => {
      downloadSelectedDeliveryMessage();
    });
  }

  if (accountEl.closeDeliveryMessageButton) {
    accountEl.closeDeliveryMessageButton.addEventListener("click", () => {
      closeDeliveryMessageModal();
    });
  }

  if (accountEl.deliveryMessageModal) {
    accountEl.deliveryMessageModal.addEventListener("click", (event) => {
      if (event.target === accountEl.deliveryMessageModal) closeDeliveryMessageModal();
    });
  }

  accountEl.savedReportSearch.addEventListener("input", () => {
    savedReportFilters.query = accountEl.savedReportSearch.value;
    renderSavedReports();
  });

  accountEl.savedReportTrustFilter.addEventListener("change", () => {
    savedReportFilters.trust = accountEl.savedReportTrustFilter.value;
    renderSavedReports();
  });

  accountEl.savedReportGapFilter.addEventListener("change", () => {
    savedReportFilters.gap = accountEl.savedReportGapFilter.value;
    renderSavedReports();
  });

  accountEl.syncBackendReportsButton.addEventListener("click", async () => {
    await syncLocalReportsToBackend();
  });

  accountEl.backendHandoffButton.addEventListener("click", async () => {
    await markBackendHandoffReviewed();
  });

  accountEl.backendPayloadButton.addEventListener("click", () => {
    renderBackendPayload();
  });

  accountEl.validateBackendPayloadButton.addEventListener("click", () => {
    validateBackendPayload();
  });

  accountEl.backendSqlButton.addEventListener("click", () => {
    renderBackendSql();
  });

  accountEl.backendPackageButton.addEventListener("click", () => {
    renderBackendPackage();
  });

  accountEl.copyBackendPayloadButton.addEventListener("click", () => {
    copyBackendPayload();
  });

  accountEl.downloadBackendPayloadButton.addEventListener("click", () => {
    downloadBackendPayload();
  });

  accountEl.copyBackendSqlButton.addEventListener("click", () => {
    copyBackendSql();
  });

  accountEl.downloadBackendSqlButton.addEventListener("click", () => {
    downloadBackendSql();
  });

  accountEl.copyBackendPackageButton.addEventListener("click", () => {
    copyBackendPackage();
  });

  accountEl.downloadBackendPackageButton.addEventListener("click", () => {
    downloadBackendPackage();
  });

  accountEl.previewAlertButton.addEventListener("click", () => {
    const message = sessionHasFreeTools(currentSession)
      ? "Area alert preview ready. Production will connect this to email notifications."
      : "Open the free saved tools session to use area alerts.";
    if (accountEl.promoStatus) accountEl.promoStatus.textContent = message;
    recordActivity("Alert preview", message);
  });

  accountEl.previewExportButton.addEventListener("click", () => {
    let message = "";
    if (sessionHasFreeTools(currentSession)) {
      renderBackendPayload();
      message = "Export preview ready. Backend payload generated below.";
    } else {
      message = "Open the free saved tools session to use export preview.";
    }
    if (accountEl.promoStatus) accountEl.promoStatus.textContent = message;
    recordActivity("Export preview", message);
  });
}

initAccount().catch((error) => {
  console.error("Members account init failed.", error);
  accountEl.emailStatus.textContent = "Members account could not initialize. Refresh and try again.";
});
