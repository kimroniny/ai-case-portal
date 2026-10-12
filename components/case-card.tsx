import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Score } from "./score";
import { StatusBadge, TypeBadge } from "./type-badge";
import type { CaseRecord } from "@/lib/types";

export function CaseCard({ c }: { c: CaseRecord }) {
  const m = c.metrics[0];
  return (
    <Link href={`/cases/${c.id}`} className="group block h-full">
      <Card className="h-full transition-shadow group-hover:shadow-md group-hover:ring-primary/30">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-1.5"><TypeBadge type={c.type} /><StatusBadge status={c.status} /><span className="ml-auto text-xs text-muted-foreground">{c.date_collected}</span></div>
          <CardTitle className="mt-2 text-base group-hover:text-primary">{c.name}</CardTitle>
          <CardDescription>{c.one_liner}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {m && <div className="rounded-md bg-muted/60 px-3 py-2 text-sm"><span className="text-muted-foreground">{m.label}：</span><span className="font-semibold">{m.value}</span><span className="ml-1 text-xs text-muted-foreground">（{m.source_type}）</span></div>}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground"><span>{c.category}</span>·<span>{c.region}</span>·<span>{c.team_type}</span></div>
          <div className="flex flex-wrap gap-3"><Score label="创新" value={c.innovation_score} /><Score label="商业" value={c.business_score} /></div>
          {c.tags.length > 0 && <div className="flex flex-wrap gap-1">{c.tags.slice(0, 4).map((t) => <Badge key={t} variant="outline" className="font-normal">#{t}</Badge>)}</div>}
        </CardContent>
      </Card>
    </Link>
  );
}
