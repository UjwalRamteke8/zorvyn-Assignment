import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// --- TOKEN GENERATION ---
export const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// --- REGISTER USER ---

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Validation: Ensure all fields are provided
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  // 3. Enforce valid roles (Defaults to 'Viewer' to prevent unauthorized Admin creation via API)
  const assignedRole = ["Admin", "Analyst", "Viewer"].includes(role)
    ? role
    : "Viewer";

  // 4. Create user
  // NOTE: Password hashing is handled automatically by the Mongoose pre-save hook we created
  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    status: "Active", // Default status
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token: createToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// --- LOGIN USER ---
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and password" });
  }

  // 2. Find user and explicitly select the password field for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // 3. Verify password using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // 4. Status Check [Core Requirement: Managing user status]
  // Reject login if an Admin has deactivated the account
  if (user.status === "Inactive") {
    return res
      .status(403)
      .json({
        message: "Your account is deactivated. Please contact an Admin.",
      });
  }

  // 5. Send successful response
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    token: createToken(user._id, user.role),
  });
});

// @desc  Get the authenticated user's profile
// @route GET /api/auth/me
export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
    },
  });
});
// --- THE FIXED FUNCTION FOR ZORVYN ASSIGNMENT ---
export const dashboardLogin = asyncHandler(async (req, res) => {
  // Removed 'department' from req.body as it's no longer relevant
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 1. Check for valid Finance Dashboard roles
    if (!["Admin", "Analyst", "Viewer"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Invalid role assignment" });
    }

    // 2. Check user status (Core Requirement 1: Managing user status)
    if (user.status === "Inactive") {
      return res
        .status(403)
        .json({ message: "Access denied: Account is currently inactive" });
    }

    // 3. Return the sanitized user object
    // 3. Return the sanitized user object AND the new local token
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token: createToken(user._id, user.role), // 🔥 THIS IS THE MAGIC LINE
    });
  } catch (err) {
    console.error("Verify user error:", err);
    return res
      .status(401)
      .json({ message: "Invalid token or authentication error" });
  }
});
