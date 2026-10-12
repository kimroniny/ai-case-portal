import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { AggregatedCase, CaseRecord, LoadIssue } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATE_RE = /^(\d{4}-\d{2}-\d{2})\.(json|md)$/;

function listFiles(sub: string, ext: string): string[] {
  const dir = path.join(DATA_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => { const m = f.match(DATE_RE); return m && m[2] === ext; }).sort();
}

function validate(raw: unknown, file: string, idx: number, issues: LoadIssue[]): CaseRecord | null {
  if (!raw || typeof raw !== "object") { issues.push({ file, message: `第 ${idx + 1} 条不是对象，已跳过` }); return null; }
  const r = raw as Partial<CaseRecord>;
  if (!r.id || !r.name) { issues.push({ file, message: `第 ${idx + 1} 条缺少 id 或 name，已跳过` }); return null; }
  return {
    id: String(r.id), date_collected: r.date_collected ?? file.slice(0, 10), status: r.status === "update" ? "update" : "new",
    type: r.type === "innovative" || r.type === "both" ? r.type : "profitable",
    name: r.name, one_liner: r.one_liner ?? "", category: r.category ?? "其他", region: r.region ?? "全球",
    team_type: r.team_type ?? "初创公司", business_model: r.business_model ?? "暂无",
    metrics: Array.isArray(r.metrics) ? r.metrics : [], why_it_works: r.why_it_works ?? "", takeaway: r.takeaway ?? "",
    innovation_score: Number(r.innovation_score) || 0, business_score: Number(r.business_score) || 0,
    tags: Array.isArray(r.tags) ? r.tags : [], website: r.website ?? "", sources: Array.isArray(r.sources) ? r.sources : [],
    uncertain_points: r.uncertain_points ?? "",
  };
}

let cache: { records: CaseRecord[]; issues: LoadIssue[] } | null = null;

export function loadRecords() {
  if (cache) return cache;
  const records: CaseRecord[] = [];
  const issues: LoadIssue[] = [];
  for (const file of listFiles("cases", "json")) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "cases", file), "utf8"));
      if (!Array.isArray(parsed)) { issues.push({ file, message: "文件内容不是数组，已跳过" }); continue; }
      parsed.forEach((raw, i) => { const rec = validate(raw, file, i, issues); if (rec) records.push(rec); });
    } catch (e) {
      issues.push({ file, message: `JSON 解析失败，已跳过：${(e as Error).message}` });
    }
  }
  if (issues.length) console.warn("[data] 加载问题：", issues);
  cache = { records, issues };
  return cache;
}

export function getAllCases(): AggregatedCase[] {
  const map = new Map<string, CaseRecord[]>();
  for (const r of loadRecords().records) map.set(r.id, [...(map.get(r.id) ?? []), r]);
  return [...map.values()].map((list) => {
    const history = [...list].sort((a, b) => a.date_collected.localeCompare(b.date_collected));
    const latest = history[history.length - 1];
    return { ...latest, first_seen: history[0].date_collected, history };
  }).sort((a, b) => b.date_collected.localeCompare(a.date_collected) || b.business_score + b.innovation_score - (a.business_score + a.innovation_score));
}

export function getCase(id: string) { return getAllCases().find((c) => c.id === id); }
export function getRecordsByDate(date: string) { return loadRecords().records.filter((r) => r.date_collected === date); }
export function getLoadIssues() { return loadRecords().issues; }

export function getAllDates(): string[] {
  const s = new Set<string>([...listFiles("cases", "json"), ...listFiles("digests", "md")].map((f) => f.slice(0, 10)));
  for (const r of loadRecords().records) s.add(r.date_collected);
  return [...s].sort().reverse();
}

export function getDigest(date: string): string | null {
  const p = path.join(DATA_DIR, "digests", `${date}.md`);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

/** 从摘要 md 中提取某个二级标题下的段落 */
export function extractSection(md: string, title: string): string | null {
  const re = new RegExp(`^#{1,3}\\s*[「]?${title}[」]?\\s*$([\\s\\S]*?)(?=^#{1,3}\\s|$(?![\\s\\S]))`, "m");
  const m = md.match(re);
  return m ? m[1].trim() : null;
}
