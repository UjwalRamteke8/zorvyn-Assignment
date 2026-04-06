// middleware/validatorMiddleware.js
import { body, validationResult } from "express-validator";

// 1. Define the validation rules for creating/updating a record
export const validateFinanceRecord = [
  body("amount")
    .isNumeric().withMessage("Amount must be a valid number")
    .isFloat({ gt: 0 }).withMessage("Amount must be greater than zero"),
  
  body("type")
    .isIn(["Income", "Expense"]).withMessage("Type must be exactly 'Income' or 'Expense'"),
  
  body("category")
    .notEmpty().withMessage("Category is required")
    .trim(),
  
  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid ISO 8601 format (e.g., YYYY-MM-DD)"),
];

// 2. Middleware to check the results of the rules above
export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 400 Bad Request if validation fails
    return res.status(400).json({
      success: false,
      message: "Input validation failed",
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};