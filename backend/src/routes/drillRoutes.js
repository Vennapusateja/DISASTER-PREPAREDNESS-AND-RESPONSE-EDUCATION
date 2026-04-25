import express from "express";
import { authRequired } from "../middleware/auth.js";
import { DrillAttempt } from "../models/DrillAttempt.js";
import { User } from "../models/User.js";

const router = express.Router();

// Save a new drill attempt
router.post("/", authRequired, async (req, res, next) => {
  try {
    const { drillType, score, durationMs, metadata } = req.body || {};
    const userId = req.user.sub;

    if (!drillType || typeof score !== "number") {
      return res.status(400).json({ ok: false, message: "Missing drillType or score" });
    }

    const attempt = await DrillAttempt.create({
      student: userId,
      drillType,
      score,
      durationMs,
      metadata
    });

    // Award points based on score (e.g., score * 5)
    const pointsAwarded = Math.round(score * 5);
    await User.findByIdAndUpdate(userId, { $inc: { points: pointsAwarded } });

    return res.status(201).json({ 
      ok: true, 
      attempt: {
        id: String(attempt._id),
        drillType: attempt.drillType,
        score: attempt.score,
        pointsAwarded
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user's recent drills
router.get("/me", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const drills = await DrillAttempt.find({ student: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({ ok: true, drills });
  } catch (err) {
    next(err);
  }
});

export default router;
