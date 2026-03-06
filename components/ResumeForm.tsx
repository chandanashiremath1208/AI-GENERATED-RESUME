import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Target Role</Label>
          <Input id="role" name="role" required value={formData.role} onChange={handleChange} placeholder="Senior Frontend Developer" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief overview of your career and goals..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Work Experience</Label>
        <Textarea id="experience" name="experience" required value={formData.experience} onChange={handleChange} placeholder="Company X (2020-Present): Developed main application..." rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="B.S. Computer Science, University Y, 2019" rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input id="skills" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, TypeScript, Node.js..." />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating AI Resume...' : 'Generate Resume'}
      </Button>
    </form>
  );
}
