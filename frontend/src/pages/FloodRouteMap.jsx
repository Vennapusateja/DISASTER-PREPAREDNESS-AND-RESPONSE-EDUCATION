import React from "react";

export default function FloodRouteMap() {
  const [from, setFrom] = React.useState("Main Market St");
  const [to, setTo] = React.useState("High Ground City Shelter");

  const src = `https://www.google.com/maps?q=${encodeURIComponent(`${from} to ${to}`)}&output=embed`;

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Evacuation Planner</h1>
        <p className="text-slate-400 font-medium mt-2">Dynamic route modeling for secure responder deployment and civilian extraction.</p>
      </header>

      <div className="os-card">
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl border border-indigo-500/20 shadow-lg">🌐</div>
          <h2 className="text-xl font-black text-white">Route Command</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Personnel Deployment Origin</label>
            <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Enter starting coordinates..." />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">High-Ground Extraction Zone</label>
            <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter destination shelter..." />
          </div>
        </div>

        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 h-[500px] shadow-2xl group">
          <div className="absolute bottom-6 right-6 p-5 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl z-10 shadow-2xl animate-fade-in pointer-events-none sm:pointer-events-auto group-hover:scale-105 transition-transform">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Risk Legend</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-black text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                SAFE ZONE
              </div>
              <div className="flex items-center gap-3 text-xs font-black text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> 
                CRITICAL FLOOD
              </div>
              <div className="flex items-center gap-3 text-xs font-black text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8_rgba(245,158,11,0.5)]" /> 
                CONGESTED
              </div>
            </div>
          </div>
          
          <iframe
            title="Safe route map"
            src={src}
            className="w-full h-full grayscale invert opacity-80"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-8 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-start gap-4">
          <div className="text-xl">💡</div>
          <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Command Advisory</div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Main arterial routes near low-lying subways are automatically flagged as RED. Follow the GREEN-optimized vectors for maximum extraction efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
