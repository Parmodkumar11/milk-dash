export default function ProductCardSkeleton() {
  return (
    <div className="dd-card flex flex-col h-full overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-2.5 space-y-2 flex-1 flex flex-col">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-8 bg-muted rounded-lg mt-auto w-full" />
      </div>
    </div>
  );
}
