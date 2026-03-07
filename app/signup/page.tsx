'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, UserPlus, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        if (data.session) {
          router.push('/dashboard')
          router.refresh()
        } else {
          setSuccessMsg('Account created successfully! Please check your email inbox to confirm your account and sign in.')
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create an Account</h1>
          <p className="text-slate-400 text-sm text-center">Start building your pixel-perfect resume today.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-slate-300 font-medium text-sm flex items-center gap-2 mb-1.5" htmlFor="email">
              <Mail className="w-4 h-4 text-slate-400" /> Email
            </label>
            <input
              className="w-full h-12 bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 font-medium text-sm flex items-center gap-2 mb-1.5" htmlFor="password">
              <Lock className="w-4 h-4 text-slate-400" /> Password
            </label>
            <input
              className="w-full h-12 bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <UserPlus className="w-4 h-4" /></>}
          </button>

          {errorMsg && (
            <p className="mt-4 p-4 bg-red-950/50 border border-red-900 text-red-400 text-center text-sm rounded-xl">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="mt-4 p-4 bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-center text-sm rounded-xl">
              {successMsg}
            </p>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
