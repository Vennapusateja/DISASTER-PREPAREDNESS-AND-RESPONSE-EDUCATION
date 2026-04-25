import React from "react";
import { apiJson } from "../services/api.js";

export default function AdvancedPredictor() {
  const [inputs, setInputs] = React.useState({
    temperature: "",
    buildingType: "Concrete",
    rainfall: "",
    populationDensity: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const predict = async () => {
    const disasterTypes = [];
    if (inputs.temperature !== "") disasterTypes.push("Fire");
    if (inputs.rainfall !== "") disasterTypes.push("Flood");
    if (inputs.populationDensity !== "") disasterTypes.push("Earthquake");

    if (disasterTypes.length === 0) return alert("Fill at least one hazard section.");

    setLoading(true);
    try {
      const data = await apiJson("/api/predictions/evaluate", {
        method: "POST",
        body: { disasterTypes, ...inputs }
      });
      setResult(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Analytic Risk Engine</h1>
        <p className="text-slate-400 font-medium mt-2">Quantum environmental telemetry modeling for cross-hazard threat assessment.</p>
      </header>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="os-card space-y-6">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-4">🔥 Thermal Dynamics</div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Ambient Temperature (C)</label>
              <input type="number" value={inputs.temperature} onChange={e => setInputs({...inputs, temperature: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. 42" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Structural Integrity</label>
              <select value={inputs.buildingType} onChange={e => setInputs({...inputs, buildingType: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option>Concrete</option><option>Old Masonry</option><option>Slum</option><option>Wood</option>
              </select>
            </div>
          </div>
        </div>

        <div className="os-card space-y-6">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-4">💧 Hydro Metrics</div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Precipitation Rate (mm/h)</label>
            <input type="number" value={inputs.rainfall} onChange={e => setInputs({...inputs, rainfall: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. 15" />
          </div>
        </div>

        <div className="os-card space-y-6 md:col-span-2 lg:col-span-1">
          <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest border-b border-white/5 pb-4">🌍 Seismic Density</div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Personnel Concentration (p/km2)</label>
            <input type="number" value={inputs.populationDensity} onChange={e => setInputs({...inputs, populationDensity: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. 5000" />
          </div>
        </div>
      </div>

      <button className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest" onClick={predict} disabled={loading}>
        {loading ? "Processing Operational Data..." : "Generate Risk Assessment Model"}
      </button>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-5 space-y-6">
            {/* Radial Threat Gauge */}
            <div className="os-card flex flex-col items-center py-8">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Threat Level Gauge</div>
              {(() => {
                const isHigh = result.assessment.riskLevel === "HIGH";
                const score = isHigh ? 82 : 28;
                const r = 64;
                const circ = 2 * Math.PI * r;
                const dash = (score / 100) * circ * 0.75;
                const gaugeColor = isHigh ? "#ef4444" : "#10b981";
                const glowColor  = isHigh ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)";
                return (
                  <div className="relative w-48 h-36 flex items-center justify-center">
                    <svg width="192" height="148" viewBox="0 0 192 148" className="absolute">
                      <circle cx="96" cy="96" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"
                        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
                        strokeDashoffset={circ * 0.125}
                        strokeLinecap="round"
                      />
                      <circle cx="96" cy="96" r={r} fill="none" stroke={gaugeColor} strokeWidth="10"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeDashoffset={circ * 0.125}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 8px ${glowColor})`, transition: "stroke-dasharray 1s ease" }}
                      />
                    </svg>
                    <div className="z-10 text-center">
                      <div className={`text-3xl font-black ${isHigh ? "text-red-400" : "text-emerald-400"}`}>{score}%</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isHigh ? "text-red-500" : "text-emerald-500"}`}>{isHigh ? "HIGH" : "LOW"} RISK</div>
                    </div>
                  </div>
                );
              })()}
              <div className="flex gap-4 mt-4">
                {["LOW","MED","HIGH"].map((l, i) => (
                  <div key={l} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-1.5 rounded-full ${i === 0 ? "bg-emerald-500" : i === 1 ? "bg-amber-500" : "bg-red-500"}`} />
                    <span className="text-[9px] font-black text-slate-600 uppercase">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="os-card">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-lg">📈</div>
                 Hazard Vectors
              </h3>
              <div className="space-y-3">
                {result.individualRisks.map(ir => (
                  <div key={ir.type} className={`flex justify-between items-center p-4 rounded-2xl border ${ir.level === "HIGH" ? "bg-red-500/5 border-red-500/10" : "bg-emerald-500/5 border-emerald-500/10"}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{ir.type} Hazard</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${ir.level === "HIGH" ? "badge-critical" : "badge-low"}`}>{ir.level}</span>
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${ir.level === "HIGH" ? "bg-red-500 shadow-red-500" : "bg-emerald-500 shadow-emerald-500"}`} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 p-6 rounded-2xl border-l-4 ${result.assessment.riskLevel === "HIGH" ? "bg-red-500/10 border-l-red-500 border-white/5" : "bg-emerald-500/10 border-l-emerald-500 border-white/5"}`}>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Aggregated Threat Rating</div>
                <div className={`text-3xl font-black mb-4 ${result.assessment.riskLevel === "HIGH" ? "text-red-400" : "text-emerald-400"}`}>
                  {result.assessment.riskLevel} CRITICALITY
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{result.assessment.explanation}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="os-card h-full">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-lg">🛡️</div>
                 Tactical Guidance
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Immediate Mitigation Protocols</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.assessment.suggestedPrecautions.map((p, i) => (
                      <div key={i} className="p-4 bg-slate-800/30 rounded-xl border-l-2 border-indigo-500 text-xs font-bold text-slate-300 leading-relaxed">{p}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Command Directive</div>
                  <div className="p-5 bg-slate-900 rounded-2xl border border-white/5 text-sm text-slate-400 font-medium leading-relaxed">
                    Initiate operational level {result.assessment.riskLevel === "HIGH" ? "ALPHA (CRITICAL)" : "BRAVO (STABLE)"}. Secure all local communication grids and monitor for secondary hazard formation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
