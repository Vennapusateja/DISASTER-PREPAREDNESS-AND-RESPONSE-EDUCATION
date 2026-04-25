import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: String, required: true, index: true },
    title: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    pointsAwarded: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

quizResultSchema.index({ student: 1, completedAt: -1 });

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);
