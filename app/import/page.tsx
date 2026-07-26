import Link from 'next/link'

export default function ImportPage() {
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">Import YouTube (Mock)</h1>
      <p className="mt-2 text-on-surface/80">Paste a YouTube URL to simulate import.</p>
      <div className="mt-6">
        <input className="w-full p-2 rounded bg-white/5" placeholder="https://youtube.com/..." />
        <div className="mt-2">
          <button className="bg-primary text-on-primary px-4 py-2 rounded">Import (mock)</button>
        </div>
      </div>
    </main>
  )
}
