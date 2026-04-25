import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { apiJson, getToken, setToken } from "./services/api.js";

import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import Simulators from "./pages/Simulators.jsx";
import AlertBanner from "./components/AlertBanner.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import FloodRouteMap from "./pages/FloodRouteMap.jsx";
import AdminAlerts from "./pages/AdminAlerts.jsx";
import AdminExternal from "./pages/AdminExternal.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AdvancedPredictor from "./pages/AdvancedPredictor.jsx";
import UserProfileModal from "./components/UserProfileModal.jsx";

function Layout({ token, user, onLogout, alert, onCloseAlert, onUpdateUser, children }) {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [width, setWidth] = React.useState(window.innerWidth);
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    setSidebarOpen(false);
    // Scroll content area back to top on every page change
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname]);

  if (!token) return children;

  const isMobile = width <= 1024;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1999] animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-white/5 p-6 flex flex-col z-[2000] transition-transform duration-400 ease-in-out
        ${isMobile ? (isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full") : "translate-x-0"}
      `}>
        <Link to="/" className="flex items-center gap-3 mb-10 no-underline group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-md animate-pulse" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform">OS</div>
          </div>
          <div>
            <div className="text-xl font-black tracking-tight gradient-text leading-none">DISASTER.OS</div>
            <div className="text-[9px] text-indigo-400/60 font-black uppercase tracking-[0.2em] mt-0.5">Command System</div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto space-y-8">
          <section>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3 mb-4">Command Station</div>
            <div className="space-y-1">
              <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/dashboard" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-indigo-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">C</span> COMMAND CENTER</Link>
              <Link to="/simulations" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/simulations" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-emerald-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">S</span> OPERATIONAL SIMS</Link>
              <Link to="/predictor" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/predictor" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-purple-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">R</span> QUANTUM RISK</Link>
              <Link to="/quiz" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/quiz" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-amber-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">Q</span> CERTIFICATION</Link>
              <Link to="/maps" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/maps" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-rose-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">M</span> EVACUATION MAP</Link>
            </div>
          </section>

          {(user?.role === "faculty" || user?.role === "admin") && (
            <section>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3 mb-4">Intelligence</div>
              <div className="space-y-1">
                <Link to="/faculty/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname === "/faculty/dashboard" ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-blue-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">F</span> FACULTY HQ</Link>
              </div>
            </section>
          )}

          {user?.role === "admin" && (
            <section>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3 mb-4">Administration</div>
              <div className="space-y-1">
                <Link to="/admin/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname.startsWith("/admin/analytics") ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-indigo-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">A</span> ANALYTICS</Link>
                <Link to="/admin/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname.startsWith("/admin/reports") ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-slate-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">R</span> REPORTS</Link>
                <Link to="/admin/alerts" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname.startsWith("/admin/alerts") ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-red-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">!</span> ALERTS</Link>
                <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${location.pathname.startsWith("/admin/users") ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span class="w-4 h-4 bg-teal-500/30 rounded flex-shrink-0 flex items-center justify-center text-[10px]">U</span> USERS</Link>
              </div>
            </section>
          )}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div onClick={() => setShowProfile(true)} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
             <div className="w-11 h-11 rounded-xl bg-indigo-500 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">{user?.name?.[0].toUpperCase()}</div>
             <div className="flex-1 overflow-hidden">
                <div className="text-sm font-black truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-500 uppercase font-black">{user?.role}</div>
             </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-black text-xs hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/10 transition-all tracking-widest border border-red-500/10 hover:border-red-500/30" onClick={onLogout}>DISCONNECT SYSTEM</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-white/5 sticky top-0 z-[1000]">
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-sm font-black" onClick={() => setSidebarOpen(true)}>Menu</button>
          <Link to="/" className="text-lg font-black gradient-text">DISASTER.OS</Link>
          <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-xl" onClick={() => { if (alert) onCloseAlert(); }}>🔔{alert && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />}</button>
        </header>

        <main ref={mainRef} className="flex-1 p-6 lg:p-10 bg-slate-950 overflow-y-auto">
          <AlertBanner alert={alert} onClose={onCloseAlert} />
          <UserProfileModal user={user} isOpen={showProfile} onClose={() => setShowProfile(false)} onUpdateUser={onUpdateUser} />
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}>
      <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(99,102,241,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.07) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/40">OS</div>
          <span className="font-black text-white tracking-widest text-sm uppercase">Disaster<span className="text-indigo-400">.OS</span></span>
        </div>
        <h1 className="text-4xl font-black text-white leading-tight mb-4">Prepare.<br/><span className="gradient-text">Respond.</span><br/>Survive.</h1>
        <p className="text-slate-400 font-medium leading-relaxed max-w-xs text-sm">The world-class disaster preparedness platform trusted by emergency response agencies globally.</p>
      </div>
      <div className="relative z-10 space-y-3">
        {[{icon:'⚡',label:'Real-time Threat Assessment'},{icon:'🎯',label:'Scenario-based Training'},{icon:'📊',label:'Live Performance Analytics'},{icon:'🌍',label:'Multi-hazard Coverage'}].map(f=>(
          <div key={f.label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm flex-shrink-0">{f.icon}</div>
            <span className="text-slate-300 font-bold text-sm">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Register({ onAuthed }) {
  const nav = useNavigate();
  const [form, setForm] = React.useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = React.useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await apiJson("/api/auth/register", { method: "POST", body: form });
      onAuthed(data.token);
      nav("/dashboard");
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
      <AuthBrandPanel />
      <div className="flex items-center justify-center px-8 py-6 lg:px-12 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">New Account</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-1 leading-tight">Join the <span className="gradient-text">Response Network</span></h2>
            <p className="text-slate-500 font-medium text-sm">Start your disaster preparedness journey today.</p>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@agency.gov" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Create a strong password" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Role</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium text-sm" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="student" className="bg-slate-900">Student Responder</option>
                <option value="faculty" className="bg-slate-900">Faculty Command</option>
                <option value="admin" className="bg-slate-900">System Admin</option>
              </select>
            </div>
            {error && <div className="text-red-400 text-xs font-bold p-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
            <button className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all tracking-wide">Create Account</button>
          </form>
          <p className="text-center text-slate-500 text-sm font-medium mt-5">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

function Login({ onAuthed }) {
  const nav = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiJson('/api/auth/login', { method: 'POST', body: form });
      onAuthed(data.token);
      nav('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
      <AuthBrandPanel />
      <div className="flex items-center justify-center px-8 py-6 lg:px-12 relative">
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Secure Terminal</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-1 leading-tight">Welcome <span className="gradient-text">Back, Responder</span></h2>
            <p className="text-slate-500 font-medium text-sm">Sign in to access your command dashboard.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@agency.gov" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password" required />
            </div>
            {error && <div className="text-red-400 text-xs font-bold p-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
            <button disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all tracking-wide disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm font-medium mt-6">No account yet? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [token, setTokenState] = React.useState(() => getToken());
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(null);

  const updateToken = (t) => { setToken(t); setTokenState(t); };

  const fetchProfile = React.useCallback(async (t) => {
    if (!t) { setUser(null); setLoading(false); return; }
    try {
      const userData = await apiJson("/api/auth/me", { token: t });
      setUser(userData.user);
      
      const alertData = await apiJson("/api/alerts/pending", { token: t });
      if (alertData.alerts?.length > 0) setAlert(alertData.alerts[0]);
    } catch { updateToken(null); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchProfile(token); }, [token, fetchProfile]);

  React.useEffect(() => {
    if (!token) return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const backendHost = import.meta.env.VITE_WS_URL || "localhost:5000";
    const ws = new WebSocket(`${protocol}//${backendHost}/ws`);

    ws.onmessage = (e) => {
       try {
         const data = JSON.parse(e.data);
         if (data.type === "alert") setAlert(data);
       } catch (err) { console.error("WS Message Error:", err); }
    };

    return () => ws.close();
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-white font-black tracking-widest text-sm animate-pulse">SYNCHRONIZING DISASTER.OS...</div>;


  return (
    <BrowserRouter>
      <Layout token={token} user={user} onLogout={() => updateToken(null)} alert={alert} onCloseAlert={() => setAlert(null)} onUpdateUser={() => fetchProfile(token)}>
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login onAuthed={updateToken} />} />
          <Route path="/register" element={<Register onAuthed={updateToken} />} />
          <Route path="/dashboard" element={<ProtectedRoute token={token}><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/simulations" element={<ProtectedRoute token={token}><Simulators onUpdateUser={() => fetchProfile(token)} /></ProtectedRoute>} />
          <Route path="/predictor" element={<ProtectedRoute token={token}><AdvancedPredictor /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute token={token}><Quiz token={token} onUpdateUser={() => fetchProfile(token)} /></ProtectedRoute>} />
          <Route path="/maps" element={<ProtectedRoute token={token}><FloodRouteMap token={token} /></ProtectedRoute>} />
          
          <Route path="/faculty/dashboard" element={<ProtectedRoute token={token} roleRequired="faculty" userRole={user?.role}><FacultyDashboard token={token} /></ProtectedRoute>} />
          
          <Route path="/admin/*" element={<ProtectedRoute token={token} roleRequired="admin" userRole={user?.role}><AdminPanel token={token} /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children, token, roleRequired, userRole }) {
  if (!token) return <Navigate to="/login" replace />;
  if (roleRequired && userRole !== roleRequired && userRole !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminPanel({ token }) {
  return (
    <div>
      <Routes>
        <Route path="analytics" element={<AdminAnalytics token={token} />} />
        <Route path="reports" element={<AdminReports token={token} />} />
        <Route path="users" element={<AdminUsers token={token} />} />
        <Route path="alerts" element={<AdminAlerts token={token} />} />
        <Route path="external" element={<AdminExternal token={token} />} />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);



