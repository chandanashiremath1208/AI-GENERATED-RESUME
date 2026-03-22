'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, User, Mail, Phone, Target, FileText, Briefcase, GraduationCap, Wrench, ArrowRight } from 'lucide-react';

export default function ResumeForm({ onSubmit, isLoading, initialData }: { onSubmit: (data: any) => void, isLoading: boolean, initialData?: any }) {
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
      
      {/* Progress Indicator */}
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
        
        {/* Step 1: Core Profile */}
        {step === 1 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-6 tracking-tight">
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

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-4 tracking-tight">
              <Briefcase className="w-5 h-5 text-purple-400" /> Work Experience
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              List your roles. AI will transform your notes into impactful bullet points.
            </p>
            <Textarea id="experience" name="experience" required value={formData.experience} onChange={handleChange} placeholder={"Company X (2020-Present): Developed main application...\n\nCompany Y (2018-2020): Frontend developer..."} rows={10} className={`${inputClasses} h-auto resize-none py-3 leading-relaxed`} />
          </div>
        )}

        {/* Step 3: Education & Skills */}
        {step === 3 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-5 tracking-tight">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Background & Skills
            </h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="education" className={labelClasses}>Education</Label>
                <Textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="B.S. Computer Science, Stanford University, 2019" rows={3} className={`${inputClasses} h-auto resize-none py-3`} />
              </div>
              <div>
                <Label htmlFor="skills" className={labelClasses}><Wrench className="w-4 h-4 text-emerald-400"/> Core Skills (comma separated)</Label>
                <Input id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, GraphQL..." className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Template Selection */}
        {step === 4 && (
          <div className={`${cardClasses} animate-in fade-in duration-500`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-6 tracking-tight">
              <Sparkles className="w-5 h-5 text-amber-400" /> Choose Your Style
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'modern', name: 'Modern Minimal', desc: 'Clean, spacious, and tech-forward.' },
                { id: 'executive', name: 'Executive Silk', desc: 'Traditional, authoritative, and serif.' },
                { id: 'creative', name: 'Creative Edge', desc: 'Bold colors and dynamic layouts.' }
              ].map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.template === t.id ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                >
                  <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${formData.template === t.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{t.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <p className="text-xs text-slate-400 leading-relaxed italic text-center">
                AI will optimize your content Specifically for the <strong>{formData.template}</strong> aesthetic.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <Button 
              type="button" 
              onClick={prevStep}
              className="flex-1 h-12 bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl font-bold"
            >
              Back
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`h-12 text-base font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-400/30 ${step === 4 ? 'flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]' : 'flex-1 bg-white/5 hover:bg-white/10 text-white'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</span>
            ) : (
              <span className="flex items-center gap-2">
                {step === 4 ? <><Sparkles className="w-4 h-4" /> Generate Resume</> : <>Next <ArrowRight className="w-4 h-4" /></>}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
