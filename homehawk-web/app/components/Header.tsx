'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: '#1B3A2D' }}>
              Home<span style={{ color: '#D4A24E' }}>Hawk</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/plans" className={`text-sm font-medium ${pathname === '/plans' ? 'text-[#1B3A2D]' : 'text-gray-600 hover:text-[#1B3A2D]'}`}>Plans</Link>
            {user ? (
              <>
                <Link href="/dashboard" className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-[#1B3A2D]' : 'text-gray-600 hover:text-[#1B3A2D]'}`}>Dashboard</Link>
                <button onClick={handleSignOut} className="text-sm font-medium text-gray-600 hover:text-[#1B3A2D]">Sign Out</button>
              </>
            ) : (
              <Link href="/signin" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: '#1B3A2D' }}>Sign In</Link>
            )}
          </nav>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/plans" className="block py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Plans</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="block py-2 text-sm font-medium text-gray-600">Sign Out</button>
              </>
            ) : (
              <Link href="/signin" className="block py-2 text-sm font-medium text-white rounded-lg text-center" style={{ backgroundColor: '#1B3A2D' }} onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
