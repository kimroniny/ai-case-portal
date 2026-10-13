import Link from "next/link";
import { StatusBadge, TypeBadge } from "./type-badge";
import { CaseActions } from "./case-actions";
import { initials, sourcePlatforms } from "@/lib/source";
import type { CaseRecord } from "@/lib/types";

export function CaseCard({ c, isNew }: { c: CaseRecord; isNew?: boolean }) {
  const m = c.metrics[0];
  const platforms = sourcePlatforms(c.sources);
  return (
    <div className="group flex h-full flex-col rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{initials(c.name)}</div>
        <div className="min-w-0 flex-1">
          <Link href={`/cases/${c.id}`} className="font-semibold leading-snug hover:text-primary"><span className="line-clamp-1">{c.name}</span></Link>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{c.one_liner}</p>
        </div>
      </div>
      {m && <div className="mt-3 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs"><span className="text-muted-foreground">{m.label}：</span><span className="font-semibold">{m.value}</span><span className="ml-1 text-muted-foreground">（{m.source_type}）</span></div>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {isNew && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">New</span>}
        <TypeBadge type={c.type} /><StatusBadge status={c.status} />
        <span>{c.category}</span>
        {platforms.length > 0 && <span>· {platforms.slice(0, 2).join(" / ")}{platforms.length > 2 ? ` 等 ${platforms.length} 个来源` : ""}</span>}
        <span>· {c.date_collected}</span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
        <span>创新 {c.innovation_score}/5 · 商业 {c.business_score}/5</span>
        <CaseActions id={c.id} name={c.name} />
      </div>
    </div>
  );
}
