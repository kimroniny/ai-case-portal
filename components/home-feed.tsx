"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseCard } from "./case-card";
import { EmptyState } from "./empty-state";
import type { CaseRecord } from "@/lib/types";

const TABS = [
  { value: "all", label: "全部", filter: () => true },
  { value: "profitable", label: "盈利", filter: (c: CaseRecord) => c.type !== "innovative" },
  { value: "innovative", label: "创新", filter: (c: CaseRecord) => c.type !== "profitable" },
];

export function HomeFeed({ cases, latest }: { cases: CaseRecord[]; latest?: string }) {
  return (
    <Tabs defaultValue="all">
      <TabsList>{TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}（{cases.filter(t.filter).length}）</TabsTrigger>)}</TabsList>
      {TABS.map((t) => {
        const list = cases.filter(t.filter);
        return (
          <TabsContent key={t.value} value={t.value} className="mt-4">
            {list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CaseCard key={c.id} c={c} isNew={c.date_collected === latest} />)}</div> : <EmptyState title="这个分类下还没有案例" />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
