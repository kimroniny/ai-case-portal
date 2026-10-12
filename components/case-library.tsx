"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CaseCard } from "./case-card";
import { EmptyState } from "./empty-state";
import { CATEGORIES, REGIONS, TEAM_TYPES, type AggregatedCase } from "@/lib/types";

const selectCls = "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
const KEYS = ["q", "type", "category", "region", "team", "tag", "minInno", "minBiz", "sort"] as const;

export function CaseLibrary({ cases, tags }: { cases: AggregatedCase[]; tags: string[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const get = (k: (typeof KEYS)[number]) => sp.get(k) ?? "";

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  };

  const q = get("q"), type = get("type"), category = get("category"), region = get("region"), team = get("team"), tag = get("tag");
  const minInno = Number(get("minInno")) || 0, minBiz = Number(get("minBiz")) || 0, sort = get("sort") || "date";

  const result = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const list = cases.filter((c) =>
      (!kw || [c.name, c.one_liner, c.why_it_works, c.takeaway, ...c.tags].join(" ").toLowerCase().includes(kw)) &&
      (!type || (type === "both" ? c.type === "both" : c.type === type || c.type === "both")) &&
      (!category || c.category === category) && (!region || c.region === region) && (!team || c.team_type === team) &&
      (!tag || c.tags.includes(tag)) && c.innovation_score >= minInno && c.business_score >= minBiz);
    const by = {
      date: (a: AggregatedCase, b: AggregatedCase) => b.date_collected.localeCompare(a.date_collected),
      innovation: (a: AggregatedCase, b: AggregatedCase) => b.innovation_score - a.innovation_score,
      business: (a: AggregatedCase, b: AggregatedCase) => b.business_score - a.business_score,
      total: (a: AggregatedCase, b: AggregatedCase) => b.innovation_score + b.business_score - a.innovation_score - a.business_score,
    }[sort] ?? (() => 0);
    return [...list].sort(by);
  }, [cases, q, type, category, region, team, tag, minInno, minBiz, sort]);

  const hasFilter = KEYS.some((k) => k !== "sort" && sp.get(k));
  const opt = (arr: readonly string[]) => arr.map((v) => <option key={v} value={v}>{v}</option>);
  const scoreOpt = [1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>≥ {n}</option>);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} placeholder="搜索名称、简介、标签……" className="h-9 pl-8" onChange={(e) => set("q", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
          <select aria-label="类型" className={selectCls} value={type} onChange={(e) => set("type", e.target.value)}><option value="">全部类型</option><option value="profitable">盈利</option><option value="innovative">创新</option><option value="both">盈利 + 创新</option></select>
          <select aria-label="分类" className={selectCls} value={category} onChange={(e) => set("category", e.target.value)}><option value="">全部分类</option>{opt(CATEGORIES)}</select>
          <select aria-label="地区" className={selectCls} value={region} onChange={(e) => set("region", e.target.value)}><option value="">全部地区</option>{opt(REGIONS)}</select>
          <select aria-label="团队类型" className={selectCls} value={team} onChange={(e) => set("team", e.target.value)}><option value="">全部团队</option>{opt(TEAM_TYPES)}</select>
          <select aria-label="标签" className={selectCls} value={tag} onChange={(e) => set("tag", e.target.value)}><option value="">全部标签</option>{opt(tags)}</select>
          <select aria-label="创新分" className={selectCls} value={get("minInno")} onChange={(e) => set("minInno", e.target.value)}><option value="">创新分不限</option>{scoreOpt}</select>
          <select aria-label="商业分" className={selectCls} value={get("minBiz")} onChange={(e) => set("minBiz", e.target.value)}><option value="">商业分不限</option>{scoreOpt}</select>
          <select aria-label="排序" className={selectCls} value={sort} onChange={(e) => set("sort", e.target.value === "date" ? "" : e.target.value)}><option value="date">按日期（新→旧）</option><option value="total">按综合评分</option><option value="business">按商业分</option><option value="innovation">按创新分</option></select>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>共 {result.length} / {cases.length} 个案例</span>
          {hasFilter && <Button variant="ghost" size="sm" onClick={() => router.replace(pathname, { scroll: false })}><X className="size-3.5" />清空筛选</Button>}
        </div>
      </div>
      {result.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.map((c) => <CaseCard key={c.id} c={c} />)}</div>
        : <EmptyState title={cases.length ? "没有符合条件的案例" : "案例库还是空的"} desc={cases.length ? "试试放宽筛选条件或换个关键词。" : "把 JSON 文件放进 data/cases/ 后重新构建即可。"} />}
    </div>
  );
}
