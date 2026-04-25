import express from "express";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

const MODULES = [
  {
    id: "fire-basics",
    title: "Fire Safety Basics",
    level: "beginner",
    estimatedMinutes: 12,
    tags: ["fire", "evacuation", "extinguisher"]
  },
  {
    id: "fire-advanced-suppression",
    title: "Advanced Fire Suppression",
    level: "intermediate",
    estimatedMinutes: 20,
    tags: ["fire", "equipment", "industrial"]
  },
  {
    id: "fire-urban-rescue",
    title: "Urban Fire Search & Rescue",
    level: "advanced",
    estimatedMinutes: 25,
    tags: ["fire", "rescue", "technical"]
  },
  {
    id: "earthquake-drop-cover-hold",
    title: "Earthquake: Drop, Cover, Hold",
    level: "beginner",
    estimatedMinutes: 10,
    tags: ["earthquake", "indoors"]
  },
  {
    id: "flood-evacuation-routes",
    title: "Flood: Evacuation Routes & Safe Zones",
    level: "intermediate",
    estimatedMinutes: 14,
    tags: ["flood", "maps", "routes"]
  }
];

router.get("/", authRequired, async (req, res, next) => {
  try {
    return res.json({ ok: true, modules: MODULES });
  } catch (err) {
    next(err);
  }
});

export default router;
