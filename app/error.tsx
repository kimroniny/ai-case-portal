"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">页面出错了</h1>
      <p className="mt-2 text-sm text-muted-foreground">加载数据时发生错误，可能是数据文件格式有误。{error.digest && `（错误编号 ${error.digest}）`}</p>
      <Button className="mt-6" onClick={reset}>重试</Button>
    </div>
  );
}
