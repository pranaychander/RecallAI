'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { logout, getCurrentUser } from '../services/auth.service'
import { useRouter } from 'next/navigation'
import type { User } from '../types'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40" role="banner">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }} aria-hidden="true">drive_file_rename</span>
          <Link href="/" className="font-bold text-xl text-primary">RecallAI</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <Link href="/" className="text-primary font-semibold">Dashboard</Link>
          <Link href="/challenges" className="text-on-surface/80">Challenges</Link>
          <Link href="/graph" className="text-on-surface/80">Graph</Link>
          <Link href="/cards" className="text-on-surface/80">Cards</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 overflow-hidden hover:border-primary/60 transition-colors flex items-center justify-center"
                  aria-label="User menu"
                >
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-on-surface font-medium text-sm">{user.name}</p>
                      <p className="text-on-surface/70 text-xs">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-on-surface/80 hover:text-on-surface hover:bg-white/5 transition-colors text-sm">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-on-surface/80 hover:text-on-surface hover:bg-white/5 transition-colors text-sm">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-error hover:bg-error/10 transition-colors text-sm border-t border-white/5"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
