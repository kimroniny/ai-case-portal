"use client";
import Link from "next/link";
import { CaseCard } from "./case-card";
import { EmptyState } from "./empty-state";
import { useMounted, useSaved } from "./case-actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { AggregatedCase } from "@/lib/types";

export function SavedList({ cases }: { cases: AggregatedCase[] }) {
  const mounted = useMounted();
  const { ids } = useSaved();
  if (!mounted) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>;
  const list = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is AggregatedCase => !!c);
  const missing = ids.length - list.length;
  if (!list.length) return <EmptyState title="还没有收藏" desc="在任意案例卡片或详情页点「收藏」，它就会出现在这里。收藏只保存在当前浏览器。" />;
  return (
    <div className="space-y-3">
      {missing > 0 && <p className="text-xs text-muted-foreground">有 {missing} 条收藏的案例已不在数据中。</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CaseCard key={c.id} c={c} />)}</div>
      <Link href="/cases" className="inline-block text-sm text-primary hover:underline">去案例库发现更多 →</Link>
    </div>
  );
}
