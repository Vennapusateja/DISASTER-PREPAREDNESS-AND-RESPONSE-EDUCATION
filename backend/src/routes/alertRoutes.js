import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { sendSMS } from "../services/twilioService.js";
import { Alert } from "../models/Alert.js";
import { User } from "../models/User.js";

export default function createAlertRoutes({ broadcast }) {
  const router = express.Router();

  // Broadcast a new alert (Admin only)
  router.post("/broadcast", authRequired, requireRole("admin"), async (req, res, next) => {
    try {
      const { title, message, severity, sms } = req.body || {};

      const alert = await Alert.create({
        title: title || "Alert",
        message: message || "",
        severity: severity || "Medium",
        sender: req.user.sub,
        smsSent: (sms?.enabled)
      });

      const event = {
        type: "alert",
        id: String(alert._id),
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        time: alert.createdAt.toISOString()
      };

      // Real-time broadcast via WebSocket
      broadcast(event);

      const smsResult = [];
      if (alert.smsSent) {
        // If specific numbers provided, use them; otherwise, send to all students with phones
        let recipients = sms.to;
        if (!Array.isArray(recipients) || recipients.length === 0) {
            const students = await User.find({ role: "student" }).select("phoneNumber").lean();
            recipients = students.map(s => s.phoneNumber).filter(Boolean);
        }

        const body = sms.body || `[DISASTER.OS] ${event.severity} ALERT: ${event.message}`.trim();
        for (const to of recipients) {
          try {
            const r = await sendSMS({ to, body });
            smsResult.push({ to, ok: true, sid: r.sid });
          } catch (err) {
            smsResult.push({ to, ok: false, error: err.message });
          }
        }
      }

      return res.json({ ok: true, alert: event, smsResult });
    } catch (err) {
      next(err);
    }
  });

  // Acknowledge an alert (Student/Faculty)
  router.post("/:alertId/acknowledge", authRequired, async (req, res, next) => {
    try {
      const { alertId } = req.params;
      const userId = req.user.sub;

      const alert = await Alert.findById(alertId);
      if (!alert) return res.status(404).json({ ok: false, message: "Alert not found" });

      if (!alert.acknowledgedBy.includes(userId)) {
        alert.acknowledgedBy.push(userId);
        await alert.save();
      }

      return res.json({ ok: true, message: "Alert acknowledged" });
    } catch (err) {
      next(err);
    }
  });

  // Get stats for Admin Dashboard
  router.get("/stats", authRequired, requireRole("admin"), async (req, res, next) => {
    try {
      const totalAlerts = await Alert.countDocuments();
      const studentCount = await User.countDocuments({ role: "student" });

      const alerts = await Alert.find().lean();
      
      let totalAcks = 0;
      let totalResponseTime = 0;
      let alertsWithAcks = 0;

      const alertMetrics = alerts.map(a => {
         const acks = a.acknowledgedBy.length;
         const rate = studentCount > 0 ? (acks / studentCount) * 100 : 0;
         totalAcks += acks;
         
         return {
            id: a._id,
            title: a.title,
            severity: a.severity,
            acks,
            rate: Math.round(rate),
            time: a.createdAt
         };
      });

      const avgAckRate = alerts.length > 0 ? (totalAcks / (alerts.length * studentCount)) * 100 : 0;

      return res.json({
        ok: true,
        summary: {
            totalAlerts,
            avgAckRate: Math.round(avgAckRate),
            studentCount
        },
        alerts: alertMetrics.sort((a,b) => b.time - a.time).slice(0, 10)
      });
    } catch (err) {
      next(err);
    }
  });

  // Get unacknowledged alerts for the current user
  router.get("/pending", authRequired, async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const alerts = await Alert.find({
        acknowledgedBy: { $ne: userId }
      }).sort({ createdAt: -1 }).limit(5);

      return res.json({ 
        ok: true, 
        alerts: alerts.map(a => ({
          id: String(a._id),
          title: a.title,
          message: a.message,
          severity: a.severity,
          time: a.createdAt
        }))
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
