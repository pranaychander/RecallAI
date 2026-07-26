import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <main className="max-w-[1100px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">Detailed Analytics (Mock)</h1>
      <p className="mt-2 text-on-surface/80">Charts and metrics would render here. This is mock content.</p>
    </main>
  )
}
