import type { Metadata } from "next";
import { getAllCases } from "@/lib/data";
import { SavedList } from "@/components/saved-list";

export const metadata: Metadata = { title: "我的收藏" };

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">我的收藏</h1>
      <p className="mb-6 text-sm text-muted-foreground">收藏保存在本机浏览器（localStorage），不会上传，换设备或清理浏览器数据后会丢失。</p>
      <SavedList cases={getAllCases()} />
    </div>
  );
}
