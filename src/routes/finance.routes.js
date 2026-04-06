import express from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/finance.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateFinanceRecord, checkValidationResult } from "../middleware/validatorMiddleware.js";

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authenticate);

// -------------------------------------------------------------------
// ENFORCING ROLE-BASED ACCESS CONTROL (Core Requirement 4)
// -------------------------------------------------------------------

router
  .route("/")
  // Analyst and Admin can view filtered lists of records
  .get(authorizeRoles("Analyst", "Admin"), getRecords)
  // ONLY Admin can create new records
  .post(
    authorizeRoles("Admin"),
    validateFinanceRecord,
    checkValidationResult,
    createRecord
  );

router
  .route("/:id")
  // Analyst and Admin can view a specific record details
  .get(authorizeRoles("Analyst", "Admin"), getRecordById)
  // ONLY Admin can update existing records
  .put(authorizeRoles("Admin"), updateRecord)
  // ONLY Admin can delete records
  .delete(authorizeRoles("Admin"), deleteRecord);

export default router;