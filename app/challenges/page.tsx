import { getChallenges } from '../../services/challenge.service'
import RecentLearningCard from '../../components/RecentLearningCard'

export default async function ChallengesPage() {
  const items = await getChallenges()
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <h1 className="text-2xl font-bold mb-6">Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(i => (
          <RecentLearningCard key={i.id} item={i} />
        ))}
      </div>
    </main>
  )
}
