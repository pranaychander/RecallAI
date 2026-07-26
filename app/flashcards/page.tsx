import Link from 'next/link'
import { getFlashcards } from '../../services/flashcard.service'

export default async function FlashcardsPage() {
  const cards = await getFlashcards('u1')
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">Flashcards (Mock)</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <div key={c.id} className="glass-card p-4 rounded"> 
            <h3 className="font-semibold">{c.front}</h3>
            <p className="text-sm text-on-surface/80">{c.back}</p>
            <div className="mt-2">
              <Link href={`/flashcards/${c.id}`} className="text-primary">Open</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
