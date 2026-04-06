import express from "express";
import {
  register,
  login,
  getProfile,
  dashboardLogin, // FIXED: Renamed from departmentLogin
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// @access  Public
router.post("/register", register);

router.post("/login", login);

// Login routes MUST be public
router.post("/dashboard-login", dashboardLogin);
router.get("/me", authenticate, getProfile);

export default router;
