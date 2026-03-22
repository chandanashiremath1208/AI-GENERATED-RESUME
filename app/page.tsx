'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-20 text-center">
      <h1 className="text-6xl font-black text-white mb-6 animate-pulse uppercase tracking-tighter">
        DEPLOYMENT SMOKE TEST v3.0
      </h1>
      <p className="text-slate-400 text-xl font-bold uppercase tracking-widest">
        If you see this, the system is officially updating. 
        Full multi-step wizard rebuilding in 3... 2... 1...
      </p>
    </div>
  );
}
