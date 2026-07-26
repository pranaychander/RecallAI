import { getChallengeById } from '../../../services/challenge.service'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export default async function ChallengePage({ params }: Props) {
  const { id } = await params
  const item = await getChallengeById(id)
  if (!item) {
    return (
      <main className="max-w-[900px] mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold">Challenge not found</h1>
        <p className="mt-4">No mock data for id: {id}</p>
        <Link href="/challenges" className="text-primary mt-4 inline-block">Back to challenges</Link>
      </main>
    )
  }

  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/challenges" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">{item.title}</h1>
      <p className="text-on-surface/80 mt-2">{item.description}</p>
      <div className="mt-6 flex gap-3">
        <Link href={`/challenges/${item.id}/start`} className="bg-primary text-on-primary px-4 py-2 rounded">Start Challenge</Link>
        <Link href={`/challenges/${item.id}`} className="glass-card px-4 py-2 rounded border">View Details</Link>
      </div>
    </main>
  )
}
