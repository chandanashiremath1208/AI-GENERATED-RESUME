'use client';

import { useState } from 'react';
import { Sparkles, Zap, Layout, ShieldCheck, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const slides = [
  {
    title: "Elevate Your Career Narrative",
    description: "The AI-driven intelligence engine that transforms your raw experience into a world-class professional profile in seconds.",
    icon: <Sparkles className="w-16 h-16 text-indigo-400" />,
    color: "from-indigo-600/20 to-indigo-900/10",
    accent: "text-indigo-400"
  },
  {
    title: "ATS-Optimized Synthesis",
    description: "Our proprietary AI doesn't just write; it engineers your resume to pass through modern recruitment filters and land in the inbox of top recruiters.",
    icon: <Zap className="w-16 h-16 text-purple-400" />,
    color: "from-purple-600/20 to-purple-900/10",
    accent: "text-purple-400"
  },
  {
    title: "Silicon Valley Standard Layouts",
    description: "Select from elite, aesthetic templates designed by leading UI/UX experts to ensure your first impression is unforgettable.",
    icon: <Layout className="w-16 h-16 text-emerald-400" />,
    color: "from-emerald-600/20 to-emerald-900/10",
    accent: "text-emerald-400"
  },
  {
    title: "Secure Cloud Intelligence",
    description: "Your data is encrypted and managed via Supabase's high-security infrastructure. Sign in with Google to start your transformation.",
    icon: <ShieldCheck className="w-16 h-16 text-amber-400" />,
    color: "from-amber-600/20 to-amber-900/10",
    accent: "text-amber-400"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl w-full flex flex-col items-center z-10">
        <div className={`w-full aspect-video sm:aspect-[21/9] bg-gradient-to-br ${slide.color} border border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center relative transition-all duration-700 ease-out shadow-2xl backdrop-blur-sm group`}>
          <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">
            {slide.icon}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none">
            {slide.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            {slide.description}
          </p>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className={`absolute left-6 p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${currentSlide === 0 ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
            className={`absolute right-6 p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${currentSlide === slides.length - 1 ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-3 bg-slate-800'}`}
            ></div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/signup">
            <Button className="w-full sm:w-48 h-14 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest rounded-2xl transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button className="w-full sm:w-48 h-14 bg-transparent border-2 border-slate-800 text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 font-black uppercase tracking-widest rounded-2xl transition-all">
              Sign In
            </Button>
          </Link>
        </div>

      </div>

      {/* Inspiration Matrix Section */}
      <section className="w-full max-w-7xl mx-auto mt-32 px-6 pb-24 z-10 animate-in fade-in duration-1000">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" /> Visual Reference Library
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">
            Inspiration Matrix
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Explore 8 visual reference formats generated by the Elevate AI Engine.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Modern Engineer", role: "Frontend Architecture" },
            { name: "Creative Director", role: "Visual Brand Identity" },
            { name: "Chief Executive", role: "Global Operations" },
            { name: "Academic Researcher", role: "Ph.D. Computer Physics" },
            { name: "Startup Founder", role: "Series A Tech Venture" },
            { name: "Finance Analyst", role: "Quantitative Strategy" },
            { name: "Medical Expert", role: "Neuroscience Residency" },
            { name: "Entry-Level Intern", role: "Software Development" }
          ].map((item, i) => (
            <div key={i} className="group aspect-[1/1.3] bg-slate-900/40 border border-slate-800/60 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5 relative overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-slate-800 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-indigo-600 transition-all transform group-hover:scale-110 shadow-xl">
                <Layout className="w-6 h-6 text-slate-500 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{item.name}</h4>
              <p className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.2em]">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center pb-20">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
              High-Performance Narrative Systems &bull; DeepSeek AI &bull; Supabase Security
          </p>
      </div>
    </div>
  );
}
