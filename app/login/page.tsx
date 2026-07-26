'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from '../../services/auth.service'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('password123')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, name)
      }
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-5xl">drive_file_rename</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">RecallAI</h1>
          <p className="text-on-surface/70">Master your mind with recall-first practice</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === 'login'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface/70 hover:text-on-surface'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface/70 hover:text-on-surface'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/30 rounded-lg p-3 text-error text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-on-surface/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-on-surface placeholder-on-surface/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-on-surface/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-on-surface placeholder-on-surface/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-on-surface placeholder-on-surface/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="bg-white/5 rounded-lg p-4 text-sm space-y-2">
            <p className="text-on-surface/70 font-medium">Demo Accounts:</p>
            <div className="space-y-1 text-on-surface/60 text-xs">
              <p>📧 <span className="font-mono">alex@example.com</span></p>
              <p>📧 <span className="font-mono">jordan@example.com</span></p>
              <p>📧 <span className="font-mono">sam@example.com</span></p>
              <p className="pt-1">🔑 Password: <span className="font-mono">password123</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-on-surface/50 text-sm mt-6">
          This is a mock application with simulated backend
        </p>
      </div>
    </div>
  )
}
