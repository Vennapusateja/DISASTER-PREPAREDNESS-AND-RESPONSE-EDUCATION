import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { DrillAttempt } from "../models/DrillAttempt.js";
import { QuizResult } from "../models/QuizResult.js";

const router = express.Router();

router.get("/overview", authRequired, async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({ role: "student" });
    const drillCount = await User.aggregate([
      { $group: { _id: null, totalPoints: { $sum: "$points" } } }
    ]);

    const drills = await DrillAttempt.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    const quizCount = await QuizResult.countDocuments();
    const avgQuiz = await QuizResult.aggregate([{ $group: { _id: null, avg: { $avg: "$score" } } }]);
    
    const drillAttemptsCount = await DrillAttempt.countDocuments();
    const stats = await DrillAttempt.aggregate([
      { $group: { _id: "$drillType", avgScore: { $avg: "$score" }, count: { $sum: 1 } } }
    ]);

    // XP Distribution
    const xpDist = await User.aggregate([
      { $match: { role: "student" } },
      {
        $bucket: {
          groupBy: "$points",
          boundaries: [0, 101, 501, 1001, 10000],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const performance = await User.find({ role: "student" })
       .select("name points")
       .sort({ points: -1 })
       .lean();

    const recentQuizzes = await QuizResult.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.json({
      ok: true,
      overview: {
        users: userCount,
        drillAttempts: drillAttemptsCount,
        quizAttempts: quizCount,
        avgPoints: userCount > 0 ? Math.round((drillCount[0]?.totalPoints || 0) / userCount) : 0,
        avgQuizScore: avgQuiz[0]?.avg ? Math.round(avgQuiz[0].avg) : 0,
        avgDrillScore: stats.length > 0 ? Math.round(stats.reduce((a,b) => a + b.avgScore, 0) / stats.length) : 0
      },
      xpDistribution: xpDist.map(d => ({ range: d._id === 0 ? "0-100" : d._id === 101 ? "101-500" : d._id === 501 ? "501-1000" : "1000+", count: d.count })),
      stats: stats.map(s => ({
        type: s._id,
        avg: Math.round(s.avgScore),
        count: s.count
      })),
      topPerformers: performance.slice(0, 5).map(p => ({ name: p.name, points: p.points })),
      lowPerformers: [...performance].reverse().slice(0, 5).map(p => ({ name: p.name, points: p.points })),
      recentDrills: drills.map((d) => ({
        id: String(d._id),
        student: d.student,
        drillType: d.drillType,
        score: d.score,
        createdAt: d.createdAt
      })),
      recentQuizzes: recentQuizzes.map(q => ({
        id: String(q._id),
        title: q.title,
        score: q.score,
        createdAt: q.createdAt
      }))
    });

  } catch (err) {
    next(err);
  }
});

export default router;
