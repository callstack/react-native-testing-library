#!/usr/bin/env node
/**
 * Report model, token, and cost usage for an agent session window, as JSON.
 *
 * Read-only. Node 18+, built-ins only. Supports Claude Code and Codex transcripts.
 *
 * Usage:
 *   node usage-report.mjs [--harness claude|codex|auto] [--since ISO8601] [--until ISO8601]
 *                         [--session-id ID] [--transcript PATH]... [--prices FILE] [--cwd DIR]
 *
 *   --harness     transcript format; auto (default) picks the harness with a transcript for the
 *                 cwd, the most recently modified if both
 *   --since/until only count records whose timestamp is in the half-open window [since, until), so
 *                 adjacent windows (one stage's --until = the next one's --since) never double count.
 *                 Give ISO 8601 with an explicit offset (Z or ±HH:MM, e.g. 2026-11-21T10:00:00Z) or
 *                 a date only (UTC). A date-time without an offset is rejected (exit 2), since it
 *                 would be read as machine-local time while transcript timestamps are UTC
 *   --session-id  use that session instead of the newest one for the cwd. Always pass it when
 *                 several sessions may share the cwd; without it, another session's usage inside
 *                 the window adds a format_warnings entry
 *   --transcript  explicit JSONL file (repeatable); skips discovery, including subagents.
 *                 For Codex, pass an exported main rollout and any contributing subagent rollouts
 *   --prices      JSON {model: {input, output, cache_write_5m, cache_write_1h, cache_read,
 *                 long_context: {threshold, input, output, cache_write_5m, cache_write_1h,
 *                 cache_read}}} in USD per MTok, merged field by field over the built-in
 *                 Anthropic prices (long_context merges over the built-in one, if any); key
 *                 "<model> (fast)" prices fast-mode usage
 *   --cwd         project directory to discover transcripts for (default: current directory)
 *
 * Claude Code: $CLAUDE_CONFIG_DIR or ~/.claude, projects/<cwd slug>/<session>.jsonl plus every
 *   *.jsonl under projects/<cwd slug>/<session>/ (subagents). Streamed messages repeat; dedupes
 *   by message.id, keeping the last.
 * Codex: $CODEX_HOME or ~/.codex, sessions/**\/rollout-*.jsonl. Counts deltas of the cumulative
 *   token_count totals, attributed to the latest turn_context model. Subagent rollouts are all
 *   descendants of the main session (subagents of subagents included), linked by session_meta
 *   parent_thread_id (or source.subagent.thread_spawn.parent_thread_id). A fork (forked_from_id
 *   only) is a user-started session: it can be the main session and is never counted as a subagent
 *   of its origin. A fork rollout may begin with a copy of the parent's history: in such a
 *   rollout, token_count events stamped before its own session_meta timestamp are ignored, but the last
 *   such total is the baseline when the first later total is >= it on every field (the counter
 *   continues the parent's, so that first event's delta is counted). Otherwise (counter restarted,
 *   or no copied events at all) the first later total is counted in full; the no-copied-events case
 *   adds a format_warnings entry. Usage is never dropped silently. The format is undocumented;
 *   surprises are listed in format_warnings.
 *
 * Output: {harness, session_id, window, sources, models, totals, prices_as_of, skipped_lines,
 *   format_warnings}. Per model: input, output, reasoning_output (Codex only, included in output),
 *   cache_read, cache_write_5m, cache_write_1h, messages (Claude) or events (Codex), cost_usd.
 *   Codex input excludes cached tokens. A model with no price has cost_usd null and the totals
 *   have cost_complete false, and totals.cost_usd is null (cost_usd_known sums the priced models).
 *   For Codex, totals.usage_complete is false when a supplied rollout has no readable usage
 *   or contains an unrecognized usage record. Its total cost is then null even with prices.
 *   Never estimate a missing price. Claude messages are priced one by one: a message whose
 *   prompt (input + cache_read + cache_write tokens) exceeds the model's long_context.threshold
 *   (built in for claude-haiku-5-5: 100000) uses the long_context rates; per-model cost_usd is the
 *   sum. Codex has no tiering; its events use the base rates. Claude messages with usage.speed
 *   "fast" are reported as a separate model "<model> (fast)", priced only by a "<model> (fast)"
 *   entry (built in for claude-opus-5-5 and claude-fable-5-2 input and output only; supply cache
 *   rates and other models via --prices, else cost null and cost_complete false). They never fall
 *   back to standard rates.
 *
 * Exit: 0 ok (models empty when nothing matched), 2 bad arguments or no transcript found.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

const PRICES_AS_OF = "2026-11-03";
// USD per MTok, Anthropic first party.
const BUILTIN_PRICES = {
  "claude-opus-5-5": { input: 4, output: 20, cache_write_5m: 5, cache_write_1h: 8, cache_read: 0.2 },
  "claude-sonnet-5-5": { input: 2, output: 10, cache_write_5m: 2.5, cache_write_1h: 4, cache_read: 0.1 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cache_write_5m: 0.125, cache_write_1h: 0.2, cache_read: 0.01,
    // Prompts over 100K tokens: 5x input, 5x output, same cache multipliers.
    long_context: { threshold: 100000, input: 0.5, output: 2.5, cache_write_5m: 0.625, cache_write_1h: 1, cache_read: 0.05 } },
  "claude-fable-5-2": { input: 8, output: 40, cache_write_5m: 10, cache_write_1h: 16, cache_read: 0.2 },
  // Fast mode (usage.speed "fast") is reported under "<model> (fast)". Only input/output fast prices
  // are published, so cache rates are omitted: fast messages with cache tokens have cost null unless --prices supplies them.
  "claude-opus-5-5 (fast)": { input: 8, output: 40 },
  "claude-fable-5-2 (fast)": { input: 16, output: 80 },
};
const FAST_SUFFIX = " (fast)";
const TOKEN_FIELDS = ["input", "output", "cache_read", "cache_write_5m", "cache_write_1h"];

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const HAS_OFFSET = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

class UsageError extends Error {}

function parseArgs(argv) {
  const opts = { harness: "auto", transcripts: [] };
  const valueFlags = ["harness", "since", "until", "session-id", "transcript", "prices", "cwd"];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      opts.help = true;
      continue;
    }
    const m = /^--([a-z-]+)(?:=(.*))?$/.exec(arg);
    if (!m || !valueFlags.includes(m[1])) throw new UsageError(`unknown argument: ${arg}`);
    let value = m[2];
    if (value === undefined) {
      value = argv[++i];
      if (value === undefined || value.startsWith("--")) throw new UsageError(`--${m[1]} needs a value`);
    }
    if (m[1] === "transcript") opts.transcripts.push(value);
    else opts[m[1].replace(/-(.)/g, (_, c) => c.toUpperCase())] = value;
  }
  if (!["auto", "claude", "codex"].includes(opts.harness)) {
    throw new UsageError("--harness must be claude, codex, or auto");
  }
  for (const key of ["since", "until"]) {
    if (opts[key] === undefined) continue;
    const v = opts[key];
    if (Number.isNaN(Date.parse(v))) throw new UsageError(`--${key} is not a valid ISO 8601 time: ${v}`);
    // Date.parse reads a date-time without an offset as machine-local time; require UTC or an explicit offset.
    if (!DATE_ONLY.test(v) && !HAS_OFFSET.test(v)) {
      throw new UsageError(`--${key} needs a UTC offset (Z or ±HH:MM, e.g. 2026-11-21T10:00:00Z) or a date only: ${v}`);
    }
  }
  return opts;
}

function helpText() {
  const src = fs.readFileSync(new URL(import.meta.url), "utf8");
  const m = /\/\*\*\n([\s\S]*?)\*\//.exec(src);
  return m[1].replace(/^ \* ?/gm, "").replace(/\*\\\//g, "*/");
}

// ---------- shared helpers ----------

function blankUsage() {
  return { input: 0, output: 0, reasoning_output: 0, cache_read: 0, cache_write_5m: 0, cache_write_1h: 0, count: 0 };
}

function num(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function makeWindow(opts) {
  const since = opts.since === undefined ? null : Date.parse(opts.since);
  const until = opts.until === undefined ? null : Date.parse(opts.until);
  return {
    since: opts.since ?? null,
    until: opts.until ?? null,
    contains(ts) {
      if (since === null && until === null) return true;
      const t = typeof ts === "string" ? Date.parse(ts) : NaN;
      if (Number.isNaN(t)) return false;
      return (since === null || t >= since) && (until === null || t < until);
    },
  };
}

async function forEachJsonl(file, onRecord, counters) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch {
      counters.skipped_lines++;
      continue;
    }
    if (rec && typeof rec === "object") onRecord(rec);
    else counters.skipped_lines++;
  }
}

function readFirstJsonLine(file) {
  const fd = fs.openSync(file, "r");
  try {
    const chunks = [];
    const buf = Buffer.alloc(65536);
    let total = 0;
    for (;;) {
      const n = fs.readSync(fd, buf, 0, buf.length, null);
      if (n === 0) break;
      const nl = buf.subarray(0, n).indexOf(10);
      chunks.push(Buffer.from(buf.subarray(0, nl === -1 ? n : nl)));
      total += n;
      if (nl !== -1 || total > 16 * 1024 * 1024) break;
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return null;
    }
  } finally {
    fs.closeSync(fd);
  }
}

function walk(dir, match, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, match, out);
    else if (e.isFile() && match(e.name)) out.push(p);
  }
  return out;
}

function mtime(file) {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return 0;
  }
}

// ---------- Claude Code adapter ----------

function claudeProjectDirs(cwd) {
  const root = path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"), "projects");
  const slugs = [cwd.replace(/[^a-zA-Z0-9]/g, "-"), cwd.replace(/[/.]/g, "-")];
  return [...new Set(slugs)].map((s) => path.join(root, s));
}

function discoverClaude(opts, cwd) {
  if (opts.transcripts.length) {
    return opts.transcripts.map((p) => ({ path: path.resolve(p), role: p.includes(`${path.sep}subagents${path.sep}`) ? "subagent" : "main" }));
  }
  for (const dir of claudeProjectDirs(cwd)) {
    let files;
    try {
      files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl"));
    } catch {
      continue;
    }
    let main;
    if (opts.sessionId) {
      main = files.find((f) => f === `${opts.sessionId}.jsonl`);
    } else {
      main = files.map((f) => ({ f, t: mtime(path.join(dir, f)) })).sort((a, b) => b.t - a.t)[0]?.f;
    }
    if (!main) continue;
    const id = main.slice(0, -".jsonl".length);
    const sources = [{ path: path.join(dir, main), role: "main", session_id: id }];
    for (const p of walk(path.join(dir, id), (n) => n.endsWith(".jsonl")).sort()) sources.push({ path: p, role: "subagent" });
    if (!opts.sessionId) sources.others = files.filter((f) => f !== main).map((f) => path.join(dir, f));
    return sources;
  }
  return [];
}

async function readClaude(sources, win, counters, prices) {
  const byId = new Map(); // message.id -> {model, usage, timestamp}
  let anon = 0;
  for (const src of sources) {
    src.records = 0;
    await forEachJsonl(src.path, (rec) => {
      const msg = rec.message;
      if (!msg || typeof msg !== "object" || !msg.usage || typeof msg.usage !== "object" || typeof msg.model !== "string" || !msg.model) return;
      if (msg.model === "<synthetic>") return;
      src.records++;
      const key = typeof msg.id === "string" && msg.id ? msg.id : `__anon${anon++}`;
      byId.delete(key); // keep the last occurrence
      const model = msg.usage.speed === "fast" ? msg.model + FAST_SUFFIX : msg.model;
      byId.set(key, { model, usage: msg.usage, timestamp: rec.timestamp });
    }, counters);
  }
  const models = {};
  for (const { model, usage, timestamp } of byId.values()) {
    if (!win.contains(timestamp)) continue;
    const m = (models[model] ??= blankUsage());
    const lc = priceFor(prices, model)?.long_context;
    const cc = usage.cache_creation && typeof usage.cache_creation === "object" ? usage.cache_creation : null;
    const u = blankUsage();
    u.input = num(usage.input_tokens);
    u.output = num(usage.output_tokens);
    u.cache_read = num(usage.cache_read_input_tokens);
    if (cc && ("ephemeral_5m_input_tokens" in cc || "ephemeral_1h_input_tokens" in cc)) {
      u.cache_write_5m = num(cc.ephemeral_5m_input_tokens);
      u.cache_write_1h = num(cc.ephemeral_1h_input_tokens);
    } else {
      u.cache_write_5m = num(usage.cache_creation_input_tokens);
    }
    u.count = 1;
    const prompt = u.input + u.cache_read + u.cache_write_5m + u.cache_write_1h;
    const isLong = lc && typeof lc.threshold === "number" && prompt > lc.threshold;
    // Tokens billed at the long-context tier are also kept apart so cost can price them separately.
    for (const k of Object.keys(u)) {
      m[k] += u[k];
      if (isLong) (m.long ??= blankUsage())[k] += u[k];
    }
  }
  return { models, countKey: "messages", warnings: [] };
}

// ---------- Codex adapter ----------

function codexRoot() {
  return path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "sessions");
}

function codexMeta(file) {
  const rec = readFirstJsonLine(file);
  const p = rec && rec.type === "session_meta" && rec.payload && typeof rec.payload === "object" ? rec.payload : null;
  if (!p) return null;
  const spawn = p.source && p.source.subagent && p.source.subagent.thread_spawn;
  return {
    path: file,
    id: p.id ?? null,
    cwd: p.cwd ?? null,
    // Spawn parent only: a fork (forked_from_id) is a user-started session, not a subagent.
    parent: p.parent_thread_id ?? (spawn && spawn.parent_thread_id) ?? null,
    mtime: mtime(file),
  };
}

function discoverCodex(opts, cwd) {
  if (opts.transcripts.length) {
    const [main, ...others] = opts.transcripts.map((p) => path.resolve(p));
    for (const file of [main, ...others]) {
      if (!fs.existsSync(file)) throw new UsageError(`transcript not found: ${file}`);
    }
    const meta = codexMeta(main);
    if (opts.sessionId && meta?.id !== opts.sessionId) {
      throw new UsageError("the first --transcript must belong to the requested Codex session");
    }
    const sources = [{ path: main, role: "main", session_id: meta?.id }];
    const metas = others.map((file) => codexMeta(file) ?? { path: file });
    appendCodexDescendants(sources, metas, meta?.id);
    if (opts.sessionId && sources.length !== opts.transcripts.length) {
      throw new UsageError("additional Codex transcripts must be distinct descendants of the requested session");
    }
    // With no session ID, preserve explicit files supplied without usable lineage metadata.
    for (const file of others) {
      if (!sources.some((source) => source.path === file)) sources.push({ path: file, role: "main" });
    }
    return sources;
  }
  const metas = walk(codexRoot(), (n) => /^rollout-.*\.jsonl$/.test(n)).map(codexMeta).filter(Boolean);
  const candidates = metas.filter((m) => (opts.sessionId ? m.id === opts.sessionId : m.cwd === cwd && !m.parent));
  candidates.sort((a, b) => b.mtime - a.mtime);
  const main = candidates[0];
  if (!main) return [];
  const sources = [{ path: main.path, role: "main", session_id: main.id }];
  appendCodexDescendants(sources, metas, main.id);
  if (!opts.sessionId) sources.others = candidates.slice(1).map((m) => m.path);
  return sources;
}

function appendCodexDescendants(sources, metas, mainId) {
  if (mainId) {
    // Spawned descendants transitively (main -> A -> B); forks are never counted; the seen set also guards against parent cycles.
    const seen = new Set([mainId]);
    const descendants = new Set();
    for (let grew = true; grew; ) {
      grew = false;
      for (const m of metas) {
        if (m.parent && seen.has(m.parent) && m.path !== sources[0].path && !descendants.has(m.path)) {
          descendants.add(m.path);
          if (m.id) seen.add(m.id);
          grew = true;
        }
      }
    }
    for (const p of [...descendants].sort()) sources.push({ path: p, role: "subagent" });
  }
}

async function readCodex(sources, win, counters) {
  const models = {};
  const warnings = [];
  let usageComplete = true;
  for (const src of sources) {
    src.records = 0;
    let tokenEvents = 0;
    let unreadableEvents = 0;
    const skippedBefore = counters.skipped_lines;
    let model = null;
    let metaModel = null;
    let prev = null;
    let forkStart = null; // ms; token_count events before it are copied parent history
    let needBaseline = false;
    let lastPre = null; // last copied pre-fork total
    await forEachJsonl(src.path, (rec) => {
      const p = rec.payload && typeof rec.payload === "object" ? rec.payload : null;
      if (!p) return;
      if (rec.type === "session_meta") {
        if (typeof p.model === "string") metaModel = p.model;
        if ((p.forked_from_id || p.parent_thread_id) && forkStart === null) {
          const t = Date.parse(p.timestamp ?? rec.timestamp);
          if (!Number.isNaN(t)) forkStart = t;
        }
        if (p.forked_from_id) needBaseline = true;
      } else if (rec.type === "turn_context") {
        if (typeof p.model === "string" && p.model) model = p.model;
      } else if (rec.type === "event_msg" && p.type === "token_count") {
        // A null info is a normal context update without new usage.
        if (p.info === null) return;
        const cur = codexTokenTotal(p.info?.total_token_usage);
        const timestamp = Date.parse(rec.timestamp);
        if (!cur || !Number.isFinite(timestamp)) {
          unreadableEvents++;
          return;
        }
        if (forkStart !== null && timestamp < forkStart) {
          lastPre = cur;
          return;
        }
        tokenEvents++;
        let delta = { ...cur };
        if (needBaseline) {
          needBaseline = false;
          if (lastPre) {
            // Continuing the parent's counter: baseline is the last copied total. A restarted counter is counted in full.
            if (Object.keys(cur).every((k) => cur[k] >= lastPre[k])) prev = lastPre;
          } else {
            warnings.push(`${path.basename(src.path)}: fork without copied history; first token_count total counted in full (assumed a fresh counter)`);
          }
        }
        if (prev) {
          const reset = cur.input < prev.input || cur.output < prev.output || cur.cached < prev.cached;
          if (!reset) for (const k of Object.keys(cur)) delta[k] = cur[k] - prev[k];
        }
        prev = cur;
        if (!win.contains(rec.timestamp)) return;
        if (!delta.input && !delta.output && !delta.cached && !delta.reasoning && !delta.write) return;
        const name = model ?? metaModel ?? "unknown";
        const m = (models[name] ??= blankUsage());
        m.input += Math.max(0, delta.input - delta.cached);
        m.output += Math.max(0, delta.output);
        m.reasoning_output += Math.max(0, delta.reasoning);
        m.cache_read += Math.max(0, delta.cached);
        m.cache_write_5m += Math.max(0, delta.write);
        m.count++;
        src.records++;
      }
    }, counters);
    const name = path.basename(src.path);
    if (!tokenEvents) warnings.push(`${name}: no readable token_count events found`);
    if (unreadableEvents) warnings.push(`${name}: ${unreadableEvents} unrecognized token_count event(s)`);
    const skipped = counters.skipped_lines - skippedBefore;
    if (skipped) warnings.push(`${name}: ${skipped} unreadable JSONL record(s)`);
    usageComplete &&= tokenEvents > 0 && unreadableEvents === 0 && skipped === 0;
  }
  if (models.unknown) warnings.push("some token events had no preceding turn_context model; attributed to 'unknown'");
  return { models, countKey: "events", warnings, usageComplete };
}

function codexTokenTotal(total) {
  if (total?.input_tokens === undefined || total.output_tokens === undefined) return null;
  const input = total.input_tokens;
  const output = total.output_tokens;
  const { cached_input_tokens: cached = 0, reasoning_output_tokens: reasoning = 0, cache_write_input_tokens: write = 0 } = total;
  if (![input, output, cached, reasoning, write].every((tokens) => Number.isSafeInteger(tokens) && tokens >= 0)) return null;
  return { input, cached, output, reasoning, write };
}

// Main transcripts other than the chosen one that have usage records inside the window.
async function otherSessionsInWindow(others, harness, win, counters) {
  const found = [];
  for (const file of others) {
    let hit = false;
    await forEachJsonl(file, (rec) => {
      if (hit || !win.contains(rec.timestamp)) return;
      const p = rec.payload && typeof rec.payload === "object" ? rec.payload : null;
      hit = harness === "claude" ? !!(rec.message && typeof rec.message === "object" && rec.message.usage && rec.message.model !== "<synthetic>") : !!(rec.type === "event_msg" && p && p.type === "token_count" && p.info);
    }, counters);
    if (hit) found.push(file);
  }
  return found;
}

// ---------- pricing and output ----------

function loadPrices(file) {
  const table = {};
  for (const [k, v] of Object.entries(BUILTIN_PRICES)) table[k] = { ...v };
  if (!file) return table;
  let user;
  try {
    user = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new UsageError(`cannot read --prices ${file}: ${e.message}`);
  }
  if (!user || typeof user !== "object" || Array.isArray(user)) throw new UsageError("--prices must be a JSON object keyed by model id");
  for (const [k, v] of Object.entries(user)) {
    if (!v || typeof v !== "object") continue;
    const merged = { ...(table[k] ?? {}), ...v };
    if (table[k]?.long_context || v.long_context) merged.long_context = { ...(table[k]?.long_context ?? {}), ...(v.long_context ?? {}) };
    table[k] = merged;
  }
  return table;
}

function priceFor(table, model) {
  if (table[model]) return table[model];
  // Tolerate a trailing date or [1m]-style suffix: longest known id that prefixes the model.
  // A fast-mode key ("<id> (fast)") only matches fast models, so fast usage never gets standard rates.
  const fast = model.endsWith(FAST_SUFFIX);
  const core = fast ? model.slice(0, -FAST_SUFFIX.length) : model;
  const base = Object.keys(table)
    .filter((k) => k.endsWith(FAST_SUFFIX) === fast)
    .map((k) => [k, fast ? k.slice(0, -FAST_SUFFIX.length) : k])
    .filter(([, id]) => core.startsWith(id) && /^[-@\[:_]/.test(core.slice(id.length)))
    .sort((a, b) => b[1].length - a[1].length)[0];
  return base ? table[base[0]] : null;
}

function costOf(usage, price) {
  if (!price) return null;
  const lu = usage.long;
  let sum = 0;
  for (const f of TOKEN_FIELDS) {
    const base = usage[f] - (lu ? lu[f] : 0);
    if (base) {
      if (typeof price[f] !== "number") return null;
      sum += (base * price[f]) / 1e6;
    }
    if (lu && lu[f]) {
      if (typeof price.long_context?.[f] !== "number") return null;
      sum += (lu[f] * price.long_context[f]) / 1e6;
    }
  }
  return Math.round(sum * 1e6) / 1e6;
}

function shape(usage, countKey, harness, cost) {
  const out = { input: usage.input, output: usage.output };
  if (harness === "codex") out.reasoning_output = usage.reasoning_output;
  else out.reasoning_output = 0;
  out.cache_read = usage.cache_read;
  out.cache_write_5m = usage.cache_write_5m;
  out.cache_write_1h = usage.cache_write_1h;
  out[countKey] = usage.count;
  out.cost_usd = cost;
  return out;
}

function detectHarness(opts, cwd) {
  const claude = discoverClaude({ ...opts, transcripts: [] }, cwd);
  const codex = discoverCodex({ ...opts, transcripts: [] }, cwd);
  if (claude.length && codex.length) return mtime(codex[0].path) > mtime(claude[0].path) ? "codex" : "claude";
  if (claude.length) return "claude";
  if (codex.length) return "codex";
  return null;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    process.stdout.write(helpText());
    return;
  }
  const cwd = path.resolve(opts.cwd ?? process.cwd());
  const prices = loadPrices(opts.prices);
  const win = makeWindow(opts);

  let harness = opts.harness;
  if (harness === "auto") {
    if (opts.transcripts.length) {
      // Sniff the first line: Codex rollouts start with session_meta.
      const first = fs.existsSync(opts.transcripts[0]) ? readFirstJsonLine(opts.transcripts[0]) : null;
      harness = first && first.type === "session_meta" ? "codex" : "claude";
    } else {
      harness = detectHarness(opts, cwd);
      if (!harness) throw new UsageError(`no Claude Code or Codex transcript found for ${cwd}`);
    }
  }

  const sources = harness === "claude" ? discoverClaude(opts, cwd) : discoverCodex(opts, cwd);
  if (!sources.length) {
    if (opts.sessionId) throw new UsageError(`no ${harness} transcript found for the requested session`);
    throw new UsageError(`no ${harness} transcript found for ${cwd}`);
  }
  for (const s of sources) {
    if (!fs.existsSync(s.path)) throw new UsageError(`transcript not found: ${s.path}`);
  }

  const counters = { skipped_lines: 0 };
  const { models: raw, countKey, warnings, usageComplete = true } =
    harness === "claude" ? await readClaude(sources, win, counters, prices) : await readCodex(sources, win, counters);

  if (sources.others?.length) {
    const found = await otherSessionsInWindow(sources.others, harness, win, { skipped_lines: 0 });
    if (found.length) warnings.push(`--session-id not given and ${found.length} other main transcript(s) in the same folder have usage inside the window (e.g. ${found[0]}); the newest by modification time was used, which may not be this session. Rerun with --session-id`);
  }

  const models = {};
  const total = blankUsage();
  let totalCost = 0;
  let complete = usageComplete;
  for (const name of Object.keys(raw).sort()) {
    const u = raw[name];
    const cost = costOf(u, priceFor(prices, name));
    if (cost === null) complete = false;
    else totalCost += cost;
    models[name] = shape(u, countKey, harness, cost);
    for (const k of Object.keys(total)) total[k] += u[k];
  }
  const totals = shape(total, countKey, harness, complete ? Math.round(totalCost * 1e6) / 1e6 : null);
  totals.cost_usd_known = Math.round(totalCost * 1e6) / 1e6; // priced models only
  totals.cost_complete = complete;
  if (harness === "codex") totals.usage_complete = usageComplete;

  const result = {
    harness,
    session_id: sources.find((s) => s.session_id)?.session_id ?? null,
    window: { since: win.since, until: win.until },
    sources: sources.map((s) => ({ path: s.path, role: s.role, records: s.records })),
    models,
    totals,
    prices_as_of: PRICES_AS_OF,
    skipped_lines: counters.skipped_lines,
    format_warnings: warnings,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((e) => {
  if (e instanceof UsageError) {
    process.stderr.write(`usage-report: ${e.message}\n`);
    process.exit(2);
  }
  process.stderr.write(`usage-report: ${e && e.stack ? e.stack : e}\n`);
  process.exit(1);
});
