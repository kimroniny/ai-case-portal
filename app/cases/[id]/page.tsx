import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ExternalLink, Lightbulb } from "lucide-react";
import { getAllCases, getCase } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Score } from "@/components/score";
import { StatusBadge, TypeBadge } from "@/components/type-badge";

export function generateStaticParams() { return getAllCases().map((c) => ({ id: c.id })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = getCase((await params).id);
  return c ? { title: c.name, description: c.one_liner } : {};
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-2"><h2 className="text-lg font-semibold">{title}</h2>{children}</section>;
}
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const c = getCase((await params).id);
  if (!c) notFound();
  const facts = [["分类", c.category], ["地区", c.region], ["团队类型", c.team_type], ["商业模式", c.business_model], ["首次收录", c.first_seen], ["最近更新", c.date_collected]];

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <Link href="/cases" className="text-sm text-muted-foreground hover:text-foreground">← 返回案例库</Link>
      <header className="space-y-3">
        <div className="flex flex-wrap gap-2"><TypeBadge type={c.type} /><StatusBadge status={c.status} /></div>
        <h1 className="text-3xl font-bold">{c.name}</h1>
        <p className="text-lg text-muted-foreground">{c.one_liner}</p>
        <div className="flex flex-wrap items-center gap-4"><Score label="创新分" value={c.innovation_score} /><Score label="商业分" value={c.business_score} />
          {c.website && <a href={c.website} {...ext} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">官网 <ExternalLink className="size-3.5" /></a>}</div>
        <dl className="grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 text-sm sm:grid-cols-3">
          {facts.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
        </dl>
        {c.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{c.tags.map((t) => <Link key={t} href={`/cases?tag=${encodeURIComponent(t)}`}><Badge variant="outline">#{t}</Badge></Link>)}</div>}
      </header>

      <Section title="关键指标">
        {c.metrics.length ? (
          <div className="rounded-xl border"><Table>
            <TableHeader><TableRow><TableHead>指标</TableHead><TableHead>数值</TableHead><TableHead>来源类型</TableHead><TableHead>出处</TableHead></TableRow></TableHeader>
            <TableBody>{c.metrics.map((m, i) => <TableRow key={i}><TableCell>{m.label}</TableCell><TableCell className="font-semibold">{m.value}</TableCell><TableCell><Badge variant="secondary">{m.source_type}</Badge></TableCell>
              <TableCell>{m.source_url ? <a href={m.source_url} {...ext} className="inline-flex items-center gap-1 text-primary hover:underline">链接<ExternalLink className="size-3" /></a> : "—"}</TableCell></TableRow>)}</TableBody>
          </Table></div>
        ) : <p className="text-sm text-muted-foreground">暂无公开可核实的指标。</p>}
      </Section>

      <Section title="为什么值得关注"><p className="leading-7">{c.why_it_works || "—"}</p></Section>
      <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"><Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" /><div><div className="font-semibold">可借鉴之处</div><p className="mt-1 text-sm leading-6">{c.takeaway || "—"}</p></div></div>

      <Section title="来源">
        {c.sources.length ? <ol className="list-decimal space-y-1 pl-5 text-sm">{c.sources.map((s) => <li key={s}><a href={s} {...ext} className="break-all text-primary hover:underline">{s}</a></li>)}</ol> : <p className="text-sm text-muted-foreground">暂无来源链接。</p>}
      </Section>

      <Section title="存疑说明">
        {c.uncertain_points ? <div className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />{c.uncertain_points}</div> : <p className="text-sm text-muted-foreground">暂无存疑点。</p>}
      </Section>

      {c.history.length > 1 && (
        <Section title="更新时间线">
          <ol className="relative ml-2 space-y-6 border-l pl-6">
            {[...c.history].reverse().map((h, i) => (
              <li key={h.date_collected + i} className="relative">
                <span className={`absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-background ${i === 0 ? "bg-primary" : "bg-muted-foreground/50"}`} />
                <div className="flex flex-wrap items-center gap-2 text-sm"><Link href={`/archive/${h.date_collected}`} className="font-medium hover:underline">{h.date_collected}</Link><StatusBadge status={h.status} /></div>
                {h.metrics.length > 0 && <div className="mt-1 flex flex-wrap gap-2 text-sm">{h.metrics.map((m, k) => <span key={k} className="rounded bg-muted px-2 py-0.5">{m.label} <b>{m.value}</b></span>)}</div>}
                <p className="mt-1 text-sm text-muted-foreground">{h.why_it_works}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </article>
  );
}
