"use client"

export default function Error({ error }: { error: Error }) {
  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <pre className="mt-4 p-4 bg-white/5 rounded">{error.message}</pre>
    </div>
  )
}
