import React, { useEffect, useState } from "react";
import { adminApi } from "../services/api.js";

export default function AdminAnalytics({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats(token)
      .then(res => setData(res))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="animate-fade-in space-y-10">
      <div className="h-12 bg-white/5 rounded-2xl w-72 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="os-card h-24 animate-pulse bg-white/5" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="os-card h-80 animate-pulse bg-white/5" />
          <div className="os-card h-48 animate-pulse bg-white/5" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="os-card h-48 animate-pulse bg-white/5" />
          <div className="os-card h-48 animate-pulse bg-white/5" />
        </div>
      </div>
    </div>
  );
  if (!data) return <div className="p-10 os-card border-red-500/50 text-red-500 font-black text-center flex flex-col items-center gap-4"><div className="text-4xl">⚠️</div><div>CRITICAL ERROR: DATA LINK SEVERED</div></div>;

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Fleet Analytics</h1>
        <p className="text-slate-400 font-medium mt-2">Global operational metrics and responder performance monitoring.</p>
      </header>
      
      {/* Standardized Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { v: data.overview.users, l: "Active Responders", c: "indigo" },
          { v: data.overview.drillAttempts, l: "Total Mission Drills", c: "emerald" },
          { v: data.overview.quizAttempts, l: "Total Certifications", c: "amber" },
          { v: `${data.overview.avgQuizScore}%`, l: "Avg Proficiency", c: "rose" }
        ].map((s, i) => (
          <div key={i} className="os-card flex flex-col justify-between">
            <div className={`text-3xl font-black mb-2 text-white`}>{s.v}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <section className="os-card">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8">XP Distribution Model</h3>
            <div className="flex items-end gap-3 h-64 overflow-x-auto pb-6 scrollbar-thin">
              {data.xpDistribution.map((group, i) => {
                 const height = (group.count / Math.max(...data.xpDistribution.map(d => d.count), 1)) * 100;
                 return (
                   <div key={i} className="flex-1 min-w-[40px] flex flex-col items-center group">
                      <div className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-all duration-500" style={{ height: `${height}%` }} />
                      <div className="text-[9px] font-black text-slate-600 mt-4 text-center uppercase tracking-tighter">{group.range}</div>
                   </div>
                 );
              })}
            </div>
          </section>

          <section className="os-card">
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8">Recent Mission Drills</h3>
            <div className="space-y-4">
              {data.recentDrills.map(drill => (
                <div key={drill.id} className="flex items-center justify-between p-5 bg-slate-900/50 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm text-white truncate">{drill.student?.name || "Anonymous Responder"}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">{drill.drillType} • {new Date(drill.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right ml-6">
                    <div className={`text-lg font-black ${drill.score > 70 ? "text-emerald-400" : "text-amber-400"}`}>{drill.score}%</div>
                    <div className="w-24 h-1.5 bg-slate-950 rounded-full mt-2 overflow-hidden">
                       <div className={`h-full rounded-full ${drill.score > 70 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${drill.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Performance Sidebars */}
        <div className="lg:col-span-4 space-y-8">
           <section className="os-card border-l-4 border-l-indigo-500">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Elite Performers</h3>
              <div className="space-y-4">
                {data.topPerformers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all">
                    <span className="text-xs font-black text-white">{p.name}</span>
                    <span className="text-xs font-black text-indigo-400">{p.points?.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
           </section>

           <section className="os-card border-l-4 border-l-red-500 bg-red-500/5">
              <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Critical Review Required</h3>
              <div className="space-y-4">
                {data.lowPerformers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all">
                    <span className="text-xs font-black text-white">{p.name}</span>
                    <span className="text-xs font-black text-red-500">{p.points?.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
