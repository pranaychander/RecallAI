import Link from 'next/link'

export default function CreatePage() {
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">Create / Import Content (Mock)</h1>
      <p className="mt-2 text-on-surface/80">This page simulates creating or importing a challenge. Replace with real form when backend is ready.</p>
      <div className="mt-6">
        <label className="block mb-2">Title</label>
        <input className="w-full p-2 rounded bg-white/5" placeholder="My new challenge" />
        <label className="block mt-4 mb-2">Source URL (optional)</label>
        <input className="w-full p-2 rounded bg-white/5" placeholder="https://..." />
        <div className="mt-4 flex gap-2">
          <button className="bg-primary text-on-primary px-4 py-2 rounded">Create (mock)</button>
          <Link href="/" className="px-4 py-2 rounded border glass-card">Cancel</Link>
        </div>
      </div>
    </main>
  )
}
