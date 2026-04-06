import mongoose from "mongoose";

// Schema for financial records used by finance + dashboard APIs.
const financeRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    type: {
      type: String,
      required: [true, "Record type is required"],
      enum: ["Income", "Expense"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [250, "Description cannot exceed 250 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Record must be tied to a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for dashboard aggregation performance.
financeRecordSchema.index({ createdBy: 1, date: -1 });
financeRecordSchema.index({ type: 1 });
financeRecordSchema.index({ category: 1 });

const FinanceRecord = mongoose.model("FinanceRecord", financeRecordSchema);

export default FinanceRecord;

