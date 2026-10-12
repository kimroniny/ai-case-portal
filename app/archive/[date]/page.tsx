import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDates, getDigest, getRecordsByDate } from "@/lib/data";
import { Markdown } from "@/components/markdown";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";

export function generateStaticParams() { return getAllDates().map((date) => ({ date })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> { return { title: `${(await params).date} 归档` }; }

export default async function ArchiveDay({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const dates = getAllDates();
  const idx = dates.indexOf(date);
  if (idx === -1) notFound();
  const md = getDigest(date);
  const recs = getRecordsByDate(date);
  const newer = dates[idx - 1], older = dates[idx + 1];
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between text-sm">
        <Link href="/archive" className="text-muted-foreground hover:text-foreground">← 全部归档</Link>
        <div className="flex gap-4">{older && <Link href={`/archive/${older}`} className="hover:underline">← {older}</Link>}{newer && <Link href={`/archive/${newer}`} className="hover:underline">{newer} →</Link>}</div>
      </div>
      <h1 className="text-2xl font-bold">{date} 日报</h1>
      <section className="rounded-xl border bg-card p-5">{md ? <Markdown>{md}</Markdown> : <p className="text-sm text-muted-foreground">当日没有摘要文件（data/digests/{date}.md）。</p>}</section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">当日案例（{recs.length}）</h2>
        {recs.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recs.map((c) => <CaseCard key={c.id} c={c} />)}</div> : <EmptyState title="当日没有收录案例" />}
      </section>
    </div>
  );
}
