import Link from 'next/link'

export default function UploadPage() {
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">Upload PDF (Mock)</h1>
      <p className="mt-2 text-on-surface/80">This page simulates uploading a PDF to create content.</p>
      <div className="mt-6">
        <button className="bg-primary text-on-primary px-4 py-2 rounded">Choose file (mock)</button>
      </div>
    </main>
  )
}
