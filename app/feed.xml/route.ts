import { getAllCases } from "@/lib/data";
import { TYPE_LABEL } from "@/lib/types";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-case-portal.vercel.app";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const cases = getAllCases().slice(0, 50);
  const items = cases.map((c) => {
    const url = `${SITE}/cases/${c.id}`;
    const desc = `${c.one_liner}\n\n${c.why_it_works}${c.metrics.length ? "\n\n" + c.metrics.map((m) => `${m.label}：${m.value}（${m.source_type}）`).join("；") : ""}`;
    return `<item><title>${esc(`${c.status === "update" ? "[更新] " : ""}${c.name}`)}</title><link>${url}</link><guid isPermaLink="false">${esc(`${c.id}@${c.date_collected}`)}</guid><pubDate>${new Date(`${c.date_collected}T08:00:00+08:00`).toUTCString()}</pubDate><category>${esc(c.category)}</category><category>${esc(TYPE_LABEL[c.type])}</category><description>${esc(desc)}</description></item>`;
  }).join("\n");
  const last = cases[0] ? new Date(`${cases[0].date_collected}T08:00:00+08:00`).toUTCString() : new Date(0).toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>AI 案例观察站</title><link>${SITE}</link><description>每日收集、核实并整理全球 AI 盈利案例与创新案例。</description><language>zh-CN</language><lastBuildDate>${last}</lastBuildDate><atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
