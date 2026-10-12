import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default: "AI 案例观察站", template: "%s · AI 案例观察站" },
  description: "每日收集、核实并整理全球 AI 盈利案例与创新案例。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 text-center text-xs text-muted-foreground">
            AI 案例观察站 · 数据每日更新 · <Link href="/archive" className="underline">查看归档</Link>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
