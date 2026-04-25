import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },

    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    smsSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Alert = mongoose.model("Alert", alertSchema);
