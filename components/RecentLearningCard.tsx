"use client"
import { useRouter } from 'next/navigation'
import { LearningItem } from '../types'

const colorMap: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
}

export default function RecentLearningCard({ item }: { item: LearningItem }) {
  const colorClass = colorMap[item.color || ''] ?? 'text-on-surface'
  const router = useRouter()

  const handlePrimary = () => {
    // navigate to challenge page
    router.push(`/challenges/${item.id}`)
  }

  const handleMore = () => {
    router.push(`/challenges/${item.id}`)
  }

  return (
    <div className="min-w-[280px] md:min-w-[340px] glass-card p-4 rounded-xl snap-start" role="article" aria-label={item.title}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg bg-[rgba(255,255,255,0.03)] ${colorClass}`}>
          <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
        </div>
        <span className="text-sm font-semibold bg-[rgba(255,255,255,0.03)] px-3 py-1 rounded-full">{item.badge}</span>
      </div>
      <h3 className="font-semibold mb-2">{item.title}</h3>
      <p className="text-sm text-on-surface/80 mb-4">{item.description}</p>
      <div className="flex items-center gap-2">
        <button onClick={handlePrimary} className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface py-2 rounded" aria-label={`${item.cta} ${item.title}`}>
          {item.cta}
        </button>
        <button onClick={handleMore} className="p-2 bg-white/5 rounded" aria-label={`More options for ${item.title}`}>
          <span className="material-symbols-outlined" aria-hidden="true">more_horiz</span>
        </button>
      </div>
    </div>
  )
}
