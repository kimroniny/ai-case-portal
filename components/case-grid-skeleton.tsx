import { Skeleton } from "@/components/ui/skeleton";
export function CaseGridSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: n }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}</div>
    </div>
  );
}
