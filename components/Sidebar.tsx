import Link from 'next/link'
import { User } from '../types'

export default function Sidebar({ user }: { user: User }) {
  return (
    <aside className="glass-card rounded-xl p-6 flex flex-col h-[calc(100vh-140px)] sticky top-24" aria-label="Sidebar">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden">
            <img className="w-full h-full object-cover rounded-full" src={user.avatar} alt={user.name} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-secondary text-[10px] font-bold text-on-secondary px-1 rounded-full border border-background">LVL {user.level}</div>
        </div>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-on-surface/80">{user.streak} Day Streak • {user.xp} XP</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <Link className="bg-primary/10 text-primary border-l-4 border-primary p-2 rounded-r-md flex items-center gap-2" href="/"><span className="material-symbols-outlined">dashboard</span>Dashboard</Link>
        <Link className="text-on-surface/80 p-2 rounded-md flex items-center gap-2" href="/challenges"><span className="material-symbols-outlined">auto_awesome</span>Challenges</Link>
        <Link className="text-on-surface/80 p-2 rounded-md flex items-center gap-2" href="/graph"><span className="material-symbols-outlined">hub</span>Knowledge Graph</Link>
        <Link className="text-on-surface/80 p-2 rounded-md flex items-center gap-2" href="/flashcards"><span className="material-symbols-outlined">style</span>Flashcards</Link>
        <div className="mt-auto pt-4 border-t border-white/5">
          <Link className="text-on-surface/80 p-2 rounded-md flex items-center gap-2" href="/settings"><span className="material-symbols-outlined">settings</span>Settings</Link>
        </div>
      </nav>
    </aside>
  )
}
