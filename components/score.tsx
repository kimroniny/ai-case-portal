export function Score({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={`${label} ${value}/5`}>
      {label}
      <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <span key={i} className={`size-1.5 rounded-full ${i <= value ? "bg-primary" : "bg-muted-foreground/25"}`} />)}</span>
    </span>
  );
}
