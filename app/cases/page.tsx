import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllCases } from "@/lib/data";
import { CaseLibrary } from "@/components/case-library";
import { DataIssues } from "@/components/data-issues";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "案例库" };

export default function CasesPage() {
  const cases = getAllCases();
  const tags = [...new Set(cases.flatMap((c) => c.tags))].sort((a, b) => a.localeCompare(b, "zh"));
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DataIssues />
      <h1 className="mb-1 text-2xl font-bold">案例库</h1>
      <p className="mb-6 text-sm text-muted-foreground">同一案例多次收录时只显示最新一条，详情页可查看完整更新时间线。</p>
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}><CaseLibrary cases={cases} tags={tags} /></Suspense>
    </div>
  );
}
