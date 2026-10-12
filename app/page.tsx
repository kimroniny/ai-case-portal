import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { getAllCases, getAllDates, getDigest, getRecordsByDate, extractSection } from "@/lib/data";
import { Markdown } from "@/components/markdown";
import { HomeFeed } from "@/components/home-feed";
import { EmptyState } from "@/components/empty-state";
import { DataIssues } from "@/components/data-issues";
import { Score } from "@/components/score";
import { StatusBadge, TypeBadge } from "@/components/type-badge";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const dates = getAllDates();
  const latest = dates[0];
  const digest = latest ? getDigest(latest) : null;
  const overview = digest ? extractSection(digest, "今日速览") : null;
  const pickText = digest ? extractSection(digest, "今日精选") : null;
  const todays = latest ? getRecordsByDate(latest) : [];
  const featured = (pickText && todays.find((c) => pickText.includes(c.name))) ||
    [...todays].sort((a, b) => b.innovation_score + b.business_score - a.innovation_score - a.business_score)[0];
  const cases = getAllCases();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <DataIssues />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">{latest ? `最近更新：${latest}` : "暂无数据"}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI 案例观察站</h1>
        <p className="max-w-2xl text-muted-foreground">每天在全球范围内寻找、核实并整理 AI 盈利案例与创新案例。每个数字都标明出处。</p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-2 text-lg font-semibold">今日速览</h2>
        {overview ? <Markdown>{overview}</Markdown> : <p className="text-sm text-muted-foreground">今天还没有发布速览。</p>}
      </section>

      {featured && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Award className="size-5 text-amber-500" />今日精选</h2>
          <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2"><TypeBadge type={featured.type} /><StatusBadge status={featured.status} /><Badge variant="outline">{featured.category}</Badge></div>
            <h3 className="mt-3 text-2xl font-bold">{featured.name}</h3>
            <p className="mt-1 text-muted-foreground">{featured.one_liner}</p>
            <div className="mt-4 grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="text-sm leading-7">{pickText ? <Markdown>{pickText}</Markdown> : featured.why_it_works}</div>
              <div className="space-y-3">
                {featured.metrics.slice(0, 3).map((m) => <div key={m.label} className="rounded-lg bg-background/70 p-3"><div className="text-xs text-muted-foreground">{m.label} · {m.source_type}</div><div className="text-xl font-semibold">{m.value}</div></div>)}
                <div className="flex gap-3"><Score label="创新" value={featured.innovation_score} /><Score label="商业" value={featured.business_score} /></div>
              </div>
            </div>
            <Link href={`/cases/${featured.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">查看详情 <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">最新案例</h2><Link href="/cases" className="text-sm text-primary hover:underline">进入案例库 →</Link></div>
        {cases.length ? <HomeFeed cases={cases.slice(0, 12)} /> : <EmptyState title="还没有任何案例" desc="把每日 JSON 放进 data/cases/ 并重新部署后，这里会显示最新案例。" />}
      </section>
    </div>
  );
}
