// 1. GET ALL RECORDS (Read)
import Record from "../models/Record.js"; // Adjust path if needed

// CREATE A RECORD (Create)
export const createRecord = async (req, res) => {
  try {
    // Creates a new record in the database using the data sent in the request body
    const newRecord = await Record.create(req.body);

    res.status(201).json({
      success: true,
      message: "Financial record created successfully",
      data: newRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create record",
      error: error.message,
    });
  }
};
// 1. GET ALL RECORDS (Read)
export const getRecords = async (req, res) => {
  try {
    // Fetches all records, sorted by date (newest first)
    const records = await Record.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 2. UPDATE A RECORD (Update)
export const updateRecord = async (req, res) => {
  try {
    // Finds the record by the ID in the URL and updates it with the request body
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the new data matches your schema rules
    });

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Record updated", data: record });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 3. DELETE A RECORD (Delete)
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
