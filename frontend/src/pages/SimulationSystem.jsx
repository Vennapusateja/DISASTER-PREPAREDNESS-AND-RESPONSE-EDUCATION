import React from "react";
import { apiJson } from "../services/api.js";

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" },
  card: { background: "#fff", padding: "32px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", marginBottom: "24px" },
  btn: (active) => ({
    padding: "12px 20px",
    borderRadius: "12px",
    border: "2px solid",
    borderColor: active ? "#7c3aed" : "#e5e7eb",
    background: active ? "#f5f3ff" : "#fff",
    color: active ? "#7c3aed" : "#4b5563",
    cursor: "pointer",
    fontWeight: 700,
    transition: "all 0.2s",
    flex: 1,
    textAlign: "center"
  }),
  choiceBtn: {
    display: "block",
    width: "100%",
    padding: "16px 20px",
    borderRadius: "16px",
    border: "2px solid #f3f4f6",
    background: "#fff",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: 500,
    transition: "all 0.2s"
  },
  resultBox: { padding: "24px", borderRadius: "20px", background: "#f9fafb", border: "1px solid #e5e7eb", textAlign: "center" },
  badge: { display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 800, background: "#fef3c7", color: "#92400e", marginBottom: "16px" }
};

const SCENARIOS = {
  fire: {
    title: "Fire Emergency Response",
    levels: ["Class A (Wood/Paper)", "Class B (Flammable Liquids)", "Class C (Electrical)", "Class D (Metals)"],
    questions: [
      {
        text: "You notice a small fire in a trash can (Class A). What is your first action?",
        choices: [
          { text: "Find a Class B extinguisher", correct: false, feedback: "Class B is for liquids!" },
          { text: "Use fire blanket or Class A extinguisher", correct: true, feedback: "Correct! Smothering or Class A is right for solids." },
          { text: "Ignore it and wait for fire brigade", correct: false, feedback: "Early intervention is critical for small fires." }
        ]
      },
      {
        text: "The room is filling with smoke. How do you move?",
        choices: [
          { text: "Run as fast as possible", correct: false, feedback: "Smoke rises; the floor has the cleanest air." },
          { text: "Stay low and crawl to the nearest exit", correct: true, feedback: "Correct! Staying low saves lives." }
        ]
      }
    ]
  },
  earthquake: {
    title: "Earthquake Survival Drill",
    levels: ["LOW", "MEDIUM", "HIGH"],
    questions: [
      {
        text: "The ground starts shaking violently. You are near a sturdy desk.",
        choices: [
          { text: "Run outside immediately", correct: false, feedback: "Falling debris outside is more dangerous!" },
          { text: "Drop, Cover, and Hold On under the desk", correct: true, feedback: "Correct! This is the gold standard for survival." },
          { text: "Stand in a doorway", correct: false, feedback: "Modern doorways are not safer than other parts of the room." }
        ]
      }
    ]
  },
  flood: {
    title: "Flood Evacuation Tactics",
    levels: ["Minor Flooding", "Flash Flood", "Severe Coastal Flood"],
    questions: [
      {
        text: "A flash flood warning is issued. Water level is rising at your doorstep.",
        choices: [
          { text: "Drive to high ground immediately", correct: false, feedback: "Driving through water is the #1 cause of flood deaths." },
          { text: "Move to the highest floor or roof", correct: true, feedback: "Correct! Vertical evacuation is safest if you can't reach high ground on foot." },
          { text: "Check the basement for valuables", correct: false, feedback: "Basements are death traps in flash floods!" }
        ]
      }
    ]
  }
};

export default function SimulationSystem({ onUpdateUser }) {
  const [mode, setMode] = React.useState("fire");
  const [step, setStep] = React.useState(0); // 0 = start, 1 = sim, 2 = result
  const [currentQ, setCurrentQ] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  const [showFeedback, setShowFeedback] = React.useState(false);

  const startSim = () => {
    setStep(1);
    setCurrentQ(0);
    setScore(0);
    setFeedback("");
    setShowFeedback(false);
  };

  const handleChoice = async (choice) => {
    setFeedback(choice.feedback);
    setShowFeedback(true);
    if (choice.correct) setScore(s => s + 50);

    setTimeout(async () => {
      const scenario = SCENARIOS[mode];
      if (currentQ < scenario.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setShowFeedback(false);
      } else {
        // End Sim
        const finalScore = score + (choice.correct ? 50 : 0);
        await apiJson("/api/simulations/save", {
          method: "POST",
          body: {
            scenarioType: mode,
            score: finalScore,
            feedback: "Simulated scenario completed"
          }
        });
        if (onUpdateUser) onUpdateUser();
        setStep(2);
      }
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Interactive Training Simulations</h1>

      {step === 0 && (
        <div style={styles.card}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {Object.keys(SCENARIOS).map(k => (
              <button key={k} style={styles.btn(mode === k)} onClick={() => setMode(k)}>
                {k.toUpperCase()}
              </button>
            ))}
          </div>
          <h2 style={{ fontSize: "22px", margin: "0 0 12px 0" }}>{SCENARIOS[mode].title}</h2>
          <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
            This simulation will test your response to various {mode} scenarios. 
            Make choices carefully to earn XP and save lives.
          </p>
          <div style={{ marginTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SCENARIOS[mode].levels.map(l => (
              <span key={l} style={styles.badge}>{l}</span>
            ))}
          </div>
          <button 
            style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "#111827", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", marginTop: "12px" }}
            onClick={startSim}
          >
            Start Simulation
          </button>
        </div>
      )}

      {step === 1 && (
        <div style={styles.card}>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#7c3aed", marginBottom: "8px" }}>SCENARIO ACTIVE</div>
          <h3 style={{ fontSize: "20px", margin: "0 0 24px 0" }}>{SCENARIOS[mode].questions[currentQ].text}</h3>
          
          <div>
            {SCENARIOS[mode].questions[currentQ].choices.map((c, i) => (
              <button 
                key={i} 
                style={{ ...styles.choiceBtn, borderColor: showFeedback && c.correct ? "#10b981" : "#f3f4f6" }}
                onClick={() => !showFeedback && handleChoice(c)}
                disabled={showFeedback}
              >
                {c.text}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div style={{ marginTop: "20px", padding: "16px", borderRadius: "12px", background: "#f8fafc", color: "#1e293b", fontWeight: 600 }}>
              {feedback}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div style={{ ...styles.card, ...styles.resultBox }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 8px 0" }}>Simulation Complete</h2>
          <div style={{ fontSize: "18px", color: "#6b7280", marginBottom: "24px" }}>
            Expertise points earned: <b style={{ color: "#7c3aed" }}>+{score} XP</b>
          </div>
          
          <div style={{ textAlign: "left", background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #eee" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#10b981" }}>✅ Correct Actions</h4>
            <ul style={{ paddingLeft: "20px", color: "#4b5563", fontSize: "14px" }}>
              {mode === "fire" && <li>Crawl low under smoke</li>}
              {mode === "fire" && <li>Use extinguishers matching the fire class</li>}
              {mode === "earthquake" && <li>Drop, Cover, Hold under protection</li>}
              {mode === "flood" && <li>Seek higher ground immediately on foot</li>}
            </ul>
            <h4 style={{ margin: "16px 0 12px 0", color: "#7c3aed" }}>🛡️ Preventive Measures</h4>
            <ul style={{ paddingLeft: "20px", color: "#111827", fontSize: "14px", fontWeight: 500 }}>
              <li>Run annual drills for your household/team</li>
              <li>Keep an emergency 'Go Bag' near the exit</li>
            </ul>
          </div>

          <button 
            style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "#111827", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", marginTop: "24px" }}
            onClick={() => setStep(0)}
          >
            Try Another Simulation
          </button>
        </div>
      )}
    </div>
  );
}
