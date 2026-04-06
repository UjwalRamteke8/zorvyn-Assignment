import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";

const router = express.Router();

// Get all records (Open to any authenticated user)
router.get("/", authenticate, getRecords);

// Create a record (Assuming you already have this)
router.post("/", authenticate, authorizeRoles("Admin", "Editor"), createRecord);

// Update a specific record by ID (Only Admins)
router.put("/:id", authenticate, authorizeRoles("Admin"), updateRecord);

// Delete a specific record by ID (Only Admins)
router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteRecord);

export default router;
