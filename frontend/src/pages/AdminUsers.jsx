import React from "react";
import { apiJson } from "../services/api.js";

const ROLE_STYLE = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  faculty: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function AdminUsers({ token }) {
  const [users, setUsers] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [changingRole, setChangingRole] = React.useState(null);
  const [status, setStatus] = React.useState(null);

  const load = () => apiJson("/api/admin/users").then(data => setUsers(data.users));
  React.useEffect(() => { load(); }, []);

  async function changeRole(userId, newRole) {
    setChangingRole(userId);
    setStatus(null);
    try {
      await apiJson(`/api/admin/users/${userId}/role`, { method: "PATCH", body: { role: newRole }, token });
      setStatus({ type: "success", msg: `Role updated to ${newRole}` });
      load();
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setChangingRole(null);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  const filtered = (users || []).filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Access Control</h1>
        <p className="text-slate-400 font-medium mt-2">Manage personnel clearance and mission proficiency across the agency.</p>
      </header>

      {status && (
        <div className={`p-4 rounded-2xl text-xs font-black text-center border animate-fade-in ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {status.type === "success" ? "✓" : "✗"} {status.msg}
        </div>
      )}

      <div className="os-card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl border border-indigo-500/20">👥</div>
            <div>
              <h2 className="text-xl font-black">Registered Personnel</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{filtered.length} of {users?.length || 0} shown</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 w-full sm:w-56"
              placeholder="🔍 Search personnel..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {!users ? (
          <div className="space-y-3 px-2 pb-4">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-3xl">🔍</div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest">No personnel match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-y border-white/5">
                  <th className="px-6 py-4">Responder Identity</th>
                  <th className="px-6 py-4">Operational Email</th>
                  <th className="px-6 py-4">Command Role</th>
                  <th className="px-6 py-4 text-right">Expertise (XP)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(u => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-indigo-400 group-hover:scale-110 transition-transform">{u.name[0].toUpperCase()}</div>
                        <span className="font-black text-white text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">{u.email}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${ROLE_STYLE[u.role] || "bg-slate-700 text-slate-400 border-white/10"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-white text-sm">{u.points?.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {["student", "faculty", "admin"].filter(r => r !== u.role).map(r => (
                          <button
                            key={r}
                            disabled={changingRole === u.id}
                            onClick={() => changeRole(u.id, r)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 disabled:opacity-40 ${ROLE_STYLE[r]}`}
                          >
                            → {r}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
