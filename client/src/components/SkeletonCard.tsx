export default function SkeletonCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line"
      aria-hidden="true"
    >
      <div className="skeleton aspect-[4/3] sm:aspect-[16/10]" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-4 w-1/2 rounded-md" />
        <div className="flex gap-1.5 pt-1">
          <div className="skeleton h-6 w-20 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <div className="skeleton h-4 w-20 rounded-md" />
          <div className="skeleton h-5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
