'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, FileText, Briefcase, Zap, Layout, 
  Download, Loader2, User, Mail, Phone, 
  GraduationCap, Wrench, ArrowRight, MousePointer2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ResumePreview from '@/components/ResumePreview';
import AuthButton from '@/components/AuthButton';

// --- INTEGRATED WIZARD ENGINE ---
function WizardForm({ onSubmit, isLoading, initialData }: { onSubmit: (data: any) => void, isLoading: boolean, initialData?: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    template: 'modern'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setTemplate = (t: string) => setFormData({ ...formData, template: t });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const inputClasses = "h-11 bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner";
  const labelClasses = "text-slate-300 font-medium text-sm flex items-center gap-2 mb-1.5";
  const cardClasses = "bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-slate-600/50 transition-colors h-full min-h-[400px]";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">
      <div className="flex items-center justify-between px-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= i ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
              {i}
            </div>
            {i < 4 && <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-700 ${step > i ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 min-h-[450px]">
        {step === 1 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-6 tracking-tight uppercase">
              <User className="w-5 h-5 text-indigo-400" /> Core Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label htmlFor="name" className={labelClasses}>Full Name</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className={inputClasses} />
              </div>
              <div>
                <Label htmlFor="role" className={labelClasses}>Target Role</Label>
                <Input id="role" name="role" required value={formData.role} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" className={inputClasses} />
              </div>
              <div>
                <Label htmlFor="email" className={labelClasses}><Mail className="w-3.5 h-3.5 text-slate-400"/> Email Address</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClasses} />
              </div>
              <div>
                <Label htmlFor="phone" className={labelClasses}><Phone className="w-3.5 h-3.5 text-slate-400"/> Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (234) 567-8900" className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-4 tracking-tight uppercase">
              <Briefcase className="w-5 h-5 text-purple-400" /> Work Experience
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">List your roles. AI will transform your notes into impactful bullet points.</p>
            <Textarea id="experience" name="experience" required value={formData.experience} onChange={handleChange} placeholder={"Company X (2020-Present): Developed main application...\nCompany Y (2018-2020): Frontend developer..."} rows={10} className={`${inputClasses} h-auto resize-none py-3 leading-relaxed`} />
          </div>
        )}

        {step === 3 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-5 tracking-tight uppercase">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Background & Skills
            </h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="education" className={labelClasses}>Education</Label>
                <Textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="B.S. Computer Science, Stanford University, 2019" rows={4} className={`${inputClasses} h-auto resize-none py-3`} />
              </div>
              <div>
                <Label htmlFor="skills" className={labelClasses}><Wrench className="w-4 h-4 text-emerald-400"/> Core Skills (comma separated)</Label>
                <Input id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js..." className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-6 tracking-tight uppercase">
              <Sparkles className="w-5 h-5 text-amber-400" /> Template Choice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'modern', name: 'Modern Minimal', desc: 'Tech-forward and clean.' },
                { id: 'executive', name: 'Executive Silk', desc: 'Professional and serif.' },
                { id: 'creative', name: 'Creative Edge', desc: 'Bold and dynamic.' }
              ].map((t) => (
                <div key={t.id} onClick={() => setTemplate(t.id)} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.template === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}>
                  <h4 className="font-bold text-slate-100 text-xs mb-1 uppercase">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-center">
              <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Optimized for {formData.template} aesthetic</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && <Button type="button" onClick={prevStep} className="flex-1 h-12 bg-slate-900 border border-slate-700 text-slate-300 font-bold rounded-xl">Back</Button>}
          <Button type="submit" disabled={isLoading} className={`h-12 text-base font-bold rounded-xl flex-[2] transition-all transform hover:-translate-y-1 ${step === 4 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 4 ? 'Generate Resume' : 'Continue')}
          </Button>
        </div>
      </form>
    </div>
  );
}

// --- MAIN PAGE LAYOUT ---
function ResumeBuilderContent() {
  const [resumeContent, setResumeContent] = useState('');
  const [template, setTemplate] = useState('modern');
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');

  useEffect(() => {
    if (resumeId) {
      const fetchResume = async () => {
        try {
          const res = await fetch(`/api/resumes/${resumeId}`);
          if (res.ok) {
            const data = await res.json();
            const content = JSON.parse(data.content);
            setInitialData(content);
            setResumeContent(data.content);
            if (content.template) setTemplate(content.template);
          }
        } catch (err) { console.error(err); }
      };
      fetchResume();
    }
  }, [resumeId]);

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setResumeContent(data.resume);
      setTemplate(formData.template);
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.resume, template: formData.template }),
      });
    } catch (error) {
      alert('Error: ' + error);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white print:text-black">
      <nav className="h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-20 sticky top-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-100 uppercase">Elevate <span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
        
        <div className="w-full lg:w-[45%] h-full overflow-y-auto px-6 sm:px-12 py-10 z-10 border-r border-slate-800 print:hidden">
          <div className="max-w-xl mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap className="w-3.5 h-3.5" /> Silicon Valley Standards
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-[0.9]">Resume Builder</h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">Input your history. Our AI synthesizes it into a world-class, ATS-optimized layout.</p>
            </div>
            <WizardForm onSubmit={handleGenerate} isLoading={isLoading} initialData={initialData} />
          </div>
        </div>

        <div className="flex-1 h-full bg-slate-900 flex flex-col items-center justify-center p-8 z-0 print:flex print:p-0">
          {resumeContent ? (
            <div className="w-full h-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl print:rounded-none print:shadow-none">
              <ResumePreview content={resumeContent} template={template} />
            </div>
          ) : (
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto mb-8 bg-indigo-500/5 rounded-3xl flex items-center justify-center text-indigo-500 border border-indigo-500/10 animate-pulse">
                <FileText className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Your Canvas Awaits</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">Start filling out your details. Once ready, hit generate to see your pixel-perfect resume appear here instantly.</p>
            </div>
          )}
        </div>
      </main>

      <section className="w-full bg-slate-950 border-t border-slate-800/60 py-24 z-10 print:hidden relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Inspiration Matrix</h2>
            <p className="text-slate-500 text-lg">8 visual reference formats generated entirely by the Elevate AI Engine.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "The Modern Engineer", "The Creative Director", "The Chief Executive", "The Academic Researcher",
              "The Startup Founder", "The Medical Professional", "The Finance Analyst", "The Entry-Level Intern"
            ].map((item) => (
              <div key={item} className="aspect-[1/1.3] bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-crosshair">
                <div className="w-12 h-12 bg-slate-800 rounded-lg mb-4 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <MousePointer2 className="w-5 h-5 text-slate-500 group-hover:text-white" />
                </div>
                <h4 className="text-sm font-black text-slate-300 uppercase text-center group-hover:text-white">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase italic tracking-widest">Synthesizing...</div>}>
      <ResumeBuilderContent />
    </Suspense>
  )
}
