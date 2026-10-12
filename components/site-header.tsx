import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [{ href: "/", label: "首页" }, { href: "/cases", label: "案例库" }, { href: "/archive", label: "每日归档" }, { href: "/trends", label: "趋势" }];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold"><Sparkles className="size-5 text-primary" /><span className="hidden sm:inline">AI 案例观察站</span></Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="rounded-md px-2.5 py-1.5 whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-foreground">{n.label}</Link>)}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
