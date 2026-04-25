import React from "react";
import { apiJson } from "../services/api.js";

const SEVERITY_CONFIG = {
  Critical: { 
    bg: "bg-red-950/90", 
    border: "border-red-500", 
    text: "text-red-500", 
    glow: "shadow-red-500/20",
    icon: "🚨", 
    label: "CRITICAL SYSTEM ALERT" 
  },
  High: { 
    bg: "bg-orange-950/90", 
    border: "border-orange-500", 
    text: "text-orange-500", 
    glow: "shadow-orange-500/20",
    icon: "🔥", 
    label: "HIGH SEVERITY ALERT" 
  },
  Medium: { 
    bg: "bg-amber-950/90", 
    border: "border-amber-500", 
    text: "text-amber-500", 
    glow: "shadow-amber-500/20",
    icon: "⚠️", 
    label: "OPERATIONAL WARNING" 
  },
  Low: { 
    bg: "bg-blue-950/90", 
    border: "border-blue-500", 
    text: "text-blue-500", 
    glow: "shadow-blue-500/20",
    icon: "ℹ️", 
    label: "SYSTEM ADVISORY" 
  }
};

export default function AlertBanner({ alert, onClose }) {
  const [loading, setLoading] = React.useState(false);

  if (!alert) return null;

  const config = SEVERITY_CONFIG[alert.severity] || { 
    bg: "bg-slate-900/90", 
    border: "border-slate-500", 
    text: "text-slate-500", 
    glow: "shadow-slate-500/20",
    icon: "🔔", 
    label: "NOTIFICATION" 
  };

  async function acknowledge() {
    if (!alert.id) { onClose(); return; }
    setLoading(true);
    try {
      await apiJson(`/api/alerts/${alert.id}/acknowledge`, { method: "POST" });
      onClose();
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`
      sticky top-0 z-[5000] mb-8 animate-slide-down
      ${config.bg} backdrop-blur-xl border-b-2 ${config.border} ${config.glow} shadow-2xl
      lg:rounded-b-[2rem] lg:mx-auto lg:max-w-4xl
    `}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 lg:px-10">
        <div className="flex items-center gap-6">
          <div className="text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{config.icon}</div>
          <div>
            <div className={`text-[10px] font-black tracking-[0.2em] mb-1.5 ${config.text}`}>{config.label}</div>
            <div className="text-sm md:text-lg font-black text-white leading-tight">{alert.message}</div>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <button
            onClick={acknowledge}
            disabled={loading}
            className={`
              w-full md:w-auto px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all
              bg-white text-slate-950 hover:bg-slate-200 active:scale-95 disabled:opacity-50 shadow-xl
            `}
          >
            {loading ? "PROCESSING..." : "ACKNOWLEDGE"}
          </button>
        </div>
      </div>
    </div>
  );
}
