import React, { useEffect, useState } from "react";
import { adminApi } from "../services/api.js";

export default function AdminReports({ token }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getReport(token);
      setReport(data.report);
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (format) => {
    if (!report) return;
    let content = "";
    let mimeType = "";
    let fileName = `report_${new Date().getTime()}`;

    if (format === "json") {
      content = JSON.stringify(report, null, 2);
      mimeType = "application/json";
      fileName += ".json";
    } else {
      const flatReport = Object.keys(report).reduce((acc, k) => {
        if (typeof report[k] !== "object") acc[k] = report[k];
        return acc;
      }, {});
      const headers = Object.keys(flatReport).join(",");
      const values = Object.values(flatReport).join(",");
      content = `${headers}\n${values}`;
      mimeType = "text/csv";
      fileName += ".csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Intelligence Reports</h1>
        <p className="text-slate-400 font-medium mt-2">Aggregate system performance and personnel engagement data harvesting.</p>
      </header>

      <div className="os-card">
        {!report ? (
          <div className="text-center py-20 flex flex-col items-center">
            {loading ? (
              <div className="w-full space-y-4 animate-pulse">
                <div className="h-8 bg-white/5 rounded-xl w-2/3 mx-auto" />
                <div className="grid grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl" />)}
                </div>
                <div className="h-32 bg-white/5 rounded-2xl" />
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-4xl mb-8 border border-indigo-500/20">📜</div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm mb-10">No report generated in current session</p>
                <button className="w-full max-w-sm py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={fetchReport} disabled={loading}>
                  GENERATE COMPREHENSIVE REPORT
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { v: report.totalUsers, l: "Active Responders", c: "indigo" },
                { v: report.totalDrills, l: "Mission Drills", c: "emerald" },
                { v: `${report.avgQuizScore}%`, l: "Avg Proficiency", c: "amber" },
                { v: `${report.avgDrillScore}%`, l: "Field Rating", c: "rose" }
              ].map((s, i) => (
                <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-inner">
                  <div className="text-2xl font-black text-white mb-1">{s.v}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>

            <section className="p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
               <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">High-Yield Performers</h3>
               <div className="flex flex-wrap gap-3">
                  {report.topPerformers.map((p, i) => (
                    <div key={i} className="px-5 py-3 bg-slate-900 border border-white/5 rounded-xl flex items-center gap-3 group hover:border-indigo-500/30 transition-all">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                       <span className="text-xs font-black text-white">{p.name}</span>
                       <span className="text-[10px] font-black text-slate-500 uppercase">{p.points} XP</span>
                    </div>
                  ))}
               </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
               <button className="flex-1 py-4 bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20" onClick={fetchReport} disabled={loading}>REFRESH ANALYTIC SCAN</button>
               <div className="flex gap-4">
                  <button className="flex-1 sm:flex-initial px-8 py-4 bg-white/5 border border-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest" onClick={() => downloadFile("json")}>Export JSON</button>
                  <button className="flex-1 sm:flex-initial px-8 py-4 bg-white/5 border border-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest" onClick={() => downloadFile("csv")}>Export CSV</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
