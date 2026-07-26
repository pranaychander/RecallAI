import Link from 'next/link'
import { getCurrentUser } from '../../services/auth.service'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  return (
    <main className="max-w-[900px] mx-auto px-8 py-12">
      <Link href="/" className="text-on-surface/80">← Back</Link>
      <h1 className="text-2xl font-bold mt-4">{user.name} (Profile)</h1>
      <p className="mt-2 text-on-surface/80">Level {user.level} • {user.xp} XP</p>
    </main>
  )
}
