import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { DrillAttempt } from "../models/DrillAttempt.js";
import { QuizResult } from "../models/QuizResult.js";
import { SimulationResult } from "../models/SimulationResult.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.put("/change-password", authRequired, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const userId = req.user?.sub;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ ok: false, message: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ ok: false, message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(401).json({ ok: false, message: "Incorrect current password" });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ ok: true, message: "Password updated successfully" });
  } catch (err) { next(err); }
});

router.put("/profile/update", authRequired, async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    const userId = req.user?.sub;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    if (name) {
      if (name.trim().length < 2) return res.status(400).json({ ok: false, message: "A valid name is required" });
      user.name = name.trim();
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ ok: false, message: "Invalid email format" });
      
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ ok: false, message: "Email already in use" });
      
      user.email = email.toLowerCase().trim();
    }

    await user.save();

    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points } });
  } catch (err) { next(err); }
});

router.get("/profile/activity", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.sub;

    const [drills, quizzes, simulations] = await Promise.all([
      DrillAttempt.find({ student: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      QuizResult.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      SimulationResult.find({ student: userId }).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const activity = [
      ...drills.map(d => ({ type: "drill", title: `Drill: ${d.drillType.toUpperCase()}`, score: d.score, date: d.createdAt })),
      ...quizzes.map(q => ({ type: "quiz", title: `Quiz Assessment`, score: q.scorePct, date: q.createdAt })),
      ...simulations.map(s => ({ type: "simulation", title: `Sim: ${s.scenarioType.toUpperCase()}`, score: s.score, date: s.createdAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);

    res.json({ ok: true, activity });
  } catch (err) { next(err); }
});

export default router;
