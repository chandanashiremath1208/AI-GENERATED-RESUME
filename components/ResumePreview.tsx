'use client';

import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCircle, FileText, Mail, Phone, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ResumePreview({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  let parsedResume: any = null;
  let isJson = false;

  try {
    parsedResume = JSON.parse(content);
    isJson = true;
  } catch (e) {
    // Fallback to markdown if AI didn't return purely valid JSON
    isJson = false;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "my_resume.md";
    document.body.appendChild(element);
    element.click();
  };

  if (!content) return null;

  return (
    <div className="w-full h-full flex flex-col relative bg-transparent overflow-hidden">
      {/* Top Banner Toolbar */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          Generated AI Resume
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Button size="sm" onClick={handleCopy} variant="outline" className="h-9 px-4 gap-2 text-sm bg-white shadow-sm transition-all hover:bg-slate-50 font-medium rounded-lg">
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Data'}
          </Button>
          <Button size="sm" onClick={handleDownload} className="h-9 px-4 gap-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Scrollable Paper Container */}
      <div className="flex-1 overflow-y-auto w-full flex justify-center p-8 bg-slate-50/80 scroll-smooth custom-scrollbar">
        <div className="w-full max-w-[850px] bg-white h-max shadow-sm rounded border border-slate-100 p-12 sm:p-16 transition-all duration-300">
          
          {isJson && parsedResume ? (
            <div className="text-slate-800 font-sans">
              
              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">{parsedResume.name || 'Your Name'}</h1>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">{parsedResume.role || 'Professional Title'}</h2>
                
                {parsedResume.contact && parsedResume.contact.length > 0 && (
                  <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                    {parsedResume.contact.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          {c.type.toLowerCase().includes('mail') ? <Mail className="w-3.5 h-3.5 text-emerald-600" /> : 
                           c.type.toLowerCase().includes('phone') ? <Phone className="w-3.5 h-3.5 text-emerald-600" /> : 
                           <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <span className="font-medium">{c.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              {parsedResume.summary && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-500 inline-block pb-1 mb-3">Summary</h3>
                  <div className="border-t border-slate-200 pt-3 mt-[-10px]">
                    <p className="text-sm leading-relaxed text-justify text-slate-700">{parsedResume.summary}</p>
                  </div>
                </div>
              )}

              {/* EMPLOYMENT */}
              {parsedResume.experience && parsedResume.experience.length > 0 && (
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-500 inline-block pb-1 mb-3">Employment</h3>
                   <div className="border-t border-slate-200 pt-4 mt-[-10px] space-y-6">
                      {parsedResume.experience.map((exp: any, i: number) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                            <h4 className="text-base font-bold text-slate-900">
                              {exp.company} <span className="text-slate-400 font-normal mx-1">|</span> {exp.role} <span className="text-slate-400 font-normal mx-1">|</span> <span className="text-slate-600 font-medium">{exp.location}</span>
                            </h4>
                            <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">{exp.date}</span>
                          </div>
                          {exp.bullets && exp.bullets.length > 0 && (
                            <ul className="list-outside list-disc pl-5 space-y-1.5 text-sm text-slate-700 marker:text-slate-400">
                              {exp.bullets.map((bullet: string, j: number) => (
                                <li key={j} className="leading-snug">{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* EDUCATION */}
              {parsedResume.education && parsedResume.education.length > 0 && (
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-500 inline-block pb-1 mb-3">Education</h3>
                   <div className="border-t border-slate-200 pt-4 mt-[-10px] space-y-4">
                      {parsedResume.education.map((edu: any, i: number) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h4 className="text-base font-bold text-slate-900">
                              {edu.institution} <span className="text-slate-400 font-normal mx-1">|</span> {edu.degree}
                            </h4>
                            <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">{edu.date}</span>
                          </div>
                          {edu.details && edu.details.length > 0 && (
                            <ul className="list-outside list-disc pl-5 mt-1.5 space-y-1 text-sm text-slate-700 marker:text-slate-400">
                              {edu.details.map((detail: string, j: number) => (
                                <li key={j} className="leading-snug">{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* SKILLS */}
              {parsedResume.skills && parsedResume.skills.length > 0 && (
                <div className="mb-6">
                   <h3 className="text-xl font-bold text-slate-900 border-b-2 border-emerald-500 inline-block pb-1 mb-3">Skills</h3>
                   <div className="border-t border-slate-200 pt-4 mt-[-10px]">
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-slate-700 w-full pl-0">
                        {parsedResume.skills.map((skill: string, i: number) => (
                          <li key={i} className="flex truncate">
                            <span className="text-emerald-500 mr-2 font-bold">•</span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              )}
            </div>
          ) : (
            // FALLBACK MARKDOWN RENDERING
            <div className="prose prose-sm md:prose-base !max-w-none text-slate-700 
                            prose-headings:text-slate-900 prose-headings:font-bold prose-h1:text-4xl prose-h1:text-center prose-h1:mb-3 prose-h1:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2
                            prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-h3:font-semibold
                            prose-p:leading-relaxed prose-p:my-2.5 
                            prose-ul:my-2.5 prose-li:my-1.5 prose-strong:text-slate-900 prose-strong:font-semibold
                            marker:text-indigo-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
