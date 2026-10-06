export default function ProductCardSkeleton() {
  return (
    <div className="dd-card flex flex-col h-full overflow-hidden animate-pulse">
      <div className="aspect-[4/3] max-h-[104px] bg-[#f7f9f6] sm:max-h-[120px]" />
      <div className="p-2.5 space-y-2 flex-1 flex flex-col">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-8 bg-muted rounded-lg mt-auto w-full" />
      </div>
    </div>
  );
}
