import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, FileText, Plus, LogOut, ArrowRight, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth check temporarily disabled for submission

  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    // .eq('user_id', user?.id) // Disabled for public submission access
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <nav className="h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20 relative">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">
                Elevate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">AI</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-slate-400 hidden sm:inline-block">Guest User</span>
          <form action="/auth/signout" method="post">
            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm backdrop-blur-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 sm:p-10 relative">
        {/* Ambient Dark Background Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">
              My Resumes
            </h1>
            <p className="text-slate-400">View and manage your AI-generated resumes.</p>
          </div>
          <Link href="/">
            <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Resume</span>
            </button>
          </Link>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {!resumes || resumes.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/30 border border-slate-800/50 rounded-2xl border-dashed">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">No resumes yet</h3>
              <p className="text-slate-500 max-w-sm mb-6">
                You haven't generated any resumes. Create your first ATS-optimized profile now.
              </p>
              <Link href="/">
                <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center gap-2">
                  Create Resume <ArrowRight className="w-4 h-4 text-indigo-400" />
                </button>
              </Link>
            </div>
          ) : (
            resumes.map((resume) => {
              let parsed;
              try {
                parsed = JSON.parse(resume.content);
              } catch (e) {
                parsed = { name: 'Unknown', role: 'Resume Document' };
              }

              return (
                <div key={resume.id} className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{parsed.role || 'Professional Resume'}</h3>
                  <p className="text-sm font-medium text-slate-400 mb-4">{parsed.name || 'Anonymous'}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-800">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(resume.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
