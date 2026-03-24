export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="h-52 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded-lg skeleton" />
        <div className="h-4 w-1/2 rounded-lg skeleton" />
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <div className="h-4 w-20 rounded-lg skeleton" />
          <div className="h-5 w-24 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}
