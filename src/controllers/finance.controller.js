import asyncHandler from "express-async-handler";
import FinanceRecord from "../models/finance.model.js";

// @access  Private/Admin
export const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, description } = req.body;

  // Basic Validation
  if (!amount || !type || !category) {
    return res.status(400).json({ message: "Amount, type, and category are required fields." });
  }

  // Create the record and link it to the Admin who created it
  const record = await FinanceRecord.create({
    amount,
    type,
    category,
    date: date || Date.now(),
    description,
    createdBy: req.user._id, // Tied to the authenticated user from the middleware
  });

  res.status(201).json({
    success: true,
    message: "Financial record created successfully",
    data: record,
  });
});


// @access  Private/Admin & Analyst
export const getRecords = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

  // 1. Build dynamic query object for Filtering
  const query = {};

  if (type) query.type = type;
  if (category) query.category = category;

  // Date filtering using MongoDB operators
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // 2. Pagination Logic (Optional Enhancement from Assignment)
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 3. Execute query
  const records = await FinanceRecord.find(query)
    .populate("createdBy", "name email") // Populates user details
    .sort({ date: -1 }) // Sort by newest first
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination metadata
  const total = await FinanceRecord.countDocuments(query);

  res.status(200).json({
    success: true,
    count: records.length,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
    data: records,
  });
});


// @access  Private/Admin & Analyst
export const getRecordById = asyncHandler(async (req, res) => {
  const record = await FinanceRecord.findById(req.params.id).populate("createdBy", "name email");

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  res.status(200).json({ success: true, data: record });
});

// @access  Private/Admin
export const updateRecord = asyncHandler(async (req, res) => {
  let record = await FinanceRecord.findById(req.params.id);

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  // Update the record. runValidators ensures enum constraints (Income/Expense) are still enforced
  record = await FinanceRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: record,
  });
});

// @desc    Delete a financial record
// @route   DELETE /api/records/:id
// @access  Private/Admin
export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinanceRecord.findById(req.params.id);

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  await record.deleteOne();

  res.status(200).json({
    success: true,
    message: "Record deleted successfully",
  });
});