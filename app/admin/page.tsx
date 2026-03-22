import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Users, FileText, ArrowLeft, ShieldAlert } from 'lucide-react'

// FOR SCHOLARSHIP SUBMISSION: You can add your own email here to be the admin
const ADMIN_EMAILS = ['admin@example.com', 'user@example.com', 'chandanashiremath@gmail.com'] // Example emails

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 max-w-md mb-8">
          This area is reserved for recruitment administrators. Please contact your system owner if you believe this is an error.
        </p>
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  // Fetch all users and their resumes (requires service_role if RLS is strict, 
  // but for this MVP we'll assume the profiles table exists or we'll count resumes by user_id)
  
  // Note: Standard Supabase auth users aren't easily listable from client without admin API.
  // We will fetch unique user_ids from the resumes table to simulate a "User List".
  const { data: userStats, error } = await supabase
    .from('resumes')
    .select('user_id, created_at')
  
  // Group by user_id to count resumes per user
  const statsMap: Record<string, { count: number, lastActive: string }> = {}
  userStats?.forEach(item => {
    if (!statsMap[item.user_id]) {
      statsMap[item.user_id] = { count: 0, lastActive: item.created_at }
    }
    statsMap[item.user_id].count++
    if (new Date(item.created_at) > new Date(statsMap[item.user_id].lastActive)) {
      statsMap[item.user_id].lastActive = item.created_at
    }
  })

  const totalResumes = userStats?.length || 0
  const uniqueUsers = Object.keys(statsMap).length

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
              <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] uppercase font-bold rounded">Admin</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">User View</Link>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 sm:p-10 relative">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">System Overview</h1>
          <p className="text-slate-400">Manage users and monitor curriculum vitae generation activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg"><Users className="w-5 h-5 text-indigo-400" /></div>
              <span className="text-slate-400 font-medium">Total Users</span>
            </div>
            <div className="text-4xl font-black text-white">{uniqueUsers}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg"><FileText className="w-5 h-5 text-purple-400" /></div>
              <span className="text-slate-400 font-medium">Resumes Generated</span>
            </div>
            <div className="text-4xl font-black text-white">{totalResumes}</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg"><Sparkles className="w-5 h-5 text-emerald-400" /></div>
              <span className="text-slate-400 font-medium">AI Efficiency</span>
            </div>
            <div className="text-4xl font-black text-white">98.2%</div>
          </div>
        </div>

        {/* User Activity List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <h3 className="font-bold text-slate-200">Active User Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">User UUID (Pseudo-ID)</th>
                  <th className="px-6 py-4 font-bold">Resumes Created</th>
                  <th className="px-6 py-4 font-bold">Last Activity</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {Object.entries(statsMap).map(([uid, data]) => (
                  <tr key={uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400 group-hover:text-indigo-300 transition-colors">
                      {uid}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-200">
                        {data.count} Documents
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(data.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all">
                         View Details
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
