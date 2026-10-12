import { AlertTriangle } from "lucide-react";
import { getLoadIssues } from "@/lib/data";
export function DataIssues() {
  const issues = getLoadIssues();
  if (!issues.length) return null;
  return (
    <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <p className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-300"><AlertTriangle className="size-4" />有 {issues.length} 处数据未能加载，已自动跳过：</p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">{issues.map((i, k) => <li key={k}><code>{i.file}</code>：{i.message}</li>)}</ul>
    </div>
  );
}
