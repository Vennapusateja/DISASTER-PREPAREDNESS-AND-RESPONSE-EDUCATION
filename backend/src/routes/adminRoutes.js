import express from "express";
import { User } from "../models/User.js";
import { DrillAttempt } from "../models/DrillAttempt.js";
import { QuizResult } from "../models/QuizResult.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", authRequired, requireRole("admin"), async (req, res) => {
  const users = await User.find({})
    .select("_id name email role points badges createdAt lastLoginAt")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    ok: true,
    users: users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      points: u.points,
      badges: u.badges,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }))
  });
});

router.get("/leaderboard", authRequired, async (req, res, next) => {
  try {
    const top = await User.find({ role: "student" })
      .select("name email points badges")
      .sort({ points: -1 })
      .limit(10)
      .lean();

    return res.json({
      ok: true,
      leaderboard: top.map((u) => ({
        id: String(u._id),
        name: u.name,
        points: u.points,
        badgesCount: u.badges?.length || 0
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.get("/reports", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalDrills = await DrillAttempt.countDocuments();
    const totalQuizzes = await QuizResult.countDocuments();
    
    const avgQuiz = await QuizResult.aggregate([{ $group: { _id: null, avg: { $avg: "$score" } } }]);
    const avgDrill = await DrillAttempt.aggregate([{ $group: { _id: null, avg: { $avg: "$score" } } }]);
    
    const performers = await User.find({ role: "student" })
      .select("name points")
      .sort({ points: -1 })
      .limit(100)
      .lean();

    const topPerformers = performers.slice(0, 5);
    const lowPerformers = [...performers].reverse().slice(0, 5);

    return res.json({
      ok: true,
      report: {
        totalUsers,
        totalDrills,
        totalQuizzes,
        avgQuizScore: avgQuiz[0]?.avg ? Math.round(avgQuiz[0].avg) : 0,
        avgDrillScore: avgDrill[0]?.avg ? Math.round(avgDrill[0].avg) : 0,
        topPerformers: topPerformers.map(p => ({ name: p.name, points: p.points })),
        lowPerformers: lowPerformers.map(p => ({ name: p.name, points: p.points }))
      }
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:id/role", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const VALID = ["student", "faculty", "admin"];
    if (!VALID.includes(role)) return res.status(400).json({ ok: false, message: "Invalid role" });
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });
    return res.json({ ok: true, user: { id: String(user._id), name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

export default router;



