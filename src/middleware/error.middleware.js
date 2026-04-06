// middleware/errorMiddleware.js

// 1. Fallback for undefined routes (404 Not Found)
export const notFound = (req, res, next) => {
    const error = new Error(`Route Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to the errorHandler below
  };
  
  // 2. Global Error Handler
  export const errorHandler = (err, req, res, next) => {
    // If the status code is still 200 but an error occurred, force it to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // --- SPECIFIC ERROR INTERCEPTIONS ---
  
    // Handle Mongoose Bad ObjectId (e.g., /api/records/12345)
    if (err.name === "CastError" && err.kind === "ObjectId") {
      statusCode = 404;
      message = "Resource not found. Invalid ID format.";
    }
  
    // Handle Mongoose Validation Errors (e.g., missing required fields in Schema)
    if (err.name === "ValidationError") {
      statusCode = 400;
      // Extract all validation messages and join them cleanly
      message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }
  
    // Handle Mongoose Duplicate Key Error (e.g., registering an email that already exists)
    if (err.code === 11000) {
      statusCode = 400;
      message = "Duplicate field value entered. This record already exists.";
    }
  
    // Send the final sanitized response
    res.status(statusCode).json({
      success: false,
      error: err.name,
      message: message,
      // Only show the stack trace if we are in development mode!
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };