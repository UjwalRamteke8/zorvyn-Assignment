import express from "express";
const router = express.Router();

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

// 1. IMPORT FIX: Mapped to the actual exported names in your middleware
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

// 2. AUTHENTICATION: All routes below this line require a valid token
router.use(authenticate);

// 3. AUTHORIZATION: Only "Admin" users can perform these actions
router
  .route("/")
  .get(authorizeRoles("Admin"), getUsers)
  .post(authorizeRoles("Admin"), createUser);

router
  .route("/:id")
  .put(authorizeRoles("Admin"), updateUser)
  .delete(authorizeRoles("Admin"), deleteUser);

export default router;
