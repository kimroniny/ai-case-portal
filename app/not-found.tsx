import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-5xl font-bold text-muted-foreground">404</p>
      <h1 className="mt-3 text-xl font-semibold">找不到这个页面或案例</h1>
      <p className="mt-2 text-sm text-muted-foreground">它可能还没被收录，或链接有误。</p>
      <Link href="/cases" className="mt-6 text-primary hover:underline">去案例库看看 →</Link>
    </div>
  );
}
