"use client"
import { useEffect, useState } from 'react'

export default function Heatmap() {
  const [cells, setCells] = useState<number[]>([])
  useEffect(() => {
    // generate mock heatmap data
    const arr = Array.from({ length: 364 }).map(() => Math.random())
    setCells(arr)
  }, [])

  return (
    <div className="glass-card rounded-xl p-6" role="img" aria-label="Learning activity heatmap">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Learning Activity</h2>
        <div className="flex items-center gap-2 text-sm text-on-surface/80">
          <span>Less</span>
          <div className="flex gap-1" aria-hidden="true">
            <div className="w-3 h-3 rounded bg-white/5" />
            <div className="w-3 h-3 rounded bg-primary/20" />
            <div className="w-3 h-3 rounded bg-primary/40" />
            <div className="w-3 h-3 rounded bg-primary/70" />
            <div className="w-3 h-3 rounded bg-primary" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[700px]">
          {cells.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded ${c > 0.8 ? 'bg-primary' : c > 0.45 ? 'bg-primary/30' : 'bg-white/5'}`} aria-hidden="true" />
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-between text-sm text-on-surface/80">
        <span>Dec 2023</span>
        <span>Mar 2024</span>
        <span>Jun 2024</span>
        <span>Sep 2024</span>
      </div>
    </div>
  )
}
