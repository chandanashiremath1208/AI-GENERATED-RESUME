'use client';

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 ml-2">
        <Link href="/dashboard">
          <button className="px-5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm font-semibold backdrop-blur-sm">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </Link>
        <button 
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 ml-2">
      <Link href="/login">
        <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg shadow-sm transition-all backdrop-blur-sm text-sm">
          Sign In
        </button>
      </Link>
      <Link href="/signup">
        <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm transition-all text-sm shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
          Sign Up
        </button>
      </Link>
    </div>
  )
}
