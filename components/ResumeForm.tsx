'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Full Name</Label>
          <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-12 bg-white border-slate-200 shadow-sm text-base transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Email Address</Label>
          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="h-12 bg-white border-slate-200 shadow-sm text-base transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Phone Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (234) 567-8900" className="h-12 bg-white border-slate-200 shadow-sm text-base transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Target Role</Label>
          <Input id="role" name="role" required value={formData.role} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className="h-12 bg-white border-slate-200 shadow-sm text-base transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="summary" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Professional Summary</Label>
        <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Briefly describe your overall career narrative and what makes you unique..." rows={3} className="bg-white border-slate-200 shadow-sm text-base resize-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Work Experience</Label>
        <Textarea id="experience" name="experience" required value={formData.experience} onChange={handleChange} placeholder="Company X (2020-Present): Developed main application... Feel free to be brief, the AI will expand this into professional bullets." rows={4} className="bg-white border-slate-200 shadow-sm text-base resize-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Education</Label>
        <Textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="B.S. Computer Science, University Y, 2019" rows={2} className="bg-white border-slate-200 shadow-sm text-base resize-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed" />
      </div>

      <div className="space-y-2 pb-2">
        <Label htmlFor="skills" className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Core Skills (comma separated)</Label>
        <Input id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js, Project Management..." className="h-12 bg-white border-slate-200 shadow-sm text-base transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 text-base font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Crafting your resume...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Professional Resume
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
