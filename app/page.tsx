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
    <main className="h-screen w-full flex overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* LEFT PANEL: Branding & Form (Scrollable) */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto custom-scrollbar flex flex-col bg-white border-r border-slate-200 shadow-2xl z-10">
        
        {/* Dynamic Colorful Header */}
        <div className="relative pt-12 pb-16 px-8 sm:px-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent"></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-lg border border-white/10">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <span className="font-bold text-2xl tracking-wide uppercase text-indigo-50">Elevate<span className="text-indigo-300">AI</span></span>
          </div>
          
          <h1 className="relative z-10 text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
            Unlock Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">Career Potential</span>
          </h1>
          <p className="relative z-10 text-indigo-100 text-lg sm:text-xl max-w-md font-medium leading-relaxed drop-shadow-sm">
            Stop struggling with formatting. Let our AI craft a world-class, ATS-optimized resume that gets you hired instantly.
          </p>

          {/* Value Props */}
          <div className="relative z-10 flex gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-50">
              <Zap className="w-4 h-4 text-orange-400" /> Fast
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-50">
              <Briefcase className="w-4 h-4 text-pink-400" /> Professional
            </div>
          </div>
        </div>

        {/* The Form */}
        <div className="flex-1 px-8 sm:px-12 py-10 bg-slate-50/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">My Information</h2>
            <p className="text-slate-500 font-medium">Fill in your details below. Be brief, AI does the heavy lifting.</p>
          </div>
          <ResumeForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview (Fixed) */}
      <div className="hidden lg:flex flex-1 h-full bg-slate-100/80 relative flex-col items-center justify-center pt-6 pb-6 pr-6 pl-4">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 to-teal-200/40 blur-3xl rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
        
        {resumeContent ? (
          <div className="w-full h-full flex flex-col items-center justify-start rounded-[32px] overflow-hidden shadow-2xl border border-white bg-slate-200/60 p-4">
             <div className="w-full h-full bg-white rounded-2xl shadow-inner overflow-hidden border border-slate-200/60 ring-1 ring-slate-900/5 relative">
              <ResumePreview content={resumeContent} />
             </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-white/60 backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.1)] rounded-[32px] border border-white flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-700">
            <div className="w-40 h-40 mb-8 relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-white w-full h-full rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-8 border border-indigo-50 transform rotate-3 hover:rotate-6 hover:-translate-y-2 transition-all duration-500">
                 <FileText className="w-16 h-16 text-indigo-500 mb-4" />
                 <div className="w-20 h-2 bg-slate-100 rounded-full mb-3" />
                 <div className="w-12 h-2 bg-slate-100 rounded-full mb-3" />
                 <div className="w-16 h-2 bg-slate-100 rounded-full" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-indigo-900 to-purple-800">Your Canvas Awaits</h3>
            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              Submit the form to witness the magic. We'll generate a world-class, pixel-perfect resume instantly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
