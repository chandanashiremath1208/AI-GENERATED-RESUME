import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/dashboard')
  }

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <Link href="/">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer transform hover:rotate-3 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm text-center">Sign in to access your resumes and generate new ones.</p>
        </div>

        <form action={signIn} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-slate-300 font-medium text-sm flex items-center gap-2 mb-1.5" htmlFor="email">
              <Mail className="w-4 h-4 text-slate-400" /> Email
            </label>
            <input
              className="w-full h-12 bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
              name="email"
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
              placeholder="••••••••"
              required
            />
          </div>
          
          <button className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-red-950/50 border border-red-900 text-red-400 text-center text-sm rounded-xl">
              {searchParams.message}
            </p>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
