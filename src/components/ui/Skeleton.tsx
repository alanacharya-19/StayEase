export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="h-4 skeleton rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 skeleton rounded-full w-16" />
          <div className="h-6 skeleton rounded-full w-20" />
          <div className="h-6 skeleton rounded-full w-14" />
        </div>
        <div className="h-6 skeleton rounded-lg w-1/3" />
      </div>
    </div>
  )
}

export function SkeletonHotelDetail() {
  return (
    <div className="space-y-6">
      <div className="h-64 md:h-96 skeleton rounded-2xl" />
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 skeleton rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-8 skeleton rounded-lg w-1/3" />
        <div className="h-4 skeleton rounded-lg w-full" />
        <div className="h-4 skeleton rounded-lg w-3/4" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
