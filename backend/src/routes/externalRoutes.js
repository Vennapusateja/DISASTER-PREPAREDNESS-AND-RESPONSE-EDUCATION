import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/imd", authRequired, requireRole("admin"), async (req, res) => {
  return res.json({
    ok: true,
    source: "IMD (India Meteorological Department)",
    timestamp: new Date().toISOString(),
    alerts: [
      { id: "imd-001", type: "CYCLONE", severity: "RED", region: "Odisha Coast", message: "Super Cyclone 'Amphan-II' expected to make landfall in 48 hours." },
      { id: "imd-002", type: "FIRE_WEATHER", severity: "RED", region: "Rajasthan Hubs", message: "Extreme heatwave and dry winds. High risk of forest fires and urban structural fires." },
      { id: "imd-003", type: "FLOOD", severity: "ORANGE", region: "Brahmaputra Basin", message: "Heavy rainfall expected. River levels rising." }
    ]
  });
});

router.get("/fire-service", authRequired, requireRole("admin"), async (req, res) => {
  return res.json({
    ok: true,
    source: "State Fire Service (SFS)",
    timestamp: new Date().toISOString(),
    alerts: [
      { id: "sfs-001", type: "STRUCTURE_FIRE", severity: "CRITICAL", location: "Industrial Estate, Zone 4", message: "Large scale chemical fire reported. Multiple units dispatched." },
      { id: "sfs-002", type: "INSPECTION", severity: "INFO", location: "City Hospital", message: "Routine fire safety audit tomorrow at 10 AM." }
    ]
  });
});


router.get("/ndma", authRequired, requireRole("admin"), async (req, res) => {
  return res.json({
    ok: true,
    source: "NDMA (National Disaster Management Authority)",
    timestamp: new Date().toISOString(),
    activeGuidelines: [
      { disaster: "EARTHQUAKE", steps: ["Drop, Cover, Hold", "Stay away from glass", "Move to open ground if safe"] },
      { disaster: "FLOOD", steps: ["Move to high ground", "Switch off electricity", "Do not walk through moving water"] }
    ],
    emergencyContacts: {
      national_ndrf: "011-24363260",
      disaster_management_control: "1070",
      ambulance: "102",
      fire: "101"
    }
  });
});

router.get("/isro-bhuvan", authRequired, requireRole("admin"), async (req, res) => {
  return res.json({
    ok: true,
    source: "ISRO Bhuvan (Satellite Observation)",
    timestamp: new Date().toISOString(),
    layers: [
      { name: "Flood Inundation Map", status: "Active", lastUpdate: "15 mins ago", coverage: "Pan-India" },
      { name: "Landslide Hazard Zonation", status: "Active", lastUpdate: "1 hour ago", accuracy: "High" },
      { name: "Satellite Imagery (IRS-P6)", status: "Active", resolution: "5.8m", source: "Resourcesat" }
    ],
    hazard_hotspots: ["Sundarbans", "Western Ghats", "Teesta Valley"]
  });
});

export default router;
