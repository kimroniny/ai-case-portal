import { Badge } from "@/components/ui/badge";
import { TYPE_LABEL, type CaseRecord } from "@/lib/types";
const STYLE = { profitable: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", innovative: "bg-violet-500/15 text-violet-700 dark:text-violet-300", both: "bg-amber-500/15 text-amber-700 dark:text-amber-300" };
export function TypeBadge({ type }: { type: CaseRecord["type"] }) {
  return <Badge variant="secondary" className={STYLE[type]}>{TYPE_LABEL[type]}</Badge>;
}
export function StatusBadge({ status }: { status: CaseRecord["status"] }) {
  return status === "update" ? <Badge variant="outline">更新</Badge> : <Badge variant="outline">新收录</Badge>;
}
