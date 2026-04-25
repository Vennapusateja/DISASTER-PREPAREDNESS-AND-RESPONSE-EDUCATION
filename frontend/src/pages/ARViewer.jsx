import React from "react";
import { apiJson } from "../services/api.js";

const styles = {
  card: { background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  btn: (active) => ({
    padding: "10px 16px",
    borderRadius: "10px",
    border: active ? "none" : "1px solid #e5e7eb",
    background: active ? "#111827" : "#fff",
    color: active ? "#fff" : "#4b5563",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s"
  }),
  finishBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "#10b981",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    marginTop: "20px"
  }
};

export default function ARViewer({ onUpdateUser }) {
  const [mode, setMode] = React.useState("fire");
  const [loading, setLoading] = React.useState(false);
  const [lastResult, setLastResult] = React.useState(null);

  async function finishDrill() {
    setLoading(true);
    setLastResult(null);
    try {
      // Simulating a random score based on "performance"
      const score = Math.floor(Math.random() * 41) + 60; // 60-100
      const durationMs = Math.floor(Math.random() * 60000) + 30000; // 30-90s

      const data = await apiJson("/api/drills", {
        method: "POST",
        body: { drillType: mode, score, durationMs }
      });

      setLastResult(data.attempt);
      if (onUpdateUser) onUpdateUser();
    } catch (err) {
      alert("Failed to save drill: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px 0" }}>AR Simulations</h2>
      <p style={{ color: "#6b7280", margin: "0 0 24px 0" }}>Select a disaster scenario to begin the immersive drill.</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["fire", "earthquake", "flood"].map(m => (
          <button key={m} style={styles.btn(mode === m)} onClick={() => setMode(m)}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", background: "#000", height: "400px" }}>
        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: 600 }}>
          LIVE CAMERA FEED
        </div>
        
        {/* Placeholder for AR.js / MindAR Scene */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff", textAlign: "center", padding: "40px" }}>
          <div>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{mode === "fire" ? "🔥" : mode === "earthquake" ? "🏚️" : "🌊"}</div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>{mode.toUpperCase()} SCENARIO ACTIVE</div>
            <p style={{ opacity: 0.7 }}>Point your camera at the training marker to interact.</p>
          </div>
        </div>
      </div>

      {lastResult && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0", textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: "#166534" }}>DRILL COMPLETE!</div>
          <div style={{ fontSize: "24px", fontWeight: 900 }}>Score: {lastResult.score}%</div>
          <div style={{ color: "#15803d", fontWeight: 600 }}>+{lastResult.pointsAwarded} XP Points Earned</div>
        </div>
      )}

      <button style={styles.finishBtn} onClick={finishDrill} disabled={loading}>
        {loading ? "Processing..." : "Finish and Save Drill"}
      </button>
    </div>
  );
}
