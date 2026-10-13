"use client";
import { useState, useSyncExternalStore } from "react";
import { Bookmark, BookmarkCheck, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "ai-case-portal:saved";
const listeners = new Set<() => void>();
function read(): string[] { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
let snapshot = "[]";
function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) fn(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
}
function getSnapshot() { const s = JSON.stringify(read()); if (s !== snapshot) snapshot = s; return snapshot; }
export function useSaved() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const ids: string[] = JSON.parse(raw);
  const toggle = (id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    listeners.forEach((l) => l());
  };
  return { ids, toggle };
}
const noop = () => () => {};
export function useMounted() { return useSyncExternalStore(noop, () => true, () => false); }

const btn = "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground";

export function CaseActions({ id, name, className }: { id: string; name: string; className?: string }) {
  const { ids, toggle } = useSaved();
  const [copied, setCopied] = useState(false);
  const saved = ids.includes(id);
  const share = async () => {
    const url = `${window.location.origin}/cases/${id}`;
    try {
      if (navigator.share && /Mobi/i.test(navigator.userAgent)) await navigator.share({ title: name, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    } catch {}
  };
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button type="button" onClick={share} className={btn} aria-label="分享">{copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}{copied ? "已复制链接" : "分享"}</button>
      <button type="button" onClick={() => toggle(id)} className={cn(btn, saved && "text-primary")} aria-pressed={saved} aria-label={saved ? "取消收藏" : "收藏"}>
        {saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}{saved ? "已收藏" : "收藏"}</button>
    </div>
  );
}
