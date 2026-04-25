import mongoose from "mongoose";

const drillAttemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    drillType: { type: String, enum: ["fire", "earthquake", "flood"], required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    durationMs: { type: Number, default: null, min: 0 },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

drillAttemptSchema.index({ student: 1, drillType: 1, createdAt: -1 });

export const DrillAttempt = mongoose.model("DrillAttempt", drillAttemptSchema);

