import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (userRole !== role && userRole !== "admin") return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}


