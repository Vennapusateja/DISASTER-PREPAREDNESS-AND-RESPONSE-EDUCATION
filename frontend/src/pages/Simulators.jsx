import React from "react";
import { apiJson } from "../services/api.js";

const SCENARIOS = {
  fire: {
    steps: [
      { q: "A fire starts in a waste bin. What is your immediate action?", options: [{ t: "Use water bucket", c: false, f: "Water may spread some chemical or oil fires." }, { t: "Use Class A fire extinguisher", c: true, f: "Correct. Class A is for ordinary combustibles." }] },
      { q: "The fire spreads to a computer. Choice?", options: [{ t: "Unplug and use CO2 extinguisher", c: true, f: "Correct. Use electrical-safe suppression." }, { t: "Use wet blanket", c: false, f: "High risk of electrocution!" }] },
      { q: "Smoke is filling the corridor. What do you do?", options: [{ t: "Crawl low and cover mouth", c: true, f: "Correct. Clean air stays near the floor." }, { t: "Run upright through smoke", c: false, f: "Dangerous — toxic smoke rises and accumulates above." }] }
    ],
    correctActions: ["Initiate immediate evacuation", "Activate fire suppression system", "Seal doors to prevent smoke spread", "Crawl low to avoid inhalation"],
    preventive: ["Install monitored fire alarms", "Avoid overloading electrical circuits", "Keep fire extinguishers serviced and accessible", "Perform regular fire safety audits"],
    tips: ["Never use elevators during a fire", "Feel doors for heat before opening", "Stay low where the air is cleaner"]
  },
  earthquake: {
    steps: [
      { q: "Ground starts shaking. You are near a sturdy table.", options: [{ t: "Run outside", c: false, f: "Falling glass/debris outside is high-risk." }, { t: "Drop, Cover, Hold On", c: true, f: "Correct. This is the safest maneuver." }] },
      { q: "Shaking stops. You smell gas. What do you do?", options: [{ t: "Turn on lights to inspect", c: false, f: "A spark could ignite leaking gas — never use switches." }, { t: "Open windows and leave immediately", c: true, f: "Correct. Ventilate and evacuate to let emergency services handle it." }] },
      { q: "You are near the coast after a large quake. What is your priority?", options: [{ t: "Wait and observe the water", c: false, f: "A large coastal quake can generate a tsunami within minutes." }, { t: "Move to high ground immediately", c: true, f: "Correct. Coastal earthquakes can trigger tsunamis. Evacuate fast." }] }
    ],
    correctActions: ["Drop to your hands and knees", "Cover your head and neck", "Hold on to your shelter until shaking stops", "Move away from windows"],
    preventive: ["Secure heavy furniture to walls", "Follow seismic safety building designs", "Identify safe zones in every room", "Maintain a distributed emergency kit"],
    tips: ["If driving, pull over to a clear area", "Stay inside until shaking completely ceases", "Do not stand in doorways"]
  },
  flood: {
    steps: [
      { q: "Water level is rising rapidly. Your location is low-lying.", options: [{ t: "Evacuate to attic/roof", c: true, f: "Correct. Seek elevation immediately." }, { t: "Barricade doors", c: false, f: "Water pressure will eventually breach the door." }] },
      { q: "You need to cross a flooded street. What do you do?", options: [{ t: "Wade through quickly", c: false, f: "Even 6 inches of moving water can knock you over." }, { t: "Find an alternate route or wait for rescue", c: true, f: "Correct. Never walk through moving floodwaters." }] }
    ],
    correctActions: ["Move to high ground immediately", "Disconnect all electrical utilities", "Avoid walking or driving through moving water", "Follow official evacuation routes"],
    preventive: ["Maintain clear drainage systems", "Avoid construction in low-lying zones", "Install flood-proof barriers", "Properly waterproof basements"],
    tips: ["6 inches of water can knock you over", "Stay away from power lines in water", "Monitor local flood warnings constantly"]
  },
  tsunami: {
    steps: [
      { q: "You feel a strong coastal earthquake. The ocean recedes unusually far. What do you do?", options: [{ t: "Move closer to see the phenomenon", c: false, f: "Ocean recession is a classic tsunami warning — never approach." }, { t: "Immediately move inland and uphill", c: true, f: "Correct. Ocean recession is a tsunami warning. You have minutes." }] },
      { q: "You hear the tsunami warning siren. You are in a car. What do you do?", options: [{ t: "Drive along the coast to see the wave", c: false, f: "Never drive toward a tsunami. Waves can travel faster than a car." }, { t: "Drive inland and uphill as fast as possible", c: true, f: "Correct. Move perpendicular to the coast and gain elevation." }] },
      { q: "After a tsunami wave, is it safe to return to the coast?", options: [{ t: "Yes, the first wave is always the biggest", c: false, f: "The first wave is often not the largest. Multiple waves can arrive hours apart." }, { t: "No — wait for official all-clear from authorities", c: true, f: "Correct. Multiple waves can follow. Only return when officials declare it safe." }] }
    ],
    correctActions: ["Move immediately inland and to high ground", "Do not return until official all-clear", "Avoid bridges and coastal roads", "Follow designated tsunami evacuation routes"],
    preventive: ["Know your local tsunami hazard zone", "Practice evacuation routes regularly", "Have a family emergency plan", "Keep emergency supplies ready"],
    tips: ["Natural warnings: shaking, ocean recession, loud roar", "The first wave is rarely the largest", "Never stay to watch the wave"]
  },
  cyclone: {
    steps: [
      { q: "A Cyclone Category 4 warning is issued for your area. You have 12 hours. What do you do first?", options: [{ t: "Board up windows and secure loose outdoor items", c: true, f: "Correct. Secure your property and prepare to shelter or evacuate." }, { t: "Wait for it to make landfall before deciding", c: false, f: "Waiting eliminates your window to prepare and evacuate safely." }] },
      { q: "Winds are at peak intensity. You are indoors. What should you avoid?", options: [{ t: "Stay in an interior room away from windows", c: false, f: "This is actually correct — but the real danger is going near windows." }, { t: "Standing near windows or glass doors", c: true, f: "Correct. Glass can shatter violently in cyclone-force winds." }] },
      { q: "The eye of the cyclone passes. The wind suddenly calms. What do you do?", options: [{ t: "Go outside — the cyclone has passed!", c: false, f: "Dangerous! The calm eye is temporary. The back wall with equally strong winds is approaching." }, { t: "Stay sheltered — the dangerous back wall is coming", c: true, f: "Correct. The eye is brief. The opposite side of the cyclone follows with full force." }] }
    ],
    correctActions: ["Secure all loose outdoor items", "Fill water containers before power fails", "Move to an interior room during peak winds", "Stay indoors through the entire storm including the eye"],
    preventive: ["Know your evacuation zone category", "Prepare a 72-hour emergency kit", "Reinforce roof connections and shutters", "Identify the nearest cyclone shelter"],
    tips: ["The calm of the eye is deceptive — never go outside", "Flying debris is the #1 cause of injury", "Surge flooding can occur miles inland from landfall"]
  }
};


export default function Simulators({ onUpdateUser }) {
  const [type, setType] = React.useState("earthquake");
  const [intensity, setIntensity] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [inSim, setInSim] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [mistakes, setMistakes] = React.useState(0);
  const [finalScore, setFinalScore] = React.useState(null);
  const [feedback, setFeedback] = React.useState("");

  // Use refs to always have latest values inside setTimeout callbacks
  const pointsRef = React.useRef(0);
  const mistakesRef = React.useRef(0);
  const intensityRef = React.useRef(0);

  const handleChoice = (opt) => {
    setFeedback(opt.f);
    if (opt.c) {
      pointsRef.current += 50;
      setPoints(pointsRef.current);
    } else {
      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
    }

    setTimeout(() => {
      setFeedback("");
      const steps = SCENARIOS[type].steps;
      if (currentStep < steps.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        finishSimulation();
      }
    }, 2000);
  };

  const finishSimulation = async () => {
    // Use refs to get the latest values (avoids stale closure)
    const finalPts = pointsRef.current;
    const finalMistakes = mistakesRef.current;
    const currentIntensity = intensityRef.current;
    const score = finalPts + (currentIntensity > 7 ? 100 : 0) + (finalMistakes === 0 ? 200 : 0);

    // Show debrief immediately — don't wait for API
    setFinalScore(score);
    setInSim(false);

    // Save in background — don't block UI
    try {
      await apiJson("/api/simulations/save", { method: "POST", body: { scenarioType: type, config: { intensity: currentIntensity }, score, feedback: "Debrief recorded." } });
      if (onUpdateUser) onUpdateUser();
    } catch (err) {
      console.warn("Simulation save failed (non-critical):", err.message);
    }
  };

  const performance = (s) => s >= 400 ? ["Excellent", "text-emerald-400"] : s >= 250 ? ["High", "text-indigo-400"] : s >= 101 ? ["Medium", "text-amber-400"] : ["Low", "text-red-400"];
  const perf = finalScore !== null ? performance(finalScore) : null;
  const guidance = SCENARIOS[type];

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Simulation Terminal</h1>
        <p className="text-slate-400 font-medium mt-2">Validated responder readiness environment for high-stakes hazard drills.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Control Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="os-card min-h-[400px] flex flex-col">
            {!inSim && finalScore === null ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Tactical Sector</div>
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {[
                      { id: "earthquake", label: "Quake", icon: "🌍" },
                      { id: "fire", label: "Fire", icon: "🔥" },
                      { id: "flood", label: "Flood", icon: "🌊" },
                      { id: "tsunami", label: "Tsunami", icon: "🌀" },
                      { id: "cyclone", label: "Cyclone", icon: "🌪️" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setType(t.id)} className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border flex flex-col items-center gap-1 ${type === t.id ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20" : "bg-slate-900 text-slate-500 border-white/5 hover:border-white/10"}`}>
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Drill Intensity</div>
                  <div className="text-3xl font-black text-white mb-2">Level {intensity}</div>
                  <input type="range" min="0" max="10" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
                <button className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95" onClick={() => {
                  const lvl = intensity === 0 ? 5 : intensity;
                  intensityRef.current = lvl;
                  pointsRef.current = 0;
                  mistakesRef.current = 0;
                  setIntensity(lvl);
                  setInSim(true);
                  setCurrentStep(0);
                  setPoints(0);
                  setMistakes(0);
                }}>Initialize Drill</button>
              </div>
            ) : inSim ? (
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Active Operational Scenario</div>
                <h3 className="text-lg font-black text-white mb-8 leading-relaxed">{SCENARIOS[type].steps[currentStep].q}</h3>
                <div className="space-y-3">
                  {SCENARIOS[type].steps[currentStep].options.map((opt, i) => (
                    <button key={i} className="w-full p-5 bg-slate-900 border border-white/5 rounded-2xl text-left text-sm font-bold text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all disabled:opacity-50" onClick={() => handleChoice(opt)} disabled={!!feedback}>{opt.t}</button>
                  ))}
                </div>
                {feedback && <div className="mt-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs font-bold text-indigo-300 leading-relaxed animate-fade-in">{feedback}</div>}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-2xl font-black text-indigo-300 mb-6 border border-indigo-500/20">XP</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Debrief Recorded</div>
                <div className={`text-5xl font-black mb-10 ${perf[1]}`}>{finalScore} XP</div>
                <button className="px-10 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase" onClick={() => { setFinalScore(null); setIntensity(0); }}>New Re-Deployment</button>
              </div>
            )}
          </div>
        </div>

        {/* Visual Engine */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video lg:aspect-auto lg:h-[600px] bg-slate-950 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl">

            {/* Always-on: Grid Background */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Always-on: Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-lg pointer-events-none" />

            {/* HUD Overlay */}
            <div className="absolute top-8 left-8 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl z-10">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Telemetry HUD v2.0</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                    {intensity === 0 ? "IDLE" : `${type} ACTIVE`}
                  </span>
                </div>
                <div className="text-xs font-black text-slate-400">MAGNITUDE: L{intensity}</div>
              </div>
            </div>

            {/* Top-right status badge */}
            <div className="absolute top-8 right-8 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${inSim ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${inSim ? 'text-red-400' : 'text-emerald-400'}`}>
                  {inSim ? 'DRILL ACTIVE' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* IDLE State — Rich animated content */}
            {intensity === 0 && !inSim && finalScore === null && (
              <div className="flex flex-col items-center justify-center gap-8 z-10 w-full px-12">
                {/* Radar ring animation */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                  <div className="absolute inset-3 rounded-full border border-indigo-500/15" />
                  <div className="absolute inset-6 rounded-full border border-indigo-500/10" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500/60"
                    style={{ animation: 'spin 4s linear infinite' }} />
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30 text-2xl">🛰️</div>
                </div>

                <div className="text-center">
                  <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">System Standby</div>
                  <div className="text-slate-500 text-sm font-medium">Select a sector &amp; intensity to initialize a drill</div>
                </div>

                {/* Live telemetry bars */}
                <div className="w-full max-w-sm space-y-3">
                  {[
                    { label: 'Seismic', value: 18, color: 'bg-indigo-500' },
                    { label: 'Thermal', value: 34, color: 'bg-amber-500' },
                    { label: 'Hydro', value: 52, color: 'bg-cyan-500' },
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-16">{m.label}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full opacity-60`} style={{ width: `${m.value}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 w-8 text-right">{m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Effects Engine */}
            <div className="relative z-10">
              {type === "earthquake" && (
                <div className="w-32 h-64 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg border-2 border-slate-600 relative flex flex-col p-4 gap-3" style={{ animation: intensity > 0 ? `shake-dynamic ${0.5 / (intensity * 0.5)}s infinite linear` : "none", "--shake-dist": `${intensity * 2}px` }}>
                   {[...Array(6)].map((_, i) => <div key={i} className="flex-1 border border-white/5 rounded-sm" />)}
                </div>
              )}
              {/* Fire Simulation - Senior Animation Engineer Spec */}
              {type === "fire" && intensity > 0 && (() => {
                const level = intensity;
                let colors = { inner: "#fff7ed", mid: "#ffedd5", outer: "#fed7aa" };
                if (level >= 4 && level <= 6) colors = { inner: "#ffedd5", mid: "#fdba74", outer: "#f97316" };
                if (level >= 7 && level <= 8) colors = { inner: "#fdba74", mid: "#f97316", outer: "#dc2626" };
                if (level >= 9) colors = { inner: "#fef08a", mid: "#ef4444", outer: "#991b1b" };

                return (
                  <div className="w-48 h-48 flex items-center justify-center pointer-events-none">
                    <div 
                      className="w-32 h-48 animate-flame-flicker transition-all duration-300"
                      style={{
                        transform: `scale(${level / 10})`,
                        background: `radial-gradient(circle at 50% 80%, ${colors.inner} 0%, ${colors.mid} 40%, ${colors.outer} 100%)`,
                        borderRadius: "50% 50% 20% 20% / 80% 80% 20% 20%",
                        boxShadow: `0 0 ${level * 8}px rgba(255, 100, 0, 0.6)`,
                        filter: "blur(2px)"
                      }}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Flood Visual */}
            {type === "flood" && intensity > 0 && (
              <div className="absolute bottom-0 left-0 w-full bg-indigo-600/60 backdrop-blur-md border-t-4 border-indigo-400 transition-all duration-1000 ease-out z-0" style={{ height: `${intensity * 10}%` }}>
                <div className="absolute top-0 left-0 w-full h-12 -translate-y-full bg-gradient-to-t from-indigo-500/20 to-transparent blur-xl animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)] animate-pulse" />
              </div>
            )}

            {/* Tsunami Visual */}
            {type === "tsunami" && intensity > 0 && (
              <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none" style={{ height: `${intensity * 9}%`, transition: 'height 1s ease-out' }}>
                <div className="absolute top-0 left-0 w-full h-10 bg-cyan-400/30 rounded-t-[100%] animate-pulse" />
                <div className="w-full h-full bg-gradient-to-t from-cyan-700/80 to-cyan-500/40 backdrop-blur-sm border-t-4 border-cyan-300/60" />
                <div className="absolute top-0 w-full flex justify-around">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-16 h-8 bg-white/10 rounded-full blur-sm animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Cyclone Visual */}
            {type === "cyclone" && intensity > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border-2 border-slate-400/30"
                    style={{
                      width: `${(i + 1) * 80}px`,
                      height: `${(i + 1) * 80}px`,
                      borderColor: `rgba(148,163,184,${0.4 - i * 0.08})`,
                      animation: `spin ${3 - i * 0.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                      borderStyle: i % 2 === 0 ? 'solid' : 'dashed'
                    }}
                  />
                ))}
                <div className="w-8 h-8 bg-slate-600/60 rounded-full border border-white/20 z-10" />
                <div className="absolute text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ top: '12%' }}>EYE WALL</div>
              </div>
            )}

            {/* Post-Drill Analysis Overlay */}
            {finalScore !== null && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl p-8 lg:p-12 overflow-y-auto z-50 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-10 mb-10">
                  <div>
                    <h2 className="text-3xl font-black gradient-text">Operational Debrief</h2>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Performance Rating: <span className={`font-black ${perf[1]}`}>{perf[0]}</span></p>
                  </div>
                  <button className="px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black tracking-widest text-slate-400 hover:text-white transition-all uppercase" onClick={() => { setFinalScore(null); setIntensity(0); }}>Close Terminal</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correct Response Protocols</div>
                    <div className="space-y-3">
                      {guidance.correctActions.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                          <span className="text-emerald-400">✓</span> {a}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Field Guidance & Mitigation</div>
                    <div className="grid gap-3">
                      {guidance.preventive.map((m, i) => (
                        <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-xs font-bold text-slate-400 leading-relaxed border-l-2 border-l-indigo-500">{m}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
