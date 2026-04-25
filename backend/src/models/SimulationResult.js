import mongoose from "mongoose";

const simulationResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    scenarioType: { type: String, enum: ["fire", "earthquake", "flood"], required: true },
    config: { type: Object, default: {} }, // e.g., magnitude, fire class
    score: { type: Number, required: true },
    feedback: { type: String },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const SimulationResult = mongoose.model("SimulationResult", simulationResultSchema);
