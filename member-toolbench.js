const toolbenchColors = {
  ink: "#18201b",
  muted: "#68746e",
  grid: "#dcd8cf",
  official: "#196b55",
  asking: "#b64636",
  bg: "#fffdf9"
};

const memberSessionKey = "rentintelMemberSession";
const savedReportsKey = "rentintelSavedReports";
const backendSavedReportsKey = "rentintelBackendSavedReports";
const watchlistKey = "rentintelWatchlistAreas";
const alertRulesKey = "rentintelAlertRules";
const toolbenchPreviewRecordKey = "rentintelToolbenchPreviewRecord";
const coverageRecordsKey = "rentintelCoverageRecords";
const freshnessPolicyKey = "rentintelFreshnessSlaPolicy";
const toolbenchV1ReviewPassStateKey = "rentintelToolbenchV1ReviewPassState";
const toolbenchQuickPickLaneActivityKey = "rentintelToolbenchQuickPickLaneActivity";
const toolbenchRenderModeHistoryKey = "rentintelToolbenchRenderModeHistory";
const toolbenchRenderVerdictKey = "rentintelToolbenchRenderVerdict";
const toolbenchRecoveryTargetDemoBackupKey = "rentintelToolbenchRecoveryTargetDemoBackup";
const toolbenchHttpWorkspaceUrl = "http://127.0.0.1:4173/members/toolbench/";
const toolbenchEmbedSafeQueryParam = "embed-safe";
const toolbenchStatusDurations = {
  handoff: 4200,
  restore: 4200,
  reviewStep: 3800,
  filter: 3600
};
const toolbenchQuickPickLaneActivityUndoDuration = 12000;
const toolbenchStatusMessages = {
  previewHandoff: {
    tone: "info",
    duration: toolbenchStatusDurations.handoff,
    text: () => "Opened from preview mode. Backend-backed review restore and sync are available in this full workspace."
  },
  restoreBackendJump: {
    tone: "success",
    duration: toolbenchStatusDurations.restore,
    text: ({ title = "", label = "" } = {}) => `Restored backend review scope and jumped to ${title} • ${label}.`
  },
  restoreBackendLoaded: {
    tone: "success",
    duration: toolbenchStatusDurations.restore,
    text: ({ title = "" } = {}) => title
      ? `Restored backend review scope and loaded ${title}.`
      : "Restored backend review scope for this member session."
  },
  clearLocalPass: {
    tone: "caution",
    duration: toolbenchStatusDurations.reviewStep,
    text: () => "Cleared the local/browser review pass scope for this workspace."
  },
  nextReviewItem: {
    tone: "info",
    duration: toolbenchStatusDurations.reviewStep,
    text: ({ title = "", label = "", scope = "" } = {}) => `Loaded next review item: ${title} • ${label}. Current scope: ${scope}.`
  },
  startNewPass: {
    tone: "success",
    duration: toolbenchStatusDurations.filter,
    text: ({ scope = "" } = {}) => `Started a new review pass for ${scope}.`
  },
  rosterFilter: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ scope = "", title = "" } = {}) => title ? `${scope.replace(/\.$/, "")} Loaded ${title}.` : scope
  },
  returnCurrentRecord: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ title = "" } = {}) => title
      ? `Returned quick picks to the current area: ${title}.`
      : "Returned quick picks to the current area."
  },
  focusWeakestRecord: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ title = "", note = "" } = {}) => title
      ? `Focused the most urgent area: ${title}.${note ? ` ${note}` : ""}`
      : "Focused the most urgent area."
  },
  focusStrongestRecord: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ title = "", note = "" } = {}) => title
      ? `Focused the best-looking area: ${title}.${note ? ` ${note}` : ""}`
      : "Focused the best-looking area."
  },
  followRecoveryTarget: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ label = "", title = "", note = "" } = {}) =>
      title
        ? `Followed the recovery target${label ? ` for ${label}` : ""}: ${title}.${note ? ` ${note}` : ""}`
        : "Followed the recovery target."
  },
  recoveryTargetDemoPrimed: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: () => "Recovery target demo state is active for this workspace session."
  },
  bookmarkQueueLensSaved: {
    tone: "success",
    duration: toolbenchStatusDurations.filter,
    text: ({ filter = "", sort = "" } = {}) =>
      `Saved queue bookmark: ${filter}${sort && sort !== "default" ? ` • sort: ${sort}` : ""}.`
  },
  bookmarkQueueLensOpened: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ filter = "", sort = "", priorityNote = "", note = "" } = {}) =>
      `Opened queue bookmark: ${filter}${sort && sort !== "default" ? ` • sort: ${sort}` : ""}${priorityNote ? ` • ${priorityNote}` : ""}${note ? ` • ${note}` : ""}.`
  },
  bookmarkQueueLensPriorityOpened: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ label = "", reason = "", priorityNote = "", note = "" } = {}) =>
      label
        ? `Opened highest-priority lane: ${label}${reason ? ` • ${reason}` : ""}${priorityNote ? ` • ${priorityNote}` : ""}${note ? ` • ${note}` : ""}.`
        : "Opened the highest-priority saved lane."
  },
  bookmarkQueueLanePlanApplied: {
    tone: "success",
    duration: toolbenchStatusDurations.filter,
    text: ({ actionLabel = "", label = "", detail = "" } = {}) =>
      actionLabel && label
        ? `${actionLabel}: ${label}${detail ? ` • ${detail}` : ""}.`
        : "Applied the lane plan."
  },
  bookmarkQueueLensRefreshed: {
    tone: "success",
    duration: toolbenchStatusDurations.filter,
    text: ({ label = "", note = "" } = {}) =>
      label ? `Refreshed ${label} from the live queue lens${note ? ` • ${note}` : ""}.` : "Refreshed the saved lane from the live queue lens."
  },
  queueLensRestored: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ filter = "", sort = "" } = {}) =>
      `Restored queue lens: ${filter}${sort && sort !== "default" ? ` • sort: ${sort}` : ""}.`
  },
  resetQueueLens: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: () => "Reset the V1 queue lens to the default session view."
  },
  layerFilter: {
    tone: "info",
    duration: toolbenchStatusDurations.filter,
    text: ({ label = "", title = "" } = {}) => label
      ? toolbenchReviewPassMessages.workspace.layerFilterApplied({ label, title })
      : toolbenchReviewPassMessages.workspace.layerFilterCleared()
  },
  restoreReviewItem: {
    tone: "success",
    duration: toolbenchStatusDurations.restore,
    text: ({ title = "", label = "" } = {}) => `Restored review item: ${title} • ${label}.`
  },
  backendRestoreUnavailable: {
    tone: "caution",
    duration: 0,
    text: () => "Saved review restore is not available in this workspace mode."
  },
  backendRestoreMissing: {
    tone: "caution",
    duration: 0,
    text: () => "No backend review pass was found for this member session yet."
  },
  savedDecisionRestored: {
    tone: "success",
    duration: toolbenchStatusDurations.restore,
    text: ({ title = "" } = {}) => `${title} saved decision pack restored.`
  },
  recordLoaded: {
    tone: "info",
    duration: toolbenchStatusDurations.reviewStep,
    text: ({ title = "" } = {}) => `${title} loaded.`
  },
  sampleDataUnavailable: {
    tone: "error",
    duration: 0,
    text: () => "RentIntel sample data is unavailable."
  },
  areaNotRecognized: {
    tone: "caution",
    duration: 0,
    text: () => "No recognized area yet. Try Ang Mo Kio shop, Bedok HDB retail, Toa Payoh HDB, Orchard mall, or Chinatown shophouse."
  },
  openingFullWorkspace: {
    tone: "info",
    duration: toolbenchStatusDurations.handoff,
    text: ({ handoffUrl = "" } = {}) => `Opening full workspace: ${handoffUrl}`
  },
  workspaceInitFailed: {
    tone: "error",
    duration: 0,
    text: () => "Workspace could not initialize. Refresh and try again."
  }
};
const toolbenchBackendPreviewCloseReasons = {
  restoreJump: {
    message: "Backend preview closed after restore-and-review.",
    tone: "success"
  },
  restoreScope: {
    message: "Backend preview closed after backend scope restore.",
    tone: "success"
  },
  clearLocal: {
    message: "Backend preview closed after clearing the local review pass.",
    tone: "caution"
  },
  newPass: {
    message: "Backend preview closed after starting a new review pass.",
    tone: "info"
  },
  filterChange: {
    message: "Backend preview closed because the roster filter changed.",
    tone: "info"
  },
  layerFilterChange: {
    message: "Backend preview closed because the failed-layer filter changed.",
    tone: "info"
  }
};
const toolbenchBackendPreviewMessages = {
  focusHint: {
    restoreJump: "Focus restored to Resume saved review.",
    restore: "Focus restored to Restore saved review.",
    clear: "Focus restored to Clear this browser review.",
    badge: "Focus restored to the saved review badge.",
    default: ""
  },
  badge: {
    localActive: ({ scope = "" } = {}) => `This browser review is active${scope ? ` • ${scope}` : ""}`,
    localOnly: () => "Saved review restore is not available in this browser-only mode.",
    backendMissing: () => "No saved review progress yet.",
    backendAvailable: ({ resolvedLabel = "", scopeLabel = "", syncedLabel = "" } = {}) =>
      `Saved review ready • ${resolvedLabel} • ${scopeLabel} • ${syncedLabel}`
  },
  resumeHint: {
    localRestoreJump: () => "Browser-only mode: reopen the last area you were reviewing in this browser.",
    localRestore: () => "Browser-only mode: reopen the saved review from this browser.",
    localClear: () => "Browser-only mode: clear the review saved in this browser.",
    localDefault: ({ workspaceUrl = "" } = {}) =>
      `Open the full workspace at ${workspaceUrl} to restore saved progress across sessions.`,
    backendRestoreJump: ({ label = "" } = {}) => `${label}: continue from the saved area you were last reviewing.`,
    backendRestore: () => "Restore saved review: bring back your saved filters and progress.",
    backendClear: () => "Clear this browser review: the current browser-only review is still active.",
    default: () => ""
  },
  panel: {
    scope: ({ scope = "" } = {}) => `Saved view: ${scope || "all areas"}`,
    currentScope: ({ scope = "" } = {}) => `Current view: ${scope || "all areas"}`,
    compareMissing: () => "Match: no saved review progress yet.",
    compareMatch: () => "Match: same as your current view.",
    compareDifferent: ({ differences = "" } = {}) => `Match: ${differences}.`,
    activeItemMissing: () => "Current saved area: none",
    activeItem: ({ recordLabel = "", label = "" } = {}) =>
      label ? `Current saved area: ${recordLabel} • ${label}` : `Current saved area: ${recordLabel}`,
    itemStatusMissing: () => "Saved area status: no saved active area yet.",
    itemStatusUnmatched: () => "Saved area status: the saved area could not be matched here.",
    itemStatusUntracked: () => "Saved area status: this saved step is no longer tracked in the current model.",
    itemStatusResolved: ({ label = "" } = {}) => `Saved area status: ${label} is already finished.`,
    itemStatusUnresolved: ({ label = "" } = {}) => `Saved area status: ${label} still needs review.`
  },
  action: {
    restoreJumpUnresolved: () => "Resume saved review",
    restoreJumpResolved: () => "Open finished item",
    restoreJumpUnmatched: () => "Restore saved view",
    restoreJumpDefault: () => "Restore and open",
    restoreScope: () => "Restore saved review"
  }
};
const toolbenchReviewPassMessages = {
  origin: {
    backend: () => "Saved review progress was restored for this member session.",
    session: () => "Saved review progress was restored from this browser session.",
    local: () => "This review is currently saved only in this browser.",
    healthBackend: () => "Saved review progress was restored for this member session.",
    healthSession: () => "Saved review progress was restored from this browser session.",
    healthLocal: () => "This review is currently saved only in this browser."
  },
  audit: {
    empty: () => "No recent review restore or clear action yet.",
    restored: ({ sourceLabel = "", at = "" } = {}) => `Last review action: restored from ${sourceLabel} on ${at}.`,
    cleared: ({ sourceLabel = "", at = "" } = {}) => `Last review action: cleared ${sourceLabel} on ${at}.`,
    generic: ({ at = "" } = {}) => `Last review action recorded on ${at}.`
  },
  sync: {
    inactive: () => "Cross-session saving is not active in this workspace mode.",
    saved: ({ at = "" } = {}) => `Last saved across sessions: ${at}.`,
    pendingWithLast: ({ at = "" } = {}) => `Saving across sessions is pending. Last successful save: ${at}.`,
    pending: () => "Saving across sessions is pending for this review.",
    errorWithLast: ({ at = "" } = {}) => `Saving across sessions needs attention. Last successful save: ${at}.`,
    error: () => "Saving across sessions needs attention.",
    none: () => "No cross-session save has completed yet."
  },
  finish: {
    complete: ({ resolvedCount = 0, scope = "" } = {}) =>
      `Pass complete: resolved ${resolvedCount} review item${resolvedCount === 1 ? "" : "s"} in ${scope}.`
  },
  health: {
    labelRentSignal: () => "Rent signal",
    labelValueGap: () => "Value gap",
    labelSurroundingTrade: () => "Surrounding trade",
    labelSuitability: () => "Suitability",
    labelDecisionNote: () => "Decision note",
    stateInternalReady: () => "ready",
    stateNeedsReview: () => "needs review",
    stateWeakSample: () => "still weak",
    summaryTitle: ({ passed = 0, total = 0, state = "" } = {}) =>
      `${passed}/${total} checks passed • ${state}`,
    summaryCopyStrong: () => "This review record looks complete enough to use with confidence.",
    summaryCopyPartial: () => "This review record is usable, but at least one decision layer still needs work.",
    summaryCopyWeak: () => "This review record is still too thin and should not be treated as reliable yet.",
    noFixNeeded: () => "No immediate fix is needed. This record is ready to use.",
    noFixNextAction: () => "Next: no structural fix needed.",
    nextReviewItem: ({ count = 0 } = {}) => (count ? `Next unfinished item (${count})` : "Next unfinished item"),
    startNewPass: ({ resolvedCount = 0 } = {}) =>
      (resolvedCount > 0 ? `Start a new review (${resolvedCount} finished)` : "Start a new review"),
    resolvedThisPass: ({ resolvedCount = 0 } = {}) => `Finished in this review: ${resolvedCount}.`,
    showResolvedDetail: () => "View review detail",
    hideResolvedDetail: () => "Hide review detail",
    currentScopeComplete: () => "Current review scope is complete.",
    noHealthChecks: () => "No review checks are available yet.",
    passCheck: ({ label = "" } = {}) => `Pass • ${label}`,
    reviewCheck: ({ label = "" } = {}) => `Review • ${label}`,
    queueEmpty: ({ scope = "" } = {}) => `No incomplete review items in the current scope (${scope}).`,
    queueActive: ({ index = 0, total = 0, scope = "" } = {}) =>
      `Review queue: ${index} of ${total} review items in ${scope}.`,
    queuePending: ({ total = 0, scope = "", title = "", label = "" } = {}) =>
      `Review queue: ${total} review item${total === 1 ? "" : "s"} in ${scope}. Next up: ${title} • ${label}.`,
    actionRentSignal: () => "Complete the rent signal first: verdict, confidence, benchmark band, and current ask.",
    actionValueGap: () => "Tighten the value-gap layer next: status, direction, and why the ask sits above or below range.",
    actionSurroundingTrade: () => "Add surrounding trade evidence next: category mix and trade-pattern context for this micro-market.",
    actionSuitability: () => "Model suitability next: fit scores, rationale, and weak-fit cautions for likely use cases.",
    actionDecisionNote: () => "Finish the decision note next: clear summary, negotiation angle, and defensible watchouts.",
    actionGeneric: ({ label = "" } = {}) => `Review the ${String(label || "missing").toLowerCase()} layer next.`
  },
  roster: {
    title: () => "Area review queue",
    summary: ({ strong = 0, partial = 0, weak = 0 } = {}) =>
      `${strong} areas look strong, ${partial} need some work, and ${weak} still need the most review.`,
    empty: () => "No review areas are loaded yet.",
    currentStrong: ({ passed = 0, total = 0 } = {}) => `${passed}/${total}`,
    currentNeedsReview: ({ passed = 0, total = 0, nextAction = "" } = {}) => `${passed}/${total} • ${nextAction}`,
    currentDecisionReady: ({ passed = 0, total = 0, outcome = "" } = {}) =>
      outcome ? `${passed}/${total} • ${outcome}` : `${passed}/${total}`,
    currentDecisionReview: ({ passed = 0, total = 0, outcome = "" } = {}) =>
      outcome ? `${passed}/${total} • ${outcome}` : `${passed}/${total}`,
    backendNoticePlaceholder: () => "A saved-review notice will appear here when your saved view changes.",
    backendFocusPlaceholder: () => "Focus restored to the last saved-review action.",
    backendResolved: ({ count = 0 } = {}) => `Finished: ${count}`,
    backendSynced: ({ at = "" } = {}) => `Last save: ${at}.`,
    backendSyncPending: () => "Last save: pending"
  },
  workspace: {
    quickPickEmpty: ({ scope = "" } = {}) => `No quick-pick records match ${scope} yet.`,
    savedCount: ({ count = 0 } = {}) => `${count} saved`,
    savedEmpty: () => "No saved reports yet. Save any workspace brief you want to revisit, compare, or export later.",
    watchCount: ({ count = 0 } = {}) => `${count} watching`,
    watchEmpty: () => "No watchlist areas yet.",
    savedLabel: () => "Saved",
    notSavedLabel: () => "Not saved",
    v1Saving: () => "Saving V1 context...",
    v1SavedAdvanced: ({ subjectRef = "", title = "", label = "" } = {}) =>
      `${subjectRef}: V1 context saved. Advanced to next review item: ${title} • ${label}.`,
    v1SavedResolved: ({ subjectRef = "" } = {}) =>
      `${subjectRef}: V1 context saved. Current review queue is fully resolved for this scope.`,
    v1Saved: ({ subjectRef = "" } = {}) => `${subjectRef}: V1 context saved.`,
    v1SavedValidationCleared: ({ subjectRef = "" } = {}) =>
      `${subjectRef}: V1 context saved. Cleared the selected validation review point.`,
    v1SavedValidationClearedAdvanced: ({ subjectRef = "", title = "", label = "" } = {}) =>
      `${subjectRef}: V1 context saved. Cleared the selected validation review point and advanced to next review item: ${title} • ${label}.`,
    v1StatusShowDetail: () => "View save detail",
    v1StatusHideDetail: () => "Hide save detail",
    v1StatusAdvancedDetail: ({ title = "", label = "" } = {}) =>
      `Advanced to next review item: ${title} • ${label}.`,
    v1StatusResolvedDetail: () => "Current review queue is fully resolved for this scope.",
    v1StatusValidationClearedDetail: () => "Cleared the selected validation review point.",
    v1StatusValidationClearedAdvancedDetail: ({ title = "", label = "" } = {}) =>
      `Cleared the selected validation review point and advanced to next review item: ${title} • ${label}.`,
    alertSavedSummary: ({ cadence = "", area = "" } = {}) =>
      `Saved ${cadence} alert for ${area}.`,
    alertSavePrompt: () => "Save this rule to watch the selected area from saved tools.",
    alertSaveLocked: () => "Open the free workspace to save area alert rules.",
    alertSaved: ({ area = "" } = {}) => `${area} alert rule saved.`,
    alertAppendLocked: () => "Open the free workspace to append area alert rules.",
    alertAppended: () => "Alert rule appended to the negotiation note.",
    watchAdded: ({ area = "" } = {}) => `${area} added to watchlist.`,
    saveStateSaved: ({ savedAt = "" } = {}) => `Saved ${savedAt}`,
    saveStateNotSaved: () => "Not saved",
    saveReportSummary: ({ title = "", benchmarkTrust = "", target = "", noteStatus = "" } = {}) =>
      `${title} saved with ${benchmarkTrust}, ${target} target, and ${noteStatus} negotiation note.`,
    notePrepared: () => "Negotiation note prepared.",
    offerAppendLocked: () => "Open the free workspace to append the offer position.",
    offerAppended: () => "Offer position appended to the negotiation note.",
    exportEvidenceLocked: () => "Open the free workspace to export evidence rows.",
    exportEvidenceDone: ({ count = 0 } = {}) => `${count} evidence rows exported.`,
    noteCopied: () => "Negotiation note copied.",
    noteCopyBlocked: () => "Copy was blocked by the browser. Note text is selected.",
    watchOpen: () => "Open",
    savedReportFallback: () => "Saved report",
    savedReportDetailFallback: () => "Saved",
    savedReportNoteFallback: () => "Note ready",
    quickPickMeta: ({ summary = "" } = {}) => `Review ${summary}`,
    quickPickDecisionMeta: ({ outcome = "" } = {}) => outcome ? `Decision: ${outcome}` : "Review not finished",
    quickPickWorkMeta: ({ workType = "" } = {}) => workType ? `Next step: ${workType}` : "",
    quickPickTrendMeta: ({ trend = "" } = {}) => trend ? `Change: ${trend}` : "",
    quickPickCurrentBadge: () => "Current",
    quickPickSortBadgeImproving: () => "Improving",
    quickPickSortBadgeAttention: () => "Attention",
    quickPickRoutedBadge: () => "Start here",
    quickPickSortDefault: () => "Quick picks in default order.",
    quickPickSortImproving: () => "Areas are sorted by where the review is improving most.",
    quickPickSortAttention: () => "Areas are sorted by what needs the most attention first.",
    quickPickQueueSummary: ({ count = 0, filter = "", sort = "" } = {}) =>
      `Showing ${count} record${count === 1 ? "" : "s"} for ${filter}${sort && sort !== "default" ? ` • sort: ${sort}` : ""}.`,
    quickPickQueueExplainerImproving: ({ closeout = 0, watch = 0 } = {}) =>
      `Showing areas that are closest to finished (${closeout}) and areas worth keeping an eye on (${watch}) first.`,
    quickPickQueueExplainerAttention: ({ blocker = 0, cleanup = 0 } = {}) =>
      `Showing areas with missing key checks (${blocker}) and follow-up work (${cleanup}) first.`,
    quickPickQueueExplainerCurrent: ({ workType = "" } = {}) =>
      `Showing the current area first${workType ? ` with a next step of ${workType}` : ""}.`,
    quickPickQueueExplainerRoutedCap: ({ count = 0 } = {}) =>
      `Start here marks the top ${count} area${count === 1 ? "" : "s"} for this review pass.`,
    quickPickQueueExplainerRoutedActive: () =>
      "This suggested view is active: the area you opened came from the current priority group.",
    quickPickRoutedHint: ({ workType = "" } = {}) =>
      `Start here: this area is the best example of what to review next${workType ? ` for ${workType}` : ""}.`,
    quickPickPrioritySummary: ({ label = "", reason = "" } = {}) =>
      `Top priority: ${label}${reason ? ` • ${reason}` : ""}.`,
    quickPickPrioritySummaryChanged: ({ label = "", reason = "" } = {}) =>
      `Priority changed: ${label}${reason ? ` • ${reason}` : ""}.`,
    quickPickPrioritySummaryStable: () => "stable",
    quickPickPrioritySummaryRecovering: () => "recovering",
    quickPickPrioritySummaryUnsettled: () => "unsettled",
    quickPickPrioritySummaryDecisive: () => "decisive",
    quickPickPrioritySummaryCloseCall: () => "close call",
    quickPickPrioritySummaryRunnerUp: ({ label = "" } = {}) => `next closest: ${label}`,
    quickPickPrioritySummaryLastRouted: ({ label = "" } = {}) => `last suggested: ${label}`,
    quickPickPrioritySummaryStreak: ({ count = 0 } = {}) => `held for ${count} turn${count === 1 ? "" : "s"}`,
    quickPickPrioritySummaryWorkBlocker: () => "missing key checks",
    quickPickPrioritySummaryWorkCleanup: () => "follow-up needed",
    quickPickPrioritySummaryWorkWatch: () => "worth watching",
    quickPickPrioritySummaryWorkCloseout: () => "nearly done",
    quickPickPriorityRouteBadgeProvisional: () => "Starting now",
    quickPickPriorityRouteBadgeSteady: () => "Holding steady",
    quickPickPriorityRouteBadgeSettled: () => "Stable choice",
    quickPickPriorityRouteBadgeRecovering: () => "Back in focus",
    quickPickPriorityRouteBadgeHint: ({ state = "", label = "", count = 0, runnerUp = "", gap = "" } = {}) =>
      `The top suggestion for ${label || "this view"} is ${state || "active"}${count > 0 ? ` after holding for ${count} turn${count === 1 ? "" : "s"}` : ""}${runnerUp ? `, with ${runnerUp} as the next closest option` : ""}${gap ? ` on ${gap}` : ""}.`,
    quickPickPrioritySummaryHint: ({ label = "", runnerUp = "", reason = "", gap = "", state = "" } = {}) =>
      `The top priority view ${label}${state ? ` is ${state}` : ""}${runnerUp ? ` and only slightly ahead of ${runnerUp}` : ""}${gap ? ` with ${gap}` : ""}${reason ? ` because it is ${reason}` : ""}.`,
    quickPickQueueCoolingHint: ({ label = "", detail = "" } = {}) =>
      label ? `Priority is still being shaped by ${detail || `${label} settling down after a recent action`}.` : "",
    quickPickQueueRecoveryHint: ({ label = "" } = {}) =>
      label ? `${label} moved back into focus after the latest review activity.` : "",
    quickPickQueueRecoveryTargetHint: ({ title = "" } = {}) =>
      title ? `The suggested reopen area is ${title}.` : "",
    quickPickQueueMemory: ({ filter = "", sort = "", quality = "", tempered = "", reopenMemory = "", recoveryPreference = "", released = "" } = {}) =>
      `This view remembers ${sort !== "default" ? `${sort} sorting` : "the default sorting"}${filter && filter !== "all review areas" ? ` with ${filter}` : ""} for this session.${quality ? ` Saved view quality: ${quality}${tempered ? ` • ${tempered}` : ""}.` : tempered ? ` Saved view quality: ${tempered}.` : ""}${reopenMemory ? ` Reopen history: ${reopenMemory}.` : ""}${recoveryPreference ? ` Learned preference: ${recoveryPreference}.` : ""}${released ? ` ${released}.` : ""}`,
    quickPickBookmarkMemory: ({ label = "", filter = "", sort = "", quality = "", tempered = "" } = {}) =>
      `Saved ${label}: ${filter}${sort && sort !== "default" ? ` • sort: ${sort}` : ""}.${quality ? ` View quality: ${quality}${tempered ? ` • ${tempered}` : ""}.` : tempered ? ` View quality: ${tempered}.` : ""}`,
    quickPickBookmarkPriorityHint: ({ label = "", quality = "", tempered = "", reopenMemory = "", recoveryPreference = "" } = {}) =>
      `Saved view hint: ${label}${quality ? ` • ${quality}` : ""}${tempered ? ` • ${tempered}` : ""}${reopenMemory ? ` • ${reopenMemory}` : ""}${recoveryPreference ? ` • ${recoveryPreference}` : ""}.`,
    quickPickBookmarkPlanningHint: ({ action = "", tempered = "", reactivated = false, strengthened = false, recoveryTargetTrend = "", recoveryTargetActionability = "" } = {}) =>
      action
        ? `Suggested next: ${action}${tempered ? ` • ${tempered}` : ""}${reactivated ? " • moved back into focus" : ""}${strengthened ? " • clearer next target" : ""}${recoveryTargetTrend ? ` • ${recoveryTargetTrend}` : ""}${recoveryTargetActionability ? ` • ${recoveryTargetActionability}` : ""}.`
        : "",
    quickPickBookmarkPlanningActionButton: ({ action = "" } = {}) => {
      if (action === "refresh this lane") return "Refresh this view";
      if (action === "close out this lane") return "Mark this view done";
      if (action === "deprioritize lane") return "Lower this priority";
      if (action === "keep this lane active") return "Keep this active";
      return "Take suggested step";
    },
    quickPickBookmarkPlanningResult: ({ action = "", reason = "" } = {}) => {
      let label = "";
      if (action === "refresh this lane") label = "view refreshed";
      else if (action === "close out this lane") label = "view marked done";
      else if (action === "deprioritize lane") label = "priority lowered";
      else if (action === "keep this lane active") label = "view kept active";
      if (!label) return "";
      return `${label}${reason ? ` • ${reason}` : ""}`;
    },
    quickPickBookmarkPlanningHoldReason: ({ action = "", cooldown = "", stage = "" } = {}) => {
      const suffix = [cooldown, stage].filter(Boolean).join(" ");
      const suffixText = suffix ? ` ${suffix}` : "";
      if (action === "refresh this lane") return `Holding steady after a recent refresh.${suffixText}`;
      if (action === "close out this lane") return `Holding steady after marking this view done.${suffixText}`;
      if (action === "deprioritize lane") return `Holding steady after lowering this priority.${suffixText}`;
      return "";
    },
    quickPickBookmarkPlanningReleased: () => "recent action window ended",
    quickPickBookmarkReopenMemory: ({ count = 0 } = {}) =>
      `reopened ${count}x this session`,
    quickPickBookmarkReopenMemoryProductive: ({ count = 0 } = {}) =>
      `productive reopen ${count}x`,
    quickPickBookmarkReopenMemoryPressure: ({ count = 0 } = {}) =>
      `pressure reopen ${count}x`,
    quickPickBookmarkPriorityOpened: () => "reopened from priority",
    quickPickBookmarkUpdateHint: ({ label = "" } = {}) => `Your current view is different from ${label}.`,
    quickPickBookmarkListLabel: ({ label = "", recent = false, count = null, delta = "", urgency = "", nextUp = "", state = "", priority = "", recency = "", momentum = "", recovering = false, resolved = false, degraded = false, opened = false } = {}) =>
      `${label}${typeof count === "number" ? ` • ${count} record${count === 1 ? "" : "s"}` : ""}${delta ? ` • ${delta}` : ""}${urgency ? ` • ${urgency}` : ""}${nextUp ? ` • next ${nextUp}` : ""}${state ? ` • ${state}` : ""}${priority ? ` • ${priority}` : ""}${recency ? ` • ${recency}` : ""}${momentum ? ` • ${momentum}` : ""}${recovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}${resolved ? ` • ${toolbenchReviewPassMessages.workspace.quickPickBookmarkResolved()}` : ""}${degraded ? ` • ${toolbenchReviewPassMessages.workspace.quickPickBookmarkDegraded()}` : ""}${recent ? " • recent" : ""}${opened ? " • opened" : ""}`,
    quickPickBookmarkWorking: () => "current view",
    quickPickBookmarkImproving: () => "improving view",
    quickPickBookmarkAttention: () => "attention view",
    quickPickBookmarkUrgencyWeak: () => "mostly weak",
    quickPickBookmarkUrgencyMixed: () => "mixed",
    quickPickBookmarkUrgencyNearClear: () => "nearly cleared",
    quickPickBookmarkResolved: () => "resolved since save",
    quickPickBookmarkDegraded: () => "degraded since save",
    quickPickBookmarkPriorityNow: () => "review now",
    quickPickBookmarkPriorityWatch: () => "watch soon",
    quickPickBookmarkPriorityLater: () => "later",
    quickPickBookmarkSavedJustNow: () => "saved just now",
    quickPickBookmarkSavedMinutesAgo: ({ count = 0 } = {}) => `saved ${count}m ago`,
    quickPickBookmarkSavedHoursAgo: ({ count = 0 } = {}) => `saved ${count}h ago`,
    quickPickBookmarkSavedDaysAgo: ({ count = 0 } = {}) => `saved ${count}d ago`,
    quickPickBookmarkStateCurrent: () => "current",
    quickPickBookmarkStateStale: () => "stale",
    rosterFilterAll: () => "Showing all saved review areas.",
    rosterFilterStrong: () => "Showing the strongest review areas.",
    rosterFilterPartial: () => "Showing review areas that still need some work.",
    rosterFilterWeak: () => "Showing review areas that need the most work.",
    rosterFilterCurrent: ({ title = "" } = {}) =>
      title ? `Showing only the current area: ${title}.` : "No current area is active yet.",
    rosterFilterScoped: ({ scope = "", label = "" } = {}) =>
      label ? `${String(scope || "").replace(/\.$/, "")} Filtered to ${label}.` : scope,
    layerFilterApplied: ({ label = "", title = "" } = {}) =>
      title
        ? `Filtered the list to areas that still need work for ${label}. Opened ${title}.`
        : `Filtered the list to areas that still need work for ${label}.`,
    layerFilterCleared: () => "Cleared the detail filter. Showing the current area queue again.",
    savedReportTargetMeta: ({ asking = "", targetMonthly = "" } = {}) => `${asking} asking | ${targetMonthly} target monthly`,
    savedReportGapMeta: ({ asking = "", gap = "" } = {}) => `${asking} asking | ${gap} gap`,
    savedReportDetail: ({ trust = "", noteStatus = "", savedAt = "" } = {}) => `${trust} | ${noteStatus} | ${savedAt}`,
    evidenceRowsStatus: () => "Evidence rows follow the selected chart range.",
    moneyRangeUnavailable: () => "Not available",
    dateNotConnected: () => "Not connected",
    v1EditorTitleEmpty: () => "Load a linked sample area to edit the decision layer",
    v1EditorTitleReadOnly: ({ subjectRef = "" } = {}) => `${subjectRef}: read-only file preview`,
    v1EditorTitleEditable: ({ subjectRef = "" } = {}) => `${subjectRef}: edit internal decision notes`,
    v1ContextApiUnavailable: () => "Context API write path is unavailable in this workspace.",
    v1SaveReturnedNothing: () => "No context record returned after save.",
    v1SaveFailed: () => "Could not save the V1 context.",
    v1ContextMetaPending: () => "Metadata appears here once a linked V1 context record is loaded.",
    v1ContextMetaUnsaved: ({ count = 0, fields = "" } = {}) =>
      `Unsaved changes${count > 0 ? ` (${count})` : ""}${fields ? ` • ${fields}` : ""}`,
    v1ContextMetaSaved: ({ mode = "" } = {}) => `Saved state${mode ? ` • ${mode}` : ""}`,
    v1ContextMetaSavedTitle: ({ mode = "" } = {}) =>
      mode
        ? `No unsaved V1 editor changes. Current context is clean in ${mode} mode.`
        : "No unsaved V1 editor changes.",
    v1ContextMetaHintDirty: () => "Unsaved V1 changes. Jumping to the save controls for this internal context pack.",
    v1ContextMetaHintFreshness: ({ freshness = "" } = {}) =>
      `${freshness} capture state. Jumping to the source timeline so you can review freshness and source-stage context.`,
    v1ContextMetaHintHealth: ({ health = "" } = {}) =>
      `${health} V1 health state. Jumping to Record Health so you can review completion and the next fix path.`,
    v1ContextMetaHintPending: () => "Load a linked V1 record before using metadata shortcuts.",
    v1ContextMetaActionDirty: ({ fields = "" } = {}) =>
      fields
        ? `Click to jump to the V1 save controls. Changed: ${fields}.`
        : "Click to jump to the V1 save controls.",
    v1ContextMetaActionFreshness: ({ freshness = "", days = null, freshMaxDays = null, watchMaxDays = null } = {}) => {
      const thresholdCopy = Number.isFinite(freshMaxDays) && Number.isFinite(watchMaxDays)
        ? ` Fresh <= ${freshMaxDays}d, watch <= ${watchMaxDays}d.`
        : "";
      const ageCopy = Number.isFinite(days) ? ` Current age: ${days}d.` : "";
      return `Click to review the source timeline for this ${String(freshness || "").toLowerCase()} capture state.${ageCopy}${thresholdCopy}`;
    },
    v1ContextMetaActionHealth: ({ health = "", nextLabel = "" } = {}) =>
      nextLabel
        ? `Click to review Record Health for this ${String(health || "").toLowerCase()} context state. First missing layer: ${nextLabel}.`
        : `Click to review Record Health for this ${String(health || "").toLowerCase()} context state.`,
    v1ContextMetaHintUpdated: ({ updated = "" } = {}) =>
      `Newer saved override from ${updated}. Jumping to the V1 editor so you can review the current saved context state.`,
    v1ContextMetaActionUpdated: ({ updated = "", scope = "" } = {}) =>
      `Click to review the V1 editor state for the newer ${scope || "saved override"} from ${updated}.`,
    v1ContextMetaCapturedLabel: ({ captured = "" } = {}) => `Captured ${captured}`,
    v1ContextMetaCapturedTitle: ({ captured = "", source = "" } = {}) =>
      source
        ? `Capture date ${captured} comes from ${source}.`
        : `Capture date ${captured}.`,
    v1ContextMetaUpdatedLabel: ({ updated = "", fresh = false } = {}) =>
      fresh ? `Updated ${updated} • newer save` : `Updated ${updated}`,
    v1ContextMetaFreshnessLabel: ({ freshness = "", days = null } = {}) =>
      `Freshness ${freshness}${Number.isFinite(days) ? ` (${days}d)` : ""}`,
    v1ContextMetaHealthLabel: ({ health = "", passed = 0, total = 0 } = {}) =>
      `Health ${health}${total ? ` (${passed}/${total})` : ""}`,
    v1ContextModeChipSample: () => "Sample",
    v1ContextModeChipSaved: () => "Saved",
    v1ContextModeChipInternal: () => "Internal",
    v1ContextModeSample: () => "sample-backed",
    v1ContextModeSaved: () => "saved override",
    v1ContextModeInternal: () => "internal bundle",
    v1ContextModeTitle: ({ mode = "" } = {}) =>
      mode
        ? `Current V1 context mode: ${mode}.`
        : "Current V1 context mode.",
    v1ContextOriginChipSample: () => "Sample-backed",
    v1ContextOriginChipSaved: () => "Saved override",
    v1ContextOriginChipRefreshed: () => "Refreshed",
    v1ContextOriginChipInternal: () => "Internal bundle",
    v1ContextOriginTitle: ({ origin = "" } = {}) =>
      origin
        ? `Current V1 context source: ${origin}.`
        : "Current V1 context source.",
    v1ContextOriginAction: ({ origin = "" } = {}) => {
      if (origin === "saved override") {
        return "Click to review the current saved override in the V1 editor.";
      }
      if (origin === "refreshed from sample") {
        return "Click to review the source timeline for this context refreshed from the latest sample bundle.";
      }
      if (origin === "sample-backed") {
        return "Click to review the source timeline for this sample-backed V1 context.";
      }
      return "Click to review the linked V1 editor context for this internal bundle.";
    },
    v1ContextOriginHint: ({ origin = "" } = {}) => {
      if (origin === "saved override") {
        return "Saved override source. Jumping to the V1 editor so you can review the current saved context.";
      }
      if (origin === "refreshed from sample") {
        return "Refreshed-from-sample source. Jumping to the source timeline so you can review the latest sample-backed provenance.";
      }
      if (origin === "sample-backed") {
        return "Sample-backed source. Jumping to the source timeline so you can review provenance and freshness.";
      }
      return "Internal bundle source. Jumping to the V1 editor so you can review the linked context pack.";
    },
    v1ContextRefreshReviewLabel: ({ reviewed = 0, total = 0, complete = false } = {}) =>
      complete
        ? "Refresh review complete"
        : `Refresh review${total ? ` (${reviewed}/${total})` : ""}`,
    v1ContextRefreshReviewTitle: ({ reviewed = 0, total = 0, complete = false, next = "" } = {}) => {
      if (complete) {
        return "All refreshed V1 layers for this context have already been reviewed in this browser session.";
      }
      if (next) {
        return `Click to continue the refreshed-layer review flow. ${reviewed}/${total} reviewed so far. Next: ${next}.`;
      }
      return `Click to continue the refreshed-layer review flow. ${reviewed}/${total} reviewed so far.`;
    },
    v1ContextRefreshReviewHint: ({ complete = false, next = "" } = {}) =>
      complete
        ? "Refresh review is complete for this context. Jumping to the source timeline so you can confirm the refreshed-layer handoff."
        : next
          ? `Refresh review is still open for this context. Jumping directly to ${next} so you can continue the refreshed-layer review flow.`
          : "Refresh review is still open for this context. Jumping into the refreshed-layer review flow.",
    v1ContextRefreshReviewJumped: ({ next = "" } = {}) =>
      next
        ? `Continued the refreshed-layer review flow in ${next}.`
        : "Continued the refreshed-layer review flow.",
    sourceTimelineOriginLayers: ({ layers = "" } = {}) =>
      layers ? `Refreshed layers: ${layers}.` : "",
    sourceTimelineOriginSample: ({ title = "" } = {}) =>
      `${title}: this V1 context is still sample-backed, so the timeline is showing the current sample provenance and freshness path.`,
    sourceTimelineOriginRefreshed: ({ title = "", layers = "" } = {}) =>
      `${title}: this V1 context was refreshed from the latest sample bundle, so the timeline is showing the newest sample-backed provenance that was pulled through backend sync.${layers ? ` Refreshed layers: ${layers}.` : ""}`,
    sourceTimelineOriginCompleted: ({ title = "" } = {}) =>
      `${title}: all refreshed V1 layers in this sample-sync handoff have been reviewed.`,
    sourceTimelineReviewProgress: ({ reviewed = 0, total = 0, complete = false } = {}) =>
      complete
        ? "Refresh review complete"
        : `Refresh review ${reviewed}/${total}`,
    sourceTimelineReviewedToggle: ({ count = 0, expanded = false } = {}) =>
      expanded ? "Hide reviewed layers" : `View reviewed layers${count ? ` (${count})` : ""}`,
    sourceTimelineNextLayer: ({ next = "" } = {}) =>
      next ? `Next refreshed layer: ${next}` : "Next refreshed layer",
    v1CommercialToneStrong: ({ rent = "", value = "", fit = "" } = {}) =>
      `Strong commercial read: ${rent}, ${value}, and ${fit} are all supportive for this context.`,
    v1CommercialToneWatch: ({ rent = "", value = "", fit = "" } = {}) =>
      `Watch commercial read: ${rent}, ${value}, and ${fit} are workable but still need closer review together.`,
    v1CommercialToneCaution: ({ rent = "", value = "", fit = "" } = {}) =>
      `Caution commercial read: ${rent}, ${value}, or ${fit} introduces a meaningful commercial constraint here.`,
    v1CommercialToneNeutral: ({ rent = "", value = "", fit = "" } = {}) =>
      `Commercial read: ${rent}, ${value}, and ${fit}.`,
    v1CommercialWhyToggle: () => "Why this read",
    v1CommercialWhyHide: () => "Hide reasoning",
    v1SnapshotOpportunityPendingTitle: () => "Opportunity pending",
    v1SnapshotOpportunityPendingCopy: () => "Load a linked V1 context to surface the strongest commercial upside.",
    v1SnapshotConstraintPendingTitle: () => "Constraint pending",
    v1SnapshotConstraintPendingCopy: () => "Load a linked V1 context to surface the main commercial constraint.",
    v1SnapshotNextPendingTitle: () => "Next move pending",
    v1SnapshotNextPendingCopy: () => "Load a linked V1 context to surface the best immediate internal next move.",
    v1SnapshotOutcomePendingTitle: () => "Outcome pending",
    v1SnapshotOutcomePendingCopy: () => "Load a linked V1 context to surface the current internal decision state.",
    v1SnapshotOutcomePendingReason: () => "Outcome reasoning appears here after a linked V1 context loads.",
    v1SnapshotOutcomePendingPriority: () => "Priority details appear here after a linked V1 context loads.",
    v1SnapshotOutcomePendingHistory: () => "Last-change details appear here after the decision outcome changes.",
    v1CommercialWhySummary: ({ rent = "", value = "", fit = "", trade = "" } = {}) =>
      [
        rent ? `Rent signal: ${rent}.` : "",
        value ? `Value gap: ${value}.` : "",
        fit ? `Best fit: ${fit}.` : "",
        trade ? `Trade context: ${trade}.` : ""
      ].filter(Boolean).join(" "),
    v1ContextMeta: ({ captured = "", freshness = "", updated = "", health = "", mode = "", dirty = "" } = {}) =>
      [
        captured ? `Captured ${captured}` : "",
        freshness ? `Freshness ${freshness}` : "",
        updated ? `Updated ${updated}` : "",
        health ? `Health ${health}` : "",
        mode ? `Mode ${mode}` : "",
        dirty || ""
      ]
        .filter(Boolean)
        .join(" • "),
    pulseLabelSummary: () => "Pulse Summary",
    pulseLabelWarning: () => "Pulse Warning",
    pulseLabelDecisionNote: () => "Pulse Decision Note",
    pulseTitleEmpty: () => "Load a rent signal first.",
    pulseSummaryEmpty: () => "Search one retail area and Pulse will condense the rent read, source state, and next move.",
    pulseWarningEmpty: () => "No report context is selected.",
    pulseNextStepEmpty: () => "Search or select a rent benchmark.",
    pulseCaveat: () => "Pulse explains the RentIntel signal; it is not valuation advice.",
    pulseSourceCaveatReady: () => "Production source is marked ready; still check lease terms, GST, service charge, permitted use, and handover condition.",
    pulseSourceCaveatWorking: ({ production = "" } = {}) =>
      `Asking source is ${String(production || "").toLowerCase()}; treat this as a working position until source caveats are checked.`,
    pulseTitleWorking: () => "Use this as a working position, not a final answer.",
    pulseNextStepWorking: ({ fairHigh = "" } = {}) => `Review source caveats before using ${fairHigh}.`,
    pulseTitleDecision: () => "Prepare the negotiation note before speaking to the landlord.",
    pulseSummaryDecision: ({ fairHigh = "" } = {}) => `Use ${fairHigh} psf as the working upper line.`,
    pulseWarningDecision: () => "The asking gap is high. Do not accept the premium without unit-specific proof.",
    pulseNextStepDecision: () => "Save the report, export the note, and ask for comparable evidence.",
    pulseTitleEvidence: () => "The decision is mainly about evidence quality now.",
    pulseSummaryEvidence: ({ confidenceTitle = "" } = {}) => `${confidenceTitle}. Evidence quality is the key decision point.`,
    pulseWarningPremium: () => "There is still a rent premium. Validate the reason before accepting.",
    pulseWarningNoLargePremium: () => "No large premium flagged, but commercial terms still matter.",
    pulseNextStepEvidence: () => "Save the report if the source caveat and lease terms are acceptable.",
    accessMemberStatus: () => "Free tools user",
    accessSubscriptionStatus: () => "Free access active",
    accessFreeLabel: () => "Free access",
    accessFreeTitle: () => "Workspace open",
    accessFreeCopy: () => "This workspace is free to use. Search, save reports, watch areas, export notes, and review the evidence layer without activation.",
    accessPromoLabel: () => "Pilot access",
    accessPromoTitle: () => "Promo Workspace active",
    accessPromoCopy: ({ email = "" } = {}) => `Signed in as ${email}. Pilot access can save reports, watch areas, and export negotiation notes.`,
    accessActiveLabel: () => "Active workspace",
    accessActiveTitle: () => "Workspace active",
    accessActiveCopy: ({ email = "" } = {}) => `Signed in as ${email}. Save reports, watch areas, and export negotiation notes.`,
    accessFallbackCopy: ({ email = "" } = {}) => `${email} can use the workspace freely. Internal admin tools stay restricted elsewhere.`,
    accessChart: () => "Workspace chart",
    accessPromoChart: () => "Pilot workspace chart",
    confidenceCoverageTitle: () => "Coverage request",
    confidenceCoverageCopy: () => "Preview estimate only. Direct benchmark coverage still needs source connection.",
    confidenceCoverageTrust: () => "Low trust",
    confidenceCoverageEvidence: () => "Request queue plus comparable estimate",
    confidenceComparableTitle: () => "Comparable estimate",
    confidenceComparableCopy: () => "Uses area similarity and property-type inference until direct transaction coverage is connected.",
    confidenceComparableTrust: () => "Comparable trust",
    confidenceComparableEvidence: () => "Area profile, not direct record",
    confidenceHighTitle: () => "High confidence",
    confidenceHighCopy: () => "Official benchmark and asking signal are aligned enough for a firmer rent position.",
    confidenceHighTrust: () => "Strong benchmark",
    confidenceHighEvidence: () => "Transaction benchmark plus asking signal",
    confidenceMediumTitle: () => "Medium confidence",
    confidenceMediumCopy: () => "Good enough for negotiation framing, but unit-specific frontage, use, and fit-out still matter.",
    confidenceMediumTrust: () => "Review evidence",
    confidenceMediumEvidence: () => "Benchmark plus partial asking signal",
    confidenceFallbackTitle: ({ title = "" } = {}) => title || "Review confidence",
    confidenceFallbackCopy: () => "Use the evidence rows and source split before treating this as a final rent position.",
    confidenceFallbackTrust: () => "Needs review",
    confidenceFallbackEvidence: () => "Source validation required",
    benchmarkComparableOfficial: () => "Comparable benchmark",
    benchmarkComparableAsking: () => "Requested source",
    benchmarkComparableTrustNote: () => "Do not rely on this until direct coverage is connected.",
    benchmarkHdbOfficial: () => "HDB-linked benchmark",
    benchmarkHdbAsking: () => "Heartland asking signal",
    benchmarkHdbTrustNote: () => "Check permitted use, frontage, and MRT spillover before accepting premium.",
    benchmarkShophouseOfficial: () => "URA-linked retail trend",
    benchmarkShophouseAsking: () => "Shophouse listing signal",
    benchmarkShophouseTrustNote: () => "Classification, F&B approval, and frontage can widen rent dispersion.",
    benchmarkMallOfficial: () => "Prime retail benchmark",
    benchmarkMallAsking: () => "Mall asking signal",
    benchmarkMallTrustNote: () => "Validate floor level, frontage, traffic, and tenant mix before accepting premium.",
    benchmarkDefaultOfficial: () => "Retail benchmark",
    benchmarkDefaultAsking: () => "Asking-rent signal",
    benchmarkDefaultTrustNote: () => "Confirm comparable quality and unit-specific premium before committing.",
    sourceTrustSampleTitle: () => "Sample",
    sourceTrustSampleReason: () => "Sample benchmark signal.",
    sourceTrustSampleAction: () => "Verify direct asking evidence before committing.",
    comparableConfidence: () => "Comparable estimate",
    comparableDecisionHigh: () => "Asking rent looks high against comparable area benchmarks.",
    comparableDecisionReview: () => "Asking rent needs comparable validation.",
    comparableReason: ({ area = "", cluster = "" } = {}) =>
      `No direct RentIntel record is connected for ${area} yet, so this workspace preview uses comparable ${cluster} retail signals until source coverage is connected.`,
    comparableDaily: ({ title = "", asking = "", gap = 0, official = "" } = {}) =>
      `${title} is estimated near ${asking}, about ${gap}% above a comparable benchmark of ${official}.`,
    comparableActionPushBack: () => "Push back",
    comparableActionValidate: () => "Validate premium",
    comparableActionFairRange: () => "Fair range",
    comparableActionCopy: ({ actionLabel = "", fairHigh = "", actionNoun = "" } = {}) =>
      `${actionLabel} above ${fairHigh} unless the unit has strong ${actionNoun}.`,
    comparableSourceSummary: () => "Comparable estimate only. Production should replace this with URA/HDB benchmark, OneMap classification, and verified asking-rent feed coverage.",
    comparableMobileHigh: ({ area = "" } = {}) => `Likely high. Comparable estimate for ${area}; confirm direct asking evidence before committing.`,
    comparableMobileValidate: ({ area = "" } = {}) => `Needs validation. Comparable estimate for ${area}; confirm direct asking evidence before committing.`,
    driversShophouseTourism: () => "Tourism and dining activity are supporting stronger asking rents.",
    driversShophouseSupply: () => "Limited shophouse supply keeps comparable options tight.",
    driversShophouseApprovals: () => "F&B approvals and frontage premiums can justify part of the gap.",
    driversShophouseMomentum: () => "Asking-rent momentum is above the transaction-backed benchmark.",
    driversMallFrontage: () => "Prime mall frontage supports a higher rent premium.",
    driversMallDispersion: () => "Footfall, floor level, and tenant mix can explain wide rent dispersion.",
    driversMallTourism: () => "Tourist spend can lift asking expectations.",
    driversMallMomentum: () => "Asking momentum should be checked against recent transaction evidence.",
    driversHdbTraffic: () => "MRT spillover and daily neighbourhood traffic can raise asking expectations.",
    driversHdbUse: () => "Permitted use, corner frontage, and F&B approval can move rent materially.",
    driversHdbNegotiation: () => "Comparable HDB-linked benchmarks suggest the premium needs negotiation.",
    driversHdbMomentum: () => "Recent asking momentum should be validated against observed footfall.",
    driversDefaultPressure: () => "Comparable area pressure is above the direct benchmark range.",
    driversDefaultFrontage: () => "Frontage, permitted use, and fit-out value may explain part of the premium.",
    driversDefaultMomentum: () => "Asking-rent momentum needs confirmation before committing.",
    driversDefaultWorkspace: () => "Use the Workspace evidence layer to separate market premium from landlord ask.",
    spineFreeToolsActive: () => "Free tools active",
    spineFreeToolsCopy: () => "Save the report, watch the area, export evidence, and prepare the landlord note.",
    spineNegotiationTarget: ({ range = "" } = {}) => `Target ${range}`,
    spineNegotiationCopy: ({ fairLow = "", fairHigh = "" } = {}) =>
      `Offer nearer ${fairLow} and treat ${fairHigh} as the upper defence unless the unit has clear premium evidence.`,
    workflowTarget: ({ range = "" } = {}) => `Use ${range}`,
    workflowOffer: ({ offer = "", walkAway = "" } = {}) => `${offer} offer / ${walkAway} walk-away`,
    workflowAction: () => "Save report or export note",
    evidencePackAction: ({ fairHigh = "" } = {}) => `Defend ${fairHigh} psf`,
    evidencePackActionCopy: ({ actionLabel = "", action = "" } = {}) =>
      `${actionLabel}: ${action} Use the note and evidence rows before accepting the asking rent.`,
    sourceStageSample: () => "Sample",
    sourceStagePilot: () => "Pilot",
    sourceStageQa: () => "QA",
    sourceStageProduction: () => "Production",
    sourceStageMonitor: () => "Monitor",
    sourceStageBenchmarkLoaded: () => "Benchmark series loaded",
    sourceStageBenchmarkPending: () => "Sample benchmark pending",
    sourceStageComparableOnly: () => "Comparable signal only",
    sourceStageProductionReady: () => "Production verified",
    sourceStageProductionNotReady: () => "Not ready",
    sourceStageMonitorReady: () => "Ready for release monitoring",
    sourceStageMonitorPending: () => "Monitor after production release",
    evidenceSourceChecks: ({ count = 0 } = {}) => `${count} asking checks captured.`,
    evidenceSourceMissing: () => "No direct asking feed connected.",
    evidenceProductionReady: () => "Ready for production evidence use.",
    evidenceProductionPending: () => "Needs licensed feed or verified QA workflow.",
    noteEmpty: () => "Search or select a benchmark to generate the decision note.",
    noteHeadingSummary: () => "Summary",
    noteHeadingPulse: () => "Pulse Summary",
    noteHeadingEvidence: () => "Evidence",
    noteHeadingConfidence: () => "Signal confidence",
    noteHeadingWhy: () => "Why this signal",
    noteHeadingTrust: () => "Benchmark trust",
    noteHeadingOffer: () => "Offer position",
    noteHeadingWalkAway: () => "Walk-away position",
    noteHeadingLandlord: () => "Landlord discussion points",
    noteHeadingSourceSplit: () => "Source split",
    noteMetricOfficialMedian: ({ value = "" } = {}) => `Official median: ${value}`,
    noteMetricCurrentAsking: ({ value = "" } = {}) => `Current asking: ${value}`,
    noteSessionFallback: () => "No active saved-tools session",
    noteLandlordPointEvidence: () => "Ask for recent comparable evidence supporting the asking rent.",
    noteLandlordPointSeparate: () => "Separate rent premium from service charge, fit-out, frontage, and permitted-use value.",
    noteLandlordPointRentFree: () => "Request rent-free period or stepped rent if landlord will not move headline psf.",
    noteFinalCaveat: () => "Use this as a discussion note only. Confirm final terms, permitted use, frontage, fit-out condition, and legal/commercial advice before committing.",
    openSavedTools: () => "Open Saved Tools",
    evidenceSummary: ({ title = "", count = 0 } = {}) => `${title}: ${count} periods`,
    evidenceCoverage: ({ title = "", count = 0, evidence = "" } = {}) => `${title}: ${count} periods, ${evidence}`,
    scenarioSummary: ({ count = 0 } = {}) => `${count} target scenarios`,
    directionSave: () => "Save",
    directionAdd: () => "Add",
    impactSave: ({ amount = "" } = {}) => `Save ${amount}`,
    impactAdd: ({ amount = "" } = {}) => `Add ${amount}`,
    scenarioUseTarget: () => "Use target",
    offerSummary: ({ offer = "", walkAway = "" } = {}) => `${offer} offer / ${walkAway} walk-away`,
    offerDraftTitle: () => "Draft offer position",
    offerDraftInitial: ({ offer = "", monthly = "", size = "" } = {}) =>
      `Initial offer: ${offer} (${monthly} per month for ${size} sq ft)`,
    offerDraftWalkAway: ({ walkAway = "", monthly = "" } = {}) =>
      `Walk-away point: ${walkAway} (${monthly} per month)`,
    offerDraftLeaseTerm: ({ months = 0 } = {}) => `Lease term: ${months} months`,
    offerDraftRentFree: ({ months = 0, value = "" } = {}) => `Rent-free ask: ${months} months (${value} value at offer rent)`,
    offerDraftExposure: ({ exposure = "" } = {}) => `Lease exposure after rent-free period: ${exposure}`,
    offerDraftImpact: ({ direction = "", amount = "" } = {}) => `Annual impact versus asking: ${direction} ${amount}`,
    alertSourceConnected: () => "Alert when the live asking-rent source is connected for this area.",
    alertSectionTitle: () => "Area alert rule",
    alertCadenceWeekly: () => "Weekly",
    alertCadenceSourceRefresh: () => "When source refreshes",
    alertCadenceDaily: () => "Daily",
    alertTriggerGapAboveLimit: () => "Asking premium rises above limit",
    alertTriggerBenchmarkChanged: () => "Official benchmark changes",
    alertTriggerSourceConnected: () => "Asking source sync connected",
    alertTriggerAskingBelowTarget: () => "Asking rent falls to target",
    alertConditionGapAbove: ({ gapLimit = 0, gap = 0 } = {}) =>
      `Alert when asking premium is above +${Math.round(gapLimit)}%. Current gap is ${gap > 0 ? "+" : ""}${gap}%.`,
    alertConditionBenchmarkChanged: ({ official = "" } = {}) =>
      `Alert when official benchmark changes from ${official}.`,
    alertConditionAskingBelow: ({ target = "", asking = "" } = {}) =>
      `Alert when asking rent is at or below ${target}. Current asking is ${asking}.`,
    calculatorSummary: ({ area = "", size = "" } = {}) => `${area}: ${size} sq ft`,
    calculatorMonthlyImpact: ({ direction = "", amount = "" } = {}) => `${direction} ${amount}`,
    calculatorAnnualImpact: ({ direction = "", amount = "" } = {}) => `${direction} ${amount}`,
    noteLabelReady: () => "Ready",
    noteLabelDraft: () => "Draft",
    noteLabelLocked: () => "Locked",
    noteReadyStatus: () => "Negotiation note is ready below.",
    noteLockedStatus: () => "Open the free workspace to prepare the note.",
    scenarioLabelCurrentAsking: () => "Current asking",
    scenarioDetailLandlordPosition: () => "Landlord position",
    scenarioLabelFairHigh: () => "Fair high",
    scenarioDetailUpperTarget: () => "Defensible upper target",
    scenarioLabelOfficialMedian: () => "Official median",
    scenarioDetailTransactionBenchmark: () => "Transaction benchmark",
    scenarioLabelFairLow: () => "Fair low",
    scenarioDetailAggressiveNegotiation: () => "Aggressive negotiation",
    freshnessLabelFresh: () => "Fresh",
    freshnessLabelWatch: () => "Watch",
    freshnessLabelStale: () => "Stale",
    freshnessDetailMissingCapture: () => "No captured date is connected.",
    freshnessDetailInvalidCapture: () => "Captured date format is invalid.",
    freshnessDetailFresh: ({ days = 0, maxDays = 0 } = {}) =>
      `${days} day${days === 1 ? "" : "s"} since latest capture (SLA <= ${maxDays} days).`,
    freshnessDetailWatch: ({ days = 0, watchLower = 0, watchMaxDays = 0 } = {}) =>
      `${days} days since latest capture (SLA watch: ${watchLower}-${watchMaxDays} days).`,
    freshnessDetailStale: ({ days = 0, watchMaxDays = 0 } = {}) =>
      `${days} days since latest capture (SLA stale: >${watchMaxDays} days).`,
    sourceQaComparableStatus: () => "Comparable estimate",
    sourceQaCapturedMissing: () => "Not connected",
    sourceQaProductionNotReady: () => "Not ready",
    sourceQaWarningComparable: () => "Direct asking-rent source is not connected for this comparable estimate. Request source coverage before relying on it.",
    sourceQaStatusPilotManual: () => "Pilot manual feed",
    sourceQaStatusDefault: () => "Asking feed",
    sourceQaProductionReady: () => "Ready",
    sourceTimestampNotLive: () => "Not live yet",
    sourceRefreshTargetFallback: () => "Not set",
    sourceRefreshWorkflowFallback: () => "Weekly review pending.",
    backendScopeAll: () => "Scope: all",
    backendScopeLabel: ({ scope = "" } = {}) => `Scope: ${scope}`,
    backendSyncTimePending: () => "Sync time pending",
    evidenceSignalHigh: () => "High asking premium",
    evidenceSignalWatch: () => "Watch premium",
    evidenceSignalFair: () => "Near fair range",
    chartLabelOfficialMedian: () => "Official median",
    chartLabelAskingMedian: () => "Asking median",
    chartAxisRent: () => "S$/psf/month"
  },
  validation: {
    titleIdle: () => "V1 validation",
    titleAligned: () => "V1 validation • aligned",
    titleWarnings: ({ count = 0 } = {}) => `V1 validation • ${count} review point${count > 1 ? "s" : ""}`,
    empty: () => "No validation issues yet.",
    cleared: ({ text = "" } = {}) => `Cleared just now • ${text}`,
    advanced: ({ label = "" } = {}) =>
      `Moved to the next validation review point in ${label}.`,
    sectionCompleteTitle: ({ label = "" } = {}) => `${label} • complete`,
    sectionComplete: ({ label = "" } = {}) =>
      `${label} validation is complete for the current V1 context.`,
    allCompleteTitle: () => "V1 validation • complete",
    allComplete: () => "All tracked V1 validation points are clear for this context.",
    clearSectionFilter: () => "Clear section filter",
    backToAll: () => "Back to full validation",
    showClearedDetail: () => "View just-cleared detail",
    hideClearedDetail: () => "Hide just-cleared detail",
    pendingCopy: () => "Load a linked V1 record to validate the decision layer.",
    alignedCopy: () => "No obvious rent or value-gap conflicts detected.",
    warningBenchmarkRange: () => "Benchmark low psf should not be higher than benchmark high psf.",
    warningFairOutOfRange: () => "Verdict is set to fair, but the asking psf does not currently sit within the benchmark range.",
    warningHighOutOfRange: () => "High or stretched verdicts usually expect the asking psf to sit above the benchmark high.",
    warningBelowBenchmarkOutOfRange: () => "Below-benchmark verdict usually expects the asking psf to sit below the benchmark low.",
    warningGapDirectionMismatch: ({ selectedDirection = "", derivedDirection = "" } = {}) =>
      `Gap direction is ${signalLabel(selectedDirection)}, but the current numbers imply ${signalLabel(derivedDirection)}.`,
    warningValueGapOutOfRange: () => "Below-benchmark or possible value-gap status usually expects the current ask to sit below the benchmark range.",
    warningNotBelowBenchmarkConflict: () => "Not-below-benchmark status conflicts with an asking psf that is currently below the benchmark range."
  },
  breakdown: {
    title: () => "What still needs work",
    empty: () => "No unfinished review steps are being tracked yet."
  },
  v1Context: {
    noLinkedTitle: () => "No linked review record yet",
    noLinkedCopy: () => "Search a linked sample area to score whether this review record is complete enough to use.",
    noLinkedAction: () => "Link a review record first so Workspace can score it.",
    noLinkedNextAction: () => "Next: link a review record first.",
    pendingSummary: ({ title = "" } = {}) => `${title}: review sample not linked yet`,
    noInternalSample: () => "No internal sample",
    noInternalSampleCopy: () => "This area does not yet have a linked V1 context sample record.",
    pendingTitle: () => "Pending",
    valueGapPending: () => "Below-benchmark and value-gap logic will appear here once this area is modeled.",
    surroundingPending: () => "Nearby operator mix and trade pattern will appear here once loaded.",
    fitPending: () => "Use-case fit scores are not available for this area yet.",
    decisionNotePending: () => "No decision note yet",
    decisionNotePendingCopy: () => "Use Serangoon HDB retail, Bedok HDB retail, or Tiong Bahru shophouse to preview the internal decision layer.",
    watchoutsMissing: () => "No V1 watchouts loaded for this area yet.",
    operatorSummaryPendingTitle: () => "No operator summary",
    operatorSummaryMissing: () => "No surrounding-business summary is linked for this area yet.",
    competitionPendingTitle: () => "No competition read",
    competitionPending: () => "Competition and complementary-trade flags are not loaded yet.",
    fitPendingTitle: () => "No fit read",
    fitMissing: () => "No strong-fit use case is linked yet.",
    cautionPendingTitle: () => "No caution read",
    cautionPending: () => "Weak-fit and approval watchouts are not loaded yet.",
    linkedStatusMissing: () => "No linked review record yet for this area.",
    watchoutsLinkedMissing: () => "No watchouts linked for this area yet.",
    notableOperatorsMissingTitle: () => "No notable operators",
    notableOperatorsMissing: () => "No notable nearby operators were attached to this sample.",
    competitionNotFlagged: () => "Competition not flagged",
    competitionFlagsMissing: () => "No competition or complementary-trade flags are attached to this sample.",
    fitTagsMissing: () => "No fit tags",
    fitUseCasesMissing: () => "No strong-fit or conditional-fit use cases are attached to this sample.",
    weakFitMissing: () => "No weak-fit read",
    weakFitCautionMissing: () => "No weak-fit or approval caution is attached to this sample.",
    tradePatternPendingTitle: () => "Trade pattern pending",
    fitSummaryPendingTitle: () => "Fit pending",
    decisionTitlePending: () => "Decision note pending",
    tradePatternMissing: () => "Surrounding-business context has not been summarized yet.",
    fitRationaleMissing: () => "Use-case fit logic has not been summarized for this area yet.",
    negotiationAngleMissing: () => "Negotiation angle will appear here once the sample is modeled.",
    editorUnavailable: () => "No linked review record yet for this area.",
    editorReadOnlyLocked: () => "Editing is disabled in file preview. Open http://127.0.0.1:4173/members/toolbench/ to edit and save.",
    editorReady: () => "The internal editor is ready. Saving updates the Workspace-only review layer."
  }
};
let toolbenchSession = null;
let toolbenchRecords = [];
let toolbenchRecord = null;
let toolbenchRange = "5";
let toolbenchFeedState = null;
let toolbenchDecisionContextRecords = [];
let toolbenchContextDraft = null;
let toolbenchQuickPickFilter = "all";
let toolbenchQuickPickSortMode = "default";
let toolbenchQuickPickLayerFilter = "";
let toolbenchQueueLensRestoredOnInit = false;
let toolbenchQueueLensMemoryDismissed = false;
let toolbenchQueueLensMemoryRestoredHighlight = false;
let toolbenchQuickPickBookmark = null;
let toolbenchQuickPickBookmarks = {};
let toolbenchQuickPickBookmarkLastKey = "";
let toolbenchQuickPickBookmarkOpenCounts = {};
let toolbenchQuickPickBookmarkOpenMemoryByKey = {};
let toolbenchQuickPickBookmarkPlanningMemoryByKey = {};
let toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey = {};
let toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey = {};
let toolbenchQuickPickBookmarkOpenedKey = "";
let toolbenchQuickPickBookmarkPriorityOpenedKey = "";
let toolbenchQuickPickBookmarkOpenedTimer = null;
let toolbenchQuickPickBookmarkPlanResultKey = "";
let toolbenchQuickPickBookmarkPlanResultCopy = "";
let toolbenchQuickPickBookmarkPlanResultSummaryCopy = "";
let toolbenchQuickPickBookmarkPlanResultTimer = null;
let toolbenchQuickPickBookmarkPlanReleaseKey = "";
let toolbenchQuickPickBookmarkPlanReleaseCopy = "";
let toolbenchQuickPickBookmarkPlanReleaseSummaryCopy = "";
let toolbenchQuickPickBookmarkPlanReleaseTimer = null;
let toolbenchQuickPickRoutedOpenedKey = "";
let toolbenchQuickPickRoutedOpenedTimer = null;
let toolbenchQuickPickRoutedResult = {
  recordId: "",
  copy: "",
  active: false
};
let toolbenchQuickPickRoutedResultTimer = null;
let toolbenchQueueExplainerRoutedActive = false;
let toolbenchQueueExplainerRoutedActiveTimer = null;
let toolbenchQueueExplainerRoutedActiveDetail = "";
let toolbenchQueueExplainerRoutedResult = "";
let toolbenchQueueExplainerRoutedResultTimer = null;
let toolbenchRoutedRecordWorkCue = {
  recordId: "",
  workType: "",
  active: false,
  cardKey: "",
  action: "",
  validationSection: "",
  reopenMemoryType: ""
};
let toolbenchRoutedRecordWorkCueTimer = null;
let toolbenchPriorityBookmarkKey = "";
let toolbenchPriorityBookmarkPreviousKey = "";
let toolbenchPriorityBookmarkChanged = false;
let toolbenchPriorityBookmarkStableCount = 0;
let toolbenchPrioritySummaryHighlightTimer = null;
let toolbenchPriorityRouteBadgeHighlightTimer = null;
let toolbenchRouteLinkHintDismissed = false;
let toolbenchRouteLinkHintProgress = {
  badgeToSummary: false,
  summaryToBadge: false
};
let toolbenchRouteLinkHintLearnedVisible = false;
let toolbenchRouteLinkHintLearnedTimer = null;
let toolbenchRouteLinkHintRestoredVisible = false;
let toolbenchRouteLinkHintRestoredTimer = null;
let toolbenchRouteBadgeHintSoftened = false;
let toolbenchRouteSummaryHintSoftened = false;
let toolbenchRouteGuidanceRestoredThisSession = false;
let toolbenchQuickPickLaneActivity = [];
let toolbenchQuickPickLaneActivityUndo = null;
let toolbenchQuickPickLaneActivityUndoTimer = null;
let toolbenchQuickPickLaneActivityUndoTickTimer = null;
let toolbenchResolvedReviewKeys = new Set();
let toolbenchActiveReviewKey = "";
let toolbenchReviewPassPersistTimer = null;
let toolbenchReviewPassOrigin = "session";
let toolbenchReviewPassAudit = { type: "", at: "", source: "" };
let toolbenchReviewPassSync = { state: "idle", at: "" };
let toolbenchBackendReviewPassMeta = { available: false, resolvedCount: 0, quickPickFilter: "all", quickPickLayerFilter: "", activeReviewKey: "", updatedAt: "" };
let toolbenchBackendPreviewOpen = false;
let toolbenchBackendPreviewNotice = "";
let toolbenchBackendPreviewNoticeTimer = null;
let toolbenchBackendPreviewNoticeState = "hidden";
let toolbenchBackendPreviewNoticeTone = "neutral";
let toolbenchBackendPreviewFocusTarget = "";
let toolbenchBackendPreviewFocusHint = "";
let toolbenchBackendPreviewFocusHintDismissed = false;
let toolbenchSearchStatusTimer = null;

const toolbenchEl = {
  accessCard: document.getElementById("toolbenchAccessCard"),
  accessLabel: document.getElementById("toolbenchAccessLabel"),
  accessTitle: document.getElementById("toolbenchAccessTitle"),
  accessCopy: document.getElementById("toolbenchAccessCopy"),
  renderMode: document.getElementById("toolbenchRenderMode"),
  workspaceHandoffNotice: document.getElementById("toolbenchWorkspaceHandoffNotice"),
  workspaceHandoffActions: document.getElementById("toolbenchWorkspaceHandoffActions"),
  openFullWorkspace: document.getElementById("toolbenchOpenFullWorkspace"),
  workspaceHandoffTarget: document.getElementById("toolbenchWorkspaceHandoffTarget"),
  renderModeActions: document.getElementById("toolbenchRenderModeActions"),
  renderModeAuto: document.getElementById("toolbenchRenderModeAuto"),
  renderModeStandard: document.getElementById("toolbenchRenderModeStandard"),
  renderModeSafe: document.getElementById("toolbenchRenderModeSafe"),
  renderDiagnostics: document.getElementById("toolbenchRenderDiagnostics"),
  renderDiagnosticsCopy: document.getElementById("toolbenchRenderDiagnosticsCopy"),
  renderDiagnosticsAssessment: document.getElementById("toolbenchRenderDiagnosticsAssessment"),
  renderDiagnosticsComparison: document.getElementById("toolbenchRenderDiagnosticsComparison"),
  renderDiagnosticsStatus: document.getElementById("toolbenchRenderDiagnosticsStatus"),
  renderDiagnosticsHistory: document.getElementById("toolbenchRenderDiagnosticsHistory"),
  renderDiagnosticsHistoryList: document.getElementById("toolbenchRenderDiagnosticsHistoryList"),
  renderDiagnosticsVerdict: document.getElementById("toolbenchRenderDiagnosticsVerdict"),
  renderDiagnosticsVerdictCopy: document.getElementById("toolbenchRenderDiagnosticsVerdictCopy"),
  recoveryTargetDemoNote: document.getElementById("toolbenchRecoveryTargetDemoNote"),
  copyRenderDiagnostics: document.getElementById("toolbenchCopyRenderDiagnostics"),
  markRenderSame: document.getElementById("toolbenchMarkRenderSame"),
  markRenderDifferent: document.getElementById("toolbenchMarkRenderDifferent"),
  clearRenderVerdict: document.getElementById("toolbenchClearRenderVerdict"),
  enableRecoveryTargetDemo: document.getElementById("toolbenchEnableRecoveryTargetDemo"),
  disableRecoveryTargetDemo: document.getElementById("toolbenchDisableRecoveryTargetDemo"),
  openStandardMode: document.getElementById("toolbenchOpenStandardMode"),
  openSafeMode: document.getElementById("toolbenchOpenSafeMode"),
  accountLink: document.getElementById("toolbenchAccountLink"),
  form: document.getElementById("memberToolbenchSearch"),
  input: document.getElementById("memberToolbenchInput"),
  picks: document.getElementById("memberToolbenchPicks"),
  v1Roster: document.getElementById("workspaceV1Roster"),
  v1RosterTitle: document.getElementById("workspaceV1RosterTitle"),
  v1RosterCopy: document.getElementById("workspaceV1RosterCopy"),
  v1RosterOrigin: document.getElementById("workspaceV1RosterOrigin"),
  v1RosterAudit: document.getElementById("workspaceV1RosterAudit"),
  v1RosterSync: document.getElementById("workspaceV1RosterSync"),
  v1RosterBackendNotice: document.getElementById("workspaceV1RosterBackendNotice"),
  v1RosterBackend: document.getElementById("workspaceV1RosterBackend"),
  v1RosterBackendPreview: document.getElementById("workspaceV1RosterBackendPreview"),
  v1RosterBackendScope: document.getElementById("workspaceV1RosterBackendScope"),
  v1RosterCurrentScope: document.getElementById("workspaceV1RosterCurrentScope"),
  v1RosterBackendCompare: document.getElementById("workspaceV1RosterBackendCompare"),
  v1RosterBackendItem: document.getElementById("workspaceV1RosterBackendItem"),
  v1RosterBackendItemStatus: document.getElementById("workspaceV1RosterBackendItemStatus"),
  v1RosterBackendFocusHint: document.getElementById("workspaceV1RosterBackendFocusHint"),
  v1RosterBackendResolved: document.getElementById("workspaceV1RosterBackendResolved"),
  v1RosterBackendUpdated: document.getElementById("workspaceV1RosterBackendUpdated"),
  v1RosterRestoreJump: document.getElementById("workspaceV1RosterRestoreJump"),
  v1RosterRestore: document.getElementById("workspaceV1RosterRestore"),
  v1RosterClear: document.getElementById("workspaceV1RosterClear"),
  v1RosterTotal: document.getElementById("workspaceV1RosterTotal"),
  v1RosterStrong: document.getElementById("workspaceV1RosterStrong"),
  v1RosterPartial: document.getElementById("workspaceV1RosterPartial"),
  v1RosterWeak: document.getElementById("workspaceV1RosterWeak"),
  v1RosterCurrent: document.getElementById("workspaceV1RosterCurrent"),
  v1RosterCurrentTrend: document.getElementById("workspaceV1RosterCurrentTrend"),
  v1RosterSort: document.getElementById("workspaceV1RosterSort"),
  v1RosterFocusStrongest: document.getElementById("workspaceV1RosterFocusStrongest"),
  v1RosterFocusWeakest: document.getElementById("workspaceV1RosterFocusWeakest"),
  v1RosterReturnCurrent: document.getElementById("workspaceV1RosterReturnCurrent"),
  v1RosterBookmarkLens: document.getElementById("workspaceV1RosterBookmarkLens"),
  v1RosterOpenBookmark: document.getElementById("workspaceV1RosterOpenBookmark"),
  v1RosterOpenPriorityBookmark: document.getElementById("workspaceV1RosterOpenPriorityBookmark"),
  v1RosterApplyPlanningAction: document.getElementById("workspaceV1RosterApplyPlanningAction"),
  v1RosterFollowRecoveryTarget: document.getElementById("workspaceV1RosterFollowRecoveryTarget"),
  v1RosterRouteBadge: document.getElementById("workspaceV1RosterRouteBadge"),
  v1RosterRefreshBookmark: document.getElementById("workspaceV1RosterRefreshBookmark"),
  v1RosterResetLens: document.getElementById("workspaceV1RosterResetLens"),
  v1RosterSortSummary: document.getElementById("workspaceV1RosterSortSummary"),
  v1RosterSortExplainer: document.getElementById("workspaceV1RosterSortExplainer"),
  v1RosterPrioritySummary: document.getElementById("workspaceV1RosterPrioritySummary"),
  v1RosterRouteLinkWrap: document.getElementById("workspaceV1RosterRouteLinkWrap"),
  v1RosterRouteLinkHint: document.getElementById("workspaceV1RosterRouteLinkHint"),
  v1RosterRouteLinkReset: document.getElementById("workspaceV1RosterRouteLinkReset"),
  v1RosterSortMemoryWrap: document.getElementById("workspaceV1RosterSortMemoryWrap"),
  v1RosterSortMemory: document.getElementById("workspaceV1RosterSortMemory"),
  v1RosterSortMemoryActivity: document.getElementById("workspaceV1RosterSortMemoryActivity"),
  v1RosterDismissMemory: document.getElementById("workspaceV1RosterDismissMemory"),
  v1RosterRecentActions: document.getElementById("workspaceV1RosterRecentActions"),
  v1RosterRecentActionsList: document.getElementById("workspaceV1RosterRecentActionsList"),
  v1RosterRecentActionsUndo: document.getElementById("workspaceV1RosterRecentActionsUndo"),
  v1RosterRecentActionsClear: document.getElementById("workspaceV1RosterRecentActionsClear"),
  v1RosterSortBookmark: document.getElementById("workspaceV1RosterSortBookmark"),
  v1RosterSortBookmarkList: document.getElementById("workspaceV1RosterSortBookmarkList"),
  v1RosterBreakdownTitle: document.getElementById("workspaceV1RosterBreakdownTitle"),
  v1RosterBreakdownList: document.getElementById("workspaceV1RosterBreakdownList"),
  searchStatus: document.getElementById("memberToolbenchSearchStatus"),
  confidence: document.getElementById("toolbenchConfidence"),
  resultTitle: document.getElementById("toolbenchResultTitle"),
  decision: document.getElementById("toolbenchDecision"),
  reason: document.getElementById("toolbenchReason"),
  pulseToolbenchLabel: document.getElementById("pulseToolbenchLabel"),
  pulseToolbenchTitle: document.getElementById("pulseToolbenchTitle"),
  pulseToolbenchCopy: document.getElementById("pulseToolbenchCopy"),
  official: document.getElementById("toolbenchOfficialMetric"),
  asking: document.getElementById("toolbenchAskingMetric"),
  fairRange: document.getElementById("toolbenchFairRangeMetric"),
  gap: document.getElementById("toolbenchGapMetric"),
  actionLabel: document.getElementById("toolbenchActionLabel"),
  actionCopy: document.getElementById("toolbenchActionCopy"),
  sourceCopy: document.getElementById("toolbenchSourceCopy"),
  sourceQaPanel: document.getElementById("toolbenchSourceQaPanel"),
  sourceQaStatus: document.getElementById("toolbenchSourceQaStatus"),
  sourceQaChecks: document.getElementById("toolbenchSourceQaChecks"),
  sourceQaCaptured: document.getElementById("toolbenchSourceQaCaptured"),
  sourceQaProduction: document.getElementById("toolbenchSourceQaProduction"),
  sourceQaWarning: document.getElementById("toolbenchSourceQaWarning"),
  sourceQaSources: document.getElementById("toolbenchSourceQaSources"),
  signalDrivers: document.getElementById("toolbenchSignalDrivers"),
  spineConfidenceTitle: document.getElementById("spineConfidenceTitle"),
  spineConfidenceCopy: document.getElementById("spineConfidenceCopy"),
  spineBenchmarkTrust: document.getElementById("spineBenchmarkTrust"),
  spineBenchmarkCopy: document.getElementById("spineBenchmarkCopy"),
  spineNegotiationPosition: document.getElementById("spineNegotiationPosition"),
  spineNegotiationCopy: document.getElementById("spineNegotiationCopy"),
  spineMemberAccess: document.getElementById("spineMemberAccess"),
  spineMemberCopy: document.getElementById("spineMemberCopy"),
  evidencePack: document.getElementById("workspaceEvidencePack"),
  evidencePackSummary: document.getElementById("workspaceEvidencePackSummary"),
  evidencePackTrust: document.getElementById("evidencePackTrust"),
  evidencePackTrustCopy: document.getElementById("evidencePackTrustCopy"),
  evidencePackBenchmark: document.getElementById("evidencePackBenchmark"),
  evidencePackBenchmarkCopy: document.getElementById("evidencePackBenchmarkCopy"),
  evidencePackAsking: document.getElementById("evidencePackAsking"),
  evidencePackAskingCopy: document.getElementById("evidencePackAskingCopy"),
  evidencePackAction: document.getElementById("evidencePackAction"),
  evidencePackActionCopy: document.getElementById("evidencePackActionCopy"),
  sourceTimeline: document.getElementById("workspaceSourceTimeline"),
  sourceTimelineSummary: document.getElementById("workspaceSourceTimelineSummary"),
  sourceTimelineNote: document.getElementById("workspaceSourceTimelineNote"),
  sourceTimelineActions: document.getElementById("workspaceSourceTimelineActions"),
  sourceTimelineList: document.getElementById("workspaceSourceTimelineList"),
  v1ContextPack: document.getElementById("workspaceV1ContextPack"),
  v1ContextSummary: document.getElementById("workspaceV1ContextSummary"),
  v1ContextWhyToggle: document.getElementById("workspaceV1ContextWhyToggle"),
  v1ContextWhy: document.getElementById("workspaceV1ContextWhy"),
  v1ContextMeta: document.getElementById("workspaceV1ContextMeta"),
  v1SnapshotOpportunityTitle: document.getElementById("workspaceV1SnapshotOpportunityTitle"),
  v1SnapshotOpportunityCopy: document.getElementById("workspaceV1SnapshotOpportunityCopy"),
  v1SnapshotOpportunityMeta: document.getElementById("workspaceV1SnapshotOpportunityMeta"),
  v1SnapshotConstraintTitle: document.getElementById("workspaceV1SnapshotConstraintTitle"),
  v1SnapshotConstraintCopy: document.getElementById("workspaceV1SnapshotConstraintCopy"),
  v1SnapshotConstraintMeta: document.getElementById("workspaceV1SnapshotConstraintMeta"),
  v1SnapshotNextTitle: document.getElementById("workspaceV1SnapshotNextTitle"),
  v1SnapshotNextCopy: document.getElementById("workspaceV1SnapshotNextCopy"),
  v1SnapshotNextMeta: document.getElementById("workspaceV1SnapshotNextMeta"),
  v1SnapshotOutcomeTitle: document.getElementById("workspaceV1SnapshotOutcomeTitle"),
  v1SnapshotOutcomeCopy: document.getElementById("workspaceV1SnapshotOutcomeCopy"),
  v1SnapshotOutcomeReason: document.getElementById("workspaceV1SnapshotOutcomeReason"),
  v1SnapshotOutcomePriority: document.getElementById("workspaceV1SnapshotOutcomePriority"),
  v1SnapshotOutcomeHistory: document.getElementById("workspaceV1SnapshotOutcomeHistory"),
  v1SignalTitle: document.getElementById("workspaceV1SignalTitle"),
  v1SignalCopy: document.getElementById("workspaceV1SignalCopy"),
  v1ValueGapTitle: document.getElementById("workspaceV1ValueGapTitle"),
  v1ValueGapCopy: document.getElementById("workspaceV1ValueGapCopy"),
  v1SurroundingTitle: document.getElementById("workspaceV1SurroundingTitle"),
  v1SurroundingCopy: document.getElementById("workspaceV1SurroundingCopy"),
  v1FitTitle: document.getElementById("workspaceV1FitTitle"),
  v1FitCopy: document.getElementById("workspaceV1FitCopy"),
  v1DecisionTitle: document.getElementById("workspaceV1DecisionTitle"),
  v1DecisionCopy: document.getElementById("workspaceV1DecisionCopy"),
  v1Watchouts: document.getElementById("workspaceV1Watchouts"),
  v1OperatorsTitle: document.getElementById("workspaceV1OperatorsTitle"),
  v1OperatorsCopy: document.getElementById("workspaceV1OperatorsCopy"),
  v1CompetitionTitle: document.getElementById("workspaceV1CompetitionTitle"),
  v1CompetitionCopy: document.getElementById("workspaceV1CompetitionCopy"),
  v1GoodFitTitle: document.getElementById("workspaceV1GoodFitTitle"),
  v1GoodFitCopy: document.getElementById("workspaceV1GoodFitCopy"),
  v1CautionTitle: document.getElementById("workspaceV1CautionTitle"),
  v1CautionCopy: document.getElementById("workspaceV1CautionCopy"),
  v1Health: document.getElementById("workspaceV1Health"),
  v1HealthTitle: document.getElementById("workspaceV1HealthTitle"),
  v1HealthCopy: document.getElementById("workspaceV1HealthCopy"),
  v1HealthAction: document.getElementById("workspaceV1HealthAction"),
  v1HealthNextRecord: document.getElementById("workspaceV1HealthNextRecord"),
  v1HealthResetPass: document.getElementById("workspaceV1HealthResetPass"),
  v1HealthQueue: document.getElementById("workspaceV1HealthQueue"),
  v1HealthOrigin: document.getElementById("workspaceV1HealthOrigin"),
  v1HealthAudit: document.getElementById("workspaceV1HealthAudit"),
  v1HealthSync: document.getElementById("workspaceV1HealthSync"),
  v1HealthProgress: document.getElementById("workspaceV1HealthProgress"),
  v1HealthFinish: document.getElementById("workspaceV1HealthFinish"),
  v1HealthList: document.getElementById("workspaceV1HealthList"),
  v1EditorForm: document.getElementById("workspaceV1Editor"),
  v1EditorNav: document.getElementById("workspaceV1EditorNav"),
  v1EditorTitle: document.getElementById("workspaceV1EditorTitle"),
  v1VerdictInput: document.getElementById("workspaceV1VerdictInput"),
  v1ConfidenceInput: document.getElementById("workspaceV1ConfidenceInput"),
  v1BenchmarkLowInput: document.getElementById("workspaceV1BenchmarkLowInput"),
  v1BenchmarkHighInput: document.getElementById("workspaceV1BenchmarkHighInput"),
  v1AskingPsfInput: document.getElementById("workspaceV1AskingPsfInput"),
  v1GapPercentInput: document.getElementById("workspaceV1GapPercentInput"),
  v1DecisionInput: document.getElementById("workspaceV1DecisionInput"),
  v1ValueGapInput: document.getElementById("workspaceV1ValueGapInput"),
  v1ValueGapStatusInput: document.getElementById("workspaceV1ValueGapStatusInput"),
  v1GapDirectionInput: document.getElementById("workspaceV1GapDirectionInput"),
  v1ValueGapScoreInput: document.getElementById("workspaceV1ValueGapScoreInput"),
  v1LikelyDriversInput: document.getElementById("workspaceV1LikelyDriversInput"),
  v1ValueGapCautionsInput: document.getElementById("workspaceV1ValueGapCautionsInput"),
  v1TradePatternInput: document.getElementById("workspaceV1TradePatternInput"),
  v1CategoryMixInput: document.getElementById("workspaceV1CategoryMixInput"),
  v1OperatorsInput: document.getElementById("workspaceV1OperatorsInput"),
  v1CompetitionFlagsInput: document.getElementById("workspaceV1CompetitionFlagsInput"),
  v1ComplementaryFlagsInput: document.getElementById("workspaceV1ComplementaryFlagsInput"),
  v1DaypartSignalsInput: document.getElementById("workspaceV1DaypartSignalsInput"),
  v1AngleInput: document.getElementById("workspaceV1AngleInput"),
  v1FitScoresInput: document.getElementById("workspaceV1FitScoresInput"),
  v1GoodFitInput: document.getElementById("workspaceV1GoodFitInput"),
  v1CautionInput: document.getElementById("workspaceV1CautionInput"),
  v1WatchoutsInput: document.getElementById("workspaceV1WatchoutsInput"),
  v1SaveButton: document.getElementById("workspaceV1SaveButton"),
  v1EditorStatus: document.getElementById("workspaceV1EditorStatus"),
  v1Validation: document.getElementById("workspaceV1Validation"),
  v1ValidationTitle: document.getElementById("workspaceV1ValidationTitle"),
  v1ValidationClear: document.getElementById("workspaceV1ValidationClear"),
  v1ValidationList: document.getElementById("workspaceV1ValidationList"),
  chartCard: document.getElementById("memberChartCard"),
  chartKicker: document.getElementById("memberChartKicker"),
  chartTitle: document.getElementById("memberChartTitle"),
  chartFairRangeMetric: document.getElementById("chartFairRangeMetric"),
  chartGapMetric: document.getElementById("chartGapMetric"),
  chartReadMetric: document.getElementById("chartReadMetric"),
  chartContextNote: document.getElementById("chartContextNote"),
  chart: document.getElementById("memberRentChart"),
  evidencePanel: document.getElementById("memberEvidencePanel"),
  evidenceSummary: document.getElementById("evidenceSummary"),
  evidenceSourceStateItem: document.getElementById("evidenceSourceStateItem"),
  evidenceSourceStateMetric: document.getElementById("evidenceSourceStateMetric"),
  evidenceSourceStateCopy: document.getElementById("evidenceSourceStateCopy"),
  evidenceBenchmarkTrustItem: document.getElementById("evidenceBenchmarkTrustItem"),
  evidenceBenchmarkTrustMetric: document.getElementById("evidenceBenchmarkTrustMetric"),
  evidenceBenchmarkTrustCopy: document.getElementById("evidenceBenchmarkTrustCopy"),
  evidenceAskingSourceItem: document.getElementById("evidenceAskingSourceItem"),
  evidenceAskingSourceMetric: document.getElementById("evidenceAskingSourceMetric"),
  evidenceAskingSourceCopy: document.getElementById("evidenceAskingSourceCopy"),
  evidenceProductionReadinessItem: document.getElementById("evidenceProductionReadinessItem"),
  evidenceProductionReadinessMetric: document.getElementById("evidenceProductionReadinessMetric"),
  evidenceProductionReadinessCopy: document.getElementById("evidenceProductionReadinessCopy"),
  evidenceLastCheckedItem: document.getElementById("evidenceLastCheckedItem"),
  evidenceLastCheckedMetric: document.getElementById("evidenceLastCheckedMetric"),
  evidenceLastCheckedCopy: document.getElementById("evidenceLastCheckedCopy"),
  evidencePeriodMetric: document.getElementById("evidencePeriodMetric"),
  evidenceSpreadMetric: document.getElementById("evidenceSpreadMetric"),
  evidenceOfficialMetric: document.getElementById("evidenceOfficialMetric"),
  evidenceAskingMetric: document.getElementById("evidenceAskingMetric"),
  evidenceBenchmarkLayer: document.getElementById("evidenceBenchmarkLayer"),
  evidenceAskingLayer: document.getElementById("evidenceAskingLayer"),
  evidenceCoverageLayer: document.getElementById("evidenceCoverageLayer"),
  evidenceTrustNote: document.getElementById("evidenceTrustNote"),
  exportEvidenceButton: document.getElementById("exportEvidenceButton"),
  evidenceStatus: document.getElementById("evidenceStatus"),
  evidenceTableBody: document.getElementById("evidenceTableBody"),
  calculatorPanel: document.getElementById("negotiationCalculatorPanel"),
  workflowCheckStep: document.getElementById("workflowCheckStep"),
  workflowTargetStep: document.getElementById("workflowTargetStep"),
  workflowOfferStep: document.getElementById("workflowOfferStep"),
  workflowActionStep: document.getElementById("workflowActionStep"),
  calculatorSummary: document.getElementById("calculatorSummary"),
  calculatorForm: document.getElementById("negotiationCalculatorForm"),
  calculatorUnitSize: document.getElementById("calculatorUnitSize"),
  calculatorAskingPsf: document.getElementById("calculatorAskingPsf"),
  calculatorTargetPsf: document.getElementById("calculatorTargetPsf"),
  useFairHighButton: document.getElementById("useFairHighButton"),
  useOfficialButton: document.getElementById("useOfficialButton"),
  calculatorCurrentMonthly: document.getElementById("calculatorCurrentMonthly"),
  calculatorTargetMonthly: document.getElementById("calculatorTargetMonthly"),
  calculatorMonthlyImpact: document.getElementById("calculatorMonthlyImpact"),
  calculatorAnnualImpact: document.getElementById("calculatorAnnualImpact"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  scenarioTableBody: document.getElementById("scenarioTableBody"),
  offerSummary: document.getElementById("offerSummary"),
  offerBuilderForm: document.getElementById("offerBuilderForm"),
  offerPsfInput: document.getElementById("offerPsfInput"),
  walkAwayPsfInput: document.getElementById("walkAwayPsfInput"),
  leaseMonthsInput: document.getElementById("leaseMonthsInput"),
  rentFreeMonthsInput: document.getElementById("rentFreeMonthsInput"),
  useFairLowOfferButton: document.getElementById("useFairLowOfferButton"),
  useFairHighWalkButton: document.getElementById("useFairHighWalkButton"),
  appendOfferNoteButton: document.getElementById("appendOfferNoteButton"),
  offerMonthlyMetric: document.getElementById("offerMonthlyMetric"),
  walkAwayMonthlyMetric: document.getElementById("walkAwayMonthlyMetric"),
  rentFreeValueMetric: document.getElementById("rentFreeValueMetric"),
  leaseExposureMetric: document.getElementById("leaseExposureMetric"),
  offerBuilderStatus: document.getElementById("offerBuilderStatus"),
  calculatorStatus: document.getElementById("calculatorStatus"),
  saveButton: document.getElementById("toolbenchSaveReportButton"),
  watchButton: document.getElementById("toolbenchWatchAreaButton"),
  exportButton: document.getElementById("toolbenchExportButton"),
  publicResultLink: document.getElementById("toolbenchPublicResultLink"),
  actionStatus: document.getElementById("toolbenchActionStatus"),
  saveStateMetric: document.getElementById("saveStateMetric"),
  saveConfidenceMetric: document.getElementById("saveConfidenceMetric"),
  saveTargetMetric: document.getElementById("saveTargetMetric"),
  saveOfferMetric: document.getElementById("saveOfferMetric"),
  saveNoteMetric: document.getElementById("saveNoteMetric"),
  alertRulePanel: document.getElementById("memberAlertRulePanel"),
  alertRuleSummary: document.getElementById("alertRuleSummary"),
  alertRuleForm: document.getElementById("alertRuleForm"),
  alertTriggerSelect: document.getElementById("alertTriggerSelect"),
  alertTargetPsfInput: document.getElementById("alertTargetPsfInput"),
  alertGapLimitInput: document.getElementById("alertGapLimitInput"),
  alertCadenceSelect: document.getElementById("alertCadenceSelect"),
  useWalkAwayAlertButton: document.getElementById("useWalkAwayAlertButton"),
  useAskingGapAlertButton: document.getElementById("useAskingGapAlertButton"),
  appendAlertRuleNoteButton: document.getElementById("appendAlertRuleNoteButton"),
  alertConditionMetric: document.getElementById("alertConditionMetric"),
  alertCadenceMetric: document.getElementById("alertCadenceMetric"),
  alertStoredMetric: document.getElementById("alertStoredMetric"),
  alertRuleStatus: document.getElementById("alertRuleStatus"),
  savedCount: document.getElementById("toolbenchSavedCount"),
  savedReports: document.getElementById("toolbenchSavedReports"),
  watchCount: document.getElementById("toolbenchWatchCount"),
  watchlist: document.getElementById("toolbenchWatchlist"),
  noteLabel: document.getElementById("toolbenchNoteLabel"),
  note: document.getElementById("toolbenchNegotiationNote"),
  copyNoteButton: document.getElementById("toolbenchCopyNoteButton"),
  downloadNoteButton: document.getElementById("toolbenchDownloadNoteButton"),
  noteStatus: document.getElementById("toolbenchNoteStatus")
};

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
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

function loadSessionJson(key, fallback) {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Could not read session ${key}.`, error);
    return fallback;
  }
}

function writeSessionJson(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clearSessionJson(key) {
  sessionStorage.removeItem(key);
}

function queryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function currentRefreshedContextRecordKey() {
  return normalizeDecisionContextKey(
    toolbenchSourceTimelineHandoff.recordId ||
    toolbenchContextDraft?.recordId ||
    toolbenchContextDraft?.contextRecordId ||
    toolbenchRecord?.recordId ||
    ""
  );
}

function refreshedReviewProgressForContext(context = toolbenchContextDraft) {
  const origin = v1ContextOrigin(context);
  if (origin !== "refreshed-from-sample") {
    return {
      active: false,
      reviewed: 0,
      total: 0,
      complete: false,
      nextSection: "",
      nextLabel: ""
    };
  }
  const recordKey = normalizeDecisionContextKey(context?.recordId || context?.contextRecordId || "");
  const refreshedSectionKeys = (Array.isArray(context?.contextOriginLayers) ? context.contextOriginLayers : [])
    .map(v1ContextOriginLayerSectionKey)
    .filter(Boolean);
  const reviewedMap = recordKey ? (toolbenchReviewedRefreshedSectionsByRecord[recordKey] || {}) : {};
  const reviewed = refreshedSectionKeys.filter((sectionKey) => reviewedMap[sectionKey]).length;
  const nextSection = refreshedSectionKeys.find((sectionKey) => !reviewedMap[sectionKey]) || "";
  return {
    active: refreshedSectionKeys.length > 0,
    reviewed,
    total: refreshedSectionKeys.length,
    complete: refreshedSectionKeys.length > 0 && reviewed >= refreshedSectionKeys.length,
    nextSection,
    nextLabel: nextSection ? v1ValidationSectionLabel(nextSection) : ""
  };
}

function removeQueryParam(key) {
  if (!key || typeof window.history?.replaceState !== "function") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(key)) return;
  url.searchParams.delete(key);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function clearSearchStatusTimer() {
  if (!toolbenchSearchStatusTimer) return;
  window.clearTimeout(toolbenchSearchStatusTimer);
  toolbenchSearchStatusTimer = null;
}

function setSearchStatus(message = "", { autoClearMs = 0, tone = "" } = {}) {
  if (!toolbenchEl.searchStatus) return;
  clearSearchStatusTimer();
  toolbenchEl.searchStatus.textContent = message;
  if (tone) toolbenchEl.searchStatus.dataset.tone = tone;
  else delete toolbenchEl.searchStatus.dataset.tone;
  if (message && autoClearMs > 0) {
    const activeMessage = message;
    const activeTone = tone;
    toolbenchSearchStatusTimer = window.setTimeout(() => {
      if (!toolbenchEl.searchStatus || toolbenchEl.searchStatus.textContent !== activeMessage) return;
      if ((toolbenchEl.searchStatus.dataset.tone || "") !== activeTone) return;
      toolbenchEl.searchStatus.textContent = "";
      delete toolbenchEl.searchStatus.dataset.tone;
      toolbenchSearchStatusTimer = null;
    }, autoClearMs);
  }
}

function setNamedSearchStatus(key = "", params = {}) {
  const entry = toolbenchStatusMessages[key];
  if (!entry) return;
  const message = typeof entry.text === "function" ? entry.text(params) : String(entry.text || "");
  setSearchStatus(message, { autoClearMs: entry.duration || 0, tone: entry.tone || "" });
}

function toolbenchHttpWorkspaceHandoffUrl() {
  const url = new URL(toolbenchHttpWorkspaceUrl);
  url.searchParams.set("from", "preview");
  return url.toString();
}

function inStaticWorkspacePreview() {
  return window.location.protocol === "file:";
}

function openFullWorkspaceHandoff() {
  const handoffUrl = toolbenchHttpWorkspaceHandoffUrl();
  setNamedSearchStatus("openingFullWorkspace", { handoffUrl });
  window.location.href = handoffUrl;
}

function currentAskingFeed() {
  return toolbenchFeedState || window.RENTINTEL_ASKING_RENT_FEED || { records: [] };
}

function currentSourceStatus() {
  return window.RENTINTEL_SOURCE_STATUS || { status: [] };
}

function persistV1ReviewPassState() {
  if (window.location.protocol === "file:" || toolbenchSession?.access === "free") {
    toolbenchReviewPassOrigin = "local";
    toolbenchReviewPassSync = {
      state: "idle",
      at: toolbenchReviewPassSync.at || ""
    };
  } else {
    toolbenchReviewPassOrigin = "session";
    toolbenchReviewPassSync = {
      state: "pending",
      at: toolbenchReviewPassSync.at || ""
    };
  }
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  scheduleBackendV1ReviewPassPersist();
}

function restoreV1ReviewPassState() {
  const saved = loadSessionJson(toolbenchV1ReviewPassStateKey, {}) || {};
  toolbenchQueueLensRestoredOnInit = false;
  toolbenchQueueLensMemoryRestoredHighlight = false;
  toolbenchResolvedReviewKeys = new Set(
    Array.isArray(saved.resolvedKeys)
      ? saved.resolvedKeys.filter((key) => typeof key === "string" && key.includes("::"))
      : []
  );
  toolbenchQuickPickFilter = typeof saved.quickPickFilter === "string" && saved.quickPickFilter
    ? saved.quickPickFilter
    : "all";
  toolbenchQuickPickSortMode =
    saved.quickPickSortMode === "improving" || saved.quickPickSortMode === "attention"
      ? saved.quickPickSortMode
      : "default";
  toolbenchQuickPickLayerFilter = typeof saved.quickPickLayerFilter === "string"
    ? saved.quickPickLayerFilter
    : "";
  toolbenchQuickPickBookmark =
    saved.quickPickBookmark && typeof saved.quickPickBookmark === "object"
      ? {
          filter: typeof saved.quickPickBookmark.filter === "string" && saved.quickPickBookmark.filter
            ? saved.quickPickBookmark.filter
            : "all",
          sort:
            saved.quickPickBookmark.sort === "improving" || saved.quickPickBookmark.sort === "attention"
              ? saved.quickPickBookmark.sort
              : "default",
          layerFilter: typeof saved.quickPickBookmark.layerFilter === "string"
            ? saved.quickPickBookmark.layerFilter
            : "",
          snapshot: saved.quickPickBookmark.snapshot && typeof saved.quickPickBookmark.snapshot === "object"
            ? {
                count: Number.isFinite(saved.quickPickBookmark.snapshot.count) ? saved.quickPickBookmark.snapshot.count : 0,
                weakCount: Number.isFinite(saved.quickPickBookmark.snapshot.weakCount) ? saved.quickPickBookmark.snapshot.weakCount : 0,
                partialCount: Number.isFinite(saved.quickPickBookmark.snapshot.partialCount) ? saved.quickPickBookmark.snapshot.partialCount : 0
              }
            : { count: 0, weakCount: 0, partialCount: 0 },
          savedAt: typeof saved.quickPickBookmark.savedAt === "string" ? saved.quickPickBookmark.savedAt : ""
        }
      : null;
  toolbenchQuickPickBookmarks =
    saved.quickPickBookmarks && typeof saved.quickPickBookmarks === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarks).flatMap(([key, value]) => {
            if (!value || typeof value !== "object") return [];
            return [[key, {
              filter: typeof value.filter === "string" && value.filter ? value.filter : "all",
              sort: value.sort === "improving" || value.sort === "attention" ? value.sort : "default",
              layerFilter: typeof value.layerFilter === "string" ? value.layerFilter : "",
              snapshot: value.snapshot && typeof value.snapshot === "object"
                ? {
                    count: Number.isFinite(value.snapshot.count) ? value.snapshot.count : 0,
                    weakCount: Number.isFinite(value.snapshot.weakCount) ? value.snapshot.weakCount : 0,
                    partialCount: Number.isFinite(value.snapshot.partialCount) ? value.snapshot.partialCount : 0
                  }
                : { count: 0, weakCount: 0, partialCount: 0 },
              savedAt: typeof value.savedAt === "string" ? value.savedAt : ""
            }]];
          })
        )
      : {};
  if (!Object.keys(toolbenchQuickPickBookmarks).length && toolbenchQuickPickBookmark) {
    toolbenchQuickPickBookmarks[quickPickBookmarkKeyForLens(toolbenchQuickPickBookmark)] = { ...toolbenchQuickPickBookmark };
  }
  toolbenchQuickPickBookmarkLastKey =
    typeof saved.quickPickBookmarkLastKey === "string" && saved.quickPickBookmarkLastKey
      ? saved.quickPickBookmarkLastKey
      : Object.keys(toolbenchQuickPickBookmarks)[0] || "";
  toolbenchQuickPickBookmarkOpenCounts =
    saved.quickPickBookmarkOpenCounts && typeof saved.quickPickBookmarkOpenCounts === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarkOpenCounts)
            .map(([key, count]) => [key, Number.isFinite(count) ? Math.max(0, count) : 0])
            .filter(([, count]) => count > 0)
        )
      : {};
  toolbenchQuickPickBookmarkOpenMemoryByKey =
    saved.quickPickBookmarkOpenMemoryByKey && typeof saved.quickPickBookmarkOpenMemoryByKey === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarkOpenMemoryByKey).map(([key, value]) => [
            key,
            {
              productive: Number.isFinite(value?.productive) ? Math.max(0, value.productive) : 0,
              pressure: Number.isFinite(value?.pressure) ? Math.max(0, value.pressure) : 0
            }
          ])
        )
      : {};
  toolbenchQuickPickBookmarkPlanningMemoryByKey =
    saved.quickPickBookmarkPlanningMemoryByKey && typeof saved.quickPickBookmarkPlanningMemoryByKey === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarkPlanningMemoryByKey).flatMap(([key, value]) => {
            if (!value || typeof value !== "object") return [];
            return [[key, {
              action: typeof value.action === "string" ? value.action : "",
              at: typeof value.at === "string" ? value.at : ""
            }]];
          })
        )
      : {};
  toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey =
    saved.quickPickBookmarkRecoveryTargetMemoryByKey && typeof saved.quickPickBookmarkRecoveryTargetMemoryByKey === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarkRecoveryTargetMemoryByKey).flatMap(([key, value]) => {
            if (!value || typeof value !== "object") return [];
            return [[key, {
              title: typeof value.title === "string" ? value.title : "",
              stable: Number.isFinite(value.stable) ? Math.max(0, value.stable) : 0,
              fading: Number.isFinite(value.fading) ? Math.max(0, value.fading) : 0,
              lastAt: typeof value.lastAt === "string" ? value.lastAt : ""
            }]];
          })
        )
      : {};
  toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey =
    saved.quickPickBookmarkRecoveryChoiceMemoryByKey && typeof saved.quickPickBookmarkRecoveryChoiceMemoryByKey === "object"
      ? Object.fromEntries(
          Object.entries(saved.quickPickBookmarkRecoveryChoiceMemoryByKey).flatMap(([key, value]) => {
            if (!value || typeof value !== "object") return [];
            return [[key, {
              lead: Number.isFinite(value.lead) ? Math.max(0, value.lead) : 0,
              holdingAlternative: Number.isFinite(value.holdingAlternative) ? Math.max(0, value.holdingAlternative) : 0,
              fadingAlternative: Number.isFinite(value.fadingAlternative) ? Math.max(0, value.fadingAlternative) : 0
            }]];
          })
        )
      : {};
  const savedLaneActivity = Array.isArray(saved.quickPickLaneActivity)
    ? saved.quickPickLaneActivity
    : loadSessionJson(toolbenchQuickPickLaneActivityKey, []);
  toolbenchQuickPickLaneActivity =
    Array.isArray(savedLaneActivity)
      ? savedLaneActivity
          .flatMap((entry) => {
            if (!entry || typeof entry !== "object") return [];
            const action = typeof entry.action === "string" ? entry.action.trim() : "";
            const at = typeof entry.at === "string" ? entry.at : "";
            if (!action || !at) return [];
            return [{
              bookmarkKey: typeof entry.bookmarkKey === "string" ? entry.bookmarkKey : "",
              label: typeof entry.label === "string" ? entry.label : "",
              action,
              recordId: typeof entry.recordId === "string" ? entry.recordId : "",
              title: typeof entry.title === "string" ? entry.title : "",
              detail: typeof entry.detail === "string" ? entry.detail : "",
              at
            }];
          })
          .slice(0, 4)
      : [];
  toolbenchPriorityBookmarkKey =
    typeof saved.priorityBookmarkKey === "string" && saved.priorityBookmarkKey
      ? saved.priorityBookmarkKey
      : "";
  toolbenchPriorityBookmarkPreviousKey =
    typeof saved.priorityBookmarkPreviousKey === "string" && saved.priorityBookmarkPreviousKey
      ? saved.priorityBookmarkPreviousKey
      : "";
  toolbenchPriorityBookmarkChanged = false;
  toolbenchPriorityBookmarkStableCount = Number.isFinite(saved.priorityBookmarkStableCount)
    ? saved.priorityBookmarkStableCount
    : 0;
  toolbenchRouteLinkHintDismissed = Boolean(saved.routeLinkHintDismissed);
  toolbenchRouteLinkHintProgress =
    saved.routeLinkHintProgress && typeof saved.routeLinkHintProgress === "object"
      ? {
          badgeToSummary: Boolean(saved.routeLinkHintProgress.badgeToSummary),
          summaryToBadge: Boolean(saved.routeLinkHintProgress.summaryToBadge)
        }
      : {
          badgeToSummary: false,
          summaryToBadge: false
        };
  toolbenchRouteBadgeHintSoftened = Boolean(saved.routeBadgeHintSoftened);
  toolbenchRouteSummaryHintSoftened = Boolean(saved.routeSummaryHintSoftened);
  toolbenchRouteGuidanceRestoredThisSession = Boolean(saved.routeGuidanceRestoredThisSession);
  toolbenchQueueLensMemoryDismissed = Boolean(saved.queueLensMemoryDismissed);
  toolbenchActiveReviewKey = typeof saved.activeReviewKey === "string" && saved.activeReviewKey.includes("::")
    ? saved.activeReviewKey
    : "";
  toolbenchReviewPassAudit = typeof saved.audit === "object" && saved.audit
    ? {
        type: typeof saved.audit.type === "string" ? saved.audit.type : "",
        at: typeof saved.audit.at === "string" ? saved.audit.at : "",
        source: typeof saved.audit.source === "string" ? saved.audit.source : ""
      }
    : { type: "", at: "", source: "" };
  toolbenchReviewPassSync = typeof saved.sync === "object" && saved.sync
    ? {
        state: typeof saved.sync.state === "string" ? saved.sync.state : "idle",
        at: typeof saved.sync.at === "string" ? saved.sync.at : ""
      }
    : { state: "idle", at: "" };
  toolbenchBackendPreviewOpen = Boolean(saved.backendPreviewOpen);
  toolbenchBackendPreviewFocusTarget = typeof saved.backendPreviewFocusTarget === "string"
    ? saved.backendPreviewFocusTarget
    : "";
  toolbenchBackendPreviewFocusHintDismissed = Boolean(saved.backendPreviewFocusHintDismissed);
  toolbenchReviewedRefreshedSectionsByRecord =
    saved.reviewedRefreshedSectionsByRecord && typeof saved.reviewedRefreshedSectionsByRecord === "object"
      ? Object.fromEntries(
          Object.entries(saved.reviewedRefreshedSectionsByRecord).map(([recordKey, sections]) => [
            normalizeDecisionContextKey(recordKey),
            Array.isArray(sections)
              ? Object.fromEntries(
                  sections
                    .filter((sectionKey) => typeof sectionKey === "string" && sectionKey.trim())
                    .map((sectionKey) => [String(sectionKey).trim().toLowerCase(), true])
                )
              : {}
          ])
        )
      : {};
  toolbenchDecisionOutcomeHistoryByRecord =
    saved.decisionOutcomeHistoryByRecord && typeof saved.decisionOutcomeHistoryByRecord === "object"
      ? Object.fromEntries(
          Object.entries(saved.decisionOutcomeHistoryByRecord).map(([recordKey, value]) => [
            normalizeDecisionContextKey(recordKey),
            {
              from: typeof value?.from === "string" ? value.from : "",
              to: typeof value?.to === "string" ? value.to : "",
              comparison: typeof value?.comparison === "string" ? value.comparison : ""
            }
          ])
        )
      : {};
  toolbenchRoutedReviewOutcomeByRecord =
    saved.routedReviewOutcomeByRecord && typeof saved.routedReviewOutcomeByRecord === "object"
      ? Object.fromEntries(
          Object.entries(saved.routedReviewOutcomeByRecord).map(([recordKey, value]) => [
            normalizeDecisionContextKey(recordKey),
            {
              status: typeof value?.status === "string" ? value.status : "",
              score: Number.isFinite(value?.score) ? value.score : 0,
              at: typeof value?.at === "string" ? value.at : "",
              tempered: Boolean(value?.tempered)
            }
          ])
        )
      : {};
  toolbenchBackendPreviewFocusHint = toolbenchBackendPreviewOpen && !toolbenchBackendPreviewFocusHintDismissed
    ? backendPreviewFocusHintCopy(toolbenchBackendPreviewFocusTarget)
    : "";
  toolbenchQueueLensRestoredOnInit =
    toolbenchQuickPickSortMode !== "default" ||
    toolbenchQuickPickFilter !== "all" ||
    Boolean(toolbenchQuickPickLayerFilter);
  toolbenchQueueLensMemoryRestoredHighlight = toolbenchQueueLensRestoredOnInit;
  toolbenchReviewPassOrigin = toolbenchActiveReviewKey || toolbenchResolvedReviewKeys.size || toolbenchQuickPickLayerFilter || toolbenchQuickPickFilter !== "all"
    ? "session"
    : "local";
}

function currentReviewPassStatePayload() {
  return {
    email: normalizeEmail(toolbenchSession?.email || ""),
    quickPickFilter: toolbenchQuickPickFilter,
    quickPickSortMode: toolbenchQuickPickSortMode,
    quickPickLayerFilter: toolbenchQuickPickLayerFilter,
    quickPickBookmark: toolbenchQuickPickBookmark,
    quickPickBookmarks: toolbenchQuickPickBookmarks,
    quickPickBookmarkLastKey: toolbenchQuickPickBookmarkLastKey,
    quickPickBookmarkOpenCounts: toolbenchQuickPickBookmarkOpenCounts,
    quickPickBookmarkOpenMemoryByKey: toolbenchQuickPickBookmarkOpenMemoryByKey,
    quickPickBookmarkPlanningMemoryByKey: toolbenchQuickPickBookmarkPlanningMemoryByKey,
    quickPickBookmarkRecoveryTargetMemoryByKey: toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey,
    quickPickBookmarkRecoveryChoiceMemoryByKey: toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey,
    quickPickLaneActivity: toolbenchQuickPickLaneActivity,
    priorityBookmarkKey: toolbenchPriorityBookmarkKey,
    priorityBookmarkPreviousKey: toolbenchPriorityBookmarkPreviousKey,
    priorityBookmarkStableCount: toolbenchPriorityBookmarkStableCount,
    routeLinkHintDismissed: toolbenchRouteLinkHintDismissed,
    routeLinkHintProgress: toolbenchRouteLinkHintProgress,
    routeBadgeHintSoftened: toolbenchRouteBadgeHintSoftened,
    routeSummaryHintSoftened: toolbenchRouteSummaryHintSoftened,
    routeGuidanceRestoredThisSession: toolbenchRouteGuidanceRestoredThisSession,
    queueLensMemoryDismissed: toolbenchQueueLensMemoryDismissed,
    resolvedKeys: Array.from(toolbenchResolvedReviewKeys),
    activeReviewKey: toolbenchActiveReviewKey,
    audit: toolbenchReviewPassAudit,
    sync: toolbenchReviewPassSync
  };
}

function currentSessionReviewPassStatePayload() {
  return {
    ...currentReviewPassStatePayload(),
    backendPreviewOpen: toolbenchBackendPreviewOpen,
    backendPreviewFocusTarget: toolbenchBackendPreviewFocusTarget,
    backendPreviewFocusHintDismissed: toolbenchBackendPreviewFocusHintDismissed,
    reviewedRefreshedSectionsByRecord: toolbenchReviewedRefreshedSectionsByRecord,
    decisionOutcomeHistoryByRecord: toolbenchDecisionOutcomeHistoryByRecord,
    routedReviewOutcomeByRecord: toolbenchRoutedReviewOutcomeByRecord
  };
}

function recoveryTargetDemoRequested() {
  return queryParam("demo") === "recovery-target";
}

function setRecoveryTargetDemoMode(enabled = false) {
  const url = new URL(window.location.href);
  if (enabled) {
    if (!recoveryTargetDemoRequested()) {
      writeSessionJson(toolbenchRecoveryTargetDemoBackupKey, {
        reviewPassState: currentSessionReviewPassStatePayload(),
        laneActivity: toolbenchQuickPickLaneActivity,
        recordId: toolbenchRecord?.id || ""
      });
    }
    url.searchParams.set("demo", "recovery-target");
  } else {
    const backup = loadSessionJson(toolbenchRecoveryTargetDemoBackupKey, null);
    if (backup?.reviewPassState && typeof backup.reviewPassState === "object") {
      writeSessionJson(toolbenchV1ReviewPassStateKey, backup.reviewPassState);
      writeSessionJson(
        toolbenchQuickPickLaneActivityKey,
        Array.isArray(backup.laneActivity)
          ? backup.laneActivity
          : Array.isArray(backup.reviewPassState.quickPickLaneActivity)
            ? backup.reviewPassState.quickPickLaneActivity
            : []
      );
    } else {
      clearSessionJson(toolbenchV1ReviewPassStateKey);
      clearSessionJson(toolbenchQuickPickLaneActivityKey);
    }
    clearSessionJson(toolbenchRecoveryTargetDemoBackupKey);
    url.searchParams.delete("demo");
  }
  window.location.href = url.toString();
}

function primeRecoveryTargetDemoState() {
  const now = new Date();
  const nowIso = now.toISOString();
  const planningAt = new Date(now.getTime() - 40 * 60 * 1000).toISOString();
  const attentionLens = {
    filter: "all",
    sort: "attention",
    layerFilter: "",
    snapshot: {
      count: 8,
      weakCount: 2,
      partialCount: 0
    },
    savedAt: nowIso
  };
  toolbenchResolvedReviewKeys = new Set();
  toolbenchActiveReviewKey = "";
  toolbenchQuickPickFilter = "all";
  toolbenchQuickPickSortMode = "attention";
  toolbenchQuickPickLayerFilter = "";
  toolbenchQuickPickBookmark = { ...attentionLens };
  toolbenchQuickPickBookmarks = {
    attention: { ...attentionLens }
  };
  toolbenchQuickPickBookmarkLastKey = "attention";
  toolbenchQuickPickBookmarkOpenCounts = {
    attention: 4
  };
  toolbenchQuickPickBookmarkOpenMemoryByKey = {
    attention: {
      productive: 0,
      pressure: 3
    }
  };
  toolbenchQuickPickBookmarkPlanningMemoryByKey = {
    attention: {
      action: "refresh this lane",
      at: planningAt
    }
  };
  toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey = {
    attention: {
      title: "Novena retail",
      stable: 2,
      fading: 0,
      lastAt: nowIso
    }
  };
  toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey = {
    attention: {
      lead: 4,
      holdingAlternative: 0,
      fadingAlternative: 0
    }
  };
  toolbenchPriorityBookmarkKey = "attention";
  toolbenchPriorityBookmarkPreviousKey = "";
  toolbenchPriorityBookmarkChanged = false;
  toolbenchPriorityBookmarkStableCount = 2;
  toolbenchRouteLinkHintDismissed = false;
  toolbenchRouteLinkHintProgress = {
    badgeToSummary: false,
    summaryToBadge: false
  };
  toolbenchRouteBadgeHintSoftened = false;
  toolbenchRouteSummaryHintSoftened = false;
  toolbenchRouteGuidanceRestoredThisSession = false;
  toolbenchQueueLensMemoryDismissed = false;
  toolbenchQuickPickLaneActivity = [];
  writeSessionJson(toolbenchQuickPickLaneActivityKey, toolbenchQuickPickLaneActivity);
  toolbenchReviewedRefreshedSectionsByRecord = {};
  toolbenchDecisionOutcomeHistoryByRecord = {};
  toolbenchRoutedReviewOutcomeByRecord = {
    "chinatown-shophouse": { status: "next-active", score: 4, at: nowIso, tempered: false },
    "orchard-mall": { status: "tightened", score: 3, at: nowIso, tempered: false },
    "bedok-hdb": { status: "cleared", score: 2, at: nowIso, tempered: false },
    "paya-lebar-retail": { status: "next-active", score: 5, at: nowIso, tempered: false },
    "novena-retail": { status: "next-active", score: 16, at: nowIso, tempered: false },
    "marina-bay-retail": { status: "tempered-next-active", score: 7, at: nowIso, tempered: true },
    "yishun-retail": { status: "tempered-next-active", score: 6, at: nowIso, tempered: true },
    "tiong-bahru-shophouse": { status: "next-active", score: 8, at: nowIso, tempered: false }
  };
  toolbenchReviewPassAudit = {
    type: "demo-seeded",
    at: nowIso,
    source: "query"
  };
  toolbenchReviewPassSync = {
    state: "idle",
    at: nowIso
  };
  toolbenchReviewPassOrigin = "local";
  toolbenchBackendPreviewOpen = false;
  toolbenchBackendPreviewFocusTarget = "";
  toolbenchBackendPreviewFocusHint = "";
  toolbenchBackendPreviewFocusHintDismissed = false;
  toolbenchQueueLensRestoredOnInit = true;
  toolbenchQueueLensMemoryRestoredHighlight = true;
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
}

function resetQueueLensMemoryDismissal() {
  toolbenchQueueLensMemoryDismissed = false;
  toolbenchQueueLensMemoryRestoredHighlight = false;
}

function dismissQueueLensMemory({ render = true } = {}) {
  if (toolbenchQueueLensMemoryDismissed) return;
  toolbenchQueueLensMemoryDismissed = true;
  toolbenchQueueLensMemoryRestoredHighlight = false;
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  if (render) {
    renderV1Roster();
  }
}

function currentQuickPickLensState() {
  return {
    filter: toolbenchQuickPickFilter,
    sort: toolbenchQuickPickSortMode,
    layerFilter: toolbenchQuickPickLayerFilter
  };
}

function quickPickBookmarkKeyForLens(lens = currentQuickPickLensState()) {
  if ((lens?.sort || "default") === "attention") return "attention";
  if ((lens?.sort || "default") === "improving") return "improving";
  return "working";
}

function quickPickBookmarkLabel(key = "") {
  if (key === "attention") return toolbenchReviewPassMessages.workspace.quickPickBookmarkAttention();
  if (key === "improving") return toolbenchReviewPassMessages.workspace.quickPickBookmarkImproving();
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkWorking();
}

function quickPickLaneActivityAgeLabel(value = "") {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 90 * 1000) return "just now";
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function quickPickLaneActivityCopy(entry = null) {
  if (!entry?.action) return "";
  const label = entry.label || quickPickBookmarkLabel(entry.bookmarkKey);
  const age = quickPickLaneActivityAgeLabel(entry.at);
  return `${entry.action}${label ? ` ${label}` : ""}${entry.title ? ` -> ${entry.title}` : ""}${entry.detail ? ` • ${entry.detail}` : ""}${age ? ` • ${age}` : ""}`;
}

function quickPickLaneActivityResumeActionLabel(entry = null) {
  if (!entry?.action) return "Resume lane";
  switch (entry.action) {
    case "Saved":
      return "Resume";
    case "Opened":
    case "Opened priority lane":
      return "Resume";
    case "Refreshed":
      return "Resume";
    case "Followed":
      return "Follow";
    case "Applied plan":
      return "Resume plan for";
    default:
      return "Resume";
  }
}

function quickPickLaneActivityKind(entry = null) {
  if (!entry?.action) return "resume";
  switch (entry.action) {
    case "Followed":
      return "follow";
    case "Applied plan":
      return "plan";
    default:
      return "resume";
  }
}

function quickPickLaneActivityKindToken(entry = null) {
  switch (quickPickLaneActivityKind(entry)) {
    case "follow":
      return "Go";
    case "plan":
      return "Plan";
    default:
      return "Back";
  }
}

function quickPickLaneActivityEntries(entries = []) {
  const grouped = [];
  const groupedByKey = new Map();
  (Array.isArray(entries) ? entries : []).filter(Boolean).forEach((entry, index) => {
    const label = entry.label || quickPickBookmarkLabel(entry.bookmarkKey);
    const groupKey = String(entry.bookmarkKey || label || `lane-${index}`);
    const existing = groupedByKey.get(groupKey);
    if (existing) {
      existing.actionCount += 1;
      if (!existing.bookmarkKey && entry.bookmarkKey) existing.bookmarkKey = entry.bookmarkKey;
      if (!existing.label && label) existing.label = label;
      return;
    }
    const nextGroup = {
      ...entry,
      bookmarkKey: entry.bookmarkKey || "",
      label,
      groupKey,
      actionCount: 1
    };
    groupedByKey.set(groupKey, nextGroup);
    grouped.push(nextGroup);
  });
  return grouped.slice(0, 3);
}

function quickPickLaneActivityGroupCopy(entry = null) {
  if (!entry) return "";
  const label = entry.label || quickPickBookmarkLabel(entry.bookmarkKey);
  if (!label) return quickPickLaneActivityCopy(entry);
  const resumeLabel = quickPickLaneActivityResumeActionLabel(entry);
  const primaryTarget = entry.title ? ` -> ${entry.title}` : "";
  const age = quickPickLaneActivityAgeLabel(entry.at);
  const actionCount = entry.actionCount > 1 ? `${entry.actionCount} recent actions` : "1 recent action";
  return `${resumeLabel} ${label}${primaryTarget} • ${actionCount}${age ? ` • ${age}` : ""}`;
}

function quickPickLaneActivityButtonTitle(entry = null) {
  const groupedCopy = quickPickLaneActivityGroupCopy(entry);
  const rawCopy = quickPickLaneActivityCopy(entry);
  if (!groupedCopy && !rawCopy) return "";
  return `Replay recent lane action: ${groupedCopy || rawCopy}${rawCopy && rawCopy !== groupedCopy ? ` • Last activity: ${rawCopy}` : ""}`;
}

function quickPickLaneActivityDismissTitle(entry = null) {
  const label = entry?.label || quickPickBookmarkLabel(entry?.bookmarkKey || "");
  return label ? `Remove ${label} from recent lane replay.` : "Remove this recent lane replay item.";
}

function renderQuickPickLaneActivityButtons(container, entries = [], { clear = true } = {}) {
  if (!container) return;
  if (clear) container.replaceChildren();
  (Array.isArray(entries) ? entries : []).forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "workspace-v1-roster-recent-actions-item";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "workspace-v1-roster-recent-actions-chip";
    button.dataset.activityIndex = String(index);
    button.dataset.activityKind = quickPickLaneActivityKind(entry);
    button.dataset.activityToken = quickPickLaneActivityKindToken(entry);
    button.textContent = quickPickLaneActivityGroupCopy(entry) || quickPickLaneActivityCopy(entry);
    const buttonTitle = quickPickLaneActivityButtonTitle(entry);
    if (buttonTitle) {
      button.title = buttonTitle;
      button.setAttribute("aria-label", buttonTitle);
    }
    item.append(button);

    const dismissButton = document.createElement("button");
    dismissButton.type = "button";
    dismissButton.className = "workspace-v1-roster-recent-actions-dismiss";
    dismissButton.dataset.activityDismiss = String(index);
    dismissButton.textContent = "x";
    const dismissTitle = quickPickLaneActivityDismissTitle(entry);
    dismissButton.title = dismissTitle;
    dismissButton.setAttribute("aria-label", dismissTitle);
    item.append(dismissButton);

    container.append(item);
  });
}

function quickPickLaneActivityReplayTarget(entry = null) {
  if (!entry) return null;
  if (entry.recordId) {
    const byId = toolbenchRecords.find((record) => record.id === entry.recordId) || null;
    if (byId) return byId;
  }
  if (entry.title) {
    return toolbenchRecords.find((record) => record.title === entry.title) || null;
  }
  return null;
}

function recordQuickPickLaneActivity({
  bookmarkKey = "",
  label = "",
  action = "",
  recordId = "",
  title = "",
  detail = ""
} = {}) {
  const normalizedAction = String(action || "").trim();
  if (!normalizedAction) return;
  const nextEntry = {
    bookmarkKey,
    label: label || quickPickBookmarkLabel(bookmarkKey),
    action: normalizedAction,
    recordId: String(recordId || "").trim(),
    title: String(title || "").trim(),
    detail: String(detail || "").trim(),
    at: new Date().toISOString()
  };
  const previous = toolbenchQuickPickLaneActivity[0] || null;
  const matchesPrevious =
    previous &&
    previous.bookmarkKey === nextEntry.bookmarkKey &&
    previous.label === nextEntry.label &&
    previous.action === nextEntry.action &&
    previous.title === nextEntry.title &&
    previous.detail === nextEntry.detail;
  toolbenchQuickPickLaneActivity = matchesPrevious
    ? [{ ...nextEntry }, ...toolbenchQuickPickLaneActivity.slice(1)]
    : [nextEntry, ...toolbenchQuickPickLaneActivity].slice(0, 8);
  window.clearTimeout(toolbenchQuickPickLaneActivityUndoTimer);
  toolbenchQuickPickLaneActivityUndoTimer = null;
  window.clearInterval(toolbenchQuickPickLaneActivityUndoTickTimer);
  toolbenchQuickPickLaneActivityUndoTickTimer = null;
  toolbenchQuickPickLaneActivityUndo = null;
  writeSessionJson(toolbenchQuickPickLaneActivityKey, toolbenchQuickPickLaneActivity);
}

function scheduleQuickPickLaneActivityUndoExpiry() {
  window.clearTimeout(toolbenchQuickPickLaneActivityUndoTimer);
  toolbenchQuickPickLaneActivityUndoTimer = null;
  window.clearInterval(toolbenchQuickPickLaneActivityUndoTickTimer);
  toolbenchQuickPickLaneActivityUndoTickTimer = null;
  if (!toolbenchQuickPickLaneActivityUndo?.entries?.length) return;
  toolbenchQuickPickLaneActivityUndo.expiresAt = Date.now() + toolbenchQuickPickLaneActivityUndoDuration;
  toolbenchQuickPickLaneActivityUndoTickTimer = window.setInterval(() => {
    if (!toolbenchQuickPickLaneActivityUndo?.entries?.length) {
      window.clearInterval(toolbenchQuickPickLaneActivityUndoTickTimer);
      toolbenchQuickPickLaneActivityUndoTickTimer = null;
      return;
    }
    if (toolbenchEl.v1RosterRecentActionsUndo) {
      toolbenchEl.v1RosterRecentActionsUndo.textContent = quickPickLaneActivityUndoCountdownLabel();
    }
    renderV1Roster();
  }, 1000);
  toolbenchQuickPickLaneActivityUndoTimer = window.setTimeout(() => {
    toolbenchQuickPickLaneActivityUndo = null;
    toolbenchQuickPickLaneActivityUndoTimer = null;
    window.clearInterval(toolbenchQuickPickLaneActivityUndoTickTimer);
    toolbenchQuickPickLaneActivityUndoTickTimer = null;
    renderV1Roster();
  }, toolbenchQuickPickLaneActivityUndoDuration);
}

function quickPickLaneActivityUndoCountdownLabel() {
  const expiresAt = Number(toolbenchQuickPickLaneActivityUndo?.expiresAt || 0);
  if (!expiresAt) return "Undo";
  const remainingMs = Math.max(0, expiresAt - Date.now());
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `Undo (${remainingSeconds}s)`;
}

function rememberQuickPickLaneActivityUndo(entries = []) {
  const snapshot = (Array.isArray(entries) ? entries : []).filter(Boolean).map((entry) => ({ ...entry }));
  toolbenchQuickPickLaneActivityUndo = snapshot.length
    ? {
        entries: snapshot
      }
    : null;
  scheduleQuickPickLaneActivityUndoExpiry();
}

function clearQuickPickLaneActivity({ announce = true } = {}) {
  rememberQuickPickLaneActivityUndo(toolbenchQuickPickLaneActivity);
  toolbenchQuickPickLaneActivity = [];
  writeSessionJson(toolbenchQuickPickLaneActivityKey, toolbenchQuickPickLaneActivity);
  renderV1Roster();
  if (announce) {
    setSearchStatus("Cleared recent lane replay history.", {
      autoClearMs: toolbenchStatusDurations.filter,
      tone: "info"
    });
  }
}

function dismissQuickPickLaneActivity(index = -1) {
  const entries = quickPickLaneActivityEntries(toolbenchQuickPickLaneActivity);
  const entry = Number.isFinite(index) ? entries[index] : null;
  if (!entry) return;
  const groupKey = String(entry.groupKey || entry.bookmarkKey || entry.label || "");
  rememberQuickPickLaneActivityUndo(toolbenchQuickPickLaneActivity);
  toolbenchQuickPickLaneActivity = toolbenchQuickPickLaneActivity.filter((activityEntry, activityIndex) => {
    const label = activityEntry?.label || quickPickBookmarkLabel(activityEntry?.bookmarkKey || "");
    const activityGroupKey = String(activityEntry?.bookmarkKey || label || `lane-${activityIndex}`);
    return activityGroupKey !== groupKey;
  });
  writeSessionJson(toolbenchQuickPickLaneActivityKey, toolbenchQuickPickLaneActivity);
  renderV1Roster();
  const label = entry.label || quickPickBookmarkLabel(entry.bookmarkKey);
  setSearchStatus(label ? `Removed ${label} from recent lane replay.` : "Removed recent lane replay item.", {
    autoClearMs: toolbenchStatusDurations.filter,
    tone: "info"
  });
}

function undoQuickPickLaneActivityChange() {
  if (!toolbenchQuickPickLaneActivityUndo?.entries?.length) return;
  toolbenchQuickPickLaneActivity = toolbenchQuickPickLaneActivityUndo.entries.map((entry) => ({ ...entry }));
  window.clearTimeout(toolbenchQuickPickLaneActivityUndoTimer);
  toolbenchQuickPickLaneActivityUndoTimer = null;
  window.clearInterval(toolbenchQuickPickLaneActivityUndoTickTimer);
  toolbenchQuickPickLaneActivityUndoTickTimer = null;
  toolbenchQuickPickLaneActivityUndo = null;
  writeSessionJson(toolbenchQuickPickLaneActivityKey, toolbenchQuickPickLaneActivity);
  renderV1Roster();
  setSearchStatus("Restored recent lane replay history.", {
    autoClearMs: toolbenchStatusDurations.filter,
    tone: "info"
  });
}

function replayQuickPickLaneActivity(index = -1) {
  const entries = quickPickLaneActivityEntries(toolbenchQuickPickLaneActivity);
  const entry = Number.isFinite(index) ? entries[index] : null;
  if (!entry) return;
  const bookmark = entry.bookmarkKey ? toolbenchQuickPickBookmarks[entry.bookmarkKey] || null : null;
  if (bookmark) {
    openQuickPickBookmark(entry.bookmarkKey, {
      activityAction: entry.action,
      recordActivity: false
    });
  }
  const targetRecord = quickPickLaneActivityReplayTarget(entry);
  if (targetRecord && targetRecord.id !== toolbenchRecord?.id) {
    renderRecord(targetRecord);
    renderQuickPicks();
    renderV1Roster();
  }
  const copy = quickPickLaneActivityCopy(entry);
  if (copy) {
    setSearchStatus(`Replayed recent lane action: ${copy}.`, {
      autoClearMs: toolbenchStatusDurations.filter,
      tone: "info"
    });
  }
}

function quickPickBookmarkSnapshotForLens(lens = currentQuickPickLensState()) {
  const records = quickPickRecordsForLens(lens, { disableRecoveryOrdering: true });
  const summaries = records.map((record) => summarizeV1Health(contextRecordForRecord(record)));
  return {
    count: records.length,
    weakCount: summaries.filter((summary) => summary.state === "weak").length,
    partialCount: summaries.filter((summary) => summary.state === "partial").length
  };
}

function quickPickBookmarkSavedLabel(savedAt = "") {
  if (!savedAt) return "";
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 90 * 1000) return toolbenchReviewPassMessages.workspace.quickPickBookmarkSavedJustNow();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkSavedMinutesAgo({ count: diffMinutes });
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkSavedHoursAgo({ count: diffHours });
  }
  const diffDays = Math.round(diffHours / 24);
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkSavedDaysAgo({ count: diffDays });
}

function quickPickLensMatches(a = null, b = null) {
  if (!a || !b) return false;
  return (a.filter || "all") === (b.filter || "all")
    && (a.sort || "default") === (b.sort || "default")
    && (a.layerFilter || "") === (b.layerFilter || "");
}

function hasNonDefaultQuickPickLens(lens = currentQuickPickLensState()) {
  return (lens?.sort || "default") !== "default"
    || (lens?.filter || "all") !== "all"
    || Boolean(lens?.layerFilter || "");
}

function saveQuickPickBookmark() {
  const lens = currentQuickPickLensState();
  if (!hasNonDefaultQuickPickLens(lens)) return;
  const bookmarkKey = quickPickBookmarkKeyForLens(lens);
  const nextBookmark = { ...lens, snapshot: quickPickBookmarkSnapshotForLens(lens), savedAt: new Date().toISOString() };
  toolbenchQuickPickBookmark = nextBookmark;
  toolbenchQuickPickBookmarks[bookmarkKey] = nextBookmark;
  toolbenchQuickPickBookmarkLastKey = bookmarkKey;
  recordQuickPickLaneActivity({
    bookmarkKey,
    action: "Saved",
    detail: quickPickSortDescription()
  });
  persistV1ReviewPassState();
  renderV1Roster();
  setNamedSearchStatus("bookmarkQueueLensSaved", {
    filter: quickPickFilterDescription(),
    sort: quickPickSortDescription()
  });
}

function markQuickPickBookmarkOpened(bookmarkKey = "", { priority = false } = {}) {
  toolbenchQuickPickBookmarkOpenedKey = bookmarkKey || "";
  toolbenchQuickPickBookmarkPriorityOpenedKey = priority && bookmarkKey ? bookmarkKey : "";
  if (toolbenchQuickPickBookmarkOpenedTimer) {
    clearTimeout(toolbenchQuickPickBookmarkOpenedTimer);
    toolbenchQuickPickBookmarkOpenedTimer = null;
  }
  if (!toolbenchQuickPickBookmarkOpenedKey) {
    renderV1Roster();
    return;
  }
  renderV1Roster();
  toolbenchQuickPickBookmarkOpenedTimer = window.setTimeout(() => {
    toolbenchQuickPickBookmarkOpenedKey = "";
    toolbenchQuickPickBookmarkPriorityOpenedKey = "";
    toolbenchQuickPickBookmarkOpenedTimer = null;
    renderV1Roster();
  }, 2200);
}

function clearQuickPickBookmarkOpenedState({ render = true } = {}) {
  const hadOpenedState =
    Boolean(toolbenchQuickPickBookmarkOpenedKey) ||
    Boolean(toolbenchQuickPickBookmarkPriorityOpenedKey) ||
    Boolean(toolbenchQuickPickBookmarkOpenedTimer);
  toolbenchQuickPickBookmarkOpenedKey = "";
  toolbenchQuickPickBookmarkPriorityOpenedKey = "";
  if (toolbenchQuickPickBookmarkOpenedTimer) {
    clearTimeout(toolbenchQuickPickBookmarkOpenedTimer);
    toolbenchQuickPickBookmarkOpenedTimer = null;
  }
  if (hadOpenedState && render) {
    renderV1Roster();
  }
}

function openQuickPickBookmark(
  bookmarkKey = toolbenchQuickPickBookmarkLastKey || quickPickBookmarkKeyForLens(),
  {
    activityAction = "Opened",
    recordActivity = true
  } = {}
) {
  const ranked = rankedQuickPickBookmarks();
  const topLane = ranked[0] || null;
  const bookmarkLane = ranked.find((lane) => lane.key === bookmarkKey) || null;
  const bookmark = toolbenchQuickPickBookmarks[bookmarkKey] || toolbenchQuickPickBookmark;
  if (!bookmark) return;
  const reopenMomentum = summarizeLaneRoutedReviewMomentum(quickPickRecordsForLens(bookmark));
  const reopenMemoryType = classifyQuickPickBookmarkReopenMemory(reopenMomentum);
  toolbenchQuickPickBookmarkOpenCounts[bookmarkKey] = Math.min(
    9,
    (Number.isFinite(toolbenchQuickPickBookmarkOpenCounts[bookmarkKey]) ? toolbenchQuickPickBookmarkOpenCounts[bookmarkKey] : 0) + 1
  );
  if (reopenMemoryType) {
    const currentMemory = toolbenchQuickPickBookmarkOpenMemoryByKey[bookmarkKey] || { productive: 0, pressure: 0 };
    toolbenchQuickPickBookmarkOpenMemoryByKey[bookmarkKey] = {
      productive: reopenMemoryType === "productive" ? Math.min(currentMemory.productive + 1, 9) : currentMemory.productive,
      pressure: reopenMemoryType === "pressure" ? Math.min(currentMemory.pressure + 1, 9) : currentMemory.pressure
    };
  }
  toolbenchQuickPickBookmarkLastKey = bookmarkKey || toolbenchQuickPickBookmarkLastKey;
  toolbenchQuickPickBookmark = { ...bookmark };
  toolbenchQuickPickFilter = bookmark.filter || "all";
  toolbenchQuickPickSortMode =
    bookmark.sort === "improving" || bookmark.sort === "attention"
      ? bookmark.sort
      : "default";
  toolbenchQuickPickLayerFilter = bookmark.layerFilter || "";
  resetQueueLensMemoryDismissal();
  persistV1ReviewPassState();
  renderQuickPicks();
  const recoveryTarget = bookmarkLane ? recoveryPreferredReopenTarget(bookmarkLane, bookmark) : null;
  const nextRecord = syncRecordToQuickPickFilter({
    force: true,
    preferredRecord: recoveryTarget?.record || null
  });
  if (recordActivity) {
    recordQuickPickLaneActivity({
      bookmarkKey,
      action: activityAction,
      recordId: recoveryTarget?.record?.id || nextRecord?.id || "",
      title: recoveryTarget?.record?.title || nextRecord?.title || "",
      detail: recoveryTargetStatusNote(recoveryTarget)
    });
    persistV1ReviewPassState();
  }
  reinforceRecoveryTargetChoice(bookmarkKey, recoveryTarget);
  if (nextRecord) {
    renderQuickPicks();
  }
  renderV1Roster();
  markQuickPickBookmarkOpened(bookmarkKey, {
    priority: Boolean(topLane && topLane.key === bookmarkKey && quickPickBookmarkPriorityReopenNote(topLane))
  });
  setNamedSearchStatus("bookmarkQueueLensOpened", {
    filter: quickPickFilterDescription(),
    sort: quickPickSortDescription(),
    title: nextRecord?.title || "",
    priorityNote:
      topLane && topLane.key === bookmarkKey
        ? quickPickBookmarkPriorityReopenNote(topLane)
        : "",
    note: recoveryTargetStatusNote(recoveryTarget)
  });
}

function refreshCurrentQuickPickBookmark() {
  const bookmarkKey = toolbenchQuickPickBookmarkLastKey && toolbenchQuickPickBookmarks[toolbenchQuickPickBookmarkLastKey]
    ? toolbenchQuickPickBookmarkLastKey
    : "";
  if (!bookmarkKey) return;
  const lens = currentQuickPickLensState();
  if (!hasNonDefaultQuickPickLens(lens)) return;
  const recoveryTarget = refreshTargetPreviewForLens(bookmarkKey, lens);
  const nextBookmark = { ...lens, snapshot: quickPickBookmarkSnapshotForLens(lens), savedAt: new Date().toISOString() };
  toolbenchQuickPickBookmark = nextBookmark;
  toolbenchQuickPickBookmarks[bookmarkKey] = nextBookmark;
  recordQuickPickLaneActivity({
    bookmarkKey,
    action: "Refreshed",
    recordId: recoveryTarget?.record?.id || "",
    title: recoveryTarget?.record?.title || "",
    detail: recoveryTargetStatusNote(recoveryTarget)
  });
  persistV1ReviewPassState();
  renderV1Roster();
  setNamedSearchStatus("bookmarkQueueLensRefreshed", {
    label: quickPickBookmarkLabel(bookmarkKey),
    note: recoveryTargetStatusNote(recoveryTarget)
  });
}

function openHighestPriorityQuickPickBookmark() {
  const ranked = rankedQuickPickBookmarks();
  const topLane = ranked[0];
  if (!topLane) return;
  const runnerUpLane = ranked[1] || null;
  const routerGap = runnerUpLane ? topLane.score - runnerUpLane.score : Infinity;
  const runnerUpGap = routerGap < 40 ? quickPickPriorityGapLabel(routerGap) : "";
  const runnerUpReason = routerGap < 40 ? quickPickPriorityRunnerUpReason(topLane, runnerUpLane) : "";
  const routeStreakState =
    toolbenchPriorityBookmarkKey === topLane.key
      ? toolbenchPriorityBookmarkStableCount >= 3
        ? "now settled"
        : toolbenchPriorityBookmarkStableCount <= 1
          ? "still provisional"
          : "gaining stability"
      : "still provisional";
  const recoveryTarget = topLane.planningReactivated
    ? recoveryPreferredReopenTarget(topLane, toolbenchQuickPickBookmarks[topLane.key] || null)
    : null;
  openQuickPickBookmark(topLane.key, { activityAction: "Opened priority lane" });
  setNamedSearchStatus("bookmarkQueueLensPriorityOpened", {
    label: quickPickBookmarkLabel(topLane.key),
    reason: [topLane.workType, topLane.reason, routeStreakState, runnerUpGap, runnerUpReason].filter(Boolean).join(" • "),
    priorityNote: quickPickBookmarkPriorityReopenNote(topLane),
    note: recoveryTargetStatusNote(recoveryTarget)
  });
}

function followRecoveryTargetQuickPick() {
  const bookmarkKey = toolbenchQuickPickBookmarkLastKey && toolbenchQuickPickBookmarks[toolbenchQuickPickBookmarkLastKey]
    ? toolbenchQuickPickBookmarkLastKey
    : "";
  const lens = currentQuickPickLensState();
  const staleRecoveryTarget =
    bookmarkKey &&
    hasNonDefaultQuickPickLens(lens) &&
    toolbenchQuickPickBookmarks[bookmarkKey] &&
    !quickPickLensMatches(toolbenchQuickPickBookmarks[bookmarkKey], lens)
      ? refreshTargetPreviewForLens(bookmarkKey, lens)
      : null;
  if (staleRecoveryTarget?.record) {
    refreshCurrentQuickPickBookmark();
    clearQuickPickBookmarkOpenedState({ render: false });
    dismissBackendPreviewNotice();
    if (staleRecoveryTarget.record.id !== toolbenchRecord?.id) {
      renderRecord(staleRecoveryTarget.record);
    }
    reinforceRecoveryTargetChoice(bookmarkKey, staleRecoveryTarget);
    recordQuickPickLaneActivity({
      bookmarkKey,
      action: "Followed",
      recordId: staleRecoveryTarget.record.id,
      title: staleRecoveryTarget.record.title,
      detail: recoveryTargetStatusNote(staleRecoveryTarget)
    });
    persistV1ReviewPassState();
    renderQuickPicks();
    renderV1Roster();
    setNamedSearchStatus("followRecoveryTarget", {
      label: quickPickBookmarkLabel(bookmarkKey),
      title: staleRecoveryTarget.record.title,
      note: recoveryTargetStatusNote(staleRecoveryTarget)
    });
    return;
  }
  const topLane = rankedQuickPickBookmarks()[0] || null;
  const laneLens = topLane?.key ? toolbenchQuickPickBookmarks[topLane.key] || null : null;
  const recoveryTarget = laneLens ? recoveryPreferredReopenTarget(topLane, laneLens) : null;
  if (!topLane || !laneLens || !recoveryTarget?.record) return;
  const laneMatchesCurrent = quickPickLensMatches(laneLens, currentQuickPickLensState());
  if (!laneMatchesCurrent) {
    openQuickPickBookmark(topLane.key, { recordActivity: false });
  } else {
    clearQuickPickBookmarkOpenedState({ render: false });
    dismissBackendPreviewNotice();
    if (recoveryTarget.record.id !== toolbenchRecord?.id) {
      renderRecord(recoveryTarget.record);
    }
    renderQuickPicks();
    renderV1Roster();
    markQuickPickBookmarkOpened(topLane.key, {
      priority: Boolean(quickPickBookmarkPriorityReopenNote(topLane))
    });
  }
  reinforceRecoveryTargetChoice(topLane.key, recoveryTarget);
  recordQuickPickLaneActivity({
    bookmarkKey: topLane.key,
    action: "Followed",
    recordId: recoveryTarget.record.id,
    title: recoveryTarget.record.title,
    detail: recoveryTargetStatusNote(recoveryTarget)
  });
  persistV1ReviewPassState();
  setNamedSearchStatus("followRecoveryTarget", {
    label: quickPickBookmarkLabel(topLane.key),
    title: recoveryTarget.record.title,
    note: recoveryTargetStatusNote(recoveryTarget)
  });
}

function closeOutQuickPickBookmark(bookmarkKey = "") {
  if (!bookmarkKey || !toolbenchQuickPickBookmarks[bookmarkKey]) return false;
  const closingBookmark = toolbenchQuickPickBookmarks[bookmarkKey];
  delete toolbenchQuickPickBookmarks[bookmarkKey];
  delete toolbenchQuickPickBookmarkOpenCounts[bookmarkKey];
  delete toolbenchQuickPickBookmarkOpenMemoryByKey[bookmarkKey];
  delete toolbenchQuickPickBookmarkPlanningMemoryByKey[bookmarkKey];
  delete toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey[bookmarkKey];
  delete toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[bookmarkKey];
  if (toolbenchQuickPickBookmarkLastKey === bookmarkKey) {
    toolbenchQuickPickBookmarkLastKey = Object.keys(toolbenchQuickPickBookmarks)[0] || "";
  }
  if (toolbenchQuickPickBookmarkOpenedKey === bookmarkKey) {
    toolbenchQuickPickBookmarkOpenedKey = "";
  }
  if (toolbenchQuickPickBookmarkPriorityOpenedKey === bookmarkKey) {
    toolbenchQuickPickBookmarkPriorityOpenedKey = "";
  }
  if (toolbenchPriorityBookmarkKey === bookmarkKey) {
    toolbenchPriorityBookmarkKey = "";
  }
  if (toolbenchPriorityBookmarkPreviousKey === bookmarkKey) {
    toolbenchPriorityBookmarkPreviousKey = "";
  }
  if (quickPickLensMatches(closingBookmark, toolbenchQuickPickBookmark)) {
    toolbenchQuickPickBookmark = null;
  }
  return true;
}

function markQuickPickBookmarkPlanResult(bookmarkKey = "", action = "", { reason = "" } = {}) {
  const resultCopy = toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningResult({ action, reason });
  if (!resultCopy) return;
  if (bookmarkKey && action) {
    toolbenchQuickPickBookmarkPlanningMemoryByKey[bookmarkKey] = {
      action,
      at: new Date().toISOString()
    };
  }
  toolbenchQuickPickBookmarkPlanResultKey = bookmarkKey || "";
  toolbenchQuickPickBookmarkPlanResultCopy = resultCopy;
  toolbenchQuickPickBookmarkPlanResultSummaryCopy = resultCopy;
  if (toolbenchQuickPickBookmarkPlanResultTimer) {
    window.clearTimeout(toolbenchQuickPickBookmarkPlanResultTimer);
    toolbenchQuickPickBookmarkPlanResultTimer = null;
  }
  renderV1Roster();
  toolbenchQuickPickBookmarkPlanResultTimer = window.setTimeout(() => {
    toolbenchQuickPickBookmarkPlanResultKey = "";
    toolbenchQuickPickBookmarkPlanResultCopy = "";
    toolbenchQuickPickBookmarkPlanResultSummaryCopy = "";
    toolbenchQuickPickBookmarkPlanResultTimer = null;
    renderV1Roster();
  }, 2200);
}

function markQuickPickBookmarkPlanRelease(bookmarkKey = "", { render = true } = {}) {
  const releaseCopy = toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningReleased();
  if (!bookmarkKey || !releaseCopy) return;
  toolbenchQuickPickBookmarkPlanReleaseKey = bookmarkKey;
  toolbenchQuickPickBookmarkPlanReleaseCopy = releaseCopy;
  toolbenchQuickPickBookmarkPlanReleaseSummaryCopy = releaseCopy;
  if (toolbenchQuickPickBookmarkPlanReleaseTimer) {
    window.clearTimeout(toolbenchQuickPickBookmarkPlanReleaseTimer);
    toolbenchQuickPickBookmarkPlanReleaseTimer = null;
  }
  if (render) renderV1Roster();
  toolbenchQuickPickBookmarkPlanReleaseTimer = window.setTimeout(() => {
    toolbenchQuickPickBookmarkPlanReleaseKey = "";
    toolbenchQuickPickBookmarkPlanReleaseCopy = "";
    toolbenchQuickPickBookmarkPlanReleaseSummaryCopy = "";
    toolbenchQuickPickBookmarkPlanReleaseTimer = null;
    renderV1Roster();
  }, 2200);
}

function pruneExpiredQuickPickBookmarkPlanningMemory() {
  const keys = Object.keys(toolbenchQuickPickBookmarkPlanningMemoryByKey);
  if (!keys.length) return;
  const now = Date.now();
  let changed = false;
  let releasedKey = "";
  keys.forEach((key) => {
    const value = toolbenchQuickPickBookmarkPlanningMemoryByKey[key];
    const at = value?.at ? new Date(value.at) : null;
    const lens = toolbenchQuickPickBookmarks[key] || null;
    const momentum = lens ? summarizeLaneRoutedReviewMomentum(quickPickRecordsForLens(lens)) : null;
    const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
    if (!(at instanceof Date) || Number.isNaN(at.getTime())) return;
    if (now - at.getTime() < cooldownMs) return;
    delete toolbenchQuickPickBookmarkPlanningMemoryByKey[key];
    changed = true;
    releasedKey = releasedKey || key;
  });
  if (!changed) return;
  markQuickPickBookmarkPlanRelease(releasedKey, { render: false });
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
}

function applyPriorityLanePlanningAction() {
  const topLane = rankedQuickPickBookmarks()[0] || null;
  if (!topLane || !topLane.planningAction) return;
  const action = topLane.planningAction;
  const label = quickPickBookmarkLabel(topLane.key);
  const laneLens = toolbenchQuickPickBookmarks[topLane.key] || null;
  const recoveryTarget = laneLens ? recoveryPreferredReopenTarget(topLane, laneLens) : null;
  const temperedPlanningReason = quickPickBookmarkPlanningTemperedReason(action, topLane.momentum);
  const reactivatedPlanningReason = topLane.planningReactivated ? "reactivated by recovery" : "";
  const recoveryTargetActionabilityReason = topLane.recoveryTargetActionability || "";
  const laneRecovering = quickPickBookmarkPlanningCooldownStage(topLane.planningMemory || null, topLane.momentum || null) === "late";
  const recovering = laneRecovering
    ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()
    : "";
  const recoveryTargetReason =
    recoveryTarget?.record?.title
      ? `targeting ${recoveryTarget.record.title}`
      : "";
  const recoveryTargetSelectionReason = recoveryTarget?.selectionReason || "";
  const recoveryTargetPreference = recoveryTarget?.preference || "";
  const planReason = [
    temperedPlanningReason,
    reactivatedPlanningReason,
    recoveryTargetActionabilityReason,
    recoveryTargetReason,
    recoveryTargetSelectionReason,
    recoveryTargetPreference
  ].filter(Boolean).join(" • ");
  const detail = [topLane.workType, topLane.reason, recovering, planReason].filter(Boolean).join(" • ");
  if (action === "refresh this lane") {
    if (toolbenchQuickPickBookmarkLastKey !== topLane.key) {
      openQuickPickBookmark(topLane.key, { recordActivity: false });
    }
    refreshCurrentQuickPickBookmark();
    const nextRecord = syncRecordToQuickPickFilter({
      force: true,
      preferredRecord: recoveryTarget?.record || null
    });
    reinforceRecoveryTargetChoice(topLane.key, recoveryTarget);
    if (nextRecord) {
      renderQuickPicks();
      renderV1Roster();
    }
    recordQuickPickLaneActivity({
      bookmarkKey: topLane.key,
      label,
      action: "Applied plan",
      recordId: recoveryTarget?.record?.id || nextRecord?.id || "",
      title: recoveryTarget?.record?.title || nextRecord?.title || "",
      detail: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action })
    });
    persistV1ReviewPassState();
    markQuickPickBookmarkPlanResult(topLane.key, action, { reason: planReason });
    setNamedSearchStatus("bookmarkQueueLanePlanApplied", {
      actionLabel: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action }),
      label,
      detail
    });
    return;
  }
  if (action === "close out this lane") {
    const wasCurrent = quickPickLensMatches(toolbenchQuickPickBookmarks[topLane.key], currentQuickPickLensState());
    markQuickPickBookmarkPlanResult(topLane.key, action, { reason: planReason });
    if (!closeOutQuickPickBookmark(topLane.key)) return;
    recordQuickPickLaneActivity({
      bookmarkKey: topLane.key,
      label,
      action: "Applied plan",
      detail: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action })
    });
    if (wasCurrent) {
      resetQuickPickQueueLens();
    } else {
      persistV1ReviewPassState();
      renderQuickPicks();
      renderV1Roster();
    }
    setNamedSearchStatus("bookmarkQueueLanePlanApplied", {
      actionLabel: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action }),
      label,
      detail
    });
    return;
  }
  if (action === "deprioritize lane") {
    resetQuickPickQueueLens();
    markQuickPickBookmarkPlanResult(topLane.key, action, { reason: planReason });
    recordQuickPickLaneActivity({
      bookmarkKey: topLane.key,
      label,
      action: "Applied plan",
      detail: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action })
    });
    persistV1ReviewPassState();
    setNamedSearchStatus("bookmarkQueueLanePlanApplied", {
      actionLabel: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action }),
      label,
      detail
    });
    return;
  }
  openQuickPickBookmark(topLane.key, { recordActivity: false });
  recordQuickPickLaneActivity({
    bookmarkKey: topLane.key,
    label,
    action: "Applied plan",
    detail: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action })
  });
  persistV1ReviewPassState();
  markQuickPickBookmarkPlanResult(topLane.key, action, { reason: planReason });
  setNamedSearchStatus("bookmarkQueueLanePlanApplied", {
    actionLabel: toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({ action }),
    label,
    detail
  });
}

function markRouteLinkHintInteraction(direction = "") {
  if (direction === "badgeToSummary") {
    toolbenchRouteLinkHintProgress.badgeToSummary = true;
  } else if (direction === "summaryToBadge") {
    toolbenchRouteLinkHintProgress.summaryToBadge = true;
  } else {
    return;
  }
  if (
    !toolbenchRouteLinkHintDismissed &&
    toolbenchRouteLinkHintProgress.badgeToSummary &&
    toolbenchRouteLinkHintProgress.summaryToBadge
  ) {
    toolbenchRouteLinkHintDismissed = true;
    toolbenchRouteLinkHintLearnedVisible = true;
    if (toolbenchRouteLinkHintLearnedTimer) {
      window.clearTimeout(toolbenchRouteLinkHintLearnedTimer);
      toolbenchRouteLinkHintLearnedTimer = null;
    }
    toolbenchRouteLinkHintLearnedTimer = window.setTimeout(() => {
      toolbenchRouteLinkHintLearnedVisible = false;
      toolbenchRouteLinkHintLearnedTimer = null;
      renderV1Roster();
    }, 2200);
    renderV1Roster();
  }
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
}

function routeLinkHintCopy() {
  if (toolbenchRouteLinkHintRestoredVisible) {
    return "Route tips restored. The highest-priority summary and route badge are linked again with full guidance.";
  }
  if (toolbenchRouteLinkHintLearnedVisible) {
    return "Route tips learned. The highest-priority summary and route badge now stay linked without the helper hint.";
  }
  if (toolbenchRouteLinkHintDismissed) return "";
  if (toolbenchRouteLinkHintProgress.badgeToSummary && !toolbenchRouteLinkHintProgress.summaryToBadge) {
    return "Route tips: the highest-priority summary and route badge are linked. Click the highest-priority summary to return to the route badge.";
  }
  if (toolbenchRouteLinkHintProgress.summaryToBadge && !toolbenchRouteLinkHintProgress.badgeToSummary) {
    return "Route tips: the highest-priority summary and route badge are linked. Click the route badge to return to the highest-priority summary.";
  }
  return "Route tips: the highest-priority summary and route badge are linked. Click either one to focus the other.";
}

function routeBadgeHintCopy({ state = "", label = "", count = 0, runnerUp = "", gap = "" } = {}) {
  if (toolbenchRouteBadgeHintSoftened) {
    return `Highest-priority route for ${label || "this lane"} is ${state || "active"}${count > 0 ? ` after holding for ${count} turn${count === 1 ? "" : "s"}` : ""}.`;
  }
  return toolbenchReviewPassMessages.workspace.quickPickPriorityRouteBadgeHint({
    state,
    label,
    count,
    runnerUp,
    gap
  });
}

function routeSummaryHintCopy({ label = "", runnerUp = "", reason = "", gap = "", state = "" } = {}) {
  if (toolbenchRouteSummaryHintSoftened) {
    return `Highest-priority lane ${label}${state ? ` is ${state}` : ""}.`;
  }
  return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryHint({
    label,
    runnerUp,
    reason,
    gap,
    state
  });
}

function currentRouteGuidanceMode() {
  const trainingActive = !toolbenchRouteLinkHintDismissed || !toolbenchRouteBadgeHintSoftened || !toolbenchRouteSummaryHintSoftened;
  if (!trainingActive) return "steady";
  if (toolbenchRouteGuidanceRestoredThisSession) return "restored";
  return "first-time";
}

function routeGuidanceModeLabel(mode = currentRouteGuidanceMode()) {
  if (mode === "restored") return "Route tips are in restored learning mode for this session.";
  if (mode === "steady") return "Route tips are in steady working mode for this session.";
  return "Route tips are in first-time learning mode for this session.";
}

function routeGuidanceSummaryLabel(mode = currentRouteGuidanceMode()) {
  if (toolbenchPriorityBookmarkStableCount >= 2) return "";
  if (mode === "restored") return "restored learning";
  if (mode === "first-time") return "first-time learning";
  return "";
}

function routeGuidanceResetLabel(mode = currentRouteGuidanceMode()) {
  if (mode === "steady") {
    return "Reset route tips. Route tips are in steady working mode for this session.";
  }
  return routeGuidanceModeLabel(mode);
}

function resetRouteGuidanceTips({ render = true } = {}) {
  toolbenchRouteLinkHintDismissed = false;
  toolbenchRouteLinkHintProgress = {
    badgeToSummary: false,
    summaryToBadge: false
  };
  toolbenchRouteGuidanceRestoredThisSession = true;
  toolbenchRouteLinkHintRestoredVisible = true;
  toolbenchRouteLinkHintLearnedVisible = false;
  if (toolbenchRouteLinkHintLearnedTimer) {
    window.clearTimeout(toolbenchRouteLinkHintLearnedTimer);
    toolbenchRouteLinkHintLearnedTimer = null;
  }
  if (toolbenchRouteLinkHintRestoredTimer) {
    window.clearTimeout(toolbenchRouteLinkHintRestoredTimer);
    toolbenchRouteLinkHintRestoredTimer = null;
  }
  toolbenchRouteLinkHintRestoredTimer = window.setTimeout(() => {
    toolbenchRouteLinkHintRestoredVisible = false;
    toolbenchRouteLinkHintRestoredTimer = null;
    renderV1Roster();
  }, 2200);
  toolbenchRouteBadgeHintSoftened = false;
  toolbenchRouteSummaryHintSoftened = false;
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  if (render) {
    renderV1Roster();
  }
}

function highlightHighestPrioritySummary({ focus = false } = {}) {
  if (!toolbenchEl.v1RosterPrioritySummary || toolbenchEl.v1RosterPrioritySummary.hidden) return;
  if (toolbenchPrioritySummaryHighlightTimer) {
    window.clearTimeout(toolbenchPrioritySummaryHighlightTimer);
    toolbenchPrioritySummaryHighlightTimer = null;
  }
  toolbenchEl.v1RosterPrioritySummary.dataset.highlighted = "true";
  if (focus) {
    toolbenchEl.v1RosterPrioritySummary.setAttribute("tabindex", "-1");
    toolbenchEl.v1RosterPrioritySummary.scrollIntoView({ block: "nearest", behavior: "smooth" });
    toolbenchEl.v1RosterPrioritySummary.focus({ preventScroll: true });
  }
  toolbenchPrioritySummaryHighlightTimer = window.setTimeout(() => {
    if (toolbenchEl.v1RosterPrioritySummary) {
      delete toolbenchEl.v1RosterPrioritySummary.dataset.highlighted;
    }
    toolbenchPrioritySummaryHighlightTimer = null;
  }, 1800);
}

function focusHighestPrioritySummary() {
  if (!toolbenchEl.v1RosterPrioritySummary || toolbenchEl.v1RosterPrioritySummary.hidden) return;
  markRouteLinkHintInteraction("badgeToSummary");
  if (!toolbenchRouteBadgeHintSoftened) {
    toolbenchRouteBadgeHintSoftened = true;
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  highlightHighestPrioritySummary({ focus: true });
}

function focusHighestPriorityRouteBadge() {
  if (!toolbenchEl.v1RosterRouteBadge || toolbenchEl.v1RosterRouteBadge.hidden) return;
  markRouteLinkHintInteraction("summaryToBadge");
  if (!toolbenchRouteSummaryHintSoftened) {
    toolbenchRouteSummaryHintSoftened = true;
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  if (toolbenchPriorityRouteBadgeHighlightTimer) {
    window.clearTimeout(toolbenchPriorityRouteBadgeHighlightTimer);
    toolbenchPriorityRouteBadgeHighlightTimer = null;
  }
  toolbenchEl.v1RosterRouteBadge.dataset.highlighted = "true";
  toolbenchEl.v1RosterRouteBadge.scrollIntoView({ block: "nearest", behavior: "smooth" });
  toolbenchEl.v1RosterRouteBadge.focus({ preventScroll: true });
  toolbenchPriorityRouteBadgeHighlightTimer = window.setTimeout(() => {
    if (toolbenchEl.v1RosterRouteBadge) {
      delete toolbenchEl.v1RosterRouteBadge.dataset.highlighted;
    }
    toolbenchPriorityRouteBadgeHighlightTimer = null;
  }, 1800);
}

function setBackendPreviewFocusTarget(target = "") {
  toolbenchBackendPreviewFocusTarget = target || "";
}

function dismissBackendPreviewFocusHint({ persist = true, render = true } = {}) {
  if (!toolbenchBackendPreviewFocusHint && toolbenchBackendPreviewFocusHintDismissed) return;
  toolbenchBackendPreviewFocusHint = "";
  toolbenchBackendPreviewFocusHintDismissed = true;
  if (persist) {
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  if (render) {
    renderV1Roster();
  } else if (toolbenchEl.v1RosterBackendFocusHint) {
    toolbenchEl.v1RosterBackendFocusHint.textContent = "";
    toolbenchEl.v1RosterBackendFocusHint.hidden = true;
  }
}

function backendPreviewFocusHintCopy(target = "") {
  return toolbenchBackendPreviewMessages.focusHint[target] || toolbenchBackendPreviewMessages.focusHint.default || "";
}

function focusBackendPreviewTarget() {
  if (!toolbenchBackendPreviewOpen || !toolbenchBackendPreviewFocusTarget) return;
  const targetMap = {
    badge: toolbenchEl.v1RosterBackend,
    restoreJump: toolbenchEl.v1RosterRestoreJump,
    restore: toolbenchEl.v1RosterRestore,
    clear: toolbenchEl.v1RosterClear
  };
  const el = targetMap[toolbenchBackendPreviewFocusTarget];
  if (!el || el.hidden || el.disabled) return;
  window.requestAnimationFrame(() => {
    if (!document.body.contains(el)) return;
    el.focus({ preventScroll: true });
  });
}

function applyReviewPassStatePayload(saved = {}) {
  toolbenchResolvedReviewKeys = new Set(
    Array.isArray(saved.resolvedKeys)
      ? saved.resolvedKeys.filter((key) => typeof key === "string" && key.includes("::"))
      : []
  );
  toolbenchQuickPickFilter = typeof saved.quickPickFilter === "string" && saved.quickPickFilter
    ? saved.quickPickFilter
    : "all";
  toolbenchQuickPickLayerFilter = typeof saved.quickPickLayerFilter === "string"
    ? saved.quickPickLayerFilter
    : "";
  toolbenchActiveReviewKey = typeof saved.activeReviewKey === "string" && saved.activeReviewKey.includes("::")
    ? saved.activeReviewKey
    : "";
  toolbenchReviewPassAudit = typeof saved.audit === "object" && saved.audit
    ? {
        type: typeof saved.audit.type === "string" ? saved.audit.type : "",
        at: typeof saved.audit.at === "string" ? saved.audit.at : "",
        source: typeof saved.audit.source === "string" ? saved.audit.source : ""
      }
    : { type: "", at: "", source: "" };
  toolbenchReviewPassSync = typeof saved.sync === "object" && saved.sync
    ? {
        state: typeof saved.sync.state === "string" ? saved.sync.state : "idle",
        at: typeof saved.sync.at === "string" ? saved.sync.at : ""
      }
    : { state: "idle", at: "" };
}

async function loadBackendV1ReviewPassState() {
  if (window.location.protocol === "file:" || !normalizeEmail(toolbenchSession?.email) || toolbenchSession?.access === "free") return null;
  try {
    const response = await fetch("../../api/members/toolbench/review-pass", { cache: "no-store", credentials: "same-origin" });
    if (response.status === 401) return null;
    if (!response.ok) throw new Error(`Review pass request failed: ${response.status}`);
    const payload = await response.json();
    if (payload?.reviewPass && typeof payload.reviewPass === "object") {
      updateBackendReviewPassMeta(payload.reviewPass);
      toolbenchReviewPassOrigin = "backend";
      toolbenchReviewPassSync = {
        state: "saved",
        at: typeof payload.reviewPass.updatedAt === "string" ? payload.reviewPass.updatedAt : toolbenchReviewPassSync.at || ""
      };
      return payload.reviewPass;
    }
    updateBackendReviewPassMeta(null);
    return null;
  } catch (error) {
    console.warn("Could not load backend V1 review pass state.", error);
    return null;
  }
}

async function saveBackendV1ReviewPassState() {
  if (window.location.protocol === "file:" || !normalizeEmail(toolbenchSession?.email) || toolbenchSession?.access === "free") return null;
  const payload = currentReviewPassStatePayload();
  try {
    const response = await fetch("../../api/members/toolbench/review-pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload)
    });
    if (response.status === 401) return null;
    if (!response.ok) throw new Error(`Review pass save failed: ${response.status}`);
    const result = await response.json();
    updateBackendReviewPassMeta(result?.reviewPass || null);
    toolbenchReviewPassSync = {
      state: "saved",
      at: typeof result?.reviewPass?.updatedAt === "string" ? result.reviewPass.updatedAt : new Date().toISOString()
    };
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
    renderV1Roster();
    renderV1Health(contextRecordForRecord(toolbenchRecord));
    return result?.reviewPass || null;
  } catch (error) {
    toolbenchReviewPassSync = {
      state: "error",
      at: toolbenchReviewPassSync.at || ""
    };
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
    renderV1Roster();
    renderV1Health(contextRecordForRecord(toolbenchRecord));
    console.warn("Could not save backend V1 review pass state.", error);
    return null;
  }
}

function scheduleBackendV1ReviewPassPersist() {
  if (window.location.protocol === "file:" || !normalizeEmail(toolbenchSession?.email) || toolbenchSession?.access === "free") return;
  window.clearTimeout(toolbenchReviewPassPersistTimer);
  toolbenchReviewPassPersistTimer = window.setTimeout(() => {
    saveBackendV1ReviewPassState();
  }, 250);
}

function canUseBackendReviewPass() {
  return !(window.location.protocol === "file:" || !normalizeEmail(toolbenchSession?.email) || toolbenchSession?.access === "free");
}

function hasLocalReviewPassState() {
  return Boolean(
    toolbenchActiveReviewKey ||
    toolbenchResolvedReviewKeys.size ||
    toolbenchQuickPickLayerFilter ||
    toolbenchQuickPickFilter !== "all"
  );
}

async function restoreBackendReviewPassScope({ jumpToActive = false } = {}) {
  if (!canUseBackendReviewPass()) {
    setNamedSearchStatus("backendRestoreUnavailable");
    return;
  }
  const backendReviewPassState = await loadBackendV1ReviewPassState();
  if (!backendReviewPassState) {
    renderV1Roster();
    renderV1Health(contextRecordForRecord(toolbenchRecord));
    setNamedSearchStatus("backendRestoreMissing");
    return;
  }
  applyReviewPassStatePayload(backendReviewPassState);
  toolbenchReviewPassOrigin = "backend";
  toolbenchReviewPassAudit = {
    type: "restored",
    at: new Date().toISOString(),
    source: "backend"
  };
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  renderQuickPicks();
  closeBackendReviewPassPreview(
    jumpToActive
      ? "restoreJump"
      : "restoreScope"
  );
  if (jumpToActive) {
    const restoredItem = activeReviewItemFromState();
    if (restoredItem) {
      if (restoredItem.record.id !== toolbenchRecord?.id) renderRecord(restoredItem.record);
      jumpToV1HealthLabel(restoredItem.label);
      renderV1Roster();
      setNamedSearchStatus("restoreBackendJump", {
        title: restoredItem.record.title,
        label: restoredItem.label
      });
      return restoredItem.record;
    }
  }
  const currentId = toolbenchRecord?.id || "";
  const nextRecord = syncRecordToQuickPickFilter();
  if (!nextRecord || nextRecord.id === currentId) {
    renderV1Health(contextRecordForRecord(toolbenchRecord));
  }
  renderV1Roster();
  setNamedSearchStatus("restoreBackendLoaded", {
    title: nextRecord?.title || ""
  });
}

function clearLocalReviewPassScope() {
  toolbenchResolvedReviewKeys = new Set();
  toolbenchActiveReviewKey = "";
  toolbenchQuickPickFilter = "all";
  toolbenchQuickPickLayerFilter = "";
  closeBackendReviewPassPreview("clearLocal");
  toolbenchReviewPassAudit = {
    type: "cleared",
    at: new Date().toISOString(),
    source: window.location.protocol === "file:" || toolbenchSession?.access === "free" ? "local" : "session"
  };
  toolbenchReviewPassOrigin = "local";
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  renderQuickPicks();
  const currentId = toolbenchRecord?.id || "";
  const nextRecord = syncRecordToQuickPickFilter({ force: true });
  if (!nextRecord || nextRecord.id === currentId) {
    renderV1Health(contextRecordForRecord(toolbenchRecord));
  }
  renderV1Roster();
  setNamedSearchStatus("clearLocalPass");
}

function enrichToolbenchOneMapRecords(records) {
  return window.RentIntelOneMapAdapter?.enrichRecords
    ? window.RentIntelOneMapAdapter.enrichRecords(records, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : records;
}

function enrichToolbenchOneMapRecord(record) {
  return window.RentIntelOneMapAdapter?.enrichRecord
    ? window.RentIntelOneMapAdapter.enrichRecord(record, window.RENTINTEL_ONEMAP_ENRICHMENT)
    : record;
}

async function loadToolbenchAskingFeed() {
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("../../api/sources/asking-feed", { cache: "no-store" });
      if (!response.ok) throw new Error(`Asking feed request failed: ${response.status}`);
      const payload = await response.json();
      if (Array.isArray(payload.feed?.records)) return payload.feed;
    } catch (error) {
      console.warn("RentIntel toolbench feed API load failed; checking local preview mirror.", error);
    }
  }
  return window.RENTINTEL_ASKING_RENT_FEED || { records: [] };
}

async function loadDecisionContextRecords() {
  if (window.RentIntelContextApi?.listContextRecords) {
    try {
      return await window.RentIntelContextApi.listContextRecords();
    } catch (error) {
      console.warn("RentIntelContextApi listContextRecords failed; checking sample bundle fallback.", error);
    }
  }
  try {
    const response = await fetch("../../data/sources/rent-decision-context-sample.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Decision context request failed: ${response.status}`);
    const payload = await response.json();
    return Array.isArray(payload?.records) ? payload.records : [];
  } catch (error) {
    console.warn("RentIntel decision context sample could not be loaded.", error);
    return [];
  }
}

function mergeAskingRentFeed(records) {
  const feed = currentAskingFeed();
  if (window.RentIntelAskingFeedAdapter?.mergeRecords) {
    const merged = window.RentIntelAskingFeedAdapter.mergeRecords(records, feed, {
      sampleUpdatedAt: window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
    });
    toolbenchFeedState = merged.feed;
    return merged.records;
  }
  const feedRecords = Array.isArray(feed?.records) ? feed.records : [];
  toolbenchFeedState = feed;
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

function coveragePrototypeRecords() {
  return loadStoredJson(coverageRecordsKey, []).filter((record) =>
    record?.id && record?.title && Array.isArray(record?.aliases) && !isInvalidCoverageRecord(record)
  );
}

function coverageEligibilityProfile(value = "") {
  const text = String(value).toLowerCase();
  if (/\bpulau\s+tekong\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (/\bpulau\s+ubin\b|\bst\s*john'?s?\b|\blazarus\b|\bkusu\b|\bsemakau\b|\bsisters'? island\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (text.includes("farm") && text.includes("hdb retail")) {
    return { status: "blocked", eligible: false };
  }
  if (/\b(orchard|raffles place|marina bay|sentosa|airport|changi airport|cbd)\b/.test(text) && /\bhdb\b/.test(text)) {
    return { status: "blocked", eligible: false };
  }
  if (/\b(industrial|warehouse|factory|office|logistics|medical|school|camp|army|military|farm)\b/.test(text)) {
    return { status: "manual", eligible: false };
  }
  return { status: "eligible", eligible: true };
}

function isInvalidCoverageText(value = "") {
  return coverageEligibilityProfile(value).status === "blocked";
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

function sanitizeCoverageRecords() {
  const records = loadStoredJson(coverageRecordsKey, []);
  const cleanRecords = records.filter((record) => !isInvalidCoverageRecord(record));
  if (cleanRecords.length !== records.length) writeStoredJson(coverageRecordsKey, cleanRecords);
}

function mergeCoverageRecords(records) {
  const merged = new Map();
  records.forEach((record) => merged.set(record.id, record));
  coveragePrototypeRecords().forEach((record) => merged.set(record.id, record));
  return [...merged.values()];
}

function money(value) {
  return `S$${Number(value).toFixed(2)} psf`;
}

function dollars(value) {
  return `S$${Math.round(Number(value)).toLocaleString("en-SG")}`;
}

function moneyRange(range) {
  if (!range) return toolbenchReviewPassMessages.workspace.moneyRangeUnavailable();
  return `${money(range.low)}-${money(range.high)}`;
}

function formatShortDate(value) {
  if (!value) return toolbenchReviewPassMessages.workspace.dateNotConnected();
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

function formatShortDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function reviewPassAuditCopy() {
  if (!toolbenchReviewPassAudit?.type || !toolbenchReviewPassAudit?.at) {
    return toolbenchReviewPassMessages.audit.empty();
  }
  const sourceLabel = toolbenchReviewPassAudit.source === "backend"
    ? "backend"
    : toolbenchReviewPassAudit.source === "local"
      ? "local"
      : "browser session";
  const at = formatShortDateTime(toolbenchReviewPassAudit.at);
  if (toolbenchReviewPassAudit.type === "restored") {
    return toolbenchReviewPassMessages.audit.restored({ sourceLabel, at });
  }
  if (toolbenchReviewPassAudit.type === "cleared") {
    return toolbenchReviewPassMessages.audit.cleared({ sourceLabel, at });
  }
  return toolbenchReviewPassMessages.audit.generic({ at });
}

function reviewPassSyncCopy() {
  if (!canUseBackendReviewPass()) {
    return toolbenchReviewPassMessages.sync.inactive();
  }
  if (toolbenchReviewPassSync.state === "saved" && toolbenchReviewPassSync.at) {
    return toolbenchReviewPassMessages.sync.saved({
      at: formatShortDateTime(toolbenchReviewPassSync.at)
    });
  }
  if (toolbenchReviewPassSync.state === "pending") {
    return toolbenchReviewPassSync.at
      ? toolbenchReviewPassMessages.sync.pendingWithLast({
          at: formatShortDateTime(toolbenchReviewPassSync.at)
        })
      : toolbenchReviewPassMessages.sync.pending();
  }
  if (toolbenchReviewPassSync.state === "error") {
    return toolbenchReviewPassSync.at
      ? toolbenchReviewPassMessages.sync.errorWithLast({
          at: formatShortDateTime(toolbenchReviewPassSync.at)
        })
      : toolbenchReviewPassMessages.sync.error();
  }
  return toolbenchReviewPassSync.at
    ? toolbenchReviewPassMessages.sync.saved({
        at: formatShortDateTime(toolbenchReviewPassSync.at)
      })
    : toolbenchReviewPassMessages.sync.none();
}

function updateBackendReviewPassMeta(reviewPass = null) {
  if (!reviewPass || typeof reviewPass !== "object") {
    toolbenchBackendReviewPassMeta = {
      available: false,
      resolvedCount: 0,
      quickPickFilter: "all",
      quickPickLayerFilter: "",
      activeReviewKey: "",
      updatedAt: ""
    };
    toolbenchBackendPreviewOpen = false;
    return;
  }
  const resolvedCount = Array.isArray(reviewPass.resolvedKeys) ? reviewPass.resolvedKeys.length : 0;
  const quickPickFilter =
    typeof reviewPass.quickPickFilter === "string" && reviewPass.quickPickFilter ? reviewPass.quickPickFilter : "all";
  const quickPickLayerFilter =
    typeof reviewPass.quickPickLayerFilter === "string" ? reviewPass.quickPickLayerFilter : "";
  const activeReviewKey = typeof reviewPass.activeReviewKey === "string" ? reviewPass.activeReviewKey : "";
  const hasMeaningfulScope =
    resolvedCount > 0 ||
    Boolean(activeReviewKey) ||
    quickPickFilter !== "all" ||
    Boolean(quickPickLayerFilter);
  if (!hasMeaningfulScope) {
    toolbenchBackendReviewPassMeta = {
      available: false,
      resolvedCount: 0,
      quickPickFilter: "all",
      quickPickLayerFilter: "",
      activeReviewKey: "",
      updatedAt: ""
    };
    toolbenchBackendPreviewOpen = false;
    return;
  }
  toolbenchBackendReviewPassMeta = {
    available: true,
    resolvedCount,
    quickPickFilter,
    quickPickLayerFilter,
    activeReviewKey,
    updatedAt: typeof reviewPass.updatedAt === "string" ? reviewPass.updatedAt : ""
  };
}

function backendReviewPassBadgeCopy() {
  if (!canUseBackendReviewPass()) {
    if (hasLocalReviewPassState()) {
      const localScope = toolbenchQuickPickFilter !== "all" || toolbenchQuickPickLayerFilter
        ? quickPickFilterDescription()
        : "";
      return toolbenchBackendPreviewMessages.badge.localActive({ scope: localScope });
    }
    return toolbenchBackendPreviewMessages.badge.localOnly();
  }
  if (!toolbenchBackendReviewPassMeta.available) {
    return toolbenchBackendPreviewMessages.badge.backendMissing();
  }
  const scopeBits = [];
  if (toolbenchBackendReviewPassMeta.quickPickFilter && toolbenchBackendReviewPassMeta.quickPickFilter !== "all") {
    scopeBits.push(toolbenchBackendReviewPassMeta.quickPickFilter);
  }
  if (toolbenchBackendReviewPassMeta.quickPickLayerFilter) {
    scopeBits.push(toolbenchBackendReviewPassMeta.quickPickLayerFilter);
  }
  const scopeLabel = scopeBits.length
    ? toolbenchReviewPassMessages.workspace.backendScopeLabel({
        scope: scopeBits.join(" • ")
      })
    : toolbenchReviewPassMessages.workspace.backendScopeAll();
  const resolvedLabel = `${toolbenchBackendReviewPassMeta.resolvedCount} resolved`;
  const syncedLabel = toolbenchBackendReviewPassMeta.updatedAt
    ? `Synced ${formatShortDateTime(toolbenchBackendReviewPassMeta.updatedAt)}`
    : toolbenchReviewPassMessages.workspace.backendSyncTimePending();
  return toolbenchBackendPreviewMessages.badge.backendAvailable({
    resolvedLabel,
    scopeLabel,
    syncedLabel
  });
}

function backendReviewPassScopeCopy() {
  const scopeBits = [];
  if (toolbenchBackendReviewPassMeta.quickPickFilter && toolbenchBackendReviewPassMeta.quickPickFilter !== "all") {
    scopeBits.push(toolbenchBackendReviewPassMeta.quickPickFilter);
  }
  if (toolbenchBackendReviewPassMeta.quickPickLayerFilter) {
    scopeBits.push(toolbenchBackendReviewPassMeta.quickPickLayerFilter);
  }
  return toolbenchBackendPreviewMessages.panel.scope({
    scope: scopeBits.length ? scopeBits.join(" • ") : "all"
  });
}

function currentReviewPassScopeCopy() {
  return toolbenchBackendPreviewMessages.panel.currentScope({
    scope: quickPickFilterDescription()
  });
}

function backendReviewPassCompareCopy() {
  if (!toolbenchBackendReviewPassMeta.available) {
    return toolbenchBackendPreviewMessages.panel.compareMissing();
  }
  const sameFilter = (toolbenchBackendReviewPassMeta.quickPickFilter || "all") === toolbenchQuickPickFilter;
  const sameLayer = (toolbenchBackendReviewPassMeta.quickPickLayerFilter || "") === toolbenchQuickPickLayerFilter;
  if (sameFilter && sameLayer) {
    return toolbenchBackendPreviewMessages.panel.compareMatch();
  }
  const differences = [];
  if (!sameFilter) {
    differences.push(`filter differs (${toolbenchBackendReviewPassMeta.quickPickFilter || "all"} vs ${toolbenchQuickPickFilter || "all"})`);
  }
  if (!sameLayer) {
    differences.push(`layer differs (${toolbenchBackendReviewPassMeta.quickPickLayerFilter || "none"} vs ${toolbenchQuickPickLayerFilter || "none"})`);
  }
  return toolbenchBackendPreviewMessages.panel.compareDifferent({
    differences: differences.join(" • ")
  });
}

function backendReviewPassItemCopy() {
  if (!toolbenchBackendReviewPassMeta.available || !toolbenchBackendReviewPassMeta.activeReviewKey) {
    return toolbenchBackendPreviewMessages.panel.activeItemMissing();
  }
  const [recordId = "", label = ""] = String(toolbenchBackendReviewPassMeta.activeReviewKey).split("::");
  const record = toolbenchRecords.find((item) => item.id === recordId);
  const recordLabel = record?.title || recordId || "unknown record";
  return toolbenchBackendPreviewMessages.panel.activeItem({
    recordLabel,
    label
  });
}

function backendReviewPassItemStatusMeta() {
  if (!toolbenchBackendReviewPassMeta.available || !toolbenchBackendReviewPassMeta.activeReviewKey) {
    return {
      state: "missing",
      text: toolbenchBackendPreviewMessages.panel.itemStatusMissing()
    };
  }
  const [recordId = "", label = ""] = String(toolbenchBackendReviewPassMeta.activeReviewKey).split("::");
  const record = toolbenchRecords.find((item) => item.id === recordId);
  if (!record || !label) {
    return {
      state: "unmatched",
      text: toolbenchBackendPreviewMessages.panel.itemStatusUnmatched()
    };
  }
  const summary = summarizeV1Health(contextRecordForRecord(record));
  const matchingCheck = (summary.checks || []).find((check) => check.label === label);
  if (!matchingCheck) {
    return {
      state: "untracked",
      text: toolbenchBackendPreviewMessages.panel.itemStatusUntracked()
    };
  }
  return matchingCheck.ok
    ? {
        state: "resolved",
        text: toolbenchBackendPreviewMessages.panel.itemStatusResolved({ label })
      }
    : {
        state: "unresolved",
        text: toolbenchBackendPreviewMessages.panel.itemStatusUnresolved({ label })
      };
}

function backendReviewPassItemStatusCopy() {
  return backendReviewPassItemStatusMeta().text;
}

function backendReviewPassBadgeResumeHint() {
  if (!canUseBackendReviewPass()) {
    switch (toolbenchBackendPreviewFocusTarget) {
      case "restoreJump":
        return toolbenchBackendPreviewMessages.resumeHint.localRestoreJump();
      case "restore":
        return toolbenchBackendPreviewMessages.resumeHint.localRestore();
      case "clear":
        return toolbenchBackendPreviewMessages.resumeHint.localClear();
      default:
        return toolbenchBackendPreviewMessages.resumeHint.localDefault({
          workspaceUrl: toolbenchHttpWorkspaceUrl
        });
    }
  }
  if (!toolbenchBackendReviewPassMeta.available) return "";
  switch (toolbenchBackendPreviewFocusTarget) {
    case "restoreJump":
      return toolbenchBackendPreviewMessages.resumeHint.backendRestoreJump({
        label: backendReviewPassRestoreJumpLabel()
      });
    case "restore":
      return toolbenchBackendPreviewMessages.resumeHint.backendRestore();
    case "clear":
      return toolbenchBackendPreviewMessages.resumeHint.backendClear();
    default:
      return toolbenchBackendPreviewMessages.resumeHint.default();
  }
}

function backendReviewPassRestoreJumpLabel() {
  const status = backendReviewPassItemStatusMeta().state;
  switch (status) {
    case "unresolved":
      return toolbenchBackendPreviewMessages.action.restoreJumpUnresolved();
    case "resolved":
      return toolbenchBackendPreviewMessages.action.restoreJumpResolved();
    case "unmatched":
    case "untracked":
      return toolbenchBackendPreviewMessages.action.restoreJumpUnmatched();
    default:
      return toolbenchBackendPreviewMessages.action.restoreJumpDefault();
  }
}

function clearBackendPreviewNoticeTimer() {
  if (!toolbenchBackendPreviewNoticeTimer) return;
  window.clearTimeout(toolbenchBackendPreviewNoticeTimer);
  toolbenchBackendPreviewNoticeTimer = null;
}

function dismissBackendPreviewNotice({ render = false } = {}) {
  clearBackendPreviewNoticeTimer();
  if (!toolbenchBackendPreviewNotice) return;
  toolbenchBackendPreviewNotice = "";
  toolbenchBackendPreviewNoticeState = "hidden";
  toolbenchBackendPreviewNoticeTone = "neutral";
  if (render) renderV1Roster();
}

function backendPreviewNoticeMeta(reasonKey = "") {
  return toolbenchBackendPreviewCloseReasons[reasonKey] || { message: "", tone: "neutral" };
}

function setBackendPreviewNotice(reasonKey = "", { autoClearMs = 4400, fadeMs = 420 } = {}) {
  clearBackendPreviewNoticeTimer();
  const noticeMeta = backendPreviewNoticeMeta(reasonKey);
  toolbenchBackendPreviewNotice = noticeMeta.message || "";
  toolbenchBackendPreviewNoticeState = toolbenchBackendPreviewNotice ? "visible" : "hidden";
  toolbenchBackendPreviewNoticeTone = noticeMeta.tone || "neutral";
  if (toolbenchBackendPreviewNotice && autoClearMs > 0) {
    const activeNotice = toolbenchBackendPreviewNotice;
    toolbenchBackendPreviewNoticeTimer = window.setTimeout(() => {
      if (toolbenchBackendPreviewNotice !== activeNotice) return;
      toolbenchBackendPreviewNoticeState = "fading";
      renderV1Roster();
      toolbenchBackendPreviewNoticeTimer = window.setTimeout(() => {
        if (toolbenchBackendPreviewNotice !== activeNotice) return;
        toolbenchBackendPreviewNotice = "";
        toolbenchBackendPreviewNoticeState = "hidden";
        toolbenchBackendPreviewNoticeTone = "neutral";
        toolbenchBackendPreviewNoticeTimer = null;
        renderV1Roster();
      }, fadeMs);
    }, autoClearMs);
  }
}

function closeBackendReviewPassPreview(reasonKey = "") {
  toolbenchBackendPreviewOpen = false;
  setBackendPreviewFocusTarget("badge");
  toolbenchBackendPreviewFocusHint = "";
  toolbenchBackendPreviewFocusHintDismissed = false;
  setBackendPreviewNotice(reasonKey);
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  renderV1Roster();
}

function toggleBackendReviewPassPreview(force = null) {
  const nextState = typeof force === "boolean" ? force : !toolbenchBackendPreviewOpen;
  toolbenchBackendPreviewOpen = Boolean(nextState && toolbenchBackendReviewPassMeta.available && canUseBackendReviewPass());
  if (toolbenchBackendPreviewOpen) {
    dismissBackendPreviewNotice();
    if (!toolbenchBackendPreviewFocusTarget || toolbenchBackendPreviewFocusTarget === "badge") {
      setBackendPreviewFocusTarget(toolbenchBackendReviewPassMeta.activeReviewKey ? "restoreJump" : "restore");
    }
    if (!toolbenchBackendPreviewFocusHintDismissed) {
      toolbenchBackendPreviewFocusHint = backendPreviewFocusHintCopy(toolbenchBackendPreviewFocusTarget);
    }
  } else {
    setBackendPreviewFocusTarget("badge");
    toolbenchBackendPreviewFocusHint = "";
    toolbenchBackendPreviewFocusHintDismissed = false;
  }
  writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  renderV1Roster();
}

function freshnessPolicy() {
  const stored = loadStoredJson(freshnessPolicyKey, {}) || {};
  const freshMaxDays = Math.max(1, Math.min(60, Number(stored.freshMaxDays) || 7));
  const watchCandidate = Math.max(freshMaxDays + 1, Number(stored.watchMaxDays) || 14);
  const watchMaxDays = Math.max(freshMaxDays + 1, Math.min(90, watchCandidate));
  return {
    freshMaxDays,
    watchMaxDays
  };
}

function sourceFreshnessProfile(value) {
  const policy = freshnessPolicy();
  const freshMaxDays = Number(policy.freshMaxDays);
  const watchMaxDays = Number(policy.watchMaxDays);
  const watchLower = freshMaxDays + 1;
  if (!value) {
    return {
      state: "stale",
      days: null,
      freshMaxDays,
      watchMaxDays,
      label: toolbenchReviewPassMessages.workspace.freshnessLabelStale(),
      detail: toolbenchReviewPassMessages.workspace.freshnessDetailMissingCapture()
    };
  }
  const date = String(value).includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      state: "stale",
      days: null,
      freshMaxDays,
      watchMaxDays,
      label: toolbenchReviewPassMessages.workspace.freshnessLabelStale(),
      detail: toolbenchReviewPassMessages.workspace.freshnessDetailInvalidCapture()
    };
  }
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days <= freshMaxDays) {
    return {
      state: "fresh",
      days,
      freshMaxDays,
      watchMaxDays,
      label: toolbenchReviewPassMessages.workspace.freshnessLabelFresh(),
      detail: toolbenchReviewPassMessages.workspace.freshnessDetailFresh({
        days,
        maxDays: freshMaxDays
      })
    };
  }
  if (days <= watchMaxDays) {
    return {
      state: "watch",
      days,
      freshMaxDays,
      watchMaxDays,
      label: toolbenchReviewPassMessages.workspace.freshnessLabelWatch(),
      detail: toolbenchReviewPassMessages.workspace.freshnessDetailWatch({
        days,
        watchLower,
        watchMaxDays
      })
    };
  }
  return {
    state: "stale",
    days,
    freshMaxDays,
    watchMaxDays,
    label: toolbenchReviewPassMessages.workspace.freshnessLabelStale(),
    detail: toolbenchReviewPassMessages.workspace.freshnessDetailStale({
      days,
      watchMaxDays
    })
  };
}

function sourceQaProfile(record) {
  const feed = currentAskingFeed();
  const source = record?.askingSource;
  if (!source) {
    return {
      status: toolbenchReviewPassMessages.workspace.sourceQaComparableStatus(),
      checks: "0",
      captured: toolbenchReviewPassMessages.workspace.sourceQaCapturedMissing(),
      freshnessState: "stale",
      freshnessLabel: toolbenchReviewPassMessages.workspace.freshnessLabelStale(),
      freshnessDetail: toolbenchReviewPassMessages.workspace.freshnessDetailMissingCapture(),
      production: toolbenchReviewPassMessages.workspace.sourceQaProductionNotReady(),
      ready: false,
      warning: toolbenchReviewPassMessages.workspace.sourceQaWarningComparable()
    };
  }
  const freshness = sourceFreshnessProfile(source.capturedAt || feed.updatedAt || "");
  const productionReady = Boolean(source.productionReady);
  const status = source.sourceType === "verified-manual-capture"
    ? toolbenchReviewPassMessages.workspace.sourceQaStatusPilotManual()
    : source.sourceName || toolbenchReviewPassMessages.workspace.sourceQaStatusDefault();
  return {
    status,
    checks: `${source.listingCount || 0}`,
    captured: formatShortDate(source.capturedAt || feed.updatedAt || ""),
    freshnessState: freshness.state,
    freshnessLabel: freshness.label,
    freshnessDetail: freshness.detail,
    production: productionReady
      ? toolbenchReviewPassMessages.workspace.sourceQaProductionReady()
      : toolbenchReviewPassMessages.workspace.sourceQaProductionNotReady(),
    ready: productionReady,
    warning: productionReady
      ? `${freshness.detail} Asking-rent source is production-ready; still verify unit-specific lease terms, GST, service charge, and permitted use.`
      : `${freshness.detail} Pilot manual asking feed is connected, but production still needs licensed feed or a verified daily capture workflow with QA logs. Target sync is daily, but actual freshness depends on the latest completed capture.`
  };
}

function sourceTimestampLabel(status, value) {
  if (value) return formatShortDate(value);
  if (status?.lastCompletedAt) return formatShortDate(status.lastCompletedAt);
  return status?.timestampLabel || toolbenchReviewPassMessages.workspace.sourceTimestampNotLive();
}

function sourceRefreshRows(record) {
  const statusMap = new Map((currentSourceStatus().status || []).map((item) => [item.sourceId, item]));
  const feed = currentAskingFeed();
  const askingStatus = statusMap.get("asking-rent-feed") || {};
  const askingCapturedAt = record?.askingSource?.capturedAt || askingStatus.lastCompletedAt || feed.updatedAt || "";
  const askingFreshness = sourceFreshnessProfile(askingCapturedAt);
  const buildRow = (sourceId, options = {}) => {
    const status = statusMap.get(sourceId) || {};
    return {
      id: sourceId,
      label: status.label || options.label || sourceId,
      timestamp: sourceTimestampLabel(status, options.timestamp || ""),
      target: status.refreshTarget || options.target || toolbenchReviewPassMessages.workspace.sourceRefreshTargetFallback(),
      workflow: status.weeklyReviewStep || options.workflow || toolbenchReviewPassMessages.workspace.sourceRefreshWorkflowFallback(),
      state: options.state || "watch"
    };
  };
  return [
    buildRow("asking-rent-feed", {
      state: askingFreshness.state,
      timestamp: askingCapturedAt
    }),
    buildRow("ura-commercial-retail-rental-analysis", {
      state: "watch"
    }),
    buildRow("hdb-commercial-data", {
      state: "watch"
    }),
    buildRow("onemap-geospatial", {
      state: "watch"
    }),
    buildRow("rentintel-member-data", {
      state: "watch"
    })
  ];
}

function renderSourceRefreshRows(record) {
  if (!toolbenchEl.sourceQaSources) return;
  const rows = sourceRefreshRows(record);
  toolbenchEl.sourceQaSources.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("li");
    item.dataset.state = row.state;
    const label = document.createElement("span");
    label.textContent = row.label;
    const timestamp = document.createElement("strong");
    timestamp.textContent = row.timestamp;
    const detail = document.createElement("em");
    detail.textContent = `Target: ${row.target}. ${row.workflow}`;
    item.append(label, timestamp, detail);
    toolbenchEl.sourceQaSources.append(item);
  });
}

const toolbenchComparableProfiles = [
  { area: "Ang Mo Kio", aliases: ["ang mo kio", "amk"], official: 8.8, asking: 11.5, cluster: "mature heartland" },
  { area: "Bedok", aliases: ["bedok", "bedok central"], official: 8.6, asking: 11.1, cluster: "mature heartland" },
  { area: "Bishan", aliases: ["bishan", "junction 8"], official: 9.6, asking: 12.8, cluster: "mature heartland" },
  { area: "Boon Lay", aliases: ["boon lay", "jurong west"], official: 7.8, asking: 9.9, cluster: "heartland" },
  { area: "Bukit Batok", aliases: ["bukit batok", "bt batok"], official: 7.9, asking: 10.2, cluster: "heartland" },
  { area: "Bukit Merah", aliases: ["bukit merah", "redhill", "tiong bahru"], official: 10.2, asking: 13.6, cluster: "city fringe" },
  { area: "Bukit Panjang", aliases: ["bukit panjang", "bt panjang"], official: 7.6, asking: 9.7, cluster: "heartland" },
  { area: "Bukit Timah", aliases: ["bukit timah", "sixth avenue", "beauty world"], official: 12.4, asking: 15.7, cluster: "prime fringe" },
  { area: "Bugis", aliases: ["bugis", "arab street", "kampong glam", "bras basah"], official: 14.2, asking: 18.4, cluster: "city fringe" },
  { area: "Choa Chu Kang", aliases: ["choa chu kang", "cck"], official: 7.3, asking: 9.3, cluster: "heartland" },
  { area: "City Hall", aliases: ["city hall", "raffles city", "stamford"], official: 18.6, asking: 22.7, cluster: "cbd" },
  { area: "Clementi", aliases: ["clementi", "clementi central"], official: 8.7, asking: 11.4, cluster: "mature heartland" },
  { area: "Geylang", aliases: ["geylang", "aljunied", "paya lebar fringe"], official: 11.6, asking: 15.1, cluster: "city fringe" },
  { area: "HarbourFront", aliases: ["harbourfront", "vivocity", "telok blangah"], official: 20.2, asking: 23.1, cluster: "destination mall" },
  { area: "Hougang", aliases: ["hougang", "kovan"], official: 8.4, asking: 10.8, cluster: "heartland" },
  { area: "Joo Chiat", aliases: ["joo chiat", "katong", "east coast shophouse"], official: 12.2, asking: 15.9, cluster: "shophouse fringe" },
  { area: "Kallang", aliases: ["kallang", "lavender", "boon keng"], official: 10.7, asking: 13.7, cluster: "city fringe" },
  { area: "Little India", aliases: ["little india", "farrer park", "serangoon road"], official: 12.8, asking: 16.6, cluster: "city fringe" },
  { area: "Marine Parade", aliases: ["marine parade", "parkway", "east coast"], official: 11.2, asking: 14.2, cluster: "mature heartland" },
  { area: "Novena", aliases: ["novena", "balestier", "thomson"], official: 13.5, asking: 16.8, cluster: "city fringe" },
  { area: "Outram", aliases: ["outram", "keong saik", "neil road", "tanjong pagar shophouse"], official: 13.4, asking: 17.4, cluster: "shophouse fringe" },
  { area: "Pasir Ris", aliases: ["pasir ris", "white sands"], official: 7.4, asking: 9.7, cluster: "heartland" },
  { area: "Punggol", aliases: ["punggol", "waterway point"], official: 7.7, asking: 10.4, cluster: "new town" },
  { area: "Queenstown", aliases: ["queenstown", "commonwealth", "holland village"], official: 10.4, asking: 13.4, cluster: "city fringe" },
  { area: "Raffles Place", aliases: ["raffles place", "cbd", "cecil street", "tanjong pagar"], official: 19.4, asking: 23.8, cluster: "cbd" },
  { area: "River Valley", aliases: ["river valley", "robertson quay", "clarke quay"], official: 13.8, asking: 17.6, cluster: "prime fringe" },
  { area: "Sengkang", aliases: ["sengkang", "compassvale", "compass one"], official: 7.8, asking: 10.2, cluster: "new town" },
  { area: "Sembawang", aliases: ["sembawang"], official: 7.2, asking: 9.1, cluster: "heartland" },
  { area: "Toa Payoh", aliases: ["toa payoh", "tp hdb hub", "hdb hub"], official: 9.3, asking: 12.1, cluster: "mature heartland" },
  { area: "Woodlands", aliases: ["woodlands", "causeway point"], official: 7.7, asking: 10.1, cluster: "heartland" },
  { area: "Yishun", aliases: ["yishun", "northpoint"], official: 7.8, asking: 10.2, cluster: "heartland" }
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferToolbenchPropertyType(query, profile) {
  if (/\b(shop\s*house|shophouse|conservation)\b/.test(query)) {
    return { label: "Shophouse retail", modifier: 1.28, actionNoun: "frontage and approved use" };
  }
  if (/\b(mall|shopping|plaza|centre|center|point|junction)\b/.test(query)) {
    return { label: "Shopping centre retail", modifier: profile.cluster.includes("mall") ? 1.05 : 1.18, actionNoun: "mall traffic and floor position" };
  }
  if (/\b(hdb|heartland|coffee\s*shop|coffeeshop|void deck|neighbourhood|neighborhood)\b/.test(query)) {
    return { label: "HDB retail", modifier: 1, actionNoun: "frontage, permitted use, and observed footfall" };
  }
  return { label: profile.cluster.includes("cbd") ? "CBD retail" : "Neighbourhood retail", modifier: profile.cluster.includes("cbd") ? 1.18 : 1.04, actionNoun: "frontage, permitted use, and footfall" };
}

function toolbenchComparableSeries(official, asking) {
  const labels = ["2021 Q1", "2021 Q3", "2022 Q1", "2022 Q3", "2023 Q1", "2023 Q3", "2024 Q1", "2024 Q3", "2025 Q1", "2025 Q3"];
  const officialCurve = [0.78, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1, 1.02];
  const askingCurve = [0.72, 0.75, 0.79, 0.84, 0.89, 0.93, 0.97, 1, 1, 1.03];
  return labels.map((label, index) => [
    label,
    Number((official * officialCurve[index]).toFixed(1)),
    Number((asking * askingCurve[index]).toFixed(1))
  ]);
}

function createToolbenchComparableRecord(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!coverageEligibilityProfile(normalized).eligible) return null;
  const profile = toolbenchComparableProfiles
    .map((item) => ({
      profile: item,
      match: item.aliases
        .map((alias) => alias.toLowerCase())
        .filter((alias) => normalized.includes(alias))
        .sort((a, b) => b.length - a.length)[0]
    }))
    .filter((item) => item.match)
    .sort((a, b) => b.match.length - a.match.length)[0]?.profile;
  if (!profile) return null;

  const inferredType = inferToolbenchPropertyType(normalized, profile);
  const official = Number((profile.official * inferredType.modifier).toFixed(1));
  const asking = Number((profile.asking * inferredType.modifier).toFixed(1));
  const gap = Math.round(((asking - official) / official) * 100);
  const high = Number(Math.max(official * 1.18, official + 1.2).toFixed(1));
  const low = Number((official * 0.95).toFixed(1));
  const titleType = inferredType.label === "HDB retail" ? inferredType.label : inferredType.label.toLowerCase();
  const title = `${profile.area} ${titleType}`;

  return enrichToolbenchOneMapRecord({
    id: `estimate-${slugify(profile.area)}-${slugify(inferredType.label)}`,
    aliases: [...profile.aliases, `${profile.area.toLowerCase()} ${inferredType.label.toLowerCase()}`],
    title,
    propertyType: inferredType.label,
    area: profile.area,
    confidence: toolbenchReviewPassMessages.workspace.comparableConfidence(),
    decision: gap >= 22
      ? toolbenchReviewPassMessages.workspace.comparableDecisionHigh()
      : toolbenchReviewPassMessages.workspace.comparableDecisionReview(),
    reason: toolbenchReviewPassMessages.workspace.comparableReason({
      area: profile.area,
      cluster: profile.cluster
    }),
    official,
    asking,
    gap,
    daily: toolbenchReviewPassMessages.workspace.comparableDaily({
      title,
      asking: money(asking),
      gap,
      official: money(official)
    }),
    series: toolbenchComparableSeries(official, asking),
    fairRange: { low, high },
    actionLabel: gap >= 22
      ? toolbenchReviewPassMessages.workspace.comparableActionPushBack()
      : gap >= 10
        ? toolbenchReviewPassMessages.workspace.comparableActionValidate()
        : toolbenchReviewPassMessages.workspace.comparableActionFairRange(),
    action: toolbenchReviewPassMessages.workspace.comparableActionCopy({
      actionLabel: gap >= 22
        ? toolbenchReviewPassMessages.workspace.comparableActionPushBack()
        : toolbenchReviewPassMessages.workspace.comparableActionValidate(),
      fairHigh: money(high),
      actionNoun: inferredType.actionNoun
    }),
    sourceSummary: toolbenchReviewPassMessages.workspace.comparableSourceSummary(),
    mobileSummary: gap >= 22
      ? toolbenchReviewPassMessages.workspace.comparableMobileHigh({ area: profile.area })
      : toolbenchReviewPassMessages.workspace.comparableMobileValidate({ area: profile.area })
  });
}

function hasToolbenchAccess() {
  return true;
}

function ensureToolbenchSession() {
  if (toolbenchSession?.email) return toolbenchSession;
  toolbenchSession = {
    email: "free@rent-intel.com",
    memberStatus: toolbenchReviewPassMessages.workspace.accessMemberStatus(),
    subscriptionStatus: toolbenchReviewPassMessages.workspace.accessSubscriptionStatus(),
    access: "free",
    toolsEnabled: false,
    signedInAt: new Date().toISOString()
  };
  return toolbenchSession;
}

function toolbenchAccessState() {
  ensureToolbenchSession();
  if (toolbenchSession.access === "free") {
    return {
      key: "free",
      label: toolbenchReviewPassMessages.workspace.accessFreeLabel(),
      title: toolbenchReviewPassMessages.workspace.accessFreeTitle(),
      copy: toolbenchReviewPassMessages.workspace.accessFreeCopy(),
      chart: toolbenchReviewPassMessages.workspace.accessChart()
    };
  }
  if (toolbenchSession.access === "promo") {
    return {
      key: "promo",
      label: toolbenchReviewPassMessages.workspace.accessPromoLabel(),
      title: toolbenchReviewPassMessages.workspace.accessPromoTitle(),
      copy: toolbenchReviewPassMessages.workspace.accessPromoCopy({
        email: toolbenchSession.email
      }),
      chart: toolbenchReviewPassMessages.workspace.accessPromoChart()
    };
  }
  if (hasToolbenchAccess()) {
    return {
      key: "active",
      label: toolbenchReviewPassMessages.workspace.accessActiveLabel(),
      title: toolbenchReviewPassMessages.workspace.accessActiveTitle(),
      copy: toolbenchReviewPassMessages.workspace.accessActiveCopy({
        email: toolbenchSession.email
      }),
      chart: toolbenchReviewPassMessages.workspace.accessChart()
    };
  }
  return {
    key: "free",
    label: toolbenchReviewPassMessages.workspace.accessFreeLabel(),
    title: toolbenchReviewPassMessages.workspace.accessFreeTitle(),
    copy: toolbenchReviewPassMessages.workspace.accessFallbackCopy({
      email: toolbenchSession.email
    }),
    chart: toolbenchReviewPassMessages.workspace.accessChart()
  };
}

function signalDrivers(record) {
  if (Array.isArray(record?.drivers) && record.drivers.length) return record.drivers;
  const property = String(record?.propertyType || "").toLowerCase();
  const area = String(record?.area || "").toLowerCase();
  if (area.includes("chinatown") || property.includes("shophouse")) {
    return [
      toolbenchReviewPassMessages.workspace.driversShophouseTourism(),
      toolbenchReviewPassMessages.workspace.driversShophouseSupply(),
      toolbenchReviewPassMessages.workspace.driversShophouseApprovals(),
      toolbenchReviewPassMessages.workspace.driversShophouseMomentum()
    ];
  }
  if (area.includes("orchard") || property.includes("mall")) {
    return [
      toolbenchReviewPassMessages.workspace.driversMallFrontage(),
      toolbenchReviewPassMessages.workspace.driversMallDispersion(),
      toolbenchReviewPassMessages.workspace.driversMallTourism(),
      toolbenchReviewPassMessages.workspace.driversMallMomentum()
    ];
  }
  if (property.includes("hdb") || property.includes("heartland")) {
    return [
      toolbenchReviewPassMessages.workspace.driversHdbTraffic(),
      toolbenchReviewPassMessages.workspace.driversHdbUse(),
      toolbenchReviewPassMessages.workspace.driversHdbNegotiation(),
      toolbenchReviewPassMessages.workspace.driversHdbMomentum()
    ];
  }
  return [
    toolbenchReviewPassMessages.workspace.driversDefaultPressure(),
    toolbenchReviewPassMessages.workspace.driversDefaultFrontage(),
    toolbenchReviewPassMessages.workspace.driversDefaultMomentum(),
    toolbenchReviewPassMessages.workspace.driversDefaultWorkspace()
  ];
}

function confidenceProfile(record) {
  const confidence = String(record?.confidence || "").toLowerCase();
  if (record?.prototypeSource === "coverage-request" || confidence.includes("coverage")) {
    return {
      title: toolbenchReviewPassMessages.workspace.confidenceCoverageTitle(),
      copy: toolbenchReviewPassMessages.workspace.confidenceCoverageCopy(),
      trust: toolbenchReviewPassMessages.workspace.confidenceCoverageTrust(),
      evidence: toolbenchReviewPassMessages.workspace.confidenceCoverageEvidence()
    };
  }
  if (confidence.includes("comparable")) {
    return {
      title: toolbenchReviewPassMessages.workspace.confidenceComparableTitle(),
      copy: toolbenchReviewPassMessages.workspace.confidenceComparableCopy(),
      trust: toolbenchReviewPassMessages.workspace.confidenceComparableTrust(),
      evidence: toolbenchReviewPassMessages.workspace.confidenceComparableEvidence()
    };
  }
  if (confidence.includes("high")) {
    return {
      title: toolbenchReviewPassMessages.workspace.confidenceHighTitle(),
      copy: toolbenchReviewPassMessages.workspace.confidenceHighCopy(),
      trust: toolbenchReviewPassMessages.workspace.confidenceHighTrust(),
      evidence: toolbenchReviewPassMessages.workspace.confidenceHighEvidence()
    };
  }
  if (confidence.includes("medium")) {
    return {
      title: toolbenchReviewPassMessages.workspace.confidenceMediumTitle(),
      copy: toolbenchReviewPassMessages.workspace.confidenceMediumCopy(),
      trust: toolbenchReviewPassMessages.workspace.confidenceMediumTrust(),
      evidence: toolbenchReviewPassMessages.workspace.confidenceMediumEvidence()
    };
  }
  return {
    title: toolbenchReviewPassMessages.workspace.confidenceFallbackTitle({
      title: record?.confidence || ""
    }),
    copy: toolbenchReviewPassMessages.workspace.confidenceFallbackCopy(),
    trust: toolbenchReviewPassMessages.workspace.confidenceFallbackTrust(),
    evidence: toolbenchReviewPassMessages.workspace.confidenceFallbackEvidence()
  };
}

function benchmarkTrust(record) {
  const type = String(record?.propertyType || "").toLowerCase();
  if (record?.prototypeSource === "coverage-request") {
    return {
      officialLayer: toolbenchReviewPassMessages.workspace.benchmarkComparableOfficial(),
      askingLayer: toolbenchReviewPassMessages.workspace.benchmarkComparableAsking(),
      trustNote: toolbenchReviewPassMessages.workspace.benchmarkComparableTrustNote()
    };
  }
  if (type.includes("hdb")) {
    return {
      officialLayer: toolbenchReviewPassMessages.workspace.benchmarkHdbOfficial(),
      askingLayer: toolbenchReviewPassMessages.workspace.benchmarkHdbAsking(),
      trustNote: toolbenchReviewPassMessages.workspace.benchmarkHdbTrustNote()
    };
  }
  if (type.includes("shophouse")) {
    return {
      officialLayer: toolbenchReviewPassMessages.workspace.benchmarkShophouseOfficial(),
      askingLayer: toolbenchReviewPassMessages.workspace.benchmarkShophouseAsking(),
      trustNote: toolbenchReviewPassMessages.workspace.benchmarkShophouseTrustNote()
    };
  }
  if (type.includes("mall") || type.includes("shopping")) {
    return {
      officialLayer: toolbenchReviewPassMessages.workspace.benchmarkMallOfficial(),
      askingLayer: toolbenchReviewPassMessages.workspace.benchmarkMallAsking(),
      trustNote: toolbenchReviewPassMessages.workspace.benchmarkMallTrustNote()
    };
  }
  return {
    officialLayer: toolbenchReviewPassMessages.workspace.benchmarkDefaultOfficial(),
    askingLayer: toolbenchReviewPassMessages.workspace.benchmarkDefaultAsking(),
    trustNote: toolbenchReviewPassMessages.workspace.benchmarkDefaultTrustNote()
  };
}

function sourceTrustProfile(record) {
  return window.RentIntelSourceTrust?.profile(record, {
    feed: currentAskingFeed()
  }) || {
    key: "sample",
    level: "sample",
    title: toolbenchReviewPassMessages.workspace.sourceTrustSampleTitle(),
    reason: toolbenchReviewPassMessages.workspace.sourceTrustSampleReason(),
    action: toolbenchReviewPassMessages.workspace.sourceTrustSampleAction()
  };
}

function normalizeDecisionContextKey(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(singapore|guide|check|rates|rate|the|and)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decisionContextScore(record, contextRecord) {
  const recordKeys = [
    record?.id,
    record?.title,
    record?.area,
    record?.propertyType,
    ...(Array.isArray(record?.aliases) ? record.aliases : [])
  ]
    .map(normalizeDecisionContextKey)
    .filter(Boolean);
  const contextKeys = [contextRecord?.recordId, contextRecord?.subjectRef]
    .map(normalizeDecisionContextKey)
    .filter(Boolean);
  let best = 0;
  recordKeys.forEach((recordKey) => {
    contextKeys.forEach((contextKey) => {
      if (!recordKey || !contextKey) return;
      if (recordKey === contextKey) best = Math.max(best, 100);
      else if (recordKey.includes(contextKey) || contextKey.includes(recordKey)) best = Math.max(best, 80);
      else {
        const recordTokens = new Set(recordKey.split(" "));
        const contextTokens = contextKey.split(" ");
        const overlap = contextTokens.filter((token) => recordTokens.has(token)).length;
        best = Math.max(best, overlap * 10);
      }
    });
  });
  return best;
}

function contextRecordForRecord(record) {
  if (!record || !toolbenchDecisionContextRecords.length) return null;
  const scored = toolbenchDecisionContextRecords
    .map((contextRecord) => ({
      contextRecord,
      score: decisionContextScore(record, contextRecord)
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.score >= 30 ? scored[0].contextRecord : null;
}

function contextBundleFromRecord(context) {
  if (!context) return null;
  return {
    contextRecordId: context.contextRecordId,
    recordId: context.recordId,
    subjectType: context.subjectType,
    subjectRef: context.subjectRef,
    capturedAt: context.capturedAt,
    savedAt: context.savedAt || "",
    updatedAt: context.updatedAt || "",
    contextOrigin: context.contextOrigin || "",
    contextOriginLayers: Array.isArray(context.contextOriginLayers) ? JSON.parse(JSON.stringify(context.contextOriginLayers)) : [],
    updatedScope: context.updatedScope ? JSON.parse(JSON.stringify(context.updatedScope)) : null,
    rentSignal: context.rentSignal ? JSON.parse(JSON.stringify(context.rentSignal)) : null,
    valueGapSignal: context.valueGapSignal ? JSON.parse(JSON.stringify(context.valueGapSignal)) : null,
    surroundingBusinesses: context.surroundingBusinesses ? JSON.parse(JSON.stringify(context.surroundingBusinesses)) : null,
    unitSuitability: context.unitSuitability ? JSON.parse(JSON.stringify(context.unitSuitability)) : null,
    decisionNotes: context.decisionNotes ? JSON.parse(JSON.stringify(context.decisionNotes)) : null
  };
}

function categoryLabel(category = "") {
  return String(category)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function signalLabel(signal = "") {
  return String(signal).replace(/_/g, " ");
}

function fitLabel(useCase = "") {
  return String(useCase)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function setListContent(listEl, items, fallback) {
  if (!listEl) return;
  listEl.replaceChildren();
  (items?.length ? items : [fallback]).forEach((itemText) => {
    const item = document.createElement("li");
    item.textContent = itemText;
    listEl.append(item);
  });
}

function parseEditableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateGapPercent(askingPsf, benchmarkHighPsf) {
  if (!Number.isFinite(askingPsf) || !Number.isFinite(benchmarkHighPsf) || benchmarkHighPsf <= 0) {
    return null;
  }
  return Math.round(((askingPsf - benchmarkHighPsf) / benchmarkHighPsf) * 100);
}

function gapDirectionForRange(askingPsf, benchmarkLowPsf, benchmarkHighPsf) {
  if (!Number.isFinite(askingPsf) || !Number.isFinite(benchmarkLowPsf) || !Number.isFinite(benchmarkHighPsf)) {
    return null;
  }
  if (askingPsf < benchmarkLowPsf) return "below_range";
  if (askingPsf > benchmarkHighPsf) return "above_range";
  return "within_range";
}

function evaluateV1Validation() {
  if (!toolbenchEl.v1ValidationList || !toolbenchContextDraft) return [];
  const warnings = [];
  const benchmarkLowPsf = parseEditableNumber(toolbenchEl.v1BenchmarkLowInput?.value);
  const benchmarkHighPsf = parseEditableNumber(toolbenchEl.v1BenchmarkHighInput?.value);
  const askingPsf = parseEditableNumber(toolbenchEl.v1AskingPsfInput?.value);
  const verdict = toolbenchEl.v1VerdictInput?.value || "";
  const valueGapStatus = toolbenchEl.v1ValueGapStatusInput?.value || "";
  const selectedDirection = toolbenchEl.v1GapDirectionInput?.value || "";
  const derivedDirection = gapDirectionForRange(askingPsf, benchmarkLowPsf, benchmarkHighPsf);

  if (Number.isFinite(benchmarkLowPsf) && Number.isFinite(benchmarkHighPsf) && benchmarkLowPsf > benchmarkHighPsf) {
    warnings.push(toolbenchReviewPassMessages.validation.warningBenchmarkRange());
  }

  if (verdict === "fair" && derivedDirection && derivedDirection !== "within_range") {
    warnings.push(toolbenchReviewPassMessages.validation.warningFairOutOfRange());
  }
  if ((verdict === "high" || verdict === "stretched") && derivedDirection && derivedDirection !== "above_range") {
    warnings.push(toolbenchReviewPassMessages.validation.warningHighOutOfRange());
  }
  if (verdict === "below_benchmark" && derivedDirection && derivedDirection !== "below_range") {
    warnings.push(toolbenchReviewPassMessages.validation.warningBelowBenchmarkOutOfRange());
  }

  if (selectedDirection && derivedDirection && selectedDirection !== derivedDirection) {
    warnings.push(
      toolbenchReviewPassMessages.validation.warningGapDirectionMismatch({
        selectedDirection,
        derivedDirection
      })
    );
  }

  if ((valueGapStatus === "below_benchmark" || valueGapStatus === "possible_value_gap") && derivedDirection && derivedDirection !== "below_range") {
    warnings.push(toolbenchReviewPassMessages.validation.warningValueGapOutOfRange());
  }
  if (valueGapStatus === "not_below_benchmark" && derivedDirection === "below_range") {
    warnings.push(toolbenchReviewPassMessages.validation.warningNotBelowBenchmarkConflict());
  }

  return warnings;
}

function createV1ValidationWarning(section, text, target) {
  return {
    section,
    text,
    target,
    key: `${section}::${text}`
  };
}

function evaluateV1ValidationBySection() {
  if (!toolbenchContextDraft) return {};
  const sections = {
    "rent-signal": [],
    "value-gap": [],
    "surrounding-trade": [],
    "suitability": [],
    "decision-note": []
  };
  const benchmarkLowPsf = parseEditableNumber(toolbenchEl.v1BenchmarkLowInput?.value);
  const benchmarkHighPsf = parseEditableNumber(toolbenchEl.v1BenchmarkHighInput?.value);
  const askingPsf = parseEditableNumber(toolbenchEl.v1AskingPsfInput?.value);
  const verdict = toolbenchEl.v1VerdictInput?.value || "";
  const valueGapStatus = toolbenchEl.v1ValueGapStatusInput?.value || "";
  const selectedDirection = toolbenchEl.v1GapDirectionInput?.value || "";
  const derivedDirection = gapDirectionForRange(askingPsf, benchmarkLowPsf, benchmarkHighPsf);

  if (Number.isFinite(benchmarkLowPsf) && Number.isFinite(benchmarkHighPsf) && benchmarkLowPsf > benchmarkHighPsf) {
    sections["rent-signal"].push(createV1ValidationWarning(
      "rent-signal",
      toolbenchReviewPassMessages.validation.warningBenchmarkRange(),
      toolbenchEl.v1BenchmarkLowInput || toolbenchEl.v1BenchmarkHighInput
    ));
  }
  if (verdict === "fair" && derivedDirection && derivedDirection !== "within_range") {
    sections["rent-signal"].push(createV1ValidationWarning(
      "rent-signal",
      toolbenchReviewPassMessages.validation.warningFairOutOfRange(),
      toolbenchEl.v1VerdictInput
    ));
  }
  if ((verdict === "high" || verdict === "stretched") && derivedDirection && derivedDirection !== "above_range") {
    sections["rent-signal"].push(createV1ValidationWarning(
      "rent-signal",
      toolbenchReviewPassMessages.validation.warningHighOutOfRange(),
      toolbenchEl.v1VerdictInput
    ));
  }
  if (verdict === "below_benchmark" && derivedDirection && derivedDirection !== "below_range") {
    sections["rent-signal"].push(createV1ValidationWarning(
      "rent-signal",
      toolbenchReviewPassMessages.validation.warningBelowBenchmarkOutOfRange(),
      toolbenchEl.v1VerdictInput
    ));
  }
  if (selectedDirection && derivedDirection && selectedDirection !== derivedDirection) {
    sections["value-gap"].push(createV1ValidationWarning(
      "value-gap",
      toolbenchReviewPassMessages.validation.warningGapDirectionMismatch({
        selectedDirection,
        derivedDirection
      }),
      toolbenchEl.v1GapDirectionInput
    ));
  }
  if ((valueGapStatus === "below_benchmark" || valueGapStatus === "possible_value_gap") && derivedDirection && derivedDirection !== "below_range") {
    sections["value-gap"].push(createV1ValidationWarning(
      "value-gap",
      toolbenchReviewPassMessages.validation.warningValueGapOutOfRange(),
      toolbenchEl.v1ValueGapStatusInput
    ));
  }
  if (valueGapStatus === "not_below_benchmark" && derivedDirection === "below_range") {
    sections["value-gap"].push(createV1ValidationWarning(
      "value-gap",
      toolbenchReviewPassMessages.validation.warningNotBelowBenchmarkConflict(),
      toolbenchEl.v1ValueGapStatusInput
    ));
  }
  return sections;
}

function v1ValidationSectionLabel(sectionKey = "") {
  const labels = {
    "rent-signal": "Rent Signal",
    "value-gap": "Value Gap",
    "surrounding-trade": "Surrounding Trade",
    "suitability": "Suitability",
    "decision-note": "Decision Note"
  };
  return labels[sectionKey] || "Validation";
}

function currentV1ValidationWarningKeys() {
  const sectionWarnings = evaluateV1ValidationBySection();
  return new Set(
    Object.values(sectionWarnings)
      .flat()
      .map((warning) => warning?.key)
      .filter(Boolean)
  );
}

function currentV1ValidationCountsBySection() {
  const sectionWarnings = evaluateV1ValidationBySection();
  return Object.fromEntries(
    Object.entries(sectionWarnings).map(([sectionKey, warnings]) => [
      sectionKey,
      Array.isArray(warnings) ? warnings.length : 0
    ])
  );
}

function nextV1ValidationWarningInSection(sectionKey, excludedKey = "") {
  if (!sectionKey) return null;
  const sectionWarnings = evaluateV1ValidationBySection();
  const warnings = Array.isArray(sectionWarnings[sectionKey]) ? sectionWarnings[sectionKey] : [];
  return warnings.find((warning) => warning?.key && warning.key !== excludedKey) || null;
}

function firstV1ValidationWarning(excludedKey = "") {
  const sectionWarnings = evaluateV1ValidationBySection();
  return Object.values(sectionWarnings)
    .flat()
    .find((warning) => warning?.key && warning.key !== excludedKey) || null;
}

function currentRoutedLeadValidationWarning(context = toolbenchContextDraft) {
  const routedCue = currentRoutedRecordCueForContext(context);
  if (!routedCue?.validationSection) return null;
  const sectionWarnings = evaluateV1ValidationBySection();
  const warnings = Array.isArray(sectionWarnings[routedCue.validationSection])
    ? sectionWarnings[routedCue.validationSection]
    : [];
  return warnings[0] || null;
}

function combineStatusDetail(...parts) {
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");
}

function summarizeRoutedLeadValidationSaveDetail({
  warningBefore = null,
  warningStillOpen = false,
  nextWarning = null,
  beforeCount = 0,
  afterCount = 0
} = {}) {
  if (!warningBefore?.section) return "";
  const label = v1ValidationSectionLabel(warningBefore.section);
  if (!warningStillOpen) {
    return nextWarning?.key && nextWarning.key !== warningBefore.key
      ? `Lead routed review point cleared in ${label}. Next routed review point is now active.`
      : `Lead routed review point cleared in ${label}.`;
  }
  if (afterCount < beforeCount) {
    return `Lead routed review tightened in ${label}.`;
  }
  return `Lead routed review point is still open in ${label}.`;
}

function summarizeRoutedLeadValidationQueueCopy({
  warningBefore = null,
  warningStillOpen = false,
  nextWarning = null,
  beforeCount = 0,
  afterCount = 0
} = {}) {
  if (!warningBefore?.section) return "";
  const label = v1ValidationSectionLabel(warningBefore.section);
  if (!warningStillOpen) {
    return nextWarning?.key && nextWarning.key !== warningBefore.key
      ? `Lead routed warning cleared in ${label}. Next routed warning active.`
      : `Lead routed warning cleared in ${label}.`;
  }
  if (afterCount < beforeCount) {
    return `Lead routed warning tightened in ${label}.`;
  }
  return `Lead routed warning still active in ${label}.`;
}

function summarizeRoutedLeadLaneResultDetail(reopenMemoryType = "", outcomeStatus = "", { tempered = false, recovering = false } = {}) {
  if (reopenMemoryType === "productive") {
    if (outcomeStatus === "cleared") return tempered ? `${recovering ? "Advanced recovering" : "Advanced tempered"} productive reopen lane with a cleared warning.` : "Advanced productive reopen lane with a cleared warning.";
    if (outcomeStatus === "tightened") return tempered ? `${recovering ? "Advanced recovering" : "Advanced tempered"} productive reopen lane by tightening the active warning.` : "Advanced productive reopen lane by tightening the active warning.";
    if (outcomeStatus === "next-active" || outcomeStatus === "active") return tempered ? `${recovering ? "Recovering" : "Tempered"} productive reopen lane still needs follow-through.` : "Productive reopen lane still needs follow-through.";
  }
  if (reopenMemoryType === "pressure") {
    if (outcomeStatus === "cleared") return tempered ? `${recovering ? "Relieved recovering" : "Relieved tempered"} pressure reopen lane with a cleared warning.` : "Relieved pressure reopen lane with a cleared warning.";
    if (outcomeStatus === "tightened") return tempered ? `${recovering ? "Relieved recovering" : "Relieved tempered"} pressure reopen lane by tightening the active warning.` : "Relieved pressure reopen lane by tightening the active warning.";
    if (outcomeStatus === "next-active" || outcomeStatus === "active") return tempered ? `${recovering ? "Recovering" : "Tempered"} pressure reopen lane is still active.` : "Pressure reopen lane is still active.";
  }
  return "";
}

function summarizeRoutedLeadValidationTileCopy({
  warningBefore = null,
  warningStillOpen = false,
  nextWarning = null,
  beforeCount = 0,
  afterCount = 0
} = {}) {
  if (!warningBefore?.section) return "";
  if (!warningStillOpen) {
    return nextWarning?.key && nextWarning.key !== warningBefore.key
      ? "Next warning active"
      : "Warning cleared";
  }
  if (afterCount < beforeCount) {
    return "Warning tightened";
  }
  return "Warning active";
}

function renderV1EditorSectionValidation() {
  if (!toolbenchEl.v1EditorNav) return;
  const sectionWarnings = evaluateV1ValidationBySection();
  toolbenchEl.v1EditorNav.querySelectorAll("[data-section-target]").forEach((button) => {
    const key = button.dataset.sectionTarget || "";
    const warnings = Array.isArray(sectionWarnings[key]) ? sectionWarnings[key] : [];
    const count = warnings.length;
    const recentlyResolved = toolbenchRecentlyResolvedValidationSections[key] || null;
    const recentlyRefreshed = Boolean(toolbenchRecentlyRefreshedContextSections[key]);
    button.dataset.validation = count > 0 ? "warning" : "clear";
    button.dataset.count = String(count);
    if (recentlyResolved && recentlyResolved.to === count) {
      button.dataset.validationResolved = "true";
      button.dataset.resolvedCount = String(count);
      button.dataset.resolvedFrom = String(recentlyResolved.from);
    } else {
      delete button.dataset.validationResolved;
      delete button.dataset.resolvedCount;
      delete button.dataset.resolvedFrom;
    }
    if (recentlyRefreshed) {
      button.dataset.sourceRefreshed = "true";
    } else {
      delete button.dataset.sourceRefreshed;
    }
    if (toolbenchDecisionFocusSection && toolbenchDecisionFocusSection === key) {
      button.dataset.decisionFocus = "true";
    } else {
      delete button.dataset.decisionFocus;
    }
    button.title = count > 0
      ? `${count} validation warning${count > 1 ? "s" : ""} in ${key.replace(/-/g, " ")}.`
      : `No validation warnings in ${key.replace(/-/g, " ")}.`;
    if (recentlyResolved && recentlyResolved.to === count && recentlyResolved.from > count) {
      button.title = `Validation count dropped from ${recentlyResolved.from} to ${count} in ${key.replace(/-/g, " ")}.`;
    } else if (recentlyRefreshed) {
      button.title = `${v1ValidationSectionLabel(key)} was refreshed from the latest sample bundle.`;
    }
    button.setAttribute("aria-label", button.title);
  });
}

function renderV1EditorDecisionFocus() {
  if (!toolbenchEl.v1EditorForm) return;
  toolbenchEl.v1EditorForm
    .querySelectorAll?.(".workspace-v1-editor-section")
    .forEach((section) => {
      section.dataset.decisionFocus = section.dataset.section === toolbenchDecisionFocusSection ? "true" : "false";
    });
  renderV1EditorSectionValidation();
}

function setDecisionFocusSection(sectionKey = "") {
  toolbenchDecisionFocusSection = String(sectionKey || "").trim().toLowerCase();
  if (toolbenchDecisionFocusTimer) {
    window.clearTimeout(toolbenchDecisionFocusTimer);
    toolbenchDecisionFocusTimer = null;
  }
  renderV1EditorDecisionFocus();
  if (!toolbenchDecisionFocusSection) return;
  toolbenchDecisionFocusTimer = window.setTimeout(() => {
    toolbenchDecisionFocusSection = "";
    toolbenchDecisionFocusTimer = null;
    renderV1EditorDecisionFocus();
  }, 3200);
}

function renderV1Validation() {
  if (!toolbenchEl.v1Validation || !toolbenchEl.v1ValidationList) return;
  if (!toolbenchContextDraft) {
    toolbenchEl.v1Validation.dataset.state = "pending";
    toolbenchEl.v1ValidationTitle.textContent = toolbenchReviewPassMessages.validation.titleIdle();
    if (toolbenchEl.v1ValidationClear) {
      toolbenchEl.v1ValidationClear.hidden = true;
      toolbenchEl.v1ValidationClear.textContent = toolbenchReviewPassMessages.validation.clearSectionFilter();
    }
    setListContent(toolbenchEl.v1ValidationList, [], toolbenchReviewPassMessages.validation.pendingCopy());
    renderV1EditorSectionValidation();
    return;
  }
  const warnings = evaluateV1Validation();
  const sectionWarnings = evaluateV1ValidationBySection();
  const allWarningItems = Object.values(sectionWarnings).flat();
  const routedCue = currentRoutedRecordCueForContext(toolbenchContextDraft);
  const routedValidationSection =
    !toolbenchV1ValidationSectionFilter &&
    routedCue?.validationSection &&
    Array.isArray(sectionWarnings[routedCue.validationSection]) &&
    sectionWarnings[routedCue.validationSection].length
      ? routedCue.validationSection
      : "";
  const routedLaneKey = quickPickBookmarkKeyForLens(currentQuickPickLensState());
  const routedPlanningMemory = routedValidationSection
    ? toolbenchQuickPickBookmarkPlanningMemoryByKey[routedLaneKey] || null
    : null;
  const routedPlanningAction = routedValidationSection
    ? quickPickBookmarkPlanningAction({
        count: quickPickRecordsForLens(toolbenchQuickPickBookmarks[routedLaneKey] || currentQuickPickLensState()).length,
        degraded: false,
        resolved: false,
        priority: "",
        urgency: "",
        momentum: summarizeLaneRoutedReviewMomentum(
          quickPickRecordsForLens(toolbenchQuickPickBookmarks[routedLaneKey] || currentQuickPickLensState())
        ),
        reopenMemory: quickPickBookmarkReopenMemoryMeta(routedLaneKey),
        planningMemory: routedPlanningMemory
      })
    : "";
  const routedLaneMomentum = routedValidationSection
    ? summarizeLaneRoutedReviewMomentum(
        quickPickRecordsForLens(toolbenchQuickPickBookmarks[routedLaneKey] || currentQuickPickLensState())
      )
    : null;
  const routedPlanningHoldReason = routedValidationSection
    ? quickPickBookmarkPlanningHoldReason(routedPlanningMemory, routedPlanningAction, routedLaneMomentum)
    : "";
  const activeValidationSectionFilter = toolbenchV1ValidationSectionFilter || routedValidationSection;
  const filteredWarnings = activeValidationSectionFilter
    ? (sectionWarnings[activeValidationSectionFilter] || [])
    : allWarningItems;
  const recentClearedWarning =
    toolbenchRecentlyClearedValidationWarning &&
    (!activeValidationSectionFilter ||
      toolbenchRecentlyClearedValidationWarning.section === activeValidationSectionFilter)
      ? toolbenchRecentlyClearedValidationWarning
      : null;
  const recentCompletedSection =
    activeValidationSectionFilter &&
    toolbenchRecentlyCompletedValidationSection === activeValidationSectionFilter
      ? activeValidationSectionFilter
      : "";
  if (!warnings.length) {
    toolbenchEl.v1Validation.dataset.state = "ok";
    toolbenchEl.v1ValidationTitle.textContent = toolbenchRecentlyCompletedValidationAll
      ? toolbenchReviewPassMessages.validation.allCompleteTitle()
      : toolbenchReviewPassMessages.validation.titleAligned();
    if (toolbenchEl.v1ValidationClear) {
      toolbenchEl.v1ValidationClear.hidden = true;
      toolbenchEl.v1ValidationClear.textContent = toolbenchReviewPassMessages.validation.clearSectionFilter();
    }
    if (!recentClearedWarning && !toolbenchRecentlyCompletedValidationAll) {
      setListContent(toolbenchEl.v1ValidationList, [], toolbenchReviewPassMessages.validation.alignedCopy());
    } else {
      toolbenchEl.v1ValidationList.replaceChildren();
      const alignedItem = document.createElement("li");
      alignedItem.className = toolbenchRecentlyCompletedValidationAll ? "workspace-v1-validation-resolved" : "";
      alignedItem.textContent = toolbenchRecentlyCompletedValidationAll
        ? toolbenchReviewPassMessages.validation.allComplete()
        : toolbenchReviewPassMessages.validation.alignedCopy();
      toolbenchEl.v1ValidationList.append(alignedItem);
      if (recentClearedWarning) {
        const toggleItem = document.createElement("li");
        toggleItem.className = "workspace-v1-validation-detail-item";
        toggleItem.append(createValidationResolvedToggleButton());
        toolbenchEl.v1ValidationList.append(toggleItem);
        if (toolbenchValidationResolvedExpanded) {
          const clearedItem = document.createElement("li");
          clearedItem.className = "workspace-v1-validation-resolved";
          clearedItem.textContent = toolbenchReviewPassMessages.validation.cleared({
            text: recentClearedWarning.text
          });
          toolbenchEl.v1ValidationList.append(clearedItem);
        }
      }
    }
    renderV1EditorSectionValidation();
    return;
  }
  toolbenchEl.v1Validation.dataset.state = "warning";
  if (toolbenchEl.v1ValidationClear) {
    toolbenchEl.v1ValidationClear.hidden = !toolbenchV1ValidationSectionFilter;
    toolbenchEl.v1ValidationClear.textContent = recentCompletedSection
      ? toolbenchReviewPassMessages.validation.backToAll()
      : toolbenchReviewPassMessages.validation.clearSectionFilter();
    if (recentCompletedSection && toolbenchPendingValidationClearFocus) {
      window.setTimeout(() => {
        if (
          toolbenchEl.v1ValidationClear &&
          !toolbenchEl.v1ValidationClear.hidden &&
          toolbenchRecentlyCompletedValidationSection === recentCompletedSection
        ) {
          toolbenchEl.v1ValidationClear.focus();
        }
      }, 80);
      toolbenchPendingValidationClearFocus = false;
    }
  }
  toolbenchEl.v1ValidationTitle.textContent = activeValidationSectionFilter
    ? recentCompletedSection && !filteredWarnings.length
      ? toolbenchReviewPassMessages.validation.sectionCompleteTitle({
          label: v1ValidationSectionLabel(activeValidationSectionFilter)
        })
      : `${routedValidationSection ? routedPlanningHoldReason ? "Tempered-routed review" : routedCue?.reopenMemoryType === "pressure" ? "Pressure-routed review" : routedCue?.reopenMemoryType === "productive" ? "Progress-routed review" : "Routed review" : v1ValidationSectionLabel(activeValidationSectionFilter)} • ${routedValidationSection ? `${v1ValidationSectionLabel(activeValidationSectionFilter)} • ` : ""}${filteredWarnings.length} review point${filteredWarnings.length === 1 ? "" : "s"}`
    : toolbenchReviewPassMessages.validation.titleWarnings({
        count: warnings.length
      });
  toolbenchEl.v1ValidationList.replaceChildren();
  if (recentClearedWarning && !recentCompletedSection) {
    const clearedItem = document.createElement("li");
    clearedItem.className = "workspace-v1-validation-resolved";
    clearedItem.textContent = toolbenchReviewPassMessages.validation.cleared({
      text: recentClearedWarning.text
    });
    toolbenchEl.v1ValidationList.append(clearedItem);
  }
  if (!filteredWarnings.length) {
    const item = document.createElement("li");
    if (recentCompletedSection) {
      item.className = "workspace-v1-validation-resolved";
      item.textContent = toolbenchReviewPassMessages.validation.sectionComplete({
        label: v1ValidationSectionLabel(activeValidationSectionFilter)
      });
    } else {
      item.textContent = activeValidationSectionFilter
        ? `${routedValidationSection ? "No routed review warnings in" : "No validation warnings in"} ${v1ValidationSectionLabel(activeValidationSectionFilter)}.`
        : toolbenchReviewPassMessages.validation.empty();
    }
    toolbenchEl.v1ValidationList.append(item);
    if (recentCompletedSection && recentClearedWarning) {
      const toggleItem = document.createElement("li");
      toggleItem.className = "workspace-v1-validation-detail-item";
      toggleItem.append(createValidationResolvedToggleButton());
      toolbenchEl.v1ValidationList.append(toggleItem);
      if (toolbenchValidationResolvedExpanded) {
        const clearedItem = document.createElement("li");
        clearedItem.className = "workspace-v1-validation-resolved";
        clearedItem.textContent = toolbenchReviewPassMessages.validation.cleared({
          text: recentClearedWarning.text
        });
        toolbenchEl.v1ValidationList.append(clearedItem);
      }
    }
  } else {
    if (routedValidationSection && filteredWarnings[0]?.target) {
      const leadWarning = filteredWarnings[0];
      const leadItem = document.createElement("li");
      leadItem.className = "workspace-v1-validation-routed-lead";
      const leadButton = document.createElement("button");
      leadButton.type = "button";
      leadButton.className = "workspace-v1-validation-link";
      leadButton.textContent = `${routedPlanningHoldReason ? "Lead tempered routed review point" : "Lead routed review point"}: ${leadWarning.text}`;
      leadButton.addEventListener("click", () => {
        toolbenchActiveValidationWarningKey = leadWarning.key || "";
        focusV1EditorControl(
          leadWarning.target,
          `Jumped to the lead routed review point in ${v1ValidationSectionLabel(leadWarning.section)}.`,
          `Routed Review: ${v1ValidationSectionLabel(leadWarning.section)}`
        );
      });
      leadItem.append(leadButton);
      toolbenchEl.v1ValidationList.append(leadItem);
    }
    filteredWarnings.forEach((warning) => {
      const item = document.createElement("li");
      if (warning?.target) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "workspace-v1-validation-link";
        button.textContent = warning.text;
        button.addEventListener("click", () => {
          toolbenchActiveValidationWarningKey = warning.key || "";
          focusV1EditorControl(
            warning.target,
            `Jumped to the field behind this ${v1ValidationSectionLabel(warning.section)} validation warning.`,
            `Validation: ${v1ValidationSectionLabel(warning.section)}`
          );
        });
        item.append(button);
      } else {
        item.textContent = warning?.text || "";
      }
      toolbenchEl.v1ValidationList.append(item);
    });
  }
  renderV1EditorSectionValidation();
}

function v1HealthActionForLabel(label) {
  switch (label) {
    case toolbenchReviewPassMessages.health.labelRentSignal():
      return toolbenchReviewPassMessages.health.actionRentSignal();
    case toolbenchReviewPassMessages.health.labelValueGap():
      return toolbenchReviewPassMessages.health.actionValueGap();
    case toolbenchReviewPassMessages.health.labelSurroundingTrade():
      return toolbenchReviewPassMessages.health.actionSurroundingTrade();
    case toolbenchReviewPassMessages.health.labelSuitability():
      return toolbenchReviewPassMessages.health.actionSuitability();
    case toolbenchReviewPassMessages.health.labelDecisionNote():
      return toolbenchReviewPassMessages.health.actionDecisionNote();
    default:
      return toolbenchReviewPassMessages.health.actionGeneric({ label });
  }
}

function v1HealthTargetForLabel(label) {
  switch (label) {
    case toolbenchReviewPassMessages.health.labelRentSignal():
      return toolbenchEl.v1VerdictInput;
    case toolbenchReviewPassMessages.health.labelValueGap():
      return toolbenchEl.v1ValueGapStatusInput;
    case toolbenchReviewPassMessages.health.labelSurroundingTrade():
      return toolbenchEl.v1TradePatternInput;
    case toolbenchReviewPassMessages.health.labelSuitability():
      return toolbenchEl.v1FitScoresInput;
    case toolbenchReviewPassMessages.health.labelDecisionNote():
      return toolbenchEl.v1DecisionInput;
    default:
      return null;
  }
}

function jumpToV1HealthLabel(label) {
  const target = v1HealthTargetForLabel(label);
  if (!target) return false;
  if (toolbenchRecord?.id && label) {
    toolbenchActiveReviewKey = reviewQueueItemKey({
      record: toolbenchRecord,
      label
    });
    persistV1ReviewPassState();
  }
  announceV1EditorJump(`Record Health: ${label}`);
  const sectionKey = editorSectionKeyForTarget(target);
  if (sectionKey) setActiveV1EditorSection(sectionKey);
  const block = pulseV1EditorBlock(target) || target.closest("label") || target.closest(".workspace-v1-signal-grid") || target;
  block.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    if (typeof target.focus === "function") target.focus();
  }, 80);
  return true;
}

function deriveV1HealthActions(checks = [], state = "weak") {
  const failed = checks.filter((check) => !check.ok);
  if (!failed.length || state === "strong") {
    return {
      actions: [toolbenchReviewPassMessages.health.noFixNeeded()],
      nextAction: toolbenchReviewPassMessages.health.noFixNextAction(),
      nextLabel: null
    };
  }
  const actions = failed.map((check) => v1HealthActionForLabel(check.label));
  return {
    actions,
    nextAction: `Next: ${actions[0]}`,
    nextLabel: failed[0]?.label || null
  };
}

function v1HealthStateLabel(state) {
  if (state === "strong") return toolbenchReviewPassMessages.health.stateInternalReady();
  if (state === "partial") return toolbenchReviewPassMessages.health.stateNeedsReview();
  return toolbenchReviewPassMessages.health.stateWeakSample();
}

function v1HealthStateCopy(state) {
  if (state === "strong") return toolbenchReviewPassMessages.health.summaryCopyStrong();
  if (state === "partial") return toolbenchReviewPassMessages.health.summaryCopyPartial();
  return toolbenchReviewPassMessages.health.summaryCopyWeak();
}

function v1HealthCheckItem(check) {
  if (check?.ok) {
    return toolbenchReviewPassMessages.health.passCheck({ label: check.label });
  }
  return toolbenchReviewPassMessages.health.reviewCheck({ label: check?.label || "" });
}

function v1ContextModeLabel(context) {
  if (!context) return "";
  const source = String(context.prototypeSource || context.sourceType || "").toLowerCase();
  if (source.includes("saved") || source.includes("member")) {
    return toolbenchReviewPassMessages.workspace.v1ContextModeSaved();
  }
  if (source.includes("sample")) {
    return toolbenchReviewPassMessages.workspace.v1ContextModeSample();
  }
  return toolbenchReviewPassMessages.workspace.v1ContextModeInternal();
}

function v1ContextModeChipLabel(context) {
  if (!context) return "";
  const source = String(context.prototypeSource || context.sourceType || "").toLowerCase();
  if (source.includes("saved") || source.includes("member")) {
    return toolbenchReviewPassMessages.workspace.v1ContextModeChipSaved();
  }
  if (source.includes("sample")) {
    return toolbenchReviewPassMessages.workspace.v1ContextModeChipSample();
  }
  return toolbenchReviewPassMessages.workspace.v1ContextModeChipInternal();
}

function v1ContextModeTone(context) {
  if (!context) return "";
  const source = String(context.prototypeSource || context.sourceType || "").toLowerCase();
  if (source.includes("saved") || source.includes("member")) return "saved";
  if (source.includes("sample")) return "sample";
  return "internal";
}

function v1ContextOrigin(context) {
  if (!context) return "internal-bundle";
  const explicitOrigin = String(context.contextOrigin || "").trim().toLowerCase();
  if (explicitOrigin) return explicitOrigin;
  const source = String(context.prototypeSource || context.sourceType || "").toLowerCase();
  if (source.includes("saved") || source.includes("member")) return "saved-override";
  if (source.includes("sample")) return "sample-backed";
  if (String(context.savedAt || "").trim() || String(context.updatedAt || "").trim()) return "saved-override";
  return "internal-bundle";
}

function v1ContextOriginChipLabel(context) {
  const origin = v1ContextOrigin(context);
  if (origin === "refreshed-from-sample") {
    return toolbenchReviewPassMessages.workspace.v1ContextOriginChipRefreshed();
  }
  if (origin === "saved-override") {
    return toolbenchReviewPassMessages.workspace.v1ContextOriginChipSaved();
  }
  if (origin === "sample-backed") {
    return toolbenchReviewPassMessages.workspace.v1ContextOriginChipSample();
  }
  return toolbenchReviewPassMessages.workspace.v1ContextOriginChipInternal();
}

function v1ContextOriginLabel(context) {
  const origin = v1ContextOrigin(context);
  if (origin === "refreshed-from-sample") return "refreshed from sample";
  if (origin === "saved-override") return "saved override";
  if (origin === "sample-backed") return "sample-backed";
  return "internal bundle";
}

function v1ContextOriginTone(context) {
  const origin = v1ContextOrigin(context);
  if (origin === "refreshed-from-sample") return "refreshed";
  if (origin === "saved-override") return "saved";
  if (origin === "sample-backed") return "sample";
  return "internal";
}

function v1ContextOriginLayerLabel(layerKey = "") {
  const normalized = String(layerKey || "").trim().toLowerCase();
  if (normalized === "rent-signal") return "Rent signal";
  if (normalized === "value-gap") return "Value gap";
  if (normalized === "surrounding-trade") return "Surrounding trade";
  if (normalized === "suitability") return "Suitability";
  if (normalized === "decision-note") return "Decision note";
  return categoryLabel(normalized);
}

function v1ContextOriginLayerSectionKey(layerKey = "") {
  const normalized = String(layerKey || "").trim().toLowerCase();
  if (normalized === "rent-signal") return "rent-signal";
  if (normalized === "value-gap") return "value-gap";
  if (normalized === "surrounding-trade") return "surrounding-trade";
  if (normalized === "suitability") return "suitability";
  if (normalized === "decision-note") return "decision-note";
  return "";
}

function v1ContextOriginLayersLabel(context, limit = 3) {
  const layers = Array.isArray(context?.contextOriginLayers) ? context.contextOriginLayers : [];
  const labels = layers.map(v1ContextOriginLayerLabel).filter(Boolean);
  if (!labels.length) return "";
  const visible = labels.slice(0, limit);
  const extra = labels.length - visible.length;
  return extra > 0 ? `${visible.join(", ")} +${extra} more` : visible.join(", ");
}

function summarizeDecisionOutcomeProvenance(context) {
  if (!context) return "";
  const origin = v1ContextOrigin(context);
  const layers = v1ContextOriginLayersLabel(context);
  const freshness = sourceFreshnessProfile(
    context.capturedAt || context.rentSignal?.capturedAt || context.valueGapSignal?.capturedAt || ""
  );
  const freshnessLabel = freshness?.label
    ? `${String(freshness.label).toLowerCase()}${Number.isFinite(freshness.days) ? ` (${freshness.days}d)` : ""}`
    : "";
  if (origin === "refreshed-from-sample") {
    return `Source: refreshed from sample${layers ? ` • refreshed layers: ${layers}` : ""}${freshnessLabel ? ` • freshness: ${freshnessLabel}` : ""}.`;
  }
  if (origin === "sample-backed") {
    return `Source: sample-backed${freshnessLabel ? ` • freshness: ${freshnessLabel}` : ""}.`;
  }
  if (origin === "saved-override") {
    const updated = formatShortDate(context.updatedAt || context.savedAt || "");
    return `Source: saved override${updated && updated !== toolbenchReviewPassMessages.workspace.dateNotConnected() ? ` • latest save ${updated}` : ""}.`;
  }
  return "Source: internal bundle.";
}

function snapshotRecordKeyForContext(context = null) {
  return normalizeDecisionContextKey(
    context?.recordId ||
    context?.contextRecordId ||
    context?.subjectRef ||
    ""
  );
}

function currentDecisionOutcomeProgress(context = null) {
  if (!toolbenchRecentDecisionOutcomeProgress) return null;
  const recordKey = snapshotRecordKeyForContext(context);
  if (!recordKey) return null;
  if (toolbenchRecentDecisionOutcomeProgress.recordKey !== recordKey) return null;
  return toolbenchRecentDecisionOutcomeProgress;
}

function currentDecisionOutcomeHistory(context = null) {
  const recordKey = snapshotRecordKeyForContext(context);
  if (!recordKey) return null;
  const entry = toolbenchDecisionOutcomeHistoryByRecord[recordKey];
  if (!entry || typeof entry !== "object") return null;
  if (!String(entry.from || "").trim() || !String(entry.to || "").trim()) return null;
  return entry;
}

function decisionOutcomeStrength(outcome = null) {
  const tone = String(outcome?.tone || "").trim().toLowerCase();
  if (tone === "strong") return 2;
  if (tone === "watch") return 1;
  if (tone === "caution") return 0;
  return 1;
}

function decisionOutcomeComparisonLabel(beforeOutcome = null, afterOutcome = null) {
  const before = decisionOutcomeStrength(beforeOutcome);
  const after = decisionOutcomeStrength(afterOutcome);
  if (after > before) return "stronger";
  if (after < before) return "weaker";
  return "unchanged";
}

function setRecentDecisionOutcomeProgress(context = null, progress = null) {
  if (toolbenchRecentDecisionOutcomeProgressTimer) {
    window.clearTimeout(toolbenchRecentDecisionOutcomeProgressTimer);
    toolbenchRecentDecisionOutcomeProgressTimer = null;
  }
  if (!context || !progress?.copy) {
    toolbenchRecentDecisionOutcomeProgress = null;
    return;
  }
  const recordKey = snapshotRecordKeyForContext(context);
  if (!recordKey) {
    toolbenchRecentDecisionOutcomeProgress = null;
    return;
  }
  toolbenchRecentDecisionOutcomeProgress = {
    recordKey,
    copy: progress.copy,
    tone: progress.tone || ""
  };
  toolbenchRecentDecisionOutcomeProgressTimer = window.setTimeout(() => {
    toolbenchRecentDecisionOutcomeProgress = null;
    toolbenchRecentDecisionOutcomeProgressTimer = null;
    if (toolbenchRecord) renderV1ContextLayer(toolbenchRecord);
  }, 3200);
}

function summarizeDecisionOutcomeProgress(beforeOutcome = null, afterOutcome = null) {
  if (!beforeOutcome || !afterOutcome) return null;
  if (beforeOutcome.title === afterOutcome.title && beforeOutcome.tone === afterOutcome.tone) return null;
  if (afterOutcome.title === "Ready for landlord note") {
    return {
      copy: "Progress: ready for landlord note now.",
      tone: "strong"
    };
  }
  if (beforeOutcome.tone === "caution" && afterOutcome.tone !== "caution") {
    return {
      copy: "Progress: blocker addressed.",
      tone: "strong"
    };
  }
  if (
    beforeOutcome.tone === "watch" ||
    afterOutcome.tone === "watch" ||
    beforeOutcome.title !== afterOutcome.title
  ) {
    return {
      copy: "Progress: review tightened.",
      tone: "watch"
    };
  }
  return null;
}

function updateDecisionOutcomeHistory(context = null, beforeOutcome = null, afterOutcome = null) {
  const recordKey = snapshotRecordKeyForContext(context);
  if (!recordKey || !beforeOutcome || !afterOutcome) return;
  if (beforeOutcome.title === afterOutcome.title) return;
  toolbenchDecisionOutcomeHistoryByRecord[recordKey] = {
    from: beforeOutcome.title,
    to: afterOutcome.title,
    comparison: decisionOutcomeComparisonLabel(beforeOutcome, afterOutcome)
  };
}

function summarizeCommercialSnapshotForContext(context = null) {
  if (!context) return null;
  const rentSignal = context.rentSignal || {};
  const valueGap = context.valueGapSignal || {};
  const surrounding = context.surroundingBusinesses || {};
  const fitScores = Array.isArray(context.unitSuitability?.fitScores) ? context.unitSuitability.fitScores : [];
  const decisionNotes = context.decisionNotes || {};
  const topFit = [...fitScores].sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;
  const competitionFlags = Array.isArray(surrounding.competitionFlags)
    ? surrounding.competitionFlags.map(signalLabel)
    : [];
  const complementaryFlags = Array.isArray(surrounding.complementaryFlags)
    ? surrounding.complementaryFlags.map(signalLabel)
    : [];
  const tradePressure = summarizeTradePressure(competitionFlags, complementaryFlags);
  const fitStrength = summarizeFitStrength(topFit, fitScores);
  const rentSignalRead = summarizeRentSignalRead(rentSignal);
  const valueGapRead = summarizeValueGapRead(valueGap, rentSignal);
  const healthSummary = summarizeV1Health(context);
  return summarizeCommercialSnapshot({
    context,
    rentSignalRead,
    valueGapRead,
    fitStrength,
    tradePressure,
    healthSummary,
    decisionNotes
  });
}

function markReviewedRefreshedContextSection(sectionKey = "") {
  const normalized = String(sectionKey || "").trim().toLowerCase();
  if (!normalized) return;
  if (toolbenchJustReviewedRefreshedSectionTimer) {
    window.clearTimeout(toolbenchJustReviewedRefreshedSectionTimer);
    toolbenchJustReviewedRefreshedSectionTimer = null;
  }
  const recordKey = currentRefreshedContextRecordKey();
  toolbenchReviewedRefreshedContextSections = {
    ...toolbenchReviewedRefreshedContextSections,
    [normalized]: true
  };
  toolbenchJustReviewedRefreshedSection = normalized;
  if (recordKey) {
    toolbenchReviewedRefreshedSectionsByRecord = {
      ...toolbenchReviewedRefreshedSectionsByRecord,
      [recordKey]: {
        ...(toolbenchReviewedRefreshedSectionsByRecord[recordKey] || {}),
        [normalized]: true
      }
    };
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  renderWorkspaceSourceTimeline(toolbenchRecord);
  renderV1ContextMeta(toolbenchContextDraft);
  toolbenchJustReviewedRefreshedSectionTimer = window.setTimeout(() => {
    toolbenchJustReviewedRefreshedSection = "";
    toolbenchJustReviewedRefreshedSectionTimer = null;
    renderWorkspaceSourceTimeline(toolbenchRecord);
  }, 1800);
}

function v1ContextMetaTimeTone({ captured = "", updated = "" } = {}) {
  if (!updated || updated === toolbenchReviewPassMessages.workspace.dateNotConnected()) return "";
  if (!captured || captured === toolbenchReviewPassMessages.workspace.dateNotConnected()) return "saved";
  return updated === captured ? "internal" : "saved";
}

function v1ContextCapturedSourceLabel(context) {
  if (!context) return "";
  if (context.capturedAt) return "the context bundle";
  if (context.rentSignal?.capturedAt) return "the rent signal layer";
  if (context.valueGapSignal?.capturedAt) return "the value-gap layer";
  return "";
}

function v1ContextCapturedTone(context, updatedAt = "") {
  if (!context) return "";
  if (context.capturedAt) {
    return updatedAt && formatShortDate(context.capturedAt) === updatedAt ? "internal" : "bundle";
  }
  if (context.rentSignal?.capturedAt) return "rent-layer";
  if (context.valueGapSignal?.capturedAt) return "valuegap-layer";
  return "";
}

function summarizeV1Health(context) {
  if (!context) {
    return {
      state: "weak",
      passed: 0,
      total: 5,
      title: toolbenchReviewPassMessages.v1Context.noLinkedTitle(),
      copy: toolbenchReviewPassMessages.v1Context.noLinkedCopy(),
      items: [],
      checks: [],
      actions: [toolbenchReviewPassMessages.v1Context.noLinkedAction()],
      nextAction: toolbenchReviewPassMessages.v1Context.noLinkedNextAction(),
      nextLabel: null
    };
  }
  if (context.contextHealth?.total && Array.isArray(context.contextHealth?.checks)) {
    const summary = context.contextHealth;
    const state = summary.state || (summary.passed >= summary.total ? "strong" : summary.passed >= 3 ? "partial" : "weak");
    const checks = summary.checks.map((check) => ({
      label: check.label,
      ok: Boolean(check.ok)
    }));
    const guidance = deriveV1HealthActions(checks, state);
    return {
      state,
      passed: Number(summary.passed) || 0,
      total: Number(summary.total) || 5,
      title: toolbenchReviewPassMessages.health.summaryTitle({
        passed: summary.passed,
        total: summary.total,
        state: v1HealthStateLabel(state)
      }),
      copy: v1HealthStateCopy(state),
      items: checks.map(v1HealthCheckItem),
      checks,
      actions: guidance.actions,
      nextAction: guidance.nextAction,
      nextLabel: guidance.nextLabel
    };
  }

  const rentSignal = context.rentSignal || {};
  const valueGap = context.valueGapSignal || {};
  const surrounding = context.surroundingBusinesses || {};
  const fitScores = Array.isArray(context.unitSuitability?.fitScores) ? context.unitSuitability.fitScores : [];
  const decisionNotes = context.decisionNotes || {};
  const checks = [
    {
      label: toolbenchReviewPassMessages.health.labelRentSignal(),
      ok:
        Number.isFinite(rentSignal.benchmarkLowPsf) &&
        Number.isFinite(rentSignal.benchmarkHighPsf) &&
        Number.isFinite(rentSignal.askingPsf) &&
        Boolean(rentSignal.verdict) &&
        Boolean(rentSignal.confidence)
    },
    {
      label: toolbenchReviewPassMessages.health.labelValueGap(),
      ok: Boolean(valueGap.status) && Boolean(valueGap.gapDirection) && typeof valueGap.summary === "string" && valueGap.summary.trim().length > 0
    },
    {
      label: toolbenchReviewPassMessages.health.labelSurroundingTrade(),
      ok:
        Array.isArray(surrounding.categoryMix) &&
        surrounding.categoryMix.length > 0 &&
        typeof surrounding.tradePattern === "string" &&
        surrounding.tradePattern.trim().length > 0
    },
    {
      label: toolbenchReviewPassMessages.health.labelSuitability(),
      ok: fitScores.length > 0 && fitScores.some((item) => Number.isFinite(item.score)) && fitScores.some((item) => item.rationale)
    },
    {
      label: toolbenchReviewPassMessages.health.labelDecisionNote(),
      ok:
        typeof decisionNotes.summary === "string" &&
        decisionNotes.summary.trim().length > 0 &&
        typeof decisionNotes.negotiationAngle === "string" &&
        decisionNotes.negotiationAngle.trim().length > 0
    }
  ];
  const passed = checks.filter((check) => check.ok).length;
  const state = passed >= 5 ? "strong" : passed >= 3 ? "partial" : "weak";
  const guidance = deriveV1HealthActions(checks, state);
  return {
    state,
    passed,
    total: 5,
    title: toolbenchReviewPassMessages.health.summaryTitle({
      passed,
      total: 5,
      state: v1HealthStateLabel(state)
    }),
    copy: v1HealthStateCopy(state),
    items: checks.map(v1HealthCheckItem),
    checks,
    actions: guidance.actions,
    nextAction: guidance.nextAction,
    nextLabel: guidance.nextLabel
  };
}

function renderV1Health(context) {
  if (
    !toolbenchEl.v1Health ||
    !toolbenchEl.v1HealthTitle ||
    !toolbenchEl.v1HealthCopy ||
    !toolbenchEl.v1HealthList ||
    !toolbenchEl.v1HealthQueue ||
    !toolbenchEl.v1HealthOrigin ||
    !toolbenchEl.v1HealthAudit ||
    !toolbenchEl.v1HealthSync ||
    !toolbenchEl.v1HealthProgress ||
    !toolbenchEl.v1HealthFinish
  ) return;
  const summary = summarizeV1Health(context);
  const queueItems = reviewQueueItems();
  const resolvedCount = resolvedReviewQueueCount();
  toolbenchEl.v1Health.dataset.state = summary.state;
  toolbenchEl.v1HealthTitle.textContent = summary.title;
  toolbenchEl.v1HealthCopy.textContent = summary.copy;
  if (toolbenchEl.v1HealthAction) {
    toolbenchEl.v1HealthAction.textContent = summary.nextAction;
    toolbenchEl.v1HealthAction.dataset.targetLabel = summary.nextLabel || "";
    toolbenchEl.v1HealthAction.disabled = !summary.nextLabel;
  }
  if (toolbenchEl.v1HealthNextRecord) {
    toolbenchEl.v1HealthNextRecord.disabled = queueItems.length === 0;
    toolbenchEl.v1HealthNextRecord.textContent = toolbenchReviewPassMessages.health.nextReviewItem({
      count: queueItems.length
    });
  }
  if (toolbenchEl.v1HealthResetPass) {
    toolbenchEl.v1HealthResetPass.hidden = resolvedCount === 0;
    toolbenchEl.v1HealthResetPass.disabled = resolvedCount === 0;
    toolbenchEl.v1HealthResetPass.textContent = toolbenchReviewPassMessages.health.startNewPass({
      resolvedCount
    });
  }
  const queue = v1ReviewQueueSummary();
  toolbenchEl.v1HealthQueue.textContent = queue;
  toolbenchEl.v1HealthQueue.dataset.state = summary.state;
  toolbenchEl.v1HealthOrigin.textContent =
    toolbenchReviewPassOrigin === "backend"
      ? toolbenchReviewPassMessages.origin.healthBackend()
      : toolbenchReviewPassOrigin === "session"
        ? toolbenchReviewPassMessages.origin.healthSession()
        : toolbenchReviewPassMessages.origin.healthLocal();
  toolbenchEl.v1HealthOrigin.dataset.state = toolbenchReviewPassOrigin;
  toolbenchEl.v1HealthAudit.textContent = reviewPassAuditCopy();
  toolbenchEl.v1HealthSync.textContent = reviewPassSyncCopy();
  toolbenchEl.v1HealthSync.dataset.state = toolbenchReviewPassSync.state;
  const scopeComplete = resolvedCount > 0 && queueItems.length === 0;
  if (!scopeComplete) {
    toolbenchHealthPassDetailExpanded = false;
  }
  toolbenchEl.v1HealthProgress.replaceChildren();
  toolbenchEl.v1HealthProgress.dataset.state = resolvedCount > 0 ? "progress" : summary.state;
  if (scopeComplete) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "workspace-v1-health-detail-toggle";
    toggle.dataset.expanded = toolbenchHealthPassDetailExpanded ? "true" : "false";
    toggle.textContent = toolbenchHealthPassDetailExpanded
      ? toolbenchReviewPassMessages.health.hideResolvedDetail()
      : toolbenchReviewPassMessages.health.showResolvedDetail();
    toggle.title = toolbenchHealthPassDetailExpanded
      ? "Hide the resolved-review detail for this completed pass."
      : "Show the resolved-review detail for this completed pass.";
    toggle.addEventListener("click", () => {
      toolbenchHealthPassDetailExpanded = !toolbenchHealthPassDetailExpanded;
      renderV1Health(contextRecordForRecord(toolbenchRecord));
    });
    toolbenchEl.v1HealthProgress.append(toggle);
    if (toolbenchHealthPassDetailExpanded) {
      const detail = document.createElement("span");
      detail.className = "workspace-v1-health-progress-detail";
      detail.textContent = toolbenchReviewPassMessages.health.resolvedThisPass({
        resolvedCount
      });
      toolbenchEl.v1HealthProgress.append(detail);
    }
  } else {
    toolbenchEl.v1HealthProgress.textContent = toolbenchReviewPassMessages.health.resolvedThisPass({
      resolvedCount
    });
  }
  toolbenchEl.v1HealthFinish.hidden = !scopeComplete;
  toolbenchEl.v1HealthFinish.textContent = scopeComplete
    ? toolbenchReviewPassMessages.finish.complete({
        resolvedCount,
        scope: quickPickFilterDescription()
      })
    : toolbenchReviewPassMessages.health.currentScopeComplete();
  toolbenchEl.v1HealthList.replaceChildren();
  if (!summary.checks?.length) {
    const item = document.createElement("li");
    item.textContent = toolbenchReviewPassMessages.health.noHealthChecks();
    toolbenchEl.v1HealthList.append(item);
    return;
  }
  summary.checks.forEach((check) => {
    const item = document.createElement("li");
    item.dataset.state = check.ok ? "pass" : "review";
    if (check.ok) {
      item.textContent = toolbenchReviewPassMessages.health.passCheck({ label: check.label });
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "workspace-v1-health-link";
      button.dataset.targetLabel = check.label;
      button.textContent = toolbenchReviewPassMessages.health.reviewCheck({ label: check.label });
      button.addEventListener("click", () => {
        jumpToV1HealthLabel(check.label);
      });
      item.append(button);
    }
    toolbenchEl.v1HealthList.append(item);
  });
}

function v1ReviewQueueSummary() {
  const queueItems = reviewQueueItems();
  if (!queueItems.length) {
    return toolbenchReviewPassMessages.health.queueEmpty({
      scope: quickPickFilterDescription()
    });
  }
  const currentIndex = currentReviewQueueIndex(queueItems);
  if (currentIndex >= 0) {
    return toolbenchReviewPassMessages.health.queueActive({
      index: currentIndex + 1,
      total: queueItems.length,
      scope: quickPickFilterDescription()
    });
  }
  const nextItem = queueItems[0];
  return toolbenchReviewPassMessages.health.queuePending({
    total: queueItems.length,
    scope: quickPickFilterDescription(),
    title: nextItem.record.title,
    label: nextItem.label
  });
}

function quickPickHealthSummary(record) {
  const context = contextRecordForRecord(record);
  const summary = summarizeV1Health(context);
  return `${summary.passed}/${summary.total} • ${summary.state}`;
}

function v1RosterLayerBreakdown(summaries = []) {
  const counts = new Map();
  summaries
    .filter((summary) => summary.state !== "strong")
    .forEach((summary) => {
      (summary.checks || []).forEach((check) => {
        if (check.ok) return;
        counts.set(check.label, (counts.get(check.label) || 0) + 1);
      });
    });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

function quickPickFilterDescription(filter = toolbenchQuickPickFilter, layerFilter = toolbenchQuickPickLayerFilter) {
  const stateLabels = {
    all: "all review areas",
    strong: "the strongest review areas",
    partial: "review areas that still need some work",
    weak: "review areas that need the most work",
    current: toolbenchRecord ? `the current area (${toolbenchRecord.title})` : "the current area"
  };
  const base = stateLabels[filter] || stateLabels.all;
  if (!layerFilter) return base;
  return `${base} that still need review for ${layerFilter}`;
}

function quickPickSortDescription(sortMode = toolbenchQuickPickSortMode) {
  if (sortMode === "improving") return "best improving";
  if (sortMode === "attention") return "needs attention";
  return "default";
}

function quickPickRecoveryOrderedLaneMeta(lens = null, records = []) {
  if (!lens || !Array.isArray(records) || !records.length) return null;
  const urgency = quickPickBookmarkUrgency(records);
  const momentum = summarizeLaneRoutedReviewMomentum(records);
  const snapshot = lens?.snapshot || { count: 0, weakCount: 0, partialCount: 0 };
  const currentSnapshot = quickPickBookmarkSnapshotForLens(lens);
  const degraded =
    currentSnapshot.count > snapshot.count ||
    currentSnapshot.weakCount > snapshot.weakCount ||
    (currentSnapshot.weakCount === snapshot.weakCount && currentSnapshot.partialCount > snapshot.partialCount);
  const priority = quickPickBookmarkPriority({ urgency, degraded, count: records.length });
  const laneKey = quickPickBookmarkKeyForLens(lens);
  const reopenMemory = quickPickBookmarkReopenMemoryMeta(laneKey);
  const planningMemory = toolbenchQuickPickBookmarkPlanningMemoryByKey[laneKey] || null;
  const initialPlanningAction = quickPickBookmarkPlanningAction({
    count: records.length,
    degraded,
    resolved: false,
    priority,
    urgency,
    momentum,
    reopenMemory,
    planningMemory
  });
  const initialPlanningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
    planningAction: initialPlanningAction,
    momentum,
    reopenMemory,
    planningMemory
  });
  if (!initialPlanningReactivated) return null;
  const recoveryTarget = selectRecoveryTargetRecord(records, { recoveryTargetActionability: "" }, { mode: lens.sort || "default" });
  const recoveryTargetMemory = toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey[laneKey] || quickPickBookmarkRecoveryTargetMemoryMeta(laneKey, recoveryTarget ? { record: recoveryTarget } : null);
  const recoveryTargetActionability = quickPickBookmarkRecoveryTargetActionability(recoveryTargetMemory);
  return {
    key: laneKey,
    planningReactivated: true,
    recoveryTargetActionability
  };
}

function quickPickRecordsForLens(lens = currentQuickPickLensState(), { disableRecoveryOrdering = false } = {}) {
  const curatedIds = [
    "chinatown-shophouse",
    "orchard-mall",
    "bedok-hdb",
    "paya-lebar-retail",
    "novena-retail",
    "marina-bay-retail",
    "yishun-retail",
    "tiong-bahru-shophouse"
  ];
  const curatedRecords = curatedIds
    .map((id) => toolbenchRecords.find((record) => record.id === id))
    .filter(Boolean);
  const filter = lens?.filter || "all";
  const layerFilter = lens?.layerFilter || "";
  const sortMode = lens?.sort || "default";
  let filtered =
    filter === "all"
      ? curatedRecords
      : filter === "current"
        ? (toolbenchRecord ? [toolbenchRecord] : [])
        : curatedRecords.filter((record) => summarizeV1Health(contextRecordForRecord(record)).state === filter);
  if (layerFilter) {
    filtered = filtered.filter((record) =>
      summarizeV1Health(contextRecordForRecord(record)).checks.some(
        (check) => !check.ok && check.label === layerFilter
      )
    );
  }
  if (sortMode === "improving") {
    filtered = [...filtered].sort((a, b) => quickPickDecisionImprovingScore(b) - quickPickDecisionImprovingScore(a));
  } else if (sortMode === "attention") {
    filtered = [...filtered].sort((a, b) => quickPickDecisionAttentionScore(b) - quickPickDecisionAttentionScore(a));
  }
  const recoveryOrderedLane = disableRecoveryOrdering
    ? null
    : quickPickRecoveryOrderedLaneMeta(lens, filtered);
  if (recoveryOrderedLane) {
    filtered = [...filtered].sort((a, b) => {
      const scoreDiff = recoveryTargetCandidateScore(b, recoveryOrderedLane, { mode: sortMode }) - recoveryTargetCandidateScore(a, recoveryOrderedLane, { mode: sortMode });
      if (scoreDiff !== 0) return scoreDiff;
      return String(a?.title || "").localeCompare(String(b?.title || ""));
    });
  }
  if (toolbenchRecord && filter !== "current" && !recoveryOrderedLane) {
    const currentIndex = filtered.findIndex((record) => record.id === toolbenchRecord.id);
    if (currentIndex > 0) {
      const [currentRecord] = filtered.splice(currentIndex, 1);
      filtered.unshift(currentRecord);
    }
  }
  return filtered;
}

function quickPickDecisionAttentionScore(record) {
  const context = contextRecordForRecord(record);
  const outcome = summarizeCommercialSnapshotForContext(context)?.outcome || null;
  const history = currentDecisionOutcomeHistory(context);
  const health = summarizeV1Health(context);
  const routedOutcome = routedReviewOutcomeForRecord(record);
  let score = 0;
  if (outcome?.tone === "caution") score += 30;
  else if (outcome?.tone === "watch") score += 18;
  else if (outcome?.tone === "strong") score += 6;
  if (health.state === "weak") score += 24;
  else if (health.state === "partial") score += 12;
  if (history?.comparison === "weaker") score += 16;
  else if (history?.comparison === "stronger") score -= 8;
  if (routedOutcome?.status === "next-active") score += 10;
  else if (routedOutcome?.status === "tightened") score -= 4;
  else if (routedOutcome?.status === "cleared") score -= 10;
  return score;
}

function quickPickDecisionImprovingScore(record) {
  const context = contextRecordForRecord(record);
  const outcome = summarizeCommercialSnapshotForContext(context)?.outcome || null;
  const history = currentDecisionOutcomeHistory(context);
  const health = summarizeV1Health(context);
  const routedOutcome = routedReviewOutcomeForRecord(record);
  let score = 0;
  if (history?.comparison === "stronger") score += 30;
  else if (history?.comparison === "weaker") score -= 18;
  if (outcome?.tone === "strong") score += 14;
  else if (outcome?.tone === "watch") score += 8;
  if (health.state === "strong") score += 10;
  else if (health.state === "partial") score += 4;
  if (routedOutcome?.status === "cleared") score += 22;
  else if (routedOutcome?.status === "tightened") score += 14;
  else if (routedOutcome?.status === "next-active") score += 6;
  return score;
}

function quickPickRecords() {
  return quickPickRecordsForLens(currentQuickPickLensState());
}

function quickPickBookmarkUrgency(records = []) {
  if (!records.length) return "";
  const summaries = records.map((record) => summarizeV1Health(contextRecordForRecord(record)));
  const weakCount = summaries.filter((summary) => summary.state === "weak").length;
  const partialCount = summaries.filter((summary) => summary.state === "partial").length;
  if (weakCount && weakCount >= partialCount) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyWeak();
  }
  if (!weakCount && partialCount <= 1) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear();
  }
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyMixed();
}

function quickPickBookmarkPriority({ urgency = "", degraded = false, resolved = false, count = 0 } = {}) {
  if (!count) return toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater();
  if (degraded || urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyWeak()) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityNow();
  }
  if (resolved && urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear()) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater();
  }
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch();
}

function quickPickBookmarkPriorityScore({ priority = "", count = 0, degraded = false, recent = false } = {}) {
  let score = 0;
  if (priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityNow()) score += 300;
  else if (priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch()) score += 180;
  else score += 80;
  score += Math.min(Math.max(count, 0), 12) * 8;
  if (degraded) score += 36;
  if (recent) score += 10;
  return score;
}

function quickPickBookmarkPriorityReason({ urgency = "", degraded = false, count = 0 } = {}) {
  if (degraded) return toolbenchReviewPassMessages.workspace.quickPickBookmarkDegraded();
  if (urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyWeak()) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyWeak();
  }
  if (count >= 4) return "largest remaining queue";
  if (urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear()) {
    return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear();
  }
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyMixed();
}

function quickPickBookmarkWorkType({ urgency = "", degraded = false, priority = "", count = 0 } = {}) {
  if (!count) return "";
  if (degraded || priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityNow()) {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkBlocker();
  }
  if (urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyWeak()) {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCleanup();
  }
  if (urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear()) {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCloseout();
  }
  return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkWatch();
}

function routedReviewOutcomeForRecord(record = null) {
  const key = normalizeDecisionContextKey(record?.id || record?.title || "");
  if (!key) return null;
  const outcome = toolbenchRoutedReviewOutcomeByRecord[key];
  return outcome?.status ? outcome : null;
}

function summarizeRoutedReviewOutcome(status = "") {
  if (status === "cleared") return "recently checked";
  if (status === "tightened") return "recently improved";
  if (status === "next-active") return "needs another check";
  if (status === "tempered-cleared") return "recently checked with light caution";
  if (status === "tempered-tightened") return "recently improved with light caution";
  if (status === "tempered-next-active") return "needs another check with light caution";
  return "";
}

function quickPickRecordMomentumMeta(status = "") {
  if (status === "cleared") return "Recently checked";
  if (status === "tightened") return "Recently improved";
  if (status === "next-active") return "Needs another check";
  if (status === "tempered-cleared") return "Checked with caution";
  if (status === "tempered-tightened") return "Improved with caution";
  if (status === "tempered-next-active") return "Needs caution";
  return "";
}

function summarizeLaneRoutedReviewMomentum(records = []) {
  return records.reduce((summary, record) => {
    const outcome = routedReviewOutcomeForRecord(record);
    if (!outcome?.status) return summary;
    if (outcome.status === "cleared") summary.cleared += 1;
    else if (outcome.status === "tightened") summary.tightened += 1;
    else if (outcome.status === "next-active") summary.nextActive += 1;
    else if (outcome.status === "tempered-cleared") summary.temperedCleared += 1;
    else if (outcome.status === "tempered-tightened") summary.temperedTightened += 1;
    else if (outcome.status === "tempered-next-active") summary.temperedNextActive += 1;
    summary.score += Number(outcome.score || 0);
    return summary;
  }, { cleared: 0, tightened: 0, nextActive: 0, temperedCleared: 0, temperedTightened: 0, temperedNextActive: 0, score: 0 });
}

function laneMomentumHasTempered(momentum = null) {
  if (!momentum) return false;
  return Boolean(
    Number(momentum.temperedCleared || 0) ||
    Number(momentum.temperedTightened || 0) ||
    Number(momentum.temperedNextActive || 0)
  );
}

function quickPickBookmarkTemperedSignal(momentum = null) {
  if (!laneMomentumHasTempered(momentum)) return "";
  if (Number(momentum?.temperedNextActive || 0) > 0) return "extra caution";
  if (Number(momentum?.temperedCleared || 0) > 0 || Number(momentum?.temperedTightened || 0) > 0) {
    return "careful progress";
  }
  return "";
}

function quickPickBookmarkPlanningTemperedReason(action = "", momentum = null) {
  const tempered = quickPickBookmarkTemperedSignal(momentum);
  if (!tempered) return "";
  if (action === "refresh this lane" && tempered === "extra caution") {
    return "triggered by extra caution";
  }
  if (action === "close out this lane" && tempered === "careful progress") {
    return "triggered by careful progress";
  }
  return `guided by ${tempered}`;
}

function quickPickBookmarkPlanningCooldownMs(momentum = null) {
  const tempered = quickPickBookmarkTemperedSignal(momentum);
  if (tempered === "tempered routed progress") return 12 * 60 * 1000;
  if (tempered === "tempered routed pressure") return 28 * 60 * 1000;
  return 20 * 60 * 1000;
}

function quickPickBookmarkPlanningCooldownLabel(momentum = null) {
  const tempered = quickPickBookmarkTemperedSignal(momentum);
  if (tempered === "tempered routed progress") return "Shorter progress cooldown.";
  if (tempered === "tempered routed pressure") return "Longer pressure cooldown.";
  return "";
}

function quickPickBookmarkPlanningCooldownTone(momentum = null) {
  const tempered = quickPickBookmarkTemperedSignal(momentum);
  if (tempered === "tempered routed progress") return "progress";
  if (tempered === "tempered routed pressure") return "pressure";
  return "";
}

function quickPickBookmarkPlanningCooldownStage(planningMemory = null, momentum = null) {
  const recentAt = planningMemory?.at ? new Date(planningMemory.at) : null;
  if (!(recentAt instanceof Date) || Number.isNaN(recentAt.getTime())) return "";
  const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
  if (!cooldownMs) return "";
  const elapsed = Date.now() - recentAt.getTime();
  if (elapsed < 0 || elapsed >= cooldownMs) return "";
  return elapsed < cooldownMs / 2 ? "early" : "late";
}

function quickPickBookmarkPlanningCooldownStageLabel(planningMemory = null, momentum = null) {
  const stage = quickPickBookmarkPlanningCooldownStage(planningMemory, momentum);
  if (stage === "early") return "Early in cooldown.";
  if (stage === "late") return "Late in cooldown.";
  return "";
}

function quickPickBookmarkPlanningCooldownRecoveryScore(planningMemory = null, momentum = null) {
  const stage = quickPickBookmarkPlanningCooldownStage(planningMemory, momentum);
  if (stage === "late") return 4;
  if (stage === "early") return 0;
  return 0;
}

function quickPickBookmarkPlanningRecoveryHint(lane = null) {
  const stage = quickPickBookmarkPlanningCooldownStage(lane?.planningMemory || null, lane?.momentum || null);
  if (stage === "late") {
    return `${quickPickBookmarkLabel(lane?.key || "")} is recovering priority late in cooldown`;
  }
  if (stage === "early") {
    return `${quickPickBookmarkLabel(lane?.key || "")} is still early in cooldown`;
  }
  return "";
}

function quickPickBookmarkMomentumQuality(momentum = null) {
  if (!momentum) return "";
  const progressCount =
    Number(momentum.cleared || 0) +
    Number(momentum.tightened || 0) +
    Number(momentum.temperedCleared || 0) +
    Number(momentum.temperedTightened || 0);
  const pressureCount = Number(momentum.nextActive || 0) + Number(momentum.temperedNextActive || 0);
  if ((momentum.nextActive || 0) >= 2) return "sustained routed pressure";
  if (pressureCount >= 2) return "sustained routed pressure";
  if ((momentum.cleared || 0) >= 2 || progressCount >= 3) return "sustained routed progress";
  if (progressCount >= 2) return "repeated routed progress";
  if ((momentum.temperedNextActive || 0) === 1) return "fresh routed pressure";
  if ((momentum.nextActive || 0) === 1) return "fresh routed pressure";
  if ((momentum.temperedCleared || 0) === 1) return "fresh routed clear";
  if ((momentum.cleared || 0) === 1) return "fresh routed clear";
  if ((momentum.temperedTightened || 0) === 1) return "fresh routed tightening";
  if ((momentum.tightened || 0) === 1) return "fresh routed tightening";
  return "";
}

function quickPickBookmarkMomentumQualityScore(momentum = null) {
  const quality = quickPickBookmarkMomentumQuality(momentum);
  if (quality === "sustained routed pressure") return 12;
  if (quality === "sustained routed progress") return 14;
  if (quality === "repeated routed progress") return 8;
  if (quality === "fresh routed pressure") return 4;
  if (quality === "fresh routed clear") return 6;
  if (quality === "fresh routed tightening") return 5;
  return 0;
}

function quickPickRecordWorkType({ healthSummary = null, decisionOutcome = null, decisionHistory = null } = {}) {
  if (!healthSummary) return "";
  if (decisionOutcome?.tone === "caution" || healthSummary.state === "weak" || decisionHistory?.comparison === "weaker") {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkBlocker();
  }
  if (healthSummary.state === "partial") {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCleanup();
  }
  if (decisionHistory?.comparison === "stronger" || decisionOutcome?.tone === "strong") {
    return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCloseout();
  }
  return toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkWatch();
}

function routedRecordCueForContext(context = null, workType = "") {
  if (!context || !workType) return null;
  const snapshot = summarizeCommercialSnapshotForContext(context);
  const healthSummary = summarizeV1Health(context);
  if (!snapshot) return null;
  if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkBlocker()) {
    const item = snapshot.constraint || snapshot.outcome || snapshot.nextMove || null;
    return item
      ? {
          cardKey: snapshot.constraint ? "constraint" : snapshot.outcome ? "outcome" : "nextMove",
          action: item.action || "",
          validationSection: decisionFocusSectionForAction(item.action || ""),
          workType
        }
      : null;
  }
  if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCleanup()) {
    const action = healthSummary?.nextLabel
      ? v1ReadActionForHealthLabel(healthSummary.nextLabel)
      : snapshot.nextMove?.action || snapshot.outcome?.action || "";
    return {
      cardKey: "nextMove",
      action,
      validationSection: decisionFocusSectionForAction(action),
      workType
    };
  }
  if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCloseout()) {
    const item = snapshot.outcome || snapshot.nextMove || null;
    return item
      ? {
          cardKey: snapshot.outcome ? "outcome" : "nextMove",
          action: item.action || "",
          validationSection: decisionFocusSectionForAction(item.action || ""),
          workType
        }
      : null;
  }
  return {
    cardKey: "nextMove",
    action: snapshot.nextMove?.action || snapshot.outcome?.action || "",
    validationSection: decisionFocusSectionForAction(snapshot.nextMove?.action || snapshot.outcome?.action || ""),
    workType
  };
}

function currentRoutedRecordCueForContext(context = toolbenchContextDraft) {
  if (!toolbenchRoutedRecordWorkCue.active || !context) return null;
  const recordKey = normalizeDecisionContextKey(context.recordId || context.contextRecordId || "");
  if (!recordKey || recordKey !== toolbenchRoutedRecordWorkCue.recordId) return null;
  return toolbenchRoutedRecordWorkCue.workType ? toolbenchRoutedRecordWorkCue : null;
}

function summarizeQuickPickWorkTypes(records = []) {
  return records.reduce((counts, record) => {
    const context = contextRecordForRecord(record);
    const workType = quickPickRecordWorkType({
      healthSummary: summarizeV1Health(context),
      decisionOutcome: summarizeCommercialSnapshotForContext(context)?.outcome || null,
      decisionHistory: currentDecisionOutcomeHistory(context)
    });
    if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkBlocker()) {
      counts.blocker += 1;
    } else if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCleanup()) {
      counts.cleanup += 1;
    } else if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkCloseout()) {
      counts.closeout += 1;
    } else if (workType === toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryWorkWatch()) {
      counts.watch += 1;
    }
    return counts;
  }, { blocker: 0, cleanup: 0, closeout: 0, watch: 0 });
}

function quickPickBookmarkMomentumReason(momentum = null) {
  if (!momentum) return "";
  return quickPickBookmarkMomentumQuality(momentum) || (
    momentum.nextActive > 0 ? summarizeRoutedReviewOutcome("next-active")
      : momentum.cleared > 0 ? summarizeRoutedReviewOutcome("cleared")
      : momentum.tightened > 0 ? summarizeRoutedReviewOutcome("tightened")
      : ""
  );
}

function quickPickBookmarkMemoryQuality(momentum = null, { restored = false } = {}) {
  const quality = quickPickBookmarkMomentumQuality(momentum);
  if (!quality) return "";
  if (!restored && !quality.startsWith("sustained ")) return "";
  return quality;
}

function quickPickBookmarkRestorePriorityHint(topLane = null, currentKey = "") {
  if (!topLane || !topLane.key) return "";
  const quality = quickPickBookmarkMemoryQuality(topLane.momentum, { restored: true });
  const tempered = quickPickBookmarkTemperedSignal(topLane.momentum);
  const reopenMemory = topLane.reopenMemory?.label || "";
  const recoveryPreference = quickPickBookmarkRecoveryChoicePreference(topLane);
  if (!quality && !tempered && !reopenMemory && !recoveryPreference) return "";
  if (currentKey && topLane.key === currentKey) return "";
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityHint({
    label: quickPickBookmarkLabel(topLane.key),
    quality,
    tempered,
    reopenMemory,
    recoveryPreference
  });
}

function quickPickBookmarkPriorityReopenNote(lane = null) {
  if (!lane || !lane.key) return "";
  const quality = quickPickBookmarkMemoryQuality(lane.momentum, { restored: true });
  const recovering = quickPickBookmarkPlanningCooldownStage(lane.planningMemory || null, lane.momentum || null) === "late";
  const recoveryLabel = recovering ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering() : "";
  return quality || recoveryLabel
    ? `priority lane reopened${quality ? ` • ${quality}` : ""}${recoveryLabel ? ` • ${recoveryLabel}` : ""}`
    : "";
}

function quickPickBookmarkRecoveryChoicePreference(lane = null) {
  const laneKey = lane?.key || quickPickBookmarkKeyForLens(lane || currentQuickPickLensState());
  if (!laneKey) return "";
  const choiceMemory = toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[laneKey] || null;
  if (!choiceMemory) return "";
  const lead = Number.isFinite(choiceMemory.lead) ? choiceMemory.lead : 0;
  const holdingAlternative = Number.isFinite(choiceMemory.holdingAlternative)
    ? choiceMemory.holdingAlternative
    : 0;
  const fadingAlternative = Number.isFinite(choiceMemory.fadingAlternative)
    ? choiceMemory.fadingAlternative
    : 0;
  const highest = Math.max(lead, holdingAlternative, fadingAlternative);
  if (highest < 1) return "";
  const recentPreference =
    highest >= 2
      ? ""
      : holdingAlternative === highest && holdingAlternative >= lead && holdingAlternative >= fadingAlternative
        ? "recent preference for a holding alternative"
        : fadingAlternative === highest && fadingAlternative >= lead && fadingAlternative >= holdingAlternative
          ? "recent preference for a fading alternative"
          : lead === highest && lead >= holdingAlternative && lead >= fadingAlternative
            ? "recent preference for the lead recovery target"
            : "";
  if (recentPreference) return recentPreference;
  if (holdingAlternative === highest && holdingAlternative >= lead && holdingAlternative >= fadingAlternative) {
    return "learned preference for holding alternatives";
  }
  if (fadingAlternative === highest && fadingAlternative >= lead && fadingAlternative >= holdingAlternative) {
    return "learned preference for fading alternatives";
  }
  if (lead === highest && lead >= holdingAlternative && lead >= fadingAlternative) {
    return "learned preference for the lead recovery target";
  }
  return "";
}

function quickPickBookmarkRecoveryChoicePreferenceState(lane = null) {
  const laneKey = lane?.key || quickPickBookmarkKeyForLens(lane || currentQuickPickLensState());
  if (!laneKey) return "";
  const choiceMemory = toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[laneKey] || null;
  if (!choiceMemory) return "";
  const lead = Number.isFinite(choiceMemory.lead) ? choiceMemory.lead : 0;
  const holdingAlternative = Number.isFinite(choiceMemory.holdingAlternative)
    ? choiceMemory.holdingAlternative
    : 0;
  const fadingAlternative = Number.isFinite(choiceMemory.fadingAlternative)
    ? choiceMemory.fadingAlternative
    : 0;
  const highest = Math.max(lead, holdingAlternative, fadingAlternative);
  if (highest < 1) return "";
  if (holdingAlternative === highest && holdingAlternative >= lead && holdingAlternative >= fadingAlternative) {
    return "holding";
  }
  if (fadingAlternative === highest && fadingAlternative >= lead && fadingAlternative >= holdingAlternative) {
    return "fading";
  }
  if (lead === highest && lead >= holdingAlternative && lead >= fadingAlternative) {
    return "lead";
  }
  return "";
}

function recoveryAlternativeStateForRecord(record = null, lane = null) {
  if (!record || !lane?.planningReactivated) return "";
  const routedMomentum = routedReviewOutcomeForRecord(record);
  return lane?.recoveryTargetActionability === "holding recovery target" &&
    routedMomentum?.status !== "next-active" &&
    routedMomentum?.status !== "tempered-next-active"
    ? "holding"
    : "fading";
}

function quickPickBookmarkReopenMemoryLabel(bookmarkKey = "") {
  const count = Number.isFinite(toolbenchQuickPickBookmarkOpenCounts?.[bookmarkKey])
    ? toolbenchQuickPickBookmarkOpenCounts[bookmarkKey]
    : 0;
  return count >= 2
    ? toolbenchReviewPassMessages.workspace.quickPickBookmarkReopenMemory({ count })
    : "";
}

function quickPickBookmarkReopenMemoryMeta(bookmarkKey = "") {
  const memory = toolbenchQuickPickBookmarkOpenMemoryByKey?.[bookmarkKey] || { productive: 0, pressure: 0 };
  const productive = Number.isFinite(memory.productive) ? memory.productive : 0;
  const pressure = Number.isFinite(memory.pressure) ? memory.pressure : 0;
  if (productive >= 2 && productive >= pressure) {
    return {
      type: "productive",
      label: toolbenchReviewPassMessages.workspace.quickPickBookmarkReopenMemoryProductive({ count: productive }),
      score: Math.min(productive, 3) * 5
    };
  }
  if (pressure >= 2) {
    return {
      type: "pressure",
      label: toolbenchReviewPassMessages.workspace.quickPickBookmarkReopenMemoryPressure({ count: pressure }),
      score: Math.min(pressure, 3) * 5
    };
  }
  return {
    type: "",
    label: quickPickBookmarkReopenMemoryLabel(bookmarkKey),
    score: Math.min(Number.isFinite(toolbenchQuickPickBookmarkOpenCounts?.[bookmarkKey]) ? toolbenchQuickPickBookmarkOpenCounts[bookmarkKey] : 0, 3) * 4
  };
}

function classifyQuickPickBookmarkReopenMemory(momentum = null) {
  if (!momentum) return "";
  if (momentum.cleared > 0 || momentum.tightened > momentum.nextActive) return "productive";
  if (momentum.nextActive > 0) return "pressure";
  return "";
}

function quickPickBookmarkRecoveryTargetMemoryMeta(bookmarkKey = "", recoveryTarget = null) {
  const sampleMs = 45 * 1000;
  const currentTitle = typeof recoveryTarget?.record?.title === "string"
    ? recoveryTarget.record.title.trim()
    : "";
  const previous = toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey[bookmarkKey] || {
    title: "",
    stable: 0,
    fading: 0,
    lastAt: ""
  };
  const lastAt = previous.lastAt ? new Date(previous.lastAt) : null;
  const now = Date.now();
  const canSample =
    !(lastAt instanceof Date) ||
    Number.isNaN(lastAt.getTime()) ||
    now - lastAt.getTime() >= sampleMs;
  let next = previous;
  let changed = false;
  if (currentTitle) {
    if (!previous.title || previous.title === currentTitle) {
      if (canSample) {
        next = {
          title: currentTitle,
          stable: Math.min((previous.stable || 0) + 1, 4),
          fading: Math.max((previous.fading || 0) - 1, 0),
          lastAt: new Date(now).toISOString()
        };
        changed = true;
      } else if (previous.title !== currentTitle) {
        next = { ...previous, title: currentTitle };
        changed = true;
      }
    } else if (canSample) {
      next = {
        title: currentTitle,
        stable: 1,
        fading: Math.min((previous.fading || 0) + 1, 4),
        lastAt: new Date(now).toISOString()
      };
      changed = true;
    }
  } else if (previous.title && canSample) {
    next = {
      title: "",
      stable: 0,
      fading: Math.min((previous.fading || 0) + 1, 4),
      lastAt: new Date(now).toISOString()
    };
    changed = true;
  }
  if (changed) {
    toolbenchQuickPickBookmarkRecoveryTargetMemoryByKey[bookmarkKey] = next;
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  const trend =
    next.title && next.stable >= 2
      ? "stable"
      : !next.title && next.fading >= 1
        ? "fading"
        : next.title && next.fading >= 2 && next.stable <= 1
          ? "fading"
          : "";
  const label =
    trend === "stable"
      ? "stable recovery target"
      : trend === "fading"
        ? "fading recovery target"
        : "";
  return {
    ...next,
    changed,
    trend,
    label,
    score:
      trend === "stable"
        ? 4
        : trend === "fading"
          ? -4
          : 0
  };
}

function quickPickBookmarkRecoveryTargetActionability(memory = null) {
  if (!memory) return "";
  if (memory.trend === "stable" && memory.stable >= 3) return "holding recovery target";
  if (memory.trend === "fading" && memory.fading >= 2) {
    return memory.title ? "recovery target losing actionability" : "recovery target faded";
  }
  return "";
}

function quickPickBookmarkPlanningAction({
  count = 0,
  degraded = false,
  resolved = false,
  priority = "",
  urgency = "",
  momentum = null,
  reopenMemory = null,
  planningMemory = null,
  hasRecoveryTarget = false,
  recoveryTargetTrend = "",
  recoveryTargetActionability = ""
} = {}) {
  const temperedSignal = quickPickBookmarkTemperedSignal(momentum);
  const temperedPressure = temperedSignal === "tempered routed pressure";
  const temperedProgress = temperedSignal === "tempered routed progress";
  const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
  const cooldownStage = quickPickBookmarkPlanningCooldownStage(planningMemory, momentum);
  const recentAction = typeof planningMemory?.action === "string" ? planningMemory.action : "";
  const recentAt = planningMemory?.at ? new Date(planningMemory.at) : null;
  const isRecentRepeat =
    recentAction &&
    recentAt instanceof Date &&
    !Number.isNaN(recentAt.getTime()) &&
    Date.now() - recentAt.getTime() < cooldownMs;
  const canReissueRefresh =
    cooldownStage === "late" && (temperedPressure || reopenMemory?.type === "pressure");
  const canReissueCloseout =
    cooldownStage === "late" && (temperedProgress || reopenMemory?.type === "productive");
  if (!count) {
    return isRecentRepeat && recentAction === "deprioritize lane"
      ? "keep this lane active"
      : "deprioritize lane";
  }
  if (
    hasRecoveryTarget &&
    recoveryTargetActionability === "holding recovery target" &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    !degraded &&
    !resolved
  ) {
    return "keep this lane active";
  }
  if (
    hasRecoveryTarget &&
    recoveryTargetActionability === "recovery target losing actionability" &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    (reopenMemory?.type === "productive" || temperedProgress) &&
    !resolved
  ) {
    return isRecentRepeat && recentAction === "deprioritize lane"
      ? "keep this lane active"
      : "deprioritize lane";
  }
  if (
    recoveryTargetActionability === "recovery target faded" &&
    (
      priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() ||
      priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater()
    ) &&
    (reopenMemory?.type === "productive" || temperedProgress || !hasRecoveryTarget)
  ) {
    return isRecentRepeat && recentAction === "deprioritize lane"
      ? "keep this lane active"
      : "deprioritize lane";
  }
  if (
    recoveryTargetActionability === "recovery target losing actionability" &&
    (reopenMemory?.type === "pressure" || temperedPressure)
  ) {
    return isRecentRepeat && recentAction === "refresh this lane" && !canReissueRefresh
      ? "keep this lane active"
      : "refresh this lane";
  }
  if (
    hasRecoveryTarget &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    (reopenMemory?.type === "pressure" || temperedPressure)
  ) {
    return isRecentRepeat && recentAction === "refresh this lane" && !canReissueRefresh
      ? "keep this lane active"
      : "refresh this lane";
  }
  if (degraded || reopenMemory?.type === "pressure" || temperedPressure) {
    return isRecentRepeat && recentAction === "refresh this lane" && !canReissueRefresh
      ? "keep this lane active"
      : "refresh this lane";
  }
  if (
    resolved &&
    urgency === toolbenchReviewPassMessages.workspace.quickPickBookmarkUrgencyNearClear() &&
    (
      reopenMemory?.type === "productive" ||
      priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater() ||
      temperedProgress
    )
  ) {
    return isRecentRepeat && recentAction === "close out this lane" && !canReissueCloseout
      ? "keep this lane active"
      : "close out this lane";
  }
  if (temperedProgress && priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater()) {
    return isRecentRepeat && recentAction === "close out this lane" && !canReissueCloseout
      ? "keep this lane active"
      : "close out this lane";
  }
  if (
    hasRecoveryTarget &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    (reopenMemory?.type === "productive" || temperedProgress)
  ) {
    return isRecentRepeat && recentAction === "close out this lane" && !canReissueCloseout
      ? "keep this lane active"
      : "close out this lane";
  }
  if (priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityLater()) {
    return isRecentRepeat && recentAction === "deprioritize lane"
      ? "keep this lane active"
      : "deprioritize lane";
  }
  return "keep this lane active";
}

function quickPickBookmarkPlanningRecoveryReactivated({
  planningAction = "",
  momentum = null,
  reopenMemory = null,
  planningMemory = null
} = {}) {
  const cooldownStage = quickPickBookmarkPlanningCooldownStage(planningMemory, momentum);
  const repeatedReopenSignal = Number(reopenMemory?.score || 0) >= 10;
  const repeatedGenericReopenSignal = !reopenMemory?.type && Number(reopenMemory?.score || 0) >= 12;
  if (
    cooldownStage !== "late" &&
    !(
      (
        repeatedReopenSignal &&
        (
          (planningAction === "refresh this lane" && reopenMemory?.type === "pressure") ||
          (planningAction === "close out this lane" && reopenMemory?.type === "productive")
        )
      ) ||
      (
        repeatedGenericReopenSignal &&
        (
          planningAction === "refresh this lane" ||
          planningAction === "close out this lane"
        )
      )
    )
  ) {
    return false;
  }
  const recentAction = typeof planningMemory?.action === "string" ? planningMemory.action : "";
  const recentAt = planningMemory?.at ? new Date(planningMemory.at) : null;
  const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
  const isRecentRepeat =
    recentAction &&
    recentAt instanceof Date &&
    !Number.isNaN(recentAt.getTime()) &&
    Date.now() - recentAt.getTime() < cooldownMs;
  if (!isRecentRepeat || recentAction !== planningAction) {
    return repeatedReopenSignal && (
      (planningAction === "refresh this lane" && reopenMemory?.type === "pressure") ||
      (planningAction === "close out this lane" && reopenMemory?.type === "productive")
    ) || (
      repeatedGenericReopenSignal &&
      (planningAction === "refresh this lane" || planningAction === "close out this lane")
    );
  }
  const temperedSignal = quickPickBookmarkTemperedSignal(momentum);
  if (
    planningAction === "refresh this lane" &&
    (temperedSignal === "tempered routed pressure" || reopenMemory?.type === "pressure")
  ) {
    return true;
  }
  if (
    planningAction === "close out this lane" &&
    (temperedSignal === "tempered routed progress" || reopenMemory?.type === "productive")
  ) {
    return true;
  }
  return false;
}

function quickPickBookmarkPlanningRecoveryTargetStrengthened({
  planningAction = "",
  priority = "",
  reopenMemory = null,
  momentum = null,
  hasRecoveryTarget = false
} = {}) {
  if (!hasRecoveryTarget) return false;
  const temperedSignal = quickPickBookmarkTemperedSignal(momentum);
  const temperedPressure = temperedSignal === "tempered routed pressure";
  const temperedProgress = temperedSignal === "tempered routed progress";
  if (
    planningAction === "refresh this lane" &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    (reopenMemory?.type === "pressure" || temperedPressure)
  ) {
    return true;
  }
  if (
    planningAction === "close out this lane" &&
    priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch() &&
    (reopenMemory?.type === "productive" || temperedProgress)
  ) {
    return true;
  }
  return false;
}

function quickPickBookmarkPlanningHoldReason(planningMemory = null, planningAction = "", momentum = null) {
  const recentAction = typeof planningMemory?.action === "string" ? planningMemory.action : "";
  const recentAt = planningMemory?.at ? new Date(planningMemory.at) : null;
  const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
  const isRecent =
    recentAction &&
    recentAt instanceof Date &&
    !Number.isNaN(recentAt.getTime()) &&
    Date.now() - recentAt.getTime() < cooldownMs;
  if (!isRecent || planningAction !== "keep this lane active") return "";
  return toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHoldReason({
    action: recentAction,
    cooldown: quickPickBookmarkPlanningCooldownLabel(momentum),
    stage: quickPickBookmarkPlanningCooldownStageLabel(planningMemory, momentum)
  });
}

function quickPickBookmarkPlanningMemoryScore(planningMemory = null, planningAction = "", momentum = null) {
  const recentAction = typeof planningMemory?.action === "string" ? planningMemory.action : "";
  const recentAt = planningMemory?.at ? new Date(planningMemory.at) : null;
  const tempered = quickPickBookmarkTemperedSignal(momentum);
  const cooldownMs = quickPickBookmarkPlanningCooldownMs(momentum);
  const recoveryScore = quickPickBookmarkPlanningCooldownRecoveryScore(planningMemory, momentum);
  const isRecent =
    recentAction &&
    recentAt instanceof Date &&
    !Number.isNaN(recentAt.getTime()) &&
    Date.now() - recentAt.getTime() < cooldownMs;
  if (!isRecent) return 0;
  if (planningAction !== "keep this lane active") return 0;
  if (recentAction === "refresh this lane") {
    return (tempered === "tempered routed pressure"
      ? -10
      : tempered === "tempered routed progress"
        ? -5
        : -8) + recoveryScore;
  }
  if (recentAction === "deprioritize lane") {
    return (tempered === "tempered routed pressure"
      ? -12
      : tempered === "tempered routed progress"
        ? -8
        : -10) + recoveryScore;
  }
  if (recentAction === "close out this lane") {
    return (tempered === "tempered routed pressure"
      ? -14
      : tempered === "tempered routed progress"
        ? -9
        : -12) + recoveryScore;
  }
  return -6 + recoveryScore;
}

function quickPickPriorityRunnerUpReason(topLane = null, runnerUpLane = null) {
  if (!topLane || !runnerUpLane) return "";
  if (topLane.recoveryTargetActionability !== runnerUpLane.recoveryTargetActionability) {
    if (topLane.recoveryTargetActionability === "holding recovery target") {
      return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} while its recovery target is still holding`;
    }
    if (
      topLane.recoveryTargetActionability === "recovery target losing actionability" &&
      !runnerUpLane.recoveryTargetActionability
    ) {
      return `narrowly ahead even while its recovery target is losing actionability`;
    }
    if (
      runnerUpLane.recoveryTargetActionability === "recovery target losing actionability" ||
      runnerUpLane.recoveryTargetActionability === "recovery target faded"
    ) {
      return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} while that lane's recovery target is fading`;
    }
  }
  if ((topLane.recoveryTargetScore || 0) !== (runnerUpLane.recoveryTargetScore || 0)) {
    if ((topLane.recoveryTargetScore || 0) > (runnerUpLane.recoveryTargetScore || 0)) {
      return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} on recovery-targeted landing clarity`;
    }
    if ((runnerUpLane.recoveryTargetScore || 0) > (topLane.recoveryTargetScore || 0)) {
      return `narrowly ahead even while ${quickPickBookmarkLabel(runnerUpLane.key)} has a clearer recovery-targeted landing path`;
    }
  }
  if (Boolean(topLane.planningReactivated) !== Boolean(runnerUpLane.planningReactivated)) {
    if (topLane.planningReactivated) {
      return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} after being reactivated by recovery`;
    }
    if (runnerUpLane.planningReactivated) {
      return `narrowly ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} even as that lane is being reactivated by recovery`;
    }
  }
  if ((topLane.planningMemoryScore || 0) !== (runnerUpLane.planningMemoryScore || 0)) {
    if ((runnerUpLane.planningMemoryScore || 0) < (topLane.planningMemoryScore || 0)) {
      const runnerUpRecovery = quickPickBookmarkPlanningRecoveryHint(runnerUpLane);
      return runnerUpRecovery
        ? `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} while ${runnerUpRecovery}`
        : `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} while that lane is cooling off after a recent action`;
    }
    if ((topLane.planningMemoryScore || 0) < (runnerUpLane.planningMemoryScore || 0)) {
      const topLaneRecovery = quickPickBookmarkPlanningRecoveryHint(topLane);
      return topLaneRecovery
        ? `narrowly ahead even while ${topLaneRecovery}`
        : `narrowly ahead even while ${quickPickBookmarkLabel(topLane.key)} is cooling off after a recent action`;
    }
  }
  if (Boolean(topLane.degraded) !== Boolean(runnerUpLane.degraded)) {
    return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} on degraded state`;
  }
  if (topLane.urgency !== runnerUpLane.urgency) {
    return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} on ${String(topLane.urgency || "").toLowerCase()}`;
  }
  if (topLane.count !== runnerUpLane.count) {
    return `ahead of ${quickPickBookmarkLabel(runnerUpLane.key)} on remaining queue size`;
  }
  return `narrowly ahead of ${quickPickBookmarkLabel(runnerUpLane.key)}`;
}

function quickPickPriorityGapLabel(gap = 0) {
  if (!Number.isFinite(gap) || gap <= 0) return "";
  if (gap <= 10) return `a very narrow ${gap}-pt gap`;
  if (gap <= 24) return `a narrow ${gap}-pt gap`;
  return `a modest ${gap}-pt gap`;
}

function rankedQuickPickBookmarks() {
  return Object.entries(toolbenchQuickPickBookmarks)
    .filter(([, lens]) => hasNonDefaultQuickPickLens(lens))
    .map(([key, lens]) => {
      const laneRecords = quickPickRecordsForLens(lens);
      const count = laneRecords.length;
      const urgency = quickPickBookmarkUrgency(laneRecords);
      const momentum = summarizeLaneRoutedReviewMomentum(laneRecords);
      const bookmarkSnapshot = lens?.snapshot || { count: 0, weakCount: 0, partialCount: 0 };
      const currentSnapshot = quickPickBookmarkSnapshotForLens(lens);
      const degraded =
        currentSnapshot.count > bookmarkSnapshot.count ||
        currentSnapshot.weakCount > bookmarkSnapshot.weakCount ||
        (currentSnapshot.weakCount === bookmarkSnapshot.weakCount && currentSnapshot.partialCount > bookmarkSnapshot.partialCount);
      const priority = quickPickBookmarkPriority({ urgency, degraded, count });
      const recent = key === toolbenchQuickPickBookmarkLastKey;
      const reopenMemory = quickPickBookmarkReopenMemoryMeta(key);
      const planningMemory = toolbenchQuickPickBookmarkPlanningMemoryByKey[key] || null;
      const initialPlanningAction = quickPickBookmarkPlanningAction({
        count,
        degraded,
        resolved: false,
        priority,
        urgency,
        momentum,
        reopenMemory,
        planningMemory
      });
      const initialPlanningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
        planningAction: initialPlanningAction,
        momentum,
        reopenMemory,
        planningMemory
      });
      const recoveryTarget = initialPlanningReactivated
        ? recoveryReactivatedLaneRecordTarget(
            {
              key,
              planningReactivated: initialPlanningReactivated
            },
            lens
          )
        : null;
      const recoveryTargetMemory = quickPickBookmarkRecoveryTargetMemoryMeta(key, recoveryTarget);
      const recoveryTargetActionability = quickPickBookmarkRecoveryTargetActionability(recoveryTargetMemory);
      const planningAction = quickPickBookmarkPlanningAction({
        count,
        degraded,
        resolved: false,
        priority,
        urgency,
        momentum,
        reopenMemory,
        planningMemory,
        hasRecoveryTarget: Boolean(recoveryTarget?.record),
        recoveryTargetTrend: recoveryTargetMemory.trend,
        recoveryTargetActionability
      });
      const planningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
        planningAction,
        momentum,
        reopenMemory,
        planningMemory
      });
      const planningStrengthened = quickPickBookmarkPlanningRecoveryTargetStrengthened({
        planningAction,
        priority,
        reopenMemory,
        momentum,
        hasRecoveryTarget: Boolean(recoveryTarget?.record)
      });
      const recoveryTargetScore =
        recoveryTarget?.record
          ? (priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityNow()
              ? 6
              : priority === toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityWatch()
                ? 5
                : 4)
          : 0;
      const planningHoldReason = quickPickBookmarkPlanningHoldReason(planningMemory, planningAction, momentum);
      const planningMemoryScore = quickPickBookmarkPlanningMemoryScore(planningMemory, planningAction, momentum);
      return {
        key,
        count,
        urgency,
        degraded,
        momentum,
        reopenMemory,
        planningMemory,
        priority,
        planningAction,
        planningReactivated,
        planningStrengthened,
        recoveryTarget,
        recoveryTargetMemory,
        recoveryTargetActionability,
        recoveryTargetScore,
        planningHoldReason,
        planningMemoryScore,
        workType: quickPickBookmarkWorkType({ urgency, degraded, priority, count }),
        reason: quickPickBookmarkMomentumReason(momentum) || reopenMemory.label || quickPickBookmarkPriorityReason({ urgency, degraded, count }),
        score: quickPickBookmarkPriorityScore({ priority, count, degraded, recent }) + momentum.score + quickPickBookmarkMomentumQualityScore(momentum) + reopenMemory.score + planningMemoryScore + recoveryTargetScore + recoveryTargetMemory.score + (recoveryTargetActionability === "holding recovery target" ? 4 : recoveryTargetActionability ? -4 : 0)
      };
    })
    .sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));
}

function incompleteQuickPickRecords() {
  return quickPickRecords().filter((record) => summarizeV1Health(contextRecordForRecord(record)).state !== "strong");
}

function reviewQueueItems() {
  return quickPickRecords().flatMap((record) => {
    const summary = summarizeV1Health(contextRecordForRecord(record));
    return (summary.checks || [])
      .filter((check) => !check.ok)
      .map((check) => ({
        record,
        label: check.label
      }));
  });
}

function activeReviewItemFromState(items = reviewQueueItems()) {
  if (!toolbenchActiveReviewKey) return null;
  return items.find((item) => reviewQueueItemKey(item) === toolbenchActiveReviewKey) || null;
}

function currentReviewQueueIndex(items = reviewQueueItems()) {
  if (!items.length) return -1;
  const activeItem = activeReviewItemFromState(items);
  if (activeItem) {
    return items.findIndex((item) => reviewQueueItemKey(item) === toolbenchActiveReviewKey);
  }
  const currentId = toolbenchRecord?.id || "";
  const currentLabel = toolbenchEl.v1HealthAction?.dataset.targetLabel || summarizeV1Health(contextRecordForRecord(toolbenchRecord)).nextLabel || "";
  return items.findIndex((item) => item.record.id === currentId && item.label === currentLabel);
}

function reviewQueueItemKey(item) {
  if (!item?.record?.id || !item?.label) return "";
  return `${item.record.id}::${item.label}`;
}

function reviewScopeAllowsResolvedKey(key = "") {
  const [recordId = "", label = ""] = String(key).split("::");
  if (!recordId || !label) return false;
  const record = toolbenchRecords.find((item) => item.id === recordId);
  if (!record) return false;
  if (!quickPickRecords().some((item) => item.id === recordId)) return false;
  return !toolbenchQuickPickLayerFilter || toolbenchQuickPickLayerFilter === label;
}

function resolvedReviewQueueCount() {
  const unresolved = new Set(reviewQueueItems().map((item) => reviewQueueItemKey(item)));
  return Array.from(toolbenchResolvedReviewKeys).filter((key) => reviewScopeAllowsResolvedKey(key) && !unresolved.has(key)).length;
}

function loadNextReviewQueueItem() {
  const items = reviewQueueItems();
  if (!items.length) return null;
  const currentIndex = currentReviewQueueIndex(items);
  const nextItem = currentIndex >= 0 ? items[(currentIndex + 1) % items.length] : items[0];
  if (!nextItem) return null;
  toolbenchActiveReviewKey = reviewQueueItemKey(nextItem);
  persistV1ReviewPassState();
  if (nextItem.record.id !== toolbenchRecord?.id) renderRecord(nextItem.record);
  jumpToV1HealthLabel(nextItem.label);
  setNamedSearchStatus("nextReviewItem", {
    title: nextItem.record.title,
    label: nextItem.label,
    scope: quickPickFilterDescription()
  });
  return nextItem;
}

function resetCurrentReviewPass() {
  const resolvedCount = resolvedReviewQueueCount();
  if (!resolvedCount) return;
  toolbenchResolvedReviewKeys = new Set(
    Array.from(toolbenchResolvedReviewKeys).filter((key) => !reviewScopeAllowsResolvedKey(key))
  );
  const queueItems = reviewQueueItems();
  if (!queueItems.some((item) => reviewQueueItemKey(item) === toolbenchActiveReviewKey)) {
    toolbenchActiveReviewKey = "";
  }
  closeBackendReviewPassPreview("newPass");
  persistV1ReviewPassState();
  renderV1Health(contextRecordForRecord(toolbenchRecord));
  renderV1Roster();
  setNamedSearchStatus("startNewPass", { scope: quickPickFilterDescription() });
}

function syncRecordToQuickPickFilter({ force = false, preferredRecord = null } = {}) {
  const matches = quickPickRecords();
  if (!matches.length) return null;
  const currentId = toolbenchRecord?.id || "";
  const currentMatches = matches.some((record) => record.id === currentId);
  if (!force && currentMatches) return null;
  const preferred =
    preferredRecord?.id
      ? matches.find((record) => record.id === preferredRecord.id) || null
      : null;
  const nextRecord = preferred || matches[0];
  if (!nextRecord || nextRecord.id === currentId) return nextRecord || null;
  renderRecord(nextRecord);
  return nextRecord;
}

function applyV1RosterFilter(filter = "all") {
  toolbenchQuickPickFilter = filter || "all";
  resetQueueLensMemoryDismissal();
  if (!reviewQueueItems().some((item) => reviewQueueItemKey(item) === toolbenchActiveReviewKey)) {
    toolbenchActiveReviewKey = "";
  }
  closeBackendReviewPassPreview("filterChange");
  persistV1ReviewPassState();
  renderQuickPicks();
  const nextRecord = syncRecordToQuickPickFilter();
  const labels = {
    all: toolbenchReviewPassMessages.workspace.rosterFilterAll(),
    strong: toolbenchReviewPassMessages.workspace.rosterFilterStrong(),
    partial: toolbenchReviewPassMessages.workspace.rosterFilterPartial(),
    weak: toolbenchReviewPassMessages.workspace.rosterFilterWeak(),
    current: toolbenchReviewPassMessages.workspace.rosterFilterCurrent({
      title: toolbenchRecord?.title || ""
    })
  };
  if (toolbenchEl.searchStatus && labels[toolbenchQuickPickFilter]) {
    const base = labels[toolbenchQuickPickFilter];
    const scope = toolbenchReviewPassMessages.workspace.rosterFilterScoped({
      scope: base,
      label: toolbenchQuickPickLayerFilter
    });
    setNamedSearchStatus("rosterFilter", {
      scope,
      title: nextRecord?.title || ""
    });
  }
}

function applyV1QuickPickSortMode(mode = "default") {
  clearQuickPickBookmarkOpenedState({ render: false });
  toolbenchQuickPickSortMode =
    mode === "improving" || mode === "attention"
      ? mode
      : "default";
  resetQueueLensMemoryDismissal();
  persistV1ReviewPassState();
  renderQuickPicks();
  renderV1Roster();
  if (toolbenchEl.searchStatus) {
    const labels = {
      default: toolbenchReviewPassMessages.workspace.quickPickSortDefault(),
      improving: toolbenchReviewPassMessages.workspace.quickPickSortImproving(),
      attention: toolbenchReviewPassMessages.workspace.quickPickSortAttention()
    };
    setSearchStatus(labels[toolbenchQuickPickSortMode] || labels.default, {
      autoClearMs: toolbenchStatusDurations.filter,
      tone: "info"
    });
  }
}

function returnToCurrentQuickPick() {
  if (!toolbenchRecord) return;
  clearQuickPickBookmarkOpenedState({ render: false });
  toolbenchQuickPickLayerFilter = "";
  toolbenchQuickPickFilter = "current";
  resetQueueLensMemoryDismissal();
  persistV1ReviewPassState();
  renderQuickPicks();
  renderV1Roster();
  setNamedSearchStatus("returnCurrentRecord", { title: toolbenchRecord.title });
}

function recoveryReactivatedFocusTarget(mode = "attention") {
  const topLane = rankedQuickPickBookmarks()[0] || null;
  if (!topLane?.planningReactivated) return null;
  const laneLens = toolbenchQuickPickBookmarks[topLane.key] || null;
  if (!laneLens) return null;
  const preferredTarget = recoveryPreferredReopenTarget(topLane, laneLens);
  if (preferredTarget?.record) {
    return preferredTarget;
  }
  const laneRecords = quickPickRecordsForLens(laneLens);
  if (!laneRecords.length) return null;
  const target = selectRecoveryTargetRecord(laneRecords, topLane, { mode });
  if (!target) return null;
  return {
    record: target,
    laneLabel: quickPickBookmarkLabel(topLane.key),
    actionability: topLane.recoveryTargetActionability || "",
    choice: "lead",
    preference: "",
    selectionReason: recoveryTargetSelectionReason(topLane, laneLens, target)
  };
}

function recoveryFocusedTargetHint(target = null, fallbackLabel = "") {
  if (!target?.record?.title) return fallbackLabel;
  const details = [
    target.laneLabel ? `Recovery-targeted from ${target.laneLabel}` : "",
    target.actionability || "",
    target.selectionReason || "",
    target.preference || ""
  ].filter(Boolean).join(" • ");
  return `${target.record.title}${details ? `. ${details}` : ""}`;
}

function recoveryTargetStatusNote(target = null) {
  if (!target?.laneLabel) return "";
  return `Recovery-targeted entry from ${target.laneLabel}${target.actionability ? ` • ${target.actionability}` : ""}${target.preference ? ` • ${target.preference}` : ""}`;
}

function refreshTargetPreviewForLens(bookmarkKey = "", lens = null) {
  if (!bookmarkKey || !lens || !hasNonDefaultQuickPickLens(lens)) return null;
  const records = quickPickRecordsForLens(lens);
  if (!records.length) return null;
  const urgency = quickPickBookmarkUrgency(records);
  const momentum = summarizeLaneRoutedReviewMomentum(records);
  const priority = quickPickBookmarkPriority({ urgency, degraded: false, resolved: false, count: records.length });
  const reopenMemory = quickPickBookmarkReopenMemoryMeta(bookmarkKey);
  const planningMemory = toolbenchQuickPickBookmarkPlanningMemoryByKey[bookmarkKey] || null;
  const planningAction = quickPickBookmarkPlanningAction({
    count: records.length,
    degraded: false,
    resolved: false,
    priority,
    urgency,
    momentum,
    reopenMemory,
    planningMemory
  });
  const planningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
    planningAction,
    momentum,
    reopenMemory,
    planningMemory
  });
  if (!planningReactivated) return null;
  const baselineTarget = selectRecoveryTargetRecord(records, { recoveryTargetActionability: "" }, { mode: lens.sort || "default" });
  const recoveryTargetMemory = quickPickBookmarkRecoveryTargetMemoryMeta(
    bookmarkKey,
    baselineTarget ? { record: baselineTarget } : null
  );
  const recoveryTargetActionability = quickPickBookmarkRecoveryTargetActionability(recoveryTargetMemory);
  return recoveryPreferredReopenTarget(
    {
      key: bookmarkKey,
      planningReactivated,
      recoveryTargetActionability
    },
    lens
  );
}

function markRecoveryChoiceMemory(bookmarkKey = "", choice = "") {
  if (!bookmarkKey || !choice) return;
  const current = toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[bookmarkKey] || {
    lead: 0,
    holdingAlternative: 0,
    fadingAlternative: 0
  };
  toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[bookmarkKey] = {
    lead: choice === "lead" ? Math.min(current.lead + 1, 6) : current.lead,
    holdingAlternative:
      choice === "holdingAlternative"
        ? Math.min(current.holdingAlternative + 1, 6)
        : current.holdingAlternative,
    fadingAlternative:
      choice === "fadingAlternative"
        ? Math.min(current.fadingAlternative + 1, 6)
        : current.fadingAlternative
  };
  persistV1ReviewPassState();
}

function reinforceRecoveryTargetChoice(bookmarkKey = "", target = null) {
  if (!bookmarkKey || !target?.choice) return;
  markRecoveryChoiceMemory(bookmarkKey, target.choice);
}

function recoveryTargetCandidateScore(record = null, lane = null, { mode = "default" } = {}) {
  const routedOutcome = routedReviewOutcomeForRecord(record);
  const status = routedOutcome?.status || "";
  let outcomeScore = 0;
  if (status === "cleared") outcomeScore = 14;
  else if (status === "tightened") outcomeScore = 11;
  else if (status === "tempered-cleared") outcomeScore = 8;
  else if (status === "tempered-tightened") outcomeScore = 6;
  else if (status === "next-active") outcomeScore = -2;
  else if (status === "tempered-next-active") outcomeScore = -5;
  const actionability = lane?.recoveryTargetActionability || "";
  if (actionability === "holding recovery target") {
    outcomeScore += status === "cleared" || status === "tightened" ? 6 : 0;
  } else if (actionability === "recovery target losing actionability") {
    outcomeScore -= status === "next-active" || status === "tempered-next-active" ? 6 : 0;
  } else if (actionability === "recovery target faded") {
    outcomeScore -= status ? 4 : 0;
  }
  const choiceMemory = toolbenchQuickPickBookmarkRecoveryChoiceMemoryByKey[lane?.key || ""] || null;
  if (choiceMemory) {
    if (status === "cleared" || status === "tightened" || status === "tempered-cleared" || status === "tempered-tightened") {
      outcomeScore += choiceMemory.lead * 2;
      outcomeScore += choiceMemory.holdingAlternative;
    }
    if (status === "next-active" || status === "tempered-next-active") {
      outcomeScore += choiceMemory.fadingAlternative;
    }
  }
  const baseScore =
    mode === "improving"
      ? quickPickDecisionImprovingScore(record)
      : mode === "attention"
        ? quickPickDecisionAttentionScore(record)
        : 0;
  return baseScore + outcomeScore + Number(routedOutcome?.score || 0);
}

function selectRecoveryTargetRecord(records = [], lane = null, { mode = "default" } = {}) {
  if (!Array.isArray(records) || !records.length) return null;
  return [...records].sort((a, b) => {
    const scoreDiff = recoveryTargetCandidateScore(b, lane, { mode }) - recoveryTargetCandidateScore(a, lane, { mode });
    if (scoreDiff !== 0) return scoreDiff;
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  })[0] || null;
}

function recoveryChoiceCandidates(records = [], lane = null, { mode = "default" } = {}) {
  if (!Array.isArray(records) || !records.length || !lane?.planningReactivated) {
    return {
      leadRecord: null,
      alternatives: [],
      holdingAlternative: null,
      fadingAlternative: null
    };
  }
  const leadRecord = selectRecoveryTargetRecord(records, lane, { mode });
  if (!leadRecord) {
    return {
      leadRecord: null,
      alternatives: [],
      holdingAlternative: null,
      fadingAlternative: null
    };
  }
  const leadContext = contextRecordForRecord(leadRecord);
  const leadWorkType = quickPickRecordWorkType({
    healthSummary: summarizeV1Health(leadContext),
    decisionOutcome: summarizeCommercialSnapshotForContext(leadContext)?.outcome || null,
    decisionHistory: currentDecisionOutcomeHistory(leadContext)
  });
  const alternatives = records
    .filter((record) => {
      if (!record || record.id === leadRecord.id) return false;
      const context = contextRecordForRecord(record);
      return quickPickRecordWorkType({
        healthSummary: summarizeV1Health(context),
        decisionOutcome: summarizeCommercialSnapshotForContext(context)?.outcome || null,
        decisionHistory: currentDecisionOutcomeHistory(context)
      }) === leadWorkType;
    })
    .slice(0, 2)
    .map((record) => ({
      record,
      state: recoveryAlternativeStateForRecord(record, lane)
    }))
    .filter((item) => item.state);
  return {
    leadRecord,
    alternatives,
    holdingAlternative: alternatives.find((item) => item.state === "holding")?.record || null,
    fadingAlternative: alternatives.find((item) => item.state === "fading")?.record || null
  };
}

function effectiveRecoveryChoicePreference(lane = null, lens = null) {
  const preference = quickPickBookmarkRecoveryChoicePreference(lane);
  const state = quickPickBookmarkRecoveryChoicePreferenceState(lane);
  if (!preference || !state) return { preference: "", state: "" };
  const resolvedLens =
    lens ||
    (lane?.key ? toolbenchQuickPickBookmarks[lane.key] || null : null) ||
    (hasNonDefaultQuickPickLens(lane) ? lane : null);
  if (!resolvedLens || !lane?.planningReactivated) {
    return { preference: "", state: "" };
  }
  const candidates = recoveryChoiceCandidates(
    quickPickRecordsForLens(resolvedLens),
    lane,
    { mode: resolvedLens.sort || "default" }
  );
  if (!candidates.leadRecord || !candidates.alternatives.length) {
    return { preference: "", state: "" };
  }
  if (state === "holding" && !candidates.holdingAlternative) {
    return { preference: "", state: "" };
  }
  if (state === "fading" && !candidates.fadingAlternative) {
    return { preference: "", state: "" };
  }
  return { preference, state };
}

function recoveryTargetSelectionReason(lane = null, lens = null, target = null) {
  if (!lane || !lens || !target) return "";
  const laneRecords = quickPickRecordsForLens(lens);
  if (laneRecords.length < 2) return "";
  const alternative = laneRecords.find((record) => record.id !== target.id) || null;
  const alternativeStatus = routedReviewOutcomeForRecord(alternative)?.status || "";
  if (
    lane.recoveryTargetActionability === "holding recovery target" &&
    (alternativeStatus === "next-active" || alternativeStatus === "tempered-next-active")
  ) {
    return "preferring the strongest holding target over a fading alternative";
  }
  if (lane.recoveryTargetActionability === "holding recovery target") {
    return "preferring the strongest holding target";
  }
  if (
    lane.recoveryTargetActionability === "recovery target losing actionability" ||
    lane.recoveryTargetActionability === "recovery target faded"
  ) {
    return "preferring the least-faded remaining recovery target";
  }
  return "";
}

function recoveryReactivatedLaneRecordTarget(lane = null, lens = null) {
  if (!lane?.planningReactivated || !lens) return null;
  const laneRecords = quickPickRecordsForLens(lens);
  if (!laneRecords.length) return null;
  const target = recoveryChoiceCandidates(laneRecords, lane, { mode: lens.sort || "default" }).leadRecord;
  if (!target) return null;
  return {
    record: target,
    laneLabel: quickPickBookmarkLabel(lane.key),
    actionability: lane.recoveryTargetActionability || "",
    selectionReason: recoveryTargetSelectionReason(lane, lens, target)
  };
}

function recoveryPreferredReopenTarget(lane = null, lens = null) {
  if (!lane?.planningReactivated || !lens) return null;
  const laneRecords = quickPickRecordsForLens(lens);
  if (!laneRecords.length) return null;
  const candidates = recoveryChoiceCandidates(laneRecords, lane, { mode: lens.sort || "default" });
  if (!candidates.leadRecord) return null;
  const effectivePreference = effectiveRecoveryChoicePreference(lane, lens);
  const preferenceState = effectivePreference.state;
  const preferredRecord =
    preferenceState === "holding"
      ? candidates.holdingAlternative || candidates.leadRecord
      : preferenceState === "fading"
        ? candidates.fadingAlternative || candidates.leadRecord
        : candidates.leadRecord;
  const choice =
    preferredRecord?.id === candidates.leadRecord.id
      ? "lead"
      : preferenceState === "holding" && candidates.holdingAlternative?.id === preferredRecord?.id
        ? "holdingAlternative"
        : preferenceState === "fading" && candidates.fadingAlternative?.id === preferredRecord?.id
          ? "fadingAlternative"
          : "lead";
  const actionability =
    choice === "holdingAlternative"
      ? "holding alternative"
      : choice === "fadingAlternative"
        ? "fading alternative"
        : lane.recoveryTargetActionability || "";
  return {
    record: preferredRecord,
    laneLabel: quickPickBookmarkLabel(lane.key),
    actionability,
    choice,
    preference: effectivePreference.preference,
    selectionReason:
      choice === "holdingAlternative"
        ? "reopened into the learned holding alternative"
        : choice === "fadingAlternative"
          ? "reopened into the learned fading alternative"
          : recoveryTargetSelectionReason(lane, lens, candidates.leadRecord)
  };
}

function focusWeakestQuickPick() {
  const matches = quickPickRecords();
  if (!matches.length) return;
  const recoveryTarget = recoveryReactivatedFocusTarget("attention");
  const weakest = recoveryTarget?.record || [...matches].sort((a, b) => quickPickDecisionAttentionScore(b) - quickPickDecisionAttentionScore(a))[0];
  if (!weakest) return;
  clearQuickPickBookmarkOpenedState({ render: false });
  dismissBackendPreviewNotice();
  renderRecord(weakest);
  reinforceRecoveryTargetChoice((rankedQuickPickBookmarks()[0] || {}).key || "", recoveryTarget);
  renderQuickPicks();
  renderV1Roster();
  setNamedSearchStatus("focusWeakestRecord", {
    title: weakest.title,
    note:
      recoveryTarget
        ? `Recovery-targeted from ${recoveryTarget.laneLabel}${recoveryTarget.actionability ? ` • ${recoveryTarget.actionability}` : ""}${recoveryTarget.preference ? ` • ${recoveryTarget.preference}` : ""}.`
        : ""
  });
}

function focusStrongestQuickPick() {
  const matches = quickPickRecords();
  if (!matches.length) return;
  const recoveryTarget = recoveryReactivatedFocusTarget("improving");
  const strongest = recoveryTarget?.record || [...matches].sort((a, b) => quickPickDecisionImprovingScore(b) - quickPickDecisionImprovingScore(a))[0];
  if (!strongest) return;
  clearQuickPickBookmarkOpenedState({ render: false });
  dismissBackendPreviewNotice();
  renderRecord(strongest);
  reinforceRecoveryTargetChoice((rankedQuickPickBookmarks()[0] || {}).key || "", recoveryTarget);
  renderQuickPicks();
  renderV1Roster();
  setNamedSearchStatus("focusStrongestRecord", {
    title: strongest.title,
    note:
      recoveryTarget
        ? `Recovery-targeted from ${recoveryTarget.laneLabel}${recoveryTarget.actionability ? ` • ${recoveryTarget.actionability}` : ""}${recoveryTarget.preference ? ` • ${recoveryTarget.preference}` : ""}.`
        : ""
  });
}

function resetQuickPickQueueLens() {
  clearQuickPickBookmarkOpenedState({ render: false });
  toolbenchQuickPickSortMode = "default";
  toolbenchQuickPickFilter = "all";
  toolbenchQuickPickLayerFilter = "";
  resetQueueLensMemoryDismissal();
  persistV1ReviewPassState();
  renderQuickPicks();
  const nextRecord = syncRecordToQuickPickFilter({ force: true });
  renderV1Roster();
  setNamedSearchStatus("resetQueueLens", {
    title: nextRecord?.title || toolbenchRecord?.title || ""
  });
}

function applyV1RosterLayerFilter(label = "") {
  clearQuickPickBookmarkOpenedState({ render: false });
  toolbenchQuickPickLayerFilter = toolbenchQuickPickLayerFilter === label ? "" : label;
  resetQueueLensMemoryDismissal();
  closeBackendReviewPassPreview("layerFilterChange");
  persistV1ReviewPassState();
  renderQuickPicks();
  const nextRecord = syncRecordToQuickPickFilter();
  renderV1Roster();
  setNamedSearchStatus("layerFilter", {
    label: toolbenchQuickPickLayerFilter,
    title: nextRecord?.title || ""
  });
}

function renderV1Roster() {
  pruneExpiredQuickPickBookmarkPlanningMemory();
  if (
    !toolbenchEl.v1Roster ||
    !toolbenchEl.v1RosterTitle ||
    !toolbenchEl.v1RosterCopy ||
    !toolbenchEl.v1RosterOrigin ||
    !toolbenchEl.v1RosterAudit ||
    !toolbenchEl.v1RosterSync ||
    !toolbenchEl.v1RosterBackendNotice ||
    !toolbenchEl.v1RosterBackend ||
    !toolbenchEl.v1RosterBackendPreview ||
    !toolbenchEl.v1RosterBackendScope ||
    !toolbenchEl.v1RosterCurrentScope ||
    !toolbenchEl.v1RosterBackendCompare ||
    !toolbenchEl.v1RosterBackendItem ||
    !toolbenchEl.v1RosterBackendItemStatus ||
    !toolbenchEl.v1RosterBackendFocusHint ||
    !toolbenchEl.v1RosterBackendResolved ||
    !toolbenchEl.v1RosterBackendUpdated ||
    !toolbenchEl.v1RosterRestoreJump ||
    !toolbenchEl.v1RosterRestore ||
    !toolbenchEl.v1RosterClear ||
    !toolbenchEl.v1RosterTotal ||
    !toolbenchEl.v1RosterStrong ||
    !toolbenchEl.v1RosterPartial ||
    !toolbenchEl.v1RosterWeak ||
    !toolbenchEl.v1RosterCurrent ||
    !toolbenchEl.v1RosterCurrentTrend ||
    !toolbenchEl.v1RosterSort ||
    !toolbenchEl.v1RosterFocusStrongest ||
    !toolbenchEl.v1RosterFocusWeakest ||
    !toolbenchEl.v1RosterReturnCurrent ||
    !toolbenchEl.v1RosterBookmarkLens ||
    !toolbenchEl.v1RosterOpenBookmark ||
    !toolbenchEl.v1RosterOpenPriorityBookmark ||
    !toolbenchEl.v1RosterApplyPlanningAction ||
    !toolbenchEl.v1RosterRefreshBookmark ||
    !toolbenchEl.v1RosterResetLens ||
    !toolbenchEl.v1RosterSortSummary ||
    !toolbenchEl.v1RosterSortExplainer ||
    !toolbenchEl.v1RosterPrioritySummary ||
    !toolbenchEl.v1RosterSortMemoryWrap ||
    !toolbenchEl.v1RosterSortMemory ||
    !toolbenchEl.v1RosterDismissMemory ||
    !toolbenchEl.v1RosterSortBookmark ||
    !toolbenchEl.v1RosterSortBookmarkList ||
    !toolbenchEl.v1RosterBreakdownTitle ||
    !toolbenchEl.v1RosterBreakdownList
  ) {
    return;
  }

  const summaries = toolbenchDecisionContextRecords.map((context) => summarizeV1Health(context));
  const counts = {
    strong: summaries.filter((summary) => summary.state === "strong").length,
    partial: summaries.filter((summary) => summary.state === "partial").length,
    weak: summaries.filter((summary) => summary.state === "weak").length
  };
  const currentContext = contextRecordForRecord(toolbenchRecord);
  const currentSummary = summarizeV1Health(currentContext);
  const currentOutcomeHistory = currentDecisionOutcomeHistory(currentContext);
  const currentOutcome = summarizeCommercialSnapshotForContext(currentContext)?.outcome || null;
  const currentQuickPickRecords = quickPickRecords();
  const currentQuickPickCount = currentQuickPickRecords.length;
  const currentStrongestRecord = currentQuickPickRecords.length
    ? [...currentQuickPickRecords].sort((a, b) => quickPickDecisionImprovingScore(b) - quickPickDecisionImprovingScore(a))[0]
    : null;
  const currentWeakestRecord = currentQuickPickRecords.length
    ? [...currentQuickPickRecords].sort((a, b) => quickPickDecisionAttentionScore(b) - quickPickDecisionAttentionScore(a))[0]
    : null;

  toolbenchEl.v1RosterTotal.textContent = String(toolbenchDecisionContextRecords.length);
  toolbenchEl.v1RosterStrong.textContent = String(counts.strong);
  toolbenchEl.v1RosterPartial.textContent = String(counts.partial);
  toolbenchEl.v1RosterWeak.textContent = String(counts.weak);
  toolbenchEl.v1RosterCurrent.textContent =
    currentSummary.state === "strong"
      ? toolbenchReviewPassMessages.roster.currentDecisionReady({
          passed: currentSummary.passed,
          total: currentSummary.total,
          outcome: currentOutcome?.title || ""
        })
      : toolbenchReviewPassMessages.roster.currentDecisionReview({
          passed: currentSummary.passed,
          total: currentSummary.total,
          outcome: currentOutcome?.title || currentSummary.nextAction.replace(/^Next:\s*/i, "")
        });
  delete toolbenchEl.v1RosterCurrent.dataset.cooling;
  toolbenchEl.v1RosterCurrent.removeAttribute("title");
  toolbenchEl.v1RosterCurrent.removeAttribute("aria-label");
  if (currentOutcomeHistory) {
    toolbenchEl.v1RosterCurrentTrend.hidden = false;
    toolbenchEl.v1RosterCurrentTrend.textContent =
      currentOutcomeHistory.comparison && currentOutcomeHistory.comparison !== "unchanged"
        ? `Current record trajectory: ${currentOutcomeHistory.comparison} than ${currentOutcomeHistory.from}.`
        : `Current record trajectory: changed from ${currentOutcomeHistory.from}.`;
    toolbenchEl.v1RosterCurrentTrend.dataset.tone =
      currentOutcomeHistory.comparison === "stronger"
        ? "strong"
        : currentOutcomeHistory.comparison === "weaker"
          ? "caution"
          : "";
  } else {
    toolbenchEl.v1RosterCurrentTrend.hidden = true;
    toolbenchEl.v1RosterCurrentTrend.textContent = "";
    delete toolbenchEl.v1RosterCurrentTrend.dataset.tone;
  }
  toolbenchEl.v1RosterSort.querySelectorAll("[data-sort]").forEach((button) => {
    button.dataset.active = button.dataset.sort === toolbenchQuickPickSortMode ? "true" : "false";
    button.setAttribute("aria-pressed", button.dataset.sort === toolbenchQuickPickSortMode ? "true" : "false");
  });
  toolbenchEl.v1RosterReturnCurrent.hidden = !toolbenchRecord;
  toolbenchEl.v1RosterReturnCurrent.disabled = !toolbenchRecord;
  toolbenchEl.v1RosterReturnCurrent.dataset.active =
    toolbenchQuickPickFilter === "current" && !toolbenchQuickPickLayerFilter ? "true" : "false";
  const hasQueueMemory = toolbenchQuickPickSortMode !== "default" || toolbenchQuickPickFilter !== "all" || Boolean(toolbenchQuickPickLayerFilter);
  const bookmarkEntries = Object.entries(toolbenchQuickPickBookmarks).filter(([, lens]) => hasNonDefaultQuickPickLens(lens));
  const rankedBookmarks = rankedQuickPickBookmarks();
  const topRankedBookmark = rankedBookmarks[0] || null;
  const runnerUpBookmark = rankedBookmarks[1] || null;
  const cooledPriorityLane = [topRankedBookmark, runnerUpBookmark].find((lane) => (lane?.planningMemoryScore || 0) < 0) || null;
  const routerGap = topRankedBookmark && runnerUpBookmark ? topRankedBookmark.score - runnerUpBookmark.score : 999;
  const previousPriorityBookmarkKey = toolbenchPriorityBookmarkKey;
  const previousPriorityBookmarkStableCount = toolbenchPriorityBookmarkStableCount;
  const runnerUpLabel =
    routerGap < 40 && runnerUpBookmark
      ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRunnerUp({
          label: quickPickBookmarkLabel(runnerUpBookmark.key)
        })
      : "";
  const runnerUpReason = routerGap < 40 ? quickPickPriorityRunnerUpReason(topRankedBookmark, runnerUpBookmark) : "";
  const routeStreakHintState =
    !topRankedBookmark
      ? ""
      : toolbenchPriorityBookmarkStableCount >= 3
        ? "now settled"
        : toolbenchPriorityBookmarkStableCount <= 1
          ? "still provisional"
          : "gaining stability";
  const runnerUpHint =
    routerGap < 40 && topRankedBookmark && runnerUpBookmark
      ? routeSummaryHintCopy({
          label: quickPickBookmarkLabel(topRankedBookmark.key),
          state: routeStreakHintState,
          runnerUp: quickPickBookmarkLabel(runnerUpBookmark.key),
          reason: runnerUpReason,
          gap: quickPickPriorityGapLabel(routerGap)
        })
      : "";
  const cooledPriorityRecoveryHint = cooledPriorityLane ? quickPickBookmarkPlanningRecoveryHint(cooledPriorityLane) : "";
  const cooledPriorityRecovering =
    Boolean(cooledPriorityLane) &&
    quickPickBookmarkPlanningCooldownStage(
      cooledPriorityLane?.planningMemory,
      cooledPriorityLane?.momentum
    ) === "late";
  const focusCoolingHint = cooledPriorityLane
    ? `Priority view is currently tempered by ${cooledPriorityRecoveryHint || `${quickPickBookmarkLabel(cooledPriorityLane.key)} cooling off after a recent lane action`}.`
    : "";
  if (cooledPriorityLane) {
    toolbenchEl.v1RosterCurrent.dataset.cooling = "true";
    toolbenchEl.v1RosterCurrent.textContent = `${toolbenchEl.v1RosterCurrent.textContent} • ${
      cooledPriorityRecovering
        ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()
        : "tempered"
    }`;
    toolbenchEl.v1RosterCurrent.title = focusCoolingHint;
    toolbenchEl.v1RosterCurrent.setAttribute("aria-label", `${toolbenchEl.v1RosterCurrent.textContent}. ${focusCoolingHint}`);
  }
  const topMomentumLabel = topRankedBookmark ? quickPickBookmarkMomentumReason(topRankedBookmark.momentum) : "";
  const topTemperedMomentum = topRankedBookmark ? laneMomentumHasTempered(topRankedBookmark.momentum) : false;
  const topPlanningAction = topRankedBookmark?.planningAction || "";
  const topPlanningReactivated = Boolean(topRankedBookmark?.planningReactivated);
  const topPlanningStrengthened = Boolean(topRankedBookmark?.planningStrengthened);
  const topPlanningHold = Boolean(topRankedBookmark?.planningHoldReason);
  const topPlanningCooldownTone = topRankedBookmark ? quickPickBookmarkPlanningCooldownTone(topRankedBookmark.momentum) : "";
  const topPlanningCooldownStage = topRankedBookmark ? quickPickBookmarkPlanningCooldownStage(topRankedBookmark.planningMemory, topRankedBookmark.momentum) : "";
  const topPlanningRecovering = topPlanningCooldownStage === "late";
  const topRecoveryTarget =
    topRankedBookmark?.planningReactivated
      ? recoveryPreferredReopenTarget(
          topRankedBookmark,
          toolbenchQuickPickBookmarks[topRankedBookmark.key] || null
        )
      : null;
  const topRecoveryTargetLabel = topRecoveryTarget?.record?.title
    ? `recovery-targeted entry: ${topRecoveryTarget.record.title}`
    : "";
  const topRecoveryTargetSelectionReason = topRecoveryTarget?.selectionReason || "";
  const topRecoveryTargetTrend = topRankedBookmark?.recoveryTargetMemory?.label || "";
  const topRecoveryTargetActionability = topRankedBookmark?.recoveryTargetActionability || "";
  const topBookmarkLens = topRankedBookmark?.key ? toolbenchQuickPickBookmarks[topRankedBookmark.key] || null : null;
  const topRecoveryChoice = effectiveRecoveryChoicePreference(topRankedBookmark, topBookmarkLens);
  const topRecoveryChoicePreference = topRecoveryChoice.preference;
  const topRecoveryChoicePreferenceState = topRecoveryChoice.state;
  const nextPriorityBookmarkKey = topRankedBookmark?.key || "";
  toolbenchPriorityBookmarkChanged = Boolean(
    nextPriorityBookmarkKey &&
    previousPriorityBookmarkKey &&
    nextPriorityBookmarkKey !== previousPriorityBookmarkKey
  );
  if (!nextPriorityBookmarkKey) {
    toolbenchPriorityBookmarkStableCount = 0;
  } else if (nextPriorityBookmarkKey === previousPriorityBookmarkKey) {
    toolbenchPriorityBookmarkStableCount = Math.min(toolbenchPriorityBookmarkStableCount + 1, 3);
  } else {
    toolbenchPriorityBookmarkStableCount = 1;
  }
  toolbenchPriorityBookmarkPreviousKey = toolbenchPriorityBookmarkChanged ? previousPriorityBookmarkKey : "";
  toolbenchPriorityBookmarkKey = nextPriorityBookmarkKey;
  const lastRoutedLabel =
    toolbenchPriorityBookmarkPreviousKey && toolbenchPriorityBookmarkPreviousKey !== nextPriorityBookmarkKey
      ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryLastRouted({
          label: quickPickBookmarkLabel(toolbenchPriorityBookmarkPreviousKey)
        })
      : "";
  const routeStreakLabel =
    topRankedBookmark && toolbenchPriorityBookmarkStableCount > 0
      ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryStreak({
          count: toolbenchPriorityBookmarkStableCount
        })
      : "";
  if (
    previousPriorityBookmarkKey !== toolbenchPriorityBookmarkKey ||
    previousPriorityBookmarkStableCount !== toolbenchPriorityBookmarkStableCount
  ) {
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  const lastBookmarkKey = toolbenchQuickPickBookmarkLastKey && toolbenchQuickPickBookmarks[toolbenchQuickPickBookmarkLastKey]
    ? toolbenchQuickPickBookmarkLastKey
    : bookmarkEntries[0]?.[0] || "";
  const currentBookmark = lastBookmarkKey ? toolbenchQuickPickBookmarks[lastBookmarkKey] || null : null;
  const hasQueueBookmark = Boolean(currentBookmark);
  const bookmarkMatchesCurrent = hasQueueBookmark && quickPickLensMatches(currentBookmark, currentQuickPickLensState());
  const topRestorePriorityQuality = topRankedBookmark
    ? quickPickBookmarkMemoryQuality(topRankedBookmark.momentum, { restored: true })
    : "";
  const topRestorePriorityTempered = topRankedBookmark
    ? quickPickBookmarkTemperedSignal(topRankedBookmark.momentum)
    : "";
  const topRestorePriorityReopenMemory = topRankedBookmark?.reopenMemory?.label || "";
  const topRestorePriorityPlanningHint = topRankedBookmark?.planningAction
    ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({
        action: topRankedBookmark.planningAction,
        tempered: topRestorePriorityTempered,
        reactivated: topPlanningReactivated,
        strengthened: topPlanningStrengthened,
        recoveryTargetTrend: topRecoveryTargetTrend,
        recoveryTargetActionability: topRecoveryTargetActionability
      }).replace(/\.$/, "") + (topRankedBookmark?.planningHoldReason ? ` • ${topRankedBookmark.planningHoldReason.replace(/\.$/, "")}` : "")
    : "";
  const currentBookmarkIsPriorityRestore = Boolean(
    hasQueueBookmark &&
    topRankedBookmark &&
    lastBookmarkKey === topRankedBookmark.key &&
    (topRestorePriorityQuality || topRestorePriorityTempered || topRestorePriorityReopenMemory || topRecoveryChoicePreference)
  );
  toolbenchEl.v1RosterBookmarkLens.hidden = !hasQueueMemory;
  toolbenchEl.v1RosterBookmarkLens.disabled = !hasQueueMemory;
  toolbenchEl.v1RosterBookmarkLens.dataset.active = bookmarkMatchesCurrent ? "true" : "false";
  const currentBookmarkKey = quickPickBookmarkKeyForLens();
  const currentBookmarkLabel = quickPickBookmarkLabel(currentBookmarkKey);
  toolbenchEl.v1RosterBookmarkLens.textContent =
    toolbenchQuickPickBookmarks[currentBookmarkKey]
      ? `Update ${currentBookmarkLabel}`
      : `Save ${currentBookmarkLabel}`;
  toolbenchEl.v1RosterOpenBookmark.hidden = !hasQueueBookmark;
  toolbenchEl.v1RosterOpenBookmark.disabled = !hasQueueBookmark;
  toolbenchEl.v1RosterOpenBookmark.dataset.active = bookmarkMatchesCurrent ? "true" : "false";
  toolbenchEl.v1RosterOpenBookmark.dataset.priorityRestore = currentBookmarkIsPriorityRestore ? "true" : "false";
  toolbenchEl.v1RosterOpenBookmark.dataset.momentumQuality = currentBookmarkIsPriorityRestore ? topRestorePriorityQuality : "";
  toolbenchEl.v1RosterOpenBookmark.dataset.reopenMemoryType = currentBookmarkIsPriorityRestore ? (topRankedBookmark?.reopenMemory?.type || "") : "";
  toolbenchEl.v1RosterOpenBookmark.dataset.planningAction = currentBookmarkIsPriorityRestore ? (topRankedBookmark?.planningAction || "") : "";
  toolbenchEl.v1RosterOpenBookmark.dataset.planningHold = currentBookmarkIsPriorityRestore && topPlanningHold ? "true" : "false";
  toolbenchEl.v1RosterOpenBookmark.dataset.planningCooldown = currentBookmarkIsPriorityRestore && topPlanningHold ? topPlanningCooldownTone : "";
  toolbenchEl.v1RosterOpenBookmark.dataset.planningCooldownStage = currentBookmarkIsPriorityRestore && topPlanningHold ? topPlanningCooldownStage : "";
  toolbenchEl.v1RosterOpenBookmark.dataset.recovering = currentBookmarkIsPriorityRestore && topPlanningRecovering ? "true" : "false";
  toolbenchEl.v1RosterOpenBookmark.textContent = hasQueueBookmark
    ? `Open ${quickPickBookmarkLabel(lastBookmarkKey)}${currentBookmarkIsPriorityRestore && topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}`
    : "Open bookmark";
  if (hasQueueBookmark && currentBookmarkIsPriorityRestore) {
    const openBookmarkHint = `Open ${quickPickBookmarkLabel(lastBookmarkKey)}${topRestorePriorityQuality ? ` • ${topRestorePriorityQuality}` : ""}${topRestorePriorityTempered ? ` • ${topRestorePriorityTempered}` : ""}${topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}${topRestorePriorityReopenMemory ? ` • ${topRestorePriorityReopenMemory}` : ""}${topRestorePriorityPlanningHint ? ` • ${topRestorePriorityPlanningHint}` : ""}${topRecoveryTargetSelectionReason ? ` • ${topRecoveryTargetSelectionReason}` : ""}${topRecoveryChoicePreference ? ` • ${topRecoveryChoicePreference}` : ""}.`;
    toolbenchEl.v1RosterOpenBookmark.title = openBookmarkHint;
    toolbenchEl.v1RosterOpenBookmark.setAttribute("aria-label", openBookmarkHint);
  } else {
    toolbenchEl.v1RosterOpenBookmark.removeAttribute("title");
    toolbenchEl.v1RosterOpenBookmark.removeAttribute("aria-label");
  }
  toolbenchEl.v1RosterOpenPriorityBookmark.hidden = !bookmarkEntries.length;
  toolbenchEl.v1RosterOpenPriorityBookmark.disabled = !bookmarkEntries.length;
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.active = "false";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.priorityRestore = topRestorePriorityQuality || topRestorePriorityTempered || topRestorePriorityReopenMemory || topRecoveryChoicePreference ? "true" : "false";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.momentumQuality = topRestorePriorityQuality;
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.reopenMemoryType = topRankedBookmark?.reopenMemory?.type || "";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.planningAction = topRankedBookmark?.planningAction || "";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.planningHold = topPlanningHold ? "true" : "false";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.planningCooldown = topPlanningHold ? topPlanningCooldownTone : "";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.planningCooldownStage = topPlanningHold ? topPlanningCooldownStage : "";
  toolbenchEl.v1RosterOpenPriorityBookmark.dataset.recovering = topPlanningRecovering ? "true" : "false";
  toolbenchEl.v1RosterOpenPriorityBookmark.textContent =
    topRankedBookmark
      ? `Open ${quickPickBookmarkLabel(topRankedBookmark.key)}${topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}`
      : "Open top priority";
  if (topRankedBookmark && (topRestorePriorityQuality || topRestorePriorityTempered || topRestorePriorityReopenMemory || topRestorePriorityPlanningHint || topRecoveryChoicePreference)) {
    const openPriorityHint = `Open ${quickPickBookmarkLabel(topRankedBookmark.key)}${topRestorePriorityQuality ? ` • ${topRestorePriorityQuality}` : ""}${topRestorePriorityTempered ? ` • ${topRestorePriorityTempered}` : ""}${topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}${topRestorePriorityReopenMemory ? ` • ${topRestorePriorityReopenMemory}` : ""}${topRestorePriorityPlanningHint ? ` • ${topRestorePriorityPlanningHint}` : ""}${topRecoveryTargetSelectionReason ? ` • ${topRecoveryTargetSelectionReason}` : ""}${topRecoveryChoicePreference ? ` • ${topRecoveryChoicePreference}` : ""}.`;
    toolbenchEl.v1RosterOpenPriorityBookmark.title = openPriorityHint;
    toolbenchEl.v1RosterOpenPriorityBookmark.setAttribute("aria-label", openPriorityHint);
  } else {
    toolbenchEl.v1RosterOpenPriorityBookmark.removeAttribute("title");
    toolbenchEl.v1RosterOpenPriorityBookmark.removeAttribute("aria-label");
  }
  toolbenchEl.v1RosterApplyPlanningAction.hidden = !topRankedBookmark || !topRankedBookmark.planningAction;
  toolbenchEl.v1RosterApplyPlanningAction.disabled = !topRankedBookmark || !topRankedBookmark.planningAction;
  toolbenchEl.v1RosterApplyPlanningAction.dataset.active = topRankedBookmark ? "true" : "false";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.priorityRestore =
    topRankedBookmark && (topRestorePriorityQuality || topRestorePriorityTempered || topRestorePriorityReopenMemory || topRankedBookmark.planningAction)
      ? "true"
      : "false";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.planningAction = topRankedBookmark?.planningAction || "";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.momentumQuality = topRestorePriorityQuality;
  toolbenchEl.v1RosterApplyPlanningAction.dataset.reopenMemoryType = topRankedBookmark?.reopenMemory?.type || "";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.planningHold = topPlanningHold ? "true" : "false";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.planningCooldown = topPlanningHold ? topPlanningCooldownTone : "";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.planningCooldownStage = topPlanningHold ? topPlanningCooldownStage : "";
  toolbenchEl.v1RosterApplyPlanningAction.dataset.recovering = topPlanningRecovering ? "true" : "false";
  toolbenchEl.v1RosterApplyPlanningAction.textContent = toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningActionButton({
    action: topRankedBookmark?.planningAction || ""
  }) + (topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : "");
  if (topRankedBookmark?.planningAction) {
    const planHint = `Take the suggested step for ${quickPickBookmarkLabel(topRankedBookmark.key)} • ${toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({
      action: topRankedBookmark.planningAction,
      tempered: topRestorePriorityTempered,
      reactivated: topPlanningReactivated,
      strengthened: topPlanningStrengthened,
      recoveryTargetTrend: topRecoveryTargetTrend,
      recoveryTargetActionability: topRecoveryTargetActionability
    }).replace(/\.$/, "")}${topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""}${topRankedBookmark.planningHoldReason ? ` • ${topRankedBookmark.planningHoldReason.replace(/\.$/, "")}` : ""}${topRestorePriorityQuality ? ` • ${topRestorePriorityQuality}` : ""}${topRestorePriorityReopenMemory ? ` • ${topRestorePriorityReopenMemory}` : ""}${topRecoveryTargetLabel ? ` • ${topRecoveryTargetLabel}` : ""}${topRecoveryTargetSelectionReason ? ` • ${topRecoveryTargetSelectionReason}` : ""}${topRecoveryChoicePreference ? ` • ${topRecoveryChoicePreference}` : ""}.`;
    toolbenchEl.v1RosterApplyPlanningAction.title = planHint;
    toolbenchEl.v1RosterApplyPlanningAction.setAttribute("aria-label", planHint);
  } else {
    toolbenchEl.v1RosterApplyPlanningAction.removeAttribute("title");
    toolbenchEl.v1RosterApplyPlanningAction.removeAttribute("aria-label");
  }
  if (toolbenchEl.v1RosterRouteBadge) {
    const routeBadgeRecovering = topPlanningHold && topPlanningCooldownStage === "late";
    const routeBadgeTone =
      !topRankedBookmark
        ? ""
        : routeBadgeRecovering
          ? "recovering"
        : toolbenchPriorityBookmarkStableCount >= 3
          ? "settled"
          : toolbenchPriorityBookmarkStableCount <= 1
            ? "provisional"
            : "steady";
    toolbenchEl.v1RosterRouteBadge.hidden = !bookmarkEntries.length || !topRankedBookmark;
    toolbenchEl.v1RosterRouteBadge.dataset.tone = routeBadgeTone;
    toolbenchEl.v1RosterRouteBadge.dataset.priorityOpened =
      topRankedBookmark && topRankedBookmark.key === toolbenchQuickPickBookmarkPriorityOpenedKey
        ? "true"
        : "false";
    toolbenchEl.v1RosterRouteBadge.dataset.planningAction = topRankedBookmark?.planningAction || "";
    toolbenchEl.v1RosterRouteBadge.dataset.planningHold = topPlanningHold ? "true" : "false";
    toolbenchEl.v1RosterRouteBadge.dataset.planningCooldown = topPlanningHold ? topPlanningCooldownTone : "";
    toolbenchEl.v1RosterRouteBadge.dataset.planningCooldownStage = topPlanningHold ? topPlanningCooldownStage : "";
    toolbenchEl.v1RosterRouteBadge.dataset.momentumQuality =
      topRankedBookmark ? quickPickBookmarkMomentumQuality(topRankedBookmark.momentum) : "";
    toolbenchEl.v1RosterRouteBadge.dataset.temperedMomentum = topTemperedMomentum ? "true" : "false";
    toolbenchEl.v1RosterRouteBadge.dataset.reactivated = topPlanningReactivated ? "true" : "false";
    toolbenchEl.v1RosterRouteBadge.dataset.recoveryPreferenceState = topRecoveryChoicePreferenceState;
    toolbenchEl.v1RosterRouteBadge.setAttribute("role", "button");
    toolbenchEl.v1RosterRouteBadge.setAttribute("tabindex", topRankedBookmark ? "0" : "-1");
    const routeBadgeHint =
      topRankedBookmark
        ? routeBadgeHintCopy({
            state:
              routeBadgeTone === "recovering"
                ? "recovering"
                : routeBadgeTone === "settled"
                ? "settled"
                : routeBadgeTone === "steady"
                  ? "steady"
                  : "provisional",
            label: quickPickBookmarkLabel(topRankedBookmark.key),
            count: toolbenchPriorityBookmarkStableCount,
            runnerUp:
              routeBadgeTone === "provisional" && runnerUpBookmark
                ? quickPickBookmarkLabel(runnerUpBookmark.key)
                : "",
            gap:
              routeBadgeTone === "provisional" && runnerUpBookmark && routerGap < 40
                ? quickPickPriorityGapLabel(routerGap)
                : ""
          })
        : "";
    toolbenchEl.v1RosterRouteBadge.textContent =
      topRankedBookmark && topRankedBookmark.key === toolbenchQuickPickBookmarkPriorityOpenedKey
        ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityOpened()
        : routeBadgeTone === "recovering"
          ? toolbenchReviewPassMessages.workspace.quickPickPriorityRouteBadgeRecovering()
          : routeBadgeTone === "settled"
          ? toolbenchReviewPassMessages.workspace.quickPickPriorityRouteBadgeSettled()
          : routeBadgeTone === "steady"
            ? toolbenchReviewPassMessages.workspace.quickPickPriorityRouteBadgeSteady()
            : toolbenchReviewPassMessages.workspace.quickPickPriorityRouteBadgeProvisional();
    if (routeBadgeHint) {
      const routeBadgeGuidance = [topRankedBookmark?.workType, topMomentumLabel, topPlanningAction ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({ action: topPlanningAction, tempered: topRestorePriorityTempered, reactivated: topPlanningReactivated, strengthened: topPlanningStrengthened, recoveryTargetTrend: topRecoveryTargetTrend, recoveryTargetActionability: topRecoveryTargetActionability }).replace(/\.$/, "") : "", topRecoveryTargetLabel, topRecoveryTargetSelectionReason, topRecoveryChoicePreference, topPlanningHold ? (quickPickBookmarkPlanningRecoveryHint(topRankedBookmark) || topRankedBookmark.planningHoldReason.replace(/\.$/, "")) : "", routeBadgeHint].filter(Boolean).join(" • ");
      toolbenchEl.v1RosterRouteBadge.title = `${routeBadgeGuidance} Focus the highest-priority summary.`;
      toolbenchEl.v1RosterRouteBadge.setAttribute("aria-label", `${routeBadgeGuidance} Focus the highest-priority summary.`);
    } else {
      toolbenchEl.v1RosterRouteBadge.removeAttribute("title");
      toolbenchEl.v1RosterRouteBadge.removeAttribute("aria-label");
    }
  }
  toolbenchEl.v1RosterRefreshBookmark.hidden = !hasQueueBookmark || bookmarkMatchesCurrent || !hasQueueMemory;
  toolbenchEl.v1RosterRefreshBookmark.disabled = !hasQueueBookmark || bookmarkMatchesCurrent || !hasQueueMemory;
  toolbenchEl.v1RosterRefreshBookmark.dataset.active = !bookmarkMatchesCurrent && hasQueueBookmark && hasQueueMemory ? "true" : "false";
  toolbenchEl.v1RosterRefreshBookmark.textContent = hasQueueBookmark
    ? `Refresh ${quickPickBookmarkLabel(lastBookmarkKey)}`
      : "Refresh saved view";
  const refreshRecoveryTarget =
    !bookmarkMatchesCurrent && hasQueueMemory && hasQueueBookmark
      ? refreshTargetPreviewForLens(lastBookmarkKey, currentQuickPickLensState())
      : null;
  if (refreshRecoveryTarget) {
    const refreshHint = `Refresh ${quickPickBookmarkLabel(lastBookmarkKey)} from the live queue lens • ${recoveryTargetStatusNote(refreshRecoveryTarget)}.`;
    toolbenchEl.v1RosterRefreshBookmark.title = refreshHint;
    toolbenchEl.v1RosterRefreshBookmark.setAttribute("aria-label", refreshHint);
  } else {
    toolbenchEl.v1RosterRefreshBookmark.removeAttribute("title");
    toolbenchEl.v1RosterRefreshBookmark.removeAttribute("aria-label");
  }
  const priorityFollowRecoveryTarget = topRankedBookmark && topRecoveryTarget?.record ? topRecoveryTarget : null;
  const activeFollowRecoveryTarget = refreshRecoveryTarget || priorityFollowRecoveryTarget;
  const activeFollowRecoveryTargetLabel =
    refreshRecoveryTarget
      ? quickPickBookmarkLabel(lastBookmarkKey)
      : priorityFollowRecoveryTarget
        ? quickPickBookmarkLabel(topRankedBookmark.key)
        : "";
  const activeFollowRecoveryTargetActionability =
    refreshRecoveryTarget
      ? refreshRecoveryTarget.actionability || ""
      : topRecoveryTargetActionability;
  const activeFollowRecoveryTargetReason =
    refreshRecoveryTarget
      ? refreshRecoveryTarget.selectionReason || ""
      : topRecoveryTargetSelectionReason;
  const activeFollowRecoveryTargetPreference =
    refreshRecoveryTarget
      ? refreshRecoveryTarget.preference || ""
      : topRecoveryChoicePreference;
  const activeFollowRecoveryTargetState =
    refreshRecoveryTarget?.choice === "holdingAlternative"
      ? "holding"
      : refreshRecoveryTarget?.choice === "fadingAlternative"
        ? "fading"
        : refreshRecoveryTarget?.choice === "lead"
          ? "lead"
          : topRecoveryChoicePreferenceState;
  toolbenchEl.v1RosterFollowRecoveryTarget.hidden = !activeFollowRecoveryTarget;
  toolbenchEl.v1RosterFollowRecoveryTarget.disabled = !activeFollowRecoveryTarget;
  toolbenchEl.v1RosterFollowRecoveryTarget.dataset.active =
    activeFollowRecoveryTarget?.record?.id && activeFollowRecoveryTarget.record.id === toolbenchRecord?.id
      ? "true"
      : "false";
  toolbenchEl.v1RosterFollowRecoveryTarget.dataset.priorityRestore =
    activeFollowRecoveryTarget && (activeFollowRecoveryTargetPreference || activeFollowRecoveryTargetReason || activeFollowRecoveryTargetActionability)
      ? "true"
      : "false";
  toolbenchEl.v1RosterFollowRecoveryTarget.dataset.recoveryPreferenceState = activeFollowRecoveryTargetState;
  toolbenchEl.v1RosterFollowRecoveryTarget.dataset.recovering = topPlanningRecovering ? "true" : "false";
  toolbenchEl.v1RosterFollowRecoveryTarget.textContent =
    activeFollowRecoveryTarget?.record?.title
      ? `Continue ${activeFollowRecoveryTarget.record.title}`
      : "Continue suggested area";
  if (activeFollowRecoveryTarget?.record?.title) {
    const followRecoveryHint = `Continue the suggested area for ${activeFollowRecoveryTargetLabel} • ${activeFollowRecoveryTarget.record.title}${activeFollowRecoveryTargetActionability ? ` • ${activeFollowRecoveryTargetActionability}` : ""}${activeFollowRecoveryTargetReason ? ` • ${activeFollowRecoveryTargetReason}` : ""}${activeFollowRecoveryTargetPreference ? ` • ${activeFollowRecoveryTargetPreference}` : ""}.`;
    toolbenchEl.v1RosterFollowRecoveryTarget.title = followRecoveryHint;
    toolbenchEl.v1RosterFollowRecoveryTarget.setAttribute("aria-label", followRecoveryHint);
  } else {
    toolbenchEl.v1RosterFollowRecoveryTarget.removeAttribute("title");
    toolbenchEl.v1RosterFollowRecoveryTarget.removeAttribute("aria-label");
  }
  toolbenchEl.v1RosterResetLens.hidden = !hasQueueMemory;
  toolbenchEl.v1RosterResetLens.disabled = !hasQueueMemory;
  toolbenchEl.v1RosterResetLens.dataset.active = hasQueueMemory ? "true" : "false";
  toolbenchEl.v1RosterFocusStrongest.hidden = !currentQuickPickCount;
  toolbenchEl.v1RosterFocusStrongest.disabled = !currentQuickPickCount;
  toolbenchEl.v1RosterFocusStrongest.dataset.active =
    currentStrongestRecord?.id && toolbenchRecord?.id === currentStrongestRecord.id ? "true" : "false";
  toolbenchEl.v1RosterFocusStrongest.dataset.cooling = focusCoolingHint ? "true" : "false";
  const strongestRecoveryTarget = recoveryReactivatedFocusTarget("improving");
  toolbenchEl.v1RosterFocusStrongest.textContent = `Show best-looking${
    topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""
  }`;
  const strongestHintBase = `Show the area that currently looks most improved.${currentStrongestRecord?.title ? ` Best-looking now: ${currentStrongestRecord.title}.` : ""}${strongestRecoveryTarget ? ` Suggested follow-up: ${recoveryFocusedTargetHint(strongestRecoveryTarget)}.` : ""}`;
  if (focusCoolingHint || strongestRecoveryTarget) {
    const strongestHint = `${strongestHintBase}${focusCoolingHint ? ` ${focusCoolingHint}` : ""}`;
    toolbenchEl.v1RosterFocusStrongest.title = strongestHint;
    toolbenchEl.v1RosterFocusStrongest.setAttribute("aria-label", strongestHint);
  } else {
    toolbenchEl.v1RosterFocusStrongest.removeAttribute("title");
    toolbenchEl.v1RosterFocusStrongest.removeAttribute("aria-label");
  }
  toolbenchEl.v1RosterFocusWeakest.hidden = !currentQuickPickCount;
  toolbenchEl.v1RosterFocusWeakest.disabled = !currentQuickPickCount;
  toolbenchEl.v1RosterFocusWeakest.dataset.active =
    currentWeakestRecord?.id && toolbenchRecord?.id === currentWeakestRecord.id ? "true" : "false";
  toolbenchEl.v1RosterFocusWeakest.dataset.cooling = focusCoolingHint ? "true" : "false";
  const weakestRecoveryTarget = recoveryReactivatedFocusTarget("attention");
  toolbenchEl.v1RosterFocusWeakest.textContent = `Show most urgent${
    topPlanningRecovering ? ` • ${toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()}` : ""
  }`;
  const weakestHintBase = `Show the area that needs attention most.${currentWeakestRecord?.title ? ` Most urgent now: ${currentWeakestRecord.title}.` : ""}${weakestRecoveryTarget ? ` Suggested follow-up: ${recoveryFocusedTargetHint(weakestRecoveryTarget)}.` : ""}`;
  if (focusCoolingHint || weakestRecoveryTarget) {
    const weakestHint = `${weakestHintBase}${focusCoolingHint ? ` ${focusCoolingHint}` : ""}`;
    toolbenchEl.v1RosterFocusWeakest.title = weakestHint;
    toolbenchEl.v1RosterFocusWeakest.setAttribute("aria-label", weakestHint);
  } else {
    toolbenchEl.v1RosterFocusWeakest.removeAttribute("title");
    toolbenchEl.v1RosterFocusWeakest.removeAttribute("aria-label");
  }
  toolbenchEl.v1RosterSortSummary.textContent = toolbenchReviewPassMessages.workspace.quickPickQueueSummary({
    count: currentQuickPickCount,
    filter: quickPickFilterDescription(),
    sort: quickPickSortDescription()
  });
  const queueWorkSplit = summarizeQuickPickWorkTypes(currentQuickPickRecords);
  const queueMomentumSplit = summarizeLaneRoutedReviewMomentum(currentQuickPickRecords);
  const queueRecoveryOrderedLane = quickPickRecoveryOrderedLaneMeta(currentQuickPickLensState(), currentQuickPickRecords);
  const queueRecoveryOrderedTarget =
    queueRecoveryOrderedLane && currentQuickPickRecords.length > 1
      ? recoveryReactivatedLaneRecordTarget(queueRecoveryOrderedLane, currentQuickPickLensState())
      : null;
  const queueRecoveryChoicePreference = topRecoveryChoicePreference;
  const queueMemoryQuality = quickPickBookmarkMemoryQuality(queueMomentumSplit, {
    restored: toolbenchQueueLensMemoryRestoredHighlight
  });
  const currentQueueBookmarkKey = quickPickBookmarkKeyForLens(currentQuickPickLensState());
  const currentQueueBookmarkMemoryMeta =
    toolbenchQuickPickBookmarks[currentQueueBookmarkKey]
      ? quickPickBookmarkReopenMemoryMeta(currentQueueBookmarkKey)
      : { label: "", type: "" };
  let queueExplainer = "";
  if (toolbenchQuickPickFilter === "current") {
    queueExplainer = toolbenchReviewPassMessages.workspace.quickPickQueueExplainerCurrent({
      workType: quickPickRecordWorkType({
        healthSummary: currentSummary,
        decisionOutcome: currentOutcome,
        decisionHistory: currentOutcomeHistory
      })
    });
  } else if (toolbenchQuickPickSortMode === "improving") {
    queueExplainer = toolbenchReviewPassMessages.workspace.quickPickQueueExplainerImproving({
      closeout: queueWorkSplit.closeout,
      watch: queueWorkSplit.watch
    });
  } else if (toolbenchQuickPickSortMode === "attention") {
    queueExplainer = toolbenchReviewPassMessages.workspace.quickPickQueueExplainerAttention({
      blocker: queueWorkSplit.blocker,
      cleanup: queueWorkSplit.cleanup
    });
  }
  const routedCapCount = Math.min(3, currentQuickPickRecords.filter((record) => {
    const context = contextRecordForRecord(record);
    return quickPickRecordWorkType({
      healthSummary: summarizeV1Health(context),
      decisionOutcome: summarizeCommercialSnapshotForContext(context)?.outcome || null,
      decisionHistory: currentDecisionOutcomeHistory(context)
    }) === (topRankedBookmark?.workType || "");
  }).length);
  if (queueExplainer && routedCapCount > 0 && toolbenchQuickPickSortMode !== "default") {
    queueExplainer += ` ${toolbenchReviewPassMessages.workspace.quickPickQueueExplainerRoutedCap({
      count: routedCapCount
    })}`;
  }
  if (queueExplainer && (queueMomentumSplit.cleared || queueMomentumSplit.tightened || queueMomentumSplit.nextActive)) {
    const momentumParts = [];
    if (queueMomentumSplit.cleared) momentumParts.push(`${queueMomentumSplit.cleared} recent clear${queueMomentumSplit.cleared === 1 ? "" : "s"}`);
    if (queueMomentumSplit.tightened) momentumParts.push(`${queueMomentumSplit.tightened} tightened`);
    if (queueMomentumSplit.nextActive) momentumParts.push(`${queueMomentumSplit.nextActive} next active`);
    queueExplainer += ` Routed momentum: ${momentumParts.join(" • ")}.`;
  }
  if (queueExplainer && queueRecoveryOrderedTarget?.record?.title) {
    queueExplainer += ` Recovery ordering is active: surfaced records are currently sequenced by recovery-target strength, with ${queueRecoveryOrderedTarget.record.title} leading the lane.`;
  }
  if (queueExplainer && topRankedBookmark?.planningReactivated) {
    queueExplainer += ` ${toolbenchReviewPassMessages.workspace.quickPickQueueRecoveryHint({
      label: quickPickBookmarkLabel(topRankedBookmark.key)
    })}`;
    const recoveryTarget = recoveryPreferredReopenTarget(
      topRankedBookmark,
      toolbenchQuickPickBookmarks[topRankedBookmark.key] || null
    );
    if (recoveryTarget?.record?.title) {
      queueExplainer += ` ${toolbenchReviewPassMessages.workspace.quickPickQueueRecoveryTargetHint({
        title: recoveryTarget.record.title
      })}`;
      if (recoveryTarget.selectionReason) {
        queueExplainer += ` ${recoveryTarget.selectionReason}.`;
      }
    }
  }
  if (queueExplainer && topRankedBookmark?.recoveryTargetActionability) {
    queueExplainer += ` Recovery-target state: ${topRankedBookmark.recoveryTargetActionability}.`;
  }
  if (queueExplainer && queueRecoveryChoicePreference) {
    queueExplainer += ` Recovery-choice preference: ${queueRecoveryChoicePreference}.`;
  }
  const cooledLane = [topRankedBookmark, runnerUpBookmark].find((lane) => (lane?.planningMemoryScore || 0) < 0);
  if (queueExplainer && cooledLane) {
    queueExplainer += ` ${toolbenchReviewPassMessages.workspace.quickPickQueueCoolingHint({
      label: quickPickBookmarkLabel(cooledLane.key),
      detail: quickPickBookmarkPlanningRecoveryHint(cooledLane) || `${quickPickBookmarkLabel(cooledLane.key)} cooling off after a recent lane action`
    })}`;
  }
  if (queueExplainer && toolbenchQueueExplainerRoutedActive) {
    queueExplainer += ` ${toolbenchReviewPassMessages.workspace.quickPickQueueExplainerRoutedActive()}${toolbenchQueueExplainerRoutedActiveDetail ? ` ${toolbenchQueueExplainerRoutedActiveDetail}` : ""}`;
  }
  if (queueExplainer && toolbenchQueueExplainerRoutedResult) {
    queueExplainer += ` ${toolbenchQueueExplainerRoutedResult}`;
  }
  toolbenchEl.v1RosterSortExplainer.hidden = !queueExplainer;
  toolbenchEl.v1RosterSortExplainer.textContent = queueExplainer;
  toolbenchEl.v1RosterSortExplainer.dataset.cooling = cooledLane ? "true" : "false";
  toolbenchEl.v1RosterSortExplainer.dataset.reactivated = topRankedBookmark?.planningReactivated ? "true" : "false";
  toolbenchEl.v1RosterSortExplainer.dataset.active =
    toolbenchQueueExplainerRoutedActive || toolbenchQueueExplainerRoutedResult ? "true" : "false";
  const prioritySummaryRecovering = topPlanningHold && topPlanningCooldownStage === "late";
  toolbenchEl.v1RosterPrioritySummary.hidden = !topRankedBookmark;
  toolbenchEl.v1RosterPrioritySummary.dataset.changed = topRankedBookmark && toolbenchPriorityBookmarkChanged ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.stability =
    !topRankedBookmark
      ? ""
      : prioritySummaryRecovering
        ? "recovering"
        : toolbenchPriorityBookmarkStableCount >= 2
          ? "stable"
          : "unsettled";
  toolbenchEl.v1RosterPrioritySummary.dataset.confidence =
    topRankedBookmark && routerGap >= 40 ? "decisive" : "close";
  if (topRankedBookmark) {
    toolbenchEl.v1RosterPrioritySummary.setAttribute("role", "button");
    toolbenchEl.v1RosterPrioritySummary.setAttribute("tabindex", "0");
  } else {
    toolbenchEl.v1RosterPrioritySummary.removeAttribute("role");
    toolbenchEl.v1RosterPrioritySummary.setAttribute("tabindex", "-1");
  }
  toolbenchEl.v1RosterPrioritySummary.dataset.streakTone =
    !topRankedBookmark
      ? ""
      : toolbenchPriorityBookmarkStableCount >= 3
        ? "settled"
        : toolbenchPriorityBookmarkStableCount <= 1
          ? "provisional"
          : "steady";
  toolbenchEl.v1RosterPrioritySummary.dataset.momentumQuality =
    topRankedBookmark ? quickPickBookmarkMomentumQuality(topRankedBookmark.momentum) : "";
  toolbenchEl.v1RosterPrioritySummary.dataset.temperedMomentum = topTemperedMomentum ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.reopenMemoryType =
    topRankedBookmark?.reopenMemory?.type || "";
  toolbenchEl.v1RosterPrioritySummary.dataset.reactivated = topPlanningReactivated ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.recoveryPreferenceState = topRecoveryChoicePreferenceState;
  toolbenchEl.v1RosterPrioritySummary.dataset.guidanceMode = currentRouteGuidanceMode();
  if (runnerUpHint) {
    const summaryGuidance = [topRankedBookmark?.workType, runnerUpHint].filter(Boolean).join(" • ");
    toolbenchEl.v1RosterPrioritySummary.title = `${summaryGuidance} Focus the route badge.`;
    toolbenchEl.v1RosterPrioritySummary.setAttribute("aria-label", `${summaryGuidance} Focus the route badge.`);
  } else {
    toolbenchEl.v1RosterPrioritySummary.removeAttribute("title");
    toolbenchEl.v1RosterPrioritySummary.removeAttribute("aria-label");
  }
  const routeGuidanceSummary = routeGuidanceSummaryLabel();
  const priorityLaneActive =
    topRankedBookmark && topRankedBookmark.key === toolbenchQuickPickBookmarkPriorityOpenedKey
      ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityOpened()
      : "";
  const priorityLanePlanActive = toolbenchQuickPickBookmarkPlanResultSummaryCopy || "";
  const priorityLanePlanReleased = toolbenchQuickPickBookmarkPlanReleaseSummaryCopy || "";
  toolbenchEl.v1RosterPrioritySummary.dataset.priorityOpened = priorityLaneActive ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.planResult = priorityLanePlanActive ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.planRelease = priorityLanePlanReleased ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.planningHold = topPlanningHold ? "true" : "false";
  toolbenchEl.v1RosterPrioritySummary.dataset.planningCooldown = topPlanningHold ? topPlanningCooldownTone : "";
  toolbenchEl.v1RosterPrioritySummary.dataset.planningCooldownStage = topPlanningHold ? topPlanningCooldownStage : "";
  toolbenchEl.v1RosterPrioritySummary.textContent = topRankedBookmark
    ? (
        toolbenchPriorityBookmarkChanged
          ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryChanged({
              label: quickPickBookmarkLabel(topRankedBookmark.key),
              reason: [topRankedBookmark.workType, topMomentumLabel, topRankedBookmark.reason, topPlanningAction ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({ action: topPlanningAction, tempered: topRestorePriorityTempered, reactivated: topPlanningReactivated, strengthened: topPlanningStrengthened, recoveryTargetTrend: topRecoveryTargetTrend, recoveryTargetActionability: topRecoveryTargetActionability }).replace(/\.$/, "") : "", topRankedBookmark.planningHoldReason ? topRankedBookmark.planningHoldReason.replace(/\.$/, "") : "", topRecoveryTargetLabel, topRecoveryTargetSelectionReason, topRecoveryChoicePreference, lastRoutedLabel, routeStreakLabel, runnerUpLabel, routeGuidanceSummary, priorityLaneActive, priorityLanePlanActive, priorityLanePlanReleased].filter(Boolean).join(" • ")
            })
          : `${toolbenchReviewPassMessages.workspace.quickPickPrioritySummary({
              label: quickPickBookmarkLabel(topRankedBookmark.key),
              reason: [topRankedBookmark.workType, topMomentumLabel, topRankedBookmark.reason, topPlanningAction ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({ action: topPlanningAction, tempered: topRestorePriorityTempered, reactivated: topPlanningReactivated, strengthened: topPlanningStrengthened, recoveryTargetTrend: topRecoveryTargetTrend, recoveryTargetActionability: topRecoveryTargetActionability }).replace(/\.$/, "") : "", topRankedBookmark.planningHoldReason ? topRankedBookmark.planningHoldReason.replace(/\.$/, "") : "", topRecoveryTargetLabel, topRecoveryTargetSelectionReason, topRecoveryChoicePreference].filter(Boolean).join(" • ")
            }).replace(/\.$/, "")} • ${
              prioritySummaryRecovering
                ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryRecovering()
                : toolbenchPriorityBookmarkStableCount >= 2
                ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryStable()
                : toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryUnsettled()
            } • ${
              routerGap >= 40
                ? toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryDecisive()
                : toolbenchReviewPassMessages.workspace.quickPickPrioritySummaryCloseCall()
            }${routeStreakLabel ? ` • ${routeStreakLabel}` : ""}${lastRoutedLabel ? ` • ${lastRoutedLabel}` : ""}${runnerUpLabel ? ` • ${runnerUpLabel}` : ""}${routeGuidanceSummary ? ` • ${routeGuidanceSummary}` : ""}${priorityLaneActive ? ` • ${priorityLaneActive}` : ""}${priorityLanePlanActive ? ` • ${priorityLanePlanActive}` : ""}${priorityLanePlanReleased ? ` • ${priorityLanePlanReleased}` : ""}.`
      )
    : priorityLanePlanActive
      ? `Highest-priority lane cleared • ${priorityLanePlanActive}.`
      : priorityLanePlanReleased
        ? `Highest-priority lane updated • ${priorityLanePlanReleased}.`
      : "";
  if (toolbenchEl.v1RosterRouteLinkHint) {
    const routeLinkHintText = routeLinkHintCopy();
    const routeGuidanceMode = currentRouteGuidanceMode();
    toolbenchEl.v1RosterRouteLinkHint.dataset.state =
      toolbenchRouteLinkHintRestoredVisible
        ? "restored"
        : toolbenchRouteLinkHintLearnedVisible
          ? "learned"
          : "default";
    const showRouteHint =
      topRankedBookmark &&
      !toolbenchEl.v1RosterRouteBadge?.hidden &&
      Boolean(routeLinkHintText);
    toolbenchEl.v1RosterRouteLinkHint.hidden = !showRouteHint;
    toolbenchEl.v1RosterRouteLinkHint.textContent =
      toolbenchEl.v1RosterRouteLinkHint.hidden ? "" : routeLinkHintText;
    const showRouteReset =
      topRankedBookmark &&
      !toolbenchEl.v1RosterRouteBadge?.hidden &&
      (
        toolbenchRouteLinkHintDismissed ||
        toolbenchRouteBadgeHintSoftened ||
        toolbenchRouteSummaryHintSoftened
      );
    if (toolbenchEl.v1RosterRouteLinkReset) {
      const routeTipsActive = toolbenchRouteLinkHintRestoredVisible && toolbenchPriorityBookmarkStableCount < 2;
      toolbenchEl.v1RosterRouteLinkReset.hidden = !showRouteReset;
      toolbenchEl.v1RosterRouteLinkReset.dataset.state = routeTipsActive ? "active" : "default";
      toolbenchEl.v1RosterRouteLinkReset.textContent = routeTipsActive
        ? "Route tips active"
        : "Reset route tips";
      toolbenchEl.v1RosterRouteLinkReset.title = routeGuidanceResetLabel(routeGuidanceMode);
      toolbenchEl.v1RosterRouteLinkReset.setAttribute("aria-label", `${toolbenchEl.v1RosterRouteLinkReset.textContent}. ${routeGuidanceResetLabel(routeGuidanceMode)}`);
    }
    if (toolbenchEl.v1RosterRouteLinkWrap) {
      toolbenchEl.v1RosterRouteLinkWrap.dataset.mode = routeGuidanceMode;
      toolbenchEl.v1RosterRouteLinkWrap.hidden = !showRouteHint && !showRouteReset;
    }
  } else if (toolbenchEl.v1RosterRouteLinkWrap) {
    toolbenchEl.v1RosterRouteLinkWrap.hidden = true;
  }
  const showQueueMemory = hasQueueMemory && !toolbenchQueueLensMemoryDismissed;
  const queueMemoryPlanReleased =
    showQueueMemory &&
    toolbenchQuickPickBookmarkPlanReleaseSummaryCopy &&
    currentBookmark &&
    lastBookmarkKey === toolbenchQuickPickBookmarkPlanReleaseKey
      ? toolbenchQuickPickBookmarkPlanReleaseSummaryCopy
      : "";
  toolbenchEl.v1RosterSortMemoryWrap.hidden = !showQueueMemory;
  toolbenchEl.v1RosterSortMemoryWrap.dataset.restored = showQueueMemory && toolbenchQueueLensMemoryRestoredHighlight ? "true" : "false";
  toolbenchEl.v1RosterSortMemoryWrap.dataset.momentumQuality = showQueueMemory ? queueMemoryQuality : "";
  toolbenchEl.v1RosterSortMemoryWrap.dataset.planRelease = queueMemoryPlanReleased ? "true" : "false";
  toolbenchEl.v1RosterSortMemoryWrap.dataset.reopenMemoryType =
    showQueueMemory && toolbenchQueueLensMemoryRestoredHighlight
      ? currentQueueBookmarkMemoryMeta.type || ""
      : "";
  toolbenchEl.v1RosterSortMemory.textContent = showQueueMemory
    ? toolbenchReviewPassMessages.workspace.quickPickQueueMemory({
        filter: quickPickFilterDescription(),
        sort: quickPickSortDescription(),
        quality: queueMemoryQuality,
        tempered: quickPickBookmarkTemperedSignal(queueMomentumSplit),
        reopenMemory:
          toolbenchQueueLensMemoryRestoredHighlight
            ? currentQueueBookmarkMemoryMeta.label
            : "",
        recoveryPreference: queueRecoveryChoicePreference,
        released: queueMemoryPlanReleased
      })
    : "";
  const queueActivityEntries = showQueueMemory ? quickPickLaneActivityEntries(toolbenchQuickPickLaneActivity) : [];
  if (toolbenchEl.v1RosterSortMemoryActivity) {
    toolbenchEl.v1RosterSortMemoryActivity.hidden = !queueActivityEntries.length;
    toolbenchEl.v1RosterSortMemoryActivity.replaceChildren();
    if (queueActivityEntries.length) {
      const label = document.createElement("span");
      label.className = "workspace-v1-roster-sort-memory-activity-label";
      label.textContent = "Recent shortcuts:";
      toolbenchEl.v1RosterSortMemoryActivity.append(label);
      renderQuickPickLaneActivityButtons(toolbenchEl.v1RosterSortMemoryActivity, queueActivityEntries, { clear: false });
    }
  }
  const recentLaneActivityEntries = quickPickLaneActivityEntries(toolbenchQuickPickLaneActivity);
  const hasLaneActivityUndo = Boolean(toolbenchQuickPickLaneActivityUndo?.entries?.length);
  if (toolbenchEl.v1RosterRecentActions) {
    toolbenchEl.v1RosterRecentActions.hidden = !recentLaneActivityEntries.length && !hasLaneActivityUndo;
  }
  if (toolbenchEl.v1RosterRecentActionsList) {
    renderQuickPickLaneActivityButtons(toolbenchEl.v1RosterRecentActionsList, recentLaneActivityEntries);
  }
  if (toolbenchEl.v1RosterRecentActionsUndo) {
    toolbenchEl.v1RosterRecentActionsUndo.hidden = !hasLaneActivityUndo;
    toolbenchEl.v1RosterRecentActionsUndo.disabled = !hasLaneActivityUndo;
    toolbenchEl.v1RosterRecentActionsUndo.textContent = quickPickLaneActivityUndoCountdownLabel();
  }
  if (toolbenchEl.v1RosterRecentActionsClear) {
    toolbenchEl.v1RosterRecentActionsClear.hidden = !recentLaneActivityEntries.length;
    toolbenchEl.v1RosterRecentActionsClear.disabled = !recentLaneActivityEntries.length;
  }
  toolbenchEl.v1RosterSortBookmark.hidden = !hasQueueBookmark;
  const currentBookmarkRecords = hasQueueBookmark ? quickPickRecordsForLens(currentBookmark) : [];
  const currentBookmarkMomentum = hasQueueBookmark ? summarizeLaneRoutedReviewMomentum(currentBookmarkRecords) : null;
  const currentBookmarkQuality = quickPickBookmarkMemoryQuality(currentBookmarkMomentum);
  const currentBookmarkTemperedSignal = quickPickBookmarkTemperedSignal(currentBookmarkMomentum);
  const currentBookmarkTemperedMomentum = laneMomentumHasTempered(currentBookmarkMomentum);
  const bookmarkRestorePriorityHint = quickPickBookmarkRestorePriorityHint(topRankedBookmark, lastBookmarkKey);
  const bookmarkReopenMemoryMeta = hasQueueBookmark ? quickPickBookmarkReopenMemoryMeta(lastBookmarkKey) : { label: "", type: "" };
  const bookmarkReopenMemory = bookmarkReopenMemoryMeta.label;
  const bookmarkPlanningMemory = hasQueueBookmark ? toolbenchQuickPickBookmarkPlanningMemoryByKey[lastBookmarkKey] || null : null;
  const bookmarkPriority = quickPickBookmarkPriority({
    urgency: quickPickBookmarkUrgency(currentBookmarkRecords),
    degraded: !bookmarkMatchesCurrent,
    count: currentBookmarkRecords.length
  });
  const initialBookmarkPlanningAction = hasQueueBookmark
    ? quickPickBookmarkPlanningAction({
        count: currentBookmarkRecords.length,
        degraded: !bookmarkMatchesCurrent,
        resolved: false,
        priority: bookmarkPriority,
        urgency: quickPickBookmarkUrgency(currentBookmarkRecords),
        momentum: currentBookmarkMomentum,
        reopenMemory: bookmarkReopenMemoryMeta,
        planningMemory: bookmarkPlanningMemory
      })
    : "";
  const initialBookmarkPlanningReactivated = hasQueueBookmark
    ? quickPickBookmarkPlanningRecoveryReactivated({
        planningAction: initialBookmarkPlanningAction,
        momentum: currentBookmarkMomentum,
        reopenMemory: bookmarkReopenMemoryMeta,
        planningMemory: bookmarkPlanningMemory
      })
    : false;
  const bookmarkRecoveryTarget = hasQueueBookmark && currentBookmark
    ? recoveryReactivatedLaneRecordTarget(
        {
          key: lastBookmarkKey,
          planningReactivated: initialBookmarkPlanningReactivated
        },
        currentBookmark
      )
    : null;
  const bookmarkRecoveryTargetMemory = hasQueueBookmark
    ? quickPickBookmarkRecoveryTargetMemoryMeta(lastBookmarkKey, bookmarkRecoveryTarget)
    : { trend: "", label: "" };
  const bookmarkRecoveryTargetActionability = hasQueueBookmark
    ? quickPickBookmarkRecoveryTargetActionability(bookmarkRecoveryTargetMemory)
    : "";
  const bookmarkPlanningAction = hasQueueBookmark
    ? quickPickBookmarkPlanningAction({
        count: currentBookmarkRecords.length,
        degraded: !bookmarkMatchesCurrent,
        resolved: false,
        priority: bookmarkPriority,
        urgency: quickPickBookmarkUrgency(currentBookmarkRecords),
        momentum: currentBookmarkMomentum,
        reopenMemory: bookmarkReopenMemoryMeta,
        planningMemory: bookmarkPlanningMemory,
        hasRecoveryTarget: Boolean(bookmarkRecoveryTarget?.record),
        recoveryTargetTrend: bookmarkRecoveryTargetMemory.trend,
        recoveryTargetActionability: bookmarkRecoveryTargetActionability
      })
    : "";
  const bookmarkPlanningReactivated = hasQueueBookmark
    ? quickPickBookmarkPlanningRecoveryReactivated({
        planningAction: bookmarkPlanningAction,
        momentum: currentBookmarkMomentum,
        reopenMemory: bookmarkReopenMemoryMeta,
        planningMemory: bookmarkPlanningMemory
      })
    : false;
  const bookmarkRecoveryChoice = effectiveRecoveryChoicePreference(
    hasQueueBookmark ? { key: lastBookmarkKey, planningReactivated: initialBookmarkPlanningReactivated || bookmarkPlanningReactivated } : null,
    currentBookmark
  );
  const bookmarkRecoveryChoicePreference = bookmarkRecoveryChoice.preference;
  const bookmarkPlanningStrengthened = hasQueueBookmark
    ? quickPickBookmarkPlanningRecoveryTargetStrengthened({
        planningAction: bookmarkPlanningAction,
        priority: bookmarkPriority,
        reopenMemory: bookmarkReopenMemoryMeta,
        momentum: currentBookmarkMomentum,
        hasRecoveryTarget: Boolean(bookmarkRecoveryTarget?.record)
      })
    : false;
  const bookmarkPlanningHoldReason = hasQueueBookmark
    ? quickPickBookmarkPlanningHoldReason(bookmarkPlanningMemory, bookmarkPlanningAction, currentBookmarkMomentum)
    : "";
  const bookmarkPlanningCooldownTone = hasQueueBookmark ? quickPickBookmarkPlanningCooldownTone(currentBookmarkMomentum) : "";
  const bookmarkPlanningCooldownStage = hasQueueBookmark ? quickPickBookmarkPlanningCooldownStage(bookmarkPlanningMemory, currentBookmarkMomentum) : "";
  toolbenchEl.v1RosterSortBookmark.textContent = hasQueueBookmark
      ? toolbenchReviewPassMessages.workspace.quickPickBookmarkMemory({
        label: quickPickBookmarkLabel(lastBookmarkKey),
        filter: quickPickFilterDescription(
          currentBookmark?.filter || "all",
          currentBookmark?.layerFilter || ""
        ),
        sort: quickPickSortDescription(currentBookmark?.sort || "default"),
        quality: currentBookmarkQuality,
        tempered: currentBookmarkTemperedSignal
      }) + (bookmarkMatchesCurrent ? "" : ` ${toolbenchReviewPassMessages.workspace.quickPickBookmarkUpdateHint({ label: quickPickBookmarkLabel(lastBookmarkKey) })}`) + (bookmarkRestorePriorityHint ? ` ${bookmarkRestorePriorityHint}` : "") + (bookmarkReopenMemory ? ` Reopen memory: ${bookmarkReopenMemory}.` : "") + (bookmarkPlanningAction ? ` ${toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({ action: bookmarkPlanningAction, tempered: currentBookmarkTemperedSignal, reactivated: bookmarkPlanningReactivated, strengthened: bookmarkPlanningStrengthened, recoveryTargetTrend: bookmarkRecoveryTargetMemory.label, recoveryTargetActionability: bookmarkRecoveryTargetActionability })}` : "") + (bookmarkPlanningHoldReason ? ` ${bookmarkPlanningHoldReason}` : "")
        + (bookmarkRecoveryChoicePreference ? ` Recovery preference: ${bookmarkRecoveryChoicePreference}.` : "")
      : "";
  toolbenchEl.v1RosterSortBookmark.dataset.momentumQuality = hasQueueBookmark ? currentBookmarkQuality : "";
  toolbenchEl.v1RosterSortBookmark.dataset.temperedMomentum = currentBookmarkTemperedMomentum ? "true" : "false";
  toolbenchEl.v1RosterSortBookmark.dataset.reopenMemoryType = hasQueueBookmark ? bookmarkReopenMemoryMeta.type : "";
  toolbenchEl.v1RosterSortBookmark.dataset.reactivated = bookmarkPlanningReactivated ? "true" : "false";
  toolbenchEl.v1RosterSortBookmark.dataset.planningHold = bookmarkPlanningHoldReason ? "true" : "false";
  toolbenchEl.v1RosterSortBookmark.dataset.planningCooldown = bookmarkPlanningHoldReason ? bookmarkPlanningCooldownTone : "";
  toolbenchEl.v1RosterSortBookmark.dataset.planningCooldownStage = bookmarkPlanningHoldReason ? bookmarkPlanningCooldownStage : "";
  toolbenchEl.v1RosterSortBookmarkList.hidden = !bookmarkEntries.length;
  toolbenchEl.v1RosterSortBookmarkList.innerHTML = bookmarkEntries
    .map(([key]) => {
      const active = quickPickLensMatches(toolbenchQuickPickBookmarks[key], currentQuickPickLensState());
      const recent = key === lastBookmarkKey;
      const opened = key === toolbenchQuickPickBookmarkOpenedKey;
      const priorityOpened = key === toolbenchQuickPickBookmarkPriorityOpenedKey;
      const planResult = key === toolbenchQuickPickBookmarkPlanResultKey ? toolbenchQuickPickBookmarkPlanResultCopy : "";
      const planRelease = key === toolbenchQuickPickBookmarkPlanReleaseKey ? toolbenchQuickPickBookmarkPlanReleaseCopy : "";
      const bookmarkSnapshot = toolbenchQuickPickBookmarks[key]?.snapshot || { count: 0, weakCount: 0, partialCount: 0 };
      const laneRecords = quickPickRecordsForLens(toolbenchQuickPickBookmarks[key]);
      const count = laneRecords.length;
      const recency = quickPickBookmarkSavedLabel(toolbenchQuickPickBookmarks[key]?.savedAt || "");
      const urgency = quickPickBookmarkUrgency(laneRecords);
      const momentum = summarizeLaneRoutedReviewMomentum(laneRecords);
      const momentumLabel = quickPickBookmarkMomentumReason(momentum);
      const momentumQuality = quickPickBookmarkMomentumQuality(momentum);
      const temperedMomentum = laneMomentumHasTempered(momentum);
      const nextUp = laneRecords[0]?.title || "";
      const state = active
        ? toolbenchReviewPassMessages.workspace.quickPickBookmarkStateCurrent()
        : toolbenchReviewPassMessages.workspace.quickPickBookmarkStateStale();
      const currentSnapshot = quickPickBookmarkSnapshotForLens(toolbenchQuickPickBookmarks[key]);
      const deltaCount = currentSnapshot.count - bookmarkSnapshot.count;
      const delta = deltaCount > 0 ? `+${deltaCount}` : deltaCount < 0 ? `${deltaCount}` : "";
      const resolved =
        currentSnapshot.count < bookmarkSnapshot.count ||
        currentSnapshot.weakCount < bookmarkSnapshot.weakCount ||
        (currentSnapshot.weakCount === bookmarkSnapshot.weakCount && currentSnapshot.partialCount < bookmarkSnapshot.partialCount);
      const degraded =
        currentSnapshot.count > bookmarkSnapshot.count ||
        currentSnapshot.weakCount > bookmarkSnapshot.weakCount ||
        (currentSnapshot.weakCount === bookmarkSnapshot.weakCount && currentSnapshot.partialCount > bookmarkSnapshot.partialCount);
      const priority = quickPickBookmarkPriority({ urgency, degraded, resolved, count });
      const reopenMemory = quickPickBookmarkReopenMemoryMeta(key);
      const planningMemory = toolbenchQuickPickBookmarkPlanningMemoryByKey[key] || null;
      const initialPlanningAction = quickPickBookmarkPlanningAction({ count, degraded, resolved, priority, urgency, momentum, reopenMemory, planningMemory });
      const initialPlanningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
        planningAction: initialPlanningAction,
        momentum,
        reopenMemory,
        planningMemory
      });
      const recoveryTarget = recoveryReactivatedLaneRecordTarget(
        {
          key,
          planningReactivated: initialPlanningReactivated
        },
        toolbenchQuickPickBookmarks[key]
      );
      const recoveryTargetMemory = quickPickBookmarkRecoveryTargetMemoryMeta(key, recoveryTarget);
      const recoveryTargetActionability = quickPickBookmarkRecoveryTargetActionability(recoveryTargetMemory);
      const planningAction = quickPickBookmarkPlanningAction({
        count,
        degraded,
        resolved,
        priority,
        urgency,
        momentum,
        reopenMemory,
        planningMemory,
        hasRecoveryTarget: Boolean(recoveryTarget?.record),
        recoveryTargetTrend: recoveryTargetMemory.trend,
        recoveryTargetActionability
      });
      const planningReactivated = quickPickBookmarkPlanningRecoveryReactivated({
        planningAction,
        momentum,
        reopenMemory,
        planningMemory
      });
      const planningStrengthened = quickPickBookmarkPlanningRecoveryTargetStrengthened({
        planningAction,
        priority,
        reopenMemory,
        momentum,
        hasRecoveryTarget: Boolean(recoveryTarget?.record)
      });
      const planningHoldReason = quickPickBookmarkPlanningHoldReason(planningMemory, planningAction, momentum);
      const recovering = quickPickBookmarkPlanningCooldownStage(planningMemory, momentum) === "late";
      const recoveryChoice = effectiveRecoveryChoicePreference(
        {
          key,
          planningReactivated
        },
        toolbenchQuickPickBookmarks[key]
      );
      const recoveryPreference = recoveryChoice.preference;
      const recoveryPreferenceState = recoveryChoice.state;
      const planningTitle = `${toolbenchReviewPassMessages.workspace.quickPickBookmarkPlanningHint({ action: planningAction, tempered: quickPickBookmarkTemperedSignal(momentum), reactivated: planningReactivated, strengthened: planningStrengthened, recoveryTargetTrend: recoveryTargetMemory.label, recoveryTargetActionability })}${planningHoldReason ? ` ${planningHoldReason}` : ""}${recoveryPreference ? ` Recovery preference: ${recoveryPreference}.` : ""}`.trim();
      return `<button type="button" data-bookmark-key="${escapeHtml(key)}" data-active="${active ? "true" : "false"}" data-recent="${recent ? "true" : "false"}" data-opened="${opened ? "true" : "false"}" data-priority-opened="${priorityOpened ? "true" : "false"}" data-plan-result="${planResult ? "true" : "false"}" data-plan-release="${planRelease ? "true" : "false"}" data-planning-hold="${planningHoldReason ? "true" : "false"}" data-planning-cooldown="${escapeHtml(planningHoldReason ? quickPickBookmarkPlanningCooldownTone(momentum) : "")}" data-planning-cooldown-stage="${escapeHtml(planningHoldReason ? quickPickBookmarkPlanningCooldownStage(planningMemory, momentum) : "")}" data-reactivated="${planningReactivated ? "true" : "false"}" data-resolved="${resolved ? "true" : "false"}" data-degraded="${degraded ? "true" : "false"}" data-state="${active ? "current" : "stale"}" data-momentum-quality="${escapeHtml(momentumQuality)}" data-tempered-momentum="${temperedMomentum ? "true" : "false"}" data-reopen-memory-type="${escapeHtml(reopenMemory.type || "")}" data-recovery-preference="${escapeHtml(recoveryPreference)}" data-recovery-preference-state="${escapeHtml(recoveryPreferenceState)}" title="${escapeHtml(planningTitle)}" aria-label="${escapeHtml(planningTitle)}">${escapeHtml(toolbenchReviewPassMessages.workspace.quickPickBookmarkListLabel({ label: quickPickBookmarkLabel(key), recent, count, delta, urgency, nextUp, state, priority, recency, momentum: momentumLabel, recovering, resolved, degraded, opened: planRelease || planResult || (priorityOpened ? toolbenchReviewPassMessages.workspace.quickPickBookmarkPriorityOpened() : opened) }))}</button>`;
    })
    .join("");
  toolbenchEl.v1RosterTitle.textContent = toolbenchReviewPassMessages.roster.title();
  toolbenchEl.v1RosterCopy.textContent = toolbenchDecisionContextRecords.length
    ? toolbenchReviewPassMessages.roster.summary({
        strong: counts.strong,
        partial: counts.partial,
        weak: counts.weak
      })
    : toolbenchReviewPassMessages.roster.empty();
  toolbenchEl.v1RosterOrigin.textContent =
    toolbenchReviewPassOrigin === "backend"
      ? toolbenchReviewPassMessages.origin.backend()
      : toolbenchReviewPassOrigin === "session"
        ? toolbenchReviewPassMessages.origin.session()
        : toolbenchReviewPassMessages.origin.local();
  toolbenchEl.v1RosterOrigin.dataset.state = toolbenchReviewPassOrigin;
  toolbenchEl.v1RosterAudit.textContent = reviewPassAuditCopy();
  toolbenchEl.v1RosterSync.textContent = reviewPassSyncCopy();
  toolbenchEl.v1RosterSync.dataset.state = toolbenchReviewPassSync.state;
  toolbenchEl.v1RosterBackendNotice.textContent =
    toolbenchBackendPreviewNotice || toolbenchReviewPassMessages.roster.backendNoticePlaceholder();
  toolbenchEl.v1RosterBackendNotice.hidden = !toolbenchBackendPreviewNotice;
  toolbenchEl.v1RosterBackendNotice.dataset.state = toolbenchBackendPreviewNoticeState;
  toolbenchEl.v1RosterBackendNotice.dataset.tone = toolbenchBackendPreviewNoticeTone;
  const showBackendBadge = toolbenchBackendReviewPassMeta.available || hasLocalReviewPassState();
  toolbenchEl.v1RosterBackend.hidden = !showBackendBadge;
  toolbenchEl.v1RosterBackend.textContent = showBackendBadge ? backendReviewPassBadgeCopy() : "";
  toolbenchEl.v1RosterBackend.dataset.state = showBackendBadge
    ? (canUseBackendReviewPass()
        ? (toolbenchBackendReviewPassMeta.available ? "available" : "missing")
        : "local")
    : "idle";
  const badgeIsResumable = Boolean(
    showBackendBadge &&
    !toolbenchBackendPreviewOpen &&
    (toolbenchBackendReviewPassMeta.available || !canUseBackendReviewPass()) &&
    toolbenchBackendPreviewFocusTarget &&
    toolbenchBackendPreviewFocusTarget !== "badge" &&
    (canUseBackendReviewPass() || hasLocalReviewPassState())
  );
  const badgeResumeHint = badgeIsResumable ? backendReviewPassBadgeResumeHint() : "";
  toolbenchEl.v1RosterBackend.dataset.resumable = String(badgeIsResumable);
  toolbenchEl.v1RosterBackend.dataset.resumeCopy = badgeResumeHint;
  toolbenchEl.v1RosterBackend.title = showBackendBadge ? (badgeResumeHint || toolbenchEl.v1RosterBackend.textContent) : "";
  toolbenchEl.v1RosterBackend.setAttribute(
    "aria-label",
    showBackendBadge
      ? (badgeResumeHint
          ? `${toolbenchEl.v1RosterBackend.textContent}. ${badgeResumeHint}`
          : toolbenchEl.v1RosterBackend.textContent)
      : ""
  );
  toolbenchEl.v1RosterBackend.setAttribute("aria-expanded", showBackendBadge && toolbenchBackendPreviewOpen ? "true" : "false");
  toolbenchEl.v1RosterBackendPreview.hidden = !(toolbenchBackendPreviewOpen && toolbenchBackendReviewPassMeta.available && canUseBackendReviewPass());
  toolbenchEl.v1RosterBackendScope.textContent = backendReviewPassScopeCopy();
  toolbenchEl.v1RosterCurrentScope.textContent = currentReviewPassScopeCopy();
  toolbenchEl.v1RosterBackendCompare.textContent = backendReviewPassCompareCopy();
  toolbenchEl.v1RosterBackendItem.textContent = backendReviewPassItemCopy();
  const backendItemStatus = backendReviewPassItemStatusMeta();
  toolbenchEl.v1RosterBackendItemStatus.textContent = backendItemStatus.text;
  toolbenchEl.v1RosterBackendItemStatus.dataset.state = backendItemStatus.state;
  toolbenchEl.v1RosterBackendFocusHint.textContent =
    toolbenchBackendPreviewFocusHint || toolbenchReviewPassMessages.roster.backendFocusPlaceholder();
  toolbenchEl.v1RosterBackendFocusHint.hidden = !toolbenchBackendPreviewFocusHint;
  toolbenchEl.v1RosterBackendResolved.textContent = toolbenchReviewPassMessages.roster.backendResolved({
    count: toolbenchBackendReviewPassMeta.resolvedCount
  });
  toolbenchEl.v1RosterBackendUpdated.textContent = toolbenchBackendReviewPassMeta.updatedAt
    ? toolbenchReviewPassMessages.roster.backendSynced({
        at: formatShortDateTime(toolbenchBackendReviewPassMeta.updatedAt)
      })
    : toolbenchReviewPassMessages.roster.backendSyncPending();
  const canRestoreBackend = canUseBackendReviewPass() && toolbenchReviewPassOrigin !== "backend";
  const canRestoreAndJump = canRestoreBackend && Boolean(toolbenchBackendReviewPassMeta.activeReviewKey);
  const canClearLocal = hasLocalReviewPassState() && toolbenchReviewPassOrigin !== "backend";
  const activePreviewTarget = toolbenchBackendPreviewOpen ? toolbenchBackendPreviewFocusTarget : "";
  toolbenchEl.v1RosterRestoreJump.hidden = !canRestoreAndJump;
  toolbenchEl.v1RosterRestoreJump.disabled = !canRestoreAndJump;
  toolbenchEl.v1RosterRestoreJump.textContent = backendReviewPassRestoreJumpLabel();
  toolbenchEl.v1RosterRestoreJump.dataset.state = backendItemStatus.state;
  toolbenchEl.v1RosterRestoreJump.dataset.active = String(activePreviewTarget === "restoreJump" && canRestoreAndJump);
  const showPlainRestore = canRestoreBackend && !canRestoreAndJump;
  toolbenchEl.v1RosterRestore.hidden = !showPlainRestore;
  toolbenchEl.v1RosterRestore.disabled = !showPlainRestore;
  toolbenchEl.v1RosterRestore.textContent = toolbenchBackendPreviewMessages.action.restoreScope();
  toolbenchEl.v1RosterRestore.dataset.active = String(activePreviewTarget === "restore" && showPlainRestore);
  toolbenchEl.v1RosterClear.hidden = !canClearLocal;
  toolbenchEl.v1RosterClear.disabled = !canClearLocal;
  toolbenchEl.v1RosterClear.dataset.active = String(activePreviewTarget === "clear" && canClearLocal);
  focusBackendPreviewTarget();
  const breakdown = v1RosterLayerBreakdown(summaries);
  toolbenchEl.v1RosterBreakdownTitle.textContent = toolbenchReviewPassMessages.breakdown.title();
  toolbenchEl.v1RosterBreakdownList.replaceChildren();
  if (!breakdown.length) {
    const empty = document.createElement("span");
    empty.textContent = toolbenchReviewPassMessages.breakdown.empty();
    toolbenchEl.v1RosterBreakdownList.append(empty);
  } else {
    breakdown.forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "workspace-v1-roster-chip";
      chip.textContent = `${item.label} • ${item.count}`;
      chip.dataset.active = toolbenchQuickPickLayerFilter === item.label ? "true" : "false";
      chip.setAttribute("aria-pressed", toolbenchQuickPickLayerFilter === item.label ? "true" : "false");
      chip.addEventListener("click", () => {
        applyV1RosterLayerFilter(item.label);
      });
      toolbenchEl.v1RosterBreakdownList.append(chip);
    });
  }
  toolbenchEl.v1Roster.dataset.state = counts.weak > 0 ? "partial" : "strong";
  toolbenchEl.v1Roster.querySelectorAll("[data-filter]").forEach((item) => {
    item.dataset.active = item.dataset.filter === toolbenchQuickPickFilter ? "true" : "false";
  });
}

function refreshV1GapPreview() {
  if (!toolbenchEl.v1GapPercentInput) return;
  const benchmarkHighPsf = parseEditableNumber(toolbenchEl.v1BenchmarkHighInput?.value);
  const askingPsf = parseEditableNumber(toolbenchEl.v1AskingPsfInput?.value);
  const gapPercent = calculateGapPercent(askingPsf, benchmarkHighPsf);
  toolbenchEl.v1GapPercentInput.value = gapPercent === null ? "" : String(gapPercent);
  renderV1Validation();
}

function linesFromArray(items = []) {
  return Array.isArray(items) ? items.join("\n") : "";
}

function parseLineList(value = "") {
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeCategoryMix(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => [item.category, item.count, item.signal].filter((part) => part !== undefined && part !== null && part !== "").join(" | "))
    .join("\n");
}

function parseCategoryMix(value = "") {
  const items = parseLineList(value)
    .map((line) => {
      const [category = "", count = "", signal = ""] = line.split("|").map((part) => part.trim());
      if (!category) return null;
      const parsedCount = Number.parseInt(count, 10);
      return {
        category,
        count: Number.isFinite(parsedCount) ? parsedCount : 0,
        signal
      };
    })
    .filter(Boolean);
  const total = items.reduce((sum, item) => sum + (Number.isFinite(item.count) ? item.count : 0), 0);
  return items.map((item) => ({
    ...item,
    share: total > 0 ? Number((item.count / total).toFixed(2)) : 0
  }));
}

function serializeOperators(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) =>
      [item.name, item.category, item.distanceMeters, item.relation, item.brandSignal]
        .filter((part) => part !== undefined && part !== null && part !== "")
        .join(" | ")
    )
    .join("\n");
}

function parseOperators(value = "") {
  return parseLineList(value)
    .map((line) => {
      const [name = "", category = "", distance = "", relation = "", brandSignal = ""] = line.split("|").map((part) => part.trim());
      if (!name) return null;
      const distanceMeters = Number.parseInt(distance, 10);
      return {
        name,
        category,
        distanceMeters: Number.isFinite(distanceMeters) ? distanceMeters : null,
        relation,
        brandSignal
      };
    })
    .filter(Boolean);
}

function serializeFitScores(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => [item.useCase, item.score, item.verdict, item.approvalRisk].filter((part) => part !== undefined && part !== null && part !== "").join(" | "))
    .join("\n");
}

function parseFitScores(value = "", existingFitScores = []) {
  const existingByUseCase = new Map((Array.isArray(existingFitScores) ? existingFitScores : []).map((item) => [item.useCase, item]));
  return parseLineList(value)
    .map((line) => {
      const [useCase = "", score = "", verdict = "", approvalRisk = ""] = line.split("|").map((part) => part.trim());
      if (!useCase) return null;
      const base = existingByUseCase.get(useCase) ? { ...existingByUseCase.get(useCase) } : {};
      const parsedScore = Number.parseInt(score, 10);
      return {
        ...base,
        useCase,
        score: Number.isFinite(parsedScore) ? parsedScore : base.score || 0,
        verdict: verdict || base.verdict || "",
        approvalRisk: approvalRisk || base.approvalRisk || ""
      };
    })
    .filter(Boolean);
}

function currentV1EditorSnapshot() {
  if (!toolbenchEl.v1EditorForm) return null;
  return {
    verdict: toolbenchEl.v1VerdictInput?.value.trim() || "",
    confidence: toolbenchEl.v1ConfidenceInput?.value.trim() || "",
    benchmarkLowPsf: toolbenchEl.v1BenchmarkLowInput?.value.trim() || "",
    benchmarkHighPsf: toolbenchEl.v1BenchmarkHighInput?.value.trim() || "",
    askingPsf: toolbenchEl.v1AskingPsfInput?.value.trim() || "",
    decisionSummary: toolbenchEl.v1DecisionInput?.value.trim() || "",
    valueGapSummary: toolbenchEl.v1ValueGapInput?.value.trim() || "",
    valueGapStatus: toolbenchEl.v1ValueGapStatusInput?.value.trim() || "",
    gapDirection: toolbenchEl.v1GapDirectionInput?.value.trim() || "",
    valueGapScore: toolbenchEl.v1ValueGapScoreInput?.value.trim() || "",
    likelyDrivers: toolbenchEl.v1LikelyDriversInput?.value.trim() || "",
    valueGapCautions: toolbenchEl.v1ValueGapCautionsInput?.value.trim() || "",
    tradePattern: toolbenchEl.v1TradePatternInput?.value.trim() || "",
    categoryMix: toolbenchEl.v1CategoryMixInput?.value.trim() || "",
    operators: toolbenchEl.v1OperatorsInput?.value.trim() || "",
    competitionFlags: toolbenchEl.v1CompetitionFlagsInput?.value.trim() || "",
    complementaryFlags: toolbenchEl.v1ComplementaryFlagsInput?.value.trim() || "",
    daypartSignals: toolbenchEl.v1DaypartSignalsInput?.value.trim() || "",
    negotiationAngle: toolbenchEl.v1AngleInput?.value.trim() || "",
    fitScores: toolbenchEl.v1FitScoresInput?.value.trim() || "",
    goodFit: toolbenchEl.v1GoodFitInput?.value.trim() || "",
    caution: toolbenchEl.v1CautionInput?.value.trim() || "",
    watchouts: toolbenchEl.v1WatchoutsInput?.value.trim() || ""
  };
}

function draftV1EditorSnapshot(context = toolbenchContextDraft) {
  if (!context) return null;
  const fitScores = Array.isArray(context.unitSuitability?.fitScores) ? context.unitSuitability.fitScores : [];
  const topFit = [...fitScores].sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;
  const weakFit = [...fitScores].sort((a, b) => (a.score || 0) - (b.score || 0))[0] || null;
  return {
    verdict: String(context.rentSignal?.verdict || "").trim(),
    confidence: String(context.rentSignal?.confidence || "").trim(),
    benchmarkLowPsf: context.rentSignal?.benchmarkLowPsf === null || context.rentSignal?.benchmarkLowPsf === undefined
      ? ""
      : String(context.rentSignal.benchmarkLowPsf).trim(),
    benchmarkHighPsf: context.rentSignal?.benchmarkHighPsf === null || context.rentSignal?.benchmarkHighPsf === undefined
      ? ""
      : String(context.rentSignal.benchmarkHighPsf).trim(),
    askingPsf: context.rentSignal?.askingPsf === null || context.rentSignal?.askingPsf === undefined
      ? ""
      : String(context.rentSignal.askingPsf).trim(),
    decisionSummary: String(context.decisionNotes?.summary || "").trim(),
    valueGapSummary: String(context.valueGapSignal?.summary || "").trim(),
    valueGapStatus: String(context.valueGapSignal?.status || "").trim(),
    gapDirection: String(context.valueGapSignal?.gapDirection || "").trim(),
    valueGapScore: context.valueGapSignal?.score === null || context.valueGapSignal?.score === undefined
      ? ""
      : String(context.valueGapSignal.score).trim(),
    likelyDrivers: linesFromArray(context.valueGapSignal?.likelyDrivers).trim(),
    valueGapCautions: linesFromArray(context.valueGapSignal?.cautionFlags).trim(),
    tradePattern: String(context.surroundingBusinesses?.tradePattern || "").trim(),
    categoryMix: serializeCategoryMix(context.surroundingBusinesses?.categoryMix).trim(),
    operators: serializeOperators(context.surroundingBusinesses?.notableOperators).trim(),
    competitionFlags: linesFromArray(context.surroundingBusinesses?.competitionFlags).trim(),
    complementaryFlags: linesFromArray(context.surroundingBusinesses?.complementaryFlags).trim(),
    daypartSignals: linesFromArray(context.surroundingBusinesses?.daypartSignals).trim(),
    negotiationAngle: String(context.decisionNotes?.negotiationAngle || "").trim(),
    fitScores: serializeFitScores(fitScores).trim(),
    goodFit: String(topFit?.rationale || "").trim(),
    caution: Array.isArray(weakFit?.watchouts) ? weakFit.watchouts.join("\n").trim() : "",
    watchouts: Array.isArray(context.decisionNotes?.watchouts)
      ? context.decisionNotes.watchouts.join("\n").trim()
      : ""
  };
}

function v1ContextHasUnsavedChanges() {
  if (!toolbenchContextDraft) return false;
  const currentSnapshot = currentV1EditorSnapshot();
  const draftSnapshot = draftV1EditorSnapshot(toolbenchContextDraft);
  if (!currentSnapshot || !draftSnapshot) return false;
  return JSON.stringify(currentSnapshot) !== JSON.stringify(draftSnapshot);
}

function v1ContextDirtyFields(context = toolbenchContextDraft) {
  const currentSnapshot = currentV1EditorSnapshot();
  const draftSnapshot = draftV1EditorSnapshot(context);
  if (!currentSnapshot || !draftSnapshot) return [];
  return Object.keys(draftSnapshot).filter((key) => (currentSnapshot[key] || "") !== (draftSnapshot[key] || ""));
}

function v1ContextDirtyFieldLabel(key = "") {
  const labels = {
    verdict: "verdict",
    confidence: "confidence",
    benchmarkLowPsf: "benchmark low",
    benchmarkHighPsf: "benchmark high",
    askingPsf: "asking psf",
    decisionSummary: "decision summary",
    valueGapSummary: "value-gap summary",
    valueGapStatus: "value-gap status",
    gapDirection: "gap direction",
    valueGapScore: "value-gap score",
    likelyDrivers: "likely drivers",
    valueGapCautions: "value-gap cautions",
    tradePattern: "trade pattern",
    categoryMix: "category mix",
    operators: "operators",
    competitionFlags: "competition flags",
    complementaryFlags: "complementary flags",
    daypartSignals: "daypart signals",
    negotiationAngle: "negotiation angle",
    fitScores: "fit scores",
    goodFit: "good-fit rationale",
    caution: "caution notes",
    watchouts: "watchouts"
  };
  return labels[key] || key;
}

function v1ContextDirtyFieldSummary(keys = [], limit = 0) {
  const groups = new Map([
    ["verdict", "rent verdict"],
    ["confidence", "confidence"],
    ["benchmarkLowPsf", "benchmark range"],
    ["benchmarkHighPsf", "benchmark range"],
    ["askingPsf", "asking psf"],
    ["decisionSummary", "decision summary"],
    ["valueGapSummary", "value-gap summary"],
    ["valueGapStatus", "value-gap signal"],
    ["gapDirection", "value-gap signal"],
    ["valueGapScore", "value-gap signal"],
    ["likelyDrivers", "value-gap drivers"],
    ["valueGapCautions", "value-gap cautions"],
    ["tradePattern", "surrounding trade"],
    ["categoryMix", "surrounding trade"],
    ["operators", "operators"],
    ["competitionFlags", "surrounding trade"],
    ["complementaryFlags", "surrounding trade"],
    ["daypartSignals", "surrounding trade"],
    ["negotiationAngle", "negotiation angle"],
    ["fitScores", "suitability"],
    ["goodFit", "good-fit rationale"],
    ["caution", "caution notes"],
    ["watchouts", "watchouts"]
  ]);
  const seen = new Set();
  const labels = [];
  (Array.isArray(keys) ? keys : []).forEach((key) => {
    const label = groups.get(key) || v1ContextDirtyFieldLabel(key);
    if (!label || seen.has(label)) return;
    seen.add(label);
    labels.push(label);
  });
  return limit > 0 ? labels.slice(0, limit) : labels;
}

function v1ContextUpdatedScopeDetails(keys = []) {
  const groups = new Map([
    ["verdict", { key: "rent-signal", label: "rent signal" }],
    ["confidence", { key: "rent-signal", label: "rent signal" }],
    ["benchmarkLowPsf", { key: "rent-signal", label: "rent signal" }],
    ["benchmarkHighPsf", { key: "rent-signal", label: "rent signal" }],
    ["askingPsf", { key: "rent-signal", label: "rent signal" }],
    ["decisionSummary", { key: "decision-notes", label: "decision note" }],
    ["negotiationAngle", { key: "decision-notes", label: "decision note" }],
    ["watchouts", { key: "decision-notes", label: "decision note" }],
    ["valueGapSummary", { key: "value-gap", label: "value-gap" }],
    ["valueGapStatus", { key: "value-gap", label: "value-gap" }],
    ["gapDirection", { key: "value-gap", label: "value-gap" }],
    ["valueGapScore", { key: "value-gap", label: "value-gap" }],
    ["likelyDrivers", { key: "value-gap", label: "value-gap" }],
    ["valueGapCautions", { key: "value-gap", label: "value-gap" }],
    ["tradePattern", { key: "surrounding-trade", label: "surrounding trade" }],
    ["categoryMix", { key: "surrounding-trade", label: "surrounding trade" }],
    ["operators", { key: "surrounding-trade", label: "surrounding trade" }],
    ["competitionFlags", { key: "surrounding-trade", label: "surrounding trade" }],
    ["complementaryFlags", { key: "surrounding-trade", label: "surrounding trade" }],
    ["daypartSignals", { key: "surrounding-trade", label: "surrounding trade" }],
    ["fitScores", { key: "suitability", label: "suitability" }],
    ["goodFit", { key: "suitability", label: "suitability" }],
    ["caution", { key: "suitability", label: "suitability" }]
  ]);
  const seen = new Set();
  const labels = [];
  (Array.isArray(keys) ? keys : []).forEach((key) => {
    const group = groups.get(key);
    if (!group || seen.has(group.key)) return;
    seen.add(group.key);
    labels.push(group.label);
  });
  if (!labels.length) {
    return {
      type: "saved-override",
      labels: [],
      summary: "saved override"
    };
  }
  if (labels.length >= 4) {
    return {
      type: "full-context",
      labels,
      summary: "full context save"
    };
  }
  if (labels.length === 1) {
    return {
      type: "layer-edit",
      labels,
      summary: `${labels[0]} layer edit`
    };
  }
  return {
    type: "multi-layer",
    labels,
    summary: `${labels.slice(0, 2).join(" + ")} update`
  };
}

function v1ContextUpdatedScopeSummary(context = toolbenchContextDraft) {
  const persistedSummary = String(context?.updatedScope?.summary || "").trim();
  if (persistedSummary) return persistedSummary;
  return v1ContextUpdatedScopeDetails(v1ContextDirtyFields(context)).summary;
}

let toolbenchV1EditorHighlightTimer = null;
let toolbenchV1EditorJumpCueTimer = null;
let toolbenchV1EditorJumpSource = "";
let toolbenchV1ValidationSectionFilter = "";
let toolbenchActiveValidationWarningKey = "";
let toolbenchRecentlyClearedValidationWarning = null;
let toolbenchRecentlyClearedValidationTimer = null;
let toolbenchRecentlyResolvedValidationSections = {};
let toolbenchRecentlyResolvedValidationSectionsTimer = null;
let toolbenchRecentlyCompletedValidationSection = "";
let toolbenchRecentlyCompletedValidationSectionTimer = null;
let toolbenchPendingValidationClearFocus = false;
let toolbenchRecentlyCompletedValidationAll = false;
let toolbenchRecentlyCompletedValidationAllTimer = null;
let toolbenchV1CommercialWhyOpen = false;
let toolbenchV1CommercialWhyItems = [];
let toolbenchV1CommercialWhyActiveAction = "";
let toolbenchV1CommercialWhyActiveTimer = null;
let toolbenchSourceTimelineHandoff = { recordId: "", origin: "" };
let toolbenchSourceTimelineHandoffTimer = null;
let toolbenchRecentlyRefreshedContextSections = {};
let toolbenchRecentlyRefreshedContextSectionsTimer = null;
let toolbenchReviewedRefreshedContextSections = {};
let toolbenchReviewedRefreshedSectionsByRecord = {};
let toolbenchDecisionOutcomeHistoryByRecord = {};
let toolbenchRoutedReviewOutcomeByRecord = {};
let toolbenchJustReviewedRefreshedSection = "";
let toolbenchJustReviewedRefreshedSectionTimer = null;
let toolbenchDecisionFocusSection = "";
let toolbenchDecisionFocusTimer = null;
let toolbenchSourceTimelineReviewedExpanded = false;
let toolbenchValidationResolvedExpanded = false;
let toolbenchHealthPassDetailExpanded = false;
let toolbenchV1EditorStatusExpanded = false;
let toolbenchV1EditorStatusState = { summary: "", detail: "", tone: "" };
let toolbenchRecentDecisionOutcomeProgress = null;
let toolbenchRecentDecisionOutcomeProgressTimer = null;

function shouldUseToolbenchEmbedSafeMode() {
  const override = queryParam(toolbenchEmbedSafeQueryParam);
  if (override === "1") return true;
  if (override === "0") return false;
  const ua = String(window.navigator?.userAgent || "");
  const host = String(window.location?.hostname || "");
  return /Codex|Electron|WebView|WKWebView/i.test(ua) && /^(127\.0\.0\.1|localhost)$/.test(host);
}

function applyToolbenchEmbedSafeMode() {
  document.body.classList.toggle("toolbench-embed-safe", shouldUseToolbenchEmbedSafeMode());
}

function toolbenchRenderModeOverride() {
  const override = queryParam(toolbenchEmbedSafeQueryParam);
  if (override === "1") return "embed-safe";
  if (override === "0") return "standard";
  return "auto";
}

function loadToolbenchRenderModeHistory() {
  return loadSessionJson(toolbenchRenderModeHistoryKey, { entries: [] }) || { entries: [] };
}

function writeToolbenchRenderModeHistory(history = {}) {
  writeSessionJson(toolbenchRenderModeHistoryKey, history);
}

function loadToolbenchRenderVerdict() {
  return loadSessionJson(toolbenchRenderVerdictKey, {}) || {};
}

function writeToolbenchRenderVerdict(verdict = {}) {
  writeSessionJson(toolbenchRenderVerdictKey, verdict);
}

function setToolbenchRenderModeOverride(mode = "auto") {
  const currentOverride = toolbenchRenderModeOverride();
  const history = loadToolbenchRenderModeHistory();
  const entries = Array.isArray(history.entries) ? history.entries.slice(0, 5) : [];
  entries.unshift({
    previous: currentOverride,
    next: mode,
    at: new Date().toISOString()
  });
  writeToolbenchRenderModeHistory({
    previous: currentOverride,
    next: mode,
    at: entries[0]?.at || "",
    entries: entries.slice(0, 5)
  });
  const url = new URL(window.location.href);
  if (mode === "auto") {
    url.searchParams.delete(toolbenchEmbedSafeQueryParam);
  } else if (mode === "embed-safe") {
    url.searchParams.set(toolbenchEmbedSafeQueryParam, "1");
  } else {
    url.searchParams.set(toolbenchEmbedSafeQueryParam, "0");
  }
  window.history.replaceState({}, "", url.toString());
  applyToolbenchEmbedSafeMode();
  renderAccess();
  drawMemberChart();
  setSearchStatus(
    mode === "auto"
      ? "Render mode set to auto detection."
      : `Render mode switched to ${mode}.`,
    {
      autoClearMs: toolbenchStatusDurations.filter,
      tone: "info"
    }
  );
}

function toolbenchRenderHostLabel() {
  const ua = String(window.navigator?.userAgent || "");
  if (/Codex/i.test(ua)) return "Codex in-app browser";
  if (/Electron/i.test(ua)) return "embedded Electron browser";
  if (/WKWebView|WebView/i.test(ua)) return "embedded webview";
  return "workspace browser";
}

function toolbenchRenderModeCopy() {
  if (shouldUseToolbenchEmbedSafeMode()) {
    return `Render mode: Embed-safe workspace for ${toolbenchRenderHostLabel()}.`;
  }
  return `Render mode: Standard workspace browser (${toolbenchRenderHostLabel()}).`;
}

function toolbenchRenderDiagnosticsCopy() {
  const modeOverride = toolbenchRenderModeOverride();
  const mode = shouldUseToolbenchEmbedSafeMode() ? "embed-safe" : "standard";
  const history = loadToolbenchRenderModeHistory();
  const ua = String(window.navigator?.userAgent || "");
  const uaFlags = [
    /Codex/i.test(ua) ? "Codex" : "",
    /Electron/i.test(ua) ? "Electron" : "",
    /WKWebView/i.test(ua) ? "WKWebView" : "",
    /WebView/i.test(ua) ? "WebView" : ""
  ].filter(Boolean).join(", ") || "none";
  const viewport = `${window.innerWidth}×${window.innerHeight}`;
  const dpr = String(window.devicePixelRatio || 1);
  const host = window.location?.hostname || "unknown";
  const lastCompared = history.previous ? ` • previous mode: ${history.previous}` : "";
  return `Host: ${toolbenchRenderHostLabel()} • active mode: ${mode} • override: ${modeOverride}${lastCompared} • viewport: ${viewport} • DPR: ${dpr} • localhost: ${host} • UA flags: ${uaFlags}.`;
}

function renderToolbenchDiagnosticsHistory() {
  if (!toolbenchEl.renderDiagnosticsHistory || !toolbenchEl.renderDiagnosticsHistoryList) return;
  const history = loadToolbenchRenderModeHistory();
  const entries = Array.isArray(history.entries) ? history.entries : [];
  toolbenchEl.renderDiagnosticsHistory.hidden = entries.length === 0;
  if (!entries.length) {
    toolbenchEl.renderDiagnosticsHistoryList.textContent = "No mode switches yet.";
    return;
  }
  toolbenchEl.renderDiagnosticsHistoryList.innerHTML = entries.map((entry) => {
    const at = entry.at
      ? new Date(entry.at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "";
    return `<span>${at ? `${at} • ` : ""}${entry.previous || "auto"} -> ${entry.next || "auto"}</span>`;
  }).join("");
}

function renderToolbenchDiagnosticsVerdict() {
  if (!toolbenchEl.renderDiagnosticsVerdict || !toolbenchEl.renderDiagnosticsVerdictCopy) return;
  const verdict = loadToolbenchRenderVerdict();
  const type = verdict.type || "";
  toolbenchEl.renderDiagnosticsVerdict.hidden = !type;
  if (!type) {
    toolbenchEl.renderDiagnosticsVerdictCopy.textContent = "No comparison verdict recorded yet.";
    toolbenchEl.renderDiagnosticsVerdict.dataset.tone = "";
    return;
  }
  if (type === "host") {
    toolbenchEl.renderDiagnosticsVerdict.dataset.tone = "host";
    toolbenchEl.renderDiagnosticsVerdictCopy.textContent =
      "Verdict: duplication looked the same across compared modes, so this currently points to a host-level rendering/compositor issue.";
    return;
  }
  toolbenchEl.renderDiagnosticsVerdict.dataset.tone = "page";
  toolbenchEl.renderDiagnosticsVerdictCopy.textContent =
    "Verdict: duplication changed across compared modes, so this currently points to a page-level render-path issue we can keep tuning.";
}

function renderRecoveryTargetDemoNote() {
  if (!toolbenchEl.recoveryTargetDemoNote) return;
  if (recoveryTargetDemoRequested()) {
    toolbenchEl.recoveryTargetDemoNote.dataset.state = "active";
    toolbenchEl.recoveryTargetDemoNote.textContent =
      "Recovery demo is active: this session seeds a saved attention lane with pressure reopen memory, recovery reactivation, and a learned lead target so follow-target controls can be verified locally.";
    return;
  }
  toolbenchEl.recoveryTargetDemoNote.dataset.state = "idle";
  toolbenchEl.recoveryTargetDemoNote.textContent =
    "Recovery demo seeds a saved attention lane with pressure reopen memory and a learned lead recovery target so follow-target controls can be tested locally.";
}

function renderToolbenchDiagnosticsStatus() {
  if (!toolbenchEl.renderDiagnosticsStatus) return;
  const verdict = loadToolbenchRenderVerdict();
  const type = verdict.type || "";
  if (!type) {
    toolbenchEl.renderDiagnosticsStatus.dataset.tone = "info";
    toolbenchEl.renderDiagnosticsStatus.textContent = "Diagnosis status: comparison in progress.";
    return;
  }
  if (type === "host") {
    toolbenchEl.renderDiagnosticsStatus.dataset.tone = "host";
    toolbenchEl.renderDiagnosticsStatus.textContent = "Diagnosis status: likely host-level rendering issue.";
    return;
  }
  toolbenchEl.renderDiagnosticsStatus.dataset.tone = "page";
  toolbenchEl.renderDiagnosticsStatus.textContent = "Diagnosis status: likely page-level render-path issue.";
}

function setToolbenchRenderVerdict(type = "") {
  if (!type) {
    clearSessionJson(toolbenchRenderVerdictKey);
  } else {
    writeToolbenchRenderVerdict({
      type,
      at: new Date().toISOString(),
      current: toolbenchRenderModeOverride(),
      previous: loadToolbenchRenderModeHistory().previous || ""
    });
  }
  renderToolbenchDiagnostics();
  setSearchStatus(
    type === "host"
      ? "Marked render comparison as unchanged across modes."
      : type === "page"
        ? "Marked render comparison as different across modes."
        : "Cleared render comparison verdict.",
    {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: type === "host" ? "caution" : type === "page" ? "success" : "info"
    }
  );
}

function renderToolbenchDiagnosticsComparison() {
  if (!toolbenchEl.renderDiagnosticsComparison) return;
  const history = loadToolbenchRenderModeHistory();
  const currentOverride = toolbenchRenderModeOverride();
  const previousMode = history.previous || "";
  const hasComparison = previousMode && previousMode !== currentOverride;
  toolbenchEl.renderDiagnosticsComparison.hidden = !hasComparison;
  if (!hasComparison) {
    toolbenchEl.renderDiagnosticsComparison.textContent = "Current comparison will appear here.";
    return;
  }
  toolbenchEl.renderDiagnosticsComparison.dataset.tone = "active";
  toolbenchEl.renderDiagnosticsComparison.textContent =
    `Current comparison: previous ${previousMode} vs current ${currentOverride}. If the duplication is unchanged across both, this points to a host-level rendering issue.`;
}

function toolbenchRenderDiagnosticsAssessment() {
  const embedSafe = shouldUseToolbenchEmbedSafeMode();
  const modeOverride = toolbenchRenderModeOverride();
  const history = loadToolbenchRenderModeHistory();
  const ua = String(window.navigator?.userAgent || "");
  const hostLooksEmbedded = /Codex|Electron|WKWebView|WebView/i.test(ua);
  if (hostLooksEmbedded && modeOverride === "auto" && embedSafe) {
    return {
      tone: "info",
      text: "Assessment: auto-detection is actively using embed-safe mode for this embedded localhost host."
    };
  }
  if (hostLooksEmbedded && history.previous && history.previous !== modeOverride) {
    return {
      tone: "caution",
      text: `Assessment: you last compared against ${history.previous}. If the duplication still looks the same after switching, the issue is likely host-level compositing.`
    };
  }
  if (hostLooksEmbedded && (modeOverride === "standard" || modeOverride === "embed-safe")) {
    return {
      tone: "caution",
      text: "Assessment: compare forced Standard and forced Embed-safe. If the duplication looks identical in both, the issue is likely host-level compositing."
    };
  }
  if (!hostLooksEmbedded && !embedSafe) {
    return {
      tone: "strong",
      text: "Assessment: this page currently looks like a normal browser path, so render differences here would point back to page-level styling."
    };
  }
  return {
    tone: "info",
    text: "Assessment: this workspace is using a conservative render path. Compare it with forced Standard to see whether the artifact is mode-sensitive."
  };
}

function renderToolbenchDiagnostics() {
  if (!toolbenchEl.renderDiagnosticsCopy) return;
  toolbenchEl.renderDiagnostics.hidden = false;
  toolbenchEl.renderDiagnosticsCopy.textContent = toolbenchRenderDiagnosticsCopy();
  if (toolbenchEl.renderDiagnosticsAssessment) {
    const assessment = toolbenchRenderDiagnosticsAssessment();
    toolbenchEl.renderDiagnosticsAssessment.dataset.tone = assessment.tone;
    toolbenchEl.renderDiagnosticsAssessment.textContent = assessment.text;
  }
  renderToolbenchDiagnosticsComparison();
  renderToolbenchDiagnosticsHistory();
  renderToolbenchDiagnosticsVerdict();
  renderRecoveryTargetDemoNote();
  renderToolbenchDiagnosticsStatus();
  const url = new URL(window.location.href);
  const standardUrl = new URL(url.toString());
  standardUrl.searchParams.set(toolbenchEmbedSafeQueryParam, "0");
  const safeUrl = new URL(url.toString());
  safeUrl.searchParams.set(toolbenchEmbedSafeQueryParam, "1");
  if (toolbenchEl.openStandardMode) toolbenchEl.openStandardMode.href = standardUrl.toString();
  if (toolbenchEl.openSafeMode) toolbenchEl.openSafeMode.href = safeUrl.toString();
  if (toolbenchEl.enableRecoveryTargetDemo) {
    toolbenchEl.enableRecoveryTargetDemo.disabled = recoveryTargetDemoRequested();
    toolbenchEl.enableRecoveryTargetDemo.dataset.active = recoveryTargetDemoRequested() ? "true" : "false";
  }
  if (toolbenchEl.disableRecoveryTargetDemo) {
    toolbenchEl.disableRecoveryTargetDemo.disabled = !recoveryTargetDemoRequested();
    toolbenchEl.disableRecoveryTargetDemo.dataset.active = recoveryTargetDemoRequested() ? "true" : "false";
  }
}

async function copyToolbenchRenderDiagnostics() {
  const diagnostics = toolbenchRenderDiagnosticsCopy();
  try {
    await navigator.clipboard.writeText(diagnostics);
    setSearchStatus("Copied browser diagnostics.", {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: "success"
    });
  } catch (error) {
    setSearchStatus("Could not copy browser diagnostics automatically.", {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: "caution"
    });
  }
}

function setRecentlyClearedValidationWarning(warning) {
  if (toolbenchRecentlyClearedValidationTimer) {
    window.clearTimeout(toolbenchRecentlyClearedValidationTimer);
    toolbenchRecentlyClearedValidationTimer = null;
  }
  toolbenchRecentlyClearedValidationWarning = warning || null;
  toolbenchValidationResolvedExpanded = false;
  if (!toolbenchRecentlyClearedValidationWarning) {
    renderV1Validation();
    return;
  }
  renderV1Validation();
  toolbenchRecentlyClearedValidationTimer = window.setTimeout(() => {
    toolbenchRecentlyClearedValidationWarning = null;
    toolbenchRecentlyClearedValidationTimer = null;
    renderV1Validation();
  }, 2600);
}

function setRecentlyResolvedValidationSection(sectionKey, fromCount, toCount) {
  if (!sectionKey || !Number.isFinite(fromCount) || !Number.isFinite(toCount) || fromCount <= toCount) return;
  if (toolbenchRecentlyResolvedValidationSectionsTimer) {
    window.clearTimeout(toolbenchRecentlyResolvedValidationSectionsTimer);
    toolbenchRecentlyResolvedValidationSectionsTimer = null;
  }
  toolbenchRecentlyResolvedValidationSections = {
    ...toolbenchRecentlyResolvedValidationSections,
    [sectionKey]: {
      from: fromCount,
      to: toCount
    }
  };
  renderV1EditorSectionValidation();
  toolbenchRecentlyResolvedValidationSectionsTimer = window.setTimeout(() => {
    toolbenchRecentlyResolvedValidationSections = {};
    toolbenchRecentlyResolvedValidationSectionsTimer = null;
    renderV1EditorSectionValidation();
  }, 2200);
}

function setRecentlyCompletedValidationSection(sectionKey) {
  if (toolbenchRecentlyCompletedValidationSectionTimer) {
    window.clearTimeout(toolbenchRecentlyCompletedValidationSectionTimer);
    toolbenchRecentlyCompletedValidationSectionTimer = null;
  }
  toolbenchRecentlyCompletedValidationSection = sectionKey || "";
  toolbenchPendingValidationClearFocus = Boolean(toolbenchRecentlyCompletedValidationSection);
  toolbenchValidationResolvedExpanded = false;
  renderV1Validation();
  if (!toolbenchRecentlyCompletedValidationSection) return;
  toolbenchRecentlyCompletedValidationSectionTimer = window.setTimeout(() => {
    toolbenchRecentlyCompletedValidationSection = "";
    toolbenchRecentlyCompletedValidationSectionTimer = null;
    toolbenchPendingValidationClearFocus = false;
    renderV1Validation();
  }, 2600);
}

function setRecentlyCompletedValidationAll(enabled) {
  if (toolbenchRecentlyCompletedValidationAllTimer) {
    window.clearTimeout(toolbenchRecentlyCompletedValidationAllTimer);
    toolbenchRecentlyCompletedValidationAllTimer = null;
  }
  toolbenchRecentlyCompletedValidationAll = Boolean(enabled);
  toolbenchValidationResolvedExpanded = false;
  renderV1Validation();
  if (!toolbenchRecentlyCompletedValidationAll) return;
  toolbenchRecentlyCompletedValidationAllTimer = window.setTimeout(() => {
    toolbenchRecentlyCompletedValidationAll = false;
    toolbenchRecentlyCompletedValidationAllTimer = null;
    renderV1Validation();
  }, 2600);
}

function renderV1EditorStatus() {
  if (!toolbenchEl.v1EditorStatus) return;
  const summary = toolbenchV1EditorStatusState.summary || "";
  const detail = toolbenchV1EditorStatusState.detail || "";
  const tone = toolbenchV1EditorStatusState.tone || "";
  toolbenchEl.v1EditorStatus.dataset.tone = tone || "success";
  toolbenchEl.v1EditorStatus.replaceChildren();
  if (!summary) {
    toolbenchEl.v1EditorStatus.textContent = "";
    return;
  }
  const summarySpan = document.createElement("span");
  summarySpan.className = "workspace-v1-editor-status-summary";
  summarySpan.textContent = summary;
  toolbenchEl.v1EditorStatus.append(summarySpan);
  if (!detail) return;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "workspace-v1-editor-status-toggle";
  toggle.dataset.expanded = toolbenchV1EditorStatusExpanded ? "true" : "false";
  toggle.textContent = toolbenchV1EditorStatusExpanded
    ? toolbenchReviewPassMessages.workspace.v1StatusHideDetail()
    : toolbenchReviewPassMessages.workspace.v1StatusShowDetail();
  toggle.title = toolbenchV1EditorStatusExpanded
    ? "Hide the V1 save detail."
    : "Show the V1 save detail.";
  toggle.addEventListener("click", () => {
    toolbenchV1EditorStatusExpanded = !toolbenchV1EditorStatusExpanded;
    renderV1EditorStatus();
  });
  toolbenchEl.v1EditorStatus.append(toggle);
  if (!toolbenchV1EditorStatusExpanded) return;
  const detailSpan = document.createElement("span");
  detailSpan.className = "workspace-v1-editor-status-detail";
  detailSpan.textContent = detail;
  toolbenchEl.v1EditorStatus.append(detailSpan);
}

function setV1EditorStatus(summary = "", { detail = "", tone = "success" } = {}) {
  toolbenchV1EditorStatusExpanded = false;
  toolbenchV1EditorStatusState = {
    summary: String(summary || ""),
    detail: String(detail || ""),
    tone: String(tone || "")
  };
  renderV1EditorStatus();
}

function createValidationResolvedToggleButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "workspace-v1-validation-detail-toggle";
  button.dataset.validationResolvedToggle = toolbenchValidationResolvedExpanded ? "expanded" : "collapsed";
  button.textContent = toolbenchValidationResolvedExpanded
    ? toolbenchReviewPassMessages.validation.hideClearedDetail()
    : toolbenchReviewPassMessages.validation.showClearedDetail();
  button.title = toolbenchValidationResolvedExpanded
    ? "Hide the just-cleared validation detail."
    : "Show the just-cleared validation detail.";
  button.addEventListener("click", () => {
    toolbenchValidationResolvedExpanded = !toolbenchValidationResolvedExpanded;
    renderV1Validation();
  });
  return button;
}

function setSourceTimelineHandoff(recordId = "", origin = "") {
  if (toolbenchSourceTimelineHandoffTimer) {
    window.clearTimeout(toolbenchSourceTimelineHandoffTimer);
    toolbenchSourceTimelineHandoffTimer = null;
  }
  toolbenchSourceTimelineHandoff = {
    recordId: normalizeDecisionContextKey(recordId),
    origin: String(origin || "").trim().toLowerCase()
  };
  toolbenchSourceTimelineReviewedExpanded = false;
  toolbenchReviewedRefreshedContextSections = toolbenchReviewedRefreshedSectionsByRecord[toolbenchSourceTimelineHandoff.recordId] || {};
  if (!toolbenchSourceTimelineHandoff.recordId || !toolbenchSourceTimelineHandoff.origin) {
    renderWorkspaceSourceTimeline(toolbenchRecord);
    renderV1ContextMeta(toolbenchContextDraft);
    return;
  }
  renderWorkspaceSourceTimeline(toolbenchRecord);
  renderV1ContextMeta(toolbenchContextDraft);
  toolbenchSourceTimelineHandoffTimer = window.setTimeout(() => {
    toolbenchSourceTimelineHandoff = { recordId: "", origin: "" };
    toolbenchReviewedRefreshedContextSections = {};
    toolbenchSourceTimelineHandoffTimer = null;
    renderWorkspaceSourceTimeline(toolbenchRecord);
    renderV1ContextMeta(toolbenchContextDraft);
  }, toolbenchStatusDurations.handoff);
}

function setRecentlyRefreshedContextSections(layerKeys = []) {
  if (toolbenchRecentlyRefreshedContextSectionsTimer) {
    window.clearTimeout(toolbenchRecentlyRefreshedContextSectionsTimer);
    toolbenchRecentlyRefreshedContextSectionsTimer = null;
  }
  const normalizedKeys = Array.isArray(layerKeys)
    ? layerKeys.map((key) => String(key || "").trim().toLowerCase()).filter(Boolean)
    : [];
  toolbenchRecentlyRefreshedContextSections = Object.fromEntries(
    normalizedKeys.map((key) => [key, true])
  );
  toolbenchReviewedRefreshedContextSections = {};
  toolbenchSourceTimelineReviewedExpanded = false;
  const recordKey = currentRefreshedContextRecordKey();
  if (recordKey) {
    toolbenchReviewedRefreshedSectionsByRecord = {
      ...toolbenchReviewedRefreshedSectionsByRecord,
      [recordKey]: {}
    };
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  renderV1EditorSectionValidation();
  renderV1ContextMeta(toolbenchContextDraft);
  if (!normalizedKeys.length) return;
  toolbenchRecentlyRefreshedContextSectionsTimer = window.setTimeout(() => {
    toolbenchRecentlyRefreshedContextSections = {};
    toolbenchRecentlyRefreshedContextSectionsTimer = null;
    renderV1EditorSectionValidation();
    renderV1ContextMeta(toolbenchContextDraft);
  }, toolbenchStatusDurations.handoff);
}

function pulseV1EditorBlock(target) {
  const block =
    target?.closest?.(".workspace-v1-editor-section") ||
    target?.closest?.("label") ||
    target?.closest?.(".workspace-v1-signal-grid") ||
    target;
  if (!block) return null;
  if (toolbenchV1EditorHighlightTimer) {
    window.clearTimeout(toolbenchV1EditorHighlightTimer);
    toolbenchV1EditorHighlightTimer = null;
  }
  document
    .querySelectorAll(".workspace-v1-editor .is-jump-highlighted")
    .forEach((node) => node.classList.remove("is-jump-highlighted"));
  block.classList.add("is-jump-highlighted");
  toolbenchV1EditorHighlightTimer = window.setTimeout(() => {
    block.classList.remove("is-jump-highlighted");
    toolbenchV1EditorHighlightTimer = null;
  }, 1800);
  return block;
}

function editorSectionKeyForTarget(target) {
  return target?.closest?.("[data-section]")?.dataset?.section || "";
}

function setActiveV1EditorSection(sectionKey = "") {
  if (!toolbenchEl.v1EditorForm) return;
  toolbenchEl.v1EditorForm
    .querySelectorAll?.(".workspace-v1-editor-section")
    .forEach((section) => {
      section.dataset.active = section.dataset.section === sectionKey ? "true" : "false";
    });
  toolbenchEl.v1EditorNav
    ?.querySelectorAll?.("[data-section-target]")
    .forEach((button) => {
      button.dataset.active = button.dataset.sectionTarget === sectionKey ? "true" : "false";
    });
}

function focusV1EditorSection(sectionKey = "", statusCopy = "", jumpSource = "") {
  const section = toolbenchEl.v1EditorForm?.querySelector?.(`[data-section="${sectionKey}"]`);
  if (!section) return false;
  const firstControl = section.querySelector("input, select, textarea, button");
  focusV1EditorControl(firstControl || section, statusCopy, jumpSource);
  return true;
}

function decisionFocusSectionForAction(action = "") {
  const normalized = String(action || "").trim().toLowerCase();
  if (normalized === "rent-signal") return "rent-signal";
  if (normalized === "value-gap-summary") return "value-gap";
  if (
    normalized === "surrounding-trade" ||
    normalized === "operators-summary" ||
    normalized === "competition-read"
  ) return "surrounding-trade";
  if (
    normalized === "best-fit-summary" ||
    normalized === "good-fit" ||
    normalized === "caution-fit"
  ) return "suitability";
  if (normalized === "decision-note") return "decision-note";
  return "";
}

function syncActiveV1EditorSectionFromTarget(target) {
  const sectionKey = editorSectionKeyForTarget(target);
  if (!sectionKey) return false;
  setActiveV1EditorSection(sectionKey);
  return true;
}

function currentV1EditorBaseTitle() {
  if (!toolbenchContextDraft) {
    return toolbenchReviewPassMessages.workspace.v1EditorTitleEmpty();
  }
  const readOnlyFileMode = window.location?.protocol === "file:";
  return readOnlyFileMode
    ? toolbenchReviewPassMessages.workspace.v1EditorTitleReadOnly({
        subjectRef: toolbenchContextDraft.subjectRef
      })
    : toolbenchReviewPassMessages.workspace.v1EditorTitleEditable({
        subjectRef: toolbenchContextDraft.subjectRef
      });
}

function renderV1EditorJumpCue() {
  if (!toolbenchEl.v1EditorTitle) return;
  const baseTitle = currentV1EditorBaseTitle();
  toolbenchEl.v1EditorTitle.textContent = toolbenchV1EditorJumpSource
    ? `${baseTitle} • from ${toolbenchV1EditorJumpSource}`
    : baseTitle;
}

function announceV1EditorJump(source = "") {
  toolbenchV1EditorJumpSource = String(source || "").trim();
  renderV1EditorJumpCue();
  if (toolbenchEl.v1EditorStatus && toolbenchV1EditorJumpSource) {
    setV1EditorStatus(`Editing from ${toolbenchV1EditorJumpSource}.`, { tone: "info" });
  }
  if (toolbenchV1EditorJumpCueTimer) {
    window.clearTimeout(toolbenchV1EditorJumpCueTimer);
    toolbenchV1EditorJumpCueTimer = null;
  }
  if (!toolbenchV1EditorJumpSource) return;
  toolbenchV1EditorJumpCueTimer = window.setTimeout(() => {
    toolbenchV1EditorJumpSource = "";
    renderV1EditorJumpCue();
    toolbenchV1EditorJumpCueTimer = null;
  }, 2600);
}

function setV1ReadCardAction(anchorEl, {
  action = "",
  enabled = false,
  title = ""
} = {}) {
  const card = anchorEl?.closest?.("article");
  if (!card) return;
  if (enabled && action) {
    card.dataset.action = action;
    card.dataset.enabled = "true";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.title = title || "";
    card.setAttribute("aria-label", title || card.textContent.trim());
    return;
  }
  delete card.dataset.action;
  delete card.dataset.enabled;
  card.removeAttribute("role");
  card.removeAttribute("tabindex");
  card.removeAttribute("title");
  card.removeAttribute("aria-label");
}

function focusV1EditorControl(control, statusCopy = "", jumpSource = "") {
  const target = control || toolbenchEl.v1EditorForm;
  if (!target) return;
  if (jumpSource) announceV1EditorJump(jumpSource);
  const sectionKey = editorSectionKeyForTarget(target);
  if (sectionKey) setActiveV1EditorSection(sectionKey);
  const block = pulseV1EditorBlock(target) || target;
  revealWorkspaceSection(block);
  if (typeof target.focus === "function") {
    window.setTimeout(() => target.focus(), 80);
  }
  if (statusCopy) {
    setSearchStatus(statusCopy, {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: "info"
    });
  }
}

function handleV1ReadCardAction(event) {
  const card = event?.target?.closest?.("[data-action]");
  const action = card?.dataset?.action || "";
  if (!action) return;
  const focusSection = card?.dataset?.decisionFocusSection || "";
  if (focusSection) {
    setDecisionFocusSection(focusSection);
    focusV1EditorSection(
      focusSection,
      `Jumped to the dominant decision section in the V1 editor.`,
      `Decision Outcome: ${toolbenchEl.v1SnapshotOutcomeTitle?.textContent || "Decision Outcome"}`
    );
    return;
  }
  if (card?.classList?.contains("workspace-v1-context-why-clause")) {
    pulseV1CommercialWhyAction(action);
  }
  if (action === "rent-signal") {
    focusV1EditorControl(
      toolbenchEl.v1VerdictInput || toolbenchEl.v1BenchmarkLowInput,
      "Jumped to the rent-signal verdict and benchmark fields in the V1 editor.",
      "Rent Signal"
    );
    return;
  }
  if (action === "value-gap-summary") {
    focusV1EditorControl(
      toolbenchEl.v1ValueGapInput || toolbenchEl.v1ValueGapStatusInput,
      "Jumped to the value-gap summary and scoring fields in the V1 editor.",
      "Value Gap"
    );
    return;
  }
  if (action === "decision-note") {
    focusV1EditorControl(
      toolbenchEl.v1DecisionInput || toolbenchEl.v1AngleInput,
      "Jumped to the V1 decision note and negotiation-angle fields.",
      "Decision Note"
    );
    return;
  }
  if (action === "surrounding-trade") {
    focusV1EditorControl(
      toolbenchEl.v1TradePatternInput || toolbenchEl.v1CategoryMixInput,
      "Jumped to the surrounding-trade summary and mix fields in the V1 editor.",
      "Surrounding Trade"
    );
    return;
  }
  if (action === "best-fit-summary") {
    focusV1EditorControl(
      toolbenchEl.v1FitScoresInput || toolbenchEl.v1GoodFitInput,
      "Jumped to the suitability scoring fields in the V1 editor.",
      "Best Fit"
    );
    return;
  }
  if (action === "operators-summary") {
    focusV1EditorControl(
      toolbenchEl.v1OperatorsInput || toolbenchEl.v1TradePatternInput,
      "Jumped to the nearby-operator trade context in the V1 editor.",
      "Top Operators"
    );
    return;
  }
  if (action === "competition-read") {
    focusV1EditorControl(
      toolbenchEl.v1CompetitionFlagsInput || toolbenchEl.v1ComplementaryFlagsInput,
      "Jumped to the competition and complementary-trade signals in the V1 editor.",
      "Competition"
    );
    return;
  }
  if (action === "good-fit") {
    focusV1EditorControl(
      toolbenchEl.v1GoodFitInput || toolbenchEl.v1FitScoresInput,
      "Jumped to the strongest-fit suitability notes in the V1 editor.",
      "Good For"
    );
    return;
  }
  if (action === "caution-fit") {
    focusV1EditorControl(
      toolbenchEl.v1CautionInput || toolbenchEl.v1FitScoresInput,
      "Jumped to the weak-fit and approval-caution notes in the V1 editor.",
      "Use Caution"
    );
  }
}

function revealWorkspaceSection(element) {
  if (!element) return false;
  const details = element.closest("details");
  if (details) details.open = true;
  element.scrollIntoView({ behavior: "smooth", block: "center" });
  return true;
}

function appendV1ContextMetaChip(label = "", { action = "", tone = "", title = "" } = {}) {
  if (!toolbenchEl.v1ContextMeta || !label) return;
  const chip = document.createElement(action ? "button" : "span");
  chip.className = "workspace-v1-context-chip";
  chip.textContent = label;
  if (tone) chip.dataset.state = tone;
  if (title) chip.title = title;
  if (action) {
    chip.type = "button";
    chip.classList.add("workspace-v1-context-chip-action");
    chip.dataset.action = action;
    chip.setAttribute("aria-label", title || label);
  }
  toolbenchEl.v1ContextMeta.append(chip);
}

function renderV1ContextMeta(context = toolbenchContextDraft) {
  if (!toolbenchEl.v1ContextMeta) return;
  if (!context) {
    toolbenchEl.v1ContextMeta.textContent = toolbenchReviewPassMessages.workspace.v1ContextMetaPending();
    toolbenchEl.v1ContextMeta.dataset.state = "pending";
    toolbenchEl.v1ContextMeta.dataset.action = "";
    toolbenchEl.v1ContextMeta.title = toolbenchReviewPassMessages.workspace.v1ContextMetaHintPending();
    toolbenchEl.v1ContextMeta.setAttribute("aria-label", toolbenchReviewPassMessages.workspace.v1ContextMetaHintPending());
    toolbenchEl.v1ContextMeta.setAttribute("tabindex", "-1");
    return;
  }
  const freshness = sourceFreshnessProfile(context.capturedAt || context.rentSignal?.capturedAt || context.valueGapSignal?.capturedAt || "");
  const healthSummary = summarizeV1Health(context);
  const capturedAt = formatShortDate(context.capturedAt || context.rentSignal?.capturedAt || context.valueGapSignal?.capturedAt || "");
  const updatedAt = formatShortDate(context.updatedAt || context.savedAt || "");
  const dirtyFields = v1ContextDirtyFields(context);
  const dirty = dirtyFields.length > 0;
  toolbenchEl.v1ContextMeta.replaceChildren();
  toolbenchEl.v1ContextMeta.dataset.state = dirty ? "dirty" : freshness.state;
  delete toolbenchEl.v1ContextMeta.dataset.action;
  toolbenchEl.v1ContextMeta.removeAttribute("title");
  toolbenchEl.v1ContextMeta.removeAttribute("aria-label");
  toolbenchEl.v1ContextMeta.removeAttribute("tabindex");
  const capturedLabel = capturedAt && capturedAt !== toolbenchReviewPassMessages.workspace.dateNotConnected()
    ? capturedAt
    : toolbenchReviewPassMessages.workspace.dateNotConnected();
  const capturedSource = v1ContextCapturedSourceLabel(context);
  const hasUpdated = updatedAt && updatedAt !== toolbenchReviewPassMessages.workspace.dateNotConnected();
  appendV1ContextMetaChip(toolbenchReviewPassMessages.workspace.v1ContextMetaCapturedLabel({
    captured: capturedLabel
  }), {
    tone: v1ContextCapturedTone(context, updatedAt),
    title: toolbenchReviewPassMessages.workspace.v1ContextMetaCapturedTitle({
      captured: capturedLabel,
      source: capturedSource
    })
  });
  appendV1ContextMetaChip(toolbenchReviewPassMessages.workspace.v1ContextMetaFreshnessLabel({
    freshness: freshness.label,
    days: freshness.days
  }), {
    action: "freshness",
    tone: freshness.state,
    title: toolbenchReviewPassMessages.workspace.v1ContextMetaActionFreshness({
      freshness: freshness.label,
      days: freshness.days,
      freshMaxDays: freshness.freshMaxDays,
      watchMaxDays: freshness.watchMaxDays
    })
  });
  if (hasUpdated) {
    const updatedIsNewerSave = updatedAt !== capturedAt;
    appendV1ContextMetaChip(toolbenchReviewPassMessages.workspace.v1ContextMetaUpdatedLabel({
      updated: updatedAt,
      fresh: updatedIsNewerSave
    }), {
      action: updatedIsNewerSave ? "updated" : "",
      tone: v1ContextMetaTimeTone({
        captured: capturedAt,
        updated: updatedAt
      }),
      title: updatedIsNewerSave
        ? toolbenchReviewPassMessages.workspace.v1ContextMetaActionUpdated({
            updated: updatedAt,
            scope: v1ContextUpdatedScopeSummary(context)
          })
        : ""
    });
  }
  appendV1ContextMetaChip(toolbenchReviewPassMessages.workspace.v1ContextMetaHealthLabel({
    health: healthSummary.state,
    passed: healthSummary.passed,
    total: healthSummary.total
  }), {
    action: "health",
    tone: healthSummary.state,
    title: toolbenchReviewPassMessages.workspace.v1ContextMetaActionHealth({
      health: healthSummary.state,
      nextLabel: healthSummary.nextLabel
    })
  });
  const modeLabel = v1ContextModeLabel(context);
  const modeTone = v1ContextModeTone(context);
  const originLabel = v1ContextOriginLabel(context);
  const refreshReview = refreshedReviewProgressForContext(context);
  appendV1ContextMetaChip(`Mode ${v1ContextModeChipLabel(context)}`, {
    tone: modeTone,
    title: toolbenchReviewPassMessages.workspace.v1ContextModeTitle({
      mode: modeLabel
    })
  });
  appendV1ContextMetaChip(`Source ${v1ContextOriginChipLabel(context)}`, {
    action: "origin",
    tone: v1ContextOriginTone(context),
    title: toolbenchReviewPassMessages.workspace.v1ContextOriginAction({
      origin: originLabel
    })
  });
  const routedRecordKey = normalizeDecisionContextKey(context.recordId || context.contextRecordId || "");
  const showRoutedWorkCue =
    toolbenchRoutedRecordWorkCue.active &&
    routedRecordKey &&
    routedRecordKey === toolbenchRoutedRecordWorkCue.recordId &&
    toolbenchRoutedRecordWorkCue.workType;
  const routedLaneKey = quickPickBookmarkKeyForLens(currentQuickPickLensState());
  const routedPlanningMemory = toolbenchQuickPickBookmarkPlanningMemoryByKey[routedLaneKey] || null;
  const routedLaneMomentum = summarizeLaneRoutedReviewMomentum(
    quickPickRecordsForLens(toolbenchQuickPickBookmarks[routedLaneKey] || currentQuickPickLensState())
  );
  const routedPlanningAction = quickPickBookmarkPlanningAction({
    count: quickPickRecordsForLens(toolbenchQuickPickBookmarks[routedLaneKey] || currentQuickPickLensState()).length,
    degraded: false,
    resolved: false,
    priority: "",
    urgency: "",
    momentum: routedLaneMomentum,
    reopenMemory: quickPickBookmarkReopenMemoryMeta(routedLaneKey),
    planningMemory: routedPlanningMemory
  });
  const routedPlanningHoldReason = quickPickBookmarkPlanningHoldReason(routedPlanningMemory, routedPlanningAction, routedLaneMomentum);
  if (showRoutedWorkCue) {
    appendV1ContextMetaChip(`Routed ${toolbenchRoutedRecordWorkCue.workType}`, {
      tone: "watch",
      title: `Queue opened this record for ${toolbenchReviewPassMessages.workspace.quickPickWorkMeta({
        workType: toolbenchRoutedRecordWorkCue.workType
      }).toLowerCase()}.`
    });
    if (routedPlanningHoldReason) {
      appendV1ContextMetaChip("Routed tempered", {
        tone: "sample",
        title: routedPlanningHoldReason
      });
    }
  }
  if (refreshReview.active) {
    appendV1ContextMetaChip(
      toolbenchReviewPassMessages.workspace.v1ContextRefreshReviewLabel({
        reviewed: refreshReview.reviewed,
        total: refreshReview.total,
        complete: refreshReview.complete
      }),
      {
        action: "refresh-review",
        tone: refreshReview.complete ? "strong" : "watch",
        title: toolbenchReviewPassMessages.workspace.v1ContextRefreshReviewTitle({
          reviewed: refreshReview.reviewed,
          total: refreshReview.total,
          complete: refreshReview.complete,
          next: refreshReview.nextLabel
        })
      }
    );
  }
  appendV1ContextMetaChip(
    dirty
      ? toolbenchReviewPassMessages.workspace.v1ContextMetaUnsaved({
          count: dirtyFields.length,
          fields: v1ContextDirtyFieldSummary(dirtyFields, 2).join(", ")
        })
      : toolbenchReviewPassMessages.workspace.v1ContextMetaSaved({
          mode: modeLabel
        }),
    dirty
      ? {
          action: "save",
          tone: "dirty",
          title: toolbenchReviewPassMessages.workspace.v1ContextMetaActionDirty({
            fields: v1ContextDirtyFieldSummary(dirtyFields, 3).join(", ")
          })
        }
      : {
          tone: modeTone,
          title: toolbenchReviewPassMessages.workspace.v1ContextMetaSavedTitle({
            mode: modeLabel
          })
        }
  );
}

function handleV1ContextMetaAction(event) {
  const target = event?.target?.closest?.("[data-action]");
  const action = target?.dataset?.action || "";
  if (!toolbenchContextDraft || !action) {
    setSearchStatus(toolbenchReviewPassMessages.workspace.v1ContextMetaHintPending(), {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: "info"
    });
    return;
  }
  if (action === "save") {
    revealWorkspaceSection(toolbenchEl.v1SaveButton || toolbenchEl.v1EditorForm);
    if (typeof toolbenchEl.v1SaveButton?.focus === "function") {
      window.setTimeout(() => toolbenchEl.v1SaveButton.focus(), 80);
    }
    setSearchStatus(toolbenchReviewPassMessages.workspace.v1ContextMetaHintDirty(), {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: "caution"
    });
    return;
  }
  if (action === "health") {
    const healthSummary = summarizeV1Health(toolbenchContextDraft);
    revealWorkspaceSection(toolbenchEl.v1Health || toolbenchEl.v1HealthTitle);
    const firstFailed = Array.isArray(healthSummary.checks)
      ? healthSummary.checks.find((check) => !check.ok)
      : null;
    if (firstFailed?.label) {
      jumpToV1HealthLabel(firstFailed.label);
    } else if (typeof toolbenchEl.v1HealthAction?.focus === "function") {
      window.setTimeout(() => toolbenchEl.v1HealthAction.focus(), 80);
    }
    setSearchStatus(
      toolbenchReviewPassMessages.workspace.v1ContextMetaHintHealth({
        health: healthSummary.state
      }),
      {
        autoClearMs: toolbenchStatusDurations.reviewStep,
        tone: healthSummary.state === "strong" ? "success" : healthSummary.state === "partial" ? "caution" : "error"
      }
    );
    return;
  }
  if (action === "updated") {
    const updatedAt = formatShortDate(toolbenchContextDraft.updatedAt || toolbenchContextDraft.savedAt || "");
    revealWorkspaceSection(toolbenchEl.v1EditorForm || toolbenchEl.v1EditorTitle);
    const updatedTarget = !toolbenchEl.v1SaveButton?.disabled
      ? toolbenchEl.v1SaveButton
      : toolbenchEl.v1VerdictInput || toolbenchEl.v1DecisionInput;
    if (typeof updatedTarget?.focus === "function") {
      window.setTimeout(() => updatedTarget.focus(), 80);
    }
    setSearchStatus(
      toolbenchReviewPassMessages.workspace.v1ContextMetaHintUpdated({
        updated: updatedAt
      }),
      {
        autoClearMs: toolbenchStatusDurations.reviewStep,
        tone: "success"
      }
    );
    return;
  }
  if (action === "origin") {
    const originLabel = v1ContextOriginLabel(toolbenchContextDraft);
    const origin = v1ContextOrigin(toolbenchContextDraft);
    if (origin === "sample-backed" || origin === "refreshed-from-sample") {
      setRecentlyRefreshedContextSections(
        origin === "refreshed-from-sample"
          ? (Array.isArray(toolbenchContextDraft.contextOriginLayers) ? toolbenchContextDraft.contextOriginLayers : [])
          : []
      );
      setSourceTimelineHandoff(toolbenchContextDraft.recordId || toolbenchContextDraft.contextRecordId || "", origin);
      revealWorkspaceSection(toolbenchEl.sourceTimeline || toolbenchEl.sourceTimelineSummary);
      setSearchStatus(
        toolbenchReviewPassMessages.workspace.v1ContextOriginHint({
          origin: originLabel
        }),
        {
          autoClearMs: toolbenchStatusDurations.reviewStep,
          tone: origin === "refreshed-from-sample" ? "success" : "info"
        }
      );
      return;
    }
    revealWorkspaceSection(toolbenchEl.v1EditorForm || toolbenchEl.v1EditorTitle);
    const originTarget = !toolbenchEl.v1SaveButton?.disabled
      ? toolbenchEl.v1SaveButton
      : toolbenchEl.v1VerdictInput || toolbenchEl.v1DecisionInput;
    if (typeof originTarget?.focus === "function") {
      window.setTimeout(() => originTarget.focus(), 80);
    }
    setSearchStatus(
      toolbenchReviewPassMessages.workspace.v1ContextOriginHint({
        origin: originLabel
      }),
      {
        autoClearMs: toolbenchStatusDurations.reviewStep,
        tone: origin === "saved-override" ? "success" : "info"
      }
    );
    return;
  }
  if (action === "refresh-review") {
    const refreshReview = refreshedReviewProgressForContext(toolbenchContextDraft);
    const origin = v1ContextOrigin(toolbenchContextDraft);
    if (origin === "refreshed-from-sample") {
      setSourceTimelineHandoff(
        toolbenchContextDraft.recordId || toolbenchContextDraft.contextRecordId || "",
        origin
      );
    }
    if (!refreshReview.complete && refreshReview.nextSection) {
      markReviewedRefreshedContextSection(refreshReview.nextSection);
      revealWorkspaceSection(toolbenchEl.v1EditorForm || toolbenchEl.v1EditorTitle);
      focusV1EditorSection(
        refreshReview.nextSection,
        toolbenchReviewPassMessages.workspace.v1ContextRefreshReviewJumped({
          next: refreshReview.nextLabel
        }),
        `Refresh Review: ${refreshReview.nextLabel || v1ValidationSectionLabel(refreshReview.nextSection)}`
      );
      return;
    }
    revealWorkspaceSection(toolbenchEl.sourceTimeline || toolbenchEl.sourceTimelineSummary);
    setSearchStatus(
      toolbenchReviewPassMessages.workspace.v1ContextRefreshReviewHint({
        complete: refreshReview.complete,
        next: refreshReview.nextLabel
      }),
      {
        autoClearMs: toolbenchStatusDurations.reviewStep,
        tone: refreshReview.complete ? "success" : "caution"
      }
    );
    return;
  }
  const freshness = sourceFreshnessProfile(
    toolbenchContextDraft.capturedAt ||
    toolbenchContextDraft.rentSignal?.capturedAt ||
    toolbenchContextDraft.valueGapSignal?.capturedAt ||
    ""
  );
  revealWorkspaceSection(toolbenchEl.sourceTimeline || toolbenchEl.sourceTimelineSummary);
  setSearchStatus(
    toolbenchReviewPassMessages.workspace.v1ContextMetaHintFreshness({
      freshness: freshness.label
    }),
    {
      autoClearMs: toolbenchStatusDurations.reviewStep,
      tone: freshness.state === "fresh" ? "success" : freshness.state === "watch" ? "caution" : "error"
    }
  );
}

function setV1EditorState(context) {
  if (!toolbenchEl.v1EditorForm) return;
  toolbenchContextDraft = context ? contextBundleFromRecord(context) : null;
  const readOnlyFileMode = window.location?.protocol === "file:";
  const disabled = !toolbenchContextDraft || readOnlyFileMode;
  const fitScores = Array.isArray(toolbenchContextDraft?.unitSuitability?.fitScores)
    ? toolbenchContextDraft.unitSuitability.fitScores
    : [];
  const topFit = [...fitScores].sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;
  const weakFit = [...fitScores].sort((a, b) => (a.score || 0) - (b.score || 0))[0] || null;
  renderV1EditorJumpCue();
  toolbenchEl.v1VerdictInput.disabled = disabled;
  toolbenchEl.v1ConfidenceInput.disabled = disabled;
  toolbenchEl.v1BenchmarkLowInput.disabled = disabled;
  toolbenchEl.v1BenchmarkHighInput.disabled = disabled;
  toolbenchEl.v1AskingPsfInput.disabled = disabled;
  toolbenchEl.v1GapPercentInput.disabled = true;
  toolbenchEl.v1DecisionInput.disabled = disabled;
  toolbenchEl.v1ValueGapInput.disabled = disabled;
  toolbenchEl.v1ValueGapStatusInput.disabled = disabled;
  toolbenchEl.v1GapDirectionInput.disabled = disabled;
  toolbenchEl.v1ValueGapScoreInput.disabled = disabled;
  toolbenchEl.v1LikelyDriversInput.disabled = disabled;
  toolbenchEl.v1ValueGapCautionsInput.disabled = disabled;
  toolbenchEl.v1TradePatternInput.disabled = disabled;
  toolbenchEl.v1CategoryMixInput.disabled = disabled;
  toolbenchEl.v1OperatorsInput.disabled = disabled;
  toolbenchEl.v1CompetitionFlagsInput.disabled = disabled;
  toolbenchEl.v1ComplementaryFlagsInput.disabled = disabled;
  toolbenchEl.v1DaypartSignalsInput.disabled = disabled;
  toolbenchEl.v1AngleInput.disabled = disabled;
  toolbenchEl.v1FitScoresInput.disabled = disabled;
  toolbenchEl.v1GoodFitInput.disabled = disabled;
  toolbenchEl.v1CautionInput.disabled = disabled;
  toolbenchEl.v1WatchoutsInput.disabled = disabled;
  toolbenchEl.v1SaveButton.disabled = disabled;
  toolbenchEl.v1VerdictInput.value = toolbenchContextDraft?.rentSignal?.verdict || "";
  toolbenchEl.v1ConfidenceInput.value = toolbenchContextDraft?.rentSignal?.confidence || "";
  toolbenchEl.v1BenchmarkLowInput.value = toolbenchContextDraft?.rentSignal?.benchmarkLowPsf ?? "";
  toolbenchEl.v1BenchmarkHighInput.value = toolbenchContextDraft?.rentSignal?.benchmarkHighPsf ?? "";
  toolbenchEl.v1AskingPsfInput.value = toolbenchContextDraft?.rentSignal?.askingPsf ?? "";
  toolbenchEl.v1GapPercentInput.value = toolbenchContextDraft?.rentSignal?.gapPercent ?? "";
  toolbenchEl.v1DecisionInput.value = toolbenchContextDraft?.decisionNotes?.summary || "";
  toolbenchEl.v1ValueGapInput.value = toolbenchContextDraft?.valueGapSignal?.summary || "";
  toolbenchEl.v1ValueGapStatusInput.value = toolbenchContextDraft?.valueGapSignal?.status || "";
  toolbenchEl.v1GapDirectionInput.value = toolbenchContextDraft?.valueGapSignal?.gapDirection || "";
  toolbenchEl.v1ValueGapScoreInput.value = toolbenchContextDraft?.valueGapSignal?.score ?? "";
  toolbenchEl.v1LikelyDriversInput.value = linesFromArray(toolbenchContextDraft?.valueGapSignal?.likelyDrivers);
  toolbenchEl.v1ValueGapCautionsInput.value = linesFromArray(toolbenchContextDraft?.valueGapSignal?.cautionFlags);
  toolbenchEl.v1TradePatternInput.value = toolbenchContextDraft?.surroundingBusinesses?.tradePattern || "";
  toolbenchEl.v1CategoryMixInput.value = serializeCategoryMix(toolbenchContextDraft?.surroundingBusinesses?.categoryMix);
  toolbenchEl.v1OperatorsInput.value = serializeOperators(toolbenchContextDraft?.surroundingBusinesses?.notableOperators);
  toolbenchEl.v1CompetitionFlagsInput.value = linesFromArray(toolbenchContextDraft?.surroundingBusinesses?.competitionFlags);
  toolbenchEl.v1ComplementaryFlagsInput.value = linesFromArray(toolbenchContextDraft?.surroundingBusinesses?.complementaryFlags);
  toolbenchEl.v1DaypartSignalsInput.value = linesFromArray(toolbenchContextDraft?.surroundingBusinesses?.daypartSignals);
  toolbenchEl.v1AngleInput.value = toolbenchContextDraft?.decisionNotes?.negotiationAngle || "";
  toolbenchEl.v1FitScoresInput.value = serializeFitScores(fitScores);
  toolbenchEl.v1GoodFitInput.value = topFit?.rationale || "";
  toolbenchEl.v1CautionInput.value = Array.isArray(weakFit?.watchouts) ? weakFit.watchouts.join("\n") : "";
  toolbenchEl.v1WatchoutsInput.value = Array.isArray(toolbenchContextDraft?.decisionNotes?.watchouts)
    ? toolbenchContextDraft.decisionNotes.watchouts.join("\n")
    : "";
  setV1EditorStatus(
    !toolbenchContextDraft
      ? toolbenchReviewPassMessages.v1Context.editorUnavailable()
      : readOnlyFileMode
        ? toolbenchReviewPassMessages.v1Context.editorReadOnlyLocked()
        : toolbenchReviewPassMessages.v1Context.editorReady(),
    { tone: "info" }
  );
  setActiveV1EditorSection("");
  refreshV1GapPreview();
  renderV1Validation();
  renderV1ContextMeta(toolbenchContextDraft);
}

async function saveV1Context() {
  if (!toolbenchContextDraft || !toolbenchRecord) return;
  if (!window.RentIntelContextApi?.upsertContextRecord) {
    setV1EditorStatus(toolbenchReviewPassMessages.workspace.v1ContextApiUnavailable(), { tone: "error" });
    return;
  }
  const validationWarningBeforeSave = toolbenchActiveValidationWarningKey;
  const selectedValidationWarning = validationWarningBeforeSave
    ? Object.values(evaluateV1ValidationBySection())
        .flat()
        .find((warning) => warning?.key === validationWarningBeforeSave) || null
    : null;
  const routedLeadWarningBeforeSave = currentRoutedLeadValidationWarning(toolbenchContextDraft);
  const trackedRoutedLeadWarning =
    routedLeadWarningBeforeSave?.key &&
    validationWarningBeforeSave &&
    routedLeadWarningBeforeSave.key === validationWarningBeforeSave
      ? routedLeadWarningBeforeSave
      : null;
  const validationCountsBeforeSave = validationWarningBeforeSave ? currentV1ValidationCountsBySection() : null;
  const queueBeforeSave = reviewQueueItems();
  const activeQueueIndex = currentReviewQueueIndex(queueBeforeSave);
  const activeQueueItem = activeQueueIndex >= 0 ? queueBeforeSave[activeQueueIndex] : null;
  const dirtyFields = v1ContextDirtyFields(toolbenchContextDraft);
  const updatedScope = v1ContextUpdatedScopeDetails(dirtyFields);
  const savedAt = toolbenchContextDraft?.savedAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const outcomeBeforeSave = summarizeCommercialSnapshotForContext(toolbenchContextDraft)?.outcome || null;

  const benchmarkLowPsf = parseEditableNumber(toolbenchEl.v1BenchmarkLowInput.value);
  const benchmarkHighPsf = parseEditableNumber(toolbenchEl.v1BenchmarkHighInput.value);
  const askingPsf = parseEditableNumber(toolbenchEl.v1AskingPsfInput.value);
  const gapPercent = calculateGapPercent(askingPsf, benchmarkHighPsf);
  const rentSignal = {
    ...(toolbenchContextDraft.rentSignal || {}),
    verdict: toolbenchEl.v1VerdictInput.value.trim(),
    confidence: toolbenchEl.v1ConfidenceInput.value.trim(),
    benchmarkLowPsf,
    benchmarkHighPsf,
    askingPsf,
    gapPercent
  };
  const decisionNotes = {
    ...(toolbenchContextDraft.decisionNotes || {}),
    summary: toolbenchEl.v1DecisionInput.value.trim(),
    negotiationAngle: toolbenchEl.v1AngleInput.value.trim(),
    watchouts: toolbenchEl.v1WatchoutsInput.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  };
  const valueGapSignal = {
    ...(toolbenchContextDraft.valueGapSignal || {}),
    summary: toolbenchEl.v1ValueGapInput.value.trim(),
    status: toolbenchEl.v1ValueGapStatusInput.value.trim(),
    gapDirection: toolbenchEl.v1GapDirectionInput.value.trim(),
    score: parseEditableNumber(toolbenchEl.v1ValueGapScoreInput.value),
    likelyDrivers: parseLineList(toolbenchEl.v1LikelyDriversInput.value),
    cautionFlags: parseLineList(toolbenchEl.v1ValueGapCautionsInput.value)
  };
  const surroundingBusinesses = {
    ...(toolbenchContextDraft.surroundingBusinesses || {}),
    tradePattern: toolbenchEl.v1TradePatternInput.value.trim(),
    categoryMix: parseCategoryMix(toolbenchEl.v1CategoryMixInput.value),
    notableOperators: parseOperators(toolbenchEl.v1OperatorsInput.value),
    competitionFlags: parseLineList(toolbenchEl.v1CompetitionFlagsInput.value),
    complementaryFlags: parseLineList(toolbenchEl.v1ComplementaryFlagsInput.value),
    daypartSignals: parseLineList(toolbenchEl.v1DaypartSignalsInput.value)
  };
  const existingFitScores = Array.isArray(toolbenchContextDraft.unitSuitability?.fitScores)
    ? toolbenchContextDraft.unitSuitability.fitScores.map((item) => ({ ...item }))
    : [];
  const fitScores = parseFitScores(toolbenchEl.v1FitScoresInput.value, existingFitScores);
  const sortedFits = [...fitScores].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topFit = sortedFits[0] || null;
  const weakFit = sortedFits.length ? [...fitScores].sort((a, b) => (a.score || 0) - (b.score || 0))[0] : null;
  if (topFit) {
    const match = fitScores.find((item) => item.useCase === topFit.useCase);
    if (match) {
      match.rationale = toolbenchEl.v1GoodFitInput.value.trim();
    }
  }
  if (weakFit) {
    const match = fitScores.find((item) => item.useCase === weakFit.useCase);
    if (match) {
      match.watchouts = toolbenchEl.v1CautionInput.value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  const unitSuitability = {
    ...(toolbenchContextDraft.unitSuitability || {}),
    fitScores
  };
  const payload = {
    ...toolbenchContextDraft,
    savedAt,
    updatedAt,
    updatedScope,
    capturedAt: new Date().toISOString().slice(0, 10),
    rentSignal,
    valueGapSignal,
    surroundingBusinesses,
    unitSuitability,
    decisionNotes
  };

  toolbenchEl.v1SaveButton.disabled = true;
  setV1EditorStatus(toolbenchReviewPassMessages.workspace.v1Saving(), { tone: "info" });

  try {
    const updated = await window.RentIntelContextApi.upsertContextRecord(payload);
    if (!updated) throw new Error(toolbenchReviewPassMessages.workspace.v1SaveReturnedNothing());
    toolbenchContextDraft = contextBundleFromRecord(updated);
    const outcomeAfterSave = summarizeCommercialSnapshotForContext(toolbenchContextDraft)?.outcome || null;
    updateDecisionOutcomeHistory(toolbenchContextDraft, outcomeBeforeSave, outcomeAfterSave);
    persistV1ReviewPassState();
    setRecentDecisionOutcomeProgress(
      toolbenchContextDraft,
      summarizeDecisionOutcomeProgress(outcomeBeforeSave, outcomeAfterSave)
    );
    toolbenchEl.v1GapPercentInput.value = updated?.rentSignal?.gapPercent ?? "";
    const currentIndex = toolbenchDecisionContextRecords.findIndex((entry) =>
      normalizeDecisionContextKey(entry.recordId) === normalizeDecisionContextKey(updated.recordId) ||
      normalizeDecisionContextKey(entry.contextRecordId) === normalizeDecisionContextKey(updated.contextRecordId)
    );
    if (currentIndex >= 0) toolbenchDecisionContextRecords[currentIndex] = updated;
    else toolbenchDecisionContextRecords.unshift(updated);
    renderV1ContextLayer(toolbenchRecord);
    renderV1Roster();
    const validationWarningStillOpen = validationWarningBeforeSave
      ? currentV1ValidationWarningKeys().has(validationWarningBeforeSave)
      : false;
    const validationWarningCleared = Boolean(validationWarningBeforeSave) && !validationWarningStillOpen;
    if (validationWarningCleared) {
      setRecentlyCompletedValidationAll(currentV1ValidationWarningKeys().size === 0);
    }
    if (validationWarningCleared) {
      toolbenchActiveValidationWarningKey = "";
      setRecentlyClearedValidationWarning(selectedValidationWarning);
      if (selectedValidationWarning?.section && validationCountsBeforeSave) {
        const currentSectionCounts = currentV1ValidationCountsBySection();
        const nextSectionCount = Number(currentSectionCounts[selectedValidationWarning.section] || 0);
        setRecentlyResolvedValidationSection(
          selectedValidationWarning.section,
          Number(validationCountsBeforeSave[selectedValidationWarning.section] || 0),
          nextSectionCount
        );
        if (
          toolbenchV1ValidationSectionFilter === selectedValidationWarning.section &&
          nextSectionCount === 0
        ) {
          setRecentlyCompletedValidationSection(selectedValidationWarning.section);
        }
      }
    }
    const currentSectionCounts = validationCountsBeforeSave ? currentV1ValidationCountsBySection() : null;
    const routedLeadWarningAfterSave = trackedRoutedLeadWarning?.section
      ? nextV1ValidationWarningInSection(trackedRoutedLeadWarning.section)
      : null;
    const routedLeadDetail = trackedRoutedLeadWarning
      ? summarizeRoutedLeadValidationSaveDetail({
          warningBefore: trackedRoutedLeadWarning,
          warningStillOpen: currentV1ValidationWarningKeys().has(trackedRoutedLeadWarning.key),
          nextWarning: routedLeadWarningAfterSave,
          beforeCount: Number(validationCountsBeforeSave?.[trackedRoutedLeadWarning.section] || 0),
          afterCount: Number(currentSectionCounts?.[trackedRoutedLeadWarning.section] || 0)
        })
      : "";
    const routedLeadQueueCopy = trackedRoutedLeadWarning
      ? summarizeRoutedLeadValidationQueueCopy({
          warningBefore: trackedRoutedLeadWarning,
          warningStillOpen: currentV1ValidationWarningKeys().has(trackedRoutedLeadWarning.key),
          nextWarning: routedLeadWarningAfterSave,
          beforeCount: Number(validationCountsBeforeSave?.[trackedRoutedLeadWarning.section] || 0),
          afterCount: Number(currentSectionCounts?.[trackedRoutedLeadWarning.section] || 0)
        })
      : "";
    const routedLeadTileCopy = trackedRoutedLeadWarning
      ? summarizeRoutedLeadValidationTileCopy({
          warningBefore: trackedRoutedLeadWarning,
          warningStillOpen: currentV1ValidationWarningKeys().has(trackedRoutedLeadWarning.key),
          nextWarning: routedLeadWarningAfterSave,
          beforeCount: Number(validationCountsBeforeSave?.[trackedRoutedLeadWarning.section] || 0),
          afterCount: Number(currentSectionCounts?.[trackedRoutedLeadWarning.section] || 0)
        })
      : "";
    const routedLeadOutcomeStatus = trackedRoutedLeadWarning
      ? !currentV1ValidationWarningKeys().has(trackedRoutedLeadWarning.key)
        ? routedLeadWarningAfterSave?.key && routedLeadWarningAfterSave.key !== trackedRoutedLeadWarning.key
          ? "next-active"
          : "cleared"
        : Number(currentSectionCounts?.[trackedRoutedLeadWarning.section] || 0) < Number(validationCountsBeforeSave?.[trackedRoutedLeadWarning.section] || 0)
          ? "tightened"
          : "active"
      : "";
    const routedLanePlanningMemory =
      toolbenchQuickPickBookmarkPlanningMemoryByKey[quickPickBookmarkKeyForLens(currentQuickPickLensState())] || null;
    const routedLaneTempered = Boolean(
      quickPickBookmarkPlanningHoldReason(routedLanePlanningMemory, "keep this lane active")
    );
    const routedLaneRecovering =
      quickPickBookmarkPlanningCooldownStage(
        routedLanePlanningMemory,
        summarizeLaneRoutedReviewMomentum(currentQuickPickRecords)
      ) === "late";
    const routedLaneResultDetail = summarizeRoutedLeadLaneResultDetail(
      toolbenchRoutedRecordWorkCue?.reopenMemoryType || "",
      routedLeadOutcomeStatus,
      {
        tempered: routedLaneTempered,
        recovering: routedLaneRecovering
      }
    );
    const routedLeadOutcomeScore =
      routedLeadOutcomeStatus === "cleared"
        ? 18
        : routedLeadOutcomeStatus === "tightened"
          ? 10
          : routedLeadOutcomeStatus === "next-active"
            ? 4
            : 0;
    const routedLeadStoredStatus =
      routedLaneTempered && routedLeadOutcomeStatus
        ? `tempered-${routedLeadOutcomeStatus}`
        : routedLeadOutcomeStatus;
    if (trackedRoutedLeadWarning && toolbenchRecord?.id) {
      toolbenchRoutedReviewOutcomeByRecord = {
        ...toolbenchRoutedReviewOutcomeByRecord,
        [normalizeDecisionContextKey(toolbenchRecord.id || toolbenchRecord.title)]: {
          status: routedLeadStoredStatus,
          score: routedLeadOutcomeScore,
          at: new Date().toISOString(),
          tempered: routedLaneTempered
        }
      };
      persistV1ReviewPassState();
    }
    const queueAfterSave = reviewQueueItems();
    const activeStillOpen = activeQueueItem
      ? queueAfterSave.some((item) => reviewQueueItemKey(item) === reviewQueueItemKey(activeQueueItem))
      : false;
    const shouldAdvanceValidationInPlace = validationWarningCleared && (!activeQueueItem || activeStillOpen);
    const nextValidationWarning = shouldAdvanceValidationInPlace && selectedValidationWarning?.section
      ? nextV1ValidationWarningInSection(selectedValidationWarning.section, validationWarningBeforeSave)
      : null;
    if (activeQueueItem && !activeStillOpen) {
      toolbenchResolvedReviewKeys.add(reviewQueueItemKey(activeQueueItem));
    }
    if (activeQueueItem && !activeStillOpen && queueAfterSave.length) {
      const nextQueueItem = queueAfterSave[Math.min(activeQueueIndex, queueAfterSave.length - 1)] || queueAfterSave[0];
      if (nextQueueItem) {
        toolbenchActiveReviewKey = reviewQueueItemKey(nextQueueItem);
        persistV1ReviewPassState();
        if (nextQueueItem.record.id !== toolbenchRecord?.id) renderRecord(nextQueueItem.record);
        jumpToV1HealthLabel(nextQueueItem.label);
        setV1EditorStatus(
          toolbenchReviewPassMessages.workspace.v1Saved({
            subjectRef: updated.subjectRef
          }),
          {
            detail: combineStatusDetail(
              validationWarningCleared
                ? toolbenchReviewPassMessages.workspace.v1StatusValidationClearedAdvancedDetail({
                    title: nextQueueItem.record.title,
                    label: nextQueueItem.label
                  })
                : toolbenchReviewPassMessages.workspace.v1StatusAdvancedDetail({
                  title: nextQueueItem.record.title,
                  label: nextQueueItem.label
                }),
              routedLeadDetail,
              routedLaneResultDetail
            ),
            tone: "success"
          }
        );
      } else {
        setV1EditorStatus(
          toolbenchReviewPassMessages.workspace.v1Saved({
            subjectRef: updated.subjectRef
          }),
          {
            detail: combineStatusDetail(
              validationWarningCleared
                ? toolbenchReviewPassMessages.workspace.v1StatusValidationClearedDetail()
                : "",
              routedLeadDetail,
              routedLaneResultDetail
            ),
            tone: "success"
          }
        );
      }
    } else if (activeQueueItem && !activeStillOpen) {
      toolbenchActiveReviewKey = "";
      persistV1ReviewPassState();
      setV1EditorStatus(
        toolbenchReviewPassMessages.workspace.v1Saved({
          subjectRef: updated.subjectRef
        }),
        {
          detail: combineStatusDetail(
            validationWarningCleared
              ? toolbenchReviewPassMessages.workspace.v1StatusValidationClearedDetail()
              : toolbenchReviewPassMessages.workspace.v1StatusResolvedDetail(),
            routedLeadDetail,
            routedLaneResultDetail
          ),
          tone: "success"
        }
      );
    } else {
      persistV1ReviewPassState();
      setV1EditorStatus(
        toolbenchReviewPassMessages.workspace.v1Saved({
          subjectRef: updated.subjectRef
        }),
        {
          detail: combineStatusDetail(
            validationWarningCleared
              ? toolbenchReviewPassMessages.workspace.v1StatusValidationClearedDetail()
              : "",
            routedLeadDetail,
            routedLaneResultDetail
          ),
          tone: "success"
        }
      );
    }
    renderV1Validation();
    if (toolbenchQueueExplainerRoutedResultTimer) {
      clearTimeout(toolbenchQueueExplainerRoutedResultTimer);
      toolbenchQueueExplainerRoutedResultTimer = null;
    }
    toolbenchQueueExplainerRoutedResult = combineStatusDetail(routedLeadQueueCopy, routedLaneResultDetail);
    if (toolbenchQueueExplainerRoutedResult) {
      renderV1Roster();
      toolbenchQueueExplainerRoutedResultTimer = window.setTimeout(() => {
        toolbenchQueueExplainerRoutedResult = "";
        toolbenchQueueExplainerRoutedResultTimer = null;
        renderV1Roster();
      }, 2600);
    }
    if (toolbenchQuickPickRoutedResultTimer) {
      clearTimeout(toolbenchQuickPickRoutedResultTimer);
      toolbenchQuickPickRoutedResultTimer = null;
    }
    toolbenchQuickPickRoutedResult = {
      recordId: toolbenchRecord?.id || "",
      copy: combineStatusDetail(routedLeadTileCopy, routedLaneResultDetail),
      active: Boolean((routedLeadTileCopy || routedLaneResultDetail) && toolbenchRecord?.id)
    };
    if (toolbenchQuickPickRoutedResult.active) {
      renderQuickPicks();
      toolbenchQuickPickRoutedResultTimer = window.setTimeout(() => {
        toolbenchQuickPickRoutedResult = {
          recordId: "",
          copy: "",
          active: false
        };
        toolbenchQuickPickRoutedResultTimer = null;
        renderQuickPicks();
      }, 2600);
    }
    if (nextValidationWarning?.target) {
      toolbenchActiveValidationWarningKey = nextValidationWarning.key || "";
      focusV1EditorControl(
        nextValidationWarning.target,
        toolbenchReviewPassMessages.validation.advanced({
          label: v1ValidationSectionLabel(nextValidationWarning.section)
        }),
        `Validation: ${v1ValidationSectionLabel(nextValidationWarning.section)}`
      );
    }
  } catch (error) {
    console.error("V1 context save failed.", error);
    setV1EditorStatus(error.message || toolbenchReviewPassMessages.workspace.v1SaveFailed(), { tone: "error" });
  } finally {
    toolbenchEl.v1SaveButton.disabled = false;
  }
}

function renderToolbenchPulse(record) {
  if (!record || !toolbenchEl.pulseToolbenchLabel) return;
  const pulse = pulseSummaryForRecord(record);
  const root =
    toolbenchEl.pulseToolbenchLabel.closest(".workspace-brief-card") ||
    toolbenchEl.pulseToolbenchLabel.closest(".pulse-callout");
  if (root) root.dataset.pulseTone = pulse.tone;
  toolbenchEl.pulseToolbenchLabel.textContent = pulse.label;
  toolbenchEl.pulseToolbenchTitle.textContent = pulse.title;
  toolbenchEl.pulseToolbenchCopy.textContent = `${pulse.summary} Next: ${pulse.nextStep}`;
}

function setupPulseInteractions(root = document) {
  const placePulsePopover = (pulse) => {
    const popover = pulse.querySelector(":scope > div");
    if (!popover) return;
    pulse.dataset.popoverX = "right";
    pulse.dataset.popoverY = "bottom";
    requestAnimationFrame(() => {
      const rect = popover.getBoundingClientRect();
      const padding = 14;
      if (rect.left < padding) {
        pulse.dataset.popoverX = "left";
      } else if (rect.right > window.innerWidth - padding) {
        pulse.dataset.popoverX = "right";
      }
      if (rect.bottom > window.innerHeight - padding && rect.top > rect.height + padding) {
        pulse.dataset.popoverY = "top";
      }
    });
  };

  root.querySelectorAll(".pulse-callout").forEach((pulse) => {
    if (pulse.dataset.pulseReady === "true") return;
    pulse.dataset.pulseReady = "true";
    pulse.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = pulse.dataset.open !== "true";
      root.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((item) => {
        if (item !== pulse) {
          item.dataset.open = "false";
          item.setAttribute("aria-expanded", "false");
        }
      });
      pulse.dataset.open = String(willOpen);
      pulse.setAttribute("aria-expanded", String(willOpen));
      window.clearTimeout(Number(pulse.dataset.closeTimer || 0));
      if (willOpen) {
        placePulsePopover(pulse);
        const closeTimer = window.setTimeout(() => {
          pulse.dataset.open = "false";
          pulse.setAttribute("aria-expanded", "false");
          pulse.dataset.closeTimer = "";
        }, 7200);
        pulse.dataset.closeTimer = String(closeTimer);
      }
    });
    pulse.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        pulse.dataset.open = "false";
        pulse.setAttribute("aria-expanded", "false");
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      pulse.click();
    });
  });
  if (document.body.dataset.pulseCloseReady === "true") return;
  document.body.dataset.pulseCloseReady = "true";
  document.addEventListener("click", (event) => {
    if (event.target.closest(".pulse-callout")) return;
    document.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((pulse) => {
      pulse.dataset.open = "false";
      pulse.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".pulse-callout[data-open=\"true\"]").forEach((pulse) => {
      pulse.dataset.open = "false";
      pulse.setAttribute("aria-expanded", "false");
    });
  });
}

function pulseSummaryForRecord(record) {
  if (!record) {
    return {
      label: toolbenchReviewPassMessages.workspace.pulseLabelSummary(),
      tone: "member",
      title: toolbenchReviewPassMessages.workspace.pulseTitleEmpty(),
      summary: toolbenchReviewPassMessages.workspace.pulseSummaryEmpty(),
      warning: toolbenchReviewPassMessages.workspace.pulseWarningEmpty(),
      nextStep: toolbenchReviewPassMessages.workspace.pulseNextStepEmpty(),
      caveat: toolbenchReviewPassMessages.workspace.pulseCaveat()
    };
  }
  const qa = sourceQaProfile(record);
  const confidence = confidenceProfile(record);
  const sourceTrust = sourceTrustProfile(record);
  const fairHigh = record.fairRange?.high || record.official;
  const gap = Number(record.gap || 0);
  const sourceCaveat = qa.ready
    ? toolbenchReviewPassMessages.workspace.pulseSourceCaveatReady()
    : toolbenchReviewPassMessages.workspace.pulseSourceCaveatWorking({
        production: qa.production
      });

  if (!qa.ready) {
    return {
      label: toolbenchReviewPassMessages.workspace.pulseLabelWarning(),
      tone: "warning",
      title: toolbenchReviewPassMessages.workspace.pulseTitleWorking(),
      summary: `${confidence.title}. ${sourceTrust.title}.`,
      warning: sourceCaveat,
      nextStep: toolbenchReviewPassMessages.workspace.pulseNextStepWorking({
        fairHigh: money(fairHigh)
      }),
      caveat: toolbenchReviewPassMessages.workspace.pulseCaveat()
    };
  }

  if (gap >= 18) {
    return {
      label: toolbenchReviewPassMessages.workspace.pulseLabelDecisionNote(),
      tone: "member",
      title: toolbenchReviewPassMessages.workspace.pulseTitleDecision(),
      summary: toolbenchReviewPassMessages.workspace.pulseSummaryDecision({
        fairHigh: money(fairHigh)
      }),
      warning: toolbenchReviewPassMessages.workspace.pulseWarningDecision(),
      nextStep: toolbenchReviewPassMessages.workspace.pulseNextStepDecision(),
      caveat: toolbenchReviewPassMessages.workspace.pulseCaveat()
    };
  }

  return {
    label: toolbenchReviewPassMessages.workspace.pulseLabelSummary(),
    tone: "summary",
    title: toolbenchReviewPassMessages.workspace.pulseTitleEvidence(),
    summary: toolbenchReviewPassMessages.workspace.pulseSummaryEvidence({
      confidenceTitle: confidence.title
    }),
    warning: gap >= 8
      ? toolbenchReviewPassMessages.workspace.pulseWarningPremium()
      : toolbenchReviewPassMessages.workspace.pulseWarningNoLargePremium(),
    nextStep: toolbenchReviewPassMessages.workspace.pulseNextStepEvidence(),
    caveat: toolbenchReviewPassMessages.workspace.pulseCaveat()
  };
}

function renderDecisionSpine(record) {
  if (!record || !toolbenchEl.spineConfidenceTitle) return;
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const access = hasToolbenchAccess();
  const fairHigh = record.fairRange?.high || record.official;
  const fairLow = record.fairRange?.low || record.official;

  toolbenchEl.spineConfidenceTitle.textContent = confidence.title;
  toolbenchEl.spineConfidenceCopy.textContent = confidence.copy;
  toolbenchEl.spineBenchmarkTrust.textContent = sourceTrust.title;
  toolbenchEl.spineBenchmarkCopy.textContent = `${trust.officialLayer}; ${trust.askingLayer}. ${sourceTrust.reason}`;
  toolbenchEl.spineNegotiationPosition.textContent = toolbenchReviewPassMessages.workspace.spineNegotiationTarget({
    range: moneyRange(record.fairRange)
  });
  toolbenchEl.spineNegotiationCopy.textContent =
    toolbenchReviewPassMessages.workspace.spineNegotiationCopy({
      fairLow: money(fairLow),
      fairHigh: money(fairHigh)
    });
  toolbenchEl.spineMemberAccess.textContent = toolbenchReviewPassMessages.workspace.spineFreeToolsActive();
  toolbenchEl.spineMemberCopy.textContent = toolbenchReviewPassMessages.workspace.spineFreeToolsCopy();
  renderToolbenchPulse(record);

  if (toolbenchEl.workflowCheckStep) {
    toolbenchEl.workflowCheckStep.textContent = confidence.title;
    toolbenchEl.workflowTargetStep.textContent = toolbenchReviewPassMessages.workspace.workflowTarget({
      range: moneyRange(record.fairRange)
    });
    toolbenchEl.workflowOfferStep.textContent = toolbenchReviewPassMessages.workspace.workflowOffer({
      offer: money(fairLow),
      walkAway: money(fairHigh)
    });
    toolbenchEl.workflowActionStep.textContent = toolbenchReviewPassMessages.workspace.workflowAction();
  }
}

function renderWorkspaceEvidencePack(record) {
  if (!record || !toolbenchEl.evidencePackSummary) return;
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const qa = sourceQaProfile(record);
  const fairHigh = record.fairRange?.high || record.official;

  toolbenchEl.evidencePack.dataset.level = sourceTrust.level || sourceTrust.key || "sample";
  toolbenchEl.evidencePackSummary.textContent = `${record.title}: ${sourceTrust.title}`;
  toolbenchEl.evidencePackTrust.textContent = sourceTrust.title;
  toolbenchEl.evidencePackTrustCopy.textContent = `${sourceTrust.reason} ${sourceTrust.action}`;
  toolbenchEl.evidencePackBenchmark.textContent = confidence.title;
  toolbenchEl.evidencePackBenchmarkCopy.textContent = `${trust.officialLayer}. ${confidence.evidence}`;
  toolbenchEl.evidencePackAsking.textContent = qa.status;
  toolbenchEl.evidencePackAskingCopy.textContent =
    `${trust.askingLayer}. ${qa.checks} checks, captured ${qa.captured}, freshness ${qa.freshnessLabel.toLowerCase()}, production ${qa.production.toLowerCase()}.`;
  toolbenchEl.evidencePackAction.textContent = toolbenchReviewPassMessages.workspace.evidencePackAction({
    fairHigh: money(fairHigh)
  });
  toolbenchEl.evidencePackActionCopy.textContent =
    toolbenchReviewPassMessages.workspace.evidencePackActionCopy({
      actionLabel: record.actionLabel,
      action: record.action
    });
}

function renderWorkspaceSourceTimeline(record) {
  if (!record || !toolbenchEl.sourceTimelineList) return;
  const sourceTrust = sourceTrustProfile(record);
  const qa = sourceQaProfile(record);
  const source = record.askingSource || {};
  const hasDirectSource = Boolean(source.sourceName || source.sourceType);
  const hasEvidenceRows = evidenceRows(record).length > 0;
  const productionReady = qa.ready || sourceTrust.level === "released" || sourceTrust.title === "Production Verified";
  const steps = [
    {
      label: toolbenchReviewPassMessages.workspace.sourceStageSample(),
      title: hasEvidenceRows
        ? toolbenchReviewPassMessages.workspace.sourceStageBenchmarkLoaded()
        : toolbenchReviewPassMessages.workspace.sourceStageBenchmarkPending(),
      done: hasEvidenceRows
    },
    {
      label: toolbenchReviewPassMessages.workspace.sourceStagePilot(),
      title: hasDirectSource ? source.sourceName || qa.status : toolbenchReviewPassMessages.workspace.sourceStageComparableOnly(),
      done: hasDirectSource || record.prototypeSource === "coverage-request"
    },
    {
      label: toolbenchReviewPassMessages.workspace.sourceStageQa(),
      title: `${qa.checks} checks / ${qa.freshnessLabel.toLowerCase()} / captured ${qa.captured}`,
      done: Number(qa.checks) > 0
    },
    {
      label: toolbenchReviewPassMessages.workspace.sourceStageProduction(),
      title: productionReady
        ? toolbenchReviewPassMessages.workspace.sourceStageProductionReady()
        : toolbenchReviewPassMessages.workspace.sourceStageProductionNotReady(),
      done: productionReady
    },
    {
      label: toolbenchReviewPassMessages.workspace.sourceStageMonitor(),
      title: productionReady
        ? toolbenchReviewPassMessages.workspace.sourceStageMonitorReady()
        : toolbenchReviewPassMessages.workspace.sourceStageMonitorPending(),
      done: sourceTrust.level === "released"
    }
  ];
  const currentIndex = Math.max(0, steps.findIndex((step) => !step.done));
  const handoffMatchesRecord =
    normalizeDecisionContextKey(record.recordId || "") &&
    normalizeDecisionContextKey(record.recordId || "") === toolbenchSourceTimelineHandoff.recordId;
  toolbenchEl.sourceTimeline.dataset.level = sourceTrust.level || "sample";
  toolbenchEl.sourceTimelineSummary.textContent = `${record.title}: ${sourceTrust.title}`;
  const refreshedLayerKeys =
    handoffMatchesRecord && toolbenchSourceTimelineHandoff.origin === "refreshed-from-sample" && toolbenchContextDraft
      ? (Array.isArray(toolbenchContextDraft.contextOriginLayers) ? toolbenchContextDraft.contextOriginLayers : [])
      : [];
  const refreshedSectionKeys = refreshedLayerKeys
    .map(v1ContextOriginLayerSectionKey)
    .filter(Boolean);
  const refreshedReviewedCount = refreshedSectionKeys.filter((sectionKey) => toolbenchReviewedRefreshedContextSections[sectionKey]).length;
  const allRefreshedReviewed = Boolean(
    refreshedSectionKeys.length &&
    refreshedSectionKeys.every((sectionKey) => toolbenchReviewedRefreshedContextSections[sectionKey])
  );
  const nextRefreshedSectionKey = refreshedSectionKeys.find((sectionKey) => !toolbenchReviewedRefreshedContextSections[sectionKey]) || "";
  if (toolbenchEl.sourceTimelineNote) {
    if (handoffMatchesRecord && toolbenchSourceTimelineHandoff.origin === "sample-backed") {
      toolbenchEl.sourceTimelineNote.hidden = false;
      toolbenchEl.sourceTimelineNote.dataset.state = "sample";
      toolbenchEl.sourceTimelineNote.textContent = toolbenchReviewPassMessages.workspace.sourceTimelineOriginSample({
        title: record.title
      });
    } else if (handoffMatchesRecord && toolbenchSourceTimelineHandoff.origin === "refreshed-from-sample") {
      const layers = v1ContextOriginLayersLabel(toolbenchContextDraft);
      toolbenchEl.sourceTimelineNote.hidden = false;
      toolbenchEl.sourceTimelineNote.dataset.state = allRefreshedReviewed ? "complete" : "refreshed";
      toolbenchEl.sourceTimelineNote.textContent = allRefreshedReviewed
        ? toolbenchReviewPassMessages.workspace.sourceTimelineOriginCompleted({
            title: record.title
          })
        : toolbenchReviewPassMessages.workspace.sourceTimelineOriginRefreshed({
            title: record.title,
            layers
          });
    } else {
      toolbenchEl.sourceTimelineNote.hidden = true;
      toolbenchEl.sourceTimelineNote.textContent = "";
      delete toolbenchEl.sourceTimelineNote.dataset.state;
    }
  }
  if (toolbenchEl.sourceTimelineActions) {
    toolbenchEl.sourceTimelineActions.replaceChildren();
    if (refreshedLayerKeys.length) {
      toolbenchEl.sourceTimelineActions.hidden = false;
      const progress = document.createElement("span");
      progress.className = "workspace-source-timeline-progress";
      progress.dataset.state = allRefreshedReviewed ? "complete" : "active";
      progress.textContent = toolbenchReviewPassMessages.workspace.sourceTimelineReviewProgress({
        reviewed: refreshedReviewedCount,
        total: refreshedSectionKeys.length,
        complete: allRefreshedReviewed
      });
      toolbenchEl.sourceTimelineActions.append(progress);
      if (allRefreshedReviewed) {
        const reviewedToggle = document.createElement("button");
        reviewedToggle.type = "button";
        reviewedToggle.dataset.role = "reviewed-toggle";
        reviewedToggle.dataset.expanded = toolbenchSourceTimelineReviewedExpanded ? "true" : "false";
        reviewedToggle.textContent = toolbenchReviewPassMessages.workspace.sourceTimelineReviewedToggle({
          count: refreshedSectionKeys.length,
          expanded: toolbenchSourceTimelineReviewedExpanded
        });
        reviewedToggle.title = toolbenchSourceTimelineReviewedExpanded
          ? "Hide the reviewed refreshed-layer detail."
          : "Show the reviewed refreshed-layer detail.";
        toolbenchEl.sourceTimelineActions.append(reviewedToggle);
      }
      if (!allRefreshedReviewed && nextRefreshedSectionKey) {
        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.dataset.sourceNext = nextRefreshedSectionKey;
        nextButton.dataset.role = "next";
        nextButton.textContent = toolbenchReviewPassMessages.workspace.sourceTimelineNextLayer({
          next: v1ValidationSectionLabel(nextRefreshedSectionKey)
        });
        nextButton.title = `Continue the refresh-review flow with ${v1ValidationSectionLabel(nextRefreshedSectionKey)}.`;
        toolbenchEl.sourceTimelineActions.append(nextButton);
      }
      refreshedLayerKeys.forEach((layerKey) => {
        const sectionKey = v1ContextOriginLayerSectionKey(layerKey);
        if (!sectionKey) return;
        if (allRefreshedReviewed && !toolbenchSourceTimelineReviewedExpanded) return;
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.sourceSectionTarget = sectionKey;
        button.dataset.reviewed = toolbenchReviewedRefreshedContextSections[sectionKey] ? "true" : "false";
        button.dataset.justReviewed = toolbenchJustReviewedRefreshedSection === sectionKey ? "true" : "false";
        button.textContent = v1ContextOriginLayerLabel(layerKey);
        button.title = toolbenchReviewedRefreshedContextSections[sectionKey]
          ? `Reviewed: ${v1ContextOriginLayerLabel(layerKey)}. Jump back to this refreshed V1 section in the editor.`
          : `Jump to the refreshed ${v1ContextOriginLayerLabel(layerKey)} section in the V1 editor.`;
        toolbenchEl.sourceTimelineActions.append(button);
      });
      if (!toolbenchEl.sourceTimelineActions.childElementCount) {
        toolbenchEl.sourceTimelineActions.hidden = true;
      }
    } else {
      toolbenchEl.sourceTimelineActions.hidden = true;
    }
  }
  toolbenchEl.sourceTimelineList.replaceChildren();
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.dataset.state = step.done ? "done" : index === currentIndex ? "current" : "pending";
    const label = document.createElement("span");
    label.textContent = step.label;
    const title = document.createElement("strong");
    title.textContent = step.title;
    item.append(label, title);
    toolbenchEl.sourceTimelineList.append(item);
  });
}

function compactPercentLabel(value) {
  return Number.isFinite(value) ? `${Math.round(value * 100)}%` : "";
}

function fitVerdictLabel(value = "") {
  return String(value || "").replace(/_/g, " ");
}

function summarizeCategoryMix(categoryMix = [], limit = 3) {
  return (Array.isArray(categoryMix) ? [...categoryMix] : [])
    .sort((a, b) => (b.share || 0) - (a.share || 0))
    .slice(0, limit)
    .map((item) => `${categoryLabel(item.category)} ${compactPercentLabel(item.share)}`.trim())
    .filter(Boolean);
}

function summarizeTradeCluster(categoryMix = []) {
  const labels = summarizeCategoryMix(categoryMix, 2).map((item) => item.replace(/\s+\d+%$/, ""));
  return labels.length ? `${labels.join(" + ")} cluster` : "";
}

function summarizeDayparts(daypartSignals = [], limit = 2) {
  return (Array.isArray(daypartSignals) ? daypartSignals : [])
    .slice(0, limit)
    .map(signalLabel)
    .filter(Boolean)
    .join(" • ");
}

function summarizeFitLeaders(fitScores = [], limit = 3) {
  return (Array.isArray(fitScores) ? [...fitScores] : [])
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map((item) => `${fitLabel(item.useCase)} ${item.score || 0}`)
    .filter(Boolean);
}

function summarizeOperatorRead(operators = [], limit = 3) {
  return (Array.isArray(operators) ? operators : [])
    .filter((item) => item?.name)
    .slice(0, limit)
    .map((item) => {
      const brand = item.brandSignal ? signalLabel(item.brandSignal) : "";
      const category = item.category ? categoryLabel(item.category) : "";
      return [item.name, category, brand].filter(Boolean).join(" • ");
    });
}

function summarizeTradePressure(competitionFlags = [], complementaryFlags = []) {
  const pressureCount = Array.isArray(competitionFlags) ? competitionFlags.length : 0;
  const supportCount = Array.isArray(complementaryFlags) ? complementaryFlags.length : 0;
  if (pressureCount >= 3 && pressureCount > supportCount) {
    return {
      title: "High pressure",
      copy: "competitive cluster"
    };
  }
  if (pressureCount > supportCount) {
    return {
      title: "Pressure-led",
      copy: "competition outweighs support"
    };
  }
  if (supportCount >= 2 && supportCount > pressureCount) {
    return {
      title: "Support-led",
      copy: "complementary trade is working in your favor"
    };
  }
  if (pressureCount === 0 && supportCount === 0) {
    return {
      title: "Light signal",
      copy: "trade competition is not strongly mapped yet"
    };
  }
  return {
    title: "Balanced",
    copy: "pressure and support are both present"
  };
}

function summarizeFitStrength(topFit, fitScores = []) {
  const score = Number(topFit?.score || 0);
  const strongCount = (Array.isArray(fitScores) ? fitScores : []).filter((item) => item?.verdict === "strong_fit").length;
  const workableCount = (Array.isArray(fitScores) ? fitScores : []).filter((item) =>
    item?.verdict === "strong_fit" || item?.verdict === "conditional_fit"
  ).length;
  if (!topFit) {
    return {
      title: "Fit pending",
      copy: "no suitability lead modeled yet"
    };
  }
  if (score >= 80 || strongCount >= 2) {
    return {
      title: "Strong fit",
      copy: workableCount > 1 ? `${workableCount} workable use cases modeled` : "clear use-case lead"
    };
  }
  if (score >= 60 || workableCount >= 1) {
    return {
      title: "Workable fit",
      copy: workableCount > 1 ? `${workableCount} usable paths, but not all equal` : "one workable use case stands out"
    };
  }
  return {
    title: "Fragile fit",
    copy: "use-case support is thin or conditional"
  };
}

function summarizeValueGapRead(valueGap = {}, rentSignal = {}) {
  const status = String(valueGap?.status || "").toLowerCase();
  const direction = String(valueGap?.gapDirection || gapDirectionForRange(
    rentSignal?.askingPsf,
    rentSignal?.benchmarkLowPsf,
    rentSignal?.benchmarkHighPsf
  ) || "").toLowerCase();
  const score = Number(valueGap?.score || 0);
  const gapPercent = Number(rentSignal?.gapPercent || 0);
  if (status === "below_benchmark" || status === "possible_value_gap" || direction === "below_range") {
    return {
      title: "Negotiable",
      copy: score >= 70 || gapPercent <= -8
        ? "ask looks meaningfully below benchmark range"
        : "ask may sit below range, but confirm why"
    };
  }
  if (status === "fair" || direction === "within_range") {
    return {
      title: "Fairly priced",
      copy: score >= 65
        ? "ask is landing close to the benchmark band"
        : "ask is roughly within range, but evidence is still mixed"
    };
  }
  if (status === "not_below_benchmark" || status === "stretched" || direction === "above_range") {
    return {
      title: "Stretched ask",
      copy: gapPercent >= 10 || score >= 70
        ? "ask is running above range and needs a strong defense"
        : "ask is leaning above range, so push for evidence"
    };
  }
  return {
    title: "Needs pricing read",
    copy: "below-benchmark logic is not yet clear enough to call"
  };
}

function summarizeRentSignalRead(rentSignal = {}) {
  const direction = gapDirectionForRange(
    rentSignal?.askingPsf,
    rentSignal?.benchmarkLowPsf,
    rentSignal?.benchmarkHighPsf
  );
  const gapPercent = Number(rentSignal?.gapPercent || 0);
  const confidence = String(rentSignal?.confidence || "").toLowerCase();
  if (direction === "below_range") {
    return {
      title: "Below range",
      copy: confidence
        ? `ask is landing below the benchmark band with ${confidence} confidence`
        : "ask is landing below the benchmark band"
    };
  }
  if (direction === "within_range") {
    return {
      title: "In range",
      copy: confidence
        ? `ask is sitting inside the benchmark band with ${confidence} confidence`
        : "ask is sitting inside the benchmark band"
    };
  }
  if (direction === "above_range") {
    return {
      title: "Above range",
      copy: gapPercent >= 10
        ? "ask is meaningfully above the benchmark band"
        : "ask is leaning above the benchmark band"
    };
  }
  return {
    title: String(rentSignal?.verdict || "Review").replace(/_/g, " "),
    copy: confidence ? `${confidence} confidence signal still needs range confirmation` : "signal still needs range confirmation"
  };
}

function summarizeCommercialRead(subjectRef = "", rentSignalRead = {}, valueGapRead = {}, fitStrength = {}) {
  const subject = String(subjectRef || "This context").trim();
  const rentTitle = String(rentSignalRead?.title || "Review").toLowerCase();
  const valueTitle = String(valueGapRead?.title || "Needs pricing read").toLowerCase();
  const fitTitle = String(fitStrength?.title || "Fit pending").toLowerCase();
  return `${subject}: ${rentTitle}; ${valueTitle}; ${fitTitle}.`;
}

function summarizeCommercialReadTone(rentSignalRead = {}, valueGapRead = {}, fitStrength = {}) {
  const rentTitle = String(rentSignalRead?.title || "").toLowerCase();
  const valueTitle = String(valueGapRead?.title || "").toLowerCase();
  const fitTitle = String(fitStrength?.title || "").toLowerCase();
  if (
    fitTitle === "strong fit" &&
    (valueTitle === "negotiable" || valueTitle === "fairly priced") &&
    (rentTitle === "in range" || rentTitle === "below range")
  ) {
    return "strong";
  }
  if (
    fitTitle === "fragile fit" ||
    valueTitle === "stretched ask" ||
    rentTitle === "above range"
  ) {
    return "caution";
  }
  if (
    fitTitle === "workable fit" ||
    valueTitle === "needs pricing read" ||
    rentTitle === "review"
  ) {
    return "watch";
  }
  return "neutral";
}

function summarizeCommercialReadHint(tone = "", rentSignalRead = {}, valueGapRead = {}, fitStrength = {}) {
  const payload = {
    rent: String(rentSignalRead?.title || "review").toLowerCase(),
    value: String(valueGapRead?.title || "needs pricing read").toLowerCase(),
    fit: String(fitStrength?.title || "fit pending").toLowerCase()
  };
  if (tone === "strong") {
    return toolbenchReviewPassMessages.workspace.v1CommercialToneStrong(payload);
  }
  if (tone === "watch") {
    return toolbenchReviewPassMessages.workspace.v1CommercialToneWatch(payload);
  }
  if (tone === "caution") {
    return toolbenchReviewPassMessages.workspace.v1CommercialToneCaution(payload);
  }
  return toolbenchReviewPassMessages.workspace.v1CommercialToneNeutral(payload);
}

function summarizeCommercialReadWhy(rentSignalRead = {}, valueGapRead = {}, fitStrength = {}, tradePressure = {}) {
  return [
    {
      label: "Rent signal",
      copy: rentSignalRead.copy || "",
      action: "rent-signal",
      title: "Click to jump to the rent-signal fields in the V1 editor."
    },
    {
      label: "Value gap",
      copy: valueGapRead.copy || "",
      action: "value-gap-summary",
      title: "Click to jump to the value-gap fields in the V1 editor."
    },
    {
      label: "Best fit",
      copy: fitStrength.copy || "",
      action: "best-fit-summary",
      title: "Click to jump to the suitability fields in the V1 editor."
    },
    {
      label: "Trade context",
      copy: tradePressure.copy || "",
      action: "surrounding-trade",
      title: "Click to jump to the surrounding-trade fields in the V1 editor."
    }
  ].filter((item) => item.copy);
}

function renderV1CommercialWhy(items = [], tone = "") {
  if (!toolbenchEl.v1ContextWhy || !toolbenchEl.v1ContextWhyToggle) return;
  toolbenchV1CommercialWhyItems = Array.isArray(items) ? items.filter((item) => item?.copy) : [];
  const hasItems = toolbenchV1CommercialWhyItems.length > 0;
  toolbenchEl.v1ContextWhyToggle.hidden = !hasItems;
  toolbenchEl.v1ContextWhyToggle.textContent = toolbenchV1CommercialWhyOpen
    ? toolbenchReviewPassMessages.workspace.v1CommercialWhyHide()
    : toolbenchReviewPassMessages.workspace.v1CommercialWhyToggle();
  toolbenchEl.v1ContextWhy.hidden = !(toolbenchV1CommercialWhyOpen && hasItems);
  toolbenchEl.v1ContextWhy.replaceChildren();
  if (toolbenchV1CommercialWhyOpen && hasItems) {
    toolbenchV1CommercialWhyItems.forEach((item, index) => {
      const clause = document.createElement(item.action ? "button" : "span");
      clause.className = "workspace-v1-context-why-clause";
      clause.textContent = `${item.label}: ${item.copy}.`;
      if (item.action) {
        clause.type = "button";
        clause.dataset.action = item.action;
        if (toolbenchV1CommercialWhyActiveAction === item.action) {
          clause.dataset.active = "true";
        }
        clause.setAttribute("aria-label", item.title || clause.textContent);
        if (item.title) clause.title = item.title;
      }
      toolbenchEl.v1ContextWhy.append(clause);
      if (index < toolbenchV1CommercialWhyItems.length - 1) {
        const separator = document.createElement("span");
        separator.className = "workspace-v1-context-why-separator";
        separator.textContent = " ";
        toolbenchEl.v1ContextWhy.append(separator);
      }
    });
  }
  if (tone) toolbenchEl.v1ContextWhy.dataset.tone = tone;
  else delete toolbenchEl.v1ContextWhy.dataset.tone;
}

function pulseV1CommercialWhyAction(action = "") {
  if (toolbenchV1CommercialWhyActiveTimer) {
    window.clearTimeout(toolbenchV1CommercialWhyActiveTimer);
    toolbenchV1CommercialWhyActiveTimer = null;
  }
  toolbenchV1CommercialWhyActiveAction = action || "";
  renderV1CommercialWhy(toolbenchV1CommercialWhyItems, toolbenchEl.v1ContextSummary?.dataset?.tone || "");
  if (!toolbenchV1CommercialWhyActiveAction) return;
  toolbenchV1CommercialWhyActiveTimer = window.setTimeout(() => {
    toolbenchV1CommercialWhyActiveAction = "";
    toolbenchV1CommercialWhyActiveTimer = null;
    renderV1CommercialWhy(toolbenchV1CommercialWhyItems, toolbenchEl.v1ContextSummary?.dataset?.tone || "");
  }, 1800);
}

function setV1ReadCardTone(titleEl, tone = "") {
  const card = titleEl?.closest?.("article, .signal-depth");
  if (!card) return;
  if (!tone || tone === "neutral") {
    delete card.dataset.tone;
    return;
  }
  card.dataset.tone = tone;
}

function setV1ContextSummaryAction(summaryEl, {
  action = "",
  enabled = false,
  title = ""
} = {}) {
  if (!summaryEl) return;
  if (enabled && action) {
    summaryEl.dataset.action = action;
    summaryEl.setAttribute("role", "button");
    summaryEl.setAttribute("tabindex", "0");
    summaryEl.setAttribute("aria-label", title || summaryEl.textContent.trim());
    if (title) summaryEl.title = title;
    return;
  }
  delete summaryEl.dataset.action;
  summaryEl.removeAttribute("role");
  summaryEl.removeAttribute("tabindex");
  summaryEl.removeAttribute("title");
  summaryEl.removeAttribute("aria-label");
}

function summarizeCommercialReadAction({
  commercialReadTone = "",
  rentSignalRead = {},
  valueGapRead = {},
  fitStrength = {},
  tradePressure = {}
} = {}) {
  if (commercialReadTone === "caution") {
    if (fitStrength.title === "Fragile fit") {
      return {
        action: "caution-fit",
        title: "Click to jump to the weakest-fit commercial constraint in the V1 editor."
      };
    }
    if (valueGapRead.title === "Stretched ask") {
      return {
        action: "value-gap-summary",
        title: "Click to jump to the pricing stretch read in the V1 editor."
      };
    }
    if (rentSignalRead.title === "Above range") {
      return {
        action: "rent-signal",
        title: "Click to jump to the above-range rent signal in the V1 editor."
      };
    }
  }
  if (commercialReadTone === "strong") {
    if (fitStrength.title === "Strong fit") {
      return {
        action: "good-fit",
        title: "Click to jump to the strongest commercial use-case fit in the V1 editor."
      };
    }
    if (valueGapRead.title === "Fairly priced" || valueGapRead.title === "Negotiable") {
      return {
        action: "value-gap-summary",
        title: "Click to jump to the most supportive pricing read in the V1 editor."
      };
    }
  }
  if (commercialReadTone === "watch") {
    if (valueGapRead.title === "Negotiable" || valueGapRead.title === "Needs pricing read") {
      return {
        action: "value-gap-summary",
        title: "Click to jump to the pricing question driving this watch state."
      };
    }
    if (fitStrength.title === "Workable fit") {
      return {
        action: "best-fit-summary",
        title: "Click to jump to the workable-fit read driving this watch state."
      };
    }
    if (tradePressure.title === "Balanced" || tradePressure.title === "Light signal") {
      return {
        action: "surrounding-trade",
        title: "Click to jump to the trade-context read driving this watch state."
      };
    }
  }
  return {
    action: "decision-note",
    title: "Click to jump to the decision note behind this commercial read."
  };
}

function v1ReadActionForHealthLabel(label = "") {
  const normalized = String(label || "").trim().toLowerCase();
  if (normalized === "rent signal") return "rent-signal";
  if (normalized === "value gap") return "value-gap-summary";
  if (normalized === "surrounding trade") return "surrounding-trade";
  if (normalized === "suitability") return "best-fit-summary";
  if (normalized === "decision note") return "decision-note";
  return "";
}

function summarizeCommercialSnapshot({
  context = null,
  rentSignalRead = {},
  valueGapRead = {},
  fitStrength = {},
  tradePressure = {},
  healthSummary = {},
  decisionNotes = {}
} = {}) {
  const provenance = summarizeDecisionOutcomeProvenance(context);
  const opportunity = (() => {
    if (valueGapRead.title === "Negotiable") {
      return {
        title: "Pricing room",
        copy: valueGapRead.copy || "Ask may sit below the benchmark band.",
        meta: "Driver: pricing read",
        action: "value-gap-summary",
        tone: "watch"
      };
    }
    if (fitStrength.title === "Strong fit") {
      return {
        title: "Fit lead",
        copy: fitStrength.copy || "A clear use-case lead is modeled here.",
        meta: "Driver: suitability read",
        action: "good-fit",
        tone: "strong"
      };
    }
    if (tradePressure.title === "Support-led") {
      return {
        title: "Trade support",
        copy: tradePressure.copy || "Complementary trade is helping this unit.",
        meta: "Driver: surrounding trade",
        action: "surrounding-trade",
        tone: "strong"
      };
    }
    if (rentSignalRead.title === "In range" || rentSignalRead.title === "Below range") {
      return {
        title: "Range support",
        copy: rentSignalRead.copy || "The ask is not obviously running above the benchmark band.",
        meta: "Driver: rent signal",
        action: "rent-signal",
        tone: rentSignalRead.title === "In range" ? "strong" : "watch"
      };
    }
    return {
      title: "No clear edge yet",
      copy: "This read is more about clearing constraints than leaning into an obvious upside.",
      meta: "Driver: overall decision read",
      action: "decision-note",
      tone: "watch"
    };
  })();

  const constraint = (() => {
    if (valueGapRead.title === "Stretched ask") {
      return {
        title: "Pricing stretch",
        copy: valueGapRead.copy || "The ask is running above the benchmark band.",
        meta: "Driver: pricing read",
        action: "value-gap-summary",
        tone: "caution"
      };
    }
    if (fitStrength.title === "Fragile fit") {
      return {
        title: "Fit fragility",
        copy: fitStrength.copy || "Use-case support looks thin or conditional.",
        meta: "Driver: suitability read",
        action: "caution-fit",
        tone: "caution"
      };
    }
    if (tradePressure.title === "High pressure" || tradePressure.title === "Pressure-led") {
      return {
        title: "Trade pressure",
        copy: tradePressure.copy || "Competition outweighs support nearby.",
        meta: "Driver: surrounding trade",
        action: "competition-read",
        tone: "caution"
      };
    }
    if (rentSignalRead.title === "Above range") {
      return {
        title: "Above-range signal",
        copy: rentSignalRead.copy || "The ask is leaning above the benchmark band.",
        meta: "Driver: rent signal",
        action: "rent-signal",
        tone: "caution"
      };
    }
    return {
      title: "No major block flagged",
      copy: "No single modeled constraint is dominating this read yet.",
      meta: "Driver: overall decision read",
      action: "decision-note",
      tone: "watch"
    };
  })();

  const nextMove = (() => {
    if (healthSummary?.nextLabel) {
      return {
        title: `Tighten ${healthSummary.nextLabel}`,
        copy: v1HealthActionForLabel(healthSummary.nextLabel) || "Close the next incomplete V1 layer before relying on this context.",
        meta: "Driver: review health",
        action: v1ReadActionForHealthLabel(healthSummary.nextLabel),
        tone: "watch"
      };
    }
    if (valueGapRead.title === "Stretched ask" || rentSignalRead.title === "Above range") {
      return {
        title: "Pressure-test premium",
        copy: "Push for comparable evidence before accepting the current premium.",
        meta: "Driver: pricing pressure",
        action: valueGapRead.title === "Stretched ask" ? "value-gap-summary" : "rent-signal",
        tone: "caution"
      };
    }
    if (fitStrength.title === "Workable fit" || fitStrength.title === "Fragile fit") {
      return {
        title: "Validate use-case fit",
        copy: fitStrength.copy || "Check whether the best-fit case really survives approval and trade reality.",
        meta: "Driver: suitability review",
        action: "best-fit-summary",
        tone: "watch"
      };
    }
    if (tradePressure.title === "Balanced" || tradePressure.title === "Light signal") {
      return {
        title: "Tighten trade map",
        copy: tradePressure.copy || "Sharpen nearby competition and support before treating this as stable.",
        meta: "Driver: trade mapping",
        action: "surrounding-trade",
        tone: "watch"
      };
    }
    return {
      title: "Prepare landlord note",
      copy: decisionNotes.summary || "Move this read into a negotiation-ready internal note.",
      meta: "Driver: internal decision note",
      action: "decision-note",
      tone: "strong"
    };
  })();

  const outcome = (() => {
    if (healthSummary?.nextLabel) {
      return {
        title: "Needs V1 completion",
        copy: `Finish ${healthSummary.nextLabel} before treating this context as fully decision-ready.`,
        reason: `${healthSummary.nextLabel} is still the next incomplete tracked V1 layer for this record.${provenance ? ` ${provenance}` : ""}`,
        priority: "Priority: medium review - complete the next V1 layer before relying on this read.",
        action: v1ReadActionForHealthLabel(healthSummary.nextLabel),
        tone: "watch"
      };
    }
    if (valueGapRead.title === "Stretched ask" || rentSignalRead.title === "Above range") {
      return {
        title: "Needs pricing review",
        copy: "The current ask still needs stronger benchmark or premium justification before moving forward.",
        reason: valueGapRead.title === "Stretched ask"
          ? `The value-gap read still treats the ask as stretched versus the current benchmark context.${provenance ? ` ${provenance}` : ""}`
          : `The rent-signal read still places the asking rent above the benchmark range.${provenance ? ` ${provenance}` : ""}`,
        priority: "Priority: high blocker - pricing needs to be challenged before moving this into a decision-ready note.",
        action: valueGapRead.title === "Stretched ask" ? "value-gap-summary" : "rent-signal",
        tone: "caution"
      };
    }
    if (fitStrength.title === "Fragile fit") {
      return {
        title: "Needs fit cleanup",
        copy: "The modeled use-case support is still too thin to treat this as a clean internal decision.",
        reason: `The current best-fit layer is still fragile enough that approval and trade fit need another pass.${provenance ? ` ${provenance}` : ""}`,
        priority: "Priority: high blocker - fit risk is still too material to treat this as a clean internal decision.",
        action: "best-fit-summary",
        tone: "caution"
      };
    }
    if (fitStrength.title === "Workable fit" || tradePressure.title === "Balanced") {
      return {
        title: "Ready for closer review",
        copy: "The read is workable, but it still benefits from one tighter internal pass before a negotiation-ready note.",
        reason: fitStrength.title === "Workable fit"
          ? `The best-fit layer is workable, but not yet strong enough to skip a final internal review pass.${provenance ? ` ${provenance}` : ""}`
          : `The surrounding trade read is still balanced enough to warrant one more closer internal check.${provenance ? ` ${provenance}` : ""}`,
        priority: "Priority: medium review - this is usable, but still deserves one closer internal pass.",
        action: "decision-note",
        tone: "watch"
      };
    }
    return {
      title: "Ready for landlord note",
      copy: decisionNotes.summary || "The current pricing, fit, and trade read are aligned enough to move into a negotiation-ready internal note.",
      reason: `Pricing, fit, and surrounding trade are currently aligned enough to support a negotiation-ready internal note.${provenance ? ` ${provenance}` : ""}`,
      priority: "Priority: low follow-through - move this into the landlord note when you are ready.",
      action: "decision-note",
      tone: "strong"
    };
  })();

  return { opportunity, constraint, nextMove, outcome };
}

function renderV1DecisionSnapshot(snapshot = null) {
  const routedCue = currentRoutedRecordCueForContext(toolbenchContextDraft);
  const apply = (titleEl, copyEl, metaEl, item, pendingTitle, pendingCopy) => {
    if (!titleEl || !copyEl) return;
    const card = titleEl.closest?.("article");
    const cardKey = card?.dataset?.snapshotKey || "";
    if (!item) {
      titleEl.textContent = pendingTitle;
      copyEl.textContent = pendingCopy;
      if (metaEl) metaEl.textContent = "Driver details appear here after a linked V1 context loads.";
      setV1ReadCardTone(titleEl, "");
      setV1ReadCardAction(titleEl, { enabled: false });
      if (card) delete card.dataset.routedWork;
      return;
    }
    titleEl.textContent = item.title;
    copyEl.textContent = item.copy;
    if (metaEl) {
      metaEl.textContent =
        routedCue && routedCue.cardKey === cardKey
          ? `${item.meta || "Driver details are available through the linked V1 read."} • Routed now for ${toolbenchReviewPassMessages.workspace.quickPickWorkMeta({
              workType: routedCue.workType
            }).toLowerCase()}.${routedCue.reopenMemoryType === "productive" ? " Productive reopen lane." : routedCue.reopenMemoryType === "pressure" ? " Pressure reopen lane." : ""}`
          : item.meta || "Driver details are available through the linked V1 read.";
    }
    setV1ReadCardTone(titleEl, item.tone || "");
    setV1ReadCardAction(titleEl, {
      action: item.action,
      enabled: Boolean(item.action),
      title: `Click to follow this ${String(titleEl.closest("article")?.querySelector("span")?.textContent || "").toLowerCase()} read in the V1 editor.`
    });
    if (card) {
      if (routedCue && routedCue.cardKey === cardKey) card.dataset.routedWork = "true";
      else delete card.dataset.routedWork;
    }
  };
  apply(
    toolbenchEl.v1SnapshotOpportunityTitle,
    toolbenchEl.v1SnapshotOpportunityCopy,
    toolbenchEl.v1SnapshotOpportunityMeta,
    snapshot?.opportunity || null,
    toolbenchReviewPassMessages.workspace.v1SnapshotOpportunityPendingTitle(),
    toolbenchReviewPassMessages.workspace.v1SnapshotOpportunityPendingCopy()
  );
  apply(
    toolbenchEl.v1SnapshotConstraintTitle,
    toolbenchEl.v1SnapshotConstraintCopy,
    toolbenchEl.v1SnapshotConstraintMeta,
    snapshot?.constraint || null,
    toolbenchReviewPassMessages.workspace.v1SnapshotConstraintPendingTitle(),
    toolbenchReviewPassMessages.workspace.v1SnapshotConstraintPendingCopy()
  );
  apply(
    toolbenchEl.v1SnapshotNextTitle,
    toolbenchEl.v1SnapshotNextCopy,
    toolbenchEl.v1SnapshotNextMeta,
    snapshot?.nextMove || null,
    toolbenchReviewPassMessages.workspace.v1SnapshotNextPendingTitle(),
    toolbenchReviewPassMessages.workspace.v1SnapshotNextPendingCopy()
  );
  if (toolbenchEl.v1SnapshotOutcomeTitle && toolbenchEl.v1SnapshotOutcomeCopy) {
    const outcomeCard = toolbenchEl.v1SnapshotOutcomeTitle.closest(".workspace-v1-decision-outcome");
    if (!snapshot?.outcome) {
      toolbenchEl.v1SnapshotOutcomeTitle.textContent =
        toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingTitle();
      toolbenchEl.v1SnapshotOutcomeCopy.textContent =
        toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingCopy();
      if (toolbenchEl.v1SnapshotOutcomeReason) {
        toolbenchEl.v1SnapshotOutcomeReason.textContent =
          toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingReason();
      }
      if (toolbenchEl.v1SnapshotOutcomePriority) {
        toolbenchEl.v1SnapshotOutcomePriority.textContent =
          toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingPriority();
      }
      if (toolbenchEl.v1SnapshotOutcomeHistory) {
        toolbenchEl.v1SnapshotOutcomeHistory.textContent =
          toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingHistory();
        toolbenchEl.v1SnapshotOutcomeHistory.hidden = true;
      }
      if (outcomeCard) {
        delete outcomeCard.dataset.action;
        delete outcomeCard.dataset.decisionFocusSection;
        delete outcomeCard.dataset.tone;
        delete outcomeCard.dataset.progressTone;
        delete outcomeCard.dataset.routedWork;
        outcomeCard.dataset.enabled = "false";
        outcomeCard.removeAttribute("role");
        outcomeCard.removeAttribute("title");
        outcomeCard.removeAttribute("aria-label");
        outcomeCard.removeAttribute("tabindex");
      }
      return;
    }
    toolbenchEl.v1SnapshotOutcomeTitle.textContent = snapshot.outcome.title;
    toolbenchEl.v1SnapshotOutcomeCopy.textContent = snapshot.outcome.copy;
    if (toolbenchEl.v1SnapshotOutcomeReason) {
      toolbenchEl.v1SnapshotOutcomeReason.textContent =
        routedCue && routedCue.cardKey === "outcome"
          ? `${snapshot.outcome.reason || "Outcome reasoning is available through the linked V1 decision read."} Routed now for ${toolbenchReviewPassMessages.workspace.quickPickWorkMeta({
              workType: routedCue.workType
            }).toLowerCase()}.${routedCue.reopenMemoryType === "productive" ? " Productive reopen lane." : routedCue.reopenMemoryType === "pressure" ? " Pressure reopen lane." : ""}`
          : snapshot.outcome.reason || "Outcome reasoning is available through the linked V1 decision read.";
    }
    if (toolbenchEl.v1SnapshotOutcomePriority) {
      const progress = currentDecisionOutcomeProgress(toolbenchContextDraft);
      toolbenchEl.v1SnapshotOutcomePriority.textContent =
        progress?.copy || snapshot.outcome.priority || "Priority details are available through the linked V1 decision read.";
    }
    if (toolbenchEl.v1SnapshotOutcomeHistory) {
      const history = currentDecisionOutcomeHistory(toolbenchContextDraft);
      toolbenchEl.v1SnapshotOutcomeHistory.textContent = history
        ? history.comparison && history.comparison !== "unchanged"
          ? `Compared with last state: ${history.comparison} than ${history.from}.`
          : `Last changed from ${history.from}.`
        : toolbenchReviewPassMessages.workspace.v1SnapshotOutcomePendingHistory();
      toolbenchEl.v1SnapshotOutcomeHistory.hidden = !history;
    }
    if (outcomeCard) {
      if (snapshot.outcome.tone) outcomeCard.dataset.tone = snapshot.outcome.tone;
      else delete outcomeCard.dataset.tone;
      const progress = currentDecisionOutcomeProgress(toolbenchContextDraft);
      if (progress?.tone) outcomeCard.dataset.progressTone = progress.tone;
      else delete outcomeCard.dataset.progressTone;
      const enabled = Boolean(snapshot.outcome.action);
      outcomeCard.dataset.enabled = enabled ? "true" : "false";
      if (enabled) {
        outcomeCard.dataset.action = snapshot.outcome.action;
        const focusSection = decisionFocusSectionForAction(snapshot.outcome.action);
        if (focusSection) outcomeCard.dataset.decisionFocusSection = focusSection;
        else delete outcomeCard.dataset.decisionFocusSection;
        outcomeCard.setAttribute("role", "button");
        outcomeCard.title = "Click to follow this decision outcome in the V1 editor.";
        outcomeCard.setAttribute("aria-label", outcomeCard.title);
        outcomeCard.setAttribute("tabindex", "0");
      } else {
        delete outcomeCard.dataset.action;
        delete outcomeCard.dataset.decisionFocusSection;
        outcomeCard.removeAttribute("role");
        outcomeCard.removeAttribute("title");
        outcomeCard.removeAttribute("aria-label");
        outcomeCard.removeAttribute("tabindex");
      }
      if (routedCue && routedCue.cardKey === "outcome") outcomeCard.dataset.routedWork = "true";
      else delete outcomeCard.dataset.routedWork;
    }
  }
}

function renderV1ContextLayer(record) {
  if (!toolbenchEl.v1ContextSummary) return;
  const context = contextRecordForRecord(record);
  if (!context) {
    if (toolbenchEl.v1ContextPack) toolbenchEl.v1ContextPack.dataset.level = "pending";
    toolbenchEl.v1ContextSummary.textContent = toolbenchReviewPassMessages.v1Context.pendingSummary({
      title: record.title
    });
    delete toolbenchEl.v1ContextSummary.dataset.tone;
    toolbenchEl.v1ContextSummary.removeAttribute("title");
    toolbenchEl.v1ContextSummary.removeAttribute("aria-label");
    setV1ContextSummaryAction(toolbenchEl.v1ContextSummary, { enabled: false });
    toolbenchV1CommercialWhyOpen = false;
    toolbenchV1CommercialWhyItems = [];
    renderV1CommercialWhy([], "");
    renderV1ContextMeta(null);
    renderV1DecisionSnapshot(null);
    toolbenchEl.v1SignalTitle.textContent = toolbenchReviewPassMessages.v1Context.noInternalSample();
    toolbenchEl.v1SignalCopy.textContent = toolbenchReviewPassMessages.v1Context.noInternalSampleCopy();
    setV1ReadCardTone(toolbenchEl.v1SignalTitle, "");
    setV1ReadCardAction(toolbenchEl.v1SignalTitle, { enabled: false });
    toolbenchEl.v1ValueGapTitle.textContent = toolbenchReviewPassMessages.v1Context.pendingTitle();
    toolbenchEl.v1ValueGapCopy.textContent = toolbenchReviewPassMessages.v1Context.valueGapPending();
    setV1ReadCardTone(toolbenchEl.v1ValueGapTitle, "");
    setV1ReadCardAction(toolbenchEl.v1ValueGapTitle, { enabled: false });
    toolbenchEl.v1SurroundingTitle.textContent = toolbenchReviewPassMessages.v1Context.pendingTitle();
    toolbenchEl.v1SurroundingCopy.textContent = toolbenchReviewPassMessages.v1Context.surroundingPending();
    toolbenchEl.v1FitTitle.textContent = toolbenchReviewPassMessages.v1Context.pendingTitle();
    toolbenchEl.v1FitCopy.textContent = toolbenchReviewPassMessages.v1Context.fitPending();
    setV1ReadCardTone(toolbenchEl.v1SurroundingTitle, "");
    setV1ReadCardTone(toolbenchEl.v1FitTitle, "");
    setV1ReadCardAction(toolbenchEl.v1SurroundingTitle, { enabled: false });
    setV1ReadCardAction(toolbenchEl.v1FitTitle, { enabled: false });
    toolbenchEl.v1DecisionTitle.textContent = toolbenchReviewPassMessages.v1Context.decisionNotePending();
    toolbenchEl.v1DecisionCopy.textContent = toolbenchReviewPassMessages.v1Context.decisionNotePendingCopy();
    setV1ReadCardTone(toolbenchEl.v1DecisionTitle, "");
    setV1ReadCardAction(toolbenchEl.v1DecisionTitle, { enabled: false });
    setListContent(toolbenchEl.v1Watchouts, [], toolbenchReviewPassMessages.v1Context.watchoutsMissing());
    toolbenchEl.v1OperatorsTitle.textContent = toolbenchReviewPassMessages.v1Context.operatorSummaryPendingTitle();
    toolbenchEl.v1OperatorsCopy.textContent = toolbenchReviewPassMessages.v1Context.operatorSummaryMissing();
    toolbenchEl.v1CompetitionTitle.textContent = toolbenchReviewPassMessages.v1Context.competitionPendingTitle();
    toolbenchEl.v1CompetitionCopy.textContent = toolbenchReviewPassMessages.v1Context.competitionPending();
    setV1ReadCardTone(toolbenchEl.v1OperatorsTitle, "");
    setV1ReadCardTone(toolbenchEl.v1CompetitionTitle, "");
    setV1ReadCardAction(toolbenchEl.v1OperatorsTitle, { enabled: false });
    setV1ReadCardAction(toolbenchEl.v1CompetitionTitle, { enabled: false });
    toolbenchEl.v1GoodFitTitle.textContent = toolbenchReviewPassMessages.v1Context.fitPendingTitle();
    toolbenchEl.v1GoodFitCopy.textContent = toolbenchReviewPassMessages.v1Context.fitMissing();
    toolbenchEl.v1CautionTitle.textContent = toolbenchReviewPassMessages.v1Context.cautionPendingTitle();
    toolbenchEl.v1CautionCopy.textContent = toolbenchReviewPassMessages.v1Context.cautionPending();
    setV1ReadCardTone(toolbenchEl.v1GoodFitTitle, "");
    setV1ReadCardTone(toolbenchEl.v1CautionTitle, "");
    setV1ReadCardAction(toolbenchEl.v1GoodFitTitle, { enabled: false });
    setV1ReadCardAction(toolbenchEl.v1CautionTitle, { enabled: false });
    renderV1Health(null);
    setV1EditorState(null);
    return;
  }

  const rentSignal = context.rentSignal || {};
  const valueGap = context.valueGapSignal || {};
  const surrounding = context.surroundingBusinesses || {};
  const fitScores = Array.isArray(context.unitSuitability?.fitScores) ? context.unitSuitability.fitScores : [];
  const decisionNotes = context.decisionNotes || {};
  const topFit = [...fitScores].sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;
  const weakFit = [...fitScores].sort((a, b) => (a.score || 0) - (b.score || 0))[0] || null;
  const topCategory = Array.isArray(surrounding.categoryMix)
    ? [...surrounding.categoryMix].sort((a, b) => (b.share || 0) - (a.share || 0))[0]
    : null;
  const operatorEntries = Array.isArray(surrounding.notableOperators)
    ? surrounding.notableOperators.filter((item) => item?.name)
    : [];
  const operatorNames = operatorEntries.map((item) => item.name).filter(Boolean);
  const competitionFlags = Array.isArray(surrounding.competitionFlags)
    ? surrounding.competitionFlags.map(signalLabel)
    : [];
  const complementaryFlags = Array.isArray(surrounding.complementaryFlags)
    ? surrounding.complementaryFlags.map(signalLabel)
    : [];
  const goodFits = fitScores
    .filter((item) => item.verdict === "strong_fit" || item.verdict === "conditional_fit")
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 2)
    .map((item) => `${fitLabel(item.useCase)} (${item.score || 0}, ${item.verdict.replace(/_/g, " ")})`);
  const fitLeaders = summarizeFitLeaders(fitScores, 3);
  const categorySummary = summarizeCategoryMix(surrounding.categoryMix, 3);
  const tradeCluster = summarizeTradeCluster(surrounding.categoryMix);
  const daypartSummary = summarizeDayparts(surrounding.daypartSignals, 2);
  const operatorSummary = summarizeOperatorRead(operatorEntries, 3);
  const tradePressure = summarizeTradePressure(competitionFlags, complementaryFlags);
  const fitStrength = summarizeFitStrength(topFit, fitScores);
  const rentSignalRead = summarizeRentSignalRead(rentSignal);
  const valueGapRead = summarizeValueGapRead(valueGap, rentSignal);
  const commercialReadTone = summarizeCommercialReadTone(rentSignalRead, valueGapRead, fitStrength);
  const commercialReadWhy = summarizeCommercialReadWhy(rentSignalRead, valueGapRead, fitStrength, tradePressure);
  const commercialReadAction = summarizeCommercialReadAction({
    commercialReadTone,
    rentSignalRead,
    valueGapRead,
    fitStrength,
    tradePressure
  });
  const cautionItems = [
    ...(Array.isArray(valueGap.cautionFlags) ? valueGap.cautionFlags.map(signalLabel) : []),
    ...(Array.isArray(decisionNotes.watchouts) ? decisionNotes.watchouts.map(signalLabel) : []),
    ...(Array.isArray(context.unitSuitability?.globalConstraints)
      ? context.unitSuitability.globalConstraints.map(signalLabel)
      : [])
  ].filter(Boolean);

  if (toolbenchEl.v1ContextPack) {
    toolbenchEl.v1ContextPack.dataset.level = String(rentSignal.verdict || "sample").toLowerCase();
    toolbenchEl.v1ContextPack.dataset.commercialTone = commercialReadTone;
  }
  const healthSummary = summarizeV1Health(context);
  const decisionSnapshot = summarizeCommercialSnapshot({
    context,
    rentSignalRead,
    valueGapRead,
    fitStrength,
    tradePressure,
    healthSummary,
    decisionNotes
  });
  toolbenchEl.v1SignalTitle.textContent = `${rentSignalRead.title}${rentSignal.confidence ? ` • ${rentSignal.confidence} confidence` : ""}`;
  toolbenchEl.v1SignalCopy.textContent =
    [
      rentSignalRead.copy ? `Signal read: ${rentSignalRead.copy}.` : "",
      `Benchmark ${moneyRange({ low: rentSignal.benchmarkLowPsf, high: rentSignal.benchmarkHighPsf })}, asking ${money(rentSignal.askingPsf)}, gap ${rentSignal.gapPercent > 0 ? "+" : ""}${rentSignal.gapPercent || 0}%.`
    ]
      .filter(Boolean)
      .join(" ");
  setV1ReadCardTone(
    toolbenchEl.v1SignalTitle,
    rentSignalRead.title === "Above range" ? "caution" : rentSignalRead.title === "In range" ? "strong" : rentSignalRead.title === "Below range" ? "watch" : ""
  );
  setV1ReadCardAction(toolbenchEl.v1SignalTitle, {
    action: "rent-signal",
    enabled: Boolean(
      rentSignal.verdict ||
      rentSignal.confidence ||
      Number.isFinite(rentSignal.benchmarkLowPsf) ||
      Number.isFinite(rentSignal.benchmarkHighPsf) ||
      Number.isFinite(rentSignal.askingPsf)
    ),
    title: `Click to jump to the rent-signal verdict and benchmark fields for ${context.subjectRef || record.title}.`
  });
  toolbenchEl.v1ValueGapTitle.textContent = `${valueGapRead.title}${valueGap.score !== null && valueGap.score !== undefined && valueGap.score !== "" ? ` • score ${valueGap.score}` : ""}`;
  toolbenchEl.v1ValueGapCopy.textContent =
    [
      valueGapRead.copy ? `Pricing read: ${valueGapRead.copy}.` : "",
      valueGap.summary,
      valueGap.gapDirection ? `Direction: ${signalLabel(valueGap.gapDirection)}.` : "",
      Array.isArray(valueGap.likelyDrivers) && valueGap.likelyDrivers.length
        ? `Drivers: ${valueGap.likelyDrivers.map(signalLabel).slice(0, 2).join(" • ")}.`
        : ""
    ]
      .filter(Boolean)
      .join(" ");
  setV1ReadCardTone(
    toolbenchEl.v1ValueGapTitle,
    valueGapRead.title === "Stretched ask" ? "caution" : valueGapRead.title === "Fairly priced" ? "strong" : valueGapRead.title === "Negotiable" ? "watch" : "watch"
  );
  setV1ReadCardAction(toolbenchEl.v1ValueGapTitle, {
    action: "value-gap-summary",
    enabled: Boolean(valueGap.summary || valueGap.status || valueGap.gapDirection || (Array.isArray(valueGap.likelyDrivers) && valueGap.likelyDrivers.length)),
    title: `Click to jump to the value-gap summary and scoring fields for ${context.subjectRef || record.title}.`
  });
  toolbenchEl.v1SurroundingTitle.textContent = topCategory
    ? `${tradePressure.title} • ${tradeCluster || categoryLabel(topCategory.category)}`
    : toolbenchReviewPassMessages.v1Context.tradePatternPendingTitle();
  toolbenchEl.v1SurroundingCopy.textContent =
    [
      tradePressure.copy ? `Market read: ${tradePressure.copy}.` : "",
      Number.isFinite(surrounding.businessCount) ? `${surrounding.businessCount} businesses mapped nearby.` : "",
      surrounding.tradePattern,
      categorySummary.length ? `Mix: ${categorySummary.join(" • ")}.` : "",
      daypartSummary ? `Dayparts: ${daypartSummary}.` : ""
    ]
      .filter(Boolean)
      .join(" ") || toolbenchReviewPassMessages.v1Context.tradePatternMissing();
  setV1ReadCardTone(
    toolbenchEl.v1SurroundingTitle,
    tradePressure.title === "High pressure" || tradePressure.title === "Pressure-led"
      ? "caution"
      : tradePressure.title === "Support-led"
        ? "strong"
        : tradePressure.title === "Balanced"
          ? "watch"
          : ""
  );
  setV1ReadCardAction(toolbenchEl.v1SurroundingTitle, {
    action: "surrounding-trade",
    enabled: Boolean(
      surrounding.tradePattern ||
      categorySummary.length ||
      daypartSummary ||
      operatorNames.length
    ),
    title: `Click to jump to the surrounding-trade summary and mix fields for ${context.subjectRef || record.title}.`
  });
  toolbenchEl.v1FitTitle.textContent = topFit
    ? `${fitStrength.title} • ${fitLabel(topFit.useCase)} ${topFit.score || 0}`
    : toolbenchReviewPassMessages.v1Context.fitSummaryPendingTitle();
  toolbenchEl.v1FitCopy.textContent =
    [
      fitStrength.copy ? `Fit read: ${fitStrength.copy}.` : "",
      topFit?.rationale || "",
      fitLeaders.length > 1 ? `Next strongest: ${fitLeaders.slice(1).join(" • ")}.` : "",
      weakFit ? `Weakest read: ${fitLabel(weakFit.useCase)} ${weakFit.score || 0}.` : ""
    ]
      .filter(Boolean)
      .join(" ") || toolbenchReviewPassMessages.v1Context.fitRationaleMissing();
  setV1ReadCardTone(
    toolbenchEl.v1FitTitle,
    fitStrength.title === "Strong fit" ? "strong" : fitStrength.title === "Fragile fit" ? "caution" : fitStrength.title === "Workable fit" ? "watch" : ""
  );
  toolbenchEl.v1ContextSummary.textContent = summarizeCommercialRead(
    context.subjectRef || record.title,
    rentSignalRead,
    valueGapRead,
    fitStrength
  );
  toolbenchEl.v1ContextSummary.dataset.tone = commercialReadTone;
  toolbenchEl.v1ContextSummary.title = summarizeCommercialReadHint(
    commercialReadTone,
    rentSignalRead,
    valueGapRead,
    fitStrength
  );
  toolbenchEl.v1ContextSummary.setAttribute("aria-label", toolbenchEl.v1ContextSummary.title);
  setV1ContextSummaryAction(toolbenchEl.v1ContextSummary, {
    action: commercialReadAction.action,
    enabled: Boolean(commercialReadAction.action),
    title: commercialReadAction.title
  });
  renderV1CommercialWhy(commercialReadWhy, commercialReadTone);
  renderV1ContextMeta(context);
  renderV1DecisionSnapshot(decisionSnapshot);
  setV1ReadCardAction(toolbenchEl.v1FitTitle, {
    action: "best-fit-summary",
    enabled: fitScores.length > 0,
    title: fitScores.length
      ? `Click to jump to the suitability scoring fields for ${context.subjectRef || record.title}.`
      : ""
  });
  toolbenchEl.v1DecisionTitle.textContent = decisionNotes.summary || toolbenchReviewPassMessages.v1Context.decisionTitlePending();
  toolbenchEl.v1DecisionCopy.textContent =
    decisionNotes.negotiationAngle || toolbenchReviewPassMessages.v1Context.negotiationAngleMissing();
  setV1ReadCardAction(toolbenchEl.v1DecisionTitle, {
    action: "decision-note",
    enabled: Boolean(decisionNotes.summary || decisionNotes.negotiationAngle || (Array.isArray(decisionNotes.watchouts) && decisionNotes.watchouts.length)),
    title: `Click to jump to the V1 decision note and negotiation-angle fields for ${context.subjectRef || record.title}.`
  });
  setListContent(toolbenchEl.v1Watchouts, cautionItems.slice(0, 4), toolbenchReviewPassMessages.v1Context.watchoutsLinkedMissing());
  toolbenchEl.v1OperatorsTitle.textContent = operatorNames.length
    ? `${operatorNames.length} nearby operators`
    : toolbenchReviewPassMessages.v1Context.notableOperatorsMissingTitle();
  toolbenchEl.v1OperatorsCopy.textContent = operatorNames.length
    ? `Within ${surrounding.walkTimeMinutes || "?"} minutes: ${operatorSummary.join(" | ")}.`
    : toolbenchReviewPassMessages.v1Context.notableOperatorsMissing();
  setV1ReadCardTone(toolbenchEl.v1OperatorsTitle, operatorNames.length ? "watch" : "");
  setV1ReadCardAction(toolbenchEl.v1OperatorsTitle, {
    action: "operators-summary",
    enabled: operatorNames.length > 0,
    title: operatorNames.length
      ? `Click to jump to the nearby-operator trade context for ${context.subjectRef || record.title}.`
      : ""
  });
  toolbenchEl.v1CompetitionTitle.textContent = competitionFlags.length
    ? `${tradePressure.title} • ${competitionFlags.length} pressure flag${competitionFlags.length > 1 ? "s" : ""}`
    : complementaryFlags.length
      ? `${tradePressure.title} • supportive trade`
      : toolbenchReviewPassMessages.v1Context.competitionNotFlagged();
  toolbenchEl.v1CompetitionCopy.textContent = [
    competitionFlags.length ? `Pressure: ${competitionFlags.slice(0, 2).join(" • ")}.` : "",
    complementaryFlags.length ? `Support: ${complementaryFlags.slice(0, 2).join(" • ")}.` : ""
  ].filter(Boolean).join(" ") || toolbenchReviewPassMessages.v1Context.competitionFlagsMissing();
  setV1ReadCardTone(
    toolbenchEl.v1CompetitionTitle,
    tradePressure.title === "High pressure" || tradePressure.title === "Pressure-led"
      ? "caution"
      : tradePressure.title === "Support-led"
        ? "strong"
        : competitionFlags.length || complementaryFlags.length
          ? "watch"
          : ""
  );
  setV1ReadCardAction(toolbenchEl.v1CompetitionTitle, {
    action: "competition-read",
    enabled: competitionFlags.length > 0 || complementaryFlags.length > 0,
    title: competitionFlags.length || complementaryFlags.length
      ? `Click to jump to the competition and complementary-trade signals for ${context.subjectRef || record.title}.`
      : ""
  });
  toolbenchEl.v1GoodFitTitle.textContent = goodFits.length
    ? `${goodFits.length} workable use case${goodFits.length > 1 ? "s" : ""}`
    : toolbenchReviewPassMessages.v1Context.fitTagsMissing();
  toolbenchEl.v1GoodFitCopy.textContent = [
    goodFits.length ? goodFits.join(" • ") : "",
    topFit?.approvalRisk ? `Top approval risk: ${signalLabel(topFit.approvalRisk)}.` : ""
  ].filter(Boolean).join(" ") || toolbenchReviewPassMessages.v1Context.fitUseCasesMissing();
  setV1ReadCardTone(
    toolbenchEl.v1GoodFitTitle,
    fitStrength.title === "Strong fit" ? "strong" : fitStrength.title === "Workable fit" ? "watch" : ""
  );
  setV1ReadCardAction(toolbenchEl.v1GoodFitTitle, {
    action: "good-fit",
    enabled: Boolean(topFit),
    title: topFit
      ? `Click to jump to the strongest-fit suitability notes for ${fitLabel(topFit.useCase)}.`
      : ""
  });
  toolbenchEl.v1CautionTitle.textContent = weakFit ? `${fitLabel(weakFit.useCase)} • ${weakFit.score || 0} (${fitVerdictLabel(weakFit.verdict)})` : toolbenchReviewPassMessages.v1Context.weakFitMissing();
  toolbenchEl.v1CautionCopy.textContent =
    [
      weakFit?.approvalRisk ? `Approval risk: ${signalLabel(weakFit.approvalRisk)}.` : "",
      Array.isArray(weakFit?.watchouts) && weakFit.watchouts.length ? weakFit.watchouts.join(" • ") : "",
      cautionItems.slice(0, 2).join(" • ")
    ].filter(Boolean).join(" ") ||
    toolbenchReviewPassMessages.v1Context.weakFitCautionMissing();
  setV1ReadCardTone(toolbenchEl.v1CautionTitle, weakFit ? "caution" : "");
  setV1ReadCardAction(toolbenchEl.v1CautionTitle, {
    action: "caution-fit",
    enabled: Boolean(weakFit),
    title: weakFit
      ? `Click to jump to the weak-fit and approval-caution notes for ${fitLabel(weakFit.useCase)}.`
      : ""
  });
  renderV1Health(context);
  setV1EditorState(context);
}

function reportSaveMetadata(record, pack = reportDecisionPack()) {
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const sourceTrust = sourceTrustProfile(record);
  const target = pack.calculator?.targetPsf || record?.fairRange?.high || record?.official || 0;
  const offer = pack.offer?.offerPsf || record?.fairRange?.low || record?.official || 0;
  return {
    confidence: confidence.title,
    benchmarkTrust: sourceTrust.title,
    sourceTrust,
    officialLayer: trust.officialLayer,
    askingLayer: trust.askingLayer,
    trustNote: trust.trustNote,
    targetPsf: target,
    offerPsf: offer,
    walkAwayPsf: pack.offer?.walkAwayPsf || record?.fairRange?.high || record?.official || 0,
    noteStatus: toolbenchEl.note?.value
      ? toolbenchReviewPassMessages.workspace.noteLabelReady()
      : toolbenchReviewPassMessages.workspace.noteLabelDraft(),
    evidenceRows: pack.evidence?.rowCount || 0,
    latestPeriod: pack.evidence?.latestPeriod || "",
    pulseSummary: pack.pulse || pulseSummaryForRecord(record)
  };
}

function renderSaveState(report = savedReportForRecord(toolbenchRecord?.id)) {
  if (!toolbenchEl.saveStateMetric || !toolbenchRecord) return;
  const pack = report?.decisionPack || reportDecisionPack();
  const metadata = report?.saveMetadata || reportSaveMetadata(toolbenchRecord, pack);
  toolbenchEl.saveStateMetric.textContent = report?.savedAt
    ? toolbenchReviewPassMessages.workspace.saveStateSaved({
        savedAt: new Date(report.savedAt).toLocaleDateString("en-SG", { day: "numeric", month: "short" })
      })
    : toolbenchReviewPassMessages.workspace.saveStateNotSaved();
  toolbenchEl.saveConfidenceMetric.textContent = metadata.benchmarkTrust || metadata.confidence || toolbenchRecord.confidence;
  toolbenchEl.saveTargetMetric.textContent = metadata.targetPsf ? money(Number(metadata.targetPsf)) : "-";
  toolbenchEl.saveOfferMetric.textContent = metadata.offerPsf ? money(Number(metadata.offerPsf)) : "-";
  toolbenchEl.saveNoteMetric.textContent = metadata.noteStatus || (
    toolbenchEl.note?.value
      ? toolbenchReviewPassMessages.workspace.noteLabelReady()
      : toolbenchReviewPassMessages.workspace.noteLabelDraft()
  );
}

function findRecord(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return toolbenchRecord || toolbenchRecords[0];
  if (!coverageEligibilityProfile(normalized).eligible) return null;

  const exact = toolbenchRecords.find((record) =>
    record.id === normalized || record.aliases.some((alias) => normalized.includes(alias))
  );
  if (exact) return exact;

  const scored = toolbenchRecords
    .map((record) => {
      const tokens = [record.title, record.area, record.propertyType, ...record.aliases]
        .join(" ")
        .toLowerCase()
        .split(/\s+/);
      const score = normalized.split(/\s+/).filter((word) => tokens.includes(word)).length;
      return { record, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score >= 2) return scored[0].record;
  const comparable = createToolbenchComparableRecord(normalized);
  if (!comparable) return null;
  const existing = toolbenchRecords.find((record) => record.id === comparable.id);
  if (!existing) toolbenchRecords.push(comparable);
  return existing || comparable;
}

function previewHandoffRecord() {
  const record = loadStoredJson(toolbenchPreviewRecordKey, null);
  return record?.id && record?.title && Array.isArray(record?.series) ? record : null;
}

function mergePreviewHandoffRecord(records) {
  const preview = previewHandoffRecord();
  if (!preview) return records;
  const merged = new Map(records.map((record) => [record.id, record]));
  merged.set(preview.id, preview);
  return [...merged.values()];
}

function initialRecord() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("rent");
  return findRecord(requested) || toolbenchRecords[0] || null;
}

function reportStorageKey(report, email = toolbenchSession?.email) {
  return `${normalizeEmail(report?.memberEmail || email)}:${report?.recordId || ""}`;
}

function normalizeBackendReport(report, email = toolbenchSession?.email) {
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

function savedReportStore() {
  const merged = new Map();
  loadStoredJson(savedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  loadStoredJson(backendSavedReportsKey, []).forEach((report) => {
    merged.set(reportStorageKey(report), normalizeBackendReport(report));
  });
  return [...merged.values()];
}

function writeSavedReportStore(reports) {
  const normalized = reports.map((report) => normalizeBackendReport(report));
  writeStoredJson(savedReportsKey, normalized);
  writeStoredJson(backendSavedReportsKey, normalized);
}

function currentMemberReports() {
  const email = normalizeEmail(toolbenchSession?.email);
  return savedReportStore().filter((report) => {
    if (!report.memberEmail) return true;
    return normalizeEmail(report.memberEmail) === email;
  });
}

function savedReportForRecord(recordId) {
  return currentMemberReports().find((report) => report.recordId === recordId) || null;
}

function savedReportByIdOrRecord(value) {
  if (!value) return null;
  return currentMemberReports().find((report) =>
    report.reportId === value ||
    report.recordId === value ||
    `${normalizeEmail(report.memberEmail)}:${report.recordId}` === value
  ) || null;
}

function initialSavedReport() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("report");
  return requested ? savedReportByIdOrRecord(requested) : null;
}

function watchlistRecords() {
  return loadStoredJson(watchlistKey, []);
}

function currentAlertRules() {
  const email = normalizeEmail(toolbenchSession?.email);
  return loadStoredJson(alertRulesKey, []).filter((rule) => {
    if (!rule.memberEmail) return true;
    return normalizeEmail(rule.memberEmail) === email;
  });
}

function alertRuleForRecord(recordId) {
  return currentAlertRules().find((rule) => rule.recordId === recordId) || null;
}

function filteredSeries() {
  if (!toolbenchRecord) return [];
  if (toolbenchRange === "all") return toolbenchRecord.series;
  return toolbenchRecord.series.slice(toolbenchRange === "3" ? -6 : -10);
}

function evidenceRows() {
  return filteredSeries().map((point) => {
    const official = Number(point[1]);
    const asking = Number(point[2]);
    const spread = Math.round(((asking - official) / official) * 100);
    return {
      period: point[0],
      official,
      asking,
      spread,
      signal: spread >= 20
        ? toolbenchReviewPassMessages.workspace.evidenceSignalHigh()
        : spread >= 10
          ? toolbenchReviewPassMessages.workspace.evidenceSignalWatch()
          : toolbenchReviewPassMessages.workspace.evidenceSignalFair()
    };
  });
}

function setupCanvas(canvas) {
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  if (!canvas.dataset.baseWidth) {
    canvas.dataset.baseWidth = String(canvas.width);
    canvas.dataset.baseHeight = String(canvas.height);
  }
  const cssWidth = Number(canvas.dataset.baseWidth);
  const cssHeight = Number(canvas.dataset.baseHeight);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.width = cssWidth * ratio;
  canvas.height = cssHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: cssWidth, height: cssHeight };
}

function drawMemberChart() {
  if (!toolbenchRecord) return;
  const { context, width, height } = setupCanvas(toolbenchEl.chart);
  const series = filteredSeries();
  const values = series.flatMap((point) => [point[1], point[2]]);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const pad = { top: 38, right: 28, bottom: 58, left: 64 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  context.clearRect(0, 0, width, height);
  context.fillStyle = toolbenchColors.bg;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = toolbenchColors.grid;
  context.lineWidth = 1;
  context.fillStyle = toolbenchColors.muted;
  context.font = "12px Inter, system-ui, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (chartH / 4) * i;
    const value = max - ((max - min) / 4) * i;
    context.beginPath();
    context.moveTo(pad.left, y);
    context.lineTo(width - pad.right, y);
    context.stroke();
    context.fillText(`S$${value.toFixed(0)}`, 16, y + 4);
  }

  const xFor = (index) => pad.left + (chartW / Math.max(series.length - 1, 1)) * index;
  const yFor = (value) => pad.top + chartH - ((value - min) / (max - min)) * chartH;

  function line(index, stroke, label) {
    context.strokeStyle = stroke;
    context.lineWidth = 3;
    context.beginPath();
    series.forEach((point, i) => {
      const x = xFor(i);
      const y = yFor(point[index]);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();

    context.fillStyle = stroke;
    series.forEach((point, i) => {
      context.beginPath();
      context.arc(xFor(i), yFor(point[index]), 4, 0, Math.PI * 2);
      context.fill();
    });

    const last = series[series.length - 1];
    context.font = "13px Inter, system-ui, sans-serif";
    context.fillText(label, xFor(series.length - 1) - 112, yFor(last[index]) - 12);
  }

  line(1, toolbenchColors.official, toolbenchReviewPassMessages.workspace.chartLabelOfficialMedian());
  line(2, toolbenchColors.asking, toolbenchReviewPassMessages.workspace.chartLabelAskingMedian());

  context.fillStyle = toolbenchColors.muted;
  context.font = "12px Inter, system-ui, sans-serif";
  series.forEach((point, i) => {
    context.fillText(point[0].replace("20", "'"), xFor(i) - 18, height - 24);
  });

  context.fillStyle = toolbenchColors.ink;
  context.font = "700 14px Inter, system-ui, sans-serif";
  context.fillText(toolbenchReviewPassMessages.workspace.chartAxisRent(), pad.left, 23);
}

function generateNote(record) {
  if (!record) return toolbenchReviewPassMessages.workspace.noteEmpty();
  const confidence = confidenceProfile(record);
  const trust = benchmarkTrust(record);
  const pulse = pulseSummaryForRecord(record);
  return [
    `RentIntel negotiation note: ${record.title}`,
    `Workspace session: ${toolbenchSession?.email || toolbenchReviewPassMessages.workspace.noteSessionFallback()}`,
    `Generated: ${new Date().toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingSummary(),
    `${record.decision} ${record.mobileSummary}`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingPulse(),
    `${pulse.label}: ${pulse.title}`,
    `Decision: ${pulse.summary}`,
    `Next: ${pulse.nextStep}`,
    pulse.caveat,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingEvidence(),
    toolbenchReviewPassMessages.workspace.noteMetricOfficialMedian({
      value: money(record.official)
    }),
    toolbenchReviewPassMessages.workspace.noteMetricCurrentAsking({
      value: money(record.asking)
    }),
    `Fair range: ${moneyRange(record.fairRange)}`,
    `Gap: ${record.gap > 0 ? "+" : ""}${record.gap}%`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingConfidence(),
    `${confidence.title}: ${confidence.copy}`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingWhy(),
    ...signalDrivers(record).map((driver) => `- ${driver}`),
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingTrust(),
    `${trust.officialLayer}; ${trust.askingLayer}. ${trust.trustNote}`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingOffer(),
    record.action,
    `Start discussion near ${money(record.fairRange?.low || record.official)} if unit quality is standard.`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingWalkAway(),
    `Treat ${money(record.fairRange?.high || record.official)} as the upper defence unless premium frontage, permitted use, or fit-out value is clearly proven.`,
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingLandlord(),
    toolbenchReviewPassMessages.workspace.noteLandlordPointEvidence(),
    toolbenchReviewPassMessages.workspace.noteLandlordPointSeparate(),
    toolbenchReviewPassMessages.workspace.noteLandlordPointRentFree(),
    "",
    toolbenchReviewPassMessages.workspace.noteHeadingSourceSplit(),
    record.sourceSummary,
    "",
    toolbenchReviewPassMessages.workspace.noteFinalCaveat()
  ].join("\n");
}

function renderAccess() {
  const access = hasToolbenchAccess();
  const state = toolbenchAccessState();
  const embedSafe = shouldUseToolbenchEmbedSafeMode();
  const filePreview = inStaticWorkspacePreview();
  const handoffUrl = toolbenchHttpWorkspaceHandoffUrl();
  toolbenchEl.accessCard.dataset.access = state.key;
  toolbenchEl.chartCard.dataset.access = "active";
  toolbenchEl.evidencePanel.dataset.access = "active";
  toolbenchEl.calculatorPanel.dataset.access = "active";
  toolbenchEl.alertRulePanel.dataset.access = "active";
  toolbenchEl.accessLabel.textContent = state.label;
  toolbenchEl.accessTitle.textContent = state.title;
  toolbenchEl.accessCopy.textContent = state.copy;
  if (toolbenchEl.renderMode) {
    toolbenchEl.renderMode.hidden = false;
    toolbenchEl.renderMode.dataset.mode = embedSafe ? "embed-safe" : "standard";
    toolbenchEl.renderMode.textContent = toolbenchRenderModeCopy();
  }
  if (toolbenchEl.workspaceHandoffNotice) {
    toolbenchEl.workspaceHandoffNotice.hidden = !filePreview;
  }
  if (toolbenchEl.workspaceHandoffActions) {
    toolbenchEl.workspaceHandoffActions.hidden = !filePreview;
  }
  if (toolbenchEl.workspaceHandoffTarget) {
    toolbenchEl.workspaceHandoffTarget.hidden = !filePreview;
    toolbenchEl.workspaceHandoffTarget.textContent = `Local workspace target: ${handoffUrl}`;
  }
  if (toolbenchEl.openFullWorkspace) {
    toolbenchEl.openFullWorkspace.hidden = !filePreview;
    toolbenchEl.openFullWorkspace.disabled = !filePreview;
    toolbenchEl.openFullWorkspace.title = filePreview
      ? `Open full local workspace: ${handoffUrl}`
      : "Full local workspace handoff is only needed in file preview mode.";
    toolbenchEl.openFullWorkspace.setAttribute(
      "aria-label",
      filePreview
        ? `Open full local workspace at ${handoffUrl}`
        : "Full local workspace handoff is only needed in file preview mode."
    );
  }
  if (toolbenchEl.renderModeActions) {
    const modeOverride = toolbenchRenderModeOverride();
    toolbenchEl.renderModeActions.hidden = false;
    toolbenchEl.renderModeAuto.dataset.active = String(modeOverride === "auto");
    toolbenchEl.renderModeStandard.dataset.active = String(modeOverride === "standard");
    toolbenchEl.renderModeSafe.dataset.active = String(modeOverride === "embed-safe");
  }
  renderToolbenchDiagnostics();
  toolbenchEl.accountLink.textContent = toolbenchReviewPassMessages.workspace.openSavedTools();
  toolbenchEl.chartKicker.textContent = state.chart;
  toolbenchEl.saveButton.disabled = false;
  toolbenchEl.watchButton.disabled = false;
  toolbenchEl.exportButton.disabled = false;
  toolbenchEl.exportEvidenceButton.disabled = false;
  [
    toolbenchEl.calculatorUnitSize,
    toolbenchEl.calculatorAskingPsf,
    toolbenchEl.calculatorTargetPsf,
    toolbenchEl.useFairHighButton,
    toolbenchEl.useOfficialButton,
    toolbenchEl.offerPsfInput,
    toolbenchEl.walkAwayPsfInput,
    toolbenchEl.leaseMonthsInput,
    toolbenchEl.rentFreeMonthsInput,
    toolbenchEl.useFairLowOfferButton,
    toolbenchEl.useFairHighWalkButton,
    toolbenchEl.appendOfferNoteButton,
    toolbenchEl.alertTriggerSelect,
    toolbenchEl.alertTargetPsfInput,
    toolbenchEl.alertGapLimitInput,
    toolbenchEl.alertCadenceSelect,
    toolbenchEl.useWalkAwayAlertButton,
    toolbenchEl.useAskingGapAlertButton,
    toolbenchEl.appendAlertRuleNoteButton,
    toolbenchEl.calculatorForm.querySelector("button")
  ].forEach((control) => {
    control.disabled = false;
  });
  toolbenchEl.offerBuilderForm.querySelector("button").disabled = false;
  toolbenchEl.alertRuleForm.querySelector("button").disabled = false;
  toolbenchEl.copyNoteButton.disabled = false;
  toolbenchEl.downloadNoteButton.disabled = false;
  renderDecisionSpine(toolbenchRecord);
}

function renderEvidenceTable() {
  if (!toolbenchRecord || !toolbenchEl.evidenceTableBody) return;
  const rows = evidenceRows();
  const latest = rows[rows.length - 1];
  const access = hasToolbenchAccess();
  const trust = benchmarkTrust(toolbenchRecord);
  const confidence = confidenceProfile(toolbenchRecord);
  const sourceTrust = sourceTrustProfile(toolbenchRecord);
  const qa = sourceQaProfile(toolbenchRecord);
  const source = toolbenchRecord.askingSource || {};
  const productionReady = qa.ready || sourceTrust.level === "released" || sourceTrust.title === "Production Verified";
  const stateFor = (ready, review = false) => ready ? "ready" : review ? "review" : "pending";

  toolbenchEl.evidenceSummary.textContent = toolbenchReviewPassMessages.workspace.evidenceSummary({
    title: toolbenchRecord.title,
    count: rows.length
  });
  if (toolbenchEl.evidenceSourceStateMetric) {
    toolbenchEl.evidenceSourceStateItem.dataset.state = stateFor(Number(qa.checks) > 0, true);
    toolbenchEl.evidenceSourceStateMetric.textContent = qa.status;
    toolbenchEl.evidenceSourceStateCopy.textContent = Number(qa.checks) > 0
      ? toolbenchReviewPassMessages.workspace.evidenceSourceChecks({ count: qa.checks })
      : toolbenchReviewPassMessages.workspace.evidenceSourceMissing();
    toolbenchEl.evidenceBenchmarkTrustItem.dataset.state = stateFor(sourceTrust.level === "production" || sourceTrust.level === "released" || sourceTrust.title.includes("Verified"), true);
    toolbenchEl.evidenceBenchmarkTrustMetric.textContent = sourceTrust.title;
    toolbenchEl.evidenceBenchmarkTrustCopy.textContent = confidence.evidence;
    toolbenchEl.evidenceAskingSourceItem.dataset.state = stateFor(Boolean(source.sourceName || source.sourceType), true);
    toolbenchEl.evidenceAskingSourceMetric.textContent = source.sourceName || qa.status;
    toolbenchEl.evidenceAskingSourceCopy.textContent = trust.askingLayer;
    toolbenchEl.evidenceProductionReadinessItem.dataset.state = stateFor(productionReady);
    toolbenchEl.evidenceProductionReadinessMetric.textContent = qa.production;
    toolbenchEl.evidenceProductionReadinessCopy.textContent = productionReady
      ? toolbenchReviewPassMessages.workspace.evidenceProductionReady()
      : toolbenchReviewPassMessages.workspace.evidenceProductionPending();
    toolbenchEl.evidenceLastCheckedItem.dataset.state = qa.freshnessState === "stale"
      ? "pending"
      : qa.freshnessState === "watch"
        ? "review"
        : "ready";
    toolbenchEl.evidenceLastCheckedMetric.textContent = `${qa.captured} (${qa.freshnessLabel})`;
    toolbenchEl.evidenceLastCheckedCopy.textContent = latest?.period
      ? `${qa.freshnessDetail} Latest chart period ${latest.period}.`
      : qa.freshnessDetail;
  }
  toolbenchEl.evidencePeriodMetric.textContent = String(rows.length);
  toolbenchEl.evidenceSpreadMetric.textContent = latest ? `${latest.spread > 0 ? "+" : ""}${latest.spread}%` : "-";
  toolbenchEl.evidenceOfficialMetric.textContent = latest ? money(latest.official) : "-";
  toolbenchEl.evidenceAskingMetric.textContent = latest ? money(latest.asking) : "-";
  if (toolbenchEl.evidenceBenchmarkLayer) {
    toolbenchEl.evidenceBenchmarkLayer.textContent = trust.officialLayer;
    toolbenchEl.evidenceAskingLayer.textContent = trust.askingLayer;
    toolbenchEl.evidenceCoverageLayer.textContent = toolbenchReviewPassMessages.workspace.evidenceCoverage({
      title: sourceTrust.title,
      count: rows.length,
      evidence: confidence.evidence
    });
    toolbenchEl.evidenceTrustNote.textContent = `${sourceTrust.reason} ${sourceTrust.action}`;
  }
  toolbenchEl.evidenceStatus.textContent = toolbenchReviewPassMessages.workspace.evidenceRowsStatus();
  toolbenchEl.evidenceTableBody.replaceChildren();

  rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    const period = document.createElement("td");
    period.textContent = row.period;
    const official = document.createElement("td");
    official.textContent = money(row.official);
    const asking = document.createElement("td");
    asking.textContent = money(row.asking);
    const spread = document.createElement("td");
    spread.textContent = `${row.spread > 0 ? "+" : ""}${row.spread}%`;
    const signal = document.createElement("td");
    signal.textContent = row.signal;
    tableRow.dataset.signal = row.spread >= 20 ? "high" : row.spread >= 10 ? "watch" : "fair";
    tableRow.append(period, official, asking, spread, signal);
    toolbenchEl.evidenceTableBody.append(tableRow);
  });
}

function resetCalculatorDefaults(record) {
  if (!record || !toolbenchEl.calculatorForm) return;
  if (!toolbenchEl.calculatorUnitSize.value) toolbenchEl.calculatorUnitSize.value = "1000";
  toolbenchEl.calculatorAskingPsf.value = record.asking.toFixed(2);
  toolbenchEl.calculatorTargetPsf.value = (record.fairRange?.high || record.official).toFixed(2);
  renderCalculator();
}

function calculatorScenarioRows(size, asking) {
  if (!toolbenchRecord) return [];
  const fairHigh = toolbenchRecord.fairRange?.high || toolbenchRecord.official;
  const fairLow = toolbenchRecord.fairRange?.low || toolbenchRecord.official;
  return [
    {
      label: toolbenchReviewPassMessages.workspace.scenarioLabelCurrentAsking(),
      detail: toolbenchReviewPassMessages.workspace.scenarioDetailLandlordPosition(),
      psf: asking,
      tone: "asking"
    },
    {
      label: toolbenchReviewPassMessages.workspace.scenarioLabelFairHigh(),
      detail: toolbenchReviewPassMessages.workspace.scenarioDetailUpperTarget(),
      psf: fairHigh,
      tone: "watch"
    },
    {
      label: toolbenchReviewPassMessages.workspace.scenarioLabelOfficialMedian(),
      detail: toolbenchReviewPassMessages.workspace.scenarioDetailTransactionBenchmark(),
      psf: toolbenchRecord.official,
      tone: "benchmark"
    },
    {
      label: toolbenchReviewPassMessages.workspace.scenarioLabelFairLow(),
      detail: toolbenchReviewPassMessages.workspace.scenarioDetailAggressiveNegotiation(),
      psf: fairLow,
      tone: "target"
    }
  ].map((row) => {
    const monthly = row.psf * size;
    return {
      ...row,
      monthly,
      annualImpact: (asking * size - monthly) * 12
    };
  });
}

function renderScenarioBoard(size, asking) {
  if (!toolbenchEl.scenarioTableBody) return;
  const rows = calculatorScenarioRows(size, asking);
  toolbenchEl.scenarioSummary.textContent = toolbenchReviewPassMessages.workspace.scenarioSummary({
    count: rows.length
  });
  toolbenchEl.scenarioTableBody.replaceChildren();

  rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.dataset.tone = row.tone;

    const scenario = document.createElement("td");
    const title = document.createElement("strong");
    title.textContent = row.label;
    const detail = document.createElement("small");
    detail.textContent = row.detail;
    scenario.append(title, detail);

    const psf = document.createElement("td");
    psf.textContent = money(row.psf);
    const monthly = document.createElement("td");
    monthly.textContent = dollars(row.monthly);
    const impact = document.createElement("td");
    impact.textContent = row.annualImpact >= 0
      ? toolbenchReviewPassMessages.workspace.impactSave({
          amount: dollars(Math.abs(row.annualImpact))
        })
      : toolbenchReviewPassMessages.workspace.impactAdd({
          amount: dollars(Math.abs(row.annualImpact))
        });

    const action = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = toolbenchReviewPassMessages.workspace.scenarioUseTarget();
    button.disabled = false;
    button.addEventListener("click", () => {
      toolbenchEl.calculatorTargetPsf.value = row.psf.toFixed(2);
      renderCalculator();
    });
    action.append(button);

    tableRow.append(scenario, psf, monthly, impact, action);
    toolbenchEl.scenarioTableBody.append(tableRow);
  });
}

function resetOfferDefaults(record) {
  if (!record || !toolbenchEl.offerBuilderForm) return;
  if (!toolbenchEl.leaseMonthsInput.value) toolbenchEl.leaseMonthsInput.value = "36";
  if (!toolbenchEl.rentFreeMonthsInput.value) toolbenchEl.rentFreeMonthsInput.value = "1";
  toolbenchEl.offerPsfInput.value = (record.fairRange?.low || record.official).toFixed(2);
  toolbenchEl.walkAwayPsfInput.value = (record.fairRange?.high || record.official).toFixed(2);
  renderOfferBuilder();
}

function offerBuilderState() {
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const offer = Math.max(Number(toolbenchEl.offerPsfInput.value) || 0, 0);
  const walkAway = Math.max(Number(toolbenchEl.walkAwayPsfInput.value) || 0, 0);
  const leaseMonths = Math.max(Number(toolbenchEl.leaseMonthsInput.value) || 0, 0);
  const rentFreeMonths = Math.max(Number(toolbenchEl.rentFreeMonthsInput.value) || 0, 0);
  const offerMonthly = size * offer;
  const walkAwayMonthly = size * walkAway;
  const rentFreeValue = offerMonthly * Math.min(rentFreeMonths, leaseMonths);
  const leaseExposure = offerMonthly * Math.max(leaseMonths - rentFreeMonths, 0);
  const annualSaving = (asking * size - offerMonthly) * 12;
  return {
    size,
    asking,
    offer,
    walkAway,
    leaseMonths,
    rentFreeMonths,
    offerMonthly,
    walkAwayMonthly,
    rentFreeValue,
    leaseExposure,
    annualSaving
  };
}

function renderOfferBuilder() {
  if (!toolbenchRecord || !toolbenchEl.offerBuilderForm) return;
  const access = hasToolbenchAccess();
  const offer = offerBuilderState();
  toolbenchEl.offerSummary.textContent = toolbenchReviewPassMessages.workspace.offerSummary({
    offer: money(offer.offer),
    walkAway: money(offer.walkAway)
  });
  toolbenchEl.offerMonthlyMetric.textContent = dollars(offer.offerMonthly);
  toolbenchEl.walkAwayMonthlyMetric.textContent = dollars(offer.walkAwayMonthly);
  toolbenchEl.rentFreeValueMetric.textContent = dollars(offer.rentFreeValue);
  toolbenchEl.leaseExposureMetric.textContent = dollars(offer.leaseExposure);
  toolbenchEl.offerBuilderStatus.textContent =
    `Offer saves ${dollars(Math.abs(offer.annualSaving))} per year versus asking${offer.annualSaving >= 0 ? "." : " if asking is below offer."}`;
  renderSaveState(null);
}

function appendOfferToNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.offerBuilderStatus.textContent = toolbenchReviewPassMessages.workspace.offerAppendLocked();
    return;
  }
  const offer = offerBuilderState();
  const section = [
    "",
    toolbenchReviewPassMessages.workspace.offerDraftTitle(),
    toolbenchReviewPassMessages.workspace.offerDraftInitial({
      offer: money(offer.offer),
      monthly: dollars(offer.offerMonthly),
      size: offer.size.toLocaleString("en-SG")
    }),
    toolbenchReviewPassMessages.workspace.offerDraftWalkAway({
      walkAway: money(offer.walkAway),
      monthly: dollars(offer.walkAwayMonthly)
    }),
    toolbenchReviewPassMessages.workspace.offerDraftLeaseTerm({
      months: offer.leaseMonths
    }),
    toolbenchReviewPassMessages.workspace.offerDraftRentFree({
      months: offer.rentFreeMonths,
      value: dollars(offer.rentFreeValue)
    }),
    toolbenchReviewPassMessages.workspace.offerDraftExposure({
      exposure: dollars(offer.leaseExposure)
    }),
    toolbenchReviewPassMessages.workspace.offerDraftImpact({
      direction: offer.annualSaving >= 0
        ? toolbenchReviewPassMessages.workspace.directionSave().toLowerCase()
        : toolbenchReviewPassMessages.workspace.directionAdd().toLowerCase(),
      amount: dollars(Math.abs(offer.annualSaving))
    })
  ].join("\n");
  toolbenchEl.note.value = `${generateNote(toolbenchRecord)}${section}`;
  renderSaveState(null);
  toolbenchEl.offerBuilderStatus.textContent = toolbenchReviewPassMessages.workspace.offerAppended();
}

function alertCadenceLabel(cadence) {
  if (cadence === "weekly") return toolbenchReviewPassMessages.workspace.alertCadenceWeekly();
  if (cadence === "source-refresh") return toolbenchReviewPassMessages.workspace.alertCadenceSourceRefresh();
  return toolbenchReviewPassMessages.workspace.alertCadenceDaily();
}

function alertTriggerLabel(trigger) {
  if (trigger === "gap-above-limit") return toolbenchReviewPassMessages.workspace.alertTriggerGapAboveLimit();
  if (trigger === "benchmark-changed") return toolbenchReviewPassMessages.workspace.alertTriggerBenchmarkChanged();
  if (trigger === "source-connected") return toolbenchReviewPassMessages.workspace.alertTriggerSourceConnected();
  return toolbenchReviewPassMessages.workspace.alertTriggerAskingBelowTarget();
}

function alertRuleState() {
  const trigger = toolbenchEl.alertTriggerSelect.value;
  const targetPsf = Math.max(Number(toolbenchEl.alertTargetPsfInput.value) || 0, 0);
  const gapLimit = Math.max(Number(toolbenchEl.alertGapLimitInput.value) || 0, 0);
  const cadence = toolbenchEl.alertCadenceSelect.value;
  return {
    trigger,
    targetPsf,
    gapLimit,
    cadence
  };
}

function alertConditionCopy(rule) {
  if (!toolbenchRecord || !rule) return "-";
  if (rule.trigger === "gap-above-limit") {
    return toolbenchReviewPassMessages.workspace.alertConditionGapAbove({
      gapLimit: rule.gapLimit,
      gap: toolbenchRecord.gap
    });
  }
  if (rule.trigger === "benchmark-changed") {
    return toolbenchReviewPassMessages.workspace.alertConditionBenchmarkChanged({
      official: money(toolbenchRecord.official)
    });
  }
  if (rule.trigger === "source-connected") {
    return toolbenchReviewPassMessages.workspace.alertSourceConnected();
  }
  return toolbenchReviewPassMessages.workspace.alertConditionAskingBelow({
    target: money(rule.targetPsf),
    asking: money(toolbenchRecord.asking)
  });
}

function resetAlertRuleDefaults(record) {
  if (!record || !toolbenchEl.alertRuleForm) return;
  const saved = alertRuleForRecord(record.id);
  toolbenchEl.alertTriggerSelect.value = saved?.trigger || "asking-below-target";
  toolbenchEl.alertTargetPsfInput.value = (saved?.targetPsf || record.fairRange?.high || record.official).toFixed(2);
  toolbenchEl.alertGapLimitInput.value = String(saved?.gapLimit || Math.max(record.gap, 20));
  toolbenchEl.alertCadenceSelect.value = saved?.cadence || "daily";
  renderAlertRule();
}

function renderAlertRule() {
  if (!toolbenchRecord || !toolbenchEl.alertRuleForm) return;
  const access = hasToolbenchAccess();
  const rule = alertRuleState();
  const saved = alertRuleForRecord(toolbenchRecord.id);
  toolbenchEl.alertRuleSummary.textContent = `${toolbenchRecord.area}: ${alertTriggerLabel(rule.trigger)}`;
  toolbenchEl.alertConditionMetric.textContent = alertConditionCopy(rule);
  toolbenchEl.alertCadenceMetric.textContent = alertCadenceLabel(rule.cadence);
  toolbenchEl.alertStoredMetric.textContent = saved
    ? toolbenchReviewPassMessages.workspace.savedLabel()
    : toolbenchReviewPassMessages.workspace.notSavedLabel();
  toolbenchEl.alertRuleStatus.textContent = saved
    ? toolbenchReviewPassMessages.workspace.alertSavedSummary({
        cadence: alertCadenceLabel(saved.cadence).toLowerCase(),
        area: toolbenchRecord.area
      })
    : toolbenchReviewPassMessages.workspace.alertSavePrompt();
}

function saveAlertRule() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.alertRuleStatus.textContent = toolbenchReviewPassMessages.workspace.alertSaveLocked();
    return;
  }
  const rule = alertRuleState();
  const rules = loadStoredJson(alertRulesKey, []).filter((item) => {
    const sameRecord = item.recordId === toolbenchRecord.id;
    const sameMember = normalizeEmail(item.memberEmail || toolbenchSession.email) === normalizeEmail(toolbenchSession.email);
    return !(sameRecord && sameMember);
  });
  rules.unshift({
    recordId: toolbenchRecord.id,
    memberEmail: normalizeEmail(toolbenchSession.email),
    area: toolbenchRecord.area,
    title: toolbenchRecord.title,
    trigger: rule.trigger,
    targetPsf: rule.targetPsf,
    gapLimit: rule.gapLimit,
    cadence: rule.cadence,
    condition: alertConditionCopy(rule),
    savedAt: new Date().toISOString()
  });
  writeStoredJson(alertRulesKey, rules);
  watchArea({ silent: true });
  renderAlertRule();
  renderWatchlist();
  toolbenchEl.alertRuleStatus.textContent = toolbenchReviewPassMessages.workspace.alertSaved({
    area: toolbenchRecord.area
  });
}

function appendAlertRuleToNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.alertRuleStatus.textContent = toolbenchReviewPassMessages.workspace.alertAppendLocked();
    return;
  }
  const rule = alertRuleState();
  const section = [
    "",
    toolbenchReviewPassMessages.workspace.alertSectionTitle(),
    `Trigger: ${alertTriggerLabel(rule.trigger)}`,
    `Condition: ${alertConditionCopy(rule)}`,
    `Cadence: ${alertCadenceLabel(rule.cadence)}`
  ].join("\n");
  toolbenchEl.note.value = `${generateNote(toolbenchRecord)}${section}`;
  renderSaveState(null);
  toolbenchEl.alertRuleStatus.textContent = toolbenchReviewPassMessages.workspace.alertAppended();
}

function reportDecisionPack() {
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const target = Math.max(Number(toolbenchEl.calculatorTargetPsf.value) || 0, 0);
  const offer = offerBuilderState();
  const alert = alertRuleState();
  const rows = evidenceRows();
  const latest = rows[rows.length - 1] || null;
  return {
    calculator: {
      unitSize: size,
      askingPsf: asking,
      targetPsf: target,
      currentMonthly: size * asking,
      targetMonthly: size * target,
      monthlyImpact: size * asking - size * target,
      annualImpact: (size * asking - size * target) * 12
    },
    offer: {
      offerPsf: offer.offer,
      walkAwayPsf: offer.walkAway,
      leaseMonths: offer.leaseMonths,
      rentFreeMonths: offer.rentFreeMonths,
      offerMonthly: offer.offerMonthly,
      walkAwayMonthly: offer.walkAwayMonthly,
      rentFreeValue: offer.rentFreeValue,
      leaseExposure: offer.leaseExposure,
      annualSaving: offer.annualSaving
    },
    alert: {
      trigger: alert.trigger,
      triggerLabel: alertTriggerLabel(alert.trigger),
      targetPsf: alert.targetPsf,
      gapLimit: alert.gapLimit,
      cadence: alert.cadence,
      cadenceLabel: alertCadenceLabel(alert.cadence),
      condition: alertConditionCopy(alert)
    },
    evidence: {
      chartRange: toolbenchRange,
      rowCount: rows.length,
      latestPeriod: latest?.period || "",
      latestSpread: latest?.spread ?? null
    },
    pulse: pulseSummaryForRecord(toolbenchRecord),
    v1Context: contextRecordForRecord(toolbenchRecord)
  };
}

function setActiveChartRange(range) {
  if (!range) return;
  toolbenchRange = range;
  document.querySelectorAll("[data-member-range]").forEach((button) => {
    button.classList.toggle("active", button.dataset.memberRange === range);
  });
  drawMemberChart();
  renderEvidenceTable();
}

function restoreSavedReport(report, options = {}) {
  if (!report?.decisionPack || !toolbenchRecord) return;
  const { calculator = {}, offer = {}, alert = {}, evidence = {} } = report.decisionPack;

  if (calculator.unitSize) toolbenchEl.calculatorUnitSize.value = String(calculator.unitSize);
  if (calculator.askingPsf) toolbenchEl.calculatorAskingPsf.value = Number(calculator.askingPsf).toFixed(2);
  if (calculator.targetPsf) toolbenchEl.calculatorTargetPsf.value = Number(calculator.targetPsf).toFixed(2);

  if (offer.offerPsf) toolbenchEl.offerPsfInput.value = Number(offer.offerPsf).toFixed(2);
  if (offer.walkAwayPsf) toolbenchEl.walkAwayPsfInput.value = Number(offer.walkAwayPsf).toFixed(2);
  if (offer.leaseMonths) toolbenchEl.leaseMonthsInput.value = String(offer.leaseMonths);
  if (offer.rentFreeMonths || offer.rentFreeMonths === 0) toolbenchEl.rentFreeMonthsInput.value = String(offer.rentFreeMonths);

  if (alert.trigger) toolbenchEl.alertTriggerSelect.value = alert.trigger;
  if (alert.targetPsf) toolbenchEl.alertTargetPsfInput.value = Number(alert.targetPsf).toFixed(2);
  if (alert.gapLimit) toolbenchEl.alertGapLimitInput.value = String(alert.gapLimit);
  if (alert.cadence) toolbenchEl.alertCadenceSelect.value = alert.cadence;

  renderCalculator();
  renderOfferBuilder();
  renderAlertRule();
  if (evidence.chartRange) setActiveChartRange(evidence.chartRange);
  if (report.negotiationNote) toolbenchEl.note.value = report.negotiationNote;
  renderSaveState(report);
  if (options.announce) {
    setNamedSearchStatus("savedDecisionRestored", { title: report.title });
  }
}

function renderCalculator() {
  if (!toolbenchRecord || !toolbenchEl.calculatorForm) return;
  const access = hasToolbenchAccess();
  const size = Math.max(Number(toolbenchEl.calculatorUnitSize.value) || 0, 0);
  const asking = Math.max(Number(toolbenchEl.calculatorAskingPsf.value) || 0, 0);
  const target = Math.max(Number(toolbenchEl.calculatorTargetPsf.value) || 0, 0);
  const currentMonthly = size * asking;
  const targetMonthly = size * target;
  const monthlyImpact = currentMonthly - targetMonthly;
  const annualImpact = monthlyImpact * 12;

  toolbenchEl.calculatorSummary.textContent = toolbenchReviewPassMessages.workspace.calculatorSummary({
    area: toolbenchRecord.area,
    size: size.toLocaleString("en-SG")
  });
  toolbenchEl.calculatorCurrentMonthly.textContent = dollars(currentMonthly);
  toolbenchEl.calculatorTargetMonthly.textContent = dollars(targetMonthly);
  toolbenchEl.calculatorMonthlyImpact.textContent = toolbenchReviewPassMessages.workspace.calculatorMonthlyImpact({
    direction: monthlyImpact >= 0
      ? toolbenchReviewPassMessages.workspace.directionSave()
      : toolbenchReviewPassMessages.workspace.directionAdd(),
    amount: dollars(Math.abs(monthlyImpact))
  });
  toolbenchEl.calculatorAnnualImpact.textContent = toolbenchReviewPassMessages.workspace.calculatorAnnualImpact({
    direction: annualImpact >= 0
      ? toolbenchReviewPassMessages.workspace.directionSave()
      : toolbenchReviewPassMessages.workspace.directionAdd(),
    amount: dollars(Math.abs(annualImpact))
  });
  toolbenchEl.calculatorStatus.textContent = `Every S$1.00 psf equals ${dollars(size)} per month for this unit size.`;
  renderScenarioBoard(size, asking);
  renderOfferBuilder();
  renderSaveState(null);
}

function renderRecord(record) {
  if (!record) return;
  toolbenchRecord = record;
  toolbenchEl.input.value = record.title;
  toolbenchEl.confidence.textContent = record.confidence;
  toolbenchEl.resultTitle.textContent = record.title;
  toolbenchEl.decision.textContent = record.decision;
  toolbenchEl.reason.textContent = record.reason;
  toolbenchEl.official.textContent = money(record.official);
  toolbenchEl.asking.textContent = money(record.asking);
  toolbenchEl.fairRange.textContent = moneyRange(record.fairRange);
  toolbenchEl.gap.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  toolbenchEl.actionLabel.textContent = record.actionLabel;
  toolbenchEl.actionCopy.textContent = record.action;
  toolbenchEl.sourceCopy.textContent = record.oneMap?.planningArea
    ? `${record.sourceSummary} OneMap context: ${record.oneMap.planningArea}${record.oneMap.postalCode ? `, Singapore ${record.oneMap.postalCode}` : ""}.`
    : record.sourceSummary;
  if (toolbenchEl.sourceQaPanel) {
    const qa = sourceQaProfile(record);
    toolbenchEl.sourceQaPanel.dataset.ready = qa.ready ? "true" : "false";
    toolbenchEl.sourceQaPanel.dataset.freshness = qa.freshnessState;
    toolbenchEl.sourceQaStatus.textContent = qa.status;
    toolbenchEl.sourceQaChecks.textContent = qa.checks;
    toolbenchEl.sourceQaCaptured.textContent = `${qa.captured} (${qa.freshnessLabel})`;
    toolbenchEl.sourceQaProduction.textContent = qa.production;
    toolbenchEl.sourceQaWarning.textContent = qa.warning;
  }
  renderSourceRefreshRows(record);
  if (toolbenchEl.signalDrivers) {
    toolbenchEl.signalDrivers.replaceChildren();
    signalDrivers(record).forEach((driver) => {
      const item = document.createElement("li");
      item.textContent = driver;
      toolbenchEl.signalDrivers.append(item);
    });
  }
  if (toolbenchEl.publicResultLink) {
    const rentParam = encodeURIComponent(record.id || record.title);
    toolbenchEl.publicResultLink.href = `../../index.html?rent=${rentParam}#search`;
  }
  toolbenchEl.chartTitle.textContent = `${record.title}: historical rent psf`;
  if (toolbenchEl.chartFairRangeMetric) {
    toolbenchEl.chartFairRangeMetric.textContent = moneyRange(record.fairRange);
  }
  if (toolbenchEl.chartGapMetric) {
    toolbenchEl.chartGapMetric.textContent = `${record.gap > 0 ? "+" : ""}${record.gap}%`;
  }
  if (toolbenchEl.chartReadMetric) {
    toolbenchEl.chartReadMetric.textContent = confidenceProfile(record).title;
  }
  if (toolbenchEl.chartContextNote) {
    toolbenchEl.chartContextNote.textContent =
      `${record.actionLabel}: compare the asking line against the benchmark trend before accepting the rent.`;
  }
  toolbenchEl.noteLabel.textContent = hasToolbenchAccess()
    ? toolbenchReviewPassMessages.workspace.noteLabelReady()
    : toolbenchReviewPassMessages.workspace.noteLabelLocked();
  toolbenchEl.note.value = generateNote(record);
  renderDecisionSpine(record);
  renderWorkspaceEvidencePack(record);
  renderWorkspaceSourceTimeline(record);
  renderV1ContextLayer(record);
  renderV1Roster();
  renderSaveState(savedReportForRecord(record.id));
  drawMemberChart();
  renderEvidenceTable();
  resetCalculatorDefaults(record);
  resetOfferDefaults(record);
  resetAlertRuleDefaults(record);
}

function renderQuickPicks() {
  const curatedRecords = quickPickRecords();
  const routedLane = rankedQuickPickBookmarks()[0] || null;
  const routedWorkType = routedLane?.workType || "";
  const routedLaneCooling = Boolean((routedLane?.planningMemoryScore || 0) < 0);
  const routedRecoveryCandidates =
    routedLane?.planningReactivated
      ? recoveryChoiceCandidates(curatedRecords, routedLane, {
          mode: toolbenchQuickPickSortMode || "default"
        })
      : {
          leadRecord: null,
          alternatives: [],
          holdingAlternative: null,
          fadingAlternative: null
        };
  const routedRecoveryTarget = routedRecoveryCandidates.leadRecord
    ? {
        record: routedRecoveryCandidates.leadRecord,
        laneLabel: quickPickBookmarkLabel(routedLane.key),
        actionability: routedLane?.recoveryTargetActionability || "",
        selectionReason: recoveryTargetSelectionReason(
          routedLane,
          toolbenchQuickPickBookmarks[routedLane.key] || null,
          routedRecoveryCandidates.leadRecord
        )
      }
    : null;
  const routedAlternativeStatesById = new Map(
    routedRecoveryCandidates.alternatives.map((item) => [item.record.id, item.state])
  );
  let routedWorkMatchesShown = 0;
  toolbenchEl.picks.replaceChildren();
  if (!curatedRecords.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = toolbenchReviewPassMessages.workspace.quickPickEmpty({
      scope: quickPickFilterDescription()
    });
    toolbenchEl.picks.append(empty);
    return;
  }
  curatedRecords.forEach((record) => {
    const button = document.createElement("button");
    button.type = "button";
    const context = contextRecordForRecord(record);
    const healthSummary = summarizeV1Health(context);
    const decisionOutcome = summarizeCommercialSnapshotForContext(context)?.outcome || null;
    const decisionHistory = currentDecisionOutcomeHistory(context);
    const routedMomentum = routedReviewOutcomeForRecord(record);
    const showImprovingBadge =
      toolbenchQuickPickSortMode === "improving" && decisionHistory?.comparison === "stronger";
    const showAttentionBadge =
      toolbenchQuickPickSortMode === "attention" &&
      (
        decisionOutcome?.tone === "caution" ||
        healthSummary.state === "weak" ||
        decisionHistory?.comparison === "weaker"
      );
    const showCurrentBadge = toolbenchRecord?.id === record.id && toolbenchQuickPickFilter !== "current";
    const workType = quickPickRecordWorkType({
      healthSummary,
      decisionOutcome,
      decisionHistory
    });
    const showRoutedWorkMatch =
      Boolean(routedWorkType) &&
      workType === routedWorkType &&
      toolbenchQuickPickSortMode !== "default" &&
      routedWorkMatchesShown < 3;
    const showRecoveryTarget = routedRecoveryTarget?.record?.id === record.id;
    const showRecoveryAlternative =
      !showRecoveryTarget &&
      routedLane?.planningReactivated &&
      routedAlternativeStatesById.has(record.id);
    const recoveryAlternativeState = showRecoveryAlternative
      ? routedAlternativeStatesById.get(record.id) || ""
      : "";
    const recoveryTargetActionability =
      showRecoveryTarget && routedLane?.recoveryTargetActionability
        ? routedLane.recoveryTargetActionability
        : "";
    if (showRoutedWorkMatch) {
      routedWorkMatchesShown += 1;
      button.dataset.routeWorkMatch = "true";
      if (routedLaneCooling) {
        button.dataset.routeWorkCooling = "true";
      }
      if (showRecoveryTarget) {
        button.dataset.routeRecoveryTarget = "true";
      }
      if (recoveryTargetActionability) {
        button.dataset.routeRecoveryActionability =
          recoveryTargetActionability === "holding recovery target"
            ? "holding"
            : "fading";
      }
      if (recoveryAlternativeState) {
        button.dataset.routeRecoveryAlternative = recoveryAlternativeState;
      }
      button.dataset.recordId = record.id;
      if (toolbenchQuickPickRoutedOpenedKey === record.id) {
        button.dataset.routeWorkOpened = "true";
      }
      if (toolbenchQuickPickRoutedResult.active && toolbenchQuickPickRoutedResult.recordId === record.id) {
        button.dataset.routeWorkResult = "true";
      }
      const routedHint = toolbenchReviewPassMessages.workspace.quickPickRoutedHint({
        workType
      });
      const routedCoolingHint = routedLaneCooling && routedLane?.planningHoldReason
        ? ` ${routedLane.planningHoldReason}`
        : "";
      const routedRecoveryTargetHint = showRecoveryTarget && recoveryTargetActionability
        ? ` Best next area: ${recoveryTargetActionability}.`
        : "";
      const routedRecoveryAlternativeHint =
        recoveryAlternativeState === "holding"
          ? " Backup option: this area is the next strongest follow-up behind the main suggestion."
          : recoveryAlternativeState === "fading"
            ? " Weaker backup option: this area is still worth a look, but it is behind the main suggestion."
            : "";
      const routedResultHint =
        toolbenchQuickPickRoutedResult.active && toolbenchQuickPickRoutedResult.recordId === record.id
          ? `${routedHint}${routedCoolingHint}${routedRecoveryTargetHint}${routedRecoveryAlternativeHint} ${toolbenchQuickPickRoutedResult.copy}.`
          : `${routedHint}${routedCoolingHint}${routedRecoveryTargetHint}${routedRecoveryAlternativeHint}`;
      button.title = routedResultHint;
      button.setAttribute("aria-label", `${record.title}. ${routedResultHint}`);
    }
    button.dataset.health = healthSummary.state;
    if (decisionOutcome?.tone) button.dataset.outcomeTone = decisionOutcome.tone;
    if (decisionHistory?.comparison && decisionHistory.comparison !== "unchanged") {
      button.dataset.outcomeTrend = decisionHistory.comparison;
    }
    if (showCurrentBadge) {
      button.dataset.sortBadge = "current";
    } else if (showImprovingBadge) {
      button.dataset.sortBadge = "improving";
    } else if (showAttentionBadge) {
      button.dataset.sortBadge = "attention";
    }
    const title = document.createElement("strong");
    title.textContent = record.title;
    if (showCurrentBadge || showImprovingBadge || showAttentionBadge) {
      const badge = document.createElement("span");
      badge.className = "quick-pick-sort-badge";
      badge.textContent = showCurrentBadge
        ? toolbenchReviewPassMessages.workspace.quickPickCurrentBadge()
        : showImprovingBadge
          ? toolbenchReviewPassMessages.workspace.quickPickSortBadgeImproving()
          : toolbenchReviewPassMessages.workspace.quickPickSortBadgeAttention();
      button.append(badge);
    }
    const meta = document.createElement("small");
    meta.textContent = toolbenchReviewPassMessages.workspace.quickPickMeta({
      summary: quickPickHealthSummary(record)
    });
    const decisionMeta = document.createElement("small");
    decisionMeta.textContent = toolbenchReviewPassMessages.workspace.quickPickDecisionMeta({
      outcome: decisionOutcome?.title || ""
    });
    button.append(title, meta, decisionMeta);
    if (workType && (showCurrentBadge || showImprovingBadge || showAttentionBadge || toolbenchQuickPickSortMode !== "default")) {
      const workMeta = document.createElement("small");
      workMeta.className = "quick-pick-work-meta";
      workMeta.dataset.accent =
        showCurrentBadge
          ? "current"
          : showImprovingBadge
            ? "improving"
            : showAttentionBadge
              ? "attention"
              : toolbenchQuickPickSortMode !== "default"
                ? toolbenchQuickPickSortMode
                : "default";
      workMeta.textContent = toolbenchReviewPassMessages.workspace.quickPickWorkMeta({
        workType
      });
      button.append(workMeta);
    }
    if (showRoutedWorkMatch) {
      const routedMeta = document.createElement("small");
      routedMeta.className = "quick-pick-routed-meta";
      routedMeta.textContent =
        toolbenchQuickPickRoutedResult.active && toolbenchQuickPickRoutedResult.recordId === record.id
          ? toolbenchQuickPickRoutedResult.copy
          : toolbenchReviewPassMessages.workspace.quickPickRoutedBadge();
      button.append(routedMeta);
      if (showRecoveryTarget) {
        const recoveryTargetMeta = document.createElement("small");
        recoveryTargetMeta.className = "quick-pick-recovery-target-meta";
        recoveryTargetMeta.textContent =
          recoveryTargetActionability === "holding recovery target"
            ? "Best next area • steady"
            : recoveryTargetActionability
              ? "Best next area • fading"
              : "Best next area";
        button.append(recoveryTargetMeta);
      } else if (showRecoveryAlternative) {
        const recoveryAlternativeMeta = document.createElement("small");
        recoveryAlternativeMeta.className = "quick-pick-recovery-alternative-meta";
        recoveryAlternativeMeta.textContent =
          recoveryAlternativeState === "holding"
            ? "Backup option"
            : "Weaker backup";
        button.append(recoveryAlternativeMeta);
      }
    }
    if (decisionHistory?.comparison && decisionHistory.comparison !== "unchanged") {
      const trendMeta = document.createElement("small");
      trendMeta.textContent = toolbenchReviewPassMessages.workspace.quickPickTrendMeta({
        trend: decisionHistory.comparison
      });
      button.append(trendMeta);
    }
    const routedMomentumMeta = quickPickRecordMomentumMeta(routedMomentum?.status || "");
    if (
      routedMomentumMeta &&
      !(toolbenchQuickPickRoutedResult.active && toolbenchQuickPickRoutedResult.recordId === record.id)
    ) {
      const momentumMeta = document.createElement("small");
      momentumMeta.className = "quick-pick-momentum-meta";
      momentumMeta.dataset.state = routedMomentum?.status || "";
      momentumMeta.textContent = routedMomentumMeta;
      button.append(momentumMeta);
    }
    button.addEventListener("click", () => {
      clearQuickPickBookmarkOpenedState({ render: false });
      dismissBackendPreviewNotice();
      if (showRoutedWorkMatch) {
        const routedCue = routedRecordCueForContext(context, workType);
        const routedLaneKey = quickPickBookmarkKeyForLens(currentQuickPickLensState());
        const routedReopenMemoryType =
          toolbenchQuickPickBookmarks[routedLaneKey]
            ? quickPickBookmarkReopenMemoryMeta(routedLaneKey).type
            : "";
        toolbenchQuickPickRoutedOpenedKey = record.id;
        toolbenchRoutedRecordWorkCue = {
          recordId: normalizeDecisionContextKey(record.id || record.title),
          workType,
          active: true,
          cardKey: routedCue?.cardKey || "",
          action: routedCue?.action || "",
          validationSection: routedCue?.validationSection || "",
          reopenMemoryType: routedReopenMemoryType
        };
        if (toolbenchRoutedRecordWorkCueTimer) {
          clearTimeout(toolbenchRoutedRecordWorkCueTimer);
          toolbenchRoutedRecordWorkCueTimer = null;
        }
        if (toolbenchQuickPickRoutedOpenedTimer) {
          clearTimeout(toolbenchQuickPickRoutedOpenedTimer);
          toolbenchQuickPickRoutedOpenedTimer = null;
        }
        renderQuickPicks();
        toolbenchQuickPickRoutedOpenedTimer = window.setTimeout(() => {
          toolbenchQuickPickRoutedOpenedKey = "";
          toolbenchQuickPickRoutedOpenedTimer = null;
          renderQuickPicks();
        }, 1400);
        markRecoveryChoiceMemory(
          routedLane?.key || "",
          showRecoveryTarget
            ? "lead"
            : recoveryAlternativeState === "holding"
              ? "holdingAlternative"
              : recoveryAlternativeState === "fading"
                ? "fadingAlternative"
                : ""
        );
        toolbenchQueueExplainerRoutedActive = true;
        toolbenchQueueExplainerRoutedActiveDetail =
          showRecoveryTarget
            ? "Followed the lead recovery target."
            : recoveryAlternativeState === "holding"
              ? "Opened a holding alternative instead of the lead recovery target."
              : recoveryAlternativeState === "fading"
                ? "Opened a fading alternative instead of the lead recovery target."
                : "";
        if (toolbenchQueueExplainerRoutedActiveTimer) {
          clearTimeout(toolbenchQueueExplainerRoutedActiveTimer);
          toolbenchQueueExplainerRoutedActiveTimer = null;
        }
        renderV1Roster();
        toolbenchQueueExplainerRoutedActiveTimer = window.setTimeout(() => {
          toolbenchQueueExplainerRoutedActive = false;
          toolbenchQueueExplainerRoutedActiveDetail = "";
          toolbenchQueueExplainerRoutedActiveTimer = null;
          renderV1Roster();
        }, 1800);
        toolbenchRoutedRecordWorkCueTimer = window.setTimeout(() => {
          toolbenchRoutedRecordWorkCue.active = false;
          toolbenchRoutedRecordWorkCueTimer = null;
          renderV1ContextMeta(toolbenchContextDraft);
          renderV1Validation();
        }, 2200);
      }
      renderRecord(record);
      renderQuickPicks();
      renderV1Roster();
      if (showRoutedWorkMatch) {
        if (
          toolbenchRoutedRecordWorkCue.reopenMemoryType === "pressure" &&
          toolbenchRoutedRecordWorkCue.validationSection
        ) {
          toolbenchV1ValidationSectionFilter = toolbenchRoutedRecordWorkCue.validationSection;
        } else if (toolbenchRoutedRecordWorkCue.reopenMemoryType === "productive") {
          toolbenchV1ValidationSectionFilter = "";
        }
        const focusSection = decisionFocusSectionForAction(toolbenchRoutedRecordWorkCue.action);
        if (focusSection) setDecisionFocusSection(focusSection);
        highlightHighestPrioritySummary();
        renderV1ContextMeta(toolbenchContextDraft);
        renderV1DecisionSnapshot(summarizeCommercialSnapshotForContext(toolbenchContextDraft));
        renderV1Validation();
      }
      setNamedSearchStatus("recordLoaded", { title: record.title });
    });
    toolbenchEl.picks.append(button);
  });
}

function renderSavedReports() {
  const reports = currentMemberReports();
  toolbenchEl.savedCount.textContent = toolbenchReviewPassMessages.workspace.savedCount({
    count: reports.length
  });
  toolbenchEl.savedReports.replaceChildren();
  if (!reports.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state-note";
    empty.textContent = toolbenchReviewPassMessages.workspace.savedEmpty();
    toolbenchEl.savedReports.append(empty);
    return;
  }
  reports.slice(0, 8).forEach((report) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "saved-report-item";
    const title = document.createElement("strong");
    title.textContent = report.title;
    const meta = document.createElement("span");
    const savedAt = report.savedAt
      ? new Date(report.savedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })
      : toolbenchReviewPassMessages.workspace.savedReportFallback();
    const saveMetadata = report.saveMetadata || {};
    const targetMonthly = report.decisionPack?.calculator?.targetMonthly;
    meta.textContent = targetMonthly
      ? toolbenchReviewPassMessages.workspace.savedReportTargetMeta({
          asking: money(report.asking),
          targetMonthly: dollars(targetMonthly)
        })
      : toolbenchReviewPassMessages.workspace.savedReportGapMeta({
          asking: money(report.asking),
          gap: `${report.gap > 0 ? "+" : ""}${report.gap}%`
        });
    const detail = document.createElement("small");
    detail.textContent = toolbenchReviewPassMessages.workspace.savedReportDetail({
      trust: saveMetadata.benchmarkTrust || report.confidence || toolbenchReviewPassMessages.workspace.savedReportDetailFallback(),
      noteStatus: saveMetadata.noteStatus || toolbenchReviewPassMessages.workspace.savedReportNoteFallback(),
      savedAt
    });
    button.append(title, meta, detail);
    button.addEventListener("click", () => {
      const record = toolbenchRecords.find((item) => item.id === report.recordId);
      if (record) {
        clearQuickPickBookmarkOpenedState({ render: false });
        dismissBackendPreviewNotice();
        renderRecord(record);
        renderQuickPicks();
        renderV1Roster();
        restoreSavedReport(report, { announce: true });
      }
    });
    toolbenchEl.savedReports.append(button);
  });
}

function renderWatchlist() {
  const watchlist = watchlistRecords();
  toolbenchEl.watchCount.textContent = toolbenchReviewPassMessages.workspace.watchCount({
    count: watchlist.length
  });
  toolbenchEl.watchlist.replaceChildren();
  if (!watchlist.length) {
    const empty = document.createElement("p");
    empty.textContent = toolbenchReviewPassMessages.workspace.watchEmpty();
    toolbenchEl.watchlist.append(empty);
    return;
  }
  watchlist.slice(0, 8).forEach((item) => {
    const record = toolbenchRecords.find((entry) => entry.id === item.recordId);
    if (!record) return;
    const rule = alertRuleForRecord(record.id);
    const row = document.createElement("div");
    row.className = "watchlist-item";
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = record.area;
    const detail = document.createElement("small");
    detail.textContent = rule ? `${alertTriggerLabel(rule.trigger)} | ${alertCadenceLabel(rule.cadence)}` : record.mobileSummary;
    copy.append(title, detail);
    const open = document.createElement("button");
    open.type = "button";
    open.textContent = toolbenchReviewPassMessages.workspace.watchOpen();
    open.addEventListener("click", () => {
      clearQuickPickBookmarkOpenedState({ render: false });
      dismissBackendPreviewNotice();
      renderRecord(record);
      renderQuickPicks();
      renderV1Roster();
    });
    row.append(copy, open);
    toolbenchEl.watchlist.append(row);
  });
}

function saveReport() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const decisionPack = reportDecisionPack();
  const saveMetadata = reportSaveMetadata(toolbenchRecord, decisionPack);
  const pulseSummary = decisionPack.pulse || pulseSummaryForRecord(toolbenchRecord);
  const savedAt = new Date().toISOString();
  const reports = savedReportStore().filter((report) => {
    const sameRecord = report.recordId === toolbenchRecord.id;
    const sameMember = normalizeEmail(report.memberEmail || toolbenchSession.email) === normalizeEmail(toolbenchSession.email);
    return !(sameRecord && sameMember);
  });
  reports.unshift(normalizeBackendReport({
    recordId: toolbenchRecord.id,
    memberEmail: normalizeEmail(toolbenchSession.email),
    title: toolbenchRecord.title,
    decision: toolbenchRecord.decision,
    asking: toolbenchRecord.asking,
    official: toolbenchRecord.official,
    gap: toolbenchRecord.gap,
    confidence: toolbenchRecord.confidence,
    pulseSummary,
    saveMetadata,
    decisionPack,
    negotiationNote: toolbenchEl.note.value,
    savedAt
  }));
  writeSavedReportStore(reports);
  renderSavedReports();
  renderSaveState(savedReportForRecord(toolbenchRecord.id));
  toolbenchEl.actionStatus.textContent = toolbenchReviewPassMessages.workspace.saveReportSummary({
    title: toolbenchRecord.title,
    benchmarkTrust: saveMetadata.benchmarkTrust,
    target: money(saveMetadata.targetPsf),
    noteStatus: saveMetadata.noteStatus.toLowerCase()
  });
}

function watchArea(options = {}) {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const watchlist = watchlistRecords().filter((item) => item.recordId !== toolbenchRecord.id);
  watchlist.unshift({
    recordId: toolbenchRecord.id,
    area: toolbenchRecord.area,
    addedAt: new Date().toISOString()
  });
  writeStoredJson(watchlistKey, watchlist);
  renderWatchlist();
  if (!options.silent) {
    toolbenchEl.actionStatus.textContent = toolbenchReviewPassMessages.workspace.watchAdded({
      area: toolbenchRecord.area
    });
  }
}

function downloadNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  const blob = new Blob([toolbenchEl.note.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${toolbenchRecord.id}-rentintel-negotiation-note.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toolbenchEl.noteStatus.textContent = toolbenchReviewPassMessages.workspace.notePrepared();
}

function exportEvidenceCsv() {
  if (!hasToolbenchAccess() || !toolbenchRecord) {
    toolbenchEl.evidenceStatus.textContent = toolbenchReviewPassMessages.workspace.exportEvidenceLocked();
    return;
  }
  const rows = evidenceRows();
  const csvRows = [
    ["period", "official_median_psf", "asking_median_psf", "spread_percent", "signal"],
    ...rows.map((row) => [
      row.period,
      row.official.toFixed(2),
      row.asking.toFixed(2),
      String(row.spread),
      row.signal
    ])
  ];
  const csv = csvRows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${toolbenchRecord.id}-rentintel-evidence.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toolbenchEl.evidenceStatus.textContent = toolbenchReviewPassMessages.workspace.exportEvidenceDone({
    count: rows.length
  });
}

async function copyNote() {
  if (!hasToolbenchAccess() || !toolbenchRecord) return;
  try {
    await navigator.clipboard.writeText(toolbenchEl.note.value);
    toolbenchEl.noteStatus.textContent = toolbenchReviewPassMessages.workspace.noteCopied();
  } catch (error) {
    toolbenchEl.note.select();
    document.execCommand("copy");
    toolbenchEl.noteStatus.textContent = toolbenchReviewPassMessages.workspace.noteCopyBlocked();
  }
}

async function initToolbench() {
  applyToolbenchEmbedSafeMode();
  sanitizeCoverageRecords();
  if (window.RentIntelAuth?.restoreSession) {
    const restored = await window.RentIntelAuth.restoreSession();
    toolbenchSession = restored.session || loadStoredJson(memberSessionKey, null);
  } else {
    toolbenchSession = loadStoredJson(memberSessionKey, null);
  }
  ensureToolbenchSession();
  restoreV1ReviewPassState();
  const backendReviewPassState = await loadBackendV1ReviewPassState();
  if (backendReviewPassState) {
    applyReviewPassStatePayload(backendReviewPassState);
    toolbenchReviewPassOrigin = "backend";
    writeSessionJson(toolbenchV1ReviewPassStateKey, currentSessionReviewPassStatePayload());
  }
  toolbenchDecisionContextRecords = await loadDecisionContextRecords();
  const liveFeed = await loadToolbenchAskingFeed();
  toolbenchFeedState = window.RentIntelAskingFeedAdapter?.normalizeFeed
    ? window.RentIntelAskingFeedAdapter.normalizeFeed(liveFeed, {
      fallbackUpdatedAt: window.RENTINTEL_SAMPLE_DATA?.updatedAt || ""
    })
    : (liveFeed || { records: [] });
  const sampleRecords = Array.isArray(window.RENTINTEL_SAMPLE_DATA?.records) ? window.RENTINTEL_SAMPLE_DATA.records : [];
  toolbenchRecords = mergePreviewHandoffRecord(enrichToolbenchOneMapRecords(mergeCoverageRecords(mergeAskingRentFeed(sampleRecords))));
  if (!toolbenchRecords.length) {
    setNamedSearchStatus("sampleDataUnavailable");
    return;
  }
  if (recoveryTargetDemoRequested()) {
    primeRecoveryTargetDemoState();
  }
  setupPulseInteractions();

  renderAccess();
  renderQuickPicks();
  renderV1Roster();
  const savedReport = initialSavedReport();
  const startingRecord = savedReport
    ? toolbenchRecords.find((record) => record.id === savedReport.recordId)
    : initialRecord();
  renderRecord(startingRecord);
  const openedFromPreview = window.location.protocol !== "file:" && queryParam("from") === "preview";
  if (openedFromPreview) {
    setNamedSearchStatus("previewHandoff");
    removeQueryParam("from");
  }
  const restoredReviewItem = activeReviewItemFromState();
  if (restoredReviewItem) {
    if (restoredReviewItem.record.id !== toolbenchRecord?.id) {
      renderRecord(restoredReviewItem.record);
    }
    jumpToV1HealthLabel(restoredReviewItem.label);
    setNamedSearchStatus("restoreReviewItem", {
      title: restoredReviewItem.record.title,
      label: restoredReviewItem.label
    });
  } else if (toolbenchQueueLensRestoredOnInit && !openedFromPreview) {
    setNamedSearchStatus(
      recoveryTargetDemoRequested()
        ? "recoveryTargetDemoPrimed"
        : "queueLensRestored",
      recoveryTargetDemoRequested()
        ? {}
        : {
            filter: quickPickFilterDescription(),
            sort: quickPickSortDescription()
          }
    );
  }
  toolbenchQueueLensRestoredOnInit = false;
  if (savedReport) restoreSavedReport(savedReport, { announce: true });
  renderSavedReports();
  renderWatchlist();

  toolbenchEl.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const record = findRecord(toolbenchEl.input.value);
    if (!record) {
      setNamedSearchStatus("areaNotRecognized");
      return;
    }
    clearQuickPickBookmarkOpenedState({ render: false });
    dismissBackendPreviewNotice();
    renderRecord(record);
    renderQuickPicks();
    renderV1Roster();
    setNamedSearchStatus("recordLoaded", { title: record.title });
  });
  if (toolbenchEl.v1EditorForm) {
    toolbenchEl.v1EditorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveV1Context();
    });
  }
  if (toolbenchEl.v1HealthAction) {
    toolbenchEl.v1HealthAction.addEventListener("click", () => {
      const label = toolbenchEl.v1HealthAction.dataset.targetLabel || "";
      if (!label) return;
      jumpToV1HealthLabel(label);
    });
  }
  if (toolbenchEl.v1HealthNextRecord) {
    toolbenchEl.v1HealthNextRecord.addEventListener("click", () => {
      loadNextReviewQueueItem();
    });
  }
  if (toolbenchEl.v1HealthResetPass) {
    toolbenchEl.v1HealthResetPass.addEventListener("click", () => {
      resetCurrentReviewPass();
    });
  }
  if (toolbenchEl.v1RosterRestore) {
    toolbenchEl.v1RosterRestore.addEventListener("click", () => {
      setBackendPreviewFocusTarget("restore");
      restoreBackendReviewPassScope();
    });
  }
  if (toolbenchEl.v1RosterRestoreJump) {
    toolbenchEl.v1RosterRestoreJump.addEventListener("click", () => {
      setBackendPreviewFocusTarget("restoreJump");
      restoreBackendReviewPassScope({ jumpToActive: true });
    });
  }
  if (toolbenchEl.v1RosterBackend) {
    toolbenchEl.v1RosterBackend.addEventListener("click", () => {
      setBackendPreviewFocusTarget("badge");
      if (!canUseBackendReviewPass() && inStaticWorkspacePreview()) {
        openFullWorkspaceHandoff();
        return;
      }
      toggleBackendReviewPassPreview();
    });
  }
  if (toolbenchEl.v1RosterBackendPreview) {
    const dismissPreviewHintOnInteraction = () => {
      if (!toolbenchBackendPreviewFocusHint || toolbenchBackendPreviewFocusHintDismissed) return;
      dismissBackendPreviewFocusHint({ render: false });
    };
    toolbenchEl.v1RosterBackendPreview.addEventListener("pointerdown", dismissPreviewHintOnInteraction);
    toolbenchEl.v1RosterBackendPreview.addEventListener("keydown", dismissPreviewHintOnInteraction);
  }
  if (toolbenchEl.v1RosterClear) {
    toolbenchEl.v1RosterClear.addEventListener("click", () => {
      setBackendPreviewFocusTarget("clear");
      clearLocalReviewPassScope();
    });
  }
  if (toolbenchEl.v1Roster) {
    toolbenchEl.v1Roster.querySelectorAll("[data-filter]").forEach((item) => {
      const apply = () => applyV1RosterFilter(item.dataset.filter || "all");
      item.addEventListener("click", apply);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          apply();
        }
      });
    });
  }
  if (toolbenchEl.openFullWorkspace) {
    toolbenchEl.openFullWorkspace.addEventListener("click", () => {
      openFullWorkspaceHandoff();
    });
  }
  if (toolbenchEl.v1RosterSort) {
    toolbenchEl.v1RosterSort.querySelectorAll("[data-sort]").forEach((button) => {
      const apply = () => applyV1QuickPickSortMode(button.dataset.sort || "default");
      button.addEventListener("click", apply);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          apply();
        }
      });
    });
  }
  if (toolbenchEl.v1RosterFocusStrongest) {
    const apply = () => focusStrongestQuickPick();
    toolbenchEl.v1RosterFocusStrongest.addEventListener("click", apply);
    toolbenchEl.v1RosterFocusStrongest.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterFocusWeakest) {
    const apply = () => focusWeakestQuickPick();
    toolbenchEl.v1RosterFocusWeakest.addEventListener("click", apply);
    toolbenchEl.v1RosterFocusWeakest.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterRouteBadge) {
    const apply = () => focusHighestPrioritySummary();
    toolbenchEl.v1RosterRouteBadge.addEventListener("click", apply);
    toolbenchEl.v1RosterRouteBadge.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterPrioritySummary) {
    const apply = () => focusHighestPriorityRouteBadge();
    toolbenchEl.v1RosterPrioritySummary.addEventListener("click", apply);
    toolbenchEl.v1RosterPrioritySummary.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterRouteLinkReset) {
    const apply = () => resetRouteGuidanceTips();
    toolbenchEl.v1RosterRouteLinkReset.addEventListener("click", apply);
    toolbenchEl.v1RosterRouteLinkReset.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterReturnCurrent) {
    const apply = () => returnToCurrentQuickPick();
    toolbenchEl.v1RosterReturnCurrent.addEventListener("click", apply);
    toolbenchEl.v1RosterReturnCurrent.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterBookmarkLens) {
    const apply = () => saveQuickPickBookmark();
    toolbenchEl.v1RosterBookmarkLens.addEventListener("click", apply);
    toolbenchEl.v1RosterBookmarkLens.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterOpenBookmark) {
    const apply = () => openQuickPickBookmark();
    toolbenchEl.v1RosterOpenBookmark.addEventListener("click", apply);
    toolbenchEl.v1RosterOpenBookmark.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterOpenPriorityBookmark) {
    const apply = () => openHighestPriorityQuickPickBookmark();
    toolbenchEl.v1RosterOpenPriorityBookmark.addEventListener("click", apply);
    toolbenchEl.v1RosterOpenPriorityBookmark.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterApplyPlanningAction) {
    const apply = () => applyPriorityLanePlanningAction();
    toolbenchEl.v1RosterApplyPlanningAction.addEventListener("click", apply);
    toolbenchEl.v1RosterApplyPlanningAction.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterFollowRecoveryTarget) {
    const apply = () => followRecoveryTargetQuickPick();
    toolbenchEl.v1RosterFollowRecoveryTarget.addEventListener("click", apply);
    toolbenchEl.v1RosterFollowRecoveryTarget.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterRefreshBookmark) {
    const apply = () => refreshCurrentQuickPickBookmark();
    toolbenchEl.v1RosterRefreshBookmark.addEventListener("click", apply);
    toolbenchEl.v1RosterRefreshBookmark.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterSortBookmarkList) {
    const apply = (event) => {
      const button = event.target?.closest?.("[data-bookmark-key]");
      if (!button) return;
      openQuickPickBookmark(button.dataset.bookmarkKey || "");
    };
    toolbenchEl.v1RosterSortBookmarkList.addEventListener("click", apply);
    toolbenchEl.v1RosterSortBookmarkList.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const button = event.target?.closest?.("[data-bookmark-key]");
      if (!button) return;
      event.preventDefault();
      openQuickPickBookmark(button.dataset.bookmarkKey || "");
    });
  }
  if (toolbenchEl.v1RosterResetLens) {
    const apply = () => resetQuickPickQueueLens();
    toolbenchEl.v1RosterResetLens.addEventListener("click", apply);
    toolbenchEl.v1RosterResetLens.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterDismissMemory) {
    const apply = () => dismissQueueLensMemory();
    toolbenchEl.v1RosterDismissMemory.addEventListener("click", apply);
    toolbenchEl.v1RosterDismissMemory.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterSortMemoryActivity) {
    toolbenchEl.v1RosterSortMemoryActivity.addEventListener("click", (event) => {
      const dismissButton = event.target instanceof Element
        ? event.target.closest("[data-activity-dismiss]")
        : null;
      if (dismissButton) {
        const index = Number.parseInt(dismissButton.dataset.activityDismiss || "", 10);
        if (!Number.isFinite(index)) return;
        dismissQuickPickLaneActivity(index);
        return;
      }
      const button = event.target instanceof Element
        ? event.target.closest("[data-activity-index]")
        : null;
      if (!button) return;
      const index = Number.parseInt(button.dataset.activityIndex || "", 10);
      if (!Number.isFinite(index)) return;
      replayQuickPickLaneActivity(index);
    });
  }
  if (toolbenchEl.v1RosterRecentActionsList) {
    toolbenchEl.v1RosterRecentActionsList.addEventListener("click", (event) => {
      const dismissButton = event.target instanceof Element
        ? event.target.closest("[data-activity-dismiss]")
        : null;
      if (dismissButton) {
        const index = Number.parseInt(dismissButton.dataset.activityDismiss || "", 10);
        if (!Number.isFinite(index)) return;
        dismissQuickPickLaneActivity(index);
        return;
      }
      const button = event.target instanceof Element
        ? event.target.closest("[data-activity-index]")
        : null;
      if (!button) return;
      const index = Number.parseInt(button.dataset.activityIndex || "", 10);
      if (!Number.isFinite(index)) return;
      replayQuickPickLaneActivity(index);
    });
  }
  if (toolbenchEl.v1RosterRecentActionsClear) {
    const apply = () => clearQuickPickLaneActivity();
    toolbenchEl.v1RosterRecentActionsClear.addEventListener("click", apply);
    toolbenchEl.v1RosterRecentActionsClear.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1RosterRecentActionsUndo) {
    const apply = () => undoQuickPickLaneActivityChange();
    toolbenchEl.v1RosterRecentActionsUndo.addEventListener("click", apply);
    toolbenchEl.v1RosterRecentActionsUndo.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        apply();
      }
    });
  }
  if (toolbenchEl.v1ContextMeta) {
    toolbenchEl.v1ContextMeta.addEventListener("click", handleV1ContextMetaAction);
    toolbenchEl.v1ContextMeta.addEventListener("keydown", (event) => {
      const actionTarget = event.target?.closest?.("[data-action]");
      if (!actionTarget || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      handleV1ContextMetaAction(event);
    });
  }
  if (toolbenchEl.v1ContextPack) {
    toolbenchEl.v1ContextPack.addEventListener("click", handleV1ReadCardAction);
    toolbenchEl.v1ContextPack.addEventListener("keydown", (event) => {
      const actionTarget = event.target?.closest?.("[data-action]");
      if (!actionTarget || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      handleV1ReadCardAction(event);
    });
  }
  if (toolbenchEl.v1ContextWhyToggle) {
    toolbenchEl.v1ContextWhyToggle.addEventListener("click", () => {
      toolbenchV1CommercialWhyOpen = !toolbenchV1CommercialWhyOpen;
      renderV1CommercialWhy(toolbenchV1CommercialWhyItems, toolbenchEl.v1ContextSummary?.dataset?.tone || "");
    });
  }
  if (toolbenchEl.v1ContextWhy) {
    toolbenchEl.v1ContextWhy.addEventListener("click", handleV1ReadCardAction);
    toolbenchEl.v1ContextWhy.addEventListener("keydown", (event) => {
      const actionTarget = event.target?.closest?.("[data-action]");
      if (!actionTarget || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      handleV1ReadCardAction(event);
    });
  }
  if (toolbenchEl.v1EditorNav) {
    toolbenchEl.v1EditorNav.addEventListener("click", (event) => {
      const button = event.target?.closest?.("[data-section-target]");
      const sectionKey = button?.dataset?.sectionTarget || "";
      if (!sectionKey) return;
      toolbenchV1ValidationSectionFilter = button.dataset.validation === "warning" ? sectionKey : "";
      renderV1Validation();
      focusV1EditorSection(
        sectionKey,
        button.dataset.validation === "warning"
          ? `Jumped to the ${sectionKey.replace(/-/g, " ")} section and filtered validation to its review points.`
          : `Jumped to the ${sectionKey.replace(/-/g, " ")} section in the V1 editor.`,
        `Section: ${sectionKey.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}`
      );
      if (button.dataset.validation === "warning") {
        revealWorkspaceSection(toolbenchEl.v1Validation || toolbenchEl.v1ValidationTitle);
      }
    });
  }
  if (toolbenchEl.sourceTimelineActions) {
    toolbenchEl.sourceTimelineActions.addEventListener("click", (event) => {
      const reviewedToggle = event.target?.closest?.("[data-role='reviewed-toggle']");
      if (reviewedToggle) {
        toolbenchSourceTimelineReviewedExpanded = !toolbenchSourceTimelineReviewedExpanded;
        renderWorkspaceSourceTimeline(toolbenchRecord);
        return;
      }
      const nextButton = event.target?.closest?.("[data-source-next]");
      const nextSectionKey = nextButton?.dataset?.sourceNext || "";
      if (nextSectionKey) {
        markReviewedRefreshedContextSection(nextSectionKey);
        revealWorkspaceSection(toolbenchEl.v1EditorForm || toolbenchEl.v1EditorTitle);
        focusV1EditorSection(
          nextSectionKey,
          `Continued the refreshed-layer review flow in ${v1ValidationSectionLabel(nextSectionKey)}.`,
          `Source Refresh: ${v1ValidationSectionLabel(nextSectionKey)}`
        );
        return;
      }
      const button = event.target?.closest?.("[data-source-section-target]");
      const sectionKey = button?.dataset?.sourceSectionTarget || "";
      if (!sectionKey) return;
      markReviewedRefreshedContextSection(sectionKey);
      revealWorkspaceSection(toolbenchEl.v1EditorForm || toolbenchEl.v1EditorTitle);
      focusV1EditorSection(
        sectionKey,
        `Reviewed the refreshed ${v1ValidationSectionLabel(sectionKey)} section and jumped into the V1 editor.`,
        `Source Refresh: ${v1ValidationSectionLabel(sectionKey)}`
      );
    });
  }
  if (toolbenchEl.v1ValidationClear) {
    toolbenchEl.v1ValidationClear.addEventListener("click", () => {
      const completedSection = toolbenchRecentlyCompletedValidationSection;
      const returningFromCompletedSection = Boolean(
        completedSection &&
        toolbenchV1ValidationSectionFilter &&
        toolbenchV1ValidationSectionFilter === completedSection
      );
      const nextWarning = returningFromCompletedSection
        ? firstV1ValidationWarning()
        : null;
      if (toolbenchRecentlyCompletedValidationSectionTimer) {
        window.clearTimeout(toolbenchRecentlyCompletedValidationSectionTimer);
        toolbenchRecentlyCompletedValidationSectionTimer = null;
      }
      toolbenchRecentlyCompletedValidationSection = "";
      toolbenchPendingValidationClearFocus = false;
      toolbenchV1ValidationSectionFilter = "";
      renderV1Validation();
      if (nextWarning?.target) {
        toolbenchActiveValidationWarningKey = nextWarning.key || "";
        focusV1EditorControl(
          nextWarning.target,
          `Returned to the full V1 validation view and loaded the next remaining warning in ${v1ValidationSectionLabel(nextWarning.section)}.`,
          `Validation: ${v1ValidationSectionLabel(nextWarning.section)}`
        );
      } else {
        setSearchStatus("Restored the full V1 validation view.", {
          autoClearMs: toolbenchStatusDurations.reviewStep,
          tone: "info"
        });
      }
    });
  }
  if (toolbenchEl.v1EditorForm) {
    toolbenchEl.v1EditorForm.addEventListener("focusin", (event) => {
      syncActiveV1EditorSectionFromTarget(event.target);
    });
    toolbenchEl.v1EditorForm.addEventListener("pointerdown", (event) => {
      const target = event.target?.closest?.("input, select, textarea, button, label, .workspace-v1-editor-section");
      if (!target) return;
      syncActiveV1EditorSectionFromTarget(target);
    });
  }
  const v1LiveInputs = [
    toolbenchEl.v1BenchmarkLowInput,
    toolbenchEl.v1BenchmarkHighInput,
    toolbenchEl.v1AskingPsfInput,
    toolbenchEl.v1VerdictInput,
    toolbenchEl.v1ConfidenceInput,
    toolbenchEl.v1DecisionInput,
    toolbenchEl.v1ValueGapInput,
    toolbenchEl.v1ValueGapStatusInput,
    toolbenchEl.v1GapDirectionInput,
    toolbenchEl.v1ValueGapScoreInput,
    toolbenchEl.v1LikelyDriversInput,
    toolbenchEl.v1ValueGapCautionsInput,
    toolbenchEl.v1TradePatternInput,
    toolbenchEl.v1CategoryMixInput,
    toolbenchEl.v1OperatorsInput,
    toolbenchEl.v1CompetitionFlagsInput,
    toolbenchEl.v1ComplementaryFlagsInput,
    toolbenchEl.v1DaypartSignalsInput,
    toolbenchEl.v1AngleInput,
    toolbenchEl.v1FitScoresInput,
    toolbenchEl.v1GoodFitInput,
    toolbenchEl.v1CautionInput,
    toolbenchEl.v1WatchoutsInput
  ];

  v1LiveInputs.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      refreshV1GapPreview();
      renderV1ContextMeta(toolbenchContextDraft);
    });
    input.addEventListener("change", () => {
      renderV1Validation();
      renderV1ContextMeta(toolbenchContextDraft);
    });
  });

  document.querySelectorAll("[data-member-range]").forEach((button) => {
    button.addEventListener("click", () => {
      toolbenchRange = button.dataset.memberRange;
      document.querySelectorAll("[data-member-range]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      drawMemberChart();
      renderEvidenceTable();
    });
  });

  toolbenchEl.saveButton.addEventListener("click", saveReport);
  toolbenchEl.watchButton.addEventListener("click", watchArea);
  toolbenchEl.exportEvidenceButton.addEventListener("click", exportEvidenceCsv);
  toolbenchEl.calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderCalculator();
  });
  [toolbenchEl.calculatorUnitSize, toolbenchEl.calculatorAskingPsf, toolbenchEl.calculatorTargetPsf].forEach((input) => {
    input.addEventListener("input", renderCalculator);
  });
  toolbenchEl.useFairHighButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.calculatorTargetPsf.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderCalculator();
  });
  toolbenchEl.useOfficialButton.addEventListener("click", () => {
    if (!toolbenchRecord) return;
    toolbenchEl.calculatorTargetPsf.value = toolbenchRecord.official.toFixed(2);
    renderCalculator();
  });
  toolbenchEl.offerBuilderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderOfferBuilder();
  });
  [
    toolbenchEl.offerPsfInput,
    toolbenchEl.walkAwayPsfInput,
    toolbenchEl.leaseMonthsInput,
    toolbenchEl.rentFreeMonthsInput
  ].forEach((input) => {
    input.addEventListener("input", renderOfferBuilder);
  });
  toolbenchEl.useFairLowOfferButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.offerPsfInput.value = toolbenchRecord.fairRange.low.toFixed(2);
    renderOfferBuilder();
  });
  toolbenchEl.useFairHighWalkButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.walkAwayPsfInput.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderOfferBuilder();
  });
  toolbenchEl.appendOfferNoteButton.addEventListener("click", appendOfferToNote);
  toolbenchEl.alertRuleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAlertRule();
  });
  [
    toolbenchEl.alertTriggerSelect,
    toolbenchEl.alertTargetPsfInput,
    toolbenchEl.alertGapLimitInput,
    toolbenchEl.alertCadenceSelect
  ].forEach((control) => {
    control.addEventListener("input", renderAlertRule);
    control.addEventListener("change", renderAlertRule);
  });
  toolbenchEl.useWalkAwayAlertButton.addEventListener("click", () => {
    if (!toolbenchRecord?.fairRange) return;
    toolbenchEl.alertTriggerSelect.value = "asking-below-target";
    toolbenchEl.alertTargetPsfInput.value = toolbenchRecord.fairRange.high.toFixed(2);
    renderAlertRule();
  });
  toolbenchEl.useAskingGapAlertButton.addEventListener("click", () => {
    if (!toolbenchRecord) return;
    toolbenchEl.alertTriggerSelect.value = "gap-above-limit";
    toolbenchEl.alertGapLimitInput.value = String(Math.max(toolbenchRecord.gap, 1));
    renderAlertRule();
  });
  toolbenchEl.appendAlertRuleNoteButton.addEventListener("click", appendAlertRuleToNote);
  toolbenchEl.exportButton.addEventListener("click", () => {
    toolbenchEl.noteStatus.textContent = hasToolbenchAccess()
      ? toolbenchReviewPassMessages.workspace.noteReadyStatus()
      : toolbenchReviewPassMessages.workspace.noteLockedStatus();
    toolbenchEl.note.focus();
  });
  toolbenchEl.copyNoteButton.addEventListener("click", copyNote);
  toolbenchEl.downloadNoteButton.addEventListener("click", downloadNote);
  toolbenchEl.renderModeAuto?.addEventListener("click", () => setToolbenchRenderModeOverride("auto"));
  toolbenchEl.renderModeStandard?.addEventListener("click", () => setToolbenchRenderModeOverride("standard"));
  toolbenchEl.renderModeSafe?.addEventListener("click", () => setToolbenchRenderModeOverride("embed-safe"));
  toolbenchEl.copyRenderDiagnostics?.addEventListener("click", copyToolbenchRenderDiagnostics);
  toolbenchEl.markRenderSame?.addEventListener("click", () => setToolbenchRenderVerdict("host"));
  toolbenchEl.markRenderDifferent?.addEventListener("click", () => setToolbenchRenderVerdict("page"));
  toolbenchEl.clearRenderVerdict?.addEventListener("click", () => setToolbenchRenderVerdict(""));
  toolbenchEl.enableRecoveryTargetDemo?.addEventListener("click", () => setRecoveryTargetDemoMode(true));
  toolbenchEl.disableRecoveryTargetDemo?.addEventListener("click", () => setRecoveryTargetDemoMode(false));
  window.addEventListener("resize", () => {
    drawMemberChart();
    renderToolbenchDiagnostics();
  });
}

initToolbench().catch((error) => {
  console.error("Toolbench init failed.", error);
  setNamedSearchStatus("workspaceInitFailed");
});
