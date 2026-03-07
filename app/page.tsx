'use client';

import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { useState } from 'react';
import { Sparkles, FileText, Briefcase, Zap, Layout, Edit3, Download } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      setResumeContent(data.resume);
      
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.resume }),
      });

    } catch (error) {
      console.error('Error generating resume:', error);
      alert('There was an error generating your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30 print:overflow-visible print:h-auto print:bg-white text-black">
      
      {/* Top Navigation Bar */}
      <nav className="h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-20 relative print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-100">
            AI Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">Studio</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-400">
          <AuthButton />
        </div>
      </nav>

      {/* Main Split Layout */}
      <main className="flex-1 w-full flex overflow-hidden relative">
        
        {/* Ambient Dark Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* LEFT PANEL: Form Editor (Scrollable) */}
        <div className="w-full lg:w-[45%] h-full overflow-y-auto custom-scrollbar flex flex-col border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)] print:hidden">
          
          <div className="px-8 sm:px-12 py-10 max-w-2xl mx-auto w-full relative z-10">
            <div className="mb-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5" /> AI-Powered
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 tracking-tight">
                Resume Builder
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                Input your career history. Our AI will synthesize it into a world-class, ATS-optimized layout designed to get you hired.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4 w-full max-w-3xl mx-auto sm:mx-0">
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/80 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-3 text-slate-300 ring-1 ring-white/5 shadow-inner">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">AI Resume Generation</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Content generated automatically using AI.</p>
                </div>
                
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/80 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-3 text-slate-300 ring-1 ring-white/5 shadow-inner">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">Multiple Templates</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Professionally designed templates.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/80 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-3 text-slate-300 ring-1 ring-white/5 shadow-inner">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">Live Resume Editor</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Edit your resume and see changes instantly.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/80 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-3 text-slate-300 ring-1 ring-white/5 shadow-inner">
                    <Download className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">PDF Download</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Export your resume as a pristine PDF.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/80 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-3 text-slate-300 ring-1 ring-white/5 shadow-inner">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">Smart AI Suggestions</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Improves descriptions and bullet points.</p>
                </div>
              </div>
            </div>
            
            <ResumeForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview (Fixed) */}
        <div className="hidden lg:flex flex-1 h-full bg-slate-900 relative flex-col items-center justify-center p-8 z-0 print:flex print:absolute print:inset-0 print:p-0 print:bg-white print:z-50 print:block">
          {/* Subtle grid background for the canvas area */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          {resumeContent ? (
            <div className="w-full h-full max-w-5xl flex flex-col items-center justify-start rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 bg-slate-800/50 p-3 z-10 transition-all duration-500 fade-in zoom-in-95 backdrop-blur-md print:shadow-none print:ring-0 print:bg-transparent print:p-0 print:block">
               <div className="w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border border-slate-200 relative print:border-none print:shadow-none print:rounded-none">
                <ResumePreview content={resumeContent} />
               </div>
            </div>
          ) : (
            <div className="relative w-full max-w-2xl bg-slate-800/40 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-3xl border border-white/5 flex flex-col items-center justify-center p-16 text-center z-10 overflow-hidden">
              {/* Inner Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>

              <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 w-full h-full rounded-2xl shadow-xl flex flex-col items-center justify-center border border-slate-600/50 text-indigo-400 transform rotate-3 hover:rotate-6 hover:-translate-y-1 transition-all">
                   <FileText className="w-10 h-10 mb-1 drop-shadow-md" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-white tracking-tight">Your Canvas Awaits</h3>
              <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
                Start filling out your details on the left. Once ready, hit generate to see your pixel-perfect resume appear here instantly.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
