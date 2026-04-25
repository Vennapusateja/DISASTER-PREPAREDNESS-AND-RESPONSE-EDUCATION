import express from "express";
import { authRequired } from "../middleware/auth.js";
import { SimulationResult } from "../models/SimulationResult.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/save", authRequired, async (req, res, next) => {
  try {
    const { scenarioType, config, score, feedback } = req.body || {};
    const userId = req.user.sub;

    const result = await SimulationResult.create({
      student: userId,
      scenarioType,
      config,
      score,
      feedback
    });

    // Award XP (1:1 with score for simulations)
    await User.findByIdAndUpdate(userId, { $inc: { points: score } });

    return res.json({ ok: true, result });
  } catch (err) {
    next(err);
  }
});

router.get("/history", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const history = await SimulationResult.find({ student: userId }).sort({ createdAt: -1 });
    return res.json({ ok: true, history });
  } catch (err) {
    next(err);
  }
});

export default router;
