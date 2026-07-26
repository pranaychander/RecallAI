export default function Loading() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <div className="animate-pulse-soft space-y-4">
        <div className="h-8 w-1/2 bg-white/5 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 bg-white/5 rounded"></div>
          <div className="h-24 bg-white/5 rounded"></div>
          <div className="h-24 bg-white/5 rounded"></div>
          <div className="h-24 bg-white/5 rounded"></div>
        </div>
      </div>
    </div>
  )
}
