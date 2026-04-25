import React, { useEffect, useState } from "react";
import { apiJson, adminApi } from "../services/api.js";

export default function AdminAlerts({ token }) {
  const [form, setForm] = useState({ title: "EMERGENCY BROADCAST", message: "", severity: "High", sms: { enabled: false } });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getAlertStats(token);
      setMetrics(data);
    } catch (err) { console.error("Failed to fetch alert stats:", err); }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  async function send() {
    if (!form.message) return alert("Please enter an alert message.");
    setLoading(true); setStatus(null);
    try {
      await apiJson("/api/alerts/broadcast", { method: "POST", body: form, token });
      setStatus({ type: "success", msg: "Alert broadcasted successfully." });
      setForm({ ...form, message: "" });
      fetchStats();
    } catch (err) { setStatus({ type: "error", msg: err.message }); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Emergency Broadcast</h1>
        <p className="text-slate-400 font-medium mt-2">Deploy real-time tactical notifications to the active responder fleet.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Broadcast Form */}
        <div className="lg:col-span-7">
          <div className="os-card h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-2xl border border-red-500/20 shadow-lg shadow-red-500/5">📢</div>
              <h2 className="text-xl font-black text-white">System Broadcast</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Severity Protocol</label>
                <select className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white font-black focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
                  <option value="Low">LOW ADVISORY</option>
                  <option value="Medium">MEDIUM WARNING</option>
                  <option value="High">HIGH ALERT</option>
                  <option value="Critical">CRITICAL EMERGENCY</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Message Payload</label>
                <textarea className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700 min-h-[160px] resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Enter emergency deployment instructions..." />
              </div>
              
              <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-5 group">
                 <input type="checkbox" className="w-6 h-6 rounded-lg bg-slate-800 border-white/10 text-indigo-500 focus:ring-indigo-500 cursor-pointer" checked={form.sms.enabled} onChange={e => setForm({...form, sms: {...form.sms, enabled: e.target.checked}})} />
                 <div className="flex-1">
                    <div className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">SMS MULTIPLEXING</div>
                    <div className="text-[10px] text-slate-500 font-medium">Broadcast via cellular network to all registered devices.</div>
                 </div>
              </div>

              {status && (
                <div className={`p-4 rounded-xl text-xs font-black text-center border animate-bounce ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {status.msg}
                </div>
              )}
              
              <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${form.message ? "bg-red-500 text-white shadow-xl shadow-red-500/20 hover:scale-[1.01] active:scale-95" : "bg-slate-800 text-slate-600 cursor-not-allowed"}`} onClick={send} disabled={loading || !form.message}>
                {loading ? "TRANSMITTING DATA..." : "🚀 INITIATE BROADCAST"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats & History */}
        <div className="lg:col-span-5 space-y-8">
          <div className="os-card">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Alert Intelligence</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
                   <div className="text-3xl font-black text-white mb-1">{metrics?.summary?.totalAlerts || 0}</div>
                   <div className="text-[9px] font-black text-slate-500 uppercase">Alerts Sent</div>
                </div>
                <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl">
                   <div className="text-3xl font-black text-white mb-1">{metrics?.summary?.avgAckRate || 0}%</div>
                   <div className="text-[9px] font-black text-slate-500 uppercase">Avg Ack Rate</div>
                </div>
            </div>
          </div>

          <div className="os-card overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-2">Dispatch History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border-y border-white/5">
                    <th className="px-4 py-3">Alert Title</th>
                    <th className="px-4 py-3 text-right">Severity</th>
                    <th className="px-4 py-3 text-right">Ack%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {metrics?.alerts.length > 0 ? metrics?.alerts.map(a => (
                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4 text-xs font-black text-white">{a.title}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${a.severity === "Critical" ? "badge-critical" : a.severity === "High" ? "badge-high" : a.severity === "Medium" ? "badge-medium" : "badge-low"}`}>{a.severity}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-black text-indigo-400 text-xs">{a.rate}%</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-xs font-bold text-slate-600 uppercase tracking-widest">No history recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

