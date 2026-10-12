import type { Metadata } from "next";
import Link from "next/link";
import { getAllDates, getDigest, getRecordsByDate, extractSection } from "@/lib/data";
import { EmptyState } from "@/components/empty-state";
import { DataIssues } from "@/components/data-issues";

export const metadata: Metadata = { title: "每日归档" };

export default function ArchivePage() {
  const dates = getAllDates();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <DataIssues />
      <h1 className="mb-6 text-2xl font-bold">每日归档</h1>
      {dates.length === 0 ? <EmptyState title="还没有归档" desc="在 data/ 下添加第一天的数据后即可浏览。" /> : (
        <ul className="space-y-3">
          {dates.map((d) => {
            const recs = getRecordsByDate(d);
            const md = getDigest(d);
            const ov = md ? extractSection(md, "今日速览") : null;
            return (
              <li key={d}><Link href={`/archive/${d}`} className="block rounded-xl border bg-card p-4 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between"><span className="font-semibold">{d}</span><span className="text-sm text-muted-foreground">{recs.length} 条案例 · 新 {recs.filter((r) => r.status === "new").length} / 更新 {recs.filter((r) => r.status === "update").length}</span></div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ov?.replace(/[#*>_`\[\]]/g, "") || (md ? "查看当日摘要" : "当日无摘要")}</p>
              </Link></li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
