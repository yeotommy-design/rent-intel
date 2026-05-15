const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const ROOT_DIR = __dirname;
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 4173);
const SESSION_COOKIE = "rentintel_session";
const LOGIN_CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DB_DIR = path.join(ROOT_DIR, "backend", "data");
const DB_FILE = path.join(DB_DIR, "prototype-db.json");
const SQLITE_FILE = path.join(DB_DIR, "prototype.sqlite");
const ALERT_DELIVERY_DIR = path.join(DB_DIR, "alert-deliveries");
const ASKING_FEED_FILE = path.join(ROOT_DIR, "data", "sources", "asking-rent-feed.json");
const SQLITE_BINARY = process.env.SQLITE3_BIN || "/usr/bin/sqlite3";
const CURL_BINARY = process.env.CURL_BIN || "/usr/bin/curl";
const DB_ENGINE = (process.env.RENTINTEL_DB_ENGINE || "sqlite").trim().toLowerCase();
const EMAIL_TRANSPORT = (process.env.RENTINTEL_EMAIL_TRANSPORT || "file").trim().toLowerCase();
const EMAIL_FROM = String(process.env.RENTINTEL_EMAIL_FROM || "alerts@rent-intel.local").trim() || "alerts@rent-intel.local";
const SMTP_URL = String(process.env.RENTINTEL_SMTP_URL || "").trim();
const SMTP_USER = String(process.env.RENTINTEL_SMTP_USER || "").trim();
const SMTP_PASS = String(process.env.RENTINTEL_SMTP_PASS || "").trim();
const execFileAsync = promisify(execFile);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function hashValue(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function randomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString("hex");
}

function deliveryStatusLabel(status = "") {
  const labels = {
    queued: "Queued",
    sent: "Sent",
    failed: "Failed",
    acknowledged: "Acknowledged",
    suppressed: "Suppressed",
    skipped: "Skipped",
    "dead-letter": "Dead Letter"
  };
  return labels[String(status || "").trim().toLowerCase()] || "Queued";
}

function sanitizeFileSegment(value = "", fallback = "item") {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function activeEmailTransportMode() {
  if (EMAIL_TRANSPORT === "smtp" && SMTP_URL) return "smtp";
  return "file";
}

function emailTransportSummary() {
  const mode = activeEmailTransportMode();
  return {
    mode,
    from: EMAIL_FROM,
    smtpConfigured: Boolean(SMTP_URL),
    smtpUrl: mode === "smtp" ? SMTP_URL : "",
    fallbackMode: "file"
  };
}

function toMemberRecord(member = {}) {
  const email = normalizeEmail(member.email);
  if (!email) return null;
  const role = String(member.role || (member.isAdmin ? "admin" : "member")).toLowerCase() === "admin"
    ? "admin"
    : "member";
  return {
    email,
    memberStatus: member.memberStatus || member.member_status || "Waitlist email",
    subscriptionStatus: member.subscriptionStatus || member.subscription_status || "Waiting for member activation",
    access: member.access || "waitlist",
    role,
    promoCode: member.promoCode || member.promo_code || "",
    toolsEnabled: Boolean(member.toolsEnabled ?? member.tools_enabled),
    createdAt: member.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

async function ensureDb() {
  await fsp.mkdir(DB_DIR, { recursive: true });
  await fsp.mkdir(ALERT_DELIVERY_DIR, { recursive: true });
  if (DB_ENGINE === "sqlite") {
    await ensureSqliteDb();
    return;
  }
  try {
    await fsp.access(DB_FILE, fs.constants.F_OK);
  } catch {
    const initial = await buildInitialDbState();
    await fsp.writeFile(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

async function buildInitialDbState() {
  const seedMembers = JSON.parse(await fsp.readFile(path.join(ROOT_DIR, "data", "rentintel-members.json"), "utf8"));
  const members = Array.isArray(seedMembers.members) ? seedMembers.members.map(toMemberRecord).filter(Boolean) : [];
  const seedAskingFeed = JSON.parse(await fsp.readFile(ASKING_FEED_FILE, "utf8"));
  return {
    members,
    loginCodes: [],
    sessions: [],
    savedReports: [],
    watchlist: [],
    alertRules: [],
    alertDeliveries: [],
    alertDeliveryRuns: [],
    alertDeliveryAdminLog: [],
    deliveredMessages: [],
    askingSourceCandidates: [],
    coverageSampleRecords: [],
    sourceReviewHistory: [],
    sourceSyncRuns: [],
    sourceSyncSchedule: {},
    sourceFreshnessPolicy: {
      freshMaxDays: 7,
      watchMaxDays: 14,
      updatedAt: "",
      updatedBy: ""
    },
    sourceFreshnessBreachEvents: [],
    askingRentFeed: seedAskingFeed,
    productionEvidence: {},
    backendHandoffAudit: [],
    activationRequests: [],
    roleAuditLog: [],
    promoCodes: [
      {
        code: "RENTINTEL-PILOT",
        access: "promo",
        description: "Pilot promo access",
        active: true,
        redeemedCount: 0
      },
      {
        code: "DOOMSDAY01",
        access: "promo",
        description: "Doomsday pilot promo access",
        active: true,
        redeemedCount: 0
      }
    ],
    notificationPreferences: {}
  };
}

async function readDb() {
  await ensureDb();
  if (DB_ENGINE === "sqlite") {
    return await readSqliteDb();
  }
  const raw = await fsp.readFile(DB_FILE, "utf8");
  const db = JSON.parse(raw);
  db.members = Array.isArray(db.members) ? db.members : [];
  db.loginCodes = Array.isArray(db.loginCodes) ? db.loginCodes : [];
  db.sessions = Array.isArray(db.sessions) ? db.sessions : [];
  db.savedReports = Array.isArray(db.savedReports) ? db.savedReports : [];
  db.watchlist = Array.isArray(db.watchlist) ? db.watchlist : [];
  db.alertRules = Array.isArray(db.alertRules) ? db.alertRules : [];
  db.alertDeliveries = Array.isArray(db.alertDeliveries) ? db.alertDeliveries : [];
  db.alertDeliveryRuns = Array.isArray(db.alertDeliveryRuns) ? db.alertDeliveryRuns : [];
  db.alertDeliveryAdminLog = Array.isArray(db.alertDeliveryAdminLog) ? db.alertDeliveryAdminLog : [];
  db.deliveredMessages = Array.isArray(db.deliveredMessages) ? db.deliveredMessages : [];
  db.askingSourceCandidates = Array.isArray(db.askingSourceCandidates) ? db.askingSourceCandidates : [];
  db.coverageSampleRecords = Array.isArray(db.coverageSampleRecords) ? db.coverageSampleRecords : [];
  db.sourceReviewHistory = Array.isArray(db.sourceReviewHistory) ? db.sourceReviewHistory : [];
  db.sourceSyncRuns = Array.isArray(db.sourceSyncRuns) ? db.sourceSyncRuns : [];
  db.sourceSyncSchedule = db.sourceSyncSchedule && typeof db.sourceSyncSchedule === "object" ? db.sourceSyncSchedule : {};
  db.sourceFreshnessPolicy = db.sourceFreshnessPolicy && typeof db.sourceFreshnessPolicy === "object"
    ? db.sourceFreshnessPolicy
    : { freshMaxDays: 7, watchMaxDays: 14, updatedAt: "", updatedBy: "" };
  db.sourceFreshnessBreachEvents = Array.isArray(db.sourceFreshnessBreachEvents) ? db.sourceFreshnessBreachEvents : [];
  db.askingRentFeed = db.askingRentFeed && typeof db.askingRentFeed === "object"
    ? db.askingRentFeed
    : JSON.parse(await fsp.readFile(ASKING_FEED_FILE, "utf8"));
  db.productionEvidence = db.productionEvidence && typeof db.productionEvidence === "object" ? db.productionEvidence : {};
  db.backendHandoffAudit = Array.isArray(db.backendHandoffAudit) ? db.backendHandoffAudit : [];
  db.activationRequests = Array.isArray(db.activationRequests) ? db.activationRequests : [];
  db.roleAuditLog = Array.isArray(db.roleAuditLog) ? db.roleAuditLog : [];
  db.promoCodes = Array.isArray(db.promoCodes) ? db.promoCodes : [];
  let promoCodesChanged = false;
  if (!db.promoCodes.some((entry) => String(entry.code || "").trim().toUpperCase() === "RENTINTEL-PILOT")) {
    db.promoCodes.unshift({
      code: "RENTINTEL-PILOT",
      access: "promo",
      description: "Pilot promo access",
      active: true,
      redeemedCount: 0
    });
    promoCodesChanged = true;
  }
  if (!db.promoCodes.some((entry) => String(entry.code || "").trim().toUpperCase() === "DOOMSDAY01")) {
    db.promoCodes.unshift({
      code: "DOOMSDAY01",
      access: "promo",
      description: "Doomsday pilot promo access",
      active: true,
      redeemedCount: 0
    });
    promoCodesChanged = true;
  }
  if (promoCodesChanged) await writeDb(db);
  db.notificationPreferences = db.notificationPreferences && typeof db.notificationPreferences === "object"
    ? db.notificationPreferences
    : {};
  return db;
}

async function writeDb(db) {
  if (DB_ENGINE === "sqlite") {
    await writeSqliteDb(db);
    return;
  }
  await fsp.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

function sqliteJsonLiteral(value) {
  return `CAST(X'${Buffer.from(String(value), "utf8").toString("hex")}' AS TEXT)`;
}

async function runSqlite(sql, options = {}) {
  const args = [];
  if (options.json) args.push("-json");
  args.push(SQLITE_FILE, sql);
  const { stdout } = await execFileAsync(SQLITE_BINARY, args, {
    cwd: ROOT_DIR,
    maxBuffer: 10 * 1024 * 1024
  });
  return String(stdout || "").trim();
}

async function ensureSqliteDb() {
  await runSqlite(`
    create table if not exists schema_migrations (
      version text primary key,
      description text not null,
      applied_at text not null
    );
    create table if not exists app_state (
      id integer primary key check (id = 1),
      state_json text not null,
      updated_at text not null
    );
    create table if not exists member_alert_deliveries (
      id text primary key,
      member_email text not null,
      record_id text not null,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_member_alert_deliveries_member_email
      on member_alert_deliveries(member_email, updated_at desc);
    create table if not exists member_alert_delivery_runs (
      id text primary key,
      member_email text not null,
      run_id text not null,
      payload_json text not null,
      finished_at text not null
    );
    create index if not exists idx_member_alert_delivery_runs_member_email
      on member_alert_delivery_runs(member_email, finished_at desc);
    create table if not exists member_alert_delivery_admin_log (
      id text primary key,
      member_email text not null,
      record_id text not null,
      payload_json text not null,
      acted_at text not null
    );
    create index if not exists idx_member_alert_delivery_admin_log_member_email
      on member_alert_delivery_admin_log(member_email, acted_at desc);
    create table if not exists member_alert_delivered_messages (
      id text primary key,
      member_email text not null,
      run_id text,
      record_id text not null,
      payload_json text not null,
      delivered_at text not null
    );
    create index if not exists idx_member_alert_delivered_messages_member_email
      on member_alert_delivered_messages(member_email, delivered_at desc);
    create table if not exists members (
      id text primary key,
      email text not null unique,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_members_email on members(email);
    create table if not exists login_codes (
      id text primary key,
      member_email text not null,
      payload_json text not null,
      created_at text not null
    );
    create index if not exists idx_login_codes_member_email
      on login_codes(member_email, created_at desc);
    create table if not exists sessions (
      id text primary key,
      member_email text not null,
      session_hash text not null unique,
      payload_json text not null,
      created_at text not null
    );
    create index if not exists idx_sessions_member_email
      on sessions(member_email, created_at desc);
    create table if not exists member_saved_reports (
      id text primary key,
      member_email text not null,
      record_id text not null,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_member_saved_reports_member_email
      on member_saved_reports(member_email, updated_at desc);
    create table if not exists member_watchlist_areas (
      id text primary key,
      member_email text not null,
      record_id text not null,
      payload_json text not null,
      added_at text not null
    );
    create index if not exists idx_member_watchlist_areas_member_email
      on member_watchlist_areas(member_email, added_at desc);
    create table if not exists member_alert_rules (
      id text primary key,
      member_email text not null,
      record_id text not null,
      trigger_key text not null,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_member_alert_rules_member_email
      on member_alert_rules(member_email, updated_at desc);
    create table if not exists member_notification_preferences (
      id text primary key,
      member_email text not null unique,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_member_notification_preferences_member_email
      on member_notification_preferences(member_email);
    create table if not exists promo_codes (
      id text primary key,
      code text not null unique,
      payload_json text not null,
      created_at text not null
    );
    create index if not exists idx_promo_codes_code on promo_codes(code);
    create table if not exists member_activation_requests (
      id text primary key,
      email text not null,
      payload_json text not null,
      requested_at text not null
    );
    create index if not exists idx_member_activation_requests_email
      on member_activation_requests(email, requested_at desc);
    create table if not exists member_role_audit_log (
      id text primary key,
      member_email text not null,
      target_email text not null,
      payload_json text not null,
      acted_at text not null
    );
    create index if not exists idx_member_role_audit_log_member_email
      on member_role_audit_log(member_email, acted_at desc);
    create table if not exists asking_source_candidates (
      id text primary key,
      candidate_type text not null,
      candidate_name text not null,
      payload_json text not null,
      updated_at text not null
    );
    create index if not exists idx_asking_source_candidates_updated_at
      on asking_source_candidates(updated_at desc);
    create table if not exists coverage_sample_records (
      id text primary key,
      candidate_id text not null,
      record_id text not null unique,
      payload_json text not null,
      created_at text not null
    );
    create index if not exists idx_coverage_sample_records_candidate_id
      on coverage_sample_records(candidate_id, created_at desc);
    create table if not exists source_review_history (
      id text primary key,
      candidate_id text,
      action text not null,
      payload_json text not null,
      created_at text not null
    );
    create index if not exists idx_source_review_history_candidate_id
      on source_review_history(candidate_id, created_at desc);
    create table if not exists source_sync_runs (
      id text primary key,
      member_email text not null,
      source_name text not null,
      payload_json text not null,
      ran_at text not null
    );
    create index if not exists idx_source_sync_runs_ran_at
      on source_sync_runs(ran_at desc);
    create table if not exists source_sync_schedule (
      id text primary key,
      source_name text not null unique,
      payload_json text not null,
      updated_at text not null
    );
    create table if not exists source_freshness_policy (
      id text primary key,
      policy_key text not null unique,
      payload_json text not null,
      updated_at text not null
    );
    create table if not exists source_freshness_breach_events (
      id text primary key,
      source_name text not null,
      payload_json text not null,
      breach_at text not null
    );
    create index if not exists idx_source_freshness_breach_events_breach_at
      on source_freshness_breach_events(breach_at desc);
    create table if not exists asking_source_production_evidence (
      id text primary key,
      source_name text,
      payload_json text not null,
      updated_at text not null
    );
    create table if not exists backend_handoff_audit (
      id text primary key,
      member_email text not null,
      payload_json text not null,
      generated_at text not null
    );
    create index if not exists idx_backend_handoff_audit_member_email
      on backend_handoff_audit(member_email, generated_at desc);
  `);
  await recordSqliteMigration("001-normalized-member-core", "Normalize member/auth/report/watchlist/alert-rule tables.");
  await recordSqliteMigration("002-normalized-member-admin", "Normalize notification preferences, promo codes, activation requests, and role audit.");
  await recordSqliteMigration("003-normalized-source-ops", "Normalize source review, sync, freshness, production evidence, and handoff audit.");
  await recordSqliteMigration("004-route-sql-and-ops-report", "Add direct SQL route helpers, transactions, and ops reporting.");
  await recordSqliteMigration("005-source-route-sql", "Move source/admin workflows onto direct SQLite route reads and transactional writes.");
  const existing = await runSqlite("select id from app_state where id = 1;", { json: true });
  const rows = existing ? JSON.parse(existing) : [];
  if (Array.isArray(rows) && rows.length) return;
  let initialState;
  try {
    const raw = await fsp.readFile(DB_FILE, "utf8");
    initialState = JSON.parse(raw);
  } catch {
    initialState = await buildInitialDbState();
  }
  await writeSqliteDb(initialState, { mirrorJson: true });
}

function sqliteRowJsonInsert(table, rows, options = {}) {
  const columnName = options.columnName || "payload_json";
  if (!Array.isArray(rows) || !rows.length) {
    return `delete from ${table};`;
  }
  const values = rows.map((row) => {
    const emailField = options.emailField || "memberEmail";
    const memberEmail = normalizeEmail(row[emailField] || "");
    const recordId = String(row.recordId || "").trim();
    const runId = String(row.runId || "").trim();
    const sortAt = String(
      options.sortAt ? (row[options.sortAt] || "") : (row.updatedAt || row.finishedAt || row.actedAt || row.deliveredAt || "")
    ).trim();
    const parts = [
      sqliteJsonLiteral(String(row.id || randomToken(10))),
      sqliteJsonLiteral(memberEmail)
    ];
    if (options.includeRunId) parts.push(sqliteJsonLiteral(runId));
    if (options.includeRecordId) parts.push(sqliteJsonLiteral(recordId));
    if (Array.isArray(options.extraColumns)) {
      options.extraColumns.forEach((column) => {
        parts.push(sqliteJsonLiteral(String(row[column.valueField] || "").trim()));
      });
    }
    parts.push(sqliteJsonLiteral(JSON.stringify(row)));
    parts.push(sqliteJsonLiteral(sortAt));
    return `(${parts.join(", ")})`;
  }).join(",\n      ");
  const columns = ["id", options.emailColumn || "member_email"];
  if (options.includeRunId) columns.push("run_id");
  if (options.includeRecordId) columns.push("record_id");
  if (Array.isArray(options.extraColumns)) {
    options.extraColumns.forEach((column) => columns.push(column.columnName));
  }
  columns.push(columnName, options.sortColumn || "updated_at");
  return `
    delete from ${table};
    insert into ${table} (${columns.join(", ")})
    values
      ${values};
  `;
}

async function readSqliteJsonTable(table, sortColumn) {
  const raw = await runSqlite(`select payload_json from ${table} order by ${sortColumn} desc;`, { json: true });
  const rows = raw ? JSON.parse(raw) : [];
  return Array.isArray(rows)
    ? rows.map((row) => {
      try {
        return JSON.parse(row.payload_json || "{}");
      } catch {
        return null;
      }
    }).filter(Boolean)
    : [];
}

async function recordSqliteMigration(version, description) {
  await runSqlite(`
    insert into schema_migrations (version, description, applied_at)
    values (${sqliteJsonLiteral(version)}, ${sqliteJsonLiteral(description)}, ${sqliteJsonLiteral(new Date().toISOString())})
    on conflict(version) do nothing;
  `);
}

async function runSqliteTransaction(statements) {
  const sql = Array.isArray(statements) ? statements.filter(Boolean).join("\n") : String(statements || "");
  if (!sql.trim()) return;
  await runSqlite(`
    begin immediate transaction;
    ${sql}
    commit;
  `);
}

function sqliteWhereEquals(column, value) {
  return `${column} = ${sqliteJsonLiteral(value)}`;
}

async function sqliteSelectPayloadRows(table, whereClause = "", orderBy = "") {
  const sql = [
    "select payload_json",
    `from ${table}`,
    whereClause ? `where ${whereClause}` : "",
    orderBy ? `order by ${orderBy}` : ""
  ].filter(Boolean).join("\n");
  const raw = await runSqlite(sql, { json: true });
  const rows = raw ? JSON.parse(raw) : [];
  return Array.isArray(rows)
    ? rows.map((row) => {
      try {
        return JSON.parse(row.payload_json || "{}");
      } catch {
        return null;
      }
    }).filter(Boolean)
    : [];
}

async function sqliteSelectPayloadRow(table, whereClause = "", orderBy = "") {
  const rows = await sqliteSelectPayloadRows(table, whereClause, orderBy ? `${orderBy} limit 1` : "rowid desc limit 1");
  return rows[0] || null;
}

async function sqliteReadSessionByToken(token) {
  if (!token) return null;
  const sessionHash = hashValue(token);
  return await sqliteSelectPayloadRow("sessions", sqliteWhereEquals("session_hash", sessionHash));
}

async function sqliteReadMemberByEmail(email) {
  return await sqliteSelectPayloadRow("members", sqliteWhereEquals("email", normalizeEmail(email)));
}

async function sqliteReadNotificationPreference(email) {
  return await sqliteSelectPayloadRow("member_notification_preferences", sqliteWhereEquals("member_email", normalizeEmail(email)));
}

async function sqliteReadActivationRequest(email) {
  return await sqliteSelectPayloadRow("member_activation_requests", sqliteWhereEquals("email", normalizeEmail(email)), "requested_at desc");
}

async function sqliteReadReportsByMember(email) {
  return await sqliteSelectPayloadRows("member_saved_reports", sqliteWhereEquals("member_email", normalizeEmail(email)), "updated_at desc");
}

async function sqliteReadWatchlistByMember(email) {
  return await sqliteSelectPayloadRows("member_watchlist_areas", sqliteWhereEquals("member_email", normalizeEmail(email)), "added_at desc");
}

async function sqliteReadAlertRulesByMember(email) {
  return await sqliteSelectPayloadRows("member_alert_rules", sqliteWhereEquals("member_email", normalizeEmail(email)), "updated_at desc");
}

async function sqlitePersistLoginCode(entry) {
  await runSqliteTransaction([
    `delete from login_codes where ${sqliteWhereEquals("member_email", normalizeEmail(entry.memberEmail))} and json_extract(payload_json, '$.consumedAt') is null;`,
    `
      insert into login_codes (id, member_email, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(entry.id)},
        ${sqliteJsonLiteral(normalizeEmail(entry.memberEmail))},
        ${sqliteJsonLiteral(JSON.stringify(entry))},
        ${sqliteJsonLiteral(entry.createdAt)}
      )
      on conflict(id) do update set
        payload_json = excluded.payload_json,
        created_at = excluded.created_at;
    `
  ]);
}

async function sqliteVerifyCodeAndCreateSession(email, code) {
  const memberEmail = normalizeEmail(email);
  const member = await sqliteReadMemberByEmail(memberEmail);
  if (!member) return { ok: false, error: "Unknown member" };
  const loginCodes = await sqliteSelectPayloadRows("login_codes", sqliteWhereEquals("member_email", memberEmail), "created_at desc");
  const now = Date.now();
  const codeHash = hashValue(code);
  const loginCode = loginCodes.find((entry) =>
    normalizeEmail(entry.memberEmail) === memberEmail &&
    !entry.consumedAt &&
    entry.codeHash === codeHash &&
    new Date(entry.expiresAt).getTime() > now
  );
  if (!loginCode) return { ok: false, error: "Invalid or expired code" };
  loginCode.consumedAt = new Date().toISOString();
  const sessionToken = randomToken(24);
  const sessionEntry = {
    id: randomToken(12),
    memberEmail,
    sessionHash: hashValue(sessionToken),
    access: member.access,
    toolsEnabled: member.toolsEnabled,
    role: member.role,
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    revokedAt: null,
    createdAt: new Date().toISOString()
  };
  await runSqliteTransaction([
    `
      insert into login_codes (id, member_email, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(loginCode.id)},
        ${sqliteJsonLiteral(memberEmail)},
        ${sqliteJsonLiteral(JSON.stringify(loginCode))},
        ${sqliteJsonLiteral(loginCode.createdAt)}
      )
      on conflict(id) do update set payload_json = excluded.payload_json, created_at = excluded.created_at;
    `,
    `delete from sessions where ${sqliteWhereEquals("member_email", memberEmail)} and json_extract(payload_json, '$.revokedAt') is null;`,
    `
      insert into sessions (id, member_email, session_hash, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(sessionEntry.id)},
        ${sqliteJsonLiteral(memberEmail)},
        ${sqliteJsonLiteral(sessionEntry.sessionHash)},
        ${sqliteJsonLiteral(JSON.stringify(sessionEntry))},
        ${sqliteJsonLiteral(sessionEntry.createdAt)}
      )
      on conflict(id) do update set
        session_hash = excluded.session_hash,
        payload_json = excluded.payload_json,
        created_at = excluded.created_at;
    `
  ]);
  return { ok: true, member, sessionToken, sessionEntry };
}

async function sqliteUpsertReport(report) {
  const reportId = String(report.reportId || `${normalizeEmail(report.memberEmail)}:${String(report.recordId || "").trim()}`).trim();
  await runSqliteTransaction(`
    delete from member_saved_reports
    where ${sqliteWhereEquals("member_email", normalizeEmail(report.memberEmail))}
      and ${sqliteWhereEquals("record_id", String(report.recordId || "").trim())};
    insert into member_saved_reports (id, member_email, record_id, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(reportId)},
      ${sqliteJsonLiteral(normalizeEmail(report.memberEmail))},
      ${sqliteJsonLiteral(String(report.recordId || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(report))},
      ${sqliteJsonLiteral(report.updatedAt || report.savedAt || new Date().toISOString())}
    );
  `);
}

async function sqliteDeleteReportByRecord(email, recordId) {
  await runSqlite(`delete from member_saved_reports where ${sqliteWhereEquals("member_email", normalizeEmail(email))} and ${sqliteWhereEquals("record_id", String(recordId || "").trim())};`);
}

async function sqliteUpsertWatchlistItem(item) {
  const watchlistId = String(item.id || `${normalizeEmail(item.memberEmail)}:${String(item.recordId || "").trim()}`).trim();
  await runSqliteTransaction(`
    delete from member_watchlist_areas
    where ${sqliteWhereEquals("member_email", normalizeEmail(item.memberEmail))}
      and ${sqliteWhereEquals("record_id", String(item.recordId || "").trim())};
    insert into member_watchlist_areas (id, member_email, record_id, payload_json, added_at)
    values (
      ${sqliteJsonLiteral(watchlistId)},
      ${sqliteJsonLiteral(normalizeEmail(item.memberEmail))},
      ${sqliteJsonLiteral(String(item.recordId || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(item))},
      ${sqliteJsonLiteral(item.addedAt || new Date().toISOString())}
    );
  `);
}

async function sqliteDeleteWatchlistAndRules(email, recordId) {
  const memberEmail = normalizeEmail(email);
  const normalizedRecordId = String(recordId || "").trim();
  await runSqliteTransaction([
    `delete from member_watchlist_areas where ${sqliteWhereEquals("member_email", memberEmail)} and ${sqliteWhereEquals("record_id", normalizedRecordId)};`,
    `delete from member_alert_rules where ${sqliteWhereEquals("member_email", memberEmail)} and ${sqliteWhereEquals("record_id", normalizedRecordId)};`
  ]);
}

async function sqliteUpsertAlertRule(rule) {
  const alertRuleId = String(
    rule.id || `${normalizeEmail(rule.memberEmail)}:${String(rule.recordId || "").trim()}:${String(rule.trigger || "rule").trim()}`
  ).trim();
  await runSqliteTransaction(`
    delete from member_alert_rules
    where ${sqliteWhereEquals("member_email", normalizeEmail(rule.memberEmail))}
      and ${sqliteWhereEquals("record_id", String(rule.recordId || "").trim())};
    insert into member_alert_rules (id, member_email, record_id, trigger_key, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(alertRuleId)},
      ${sqliteJsonLiteral(normalizeEmail(rule.memberEmail))},
      ${sqliteJsonLiteral(String(rule.recordId || "").trim())},
      ${sqliteJsonLiteral(String(rule.trigger || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(rule))},
      ${sqliteJsonLiteral(rule.updatedAt || rule.savedAt || new Date().toISOString())}
    );
  `);
}

async function sqliteSaveNotificationPreference(preference) {
  await runSqliteTransaction(`
    insert into member_notification_preferences (id, member_email, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(String(preference.id || preference.email || randomToken(10)))},
      ${sqliteJsonLiteral(normalizeEmail(preference.email || preference.memberEmail || ""))},
      ${sqliteJsonLiteral(JSON.stringify(preference))},
      ${sqliteJsonLiteral(preference.updatedAt || new Date().toISOString())}
    )
    on conflict(member_email) do update set
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at;
  `);
}

async function sqliteSavePromoAndMember(member, promo, session) {
  await runSqliteTransaction([
    `
      insert into members (id, email, payload_json, updated_at)
      values (
        ${sqliteJsonLiteral(String(member.id || member.email || randomToken(10)))},
        ${sqliteJsonLiteral(normalizeEmail(member.email))},
        ${sqliteJsonLiteral(JSON.stringify(member))},
        ${sqliteJsonLiteral(member.updatedAt || new Date().toISOString())}
      )
      on conflict(email) do update set payload_json = excluded.payload_json, updated_at = excluded.updated_at;
    `,
    `
      insert into promo_codes (id, code, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(String(promo.id || promo.code || randomToken(10)))},
        ${sqliteJsonLiteral(String(promo.code || "").trim().toUpperCase())},
        ${sqliteJsonLiteral(JSON.stringify(promo))},
        ${sqliteJsonLiteral(promo.createdAt || new Date().toISOString())}
      )
      on conflict(id) do update set
        code = excluded.code,
        payload_json = excluded.payload_json,
        created_at = excluded.created_at;
    `,
    session
      ? `
        insert into sessions (id, member_email, session_hash, payload_json, created_at)
        values (
          ${sqliteJsonLiteral(String(session.id || session.sessionHash || randomToken(10)))},
          ${sqliteJsonLiteral(normalizeEmail(session.memberEmail))},
          ${sqliteJsonLiteral(String(session.sessionHash || ""))},
          ${sqliteJsonLiteral(JSON.stringify(session))},
          ${sqliteJsonLiteral(session.createdAt || new Date().toISOString())}
        )
        on conflict(id) do update set
          session_hash = excluded.session_hash,
          payload_json = excluded.payload_json,
          created_at = excluded.created_at;
      `
      : ""
  ]);
}

async function sqliteSaveActivationRequest(requestEntry) {
  await runSqliteTransaction(`
    delete from member_activation_requests where ${sqliteWhereEquals("email", normalizeEmail(requestEntry.email))};
    insert into member_activation_requests (id, email, payload_json, requested_at)
    values (
      ${sqliteJsonLiteral(String(requestEntry.id || requestEntry.email || randomToken(10)))},
      ${sqliteJsonLiteral(normalizeEmail(requestEntry.email))},
      ${sqliteJsonLiteral(JSON.stringify(requestEntry))},
      ${sqliteJsonLiteral(requestEntry.requestedAt || new Date().toISOString())}
    );
  `);
}

async function sqliteSaveRoleChange(target, roleAudit, session) {
  await runSqliteTransaction([
    `
      insert into members (id, email, payload_json, updated_at)
      values (
        ${sqliteJsonLiteral(String(target.id || target.email || randomToken(10)))},
        ${sqliteJsonLiteral(normalizeEmail(target.email))},
        ${sqliteJsonLiteral(JSON.stringify(target))},
        ${sqliteJsonLiteral(target.updatedAt || new Date().toISOString())}
      )
      on conflict(email) do update set payload_json = excluded.payload_json, updated_at = excluded.updated_at;
    `,
    session
      ? `
        insert into sessions (id, member_email, session_hash, payload_json, created_at)
        values (
          ${sqliteJsonLiteral(String(session.id || session.sessionHash || randomToken(10)))},
          ${sqliteJsonLiteral(normalizeEmail(session.memberEmail))},
          ${sqliteJsonLiteral(String(session.sessionHash || ""))},
          ${sqliteJsonLiteral(JSON.stringify(session))},
          ${sqliteJsonLiteral(session.createdAt || new Date().toISOString())}
        )
        on conflict(id) do update set
          session_hash = excluded.session_hash,
          payload_json = excluded.payload_json,
          created_at = excluded.created_at;
      `
      : "",
    `
      insert into member_role_audit_log (id, member_email, target_email, payload_json, acted_at)
      values (
        ${sqliteJsonLiteral(String(roleAudit.id || randomToken(10)))},
        ${sqliteJsonLiteral(normalizeEmail(roleAudit.memberEmail || roleAudit.actorEmail || ""))},
        ${sqliteJsonLiteral(normalizeEmail(roleAudit.targetEmail || ""))},
        ${sqliteJsonLiteral(JSON.stringify(roleAudit))},
        ${sqliteJsonLiteral(roleAudit.at || new Date().toISOString())}
      );
    `
  ]);
}

async function sqliteGenerateOpsReport() {
  const readCount = async (table) => {
    const raw = await runSqlite(`select count(*) as count from ${table};`, { json: true });
    const rows = raw ? JSON.parse(raw) : [];
    return Number(rows[0]?.count || 0);
  };
  const queryRows = async (sql) => {
    const raw = await runSqlite(sql, { json: true });
    const rows = raw ? JSON.parse(raw) : [];
    return Array.isArray(rows) ? rows : [];
  };
  const sourceSyncSchedule = await sqliteReadSourceSyncSchedule("asking-rent");
  const freshnessPolicy = await sqliteReadSourceFreshnessPolicy("asking-rent");
  const latestBreach = await sqliteSelectPayloadRow("source_freshness_breach_events", "", "breach_at desc");
  const latestProductionEvidence = await sqliteReadProductionEvidence("asking-rent");
  const latestHandoffAudit = await sqliteSelectPayloadRow("backend_handoff_audit", "", "generated_at desc");
  const latestSyncRun = await sqliteSelectPayloadRow("source_sync_runs", "", "ran_at desc");
  const recentSyncRuns = await queryRows(`
    select
      source_name,
      ran_at,
      json_extract(payload_json, '$.status') as status,
      json_extract(payload_json, '$.recordsChecked') as records_checked,
      json_extract(payload_json, '$.benchmarkLayer') as benchmark_layer
    from source_sync_runs
    order by ran_at desc
    limit 5;
  `);
  const memberAccessRows = await queryRows(`
    select
      json_extract(payload_json, '$.access') as access,
      count(*) as count
    from members
    group by json_extract(payload_json, '$.access')
    order by count desc, access asc;
  `);
  const deliveryStatusRows = await queryRows(`
    select
      coalesce(json_extract(payload_json, '$.deliveryStatus'), json_extract(payload_json, '$.status'), 'unknown') as status,
      count(*) as count
    from member_alert_deliveries
    group by coalesce(json_extract(payload_json, '$.deliveryStatus'), json_extract(payload_json, '$.status'), 'unknown')
    order by count desc, status asc;
  `);
  const recentDeliveryRuns = await queryRows(`
    select
      json_extract(payload_json, '$.runId') as run_id,
      json_extract(payload_json, '$.memberEmail') as member_email,
      json_extract(payload_json, '$.sentCount') as sent_count,
      json_extract(payload_json, '$.failedCount') as failed_count,
      json_extract(payload_json, '$.deadLetterCount') as dead_letter_count,
      json_extract(payload_json, '$.skippedCount') as skipped_count,
      json_extract(payload_json, '$.finishedAt') as finished_at
    from member_alert_delivery_runs
    order by finished_at desc
    limit 5;
  `);
  const coverageSummaryRows = await queryRows(`
    select
      coalesce(json_extract(payload_json, '$.status'), 'unknown') as status,
      count(*) as count
    from asking_source_candidates
    where lower(coalesce(json_extract(payload_json, '$.type'), '')) = 'coverage request'
    group by coalesce(json_extract(payload_json, '$.status'), 'unknown')
    order by count desc, status asc;
  `);
  const recentCoverageRequests = await queryRows(`
    select
      id,
      candidate_name as name,
      json_extract(payload_json, '$.requestedArea') as requested_area,
      json_extract(payload_json, '$.sourceClassification') as source_classification,
      json_extract(payload_json, '$.coverageEligibilityStatus') as coverage_eligibility_status,
      json_extract(payload_json, '$.coverageQaDecision') as coverage_qa_decision,
      updated_at
    from asking_source_candidates
    where lower(candidate_type) = 'coverage request'
    order by updated_at desc
    limit 5;
  `);
  const reviewActionRows = await queryRows(`
    select
      action,
      count(*) as count
    from source_review_history
    group by action
    order by count desc, action asc;
  `);
  return {
    generatedAt: new Date().toISOString(),
    storage: {
      engine: "sqlite",
      file: SQLITE_FILE
    },
    counts: {
      members: await readCount("members"),
      sessions: await readCount("sessions"),
      savedReports: await readCount("member_saved_reports"),
      watchlistAreas: await readCount("member_watchlist_areas"),
      alertRules: await readCount("member_alert_rules"),
      alertDeliveries: await readCount("member_alert_deliveries"),
      deliveredMessages: await readCount("member_alert_delivered_messages"),
      askingSourceCandidates: await readCount("asking_source_candidates"),
      coverageSampleRecords: await readCount("coverage_sample_records"),
      sourceSyncRuns: await readCount("source_sync_runs"),
      backendHandoffAudit: await readCount("backend_handoff_audit"),
      freshnessBreaches: await readCount("source_freshness_breach_events")
    },
    members: {
      byAccess: memberAccessRows.map((row) => ({
        access: row.access || "unknown",
        count: Number(row.count || 0)
      }))
    },
    alerts: {
      byStatus: deliveryStatusRows.map((row) => ({
        status: row.status || "unknown",
        count: Number(row.count || 0)
      })),
      recentRuns: recentDeliveryRuns.map((row) => ({
        runId: row.run_id || "",
        memberEmail: row.member_email || "",
        sentCount: Number(row.sent_count || 0),
        failedCount: Number(row.failed_count || 0),
        deadLetterCount: Number(row.dead_letter_count || 0),
        skippedCount: Number(row.skipped_count || 0),
        finishedAt: row.finished_at || ""
      }))
    },
    sourceOps: {
      syncSchedule: sourceSyncSchedule || null,
      freshnessPolicy: freshnessPolicy || null,
      latestSyncRun: latestSyncRun || null,
      recentSyncRuns: recentSyncRuns.map((row) => ({
        sourceName: row.source_name || "",
        status: row.status || "",
        recordsChecked: Number(row.records_checked || 0),
        benchmarkLayer: row.benchmark_layer || "",
        ranAt: row.ran_at || ""
      })),
      latestBreach: latestBreach || null,
      latestProductionEvidence: latestProductionEvidence || null
    },
    coverage: {
      byStatus: coverageSummaryRows.map((row) => ({
        status: row.status || "unknown",
        count: Number(row.count || 0)
      })),
      recentRequests: recentCoverageRequests.map((row) => ({
        id: row.id || "",
        name: row.name || "",
        requestedArea: row.requested_area || "",
        sourceClassification: row.source_classification || "",
        coverageEligibilityStatus: row.coverage_eligibility_status || "",
        coverageQaDecision: row.coverage_qa_decision || "",
        updatedAt: row.updated_at || ""
      })),
      reviewActions: reviewActionRows.map((row) => ({
        action: row.action || "unknown",
        count: Number(row.count || 0)
      }))
    },
    handoff: {
      latestAudit: latestHandoffAudit || null
    }
  };
}

async function sqliteReadSchemaMigrations() {
  const raw = await runSqlite(`
    select version, description, applied_at
    from schema_migrations
    order by applied_at asc, version asc;
  `, { json: true });
  const rows = raw ? JSON.parse(raw) : [];
  return Array.isArray(rows) ? rows : [];
}

async function sqliteReadSourceSyncRuns() {
  return await sqliteSelectPayloadRows("source_sync_runs", "", "ran_at desc");
}

async function sqliteSaveSourceSyncRun(syncRun) {
  await runSqliteTransaction(`
    insert into source_sync_runs (id, member_email, source_name, payload_json, ran_at)
    values (
      ${sqliteJsonLiteral(String(syncRun.id || randomToken(10)))},
      ${sqliteJsonLiteral(normalizeEmail(syncRun.memberEmail || ""))},
      ${sqliteJsonLiteral(String(syncRun.sourceName || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(syncRun))},
      ${sqliteJsonLiteral(syncRun.at || new Date().toISOString())}
    )
    on conflict(id) do update set
      member_email = excluded.member_email,
      source_name = excluded.source_name,
      payload_json = excluded.payload_json,
      ran_at = excluded.ran_at;
  `);
}

async function sqliteReadSourceSyncSchedule(sourceName = "asking-rent") {
  return await sqliteSelectPayloadRow("source_sync_schedule", sqliteWhereEquals("source_name", String(sourceName || "asking-rent").trim()));
}

async function sqliteSaveSourceSyncSchedule(syncSchedule, sourceName = "asking-rent") {
  const normalizedSourceName = String(sourceName || syncSchedule.sourceName || "asking-rent").trim();
  const scheduleId = String(syncSchedule.id || normalizedSourceName || randomToken(10)).trim();
  await runSqliteTransaction(`
    insert into source_sync_schedule (id, source_name, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(scheduleId)},
      ${sqliteJsonLiteral(normalizedSourceName)},
      ${sqliteJsonLiteral(JSON.stringify(syncSchedule))},
      ${sqliteJsonLiteral(syncSchedule.updatedAt || new Date().toISOString())}
    )
    on conflict(source_name) do update set
      id = excluded.id,
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at;
  `);
}

async function sqliteReadSourceFreshnessPolicy(policyKey = "asking-rent") {
  return await sqliteSelectPayloadRow("source_freshness_policy", sqliteWhereEquals("policy_key", String(policyKey || "asking-rent").trim()));
}

async function sqliteSaveSourceFreshnessPolicy(policy, policyKey = "asking-rent") {
  const normalizedPolicyKey = String(policyKey || "asking-rent").trim();
  const policyId = String(policy.id || normalizedPolicyKey || randomToken(10)).trim();
  await runSqliteTransaction(`
    insert into source_freshness_policy (id, policy_key, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(policyId)},
      ${sqliteJsonLiteral(normalizedPolicyKey)},
      ${sqliteJsonLiteral(JSON.stringify(policy))},
      ${sqliteJsonLiteral(policy.updatedAt || new Date().toISOString())}
    )
    on conflict(policy_key) do update set
      id = excluded.id,
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at;
  `);
}

async function sqliteSaveSourceFreshnessBreachEvent(breachEvent) {
  await runSqliteTransaction(`
    insert into source_freshness_breach_events (id, source_name, payload_json, breach_at)
    values (
      ${sqliteJsonLiteral(String(breachEvent.id || randomToken(10)))},
      ${sqliteJsonLiteral(String(breachEvent.sourceName || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(breachEvent))},
      ${sqliteJsonLiteral(breachEvent.breachAt || new Date().toISOString())}
    )
    on conflict(id) do update set
      source_name = excluded.source_name,
      payload_json = excluded.payload_json,
      breach_at = excluded.breach_at;
  `);
}

async function sqliteReadAskingSourceCandidates() {
  return await sqliteSelectPayloadRows("asking_source_candidates", "", "updated_at desc");
}

async function sqliteReadCoverageSampleRecords(candidateIds = []) {
  if (!Array.isArray(candidateIds) || !candidateIds.length) {
    return await sqliteSelectPayloadRows("coverage_sample_records", "", "created_at desc");
  }
  const filters = candidateIds.map((candidateId) => sqliteWhereEquals("candidate_id", String(candidateId || "").trim()));
  return await sqliteSelectPayloadRows("coverage_sample_records", `(${filters.join(" or ")})`, "created_at desc");
}

async function sqliteReadSourceReviewHistory(candidateId = "") {
  const normalizedCandidateId = String(candidateId || "").trim();
  return await sqliteSelectPayloadRows(
    "source_review_history",
    normalizedCandidateId ? sqliteWhereEquals("candidate_id", normalizedCandidateId) : "",
    "created_at desc"
  );
}

async function sqliteUpsertAskingSourceCandidate(candidate) {
  await runSqliteTransaction(`
    insert into asking_source_candidates (id, candidate_type, candidate_name, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(String(candidate.id || randomToken(10)))},
      ${sqliteJsonLiteral(String(candidate.type || "").trim())},
      ${sqliteJsonLiteral(String(candidate.name || candidate.requestedQuery || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(candidate))},
      ${sqliteJsonLiteral(candidate.updatedAt || candidate.addedAt || new Date().toISOString())}
    )
    on conflict(id) do update set
      candidate_type = excluded.candidate_type,
      candidate_name = excluded.candidate_name,
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at;
  `);
}

async function sqliteUpsertCoverageSampleRecord(sampleRecord) {
  const sampleRecordId = String(sampleRecord.id || sampleRecord.recordId || randomToken(10)).trim();
  await runSqliteTransaction(`
    insert into coverage_sample_records (id, candidate_id, record_id, payload_json, created_at)
    values (
      ${sqliteJsonLiteral(sampleRecordId)},
      ${sqliteJsonLiteral(String(sampleRecord.candidateId || "").trim())},
      ${sqliteJsonLiteral(String(sampleRecord.recordId || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(sampleRecord))},
      ${sqliteJsonLiteral(sampleRecord.createdAt || new Date().toISOString())}
    )
    on conflict(record_id) do update set
      id = excluded.id,
      candidate_id = excluded.candidate_id,
      payload_json = excluded.payload_json,
      created_at = excluded.created_at;
  `);
}

async function sqliteSaveSourceReviewHistoryEntry(reviewEntry) {
  await runSqliteTransaction(`
    insert into source_review_history (id, candidate_id, action, payload_json, created_at)
    values (
      ${sqliteJsonLiteral(String(reviewEntry.id || randomToken(10)))},
      ${sqliteJsonLiteral(String(reviewEntry.candidateId || "").trim())},
      ${sqliteJsonLiteral(String(reviewEntry.action || "").trim())},
      ${sqliteJsonLiteral(JSON.stringify(reviewEntry))},
      ${sqliteJsonLiteral(reviewEntry.createdAt || new Date().toISOString())}
    )
    on conflict(id) do update set
      candidate_id = excluded.candidate_id,
      action = excluded.action,
      payload_json = excluded.payload_json,
      created_at = excluded.created_at;
  `);
}

async function sqliteSaveCandidateReview(candidate, reviewEntry = null, sampleRecord = null) {
  const statements = [
    `
      insert into asking_source_candidates (id, candidate_type, candidate_name, payload_json, updated_at)
      values (
        ${sqliteJsonLiteral(String(candidate.id || randomToken(10)))},
        ${sqliteJsonLiteral(String(candidate.type || "").trim())},
        ${sqliteJsonLiteral(String(candidate.name || candidate.requestedQuery || "").trim())},
        ${sqliteJsonLiteral(JSON.stringify(candidate))},
        ${sqliteJsonLiteral(candidate.updatedAt || candidate.addedAt || new Date().toISOString())}
      )
      on conflict(id) do update set
        candidate_type = excluded.candidate_type,
        candidate_name = excluded.candidate_name,
        payload_json = excluded.payload_json,
        updated_at = excluded.updated_at;
    `
  ];
  if (sampleRecord) {
    statements.push(`
      insert into coverage_sample_records (id, candidate_id, record_id, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(String(sampleRecord.id || sampleRecord.recordId || randomToken(10)))},
        ${sqliteJsonLiteral(String(sampleRecord.candidateId || "").trim())},
        ${sqliteJsonLiteral(String(sampleRecord.recordId || "").trim())},
        ${sqliteJsonLiteral(JSON.stringify(sampleRecord))},
        ${sqliteJsonLiteral(sampleRecord.createdAt || new Date().toISOString())}
      )
      on conflict(record_id) do update set
        id = excluded.id,
        candidate_id = excluded.candidate_id,
        payload_json = excluded.payload_json,
        created_at = excluded.created_at;
    `);
  }
  if (reviewEntry) {
    statements.push(`
      insert into source_review_history (id, candidate_id, action, payload_json, created_at)
      values (
        ${sqliteJsonLiteral(String(reviewEntry.id || randomToken(10)))},
        ${sqliteJsonLiteral(String(reviewEntry.candidateId || "").trim())},
        ${sqliteJsonLiteral(String(reviewEntry.action || "").trim())},
        ${sqliteJsonLiteral(JSON.stringify(reviewEntry))},
        ${sqliteJsonLiteral(reviewEntry.createdAt || new Date().toISOString())}
      )
      on conflict(id) do update set
        candidate_id = excluded.candidate_id,
        action = excluded.action,
        payload_json = excluded.payload_json,
        created_at = excluded.created_at;
    `);
  }
  await runSqliteTransaction(statements);
}

async function sqliteReadProductionEvidence(sourceName = "") {
  const normalizedSourceName = String(sourceName || "").trim();
  return await sqliteSelectPayloadRow(
    "asking_source_production_evidence",
    normalizedSourceName ? sqliteWhereEquals("source_name", normalizedSourceName) : "",
    "updated_at desc"
  );
}

async function sqliteSaveProductionEvidence(productionEvidence) {
  const sourceName = String(productionEvidence.sourceName || "asking-rent").trim();
  const evidenceId = String(productionEvidence.id || sourceName || randomToken(10)).trim();
  await runSqliteTransaction(`
    insert into asking_source_production_evidence (id, source_name, payload_json, updated_at)
    values (
      ${sqliteJsonLiteral(evidenceId)},
      ${sqliteJsonLiteral(sourceName)},
      ${sqliteJsonLiteral(JSON.stringify(productionEvidence))},
      ${sqliteJsonLiteral(productionEvidence.updatedAt || new Date().toISOString())}
    )
    on conflict(id) do update set
      source_name = excluded.source_name,
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at;
  `);
}

async function sqliteReadBackendHandoffAudits(memberEmail = "") {
  const normalizedMemberEmail = normalizeEmail(memberEmail);
  return await sqliteSelectPayloadRows(
    "backend_handoff_audit",
    normalizedMemberEmail ? sqliteWhereEquals("member_email", normalizedMemberEmail) : "",
    "generated_at desc"
  );
}

async function sqliteUpsertBackendHandoffAudit(audit) {
  await runSqliteTransaction(`
    insert into backend_handoff_audit (id, member_email, payload_json, generated_at)
    values (
      ${sqliteJsonLiteral(String(audit.id || randomToken(10)))},
      ${sqliteJsonLiteral(normalizeEmail(audit.memberEmail || ""))},
      ${sqliteJsonLiteral(JSON.stringify(audit))},
      ${sqliteJsonLiteral(audit.generatedAt || new Date().toISOString())}
    )
    on conflict(id) do update set
      member_email = excluded.member_email,
      payload_json = excluded.payload_json,
      generated_at = excluded.generated_at;
  `);
}

async function readSqliteDb() {
  const raw = await runSqlite("select state_json from app_state where id = 1;", { json: true });
  const rows = raw ? JSON.parse(raw) : [];
  const stateJson = rows[0]?.state_json || "{}";
  const db = JSON.parse(stateJson);
  const normalizedMembers = await readSqliteJsonTable("members", "updated_at");
  const normalizedLoginCodes = await readSqliteJsonTable("login_codes", "created_at");
  const normalizedSessions = await readSqliteJsonTable("sessions", "created_at");
  const normalizedSavedReports = await readSqliteJsonTable("member_saved_reports", "updated_at");
  const normalizedWatchlist = await readSqliteJsonTable("member_watchlist_areas", "added_at");
  const normalizedAlertRules = await readSqliteJsonTable("member_alert_rules", "updated_at");
  const normalizedNotificationPreferences = await readSqliteJsonTable("member_notification_preferences", "updated_at");
  const normalizedPromoCodes = await readSqliteJsonTable("promo_codes", "created_at");
  const normalizedActivationRequests = await readSqliteJsonTable("member_activation_requests", "requested_at");
  const normalizedRoleAuditLog = await readSqliteJsonTable("member_role_audit_log", "acted_at");
  const normalizedAskingSourceCandidates = await readSqliteJsonTable("asking_source_candidates", "updated_at");
  const normalizedCoverageSampleRecords = await readSqliteJsonTable("coverage_sample_records", "created_at");
  const normalizedSourceReviewHistory = await readSqliteJsonTable("source_review_history", "created_at");
  const normalizedSourceSyncRuns = await readSqliteJsonTable("source_sync_runs", "ran_at");
  const normalizedSourceSyncSchedule = await readSqliteJsonTable("source_sync_schedule", "updated_at");
  const normalizedSourceFreshnessPolicy = await readSqliteJsonTable("source_freshness_policy", "updated_at");
  const normalizedSourceFreshnessBreachEvents = await readSqliteJsonTable("source_freshness_breach_events", "breach_at");
  const normalizedProductionEvidence = await readSqliteJsonTable("asking_source_production_evidence", "updated_at");
  const normalizedBackendHandoffAudit = await readSqliteJsonTable("backend_handoff_audit", "generated_at");
  db.members = normalizedMembers.length
    ? normalizedMembers
    : (Array.isArray(db.members) ? db.members : []);
  db.loginCodes = normalizedLoginCodes.length
    ? normalizedLoginCodes
    : (Array.isArray(db.loginCodes) ? db.loginCodes : []);
  db.sessions = normalizedSessions.length
    ? normalizedSessions
    : (Array.isArray(db.sessions) ? db.sessions : []);
  db.savedReports = normalizedSavedReports.length
    ? normalizedSavedReports
    : (Array.isArray(db.savedReports) ? db.savedReports : []);
  db.watchlist = normalizedWatchlist.length
    ? normalizedWatchlist
    : (Array.isArray(db.watchlist) ? db.watchlist : []);
  db.alertRules = normalizedAlertRules.length
    ? normalizedAlertRules
    : (Array.isArray(db.alertRules) ? db.alertRules : []);
  const normalizedAlertDeliveries = await readSqliteJsonTable("member_alert_deliveries", "updated_at");
  const normalizedAlertDeliveryRuns = await readSqliteJsonTable("member_alert_delivery_runs", "finished_at");
  const normalizedAlertDeliveryAdminLog = await readSqliteJsonTable("member_alert_delivery_admin_log", "acted_at");
  const normalizedDeliveredMessages = await readSqliteJsonTable("member_alert_delivered_messages", "delivered_at");
  db.alertDeliveries = normalizedAlertDeliveries.length
    ? normalizedAlertDeliveries
    : (Array.isArray(db.alertDeliveries) ? db.alertDeliveries : []);
  db.alertDeliveryRuns = normalizedAlertDeliveryRuns.length
    ? normalizedAlertDeliveryRuns
    : (Array.isArray(db.alertDeliveryRuns) ? db.alertDeliveryRuns : []);
  db.alertDeliveryAdminLog = normalizedAlertDeliveryAdminLog.length
    ? normalizedAlertDeliveryAdminLog
    : (Array.isArray(db.alertDeliveryAdminLog) ? db.alertDeliveryAdminLog : []);
  db.deliveredMessages = normalizedDeliveredMessages.length
    ? normalizedDeliveredMessages
    : (Array.isArray(db.deliveredMessages) ? db.deliveredMessages : []);
  db.askingSourceCandidates = normalizedAskingSourceCandidates.length
    ? normalizedAskingSourceCandidates
    : (Array.isArray(db.askingSourceCandidates) ? db.askingSourceCandidates : []);
  db.coverageSampleRecords = normalizedCoverageSampleRecords.length
    ? normalizedCoverageSampleRecords
    : (Array.isArray(db.coverageSampleRecords) ? db.coverageSampleRecords : []);
  db.sourceReviewHistory = normalizedSourceReviewHistory.length
    ? normalizedSourceReviewHistory
    : (Array.isArray(db.sourceReviewHistory) ? db.sourceReviewHistory : []);
  db.sourceSyncRuns = normalizedSourceSyncRuns.length
    ? normalizedSourceSyncRuns
    : (Array.isArray(db.sourceSyncRuns) ? db.sourceSyncRuns : []);
  db.sourceSyncSchedule = normalizedSourceSyncSchedule[0] && typeof normalizedSourceSyncSchedule[0] === "object"
    ? normalizedSourceSyncSchedule[0]
    : (db.sourceSyncSchedule && typeof db.sourceSyncSchedule === "object" ? db.sourceSyncSchedule : {});
  db.sourceFreshnessPolicy = normalizedSourceFreshnessPolicy[0] && typeof normalizedSourceFreshnessPolicy[0] === "object"
    ? normalizedSourceFreshnessPolicy[0]
    : (db.sourceFreshnessPolicy && typeof db.sourceFreshnessPolicy === "object"
      ? db.sourceFreshnessPolicy
      : { freshMaxDays: 7, watchMaxDays: 14, updatedAt: "", updatedBy: "" });
  db.sourceFreshnessBreachEvents = normalizedSourceFreshnessBreachEvents.length
    ? normalizedSourceFreshnessBreachEvents
    : (Array.isArray(db.sourceFreshnessBreachEvents) ? db.sourceFreshnessBreachEvents : []);
  db.askingRentFeed = db.askingRentFeed && typeof db.askingRentFeed === "object"
    ? db.askingRentFeed
    : JSON.parse(await fsp.readFile(ASKING_FEED_FILE, "utf8"));
  db.productionEvidence = normalizedProductionEvidence[0] && typeof normalizedProductionEvidence[0] === "object"
    ? normalizedProductionEvidence[0]
    : (db.productionEvidence && typeof db.productionEvidence === "object" ? db.productionEvidence : {});
  db.backendHandoffAudit = normalizedBackendHandoffAudit.length
    ? normalizedBackendHandoffAudit
    : (Array.isArray(db.backendHandoffAudit) ? db.backendHandoffAudit : []);
  db.activationRequests = normalizedActivationRequests.length
    ? normalizedActivationRequests
    : (Array.isArray(db.activationRequests) ? db.activationRequests : []);
  db.roleAuditLog = normalizedRoleAuditLog.length
    ? normalizedRoleAuditLog
    : (Array.isArray(db.roleAuditLog) ? db.roleAuditLog : []);
  db.promoCodes = normalizedPromoCodes.length
    ? normalizedPromoCodes
    : (Array.isArray(db.promoCodes) ? db.promoCodes : []);
  let promoCodesChanged = false;
  if (!db.promoCodes.some((entry) => String(entry.code || "").trim().toUpperCase() === "RENTINTEL-PILOT")) {
    db.promoCodes.unshift({
      code: "RENTINTEL-PILOT",
      access: "promo",
      description: "Pilot promo access",
      active: true,
      redeemedCount: 0
    });
    promoCodesChanged = true;
  }
  if (!db.promoCodes.some((entry) => String(entry.code || "").trim().toUpperCase() === "DOOMSDAY01")) {
    db.promoCodes.unshift({
      code: "DOOMSDAY01",
      access: "promo",
      description: "Doomsday pilot promo access",
      active: true,
      redeemedCount: 0
    });
    promoCodesChanged = true;
  }
  if (normalizedNotificationPreferences.length) {
    db.notificationPreferences = Object.fromEntries(
      normalizedNotificationPreferences
        .filter((entry) => normalizeEmail(entry.email || entry.memberEmail || ""))
        .map((entry) => [normalizeEmail(entry.email || entry.memberEmail || ""), entry])
    );
  } else {
    db.notificationPreferences = db.notificationPreferences && typeof db.notificationPreferences === "object"
      ? db.notificationPreferences
      : {};
  }
  if (
    promoCodesChanged ||
    (!normalizedMembers.length && db.members.length) ||
    (!normalizedLoginCodes.length && db.loginCodes.length) ||
    (!normalizedSessions.length && db.sessions.length) ||
    (!normalizedSavedReports.length && db.savedReports.length) ||
    (!normalizedWatchlist.length && db.watchlist.length) ||
    (!normalizedAlertRules.length && db.alertRules.length) ||
    (!normalizedNotificationPreferences.length && Object.keys(db.notificationPreferences).length) ||
    (!normalizedPromoCodes.length && db.promoCodes.length) ||
    (!normalizedActivationRequests.length && db.activationRequests.length) ||
    (!normalizedRoleAuditLog.length && db.roleAuditLog.length) ||
    (!normalizedAskingSourceCandidates.length && db.askingSourceCandidates.length) ||
    (!normalizedCoverageSampleRecords.length && db.coverageSampleRecords.length) ||
    (!normalizedSourceReviewHistory.length && db.sourceReviewHistory.length) ||
    (!normalizedSourceSyncRuns.length && db.sourceSyncRuns.length) ||
    (!normalizedSourceSyncSchedule.length && Object.keys(db.sourceSyncSchedule).length) ||
    (!normalizedSourceFreshnessPolicy.length && Object.keys(db.sourceFreshnessPolicy).length) ||
    (!normalizedSourceFreshnessBreachEvents.length && db.sourceFreshnessBreachEvents.length) ||
    (!normalizedProductionEvidence.length && Object.keys(db.productionEvidence).length) ||
    (!normalizedBackendHandoffAudit.length && db.backendHandoffAudit.length) ||
    (!normalizedAlertDeliveries.length && db.alertDeliveries.length) ||
    (!normalizedAlertDeliveryRuns.length && db.alertDeliveryRuns.length) ||
    (!normalizedAlertDeliveryAdminLog.length && db.alertDeliveryAdminLog.length) ||
    (!normalizedDeliveredMessages.length && db.deliveredMessages.length)
  ) {
    await writeSqliteDb(db, { mirrorJson: true });
  }
  return db;
}

async function writeSqliteDb(db, options = {}) {
  const json = JSON.stringify(db, null, 2);
  const updatedAt = new Date().toISOString();
  await runSqlite(`
    begin transaction;
    insert into app_state (id, state_json, updated_at)
    values (1, ${sqliteJsonLiteral(json)}, ${sqliteJsonLiteral(updatedAt)})
    on conflict(id) do update set
      state_json = excluded.state_json,
      updated_at = excluded.updated_at;
    ${sqliteRowJsonInsert("members", db.members, {
      emailField: "email",
      emailColumn: "email",
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("login_codes", db.loginCodes, {
      sortColumn: "created_at",
      sortAt: "createdAt"
    })}
    ${sqliteRowJsonInsert("sessions", db.sessions.map((row) => ({
      ...row,
      id: row.id || row.sessionHash || randomToken(10)
    })), {
      extraColumns: [{ columnName: "session_hash", valueField: "sessionHash" }],
      sortColumn: "created_at",
      sortAt: "createdAt"
    })}
    ${sqliteRowJsonInsert("member_saved_reports", db.savedReports, {
      includeRecordId: true,
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("member_watchlist_areas", db.watchlist, {
      includeRecordId: true,
      sortColumn: "added_at",
      sortAt: "addedAt"
    })}
    ${sqliteRowJsonInsert("member_alert_rules", db.alertRules.map((row) => ({
      ...row,
      triggerKey: row.trigger || ""
    })), {
      includeRecordId: true,
      extraColumns: [{ columnName: "trigger_key", valueField: "triggerKey" }],
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert(
      "member_notification_preferences",
      Object.values(db.notificationPreferences || {}).map((row) => ({
        ...row,
        id: row.id || row.email || randomToken(10),
        memberEmail: normalizeEmail(row.email || row.memberEmail || "")
      })),
      {
        sortColumn: "updated_at",
        sortAt: "updatedAt"
      }
    )}
    ${sqliteRowJsonInsert("promo_codes", db.promoCodes.map((row) => ({
      ...row,
      id: row.id || row.code || randomToken(10),
      memberEmail: String(row.code || "").trim().toUpperCase()
    })), {
      emailColumn: "code",
      sortColumn: "created_at",
      sortAt: "createdAt"
    })}
    ${sqliteRowJsonInsert("member_activation_requests", db.activationRequests.map((row) => ({
      ...row,
      id: row.id || row.email || randomToken(10),
      memberEmail: normalizeEmail(row.email || "")
    })), {
      emailField: "memberEmail",
      emailColumn: "email",
      sortColumn: "requested_at",
      sortAt: "requestedAt"
    })}
    ${sqliteRowJsonInsert("member_role_audit_log", db.roleAuditLog.map((row) => ({
      ...row,
      memberEmail: normalizeEmail(row.memberEmail || row.actorEmail || "")
    })), {
      extraColumns: [{ columnName: "target_email", valueField: "targetEmail" }],
      sortColumn: "acted_at",
      sortAt: "at"
    })}
    ${sqliteRowJsonInsert("asking_source_candidates", db.askingSourceCandidates.map((row) => ({
      ...row,
      memberEmail: normalizeEmail(row.requestEmail || row.reviewedBy || row.productionReadyBy || ""),
      candidateType: String(row.type || "").trim(),
      candidateName: String(row.name || row.requestedQuery || "").trim()
    })), {
      emailColumn: "candidate_type",
      emailField: "candidateType",
      extraColumns: [{ columnName: "candidate_name", valueField: "candidateName" }],
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("coverage_sample_records", db.coverageSampleRecords.map((row) => ({
      ...row,
      memberEmail: String(row.candidateId || "").trim()
    })), {
      emailField: "memberEmail",
      emailColumn: "candidate_id",
      includeRecordId: true,
      sortColumn: "created_at",
      sortAt: "createdAt"
    })}
    ${sqliteRowJsonInsert("source_review_history", db.sourceReviewHistory.map((row) => ({
      ...row,
      memberEmail: String(row.candidateId || "").trim(),
      actionKey: String(row.action || "").trim()
    })), {
      emailField: "memberEmail",
      emailColumn: "candidate_id",
      extraColumns: [{ columnName: "action", valueField: "actionKey" }],
      sortColumn: "created_at",
      sortAt: "createdAt"
    })}
    ${sqliteRowJsonInsert("source_sync_runs", db.sourceSyncRuns.map((row) => ({
      ...row,
      sourceNameKey: String(row.sourceName || "").trim()
    })), {
      extraColumns: [{ columnName: "source_name", valueField: "sourceNameKey" }],
      sortColumn: "ran_at",
      sortAt: "at"
    })}
    ${sqliteRowJsonInsert("source_sync_schedule", Object.keys(db.sourceSyncSchedule || {}).length ? [{
      ...db.sourceSyncSchedule,
      id: db.sourceSyncSchedule.id || "source-sync-schedule-default",
      memberEmail: String(db.sourceSyncSchedule.sourceName || "rentintel-sync-schedule").trim()
    }] : [], {
      emailField: "memberEmail",
      emailColumn: "source_name",
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("source_freshness_policy", Object.keys(db.sourceFreshnessPolicy || {}).length ? [{
      ...db.sourceFreshnessPolicy,
      id: db.sourceFreshnessPolicy.id || "source-freshness-policy-default",
      memberEmail: "default-policy"
    }] : [], {
      emailField: "memberEmail",
      emailColumn: "policy_key",
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("source_freshness_breach_events", db.sourceFreshnessBreachEvents.map((row) => ({
      ...row,
      memberEmail: String(row.sourceName || "").trim()
    })), {
      emailField: "memberEmail",
      emailColumn: "source_name",
      sortColumn: "breach_at",
      sortAt: "breachAt"
    })}
    ${sqliteRowJsonInsert("asking_source_production_evidence", Object.keys(db.productionEvidence || {}).length ? [{
      ...db.productionEvidence,
      id: db.productionEvidence.id || "production-evidence-default",
      memberEmail: String(db.productionEvidence.sourceName || "rentintel-production-evidence").trim()
    }] : [], {
      emailField: "memberEmail",
      emailColumn: "source_name",
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("backend_handoff_audit", db.backendHandoffAudit, {
      sortColumn: "generated_at",
      sortAt: "generatedAt"
    })}
    ${sqliteRowJsonInsert("member_alert_deliveries", db.alertDeliveries, {
      includeRecordId: true,
      sortColumn: "updated_at",
      sortAt: "updatedAt"
    })}
    ${sqliteRowJsonInsert("member_alert_delivery_runs", db.alertDeliveryRuns, {
      includeRunId: true,
      sortColumn: "finished_at",
      sortAt: "finishedAt"
    })}
    ${sqliteRowJsonInsert("member_alert_delivery_admin_log", db.alertDeliveryAdminLog, {
      includeRecordId: true,
      sortColumn: "acted_at",
      sortAt: "at"
    })}
    ${sqliteRowJsonInsert("member_alert_delivered_messages", db.deliveredMessages, {
      includeRunId: true,
      includeRecordId: true,
      sortColumn: "delivered_at",
      sortAt: "deliveredAt"
    })}
    commit;
  `);
  if (options.mirrorJson !== false) {
    await fsp.writeFile(DB_FILE, json);
  }
}

function json(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  response.end(JSON.stringify(payload, null, 2));
}

function notFound(response) {
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
}

function methodNotAllowed(response) {
  response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
}

function parseCookies(request) {
  const source = request.headers.cookie || "";
  const cookies = {};
  source.split(";").forEach((entry) => {
    const [rawKey, ...rest] = entry.split("=");
    const key = rawKey ? rawKey.trim() : "";
    if (!key) return;
    cookies[key] = decodeURIComponent(rest.join("=").trim());
  });
  return cookies;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function maskEmail(email) {
  const [localPart, domain = ""] = String(email).split("@");
  if (!localPart || !domain) return email;
  const visible = localPart.length <= 2 ? localPart[0] || "*" : `${localPart[0]}${"*".repeat(Math.max(localPart.length - 2, 1))}${localPart.at(-1)}`;
  return `${visible}@${domain}`;
}

function serializeMember(member, sessionToken = "") {
  return {
    email: member.email,
    memberStatus: member.memberStatus,
    subscriptionStatus: member.subscriptionStatus,
    access: member.access,
    role: member.role,
    promoCode: member.promoCode,
    toolsEnabled: member.toolsEnabled,
    isAdmin: member.role === "admin",
    sessionId: sessionToken,
    signedInAt: new Date().toISOString()
  };
}

function buildSessionCookie(token, maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000)) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

async function lookupSession(request) {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) return { db: await readDb(), session: null, member: null, token: "" };
  if (DB_ENGINE === "sqlite") {
    const session = await sqliteReadSessionByToken(token);
    if (!session) {
      return { db: await readDb(), session: null, member: null, token: "" };
    }
    if (session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now()) {
      await runSqlite(`
        update sessions
        set payload_json = json_set(payload_json, '$.revokedAt', ${sqliteJsonLiteral(new Date().toISOString())})
        where ${sqliteWhereEquals("id", String(session.id || ""))};
      `);
      return { db: await readDb(), session: null, member: null, token: "" };
    }
    const member = await sqliteReadMemberByEmail(session.memberEmail);
    return { db: await readDb(), session, member, token };
  }
  const db = await readDb();
  const now = Date.now();
  db.sessions = db.sessions.filter((entry) => !entry.revokedAt && new Date(entry.expiresAt).getTime() > now);
  const session = db.sessions.find((entry) => entry.sessionHash === hashValue(token)) || null;
  if (!session) {
    await writeDb(db);
    return { db, session: null, member: null, token: "" };
  }
  const member = db.members.find((entry) => entry.email === session.memberEmail) || null;
  return { db, session, member, token };
}

function requireMemberSession(lookup, response) {
  if (!lookup.session || !lookup.member) {
    json(response, 401, { ok: false, error: "No active session" });
    return null;
  }
  return lookup.member;
}

function normalizeReportPayload(payload = {}, memberEmail = "") {
  const email = normalizeEmail(payload.memberEmail || memberEmail);
  const recordId = String(payload.recordId || "").trim();
  const now = new Date().toISOString();
  const baseDecisionPack = payload.decisionPack && typeof payload.decisionPack === "object"
    ? payload.decisionPack
    : null;
  return {
    reportId: payload.reportId || `${email}:${recordId}`,
    memberEmail: email,
    recordId,
    title: String(payload.title || "").trim(),
    decision: String(payload.decision || "").trim(),
    asking: Number.isFinite(Number(payload.asking)) ? Number(payload.asking) : null,
    official: Number.isFinite(Number(payload.official)) ? Number(payload.official) : null,
    gap: Number.isFinite(Number(payload.gap)) ? Number(payload.gap) : null,
    pulseSummary: payload.pulseSummary && typeof payload.pulseSummary === "object" ? payload.pulseSummary : null,
    decisionPack: baseDecisionPack,
    saveMetadata: payload.saveMetadata && typeof payload.saveMetadata === "object" ? payload.saveMetadata : {},
    negotiationNote: String(payload.negotiationNote || "").trim(),
    savedAt: payload.savedAt || now,
    updatedAt: now,
    backendStatus: "api-synced"
  };
}

function normalizeWatchlistPayload(payload = {}, memberEmail = "") {
  const email = normalizeEmail(payload.memberEmail || memberEmail);
  const recordId = String(payload.recordId || "").trim();
  return {
    memberEmail: email,
    recordId,
    area: String(payload.area || "").trim(),
    addedAt: payload.addedAt || new Date().toISOString()
  };
}

function normalizeAlertRulePayload(payload = {}, memberEmail = "") {
  const email = normalizeEmail(payload.memberEmail || memberEmail);
  const recordId = String(payload.recordId || "").trim();
  const now = new Date().toISOString();
  return {
    memberEmail: email,
    recordId,
    area: String(payload.area || "").trim(),
    title: String(payload.title || "").trim(),
    trigger: String(payload.trigger || "asking-falls-to-target").trim() || "asking-falls-to-target",
    targetPsf: Number.isFinite(Number(payload.targetPsf)) ? Number(Number(payload.targetPsf).toFixed(2)) : 0,
    gapLimit: Number.isFinite(Number(payload.gapLimit)) ? Math.max(0, Math.round(Number(payload.gapLimit))) : 0,
    cadence: String(payload.cadence || "daily").trim() || "daily",
    condition: String(payload.condition || "").trim(),
    savedAt: payload.savedAt || now,
    updatedAt: now,
    backendStatus: "api-synced"
  };
}

function normalizeNotificationPreferencePayload(payload = {}, memberEmail = "") {
  return {
    email: normalizeEmail(payload.email || memberEmail),
    dailyBrief: Boolean(payload.dailyBrief),
    activationUpdates: Boolean(payload.activationUpdates),
    watchlistAlerts: Boolean(payload.watchlistAlerts),
    sourceSyncAlerts: Boolean(payload.sourceSyncAlerts),
    updatedAt: new Date().toISOString()
  };
}

function normalizeActivationRequestPayload(payload = {}, email = "") {
  return {
    email: normalizeEmail(payload.email || email),
    plan: String(payload.plan || "Member").trim() || "Member",
    useCase: String(payload.useCase || "").trim(),
    status: String(payload.status || "pending activation").trim() || "pending activation",
    requestedAt: payload.requestedAt || new Date().toISOString()
  };
}

function normalizeRoleAuditEntry(payload = {}, actorEmail = "", memberEmail = "") {
  return {
    id: payload.id || randomToken(10),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail || actorEmail),
    actorEmail: normalizeEmail(payload.actorEmail || actorEmail),
    targetEmail: normalizeEmail(payload.targetEmail || memberEmail),
    previousRole: String(payload.previousRole || "member").trim() || "member",
    nextRole: String(payload.nextRole || "member").trim() || "member",
    reason: String(payload.reason || "Role updated from member registry.").trim(),
    at: payload.at || new Date().toISOString()
  };
}

function normalizeAlertDeliveryPayload(payload = {}, memberEmail = "") {
  const email = normalizeEmail(payload.memberEmail || memberEmail);
  const recordId = String(payload.recordId || "").trim();
  const now = new Date().toISOString();
  return {
    ...payload,
    id: payload.id || randomToken(10),
    memberEmail: email,
    recordId,
    title: String(payload.title || "").trim(),
    area: String(payload.area || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
    trigger: String(payload.trigger || "").trim(),
    triggerKey: String(payload.triggerKey || "").trim(),
    cadence: String(payload.cadence || "").trim(),
    cadenceKey: String(payload.cadenceKey || "").trim(),
    deliveryChannel: String(payload.deliveryChannel || "email").trim() || "email",
    deliveryPayload: payload.deliveryPayload && typeof payload.deliveryPayload === "object" ? payload.deliveryPayload : {},
    freshnessState: String(payload.freshnessState || "").trim(),
    freshnessLabel: String(payload.freshnessLabel || "").trim(),
    freshnessBreach: Boolean(payload.freshnessBreach),
    status: String(payload.status || "").trim(),
    deliveryStatus: String(payload.deliveryStatus || "queued").trim() || "queued",
    retryCount: Math.max(0, Number(payload.retryCount || 0)),
    maxRetries: Math.max(1, Number(payload.maxRetries || 2)),
    failureCode: String(payload.failureCode || "").trim(),
    deadLetterAt: payload.deadLetterAt || "",
    suppressedAt: payload.suppressedAt || "",
    queuedAt: payload.queuedAt || now,
    updatedAt: payload.updatedAt || now,
    resultAt: payload.resultAt || "",
    lastReason: String(payload.lastReason || "").trim()
  };
}

function normalizeAlertDeliveryRunPayload(payload = {}, memberEmail = "") {
  return {
    ...payload,
    id: payload.id || randomToken(10),
    runId: String(payload.runId || payload.id || `run-${Date.now()}`).trim(),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail),
    startedAt: payload.startedAt || new Date().toISOString(),
    finishedAt: payload.finishedAt || new Date().toISOString(),
    totalQueued: Math.max(0, Number(payload.totalQueued || 0)),
    sentCount: Math.max(0, Number(payload.sentCount || 0)),
    failedCount: Math.max(0, Number(payload.failedCount || 0)),
    deadLetterCount: Math.max(0, Number(payload.deadLetterCount || 0)),
    skippedCount: Math.max(0, Number(payload.skippedCount || 0)),
    outcomes: Array.isArray(payload.outcomes) ? payload.outcomes : []
  };
}

function normalizeDeliveredMessagePayload(payload = {}, memberEmail = "") {
  return {
    ...payload,
    id: payload.id || randomToken(10),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail),
    runId: String(payload.runId || "").trim(),
    recordId: String(payload.recordId || "").trim(),
    area: String(payload.area || "").trim(),
    title: String(payload.title || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
    trigger: String(payload.trigger || "").trim(),
    cadence: String(payload.cadence || "").trim(),
    deliveryChannel: String(payload.deliveryChannel || "email").trim() || "email",
    transportMode: String(payload.transportMode || activeEmailTransportMode()).trim() || activeEmailTransportMode(),
    fromEmail: String(payload.fromEmail || EMAIL_FROM).trim() || EMAIL_FROM,
    deliveryStatus: String(payload.deliveryStatus || "sent").trim() || "sent",
    artifactFile: String(payload.artifactFile || "").trim(),
    artifactPath: String(payload.artifactPath || "").trim(),
    rawEmailFile: String(payload.rawEmailFile || "").trim(),
    rawEmailPath: String(payload.rawEmailPath || "").trim(),
    providerResponse: String(payload.providerResponse || "").trim(),
    deliveredAt: payload.deliveredAt || new Date().toISOString(),
    previewText: String(payload.previewText || "").trim(),
    reason: String(payload.reason || "").trim()
  };
}

async function writeDeliveredMessageArtifact(memberEmail, runId, row, deliveredAt) {
  const memberDir = path.join(ALERT_DELIVERY_DIR, sanitizeFileSegment(memberEmail, "member"));
  await fsp.mkdir(memberDir, { recursive: true });
  const stamp = String(deliveredAt || new Date().toISOString()).replace(/[:.]/g, "-");
  const baseName = `${stamp}-${sanitizeFileSegment(row.recordId || row.area || "alert", "alert")}`;
  const artifactPath = path.join(memberDir, `${baseName}.json`);
  const rawEmailPath = path.join(memberDir, `${baseName}.eml`);
  const previewText = [
    `From: ${EMAIL_FROM}`,
    `To: ${memberEmail}`,
    `Subject: ${row.subject}`,
    `Area: ${row.area}`,
    `Trigger: ${row.trigger}`,
    `Cadence: ${row.cadence}`,
    "",
    row.message
  ].join("\n");
  const rawEmail = [
    `From: RentIntel Alerts <${EMAIL_FROM}>`,
    `To: ${memberEmail}`,
    `Subject: ${row.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    row.message,
    "",
    `Area: ${row.area}`,
    `Trigger: ${row.trigger}`,
    `Cadence: ${row.cadence}`
  ].join("\r\n");
  const artifact = {
    runId,
    deliveredAt,
    memberEmail,
    recordId: row.recordId,
    area: row.area,
    title: row.title,
    subject: row.subject,
    deliveryChannel: row.deliveryChannel || "email",
    trigger: row.trigger,
    cadence: row.cadence,
    message: row.message,
    previewText,
    fromEmail: EMAIL_FROM,
    transportMode: activeEmailTransportMode(),
    payload: row.deliveryPayload && typeof row.deliveryPayload === "object" ? row.deliveryPayload : {}
  };
  await fsp.writeFile(artifactPath, JSON.stringify(artifact, null, 2));
  await fsp.writeFile(rawEmailPath, rawEmail, "utf8");
  return {
    artifactFile: path.basename(artifactPath),
    artifactPath,
    rawEmailFile: path.basename(rawEmailPath),
    rawEmailPath,
    previewText
  };
}

async function sendDeliveryEmail(memberEmail, artifact) {
  if (activeEmailTransportMode() !== "smtp") {
    return {
      mode: "file",
      providerResponse: "Local delivery artifact written. SMTP transport not enabled."
    };
  }
  const args = [
    "--silent",
    "--show-error",
    "--url",
    SMTP_URL,
    "--mail-from",
    EMAIL_FROM,
    "--mail-rcpt",
    memberEmail,
    "--upload-file",
    artifact.rawEmailPath
  ];
  if (SMTP_USER || SMTP_PASS) {
    args.push("--user", `${SMTP_USER}:${SMTP_PASS}`);
  }
  const { stdout, stderr } = await execFileAsync(CURL_BINARY, args, {
    cwd: ROOT_DIR,
    maxBuffer: 4 * 1024 * 1024
  });
  return {
    mode: "smtp",
    providerResponse: String(stdout || stderr || "SMTP delivery accepted by provider.").trim()
  };
}

async function processDeliveryRun(db, member, payload = {}) {
  const queuedRows = Array.isArray(payload.queueRows) ? payload.queueRows : [];
  const now = new Date().toISOString();
  const runId = String(payload.runId || `run-${now.replace(/[-:TZ.]/g, "").slice(0, 14)}-${Math.random().toString(36).slice(2, 5)}`).trim();
  const startedAt = payload.startedAt || now;
  const outcomes = [];
  const deliveredMessages = [];
  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let deadLetterCount = 0;

  for (const queuedRow of queuedRows) {
    const row = normalizeAlertDeliveryPayload(queuedRow, member.email);
    const existingIndex = db.alertDeliveries.findIndex((entry) =>
      normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === row.recordId
    );
    const existing = existingIndex >= 0 ? db.alertDeliveries[existingIndex] : null;
    const target = existing
      ? { ...existing, ...row, id: existing.id || row.id, queuedAt: existing.queuedAt || row.queuedAt }
      : row;
    const gap = Number(target.deliveryPayload?.gap || 0);
    let status = "sent";
    let reason = "Delivery worker wrote this alert to the local delivery outbox.";
    let failureCode = "";
    let deliveredMessage = null;

    if (target.cadenceKey === "weekly" && Math.abs(gap) < 8) {
      status = "skipped";
      reason = "Cadence hold: weekly rule skipped this cycle due to small gap movement.";
    } else if (!target.subject || !target.message) {
      status = "failed";
      failureCode = "delivery-payload-invalid";
      reason = "Delivery worker blocked this alert because the outbound payload is incomplete.";
    } else {
      try {
        const deliveredAt = new Date().toISOString();
        const artifact = await writeDeliveredMessageArtifact(member.email, runId, target, deliveredAt);
        const transport = await sendDeliveryEmail(member.email, artifact);
        deliveredMessage = normalizeDeliveredMessagePayload({
          runId,
          recordId: target.recordId,
          area: target.area,
          title: target.title,
          subject: target.subject,
          message: target.message,
          trigger: target.trigger,
          cadence: target.cadence,
          deliveryChannel: target.deliveryChannel,
          transportMode: transport.mode,
          fromEmail: EMAIL_FROM,
          deliveryStatus: "sent",
          artifactFile: artifact.artifactFile,
          artifactPath: artifact.artifactPath,
          rawEmailFile: artifact.rawEmailFile,
          rawEmailPath: artifact.rawEmailPath,
          providerResponse: transport.providerResponse,
          deliveredAt,
          previewText: artifact.previewText,
          reason
        }, member.email);
        db.deliveredMessages.unshift(deliveredMessage);
      } catch (error) {
        status = "failed";
        failureCode = "artifact-write-failed";
        reason = `Delivery worker could not write the outbound artifact: ${error.message}`;
      }
    }

    const maxRetries = Math.max(1, Number(target.maxRetries || 2));
    const retryCount = status === "failed"
      ? Math.max(0, Number(target.retryCount || 0)) + 1
      : status === "queued"
        ? 0
        : Math.max(0, Number(target.retryCount || 0));
    const resolvedStatus = status === "failed" && retryCount >= maxRetries ? "dead-letter" : status;
    const resultAt = new Date().toISOString();
    const normalizedTarget = {
      ...target,
      memberEmail: member.email,
      status: deliveryStatusLabel(resolvedStatus),
      deliveryStatus: resolvedStatus,
      retryCount,
      maxRetries,
      failureCode: resolvedStatus === "failed" || resolvedStatus === "dead-letter" ? failureCode || target.failureCode || "provider-timeout" : "",
      deadLetterAt: resolvedStatus === "dead-letter" ? resultAt : "",
      suppressedAt: resolvedStatus === "suppressed" ? resultAt : "",
      updatedAt: resultAt,
      resultAt,
      lastReason: resolvedStatus === "dead-letter"
        ? `Retry ${retryCount}/${maxRetries} failed. Routed to dead-letter queue.`
        : reason,
      deliveryPayload: {
        ...(target.deliveryPayload || {}),
        retryCount,
        maxRetries,
        deliveryStatus: resolvedStatus,
        failureCode: resolvedStatus === "failed" || resolvedStatus === "dead-letter" ? failureCode || target.failureCode || "provider-timeout" : "",
        deadLetterAt: resolvedStatus === "dead-letter" ? resultAt : "",
        suppressedAt: resolvedStatus === "suppressed" ? resultAt : ""
      }
    };
    if (existingIndex >= 0) {
      db.alertDeliveries[existingIndex] = normalizedTarget;
    } else {
      db.alertDeliveries.unshift(normalizedTarget);
    }

    if (resolvedStatus === "sent") sentCount += 1;
    if (resolvedStatus === "failed") failedCount += 1;
    if (resolvedStatus === "skipped") skippedCount += 1;
    if (resolvedStatus === "dead-letter") deadLetterCount += 1;

    outcomes.push({
      recordId: target.recordId,
      area: target.area,
      title: target.title,
      status: resolvedStatus,
      reason: normalizedTarget.lastReason,
      retryCount,
      maxRetries,
      artifactFile: deliveredMessage?.artifactFile || "",
      messageId: deliveredMessage?.id || ""
    });
    if (deliveredMessage) {
      deliveredMessages.push(deliveredMessage);
    }
  }

  const finishedAt = new Date().toISOString();
  const deliveryRun = normalizeAlertDeliveryRunPayload({
    ...payload,
    runId,
    memberEmail: member.email,
    startedAt,
    finishedAt,
    totalQueued: queuedRows.length,
    sentCount,
    failedCount,
    deadLetterCount,
    skippedCount,
    outcomes
  }, member.email);
  db.alertDeliveryRuns.unshift(deliveryRun);
  return { deliveryRun, outcomes, deliveredMessages };
}

function normalizeAlertDeliveryAdminEntry(payload = {}, memberEmail = "") {
  return {
    ...payload,
    id: payload.id || randomToken(10),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail),
    actionType: String(payload.actionType || "").trim(),
    recordId: String(payload.recordId || "").trim(),
    area: String(payload.area || "").trim(),
    title: String(payload.title || "").trim(),
    fromStatus: String(payload.fromStatus || "").trim(),
    toStatus: String(payload.toStatus || "").trim(),
    retryCount: Math.max(0, Number(payload.retryCount || 0)),
    maxRetries: Math.max(1, Number(payload.maxRetries || 2)),
    reason: String(payload.reason || "").trim(),
    at: payload.at || new Date().toISOString()
  };
}

function normalizeSourceSyncRunPayload(payload = {}, memberEmail = "") {
  return {
    ...payload,
    id: payload.id || randomToken(10),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail),
    sourceName: String(payload.sourceName || "").trim(),
    sourceType: String(payload.sourceType || "").trim(),
    sourceKey: String(payload.sourceKey || "").trim(),
    status: String(payload.status || "").trim(),
    recordsChecked: Math.max(0, Number(payload.recordsChecked || 0)),
    benchmarkLayer: String(payload.benchmarkLayer || "").trim(),
    coverageTargets: Array.isArray(payload.coverageTargets) ? payload.coverageTargets : [],
    varianceFlag: String(payload.varianceFlag || "").trim(),
    at: payload.at || new Date().toISOString()
  };
}

function normalizeSourceSyncSchedulePayload(payload = {}, current = {}) {
  return {
    enabled: Boolean(payload.enabled ?? current.enabled),
    cadence: String(payload.cadence || current.cadence || "daily").trim() === "12h" ? "12h" : "daily",
    runHourSgt: Math.max(0, Math.min(23, Number(payload.runHourSgt ?? current.runHourSgt ?? 8))),
    nextRunAt: payload.nextRunAt ?? current.nextRunAt ?? "",
    lastRunAt: payload.lastRunAt ?? current.lastRunAt ?? "",
    lastRunStatus: payload.lastRunStatus ?? current.lastRunStatus ?? "not-run",
    lastRunMode: payload.lastRunMode ?? current.lastRunMode ?? "",
    lastFreshnessState: payload.lastFreshnessState ?? current.lastFreshnessState ?? "",
    lastFreshnessLabel: payload.lastFreshnessLabel ?? current.lastFreshnessLabel ?? "",
    lastBreachAt: payload.lastBreachAt ?? current.lastBreachAt ?? "",
    breachCount: Math.max(0, Number(payload.breachCount ?? current.breachCount ?? 0)),
    updatedAt: payload.updatedAt ?? current.updatedAt ?? "",
    updatedBy: payload.updatedBy ?? current.updatedBy ?? "",
    history: Array.isArray(payload.history) ? payload.history : (Array.isArray(current.history) ? current.history : [])
  };
}

function normalizeSourceFreshnessPolicyPayload(payload = {}, current = {}) {
  const freshMaxDays = Math.max(1, Math.min(60, Number(payload.freshMaxDays ?? current.freshMaxDays ?? 7)));
  const watchCandidate = Math.max(freshMaxDays + 1, Number(payload.watchMaxDays ?? current.watchMaxDays ?? 14));
  return {
    freshMaxDays,
    watchMaxDays: Math.max(freshMaxDays + 1, Math.min(90, watchCandidate)),
    updatedAt: payload.updatedAt ?? current.updatedAt ?? new Date().toISOString(),
    updatedBy: payload.updatedBy ?? current.updatedBy ?? ""
  };
}

function normalizeSourceFreshnessBreachPayload(payload = {}, memberEmail = "") {
  return {
    ...payload,
    id: payload.id || randomToken(10),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail),
    sourceName: String(payload.sourceName || "").trim(),
    freshnessState: String(payload.freshnessState || "").trim(),
    previousFreshnessState: String(payload.previousFreshnessState || "").trim(),
    breachAt: payload.breachAt || new Date().toISOString(),
    queueTrigger: String(payload.queueTrigger || "freshness-breach").trim(),
    deliveryIds: Array.isArray(payload.deliveryIds) ? payload.deliveryIds : [],
    note: String(payload.note || "").trim()
  };
}

function normalizeAskingSourceCandidatePayload(payload = {}, memberEmail = "", current = {}) {
  const now = new Date().toISOString();
  const type = String(payload.type || current.type || "source candidate").trim() || "source candidate";
  const name = String(payload.name || payload.requestedQuery || current.name || current.requestedQuery || "").trim();
  return {
    ...current,
    ...payload,
    id: String(payload.id || current.id || randomToken(10)).trim(),
    type,
    name,
    requestedQuery: String(payload.requestedQuery || current.requestedQuery || name).trim(),
    requestedArea: String(payload.requestedArea || current.requestedArea || "").trim(),
    requestedPropertyType: String(payload.requestedPropertyType || current.requestedPropertyType || "").trim(),
    requestedUseCase: String(payload.requestedUseCase || current.requestedUseCase || "").trim(),
    requestedUrgency: String(payload.requestedUrgency || current.requestedUrgency || "normal").trim() || "normal",
    requestEmail: normalizeEmail(payload.requestEmail || current.requestEmail || memberEmail),
    source: String(payload.source || current.source || "member-account").trim() || "member-account",
    status: String(payload.status || current.status || "candidate review").trim() || "candidate review",
    sourceClassification: String(payload.sourceClassification || current.sourceClassification || "").trim(),
    coverageEligibilityStatus: String(payload.coverageEligibilityStatus || current.coverageEligibilityStatus || "").trim(),
    coverageEligibilityReason: String(payload.coverageEligibilityReason || current.coverageEligibilityReason || "").trim(),
    coverageQaDecision: String(payload.coverageQaDecision || current.coverageQaDecision || "").trim(),
    coverageQaDecisionAt: payload.coverageQaDecisionAt || current.coverageQaDecisionAt || "",
    coverageQaDecisionBy: normalizeEmail(payload.coverageQaDecisionBy || current.coverageQaDecisionBy || ""),
    sampleRecordId: String(payload.sampleRecordId || current.sampleRecordId || "").trim(),
    sampleRecordCreatedAt: payload.sampleRecordCreatedAt || current.sampleRecordCreatedAt || "",
    productionReadyAt: payload.productionReadyAt || current.productionReadyAt || "",
    productionReadyBy: normalizeEmail(payload.productionReadyBy || current.productionReadyBy || ""),
    reviewedAt: payload.reviewedAt || current.reviewedAt || "",
    reviewedBy: normalizeEmail(payload.reviewedBy || current.reviewedBy || ""),
    reviewerNote: String(payload.reviewerNote || current.reviewerNote || "").trim(),
    addedAt: payload.addedAt || current.addedAt || now,
    updatedAt: now,
    backendStatus: "api-synced"
  };
}

function normalizeCoverageSampleRecordPayload(payload = {}, candidate = {}, actorEmail = "") {
  const sampleRecord = payload.sampleRecord && typeof payload.sampleRecord === "object" ? payload.sampleRecord : payload;
  const recordId = String(sampleRecord.recordId || sampleRecord.id || "").trim();
  const now = new Date().toISOString();
  return {
    id: String(payload.id || randomToken(10)).trim(),
    candidateId: String(payload.candidateId || candidate.id || "").trim(),
    recordId,
    title: String(sampleRecord.title || "").trim(),
    area: String(sampleRecord.area || "").trim(),
    propertyType: String(sampleRecord.propertyType || "").trim(),
    publicTrustLevel: String(payload.publicTrustLevel || sampleRecord.confidence || "Sample").trim() || "Sample",
    sourceSummary: String(payload.sourceSummary || sampleRecord.sourceSummary || "").trim(),
    samplePayload: sampleRecord,
    createdBy: normalizeEmail(actorEmail),
    createdAt: payload.createdAt || sampleRecord.generatedAt || now,
    releasedAt: payload.releasedAt || sampleRecord.productionReadyAt || ""
  };
}

function normalizeSourceReviewHistoryEntry(payload = {}, actorEmail = "") {
  return {
    id: String(payload.id || randomToken(10)).trim(),
    candidateId: String(payload.candidateId || "").trim(),
    action: String(payload.action || "").trim(),
    fromStatus: String(payload.fromStatus || "").trim(),
    toStatus: String(payload.toStatus || "").trim(),
    reviewerEmail: normalizeEmail(payload.reviewerEmail || actorEmail),
    reviewerNote: String(payload.reviewerNote || "").trim(),
    reviewPayload: payload.reviewPayload && typeof payload.reviewPayload === "object" ? payload.reviewPayload : {},
    createdAt: payload.createdAt || new Date().toISOString()
  };
}

function normalizeProductionEvidencePayload(payload = {}, memberEmail = "", current = {}) {
  const now = new Date().toISOString();
  return {
    ...current,
    sourceName: String(payload.sourceName || current.sourceName || "").trim(),
    sourceType: String(payload.sourceType || current.sourceType || "").trim(),
    sourceAttachedAt: payload.sourceAttachedAt || current.sourceAttachedAt || "",
    qaLogAt: payload.qaLogAt || current.qaLogAt || "",
    ownerReviewedAt: payload.ownerReviewedAt || current.ownerReviewedAt || "",
    evidenceReady: Boolean(payload.evidenceReady ?? current.evidenceReady),
    pilotFeed: payload.pilotFeed && typeof payload.pilotFeed === "object" ? payload.pilotFeed : (current.pilotFeed || {}),
    qaSummary: payload.qaSummary && typeof payload.qaSummary === "object" ? payload.qaSummary : (current.qaSummary || {}),
    qaRows: Array.isArray(payload.qaRows) ? payload.qaRows : (Array.isArray(current.qaRows) ? current.qaRows : []),
    readinessGate: payload.readinessGate && typeof payload.readinessGate === "object" ? payload.readinessGate : (current.readinessGate || {}),
    sourceTrust: payload.sourceTrust && typeof payload.sourceTrust === "object" ? payload.sourceTrust : (current.sourceTrust || {}),
    opsReview: payload.opsReview && typeof payload.opsReview === "object" ? payload.opsReview : (current.opsReview || {}),
    exceptionAlerts: payload.exceptionAlerts && typeof payload.exceptionAlerts === "object" ? payload.exceptionAlerts : (current.exceptionAlerts || {}),
    releaseLog: payload.releaseLog && typeof payload.releaseLog === "object" ? payload.releaseLog : (current.releaseLog || {}),
    handoffTasks: Array.isArray(payload.handoffTasks) ? payload.handoffTasks : (Array.isArray(current.handoffTasks) ? current.handoffTasks : []),
    controlledReleaseNextStep: String(payload.controlledReleaseNextStep || current.controlledReleaseNextStep || "").trim(),
    submittedBy: normalizeEmail(payload.submittedBy || memberEmail || current.submittedBy || ""),
    submittedAt: payload.submittedAt || current.submittedAt || now,
    updatedAt: now,
    backendStatus: "api-synced"
  };
}

function normalizeBackendHandoffAuditPayload(payload = {}, memberEmail = "", current = {}) {
  const packagePayload = payload.payload && typeof payload.payload === "object" ? payload.payload : payload;
  const validationRows = Array.isArray(payload.validationRows)
    ? payload.validationRows
    : Array.isArray(packagePayload?.readiness?.validationRows)
      ? packagePayload.readiness.validationRows
      : [];
  const summary = String(
    payload.summary ||
    packagePayload?.memberPayload?.handoff?.summary ||
    packagePayload?.readiness?.memberPayloadSummary ||
    ""
  ).trim();
  return {
    id: String(payload.id || current.id || randomToken(10)).trim(),
    memberEmail: normalizeEmail(payload.memberEmail || memberEmail || current.memberEmail || packagePayload?.generatedBy || packagePayload?.memberPayload?.member?.email || ""),
    contract: String(payload.contract || packagePayload.contract || current.contract || "rentintel-backend-handoff-package").trim(),
    version: String(payload.version || packagePayload.version || current.version || "prototype-v2").trim(),
    payload: packagePayload,
    validationRows,
    summary,
    generatedAt: payload.generatedAt || packagePayload.generatedAt || current.generatedAt || new Date().toISOString(),
    reviewedAt: payload.reviewedAt || current.reviewedAt || "",
    reviewerNote: String(payload.reviewerNote || current.reviewerNote || "").trim(),
    updatedAt: new Date().toISOString()
  };
}

function isoDateOnly(value = new Date()) {
  return new Date(value).toISOString().slice(0, 10);
}

function normalizeAskingRentFeedPayload(payload = {}, current = {}) {
  const records = Array.isArray(payload.records)
    ? payload.records
      .map((record) => ({
        recordId: String(record.recordId || "").trim(),
        asking: Number.isFinite(Number(record.asking)) ? Number(Number(record.asking).toFixed(1)) : null,
        latestAskingMedian: Number.isFinite(Number(record.latestAskingMedian)) ? Number(Number(record.latestAskingMedian).toFixed(1)) : null,
        fairRange: record.fairRange && typeof record.fairRange === "object"
          ? {
              low: Number.isFinite(Number(record.fairRange.low)) ? Number(Number(record.fairRange.low).toFixed(1)) : null,
              high: Number.isFinite(Number(record.fairRange.high)) ? Number(Number(record.fairRange.high).toFixed(1)) : null
            }
          : null,
        listingCount: Math.max(0, Number(record.listingCount || 0)),
        capturedAt: String(record.capturedAt || "").trim(),
        freshness: String(record.freshness || "").trim(),
        note: String(record.note || "").trim()
      }))
      .filter((record) => record.recordId)
    : (Array.isArray(current.records) ? current.records : []);
  return {
    ...current,
    version: String(payload.version || current.version || `asking-feed-capture-${isoDateOnly()}`).trim(),
    updatedAt: String(payload.updatedAt || current.updatedAt || isoDateOnly()).trim(),
    connectionState: String(payload.connectionState || current.connectionState || "pending-source").trim(),
    sourceName: String(payload.sourceName || current.sourceName || "RentIntel asking-rent feed").trim(),
    sourceType: String(payload.sourceType || current.sourceType || "verified-daily-capture").trim(),
    productionReady: Boolean(payload.productionReady ?? current.productionReady),
    note: String(payload.note || current.note || "").trim(),
    records
  };
}

function generateRefreshedAskingFeed(current = {}, actorEmail = "") {
  const refreshedDate = isoDateOnly();
  const baseFeed = normalizeAskingRentFeedPayload(current, current);
  const adjustedRecords = (Array.isArray(baseFeed.records) ? baseFeed.records : []).map((record, index) => {
    const delta = ((index % 3) - 1) * 0.2 + 0.1;
    const asking = Number.isFinite(Number(record.asking)) ? Number(record.asking) : 0;
    const latest = Number.isFinite(Number(record.latestAskingMedian)) ? Number(record.latestAskingMedian) : asking;
    const nextAsking = Number((asking + delta).toFixed(1));
    const nextLatest = Number((latest + delta).toFixed(1));
    const fairRange = record.fairRange && typeof record.fairRange === "object"
      ? {
          low: Number((Number(record.fairRange.low || Math.max(0, nextAsking - 2)) + delta / 2).toFixed(1)),
          high: Number((Number(record.fairRange.high || nextAsking + 2) + delta / 2).toFixed(1))
        }
      : null;
    return {
      ...record,
      asking: nextAsking,
      latestAskingMedian: nextLatest,
      fairRange,
      listingCount: Math.max(Number(record.listingCount || 0) + 1, 3),
      capturedAt: refreshedDate,
      freshness: "verified daily capture",
      note: `${record.note || "Daily capture workflow refreshed."} Refreshed ${refreshedDate}${actorEmail ? ` by ${actorEmail}` : ""}.`.trim()
    };
  });
  return normalizeAskingRentFeedPayload({
    ...baseFeed,
    version: `asking-feed-capture-${refreshedDate}`,
    updatedAt: refreshedDate,
    connectionState: "verified-daily-capture-connected",
    sourceName: "RentIntel verified daily asking-rent capture",
    sourceType: "verified-daily-capture",
    productionReady: false,
    note: "Verified daily capture workflow connected. Keep ingestion QA and source-owner review running before production release.",
    records: adjustedRecords
  }, baseFeed);
}

async function handleRequestCode(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const body = await readBody(request);
  const email = normalizeEmail(body.email);
  if (!email) {
    return json(response, 400, { ok: false, error: "Email is required" });
  }

  const member = DB_ENGINE === "sqlite"
    ? await sqliteReadMemberByEmail(email)
    : (await readDb()).members.find((entry) => entry.email === email);
  if (!member) {
    return json(response, 404, {
      ok: false,
      status: "unknown-member"
    });
  }

  const code = createCode();
  const expiresAt = new Date(Date.now() + LOGIN_CODE_TTL_MS).toISOString();
  const loginCode = {
    id: randomToken(12),
    memberEmail: email,
    codeHash: hashValue(code),
    expiresAt,
    consumedAt: null,
    createdAt: new Date().toISOString()
  };
  if (DB_ENGINE === "sqlite") {
    await sqlitePersistLoginCode(loginCode);
  } else {
    const db = await readDb();
    db.loginCodes = db.loginCodes.filter((entry) => entry.memberEmail !== email || entry.consumedAt);
    db.loginCodes.push(loginCode);
    await writeDb(db);
  }

  return json(response, 200, {
    ok: true,
    status: "code-sent",
    maskedEmail: maskEmail(email),
    expiresAt,
    debugCode: code
  });
}

async function handleVerifyCode(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const body = await readBody(request);
  const email = normalizeEmail(body.email);
  const code = String(body.code || "").trim();
  if (!email || !code) {
    return json(response, 400, { ok: false, error: "Email and code are required" });
  }

  if (DB_ENGINE === "sqlite") {
    const verification = await sqliteVerifyCodeAndCreateSession(email, code);
    if (!verification.ok) {
      const statusCode = verification.error === "Unknown member" ? 404 : 401;
      return json(response, statusCode, { ok: false, error: verification.error });
    }
    return json(
      response,
      200,
      {
        ok: true,
        member: serializeMember(verification.member, verification.sessionToken)
      },
      {
        "Set-Cookie": buildSessionCookie(verification.sessionToken)
      }
    );
  }
  const db = await readDb();
  const member = db.members.find((entry) => entry.email === email);
  if (!member) {
    return json(response, 404, { ok: false, error: "Member not found" });
  }

  const now = Date.now();
  const codeHash = hashValue(code);
  const loginCode = db.loginCodes.find((entry) =>
    entry.memberEmail === email &&
    !entry.consumedAt &&
    entry.codeHash === codeHash &&
    new Date(entry.expiresAt).getTime() > now
  );

  if (!loginCode) {
    return json(response, 401, { ok: false, error: "Invalid or expired code" });
  }

  loginCode.consumedAt = new Date().toISOString();
  const sessionToken = randomToken(24);
  const expiresAt = new Date(now + SESSION_TTL_MS).toISOString();
  db.sessions = db.sessions.filter((entry) => entry.memberEmail !== email || entry.revokedAt);
  db.sessions.push({
    id: randomToken(12),
    memberEmail: email,
    sessionHash: hashValue(sessionToken),
    access: member.access,
    toolsEnabled: member.toolsEnabled,
    role: member.role,
    expiresAt,
    revokedAt: null,
    createdAt: new Date().toISOString()
  });
  await writeDb(db);

  return json(
    response,
    200,
    {
      ok: true,
      member: serializeMember(member, sessionToken)
    },
    {
      "Set-Cookie": buildSessionCookie(sessionToken)
    }
  );
}

async function handleMemberMe(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const { db, session, member, token } = await lookupSession(request);
  if (!session || !member) {
    return json(response, 401, { ok: false, error: "No active session" });
  }

  const notificationPreferences = DB_ENGINE === "sqlite"
    ? (await sqliteReadNotificationPreference(member.email)) || {
      email: member.email,
      dailyBrief: true,
      activationUpdates: true,
      watchlistAlerts: false,
      sourceSyncAlerts: false
    }
    : (db.notificationPreferences[member.email] || {
      dailyBrief: true,
      activationUpdates: true,
      watchlistAlerts: false,
      sourceSyncAlerts: false
    });
  const activationRequest = DB_ENGINE === "sqlite"
    ? await sqliteReadActivationRequest(member.email)
    : (db.activationRequests.find((entry) => normalizeEmail(entry.email) === member.email) || null);

  return json(response, 200, {
    ok: true,
    member: serializeMember(member, token),
    notificationPreferences,
    activationRequest
  });
}

async function handleMemberReports(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;

  if (request.method === "GET") {
    const reports = DB_ENGINE === "sqlite"
      ? await sqliteReadReportsByMember(member.email)
      : db.savedReports
        .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
        .sort((left, right) => new Date(right.updatedAt || right.savedAt || 0).getTime() - new Date(left.updatedAt || left.savedAt || 0).getTime());
    return json(response, 200, { ok: true, reports });
  }

  if (request.method === "POST") {
    const body = await readBody(request);
    const report = normalizeReportPayload(body, member.email);
    if (!report.recordId) {
      return json(response, 400, { ok: false, error: "recordId is required" });
    }
    if (DB_ENGINE === "sqlite") {
      const existingReport = (await sqliteReadReportsByMember(member.email))
        .find((entry) => String(entry.recordId) === report.recordId);
      if (existingReport) {
        report.savedAt = existingReport.savedAt || report.savedAt;
      }
      await sqliteUpsertReport(report);
    } else {
      const existingIndex = db.savedReports.findIndex((entry) =>
        normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === report.recordId
      );
      if (existingIndex >= 0) {
        report.savedAt = db.savedReports[existingIndex].savedAt || report.savedAt;
        db.savedReports[existingIndex] = {
          ...db.savedReports[existingIndex],
          ...report
        };
      } else {
        db.savedReports.unshift(report);
      }
      await writeDb(db);
    }
    return json(response, 200, { ok: true, report });
  }

  return methodNotAllowed(response);
}

async function handleMemberWatchlist(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;

  if (request.method === "GET") {
    const watchlist = DB_ENGINE === "sqlite"
      ? await sqliteReadWatchlistByMember(member.email)
      : db.watchlist
        .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
        .sort((left, right) => new Date(right.addedAt || 0).getTime() - new Date(left.addedAt || 0).getTime());
    const alertRules = DB_ENGINE === "sqlite"
      ? await sqliteReadAlertRulesByMember(member.email)
      : db.alertRules
        .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
        .sort((left, right) => new Date(right.updatedAt || right.savedAt || 0).getTime() - new Date(left.updatedAt || left.savedAt || 0).getTime());
    return json(response, 200, { ok: true, watchlist, alertRules });
  }

  if (request.method === "POST") {
    const body = await readBody(request);
    const watchlistItem = normalizeWatchlistPayload(body, member.email);
    if (!watchlistItem.recordId) {
      return json(response, 400, { ok: false, error: "recordId is required" });
    }
    if (DB_ENGINE === "sqlite") {
      await sqliteUpsertWatchlistItem(watchlistItem);
    } else {
      db.watchlist = db.watchlist.filter((entry) =>
        !(normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === watchlistItem.recordId)
      );
      db.watchlist.unshift(watchlistItem);
      await writeDb(db);
    }
    return json(response, 200, { ok: true, watchlistItem });
  }

  return methodNotAllowed(response);
}

async function handleDeleteMemberWatchlist(request, response, recordId) {
  if (request.method !== "DELETE") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const normalizedRecordId = String(recordId || "").trim();
  if (DB_ENGINE === "sqlite") {
    const existingWatchlist = await sqliteReadWatchlistByMember(member.email);
    const existingRules = await sqliteReadAlertRulesByMember(member.email);
    const removed = existingWatchlist.some((entry) => String(entry.recordId) === normalizedRecordId)
      || existingRules.some((entry) => String(entry.recordId) === normalizedRecordId);
    if (removed) {
      await sqliteDeleteWatchlistAndRules(member.email, normalizedRecordId);
    }
    return json(response, 200, {
      ok: true,
      removed,
      recordId: normalizedRecordId
    });
  }
  const beforeWatchlist = db.watchlist.length;
  const beforeRules = db.alertRules.length;
  db.watchlist = db.watchlist.filter((entry) =>
    !(normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === normalizedRecordId)
  );
  db.alertRules = db.alertRules.filter((entry) =>
    !(normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === normalizedRecordId)
  );
  if (db.watchlist.length !== beforeWatchlist || db.alertRules.length !== beforeRules) {
    await writeDb(db);
  }
  return json(response, 200, {
    ok: true,
    removed: db.watchlist.length !== beforeWatchlist || db.alertRules.length !== beforeRules,
    recordId: normalizedRecordId
  });
}

async function handleMemberAlerts(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const alertRule = normalizeAlertRulePayload(body, member.email);
  if (!alertRule.recordId) {
    return json(response, 400, { ok: false, error: "recordId is required" });
  }
  if (DB_ENGINE === "sqlite") {
    const existingRule = (await sqliteReadAlertRulesByMember(member.email))
      .find((entry) => String(entry.recordId) === alertRule.recordId);
    if (existingRule) {
      alertRule.savedAt = existingRule.savedAt || alertRule.savedAt;
    }
    await sqliteUpsertAlertRule(alertRule);
  } else {
    const existingIndex = db.alertRules.findIndex((entry) =>
      normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === alertRule.recordId
    );
    if (existingIndex >= 0) {
      alertRule.savedAt = db.alertRules[existingIndex].savedAt || alertRule.savedAt;
      db.alertRules[existingIndex] = {
        ...db.alertRules[existingIndex],
        ...alertRule
      };
    } else {
      db.alertRules.unshift(alertRule);
    }
    await writeDb(db);
  }
  return json(response, 200, { ok: true, alertRule });
}

async function handleMemberAlertDeliveries(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const statusFilter = String(requestUrl.searchParams.get("status") || "").trim().toLowerCase();
  let alertDeliveries = db.alertDeliveries.filter((entry) => normalizeEmail(entry.memberEmail) === member.email);
  if (statusFilter) {
    alertDeliveries = alertDeliveries.filter((entry) => String(entry.deliveryStatus || "").toLowerCase() === statusFilter);
  }
  alertDeliveries.sort((left, right) => String(right.updatedAt || right.queuedAt || "").localeCompare(String(left.updatedAt || left.queuedAt || "")));
  const summary = {
    queued: alertDeliveries.filter((entry) => entry.deliveryStatus === "queued").length,
    sent: alertDeliveries.filter((entry) => entry.deliveryStatus === "sent").length,
    skipped: alertDeliveries.filter((entry) => entry.deliveryStatus === "skipped").length,
    failed: alertDeliveries.filter((entry) => entry.deliveryStatus === "failed").length,
    acknowledged: alertDeliveries.filter((entry) => entry.deliveryStatus === "acknowledged").length,
    suppressed: alertDeliveries.filter((entry) => entry.deliveryStatus === "suppressed").length,
    deadLetter: alertDeliveries.filter((entry) => entry.deliveryStatus === "dead-letter").length
  };
  return json(response, 200, { ok: true, alertDeliveries, summary });
}

async function handleMemberAlertMessages(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const deliveredMessages = db.deliveredMessages
    .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
    .sort((left, right) => String(right.deliveredAt || "").localeCompare(String(left.deliveredAt || "")));
  return json(response, 200, { ok: true, deliveredMessages });
}

async function handleMemberQueueDelivery(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const alertDelivery = normalizeAlertDeliveryPayload(body, member.email);
  if (!alertDelivery.recordId) {
    return json(response, 400, { ok: false, error: "recordId is required" });
  }
  const existingIndex = db.alertDeliveries.findIndex((entry) =>
    normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === alertDelivery.recordId
  );
  if (existingIndex >= 0) {
    alertDelivery.id = db.alertDeliveries[existingIndex].id || alertDelivery.id;
    alertDelivery.queuedAt = db.alertDeliveries[existingIndex].queuedAt || alertDelivery.queuedAt;
    db.alertDeliveries[existingIndex] = {
      ...db.alertDeliveries[existingIndex],
      ...alertDelivery
    };
  } else {
    db.alertDeliveries.unshift(alertDelivery);
  }
  await writeDb(db);
  return json(response, 200, { ok: true, alertDelivery });
}

async function handleMemberAlertDeliveryRuns(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  if (request.method === "GET") {
    const deliveryRuns = db.alertDeliveryRuns
      .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
      .sort((left, right) => String(right.finishedAt || right.startedAt || "").localeCompare(String(left.finishedAt || left.startedAt || "")));
    return json(response, 200, { ok: true, deliveryRuns });
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    if (Array.isArray(body.queueRows)) {
      const { deliveryRun, deliveredMessages } = await processDeliveryRun(db, member, body);
      await writeDb(db);
      return json(response, 200, {
        ok: true,
        deliveryRun,
        outcomes: deliveryRun.outcomes,
        deliveredMessages,
        updatedDeliveries: db.alertDeliveries.filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
      });
    }
    const deliveryRun = normalizeAlertDeliveryRunPayload(body, member.email);
    db.alertDeliveryRuns.unshift(deliveryRun);
    const outcomes = Array.isArray(deliveryRun.outcomes) ? deliveryRun.outcomes : [];
    outcomes.forEach((outcome) => {
      const target = db.alertDeliveries.find((entry) =>
        normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === String(outcome.recordId || "")
      );
      if (!target) return;
      target.deliveryStatus = String(outcome.status || target.deliveryStatus || "queued");
      target.status = target.deliveryStatus;
      target.lastReason = String(outcome.reason || target.lastReason || "");
      target.retryCount = Math.max(0, Number(outcome.retryCount ?? target.retryCount ?? 0));
      target.maxRetries = Math.max(1, Number(outcome.maxRetries ?? target.maxRetries ?? 2));
      target.updatedAt = deliveryRun.finishedAt;
      target.resultAt = deliveryRun.finishedAt;
      target.deliveryPayload = {
        ...(target.deliveryPayload || {}),
        retryCount: target.retryCount,
        maxRetries: target.maxRetries,
        deliveryStatus: target.deliveryStatus
      };
    });
    await writeDb(db);
    return json(response, 200, { ok: true, deliveryRun, updatedDeliveries: outcomes.length });
  }
  return methodNotAllowed(response);
}

async function handleMemberAlertAdminActions(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  if (request.method === "GET") {
    const adminActions = db.alertDeliveryAdminLog
      .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
      .sort((left, right) => String(right.at || "").localeCompare(String(left.at || "")));
    return json(response, 200, { ok: true, adminActions });
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    const adminAction = normalizeAlertDeliveryAdminEntry(body, member.email);
    db.alertDeliveryAdminLog.unshift(adminAction);
    const target = db.alertDeliveries.find((entry) =>
      normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === adminAction.recordId
    );
    if (target) {
      target.deliveryStatus = adminAction.toStatus || target.deliveryStatus;
      target.status = target.deliveryStatus;
      target.lastReason = adminAction.reason || target.lastReason;
      target.retryCount = adminAction.retryCount;
      target.maxRetries = adminAction.maxRetries;
      target.updatedAt = adminAction.at;
      target.deliveryPayload = {
        ...(target.deliveryPayload || {}),
        retryCount: target.retryCount,
        maxRetries: target.maxRetries,
        deliveryStatus: target.deliveryStatus
      };
    }
    await writeDb(db);
    return json(response, 200, { ok: true, adminAction, alertDelivery: target || null });
  }
  return methodNotAllowed(response);
}

async function handleMemberPreferences(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const preference = normalizeNotificationPreferencePayload(body, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveNotificationPreference(preference);
  } else {
    db.notificationPreferences[member.email] = preference;
    await writeDb(db);
  }
  return json(response, 200, { ok: true, notificationPreferences: preference });
}

async function handleMemberPromoApply(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db, session, token } = lookup;
  const body = await readBody(request);
  const code = String(body.code || "").trim().toUpperCase();
  const promo = db.promoCodes.find((entry) => String(entry.code || "").trim().toUpperCase() === code && entry.active !== false);
  if (!promo) {
    return json(response, 404, { ok: false, error: "Promo code not recognised" });
  }
  member.memberStatus = "Promo user";
  member.subscriptionStatus = `Promo access active: S$0 pilot`;
  member.access = promo.access || "promo";
  member.promoCode = promo.code;
  member.toolsEnabled = true;
  member.updatedAt = new Date().toISOString();
  if (session) {
    session.access = member.access;
    session.toolsEnabled = member.toolsEnabled;
  }
  promo.redeemedCount = Number(promo.redeemedCount || 0) + 1;
  if (DB_ENGINE === "sqlite") {
    await sqliteSavePromoAndMember(member, promo, session);
  } else {
    await writeDb(db);
  }
  return json(response, 200, {
    ok: true,
    member: serializeMember(member, token),
    promo: {
      code: promo.code,
      access: member.access,
      description: promo.description || ""
    }
  });
}

async function handleMemberActivationRequests(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const activationRequest = normalizeActivationRequestPayload(body, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveActivationRequest(activationRequest);
  } else {
    db.activationRequests = db.activationRequests.filter((entry) => normalizeEmail(entry.email) !== member.email);
    db.activationRequests.unshift(activationRequest);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, activationRequest });
}

async function handleMemberRolesAudit(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const isAdmin = member.role === "admin";
  const roleAuditLog = DB_ENGINE === "sqlite"
    ? (await sqliteSelectPayloadRows("member_role_audit_log", "", "acted_at desc"))
      .filter((entry) => isAdmin || normalizeEmail(entry.memberEmail || entry.targetEmail) === member.email)
    : db.roleAuditLog
      .filter((entry) => isAdmin || normalizeEmail(entry.memberEmail || entry.targetEmail) === member.email)
      .sort((left, right) => String(right.at || "").localeCompare(String(left.at || "")));
  const members = isAdmin
    ? (
      DB_ENGINE === "sqlite"
        ? await sqliteSelectPayloadRows("members", "", "updated_at desc")
        : db.members.slice()
    ).sort((left, right) => String(left.email).localeCompare(String(right.email)))
    : [];
  return json(response, 200, { ok: true, roleAuditLog, members });
}

async function handleMemberRoles(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  if (member.role !== "admin") {
    return json(response, 403, { ok: false, error: "Admin access required" });
  }
  const { db, token, session } = lookup;
  const body = await readBody(request);
  const targetEmail = normalizeEmail(body.targetEmail);
  const nextRole = String(body.nextRole || "member").trim().toLowerCase() === "admin" ? "admin" : "member";
  const reason = String(body.reason || "Registry admin role update").trim();
  if (!targetEmail) {
    return json(response, 400, { ok: false, error: "targetEmail is required" });
  }
  let target = db.members.find((entry) => normalizeEmail(entry.email) === targetEmail);
  if (!target) {
    target = toMemberRecord({ email: targetEmail });
    db.members.unshift(target);
  }
  const previousRole = String(target.role || "member").trim().toLowerCase() === "admin" ? "admin" : "member";
  if (previousRole === nextRole) {
    return json(response, 200, {
      ok: true,
      memberRole: { targetEmail, previousRole, nextRole },
      roleAudit: null,
      member: serializeMember(target, normalizeEmail(target.email) === member.email ? token : "")
    });
  }
  const adminCount = db.members.filter((entry) => String(entry.role || "").toLowerCase() === "admin").length;
  if (previousRole === "admin" && nextRole === "member" && adminCount <= 1) {
    return json(response, 400, { ok: false, error: "At least one admin must remain in the registry" });
  }
  target.role = nextRole;
  target.updatedAt = new Date().toISOString();
  if (session && normalizeEmail(target.email) === member.email) {
    session.role = nextRole;
  }
  const roleAudit = normalizeRoleAuditEntry({
    memberEmail: member.email,
    actorEmail: member.email,
    targetEmail,
    previousRole,
    nextRole,
    reason
  }, member.email, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveRoleChange(target, roleAudit, session);
  } else {
    db.roleAuditLog.unshift(roleAudit);
    await writeDb(db);
  }
  return json(response, 200, {
    ok: true,
    memberRole: { targetEmail, previousRole, nextRole },
    roleAudit,
    member: serializeMember(target, normalizeEmail(target.email) === member.email ? token : "")
  });
}

async function handleAdminOpsReport(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  if (member.role !== "admin") {
    return json(response, 403, { ok: false, error: "Admin access required" });
  }
  const report = DB_ENGINE === "sqlite"
    ? await sqliteGenerateOpsReport()
    : {
      generatedAt: new Date().toISOString(),
      storage: {
        engine: DB_ENGINE,
        file: DB_FILE
      },
      counts: {
        members: Array.isArray(lookup.db?.members) ? lookup.db.members.length : 0,
        sessions: Array.isArray(lookup.db?.sessions) ? lookup.db.sessions.length : 0,
        savedReports: Array.isArray(lookup.db?.savedReports) ? lookup.db.savedReports.length : 0,
        watchlistAreas: Array.isArray(lookup.db?.watchlist) ? lookup.db.watchlist.length : 0,
        alertRules: Array.isArray(lookup.db?.alertRules) ? lookup.db.alertRules.length : 0,
        alertDeliveries: Array.isArray(lookup.db?.alertDeliveries) ? lookup.db.alertDeliveries.length : 0,
        deliveredMessages: Array.isArray(lookup.db?.deliveredMessages) ? lookup.db.deliveredMessages.length : 0,
        askingSourceCandidates: Array.isArray(lookup.db?.askingSourceCandidates) ? lookup.db.askingSourceCandidates.length : 0,
        coverageSampleRecords: Array.isArray(lookup.db?.coverageSampleRecords) ? lookup.db.coverageSampleRecords.length : 0,
        sourceSyncRuns: Array.isArray(lookup.db?.sourceSyncRuns) ? lookup.db.sourceSyncRuns.length : 0,
        backendHandoffAudit: Array.isArray(lookup.db?.backendHandoffAudit) ? lookup.db.backendHandoffAudit.length : 0
      }
    };
  return json(response, 200, { ok: true, report });
}

async function handleSourceSyncRuns(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const syncRun = normalizeSourceSyncRunPayload(body, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveSourceSyncRun(syncRun);
  } else {
    db.sourceSyncRuns.unshift(syncRun);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, syncRun });
}

async function handleSourceAskingFeed(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const db = await readDb();
  return json(response, 200, {
    ok: true,
    feed: db.askingRentFeed
  });
}

async function handleSourceAskingFeedRefresh(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const refreshedFeed = generateRefreshedAskingFeed(db.askingRentFeed || {}, member.email);
  db.askingRentFeed = refreshedFeed;
  await writeDb(db);
  return json(response, 200, {
    ok: true,
    feed: refreshedFeed,
    refresh: {
      refreshedAt: refreshedFeed.updatedAt,
      sourceName: refreshedFeed.sourceName,
      recordCount: Array.isArray(refreshedFeed.records) ? refreshedFeed.records.length : 0
    }
  });
}

async function handleSourceSyncSchedule(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  if (request.method === "GET") {
    if (DB_ENGINE === "sqlite") {
      const syncSchedule = await sqliteReadSourceSyncSchedule("asking-rent");
      const freshnessPolicy = await sqliteReadSourceFreshnessPolicy("asking-rent");
      return json(response, 200, {
        ok: true,
        syncSchedule: syncSchedule || db.sourceSyncSchedule,
        freshnessPolicy: freshnessPolicy || db.sourceFreshnessPolicy
      });
    }
    return json(response, 200, {
      ok: true,
      syncSchedule: db.sourceSyncSchedule,
      freshnessPolicy: db.sourceFreshnessPolicy
    });
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    const currentSchedule = DB_ENGINE === "sqlite"
      ? (await sqliteReadSourceSyncSchedule("asking-rent")) || db.sourceSyncSchedule
      : db.sourceSyncSchedule;
    const syncSchedule = normalizeSourceSyncSchedulePayload(body, currentSchedule);
    if (DB_ENGINE === "sqlite") {
      await sqliteSaveSourceSyncSchedule(syncSchedule, "asking-rent");
    } else {
      db.sourceSyncSchedule = syncSchedule;
      await writeDb(db);
    }
    return json(response, 200, { ok: true, syncSchedule });
  }
  return methodNotAllowed(response);
}

async function handleSourceFreshnessPolicy(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const currentPolicy = DB_ENGINE === "sqlite"
    ? (await sqliteReadSourceFreshnessPolicy("asking-rent")) || db.sourceFreshnessPolicy
    : db.sourceFreshnessPolicy;
  const freshnessPolicy = normalizeSourceFreshnessPolicyPayload(body, currentPolicy);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveSourceFreshnessPolicy(freshnessPolicy, "asking-rent");
  } else {
    db.sourceFreshnessPolicy = freshnessPolicy;
    await writeDb(db);
  }
  return json(response, 200, { ok: true, freshnessPolicy });
}

async function handleSourceFreshnessBreachEvents(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const body = await readBody(request);
  const breachEvent = normalizeSourceFreshnessBreachPayload(body, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveSourceFreshnessBreachEvent(breachEvent);
  } else {
    db.sourceFreshnessBreachEvents.unshift(breachEvent);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, breachEvent });
}

async function handleSourceAskingCandidates(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;

  if (request.method === "GET") {
    const candidates = DB_ENGINE === "sqlite"
      ? await sqliteReadAskingSourceCandidates()
      : [...db.askingSourceCandidates]
        .sort((left, right) => String(right.updatedAt || right.addedAt || "").localeCompare(String(left.updatedAt || left.addedAt || "")));
    const sampleRecords = DB_ENGINE === "sqlite"
      ? await sqliteReadCoverageSampleRecords()
      : [...db.coverageSampleRecords]
        .sort((left, right) => String(right.releasedAt || right.createdAt || "").localeCompare(String(left.releasedAt || left.createdAt || "")));
    return json(response, 200, { ok: true, candidates, sampleRecords });
  }

  if (request.method === "POST") {
    const body = await readBody(request);
    const incomingId = String(body.id || "").trim();
    const existingCandidates = DB_ENGINE === "sqlite" ? await sqliteReadAskingSourceCandidates() : db.askingSourceCandidates;
    const existingIndex = existingCandidates.findIndex((entry) =>
      (incomingId && String(entry.id || "") === incomingId) ||
      (!incomingId &&
        String(entry.type || "").trim().toLowerCase() === String(body.type || "").trim().toLowerCase() &&
        String(entry.name || entry.requestedQuery || "").trim().toLowerCase() === String(body.name || body.requestedQuery || "").trim().toLowerCase())
    );
    const current = existingIndex >= 0 ? existingCandidates[existingIndex] : {};
    const candidate = normalizeAskingSourceCandidatePayload(body, member.email, current);
    if (!candidate.name) {
      return json(response, 400, { ok: false, error: "Candidate name is required" });
    }
    if (DB_ENGINE === "sqlite") {
      await sqliteUpsertAskingSourceCandidate(candidate);
    } else {
      if (existingIndex >= 0) db.askingSourceCandidates[existingIndex] = candidate;
      else db.askingSourceCandidates.unshift(candidate);
      await writeDb(db);
    }
    return json(response, 200, { ok: true, candidate });
  }

  return methodNotAllowed(response);
}

async function handleSourceCoverageRequests(request, response) {
  if (request.method !== "GET") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const statusFilter = String(requestUrl.searchParams.get("status") || "").trim().toLowerCase();
  const classificationFilter = String(requestUrl.searchParams.get("classification") || "").trim().toLowerCase();
  const eligibilityFilter = String(requestUrl.searchParams.get("coverageEligibilityStatus") || "").trim().toLowerCase();
  const candidates = DB_ENGINE === "sqlite" ? await sqliteReadAskingSourceCandidates() : db.askingSourceCandidates;
  let coverageRequests = candidates.filter((entry) => String(entry.type || "").trim().toLowerCase() === "coverage request");
  if (statusFilter) coverageRequests = coverageRequests.filter((entry) => String(entry.status || "").trim().toLowerCase() === statusFilter);
  if (classificationFilter) coverageRequests = coverageRequests.filter((entry) => String(entry.sourceClassification || "").trim().toLowerCase() === classificationFilter);
  if (eligibilityFilter) coverageRequests = coverageRequests.filter((entry) => String(entry.coverageEligibilityStatus || "").trim().toLowerCase() === eligibilityFilter);
  coverageRequests.sort((left, right) => String(right.updatedAt || right.addedAt || "").localeCompare(String(left.updatedAt || left.addedAt || "")));
  const sampleRecordPool = DB_ENGINE === "sqlite"
    ? await sqliteReadCoverageSampleRecords(coverageRequests.map((entry) => entry.id))
    : db.coverageSampleRecords;
  const sampleRecords = sampleRecordPool.filter((entry) =>
    coverageRequests.some((candidate) => String(candidate.id || "") === String(entry.candidateId || ""))
  );
  const summary = {
    total: coverageRequests.length,
    pending: coverageRequests.filter((entry) => !["approved for pilot", "rejected"].includes(String(entry.status || ""))).length,
    approved: coverageRequests.filter((entry) => String(entry.status || "") === "approved for pilot" && !entry.productionReadyAt).length,
    rejected: coverageRequests.filter((entry) => String(entry.status || "") === "rejected").length,
    productionReady: coverageRequests.filter((entry) => Boolean(entry.productionReadyAt)).length
  };
  return json(response, 200, { ok: true, coverageRequests, sampleRecords, summary });
}

async function handleSourceCoverageClassification(request, response, candidateId) {
  if (request.method !== "PATCH") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const candidates = DB_ENGINE === "sqlite" ? await sqliteReadAskingSourceCandidates() : db.askingSourceCandidates;
  const index = candidates.findIndex((entry) => String(entry.id || "") === String(candidateId || ""));
  if (index < 0) return json(response, 404, { ok: false, error: "Coverage request not found" });
  const body = await readBody(request);
  const current = candidates[index];
  const candidate = normalizeAskingSourceCandidatePayload({
    ...current,
    sourceClassification: body.sourceClassification,
    coverageEligibilityStatus: body.coverageEligibilityStatus,
    coverageEligibilityReason: body.reviewerNote || body.coverageEligibilityReason || current.coverageEligibilityReason || "",
    reviewerNote: body.reviewerNote || "",
    reviewedAt: new Date().toISOString(),
    reviewedBy: member.email
  }, member.email, current);
  const reviewEntry = normalizeSourceReviewHistoryEntry({
    candidateId,
    action: "classification",
    fromStatus: current.status,
    toStatus: candidate.status,
    reviewerNote: body.reviewerNote || "",
    reviewPayload: {
      sourceClassification: candidate.sourceClassification,
      coverageEligibilityStatus: candidate.coverageEligibilityStatus
    }
  }, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveCandidateReview(candidate, reviewEntry);
  } else {
    db.askingSourceCandidates[index] = candidate;
    db.sourceReviewHistory.unshift(reviewEntry);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, candidate });
}

async function handleSourceCoverageQaDecision(request, response, candidateId) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const candidates = DB_ENGINE === "sqlite" ? await sqliteReadAskingSourceCandidates() : db.askingSourceCandidates;
  const index = candidates.findIndex((entry) => String(entry.id || "") === String(candidateId || ""));
  if (index < 0) return json(response, 404, { ok: false, error: "Coverage request not found" });
  const body = await readBody(request);
  const current = candidates[index];
  const candidate = normalizeAskingSourceCandidatePayload({
    ...current,
    coverageQaDecision: body.coverageQaDecision,
    coverageQaDecisionAt: new Date().toISOString(),
    coverageQaDecisionBy: member.email,
    reviewerNote: body.reviewerNote || current.reviewerNote || "",
    reviewedAt: new Date().toISOString(),
    reviewedBy: member.email
  }, member.email, current);
  db.askingSourceCandidates[index] = candidate;
  const qaDecision = {
    candidateId: String(candidate.id || ""),
    coverageQaDecision: candidate.coverageQaDecision,
    qaChecks: Array.isArray(body.qaChecks) ? body.qaChecks : [],
    reviewerNote: String(body.reviewerNote || "").trim(),
    decidedAt: candidate.coverageQaDecisionAt,
    decidedBy: member.email
  };
  const reviewEntry = normalizeSourceReviewHistoryEntry({
    candidateId,
    action: "qa-decision",
    fromStatus: current.status,
    toStatus: candidate.status,
    reviewerNote: qaDecision.reviewerNote,
    reviewPayload: qaDecision
  }, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveCandidateReview(candidate, reviewEntry);
  } else {
    db.askingSourceCandidates[index] = candidate;
    db.sourceReviewHistory.unshift(reviewEntry);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, candidate, qaDecision });
}

async function handleSourceCoverageSampleRecord(request, response, candidateId) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const candidates = DB_ENGINE === "sqlite" ? await sqliteReadAskingSourceCandidates() : db.askingSourceCandidates;
  const index = candidates.findIndex((entry) => String(entry.id || "") === String(candidateId || ""));
  if (index < 0) return json(response, 404, { ok: false, error: "Coverage request not found" });
  const body = await readBody(request);
  const current = candidates[index];
  const sampleRecord = normalizeCoverageSampleRecordPayload(body, current, member.email);
  if (!sampleRecord.recordId) {
    return json(response, 400, { ok: false, error: "sampleRecord.recordId is required" });
  }
  const candidate = normalizeAskingSourceCandidatePayload({
    ...current,
    sampleRecordId: sampleRecord.recordId,
    sampleRecordCreatedAt: current.sampleRecordCreatedAt || sampleRecord.createdAt,
    reviewedAt: new Date().toISOString(),
    reviewedBy: member.email
  }, member.email, current);
  const reviewEntry = normalizeSourceReviewHistoryEntry({
    candidateId,
    action: "sample-record",
    fromStatus: current.status,
    toStatus: candidate.status,
    reviewerNote: String(body.sourceSummary || "").trim(),
    reviewPayload: {
      publicTrustLevel: sampleRecord.publicTrustLevel,
      recordId: sampleRecord.recordId
    }
  }, member.email);
  if (DB_ENGINE === "sqlite") {
    await sqliteSaveCandidateReview(candidate, reviewEntry, sampleRecord);
  } else {
    const existingSampleIndex = db.coverageSampleRecords.findIndex((entry) =>
      String(entry.recordId || "") === sampleRecord.recordId || String(entry.candidateId || "") === String(candidateId || "")
    );
    if (existingSampleIndex >= 0) db.coverageSampleRecords[existingSampleIndex] = sampleRecord;
    else db.coverageSampleRecords.unshift(sampleRecord);
    db.askingSourceCandidates[index] = candidate;
    db.sourceReviewHistory.unshift(reviewEntry);
    await writeDb(db);
  }
  return json(response, 200, { ok: true, sampleRecord, candidate });
}

async function handleSourceProductionEvidence(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  if (request.method === "GET") {
    const productionEvidence = DB_ENGINE === "sqlite"
      ? (await sqliteReadProductionEvidence("asking-rent")) || db.productionEvidence || {}
      : db.productionEvidence || {};
    return json(response, 200, { ok: true, productionEvidence });
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    if (body.reset === true) {
      if (DB_ENGINE === "sqlite") {
        await sqliteSaveProductionEvidence({});
      } else {
        db.productionEvidence = {};
        await writeDb(db);
      }
      return json(response, 200, { ok: true, productionEvidence: {} });
    }
    const currentEvidence = DB_ENGINE === "sqlite"
      ? (await sqliteReadProductionEvidence("asking-rent")) || db.productionEvidence || {}
      : db.productionEvidence || {};
    const productionEvidence = normalizeProductionEvidencePayload(body, member.email, currentEvidence);
    if (DB_ENGINE === "sqlite") {
      await sqliteSaveProductionEvidence(productionEvidence);
    } else {
      db.productionEvidence = productionEvidence;
      await writeDb(db);
    }
    return json(response, 200, { ok: true, productionEvidence });
  }
  return methodNotAllowed(response);
}

async function handleBackendHandoffAudit(request, response) {
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;

  if (request.method === "GET") {
    const audits = DB_ENGINE === "sqlite"
      ? await sqliteReadBackendHandoffAudits(member.email)
      : db.backendHandoffAudit
        .filter((entry) => normalizeEmail(entry.memberEmail) === member.email)
        .sort((left, right) => String(right.generatedAt || "").localeCompare(String(left.generatedAt || "")));
    return json(response, 200, {
      ok: true,
      handoffAudits: audits,
      latestAudit: audits[0] || null
    });
  }

  if (request.method === "POST") {
    const body = await readBody(request);
    const existingAudits = DB_ENGINE === "sqlite" ? await sqliteReadBackendHandoffAudits(member.email) : db.backendHandoffAudit;
    const existingIndex = body.id
      ? existingAudits.findIndex((entry) =>
          normalizeEmail(entry.memberEmail) === member.email && String(entry.id || "") === String(body.id || "")
        )
      : -1;
    const current = existingIndex >= 0 ? existingAudits[existingIndex] : {};
    const audit = normalizeBackendHandoffAuditPayload(body, member.email, current);
    if (!audit.payload || typeof audit.payload !== "object") {
      return json(response, 400, { ok: false, error: "payload is required" });
    }
    if (DB_ENGINE === "sqlite") {
      await sqliteUpsertBackendHandoffAudit(audit);
    } else {
      if (existingIndex >= 0) db.backendHandoffAudit[existingIndex] = audit;
      else db.backendHandoffAudit.unshift(audit);
      await writeDb(db);
    }
    return json(response, 200, { ok: true, handoffAudit: audit });
  }

  return methodNotAllowed(response);
}

async function handleDeleteMemberReport(request, response, recordId) {
  if (request.method !== "DELETE") return methodNotAllowed(response);
  const lookup = await lookupSession(request);
  const member = requireMemberSession(lookup, response);
  if (!member) return;
  const { db } = lookup;
  const normalizedRecordId = String(recordId || "").trim();
  if (DB_ENGINE === "sqlite") {
    const reports = await sqliteReadReportsByMember(member.email);
    const removed = reports.some((entry) => String(entry.recordId) === normalizedRecordId);
    if (removed) {
      await sqliteDeleteReportByRecord(member.email, normalizedRecordId);
    }
    return json(response, 200, { ok: true, removed, recordId: normalizedRecordId });
  }
  const before = db.savedReports.length;
  db.savedReports = db.savedReports.filter((entry) =>
    !(normalizeEmail(entry.memberEmail) === member.email && String(entry.recordId) === normalizedRecordId)
  );
  if (db.savedReports.length !== before) {
    await writeDb(db);
  }
  return json(response, 200, { ok: true, removed: db.savedReports.length !== before, recordId: normalizedRecordId });
}

async function handleLogout(request, response) {
  if (request.method !== "POST") return methodNotAllowed(response);
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (token) {
    if (DB_ENGINE === "sqlite") {
      const session = await sqliteReadSessionByToken(token);
      if (session) {
        await runSqlite(`
          update sessions
          set payload_json = json_set(payload_json, '$.revokedAt', ${sqliteJsonLiteral(new Date().toISOString())})
          where ${sqliteWhereEquals("id", String(session.id || ""))};
        `);
      }
    } else {
      const db = await readDb();
      const session = db.sessions.find((entry) => entry.sessionHash === hashValue(token));
      if (session) {
        session.revokedAt = new Date().toISOString();
        await writeDb(db);
      }
    }
  }

  return json(
    response,
    200,
    { ok: true, status: "signed-out" },
    { "Set-Cookie": buildSessionCookie("", 0) }
  );
}

async function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(ROOT_DIR, safePath);

  if (requestPath === "/") {
    filePath = path.join(ROOT_DIR, "index.html");
  }

  if (!filePath.startsWith(ROOT_DIR)) {
    return notFound(response);
  }

  try {
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const content = await fsp.readFile(filePath);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  } catch {
    notFound(response);
  }
}

async function route(request, response) {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (pathname === "/api/health") {
      await ensureDb();
      const schemaMigrations = DB_ENGINE === "sqlite" ? await sqliteReadSchemaMigrations() : [];
      return json(response, 200, {
        ok: true,
        status: "ready",
        storage: {
          engine: DB_ENGINE,
          sqliteFile: DB_ENGINE === "sqlite" ? SQLITE_FILE : "",
          jsonMirrorFile: DB_FILE,
          normalizedTables: DB_ENGINE === "sqlite"
            ? [
              "members",
              "login_codes",
              "sessions",
              "member_saved_reports",
              "member_watchlist_areas",
              "member_alert_rules",
              "member_notification_preferences",
              "promo_codes",
              "member_activation_requests",
              "member_role_audit_log",
              "asking_source_candidates",
              "coverage_sample_records",
              "source_review_history",
              "source_sync_runs",
              "source_sync_schedule",
              "source_freshness_policy",
              "source_freshness_breach_events",
              "asking_source_production_evidence",
              "backend_handoff_audit",
              "member_alert_deliveries",
              "member_alert_delivery_runs",
              "member_alert_delivery_admin_log",
              "member_alert_delivered_messages"
            ]
            : []
          ,
          schemaMigrations: DB_ENGINE === "sqlite"
            ? schemaMigrations.map((entry) => ({
              version: entry.version,
              appliedAt: entry.applied_at
            }))
            : []
        },
        email: {
          ...emailTransportSummary(),
          curlBinary: CURL_BINARY
        }
      });
    }
    if (pathname === "/api/sources/asking-feed") {
      return await handleSourceAskingFeed(request, response);
    }
    if (pathname === "/api/members/login/request-code") {
      return await handleRequestCode(request, response);
    }
    if (pathname === "/api/members/login/verify-code") {
      return await handleVerifyCode(request, response);
    }
    if (pathname === "/api/members/me") {
      return await handleMemberMe(request, response);
    }
    if (pathname === "/api/members/reports") {
      return await handleMemberReports(request, response);
    }
    if (pathname.startsWith("/api/members/reports/")) {
      const recordId = decodeURIComponent(pathname.slice("/api/members/reports/".length));
      return await handleDeleteMemberReport(request, response, recordId);
    }
    if (pathname === "/api/members/watchlist") {
      return await handleMemberWatchlist(request, response);
    }
    if (pathname.startsWith("/api/members/watchlist/")) {
      const recordId = decodeURIComponent(pathname.slice("/api/members/watchlist/".length));
      return await handleDeleteMemberWatchlist(request, response, recordId);
    }
    if (pathname === "/api/members/alerts") {
      return await handleMemberAlerts(request, response);
    }
    if (pathname === "/api/members/alerts/deliveries") {
      return await handleMemberAlertDeliveries(request, response);
    }
    if (pathname === "/api/members/alerts/messages") {
      return await handleMemberAlertMessages(request, response);
    }
    if (pathname === "/api/members/alerts/queue-delivery") {
      return await handleMemberQueueDelivery(request, response);
    }
    if (pathname === "/api/members/alerts/delivery-runs") {
      return await handleMemberAlertDeliveryRuns(request, response);
    }
    if (pathname === "/api/members/alerts/admin-actions") {
      return await handleMemberAlertAdminActions(request, response);
    }
    if (pathname === "/api/members/preferences") {
      return await handleMemberPreferences(request, response);
    }
    if (pathname === "/api/members/promo/apply") {
      return await handleMemberPromoApply(request, response);
    }
    if (pathname === "/api/members/activation-requests") {
      return await handleMemberActivationRequests(request, response);
    }
    if (pathname === "/api/members/roles/audit") {
      return await handleMemberRolesAudit(request, response);
    }
    if (pathname === "/api/members/roles") {
      return await handleMemberRoles(request, response);
    }
    if (pathname === "/api/admin/ops-report") {
      return await handleAdminOpsReport(request, response);
    }
    if (pathname === "/api/sources/asking-candidates") {
      return await handleSourceAskingCandidates(request, response);
    }
    if (pathname === "/api/sources/asking-feed/refresh") {
      return await handleSourceAskingFeedRefresh(request, response);
    }
    if (pathname === "/api/sources/coverage-requests") {
      return await handleSourceCoverageRequests(request, response);
    }
    if (pathname.startsWith("/api/sources/coverage-requests/") && pathname.endsWith("/classification")) {
      const candidateId = decodeURIComponent(pathname.slice("/api/sources/coverage-requests/".length, -"/classification".length));
      return await handleSourceCoverageClassification(request, response, candidateId);
    }
    if (pathname.startsWith("/api/sources/coverage-requests/") && pathname.endsWith("/qa-decision")) {
      const candidateId = decodeURIComponent(pathname.slice("/api/sources/coverage-requests/".length, -"/qa-decision".length));
      return await handleSourceCoverageQaDecision(request, response, candidateId);
    }
    if (pathname.startsWith("/api/sources/coverage-requests/") && pathname.endsWith("/sample-record")) {
      const candidateId = decodeURIComponent(pathname.slice("/api/sources/coverage-requests/".length, -"/sample-record".length));
      return await handleSourceCoverageSampleRecord(request, response, candidateId);
    }
    if (pathname === "/api/sources/sync-runs") {
      return await handleSourceSyncRuns(request, response);
    }
    if (pathname === "/api/sources/sync-schedule") {
      return await handleSourceSyncSchedule(request, response);
    }
    if (pathname === "/api/sources/freshness-policy") {
      return await handleSourceFreshnessPolicy(request, response);
    }
    if (pathname === "/api/sources/freshness-breach-events") {
      return await handleSourceFreshnessBreachEvents(request, response);
    }
    if (pathname === "/api/sources/production-evidence") {
      return await handleSourceProductionEvidence(request, response);
    }
    if (pathname === "/api/backend/handoff-audit") {
      return await handleBackendHandoffAudit(request, response);
    }
    if (pathname === "/api/members/logout") {
      return await handleLogout(request, response);
    }
    return await serveStatic(request, response);
  } catch (error) {
    console.error(error);
    return json(response, 500, {
      ok: false,
      error: "Internal server error",
      detail: error.message
    });
  }
}

http.createServer(route).listen(PORT, HOST, () => {
  console.log(`RentIntel server running at http://${HOST}:${PORT}`);
});
