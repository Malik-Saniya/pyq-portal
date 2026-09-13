export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-paper-line bg-white/60 p-4">
      <div className="h-4 w-2/3 rounded bg-paper-line" />
      <div className="mt-2.5 h-3 w-1/2 rounded bg-paper-line" />
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-14 rounded-full bg-paper-line" />
        <div className="h-5 w-16 rounded-full bg-paper-line" />
      </div>
      <div className="mt-4 h-9 rounded-md bg-paper-line" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
