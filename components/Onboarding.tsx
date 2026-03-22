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

        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                Powered by Elevate AI Engine &bull; DeepSeek v3 &bull; Supabase Security
            </p>
        </div>
      </div>
    </div>
  );
}
