import { Router } from "express";
import {
  authenticateOfficer,
  issueOfficerToken,
  officerCredentialsConfigured,
  requireOfficer,
} from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  if (!officerCredentialsConfigured()) {
    return res.status(503).json({ message: "Login petugas belum dikonfigurasi di backend." });
  }

  const body = req.body || {};
  const username = String(body.username || "");
  const password = String(body.password || "");
  if (!authenticateOfficer(username, password)) {
    return res.status(401).json({ message: "Username atau password salah." });
  }

  res.json({
    token: issueOfficerToken(username, process.env.JWT_SECRET),
    username,
  });
});

router.get("/me", requireOfficer, (req, res) => {
  res.json({ username: process.env.OFFICER_USERNAME });
});

export default router;
