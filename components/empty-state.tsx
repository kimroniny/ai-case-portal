import { Inbox } from "lucide-react";
export function EmptyState({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
      <Inbox className="mb-3 size-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {desc && <p className="mt-1 max-w-md text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}
