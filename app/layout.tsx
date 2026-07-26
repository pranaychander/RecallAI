import '../styles/globals.css'
import React from 'react'
import Header from '../components/Header'

export const metadata = {
  title: 'RecallAI',
  description: 'Adaptive learning dashboard (mock) — master your mind with recall-first practice.',
  applicationName: 'RecallAI',
  authors: [{ name: 'RecallAI Team' }],
  openGraph: {
    title: 'RecallAI — Dashboard',
    description: 'Adaptive learning dashboard (mock). Master your mind with recall-first practice.',
    url: 'https://example.com/',
    siteName: 'RecallAI',
    images: [
      {
        url: '/favicon.svg',
        width: 800,
        height: 600,
        alt: 'RecallAI'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RecallAI — Dashboard',
    description: 'Adaptive learning dashboard (mock)'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="robots" content="index,follow" />
      </head>
      <body className="bg-background text-on-surface">
        <Header />
        <main role="main">{children}</main>
        <div className="fixed right-6 bottom-24 md:bottom-10 z-30">
          <a href="/create" className="bg-primary-container text-on-primary-container w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform" aria-label="Create content">
            <span className="material-symbols-outlined text-2xl">add</span>
          </a>
        </div>
      </body>
    </html>
  )
}
