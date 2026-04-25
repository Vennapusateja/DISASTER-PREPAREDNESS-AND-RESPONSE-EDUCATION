import React, { useState, useEffect } from "react";
import { apiJson } from "../services/api.js";

export default function UserProfileModal({ user, isOpen, onClose, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("identity");
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...form, name: user?.name || "", email: user?.email || "" });
      fetchActivity();
    }
  }, [isOpen, user]);

  async function fetchActivity() {
    try {
      const data = await apiJson("/api/users/profile/activity");
      setActivity(data.activity || []);
    } catch {}
  }

  if (!isOpen || !user) return null;

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true); setStatus(null);
    try {
      await apiJson("/api/users/profile/update", { method: "PUT", body: { name: form.name, email: form.email } });
      setStatus({ type: "success", msg: "Profile credentials synchronized." });
      onUpdateUser();
    } catch (err) { setStatus({ type: "error", msg: err.message }); }
    finally { setLoading(false); }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return setStatus({ type: "error", msg: "Keys do not match." });
    setLoading(true); setStatus(null);
    try {
      await apiJson("/api/users/change-password", { method: "PUT", body: form });
      setStatus({ type: "success", msg: "Security key rotated successfully." });
      setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { setStatus({ type: "error", msg: err.message }); }
    finally { setLoading(false); }
  }

  const level = Math.floor(user.points / 1000) + 1;
  const progress = (user.points % 1000) / 10;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-8 animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
      
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[800px] glass rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden animate-fade-in">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-slate-900 border-r border-white/5 flex flex-col p-8 lg:p-10">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-500/20">{user.name[0].toUpperCase()}</div>
            <div className="text-xl font-black text-white">{user.name}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Level {level} Specialist</div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: "identity", label: "Identity Station", icon: "👤" },
              { id: "activity", label: "Mission Logs", icon: "📊" },
              { id: "security", label: "Security Keys", icon: "🔐" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button className="mt-10 py-4 rounded-2xl bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all" onClick={onClose}>Exit Terminal</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-slate-950/40">
          {activeTab === "identity" && (
            <div className="space-y-12 animate-fade-in">
              <section>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Responder Progress</div>
                <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-sm font-black text-slate-400">Current Intelligence Level</div>
                      <div className="text-3xl font-black text-white mt-1">Tier {level} Specialist</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-indigo-400 uppercase tracking-widest">{user.points} Total XP</div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Next Tier: {1000 - (user.points % 1000)} XP</div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Credentials Management</div>
                <form onSubmit={updateProfile} className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Personnel Display Name</label>
                        <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Communication Port</label>
                        <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                      </div>
                   </div>
                   <button className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-95 transition-all" disabled={loading}>{loading ? "Synchronizing..." : "Authorize Identity Update"}</button>
                </form>
              </section>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Activity History</div>
              <div className="space-y-3">
                {activity.length > 0 ? activity.map((a, i) => (
                  <div key={i} className="flex items-center gap-5 p-5 bg-slate-900/40 border border-white/5 rounded-[1.5rem] group hover:border-white/10 transition-all">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${a.type === 'quiz' ? 'bg-amber-500/10 text-amber-500' : a.type === 'simulation' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {a.type === 'quiz' ? '🎖️' : a.type === 'simulation' ? '🎮' : '⚡'}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-white">{a.title}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">{new Date(a.date).toLocaleDateString()} at {new Date(a.date).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-black ${a.score >= 80 ? 'text-emerald-400' : 'text-white'}`}>{a.score}{a.type === 'quiz' ? '%' : ' XP'}</div>
                      <div className="text-[10px] text-slate-600 font-black uppercase">Result</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-50">
                    <div className="text-6xl mb-6">📡</div>
                    <div className="font-black uppercase text-sm tracking-widest">No mission data detected</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Hardening</div>
                <h2 className="text-2xl font-black text-white">Rotate Authorization Keys</h2>
                <p className="text-slate-500 text-sm font-medium mt-2">Ensure your responder terminal remains secure with regular key rotation.</p>
              </div>

              <form onSubmit={changePassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Secure Key</label>
                  <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800 font-bold" type="password" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} placeholder="••••••••" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Deployment Key</label>
                    <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800 font-bold" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} placeholder="Min 8 chars" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Key</label>
                    <input className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-800 font-bold" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="••••••••" required />
                  </div>
                </div>
                <button className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-95 transition-all mt-6" disabled={loading}>{loading ? "Processing Rotation..." : "Commit Security Update"}</button>
              </form>
            </div>
          )}

          {status && (
            <div className={`mt-10 p-5 rounded-2xl text-sm font-black text-center border animate-bounce ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
