import type { Metadata } from "next";
import { loadRecords } from "@/lib/data";
import { CATEGORIES, REGIONS } from "@/lib/types";
import { StackedTrend } from "@/components/trend-charts";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "趋势" };

function series(records: { date_collected: string }[], keyOf: (r: never) => string, keys: readonly string[]) {
  const dates = [...new Set(records.map((r) => r.date_collected))].sort();
  return dates.map((date) => {
    const row: Record<string, string | number> = { date };
    for (const k of keys) row[k] = 0;
    for (const r of records) if (r.date_collected === date) { const k = keyOf(r as never); row[k] = ((row[k] as number) ?? 0) + 1; }
    return row;
  });
}

export default function TrendsPage() {
  const { records } = loadRecords();
  const used = <T extends string>(all: readonly T[], f: (r: (typeof records)[number]) => string) => all.filter((k) => records.some((r) => f(r) === k));
  const cats = used(CATEGORIES, (r) => r.category), regs = used(REGIONS, (r) => r.region);
  const typeKeys = ["盈利", "创新", "盈利 + 创新"];
  const typeName = { profitable: "盈利", innovative: "创新", both: "盈利 + 创新" } as const;
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div><h1 className="text-2xl font-bold">趋势</h1><p className="mt-1 text-sm text-muted-foreground">按收录日期统计每日案例数（含 update 记录）。</p></div>
      {records.length === 0 ? <EmptyState title="暂无数据可统计" /> : (
        <>
          <section className="rounded-xl border bg-card p-4"><h2 className="mb-3 font-semibold">各分类每日案例数</h2><StackedTrend data={series(records, (r: { category: string }) => r.category, cats)} keys={cats} /></section>
          <section className="rounded-xl border bg-card p-4"><h2 className="mb-3 font-semibold">各地区每日案例数</h2><StackedTrend data={series(records, (r: { region: string }) => r.region, regs)} keys={regs} /></section>
          <section className="rounded-xl border bg-card p-4"><h2 className="mb-3 font-semibold">盈利 / 创新每日案例数</h2><StackedTrend data={series(records, (r: { type: keyof typeof typeName }) => typeName[r.type], typeKeys)} keys={typeKeys} /></section>
        </>
      )}
    </div>
  );
}
