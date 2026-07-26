import React from 'react'

type Props = {
  title: string
  value: string
  icon?: string
  variant?: string
}

export default function StatsCard({ title, value, icon }: Props) {
  return (
    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center" role="region" aria-label={title}>
      {icon && (
        <span className="material-symbols-outlined mb-2" style={{ fontSize: 28 }} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="font-semibold text-lg">{value}</div>
      <div className="text-sm text-on-surface/80 uppercase tracking-wider">{title}</div>
    </div>
  )
}
