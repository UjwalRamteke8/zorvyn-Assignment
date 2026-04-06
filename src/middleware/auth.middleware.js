import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// 1. AUTHENTICATION MIDDLEWARE: Verifies local JWT token
export const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 1. Verify the local token using your JWT_SECRET
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find the user in your database using the ID packed inside the token
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3. Attach user to the request so the controllers can use it
    req.user = user;
    next();
  } catch (error) {
    console.error("Token Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 2. AUTHORIZATION MIDDLEWARE: Restricts actions based on roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Safety check: Ensure the user object exists
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // 2. The Core Access Control Logic
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `As a '${req.user.role}', you do not have permission to access this resource. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    // 3. User has the correct role, allow them to proceed
    next();
  };
};
