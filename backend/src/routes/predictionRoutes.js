import express from "express";
import { authRequired } from "../middleware/auth.js";
import { RiskAssessment } from "../models/RiskAssessment.js";

const router = express.Router();

router.post("/evaluate", authRequired, async (req, res, next) => {
  try {
    const { 
      disasterTypes, 
      temperature, 
      rainfall, 
      buildingType, 
      populationDensity 
    } = req.body || {};
    const userId = req.user.sub;

    if (!Array.isArray(disasterTypes) || disasterTypes.length === 0) {
      return res.status(400).json({ ok: false, message: "At least one hazard section must be filled" });
    }

    let individualRisks = [];
    let combinedScore = 0;
    let reasons = [];
    let allPrecautions = new Set(["Maintain emergency supplies", "Monitor official communication channels"]);

    for (const type of disasterTypes) {
      let score = 0;
      let localReasons = [];

      if (type === "Flood") {
        if (rainfall > 300) { score += 5; localReasons.push("Severe flood threat based on rainfall"); }
        else if (rainfall > 150) { score += 3; localReasons.push("Moderate flood hazard detected"); }
        else if (rainfall > 50) { score += 1; localReasons.push("Minor flood risk factor"); }
        allPrecautions.add("Move valuables to secure upper levels");
      }

      if (type === "Fire") {
        if (temperature > 45) { score += 5; localReasons.push("Critical fire ignition probability"); }
        else if (temperature > 35) { score += 3; localReasons.push("Elevated thermal risk"); }
        if (buildingType === "Slum" || buildingType === "Old Masonry") { score += 2; localReasons.push("High-risk structure material"); }
        allPrecautions.add("Inspect fire safety systems regularly");
      }

      if (type === "Earthquake") {
        if (populationDensity > 800) { score += 4; localReasons.push("Dense population complicates evacuation"); }
        else if (populationDensity > 400) { score += 2; localReasons.push("Moderate human exposure index"); }
        allPrecautions.add("Anchor heavy furnishings to structural frames");
      }

      let riskLevel = "LOW";
      if (score >= 5) riskLevel = "HIGH";
      else if (score >= 3) riskLevel = "MEDIUM";

      individualRisks.push({ type, level: riskLevel, score, reasons: localReasons });
      combinedScore += score;
      reasons.push(...localReasons);
    }

    // Determine Composite Risk
    let compositeLevel = "LOW";
    const highRisks = individualRisks.filter(r => r.level === "HIGH").length;
    if (highRisks > 0 || combinedScore >= 8) compositeLevel = "HIGH";
    else if (individualRisks.length > 1 || combinedScore >= 4) compositeLevel = "MEDIUM";

    const assessment = await RiskAssessment.create({
      student: userId,
      inputs: { disasterTypes, temperature, rainfall, buildingType, populationDensity },
      riskLevel: compositeLevel,
      explanation: reasons.length > 0 ? reasons.join(". ") : "Environment data shows no immediate high-level hazards.",
      suggestedPrecautions: Array.from(allPrecautions)
    });

    return res.json({ ok: true, assessment, individualRisks });
  } catch (err) {
    next(err);
  }
});

export default router;
