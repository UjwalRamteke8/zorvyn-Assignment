import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import financeRoutes from "./src/routes/finance.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import recordRoute from "./src/routes/record.route.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";
import userRoutes from "./src/routes/user.routes.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/records", financeRoutes);
app.use("/api/dashboard", dashboardRoutes); // <-- Mount dashboard routes
app.use("/api/records", recordRoute);
app.use("/api/users", userRoutes);
// 2. If no route matches, the 'notFound' middleware catches it
app.use(notFound);

// 3. Any errors thrown in your app will funnel into here
app.use(errorHandler);

// ... rest of your server setup ...
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
