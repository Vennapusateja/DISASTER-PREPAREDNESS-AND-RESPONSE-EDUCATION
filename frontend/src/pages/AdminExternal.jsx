import React from "react";
import { apiJson } from "../services/api.js";

export default function AdminExternal({ token }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiJson("/api/external/imd"),
      apiJson("/api/external/ndma"),
      apiJson("/api/external/isro-bhuvan"),
      apiJson("/api/external/fire-service")
    ]).then(([imd, ndma, isro, fire]) => {
      setData({ imd, ndma, isro, fire });
      setLoading(false);
    }).catch(err => {
      console.error("External Feed Synchronization Failure:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-black uppercase tracking-widest text-sm animate-pulse">Establishing Satellite Data Uplink...</div>;

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">External Intelligence</h1>
        <p className="text-slate-400 font-medium mt-2">Real-time telemetry and protocol synchronization with national emergency data centers.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Feeds */}
        <div className="lg:col-span-7 space-y-8">
          {/* IMD CARD */}
          <div className="os-card">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-xl font-black text-white">IMD Weather Telemetry</h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">Uplink Active</span>
            </div>
            <div className="space-y-4">
              {data.imd.alerts.map(alert => (
                <div key={alert.id} className={`p-5 rounded-2xl border ${alert.severity === "RED" || alert.severity === "CRITICAL" ? "bg-red-500/5 border-red-500/10" : "bg-amber-500/5 border-amber-500/10"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === "RED" || alert.severity === "CRITICAL" ? "text-red-500" : "text-amber-500"}`}>{alert.type} VECTOR</span>
                    <span className={`text-[10px] font-black ${alert.severity === "RED" || alert.severity === "CRITICAL" ? "text-red-500" : "text-amber-500"}`}>{alert.severity}</span>
                  </div>
                  <div className="font-black text-white mb-1">{alert.region}</div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FIRE SERVICE CARD */}
          <div className="os-card">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-xl font-black text-white">State Fire Service</h3>
              <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-500/20">Live Stream</span>
            </div>
            <div className="space-y-4">
              {data.fire.alerts.map(alert => (
                <div key={alert.id} className={`p-5 rounded-2xl border ${alert.severity === "CRITICAL" ? "bg-red-500/5 border-red-500/10" : "bg-indigo-500/5 border-indigo-500/10"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === "CRITICAL" ? "text-red-500" : "text-indigo-400"}`}>{alert.type}</span>
                    <span className={`text-[10px] font-black ${alert.severity === "CRITICAL" ? "text-red-500" : "text-indigo-400"}`}>{alert.severity}</span>
                  </div>
                  <div className="font-black text-white mb-1">{alert.location}</div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: NDMA Protocols */}
        <div className="lg:col-span-5 space-y-8">
          <div className="os-card h-full">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-xl font-black text-white">NDMA Command Protocol</h3>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">Verified</span>
            </div>
            <div className="space-y-8">
              {data.ndma.activeGuidelines.map((g, i) => (
                <div key={i} className="space-y-4">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">{g.disaster} DIRECTIVE</div>
                  <div className="grid gap-2">
                    {g.steps.map((step, si) => (
                      <div key={si} className="flex gap-3 text-xs font-bold text-slate-300 bg-slate-900 p-4 rounded-xl border border-white/5">
                         <span className="text-indigo-500">◈</span>
                         {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-12 p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                 <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Strategic Hotlines</div>
                 <div className="space-y-2">
                   {Object.entries(data.ndma.emergencyContacts).map(([name, num]) => (
                     <div key={name} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-tight">{name.replace(/_/g, " ")}</span>
                       <span className="text-sm font-black text-white tabular-nums">{num}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
