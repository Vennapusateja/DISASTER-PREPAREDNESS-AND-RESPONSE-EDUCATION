import React from "react";
import { apiJson } from "../services/api.js";

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" },
  card: { background: "#fff", padding: "32px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", marginBottom: "24px" },
  input: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e5e7eb", marginTop: "8px", fontSize: "16px", background: "#f9fafb", boxSizing: "border-box" },
  label: { fontSize: "14px", fontWeight: 700, color: "#374151" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  predictBtn: { width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: "#111827", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "16px", transition: "transform 0.1s" },
  resultCard: (level) => ({
    padding: "24px",
    borderRadius: "20px",
    background: level === "HIGH" ? "#fef2f2" : level === "MEDIUM" ? "#fffbeb" : "#f0fdf4",
    border: `1px solid ${level === "HIGH" ? "#fecaca" : level === "MEDIUM" ? "#fef3c7" : "#bbf7d0"}`,
    marginTop: "24px"
  }),
  levelBadge: (level) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 800,
    background: level === "HIGH" ? "#ef4444" : level === "MEDIUM" ? "#f59e0b" : "#10b981",
    color: "#fff"
  })
};

export default function RiskPredictor() {
  const [form, setForm] = React.useState({
    disasterType: "Flood",
    temperature: 25,
    rainfall: 50,
    buildingType: "Concrete",
    populationDensity: 200
  });
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const data = await apiJson("/api/predictions/evaluate", {
        method: "POST",
        body: form
      });
      setResult(data.assessment);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Disaster Risk Predictor</h1>
      
      <div style={styles.card}>
        <div style={{ marginBottom: "24px" }}>
          <label style={styles.label}>Disaster Type</label>
          <select style={styles.input} value={form.disasterType} onChange={e => setForm({...form, disasterType: e.target.value})}>
            <option>Flood</option>
            <option>Fire</option>
            <option>Earthquake</option>
          </select>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Temperature (°C)</label>
            <input type="number" style={styles.input} value={form.temperature} onChange={e => setForm({...form, temperature: Number(e.target.value)})} />
          </div>
          <div>
            <label style={styles.label}>Rainfall (mm)</label>
            <input type="number" style={styles.input} value={form.rainfall} onChange={e => setForm({...form, rainfall: Number(e.target.value)})} />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Building Type</label>
            <select style={styles.input} value={form.buildingType} onChange={e => setForm({...form, buildingType: e.target.value})}>
              <option>Concrete</option>
              <option>Old Masonry</option>
              <option>Slum</option>
              <option>Basement</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Population density (p/km²)</label>
            <input type="number" style={styles.input} value={form.populationDensity} onChange={e => setForm({...form, populationDensity: Number(e.target.value)})} />
          </div>
        </div>

        <button 
          style={styles.predictBtn} 
          onClick={predict}
          disabled={loading}
        >
          {loading ? "Analyzing Factors..." : "🚀 Evaluate Risk Levels"}
        </button>

        {result && (
          <div style={styles.resultCard(result.riskLevel)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#111827" }}>Assessment Result</h3>
              <span style={styles.levelBadge(result.riskLevel)}>{result.riskLevel} RISK</span>
            </div>
            <p style={{ margin: "0 0 16px 0", color: "#4b5563", fontSize: "15px", lineHeight: "1.6" }}>
              <b>Analysis:</b> {result.explanation}
            </p>
            <div style={{ background: "rgba(255,255,255,0.5)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>SUGGESTED PRECAUTIONS</div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#1e293b" }}>
                {result.suggestedPrecautions.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
