import express from "express";
import { User } from "../models/User.js";
import { DrillAttempt } from "../models/DrillAttempt.js";
import { QuizResult } from "../models/QuizResult.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

const getPerformanceLabel = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

// Track Drill Completion
router.get("/drills", authRequired, requireRole("faculty"), async (req, res, next) => {
  try {
    const stats = await DrillAttempt.aggregate([
      {
        $group: {
          _id: "$student",
          totalDrills: { $sum: 1 },
          lastDrillTime: { $max: "$createdAt" },
          avgDrillScore: { $avg: "$score" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $project: {
          _id: 0,
          studentName: "$studentInfo.name",
          totalDrills: 1,
          lastDrillTime: 1,
          avgDrillScore: { $round: ["$avgDrillScore", 1] }
        }
      },
      { $sort: { lastDrillTime: -1 } }
    ]);

    return res.json({ ok: true, stats });
  } catch (err) {
    next(err);
  }
});

// Evaluate Student Performance
router.get("/performance", authRequired, requireRole("faculty"), async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("name points").lean();
    
    // Get average quiz scores per student
    const quizStats = await QuizResult.aggregate([
      { $group: { _id: "$student", avgQuizScore: { $avg: "$score" } } }
    ]);

    // Get average drill scores per student
    const drillStats = await DrillAttempt.aggregate([
      { $group: { _id: "$student", avgDrillScore: { $avg: "$score" } } }
    ]);

    const performance = students.map(s => {
      const qStat = quizStats.find(q => String(q._id) === String(s._id));
      const dStat = drillStats.find(d => String(d._id) === String(s._id));
      
      const quizScore = qStat ? Math.round(qStat.avgQuizScore) : 0;
      const drillScore = dStat ? Math.round(dStat.avgDrillScore) : 0;
      
      // Overall score calculation (weighted average or simple average)
      const overall = (quizScore + drillScore) / 2;
      
      return {
        id: s._id,
        name: s.name,
        xp: s.points,
        quizScore,
        drillScore,
        performanceLabel: getPerformanceLabel(overall)
      };
    });

    return res.json({ ok: true, performance });
  } catch (err) {
    next(err);
  }
});

export default router;
