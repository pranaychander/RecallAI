"use client"
import { useRouter } from 'next/navigation'

export default function QuickActions() {
  const router = useRouter()

  const handlePasteLink = () => {
    // navigate to create with query
    router.push('/create?source=link')
  }

  const handleUploadPDF = () => {
    router.push('/upload')
  }

  const handleImportYouTube = () => {
    router.push('/import?source=youtube')
  }

  const handleViewAnalytics = () => {
    router.push('/analytics')
  }

  return (
    <div className="md:col-span-4 flex flex-col gap-3">
      <button onClick={handlePasteLink} className="bg-primary text-on-primary rounded-xl px-4 py-3 flex items-center justify-between shadow">Paste Link <span className="material-symbols-outlined opacity-60">chevron_right</span></button>
      <button onClick={handleUploadPDF} className="glass-card border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">Upload PDF <span className="material-symbols-outlined opacity-60">chevron_right</span></button>
      <button onClick={handleImportYouTube} className="glass-card border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">Import YouTube <span className="material-symbols-outlined opacity-60">chevron_right</span></button>
      <button onClick={handleViewAnalytics} className="mt-2 text-primary font-medium flex items-center gap-2">View detailed analytics <span className="material-symbols-outlined">arrow_forward</span></button>
    </div>
  )
}
