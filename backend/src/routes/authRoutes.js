import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, USER_ROLES } from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {};

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanRole = typeof role === "string" ? role : "student";

    if (!cleanName) return res.status(400).json({ ok: false, message: "Name is required" });
    if (!cleanEmail) return res.status(400).json({ ok: false, message: "Email is required" });
    if (cleanPassword.length < 8)
      return res.status(400).json({ ok: false, message: "Password must be 8+ chars" });
    if (!USER_ROLES.includes(cleanRole))
      return res.status(400).json({ ok: false, message: "Invalid role" });

    const existing = await User.findOne({ email: cleanEmail }).lean();
    if (existing) return res.status(409).json({ ok: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(cleanPassword, 12);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: cleanRole
    });

    const token = signToken(user);
    return res.status(201).json({
      ok: true,
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";

    if (!cleanEmail) return res.status(400).json({ ok: false, message: "Email is required" });
    if (!cleanPassword) return res.status(400).json({ ok: false, message: "Password is required" });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (!match) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    return res.json({
      ok: true,
      token,
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const id = req.user?.sub;
    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    return res.json({
      ok: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badges: user.badges
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;


