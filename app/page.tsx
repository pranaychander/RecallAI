import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import RecentLearningCard from '../components/RecentLearningCard'
import Heatmap from '../components/Heatmap'
import QuickActions from '../components/QuickActions'
import { getCurrentUser } from '../services/auth.service'
import { getKnowledgeSummary } from '../services/knowledge.service'
import { getChallenges } from '../services/challenge.service'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getCurrentUser()
  
  // Redirect to login if no user
  if (!user || !user.email) {
    redirect('/login')
  }

  const stats = await getKnowledgeSummary()
  const recentLearning = await getChallenges()

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-8 space-y-8 lg:flex lg:gap-6 lg:space-y-0">
      <aside className="hidden lg:flex w-72 shrink-0">
        <Sidebar user={user} />
      </aside>
      <section className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome back, {user.name}.</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Current Streak" value="12 Days" icon="local_fire_department" variant="tertiary" />
            <StatsCard title="Total XP" value="1,240" icon="stars" variant="primary" />
            <StatsCard title="Mind Rank" value="Lvl 24" icon="military_tech" variant="secondary" />
            <StatsCard title="Retained" value="84%" icon="psychology" variant="on-primary-container" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Learning Summary</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface/80">Knowledge Density</span>
                  <span className="font-semibold text-secondary">{stats.knowledge}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-secondary progress-glow rounded-full" style={{ width: `${stats.knowledge}%` }} />
                </div>
                <p className="text-sm text-on-surface/70 mt-2">Top 5% of active learners this week.</p>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface/80">Questions Mastery</span>
                  <span className="font-semibold text-primary">{stats.mastery.current} / {stats.mastery.total}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary progress-glow rounded-full" style={{ width: `${(stats.mastery.current / stats.mastery.total) * 100}%` }} />
                </div>
                <p className="text-sm text-on-surface/70 mt-2">{stats.mastery.total - stats.mastery.current} questions away from next milestone.</p>
              </div>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4">
              <button className="text-primary font-medium">View detailed analytics <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </div>

          <QuickActions />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Recent Learning</h2>
            <a className="text-on-surface/70">See all</a>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-3 snap-x">
            {recentLearning.map(item => (
              <RecentLearningCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <Heatmap />
      </section>
    </main>
  )
}
