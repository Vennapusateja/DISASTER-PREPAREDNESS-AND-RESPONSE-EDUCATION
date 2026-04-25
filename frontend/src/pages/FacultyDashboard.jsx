import React, { useEffect, useState } from "react";
import { facultyApi } from "../services/api.js";

export default function FacultyDashboard({ token }) {
  const [drills, setDrills] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dData, pData] = await Promise.all([facultyApi.getDrills(token), facultyApi.getPerformance(token)]);
        setDrills(dData.stats || []);
        setPerformance(pData.performance || []);
      } catch (err) { console.error("Failed to load faculty data:", err); }
      finally { setLoading(false); }
    }
    load();
  }, [token]);

  if (loading) return (
    <div className="animate-fade-in space-y-10">
      <div className="h-12 bg-white/5 rounded-2xl w-72 animate-pulse" />
      <div className="os-card space-y-4">
        <div className="h-8 bg-white/5 rounded-xl w-48 animate-pulse" />
        {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />)}
      </div>
      <div className="os-card space-y-4">
        <div className="h-8 bg-white/5 rounded-xl w-48 animate-pulse" />
        {[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  const getStatusStyle = (label) => {
    if (label === "Excellent") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (label === "High") return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (label === "Medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Faculty Command</h1>
        <p className="text-slate-400 font-medium mt-2">Strategic oversight of responder readiness and operational field performance.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Drill Completion Section */}
        <section className="os-card overflow-hidden">
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl border border-indigo-500/20">📡</div>
            <h2 className="text-xl font-black text-white">Drill Deployment Tracker</h2>
          </div>
          
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-y border-white/5">
                  <th className="px-6 py-4">Responder</th>
                  <th className="px-6 py-4">Total Drills</th>
                  <th className="px-6 py-4">Avg Field Score</th>
                  <th className="px-6 py-4 text-right">Last Deployment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drills.length > 0 ? drills.map((d, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400">{d.studentName?.[0]?.toUpperCase()}</div>
                          <span className="font-black text-white text-sm">{d.studentName}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">{d.totalDrills} missions</td>
                    <td className="px-6 py-5">
                       <span className={`font-black text-sm ${d.avgDrillScore > 70 ? "text-emerald-400" : "text-amber-400"}`}>{d.avgDrillScore}%</span>
                    </td>
                    <td className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase">{new Date(d.lastDrillTime).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-6 py-14"><div class="flex flex-col items-center gap-4 py-6"><div class="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">📡</div><p class="text-slate-500 font-black uppercase text-xs tracking-widest">No drill telemetry available yet</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Performance Overview Section */}
        <section className="os-card overflow-hidden">
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl border border-emerald-500/20">📊</div>
            <h2 className="text-xl font-black text-white">Personnel Performance Audit</h2>
          </div>
          
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-y border-white/5">
                  <th className="px-6 py-4">Personnel</th>
                  <th className="px-6 py-4 text-right">Total XP</th>
                  <th className="px-6 py-4 text-right">Quiz Proficiency</th>
                  <th className="px-6 py-4 text-right">Drill Accuracy</th>
                  <th className="px-6 py-4 text-right">Combat Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {performance.length > 0 ? performance.map((p, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                       <span className="font-black text-white text-sm">{p.name}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-indigo-400 text-sm">{p.xp.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right text-sm text-slate-300 font-bold">{p.quizScore}%</td>
                    <td className="px-6 py-5 text-right text-sm text-slate-300 font-bold">{p.drillScore}%</td>
                    <td className="px-6 py-5 text-right">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(p.performanceLabel)}`}>
                          {p.performanceLabel}
                       </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-600 font-black uppercase text-xs">Awaiting personnel performance metrics</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

