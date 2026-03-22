'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Plus, LogOut, ArrowRight, Clock, Trash2, Eye, LayoutGrid, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ResumeWizard from '@/components/ResumeWizard';
import ResumePreview from '@/components/ResumePreview';

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [editingResume, setEditingResume] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState('modern');

  const supabase = createClient();

  const fetchResumes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/';
      return;
    }
    setUser(user);

    const { data } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setResumes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete resume');
    }
  };

  const handleCreateNew = () => {
    setEditingResume(null);
    setPreviewContent(null);
    setShowWizard(true);
  };

  const handleEdit = (resume: any) => {
    setEditingResume(JSON.parse(resume.content));
    setPreviewContent(resume.content);
    setPreviewTemplate(resume.template || 'modern');
    setShowWizard(true);
  };

  const onWizardSubmit = async (formData: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      
      setPreviewContent(data.resume);
      setPreviewTemplate(formData.template);

      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: data.resume, 
          template: formData.template,
          title: formData.name || 'Synthetic Profile' 
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to sync with library');
      }

      await fetchResumes();
      setShowWizard(false);
      alert('SUCCESS: Resume Synchronized to Intelligence Library');
    } catch (error) {
      console.error('Save Flow Error:', error);
      alert('SYNC ERROR: ' + error);
    } finally { 
      setIsGenerating(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Sparkles className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
        <span className="font-black tracking-[0.2em] uppercase text-[10px] italic">Initializing Intelligence OS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <nav className="h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowWizard(false)}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100 uppercase">
                Elevate <span className="text-indigo-400">AI</span>
              </span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[10px]">
          <span className="text-slate-500 hidden sm:inline-block">{user?.email}</span>
          <form action="/auth/signout" method="post">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-lg transition-all flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </nav>

      {showWizard ? (
        <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative animate-in fade-in duration-700">
          <div className="w-full lg:w-[45%] h-full overflow-y-auto px-6 sm:px-12 py-10 z-10 border-r border-slate-800 print:hidden">
            <div className="max-w-xl mx-auto">
              <button 
                onClick={() => setShowWizard(false)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-3 h-3" /> Back to My Library
              </button>
              <div className="mb-10">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase leading-none italic">Resume Wizard</h1>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-widest leading-relaxed">Synthesis Mode: Level 5 Intelligence Alpha</p>
              </div>
              <ResumeWizard 
                onSubmit={onWizardSubmit} 
                isLoading={isGenerating} 
                initialData={editingResume} 
              />
            </div>
          </div>

          <div className="flex-1 h-full bg-slate-900 flex flex-col items-center justify-center p-8 z-0 print:flex print:p-0">
            {previewContent ? (
              <div className="w-full h-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl print:rounded-none">
                <ResumePreview content={previewContent} template={previewTemplate} />
              </div>
            ) : (
              <div className="text-center opacity-40">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 border border-slate-700">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Live Sandbox</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto">Complete the wizard to render profile</p>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 sm:p-10 relative overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex flex-col mb-10 sm:mb-0">
            <div className="px-3 py-1 w-fit bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2 mb-4">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{resumes.length} Intelligence Units Synthesized</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
              My Intelligence Library
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage and evolve your professional narratives.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" /> New Document
          </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.length === 0 ? (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-slate-900/30 border-2 border-slate-800/50 rounded-[2.5rem] border-dashed">
                <FileText className="w-16 h-16 mb-6 text-slate-800" />
                <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase italic tracking-tighter">No Active Documents</h3>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest max-w-sm mb-8">
                  Begin your first synthesis to populate your intelligence library.
                </p>
                <button onClick={handleCreateNew} className="text-indigo-400 hover:text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all group">
                  Initiate First Build <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              resumes.map((resume) => {
                let parsed;
                try {
                  parsed = JSON.parse(resume.content);
                } catch (e) {
                  parsed = { name: 'Legacy Document', role: 'System Narrative' };
                }

                return (
                  <div 
                    key={resume.id} 
                    onClick={() => handleEdit(resume)}
                    className="group bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-2xl">
                        <FileText className="w-7 h-7 text-slate-500 group-hover:text-white" />
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, resume.id)}
                        className="p-3 bg-slate-800/50 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-8 relative z-10">
                      <h3 className="text-xl font-black text-white mb-2 uppercase italic truncate group-hover:text-indigo-300 transition-colors tracking-tight">
                        {parsed.name}
                      </h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate leading-none">
                        {parsed.role}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800 relative z-10">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        <Clock className="w-3 h-3" /> {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        Evolve <Eye className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>
      )}
    </div>
  );
}
