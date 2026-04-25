import mongoose from "mongoose";

const ROLES = ["student", "faculty", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 80 },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "student", index: true },

    points: { type: Number, default: 0, min: 0 },
    badges: { type: [String], default: [] },

    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const USER_ROLES = ROLES;

