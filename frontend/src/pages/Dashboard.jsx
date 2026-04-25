import React from "react";
import { useNavigate } from "react-router-dom";
import { apiJson } from "../services/api.js";

function TacticalCard({ module }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(module.p)}
      className="flex flex-col p-4 bg-slate-800/40 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer group"
    >
      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform origin-left">{module.i}</div>
      <div className="font-black text-sm mb-1 text-white">{module.t}</div>
      <p className="text-xs text-slate-500 font-medium flex-1 mb-4">{module.d}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Launch</span>
        <span className="text-slate-600 group-hover:text-indigo-400 transition-colors text-sm">→</span>
      </div>
    </div>
  );
}

function rankMedal(i) {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return null;
}

function GlobalStatsModal({ leaderboard, user, onClose }) {
  if (!leaderboard) return null;

  const totalResponders = leaderboard.length;
  const topScore = leaderboard[0]?.points ?? 0;
  const avgXP = totalResponders
    ? Math.round(leaderboard.reduce((s, u) => s + (u.points || 0), 0) / totalResponders)
    : 0;
  const myRank = leaderboard.findIndex(u => u.id === user.id) + 1;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-xl border border-amber-500/20">🌐</div>
            <div>
              <h2 className="text-xl font-black text-white">Global Stats</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Full Leaderboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-lg font-black"
          >✕</button>
        </div>

        <div className="grid grid-cols-3 gap-3 px-8 py-4">
          {[
            { label: "Responders", value: totalResponders, color: "indigo" },
            { label: "Top XP", value: topScore.toLocaleString(), color: "amber" },
            { label: "Avg XP", value: avgXP.toLocaleString(), color: "emerald" },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/60 rounded-2xl p-4 border border-white/5 text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {myRank > 0 && (
          <div className="mx-8 mb-4 px-5 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Your Global Rank</span>
            <span className="text-lg font-black text-white">#{myRank} <span className="text-slate-500 text-xs font-bold">of {totalResponders}</span></span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-8 pb-8 space-y-2">
          {leaderboard.map((u, i) => {
            const medal = rankMedal(i);
            const isMe = u.id === user.id;
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isMe
                    ? "bg-indigo-500/10 border-indigo-500/20"
                    : "bg-white/[0.02] border-transparent hover:border-white/5"
                }`}
              >
                <div className="w-7 text-center">
                  {medal
                    ? <span className="text-xl">{medal}</span>
                    : <span className={`text-sm font-black ${isMe ? "text-indigo-400" : "text-slate-600"}`}>#{i + 1}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-black truncate ${isMe ? "text-indigo-300" : "text-white"}`}>
                    {u.name} {isMe && <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest ml-1">(you)</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                    Lv {Math.floor((u.points || 0) / 1000) + 1} Specialist
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${i === 0 ? "text-amber-400" : isMe ? "text-indigo-300" : "text-white"}`}>
                    {u.points?.toLocaleString()} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EliteRankings({ leaderboard, user }) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      {showModal && (
        <GlobalStatsModal leaderboard={leaderboard} user={user} onClose={() => setShowModal(false)} />
      )}
      <div className="os-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-xl border border-amber-500/20">🏆</div>
            <h2 className="text-lg font-black">Elite Rankings</h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 transition-all uppercase"
          >
            🌐 View All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {leaderboard?.slice(0, 6).map((u, i) => (
            <div key={u.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${u.id === user.id ? "bg-indigo-500/10 border-indigo-500/20" : "bg-white/[0.02] border-white/5"}`}>
              <div className={`text-base font-black w-5 flex-shrink-0 ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-700" : "text-slate-600"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-black truncate ${u.id === user.id ? "text-indigo-400" : "text-white"}`}>{u.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{(u.points || 0).toLocaleString()} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Dashboard({ user }) {
  const [leaderboard, setLeaderboard] = React.useState(null);
  const [activity, setActivity] = React.useState(null);
  const [showBadges, setShowBadges] = React.useState(false);

  React.useEffect(() => {
    apiJson("/api/admin/leaderboard").then(data => setLeaderboard(data.leaderboard)).catch(() => {});
    apiJson("/api/analytics/overview").then(data => {
      const recentItems = [];
      (data.recentDrills || []).slice(0, 3).forEach(d => recentItems.push({ type: "drill", label: `${d.drillType || "Drill"} Simulation`, score: d.score, date: d.createdAt, icon: "🎮", color: "indigo" }));
      (data.recentQuizzes || []).slice(0, 3).forEach(q => recentItems.push({ type: "quiz", label: q.title || "Certification Quiz", score: q.score, date: q.createdAt, icon: "🎖️", color: "amber" }));
      recentItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivity(recentItems.slice(0, 5));
    }).catch(() => setActivity([]));
  }, []);

  if (!user) return null;

  const BADGE_ICONS = { "🔥": "Fire", "🌊": "Flood", "🌍": "Earthquake", "🎖️": "Medal", "⭐": "Star" };

  return (
    <div className="animate-fade-in space-y-10">
      {/* Badges Modal */}
      {showBadges && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4" style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setShowBadges(false)}>
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl animate-fade-in p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-xl border border-amber-500/20">🏅</div>
                <div>
                  <h2 className="text-xl font-black text-white">Badge Collection</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.badges?.length || 0} Earned</p>
                </div>
              </div>
              <button onClick={() => setShowBadges(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-lg font-black">✕</button>
            </div>
            {user.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.badges.map((b, i) => (
                  <span key={i} className="px-4 py-2 bg-amber-500/10 text-amber-400 text-xs font-black rounded-xl border border-amber-500/20 uppercase tracking-wider flex items-center gap-2">🎖️ {b}</span>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🏅</div>
                <p className="text-slate-500 font-black uppercase text-xs tracking-widest">No badges earned yet. Complete quizzes to earn badges!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Command Center</h1>
        <p className="text-slate-400 font-medium mt-2">Operational Sector Status: <span className="text-emerald-400 font-bold">ACTIVE</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="os-card border-l-4 border-l-indigo-500">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Personnel XP</div>
          <div className="text-4xl font-black text-white">{user.points?.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-500 mt-4 flex items-center gap-1">
            <span className="text-indigo-400 font-black">Lv {Math.floor((user.points || 0) / 1000) + 1}</span>
            <span className="text-slate-600 font-medium">— {1000 - ((user.points || 0) % 1000)} XP to next level</span>
          </div>
        </div>

        <div className="os-card border-l-4 border-l-emerald-500">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Certification Level</div>
          <div className="text-4xl font-black text-white">Tier {Math.floor((user.points || 0) / 1000) + 1}</div>
          <div className="flex gap-1.5 mt-5">
            {[1,2,3,4,5].map(i => {
              const currentTier = Math.floor((user.points || 0) / 1000) + 1;
              return <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= currentTier ? "bg-emerald-500" : "bg-white/10"}`} />;
            })}
          </div>
        </div>

        <div className="os-card border-l-4 border-l-amber-500 md:col-span-2 lg:col-span-1 cursor-pointer group" onClick={() => setShowBadges(true)}>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Specialist Badges</div>
          <div className="text-4xl font-black text-white">{user.badges?.length || 0}</div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {user.badges?.slice(0, 3).map((b, i) => (
              <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-lg border border-amber-500/20 uppercase tracking-wider">{b}</span>
            ))}
            {(user.badges?.length || 0) > 3 && (
              <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black rounded-lg border border-white/10">+{user.badges.length - 3} more</span>
            )}
            {(user.badges?.length || 0) === 0 && (
              <span className="text-[10px] text-slate-600 font-bold">Click to view collection</span>
            )}
          </div>
        </div>
      </div>

      {/* Full-width: Tactical Deployment + Recent Activity in one card */}
      <div className="os-card space-y-8">

        {/* Tactical Deployment */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-xl border border-indigo-500/20">🛰️</div>
            <h2 className="text-lg font-black">Tactical Deployment</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Simulated Scenarios", d: "High-fidelity disaster drills.", i: "🎮", p: "/simulations" },
              { t: "Risk Prediction", d: "Quantum data analysis.", i: "🧠", p: "/predictor" },
              { t: "Certification", d: "Verified skills assessment.", i: "🎖️", p: "/quiz" },
              { t: "Fleet Map", d: "Resource & route tracking.", i: "🗺️", p: "/maps" }
            ].map(m => (
              <TacticalCard key={m.t} module={m} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-xl border border-emerald-500/20">📋</div>
            <h2 className="text-lg font-black">Recent Activity</h2>
          </div>
          {activity === null ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : activity.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded-3xl flex items-center justify-center text-2xl">📭</div>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">No activity yet. Start a drill or quiz!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-${item.color}-500/10 border border-${item.color}-500/20 flex-shrink-0`}>{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-white truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`text-sm font-black flex-shrink-0 ${item.score >= 70 ? "text-emerald-400" : "text-amber-400"}`}>{item.score}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Elite Rankings — full width below */}
      <EliteRankings leaderboard={leaderboard} user={user} />
    </div>
  );
}
