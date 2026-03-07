'use client';

import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { useState } from 'react';
import { Sparkles, FileText, Briefcase, Zap } from 'lucide-react';

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
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="h-16 w-full bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            AI Resume <span className="text-indigo-600 font-extrabold">Studio</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Templates</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">My Resumes</span>
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all ml-2">
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Split Layout */}
      <main className="flex-1 w-full flex overflow-hidden">
        
        {/* LEFT PANEL: Form Editor (Scrollable) */}
        <div className="w-full lg:w-[45%] h-full overflow-y-auto custom-scrollbar flex flex-col bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          
          <div className="px-8 sm:px-12 py-10 max-w-2xl mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Resume <span className="text-indigo-600">Details</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Fill in your professional details below. Our AI will automatically synthesize, format, and optimize your content for ATS systems.
              </p>
            </div>
            
            <ResumeForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview (Fixed) */}
        <div className="hidden lg:flex flex-1 h-full bg-slate-50 relative flex-col items-center justify-center p-8">
          {/* Subtle grid background for the canvas area */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {resumeContent ? (
            <div className="w-full h-full max-w-5xl flex flex-col items-center justify-start rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/50 bg-slate-100 p-2 z-10 transition-all duration-500 fade-in zoom-in-95">
               <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 relative">
                <ResumePreview content={resumeContent} />
               </div>
            </div>
          ) : (
            <div className="relative w-full max-w-2xl bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-16 text-center z-10">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse" />
                <div className="relative bg-white w-full h-full rounded-full shadow-sm flex flex-col items-center justify-center border border-indigo-50 text-indigo-500">
                   <FileText className="w-10 h-10 mb-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Your Canvas Awaits</h3>
              <p className="text-base text-slate-500 max-w-md font-medium leading-relaxed">
                Start filling out your details on the left. Once ready, hit generate to see your world-class resume appear here instantly.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
