'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, User, Mail, Phone, Target, FileText, Briefcase, GraduationCap, Wrench } from 'lucide-react';

export default function ResumeForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "h-11 bg-slate-900/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner";
  const labelClasses = "text-slate-300 font-medium text-sm flex items-center gap-2 mb-1.5";
  const cardClasses = "bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-slate-600/50 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-700 mt-2">
      
      {/* 1. Core Profile */}
      <div className={cardClasses}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-6 tracking-tight">
          <User className="w-5 h-5 text-indigo-400" />
          Core Profile
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

      {/* 2. Professional Summary */}
      <div className={cardClasses}>
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-4 tracking-tight">
          <FileText className="w-5 h-5 text-purple-400" />
          Executive Summary
        </h3>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          Provide a brief overview of your career narrative. The AI will polish this into a compelling, ATS-optimized paragraph.
        </p>
        <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="I am a software engineer with 5 years of experience specializing in React..." rows={3} className={`${inputClasses} h-auto resize-none py-3 leading-relaxed`} />
      </div>

      {/* 3. Work Experience */}
      <div className={cardClasses}>
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-4 tracking-tight">
          <Briefcase className="w-5 h-5 text-blue-400" />
          Work Experience
        </h3>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          List your recent roles. You can keep it brief - the AI will expand your notes into powerful, action-oriented bullet points.
        </p>
        <Textarea id="experience" name="experience" required value={formData.experience} onChange={handleChange} placeholder={"Company X (2020-Present): Developed main application, increased user retention by 20%.\n\nCompany Y (2018-2020): Frontend developer..."} rows={5} className={`${inputClasses} h-auto resize-none py-3 leading-relaxed`} />
      </div>

      {/* 4. Education & Skills */}
      <div className={cardClasses}>
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-5 tracking-tight">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          Background & Intelligence
        </h3>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="education" className={labelClasses}>Education</Label>
            <Textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="B.S. Computer Science, Stanford University, 2019" rows={2} className={`${inputClasses} h-auto resize-none py-3`} />
          </div>
          <div>
            <Label htmlFor="skills" className={labelClasses}><Wrench className="w-4 h-4 text-emerald-400"/> Core Skills (comma separated)</Label>
            <Input id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, System Design, GraphQL..." className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 pb-12 sticky bottom-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none -mx-8 sm:-mx-12"></div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="relative w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] border border-indigo-400/30"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing Resume...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              Generate Professional Resume
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
