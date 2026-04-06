import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false, // ensure password isn't leaked unless explicitly requested
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Analyst", "Viewer"],
      default: "Viewer",
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    firebaseUid: {
      type: String,
      required: false,
      unique: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Hash password only if it exists and was modified.
// Hash password only if it exists and was modified.
userSchema.pre("save", async function () {
  // Removed 'next' here
  try {
    // If no password or not modified, just return to "proceed"
    if (!this.password || !this.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // In async hooks, simply finishing the function is the same as calling next()
  } catch (err) {
    // If there's an error, throw it so Mongoose catches it
    throw err;
  }
});

const User = mongoose.model("User", userSchema);

export default User;
