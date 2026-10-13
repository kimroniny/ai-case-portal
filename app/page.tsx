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
import { CaseCard } from "@/components/case-card";
import { CATEGORIES } from "@/lib/types";
import { sourcePlatforms } from "@/lib/source";

export default function HomePage() {
  const dates = getAllDates();
  const latest = dates[0];
  const digest = latest ? getDigest(latest) : null;
  const overview = digest ? extractSection(digest, "今日速览") : null;
  const pickText = digest ? extractSection(digest, "今日精选") : null;
  const todays = latest ? getRecordsByDate(latest) : [];
  const featured = (pickText && todays.filter((c) => pickText.includes(c.name)).sort((a, b) => pickText.indexOf(a.name) - pickText.indexOf(b.name))[0]) ||
    [...todays].sort((a, b) => b.innovation_score + b.business_score - a.innovation_score - a.business_score)[0];
  const cases = getAllCases();
  const catCounts = CATEGORIES.map((cat) => ({ cat, n: cases.filter((c) => c.category === cat).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const platformCount = new Map<string, number>();
  cases.forEach((c) => sourcePlatforms(c.sources).forEach((p) => platformCount.set(p, (platformCount.get(p) ?? 0) + 1)));
  const topPlatforms = [...platformCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p]) => p);
  const newToday = cases.filter((c) => c.date_collected === latest);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <DataIssues />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">{latest ? `最近更新：${latest}` : "暂无数据"}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI 案例观察站</h1>
        <p className="max-w-2xl text-muted-foreground">每天在全球范围内寻找、核实并整理 AI 盈利案例与创新案例。每个数字都标明出处。</p>
      </section>

      <section aria-label="统计" className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border bg-muted/40 px-4 py-3 text-sm">
        <span><b className="text-lg">{cases.length}</b> 个案例</span>
        <span className="text-muted-foreground">最近更新 <b className="text-foreground">{latest ?? "—"}</b></span>
        <span className="text-muted-foreground">收录 {dates.length} 天</span>
        {topPlatforms.length > 0 && <span className="text-muted-foreground">主要来源：{topPlatforms.join("、")}{platformCount.size > 5 ? ` 等 ${platformCount.size} 个` : ""}</span>}
        <span className="ml-auto flex gap-3"><Link href="/archive" className="text-primary hover:underline">归档</Link><a href="/feed.xml" className="text-primary hover:underline">RSS</a></span>
      </section>

      {catCounts.length > 0 && (
        <nav aria-label="按分类浏览" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap">
          {catCounts.map(({ cat, n }) => (
            <Link key={cat} href={`/cases?category=${encodeURIComponent(cat)}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm hover:border-primary hover:text-primary">
              {cat}<span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground">{n}</span></Link>))}
        </nav>
      )}

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

      {newToday.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-2"><h2 className="text-lg font-semibold">今日新增 {newToday.length} 条 <span className="text-sm font-normal text-muted-foreground">· {latest}</span></h2><Link href={`/archive/${latest}`} className="text-sm text-primary hover:underline">看当日归档 →</Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{newToday.slice(0, 6).map((c) => <CaseCard key={c.id} c={c} isNew />)}</div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">最新案例</h2><Link href="/cases" className="text-sm text-primary hover:underline">进入案例库 →</Link></div>
        {cases.length ? <HomeFeed cases={cases.slice(0, 12)} latest={latest} /> : <EmptyState title="还没有任何案例" desc="把每日 JSON 放进 data/cases/ 并重新部署后，这里会显示最新案例。" />}
      </section>

      {catCounts.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-lg font-semibold">按分类浏览</h2>
          {catCounts.map(({ cat, n }) => (
            <div key={cat} id={`cat-${cat}`}>
              <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{cat} <span className="text-sm font-normal text-muted-foreground">{n}</span></h3>
                {n > 3 && <Link href={`/cases?category=${encodeURIComponent(cat)}`} className="text-sm text-primary hover:underline">查看全部 →</Link>}</div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cases.filter((c) => c.category === cat).slice(0, 3).map((c) => <CaseCard key={c.id} c={c} isNew={c.date_collected === latest} />)}</div>
            </div>))}
        </section>
      )}
    </div>
  );
}
