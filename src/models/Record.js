import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
    type: {
      type: String,
      required: [true, "Please add a type (e.g., Income, Expense)"],
    },
    category: {
      type: String,
      required: [true, "Please add a category (e.g., Food, Salary, Utilities)"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  },
);

const Record = mongoose.model("Record", recordSchema);

export default Record;
