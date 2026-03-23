'use client';

import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCircle, FileText, Mail, Phone, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResumeData {
  name: string;
  role: string;
  contact: Array<{ type: string; value: string }>;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    date: string;
    location?: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    date: string;
    details?: string[];
  }>;
  skills: string[];
}

export default function ResumePreview({ content, template = 'modern' }: { content: any, template?: string }) {
  const [copied, setCopied] = useState(false);

  // Theme-Specific Design Tokens
  const themes: Record<string, { 
    container: string, 
    accentText: string, 
    accentBorder: string,
    accentBg: string,
    fontFamily: string, 
    headerStyle: string, 
    sectionHeader: string,
    bulletStyle: string 
  }> = {
    modern: {
      container: "font-sans text-slate-800",
      accentText: "text-indigo-600",
      accentBorder: "border-indigo-500",
      accentBg: "bg-indigo-50",
      fontFamily: "font-sans",
      headerStyle: "text-center mb-12",
      sectionHeader: "text-xl font-bold border-b-2 border-indigo-500 inline-block pb-1 mb-6 uppercase tracking-wider",
      bulletStyle: "text-indigo-500"
    },
    executive: {
      container: "font-serif text-slate-900 leading-normal",
      accentText: "text-slate-900",
      accentBorder: "border-slate-800",
      accentBg: "bg-slate-50",
      fontFamily: "font-serif",
      headerStyle: "text-left mb-12 border-l-8 border-slate-900 pl-8 py-2",
      sectionHeader: "text-lg font-bold uppercase tracking-[0.2em] border-b border-slate-300 w-full pb-1 mb-6 flex items-center",
      bulletStyle: "text-slate-400"
    },
    creative: {
      container: "font-sans text-slate-800",
      accentText: "text-emerald-600",
      accentBorder: "border-emerald-500",
      accentBg: "bg-emerald-50",
      fontFamily: "font-sans",
      headerStyle: "text-right mb-12 bg-slate-50 p-10 rounded-3xl border-r-8 border-emerald-500",
      sectionHeader: "text-2xl font-black text-emerald-600 mb-6 flex items-center gap-4 after:h-[2px] after:flex-1 after:bg-emerald-100",
      bulletStyle: "text-emerald-500"
    },
    minimal: {
      container: "font-sans text-slate-700 max-w-[700px] mx-auto",
      accentText: "text-slate-900",
      accentBorder: "border-slate-200",
      accentBg: "bg-slate-50",
      fontFamily: "font-sans",
      headerStyle: "text-center mb-16",
      sectionHeader: "text-sm font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex justify-center",
      bulletStyle: "text-slate-300"
    },
    startup: {
      container: "font-sans text-slate-800",
      accentText: "text-blue-600",
      accentBorder: "border-blue-500",
      accentBg: "bg-blue-50",
      fontFamily: "font-sans",
      headerStyle: "text-left mb-12 flex items-baseline gap-6 justify-between",
      sectionHeader: "text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 before:w-2 before:h-8 before:bg-blue-600",
      bulletStyle: "text-blue-500"
    },
    academic: {
      container: "font-serif text-slate-900 text-[13px] leading-tight",
      accentText: "text-slate-900",
      accentBorder: "border-slate-900",
      accentBg: "bg-transparent",
      fontFamily: "font-serif",
      headerStyle: "text-center mb-10 border-b-2 border-slate-900 pb-6",
      sectionHeader: "text-base font-bold uppercase border-b border-slate-900 mb-4",
      bulletStyle: "text-slate-900"
    }
  };

  const theme = themes[template] || themes.modern;

  let parsedResume: ResumeData | null = null;
  let isJson = false;

  if (content && typeof content === 'object') {
    parsedResume = content as ResumeData;
    isJson = true;
  } else if (typeof content === 'string') {
    try {
      parsedResume = JSON.parse(content);
      isJson = true;
    } catch (e) {
      isJson = false;
    }
  }

  const handleCopy = async () => {
    try {
      const textToCopy = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
      alert('Failed to copy to clipboard. Please try manually selecting text.');
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('resume-pdf-container');
    if (!element) return;

    // Dynamically import to keep bundle size small
    // @ts-ignore
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 0,
        filename: `${parsedResume?.name?.replace(/\s+/g, '_') || 'Resume'}_ElevateAI.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter' as const, orientation: 'portrait' as const }
      };
      
      try {
        html2pdf.default().from(element).set(opt).save().then(() => {
          console.log('PDF Download initiated');
        }).catch((err: any) => {
          alert('PDF Generation failed: ' + err.message);
        });
      } catch (err: any) {
        alert('Internal error during PDF generation: ' + err.message);
      }
    }).catch(err => {
      console.error('Failed to load html2pdf.js:', err);
      alert('Failed to load PDF engine. Please check your internet connection.');
    });
  };

  if (!content) return null;

  return (
    <div className={`w-full h-full flex flex-col relative bg-transparent overflow-hidden print:overflow-visible ${theme.fontFamily}`}>
      {/* Top Banner Toolbar */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden font-sans">
        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="uppercase tracking-tighter">Elevate <span className="text-indigo-600">AI</span> Canvas</span>
          <span className="ml-2 px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-500 rounded uppercase font-bold">{template}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleCopy} variant="outline" className="h-9 px-4 gap-2 text-sm bg-white shadow-sm transition-all hover:bg-slate-50 font-medium rounded-lg">
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" onClick={handleDownload} className="h-9 px-4 gap-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Scrollable Paper Container */}
      <div className="flex-1 overflow-y-auto w-full flex justify-center p-8 sm:p-12 bg-slate-50/50 scroll-smooth custom-scrollbar print:p-0 print:bg-white print:overflow-visible">
        <div id="resume-pdf-container" className="w-full max-w-[850px] bg-white h-max shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded border border-slate-100 p-12 sm:p-20 transition-all duration-500 print:shadow-none print:border-none print:p-0 print:max-w-none">
          
          {isJson && parsedResume ? (
            <div className={theme.container}>
              
              {/* HEADER AREA */}
              <div className={theme.headerStyle}>
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-2 leading-none">
                  {parsedResume.name || (parsedResume as any).personalInfo?.fullName || 'Synthetic Narrative'}
                </h1>
                <h2 className={`text-base font-bold uppercase tracking-[0.3em] mb-8 ${theme.accentText}`}>
                  {parsedResume.role || (parsedResume as any).personalInfo?.role || 'System Operator'}
                </h2>
                
                {Array.isArray(parsedResume.contact || (parsedResume as any).personalInfo?.contact) && (
                  <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 ${template === 'modern' ? 'justify-center' : template === 'creative' ? 'justify-end' : 'justify-start'}`}>
                    {(parsedResume.contact || (parsedResume as any).personalInfo?.contact).map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 group">
                        <div className={`w-8 h-8 rounded-full ${theme.accentBg} flex items-center justify-center transition-colors`}>
                          {c.type.toLowerCase().includes('mail') ? <Mail className={`w-3.5 h-3.5 ${theme.accentText}`} /> : 
                           c.type.toLowerCase().includes('phone') ? <Phone className={`w-3.5 h-3.5 ${theme.accentText}`} /> : 
                           <ExternalLink className={`w-3.5 h-3.5 ${theme.accentText}`} />}
                        </div>
                        <span className="font-semibold text-slate-700">{c.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUMMARY SECTION */}
              {parsedResume.summary && (
                <div className="mb-12">
                  <h3 className={theme.sectionHeader}>Professional Profile</h3>
                  <div className={`${template === 'executive' ? '' : 'border-t border-slate-100 mt-[-1rem] pt-6'}`}>
                    <p className="text-[15px] leading-[1.7] text-justify text-slate-700 font-medium italic opacity-90">{parsedResume.summary}</p>
                  </div>
                </div>
              )}

              {/* EXPERIENCE SECTION */}
              {Array.isArray(parsedResume.experience) && (
                <div className="mb-12">
                   <h3 className={theme.sectionHeader}>Experience</h3>
                   <div className={`${template === 'executive' ? '' : 'border-t border-slate-100 mt-[-1rem] pt-8'} space-y-10`}>
                      {parsedResume.experience.map((exp, i) => (
                        <div key={i} className="relative">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-3">
                            <div>
                              <h4 className="text-lg font-extrabold text-slate-900">{exp.company}</h4>
                              <p className={`text-sm font-bold uppercase tracking-wider ${theme.accentText}`}>{exp.role}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-slate-500 whitespace-nowrap">{exp.date}</p>
                               {exp.location && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{exp.location}</p>}
                            </div>
                          </div>
                          {Array.isArray(exp.bullets) && (
                            <ul className="list-outside space-y-2 text-[14px] text-slate-700 leading-relaxed">
                              {exp.bullets.map((bullet, j) => (
                                <li key={j} className="flex gap-3">
                                  <span className={`${theme.bulletStyle} mt-1.5 shrink-0`}>
                                    <CheckCircle className="w-3.5 h-3.5 opacity-40" />
                                  </span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* EDUCATION SECTION */}
              {Array.isArray(parsedResume.education) && parsedResume.education.length > 0 && (
                <div className="mb-12">
                   <h3 className={theme.sectionHeader}>Education</h3>
                   <div className={`${template === 'executive' ? '' : 'border-t border-slate-100 mt-[-1rem] pt-8'} space-y-6`}>
                      {parsedResume.education.map((edu, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900">{edu.institution}</h4>
                            <p className={`text-sm font-bold ${theme.accentText}`}>{edu.degree}</p>
                          </div>
                          <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{edu.date}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* SKILLS SECTION */}
              {Array.isArray(parsedResume.skills) && parsedResume.skills.length > 0 && (
                <div className="mb-10">
                   <h3 className={theme.sectionHeader}>Competencies</h3>
                   <div className={`${template === 'executive' ? '' : 'border-t border-slate-100 mt-[-1rem] pt-8'}`}>
                      <div className="flex flex-wrap gap-2">
                        {parsedResume.skills.map((skill, i) => (
                          <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${theme.accentBorder} ${theme.accentBg} ${theme.accentText} uppercase tracking-wider`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="prose prose-slate prose-lg !max-w-none text-slate-700 print:prose-p:text-sm print:prose-li:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{typeof content === 'string' ? content : 'Synthesized Narrative In Flight...'}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
