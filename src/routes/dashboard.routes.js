import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// --- VIEWER LEVEL ---
// "A viewer should not be able to create or modify records (handled above) 
// but can only view dashboard data."
router.get(
  "/summary", 
  authorizeRoles("Viewer", "Analyst", "Admin"), // All roles can see summaries
  getDashboardSummary
);

export default router;