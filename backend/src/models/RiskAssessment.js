import mongoose from "mongoose";

const riskAssessmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    inputs: {
      disasterType: String,
      temperature: Number,
      rainfall: Number,
      buildingType: String,
      populationDensity: Number
    },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
    explanation: String,
    suggestedPrecautions: [String]
  },
  { timestamps: true }
);

export const RiskAssessment = mongoose.model("RiskAssessment", riskAssessmentSchema);
