import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import adminRoutes from "./api/v1/routes/adminRoutes";
import authRoutes from "./api/v1/routes/authRoutes";

// Initialize Express application
const app: Express = express();

// Logging middleware 
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

app.use(express.json());

// Route handler
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);



// Define a route
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// Global error handling middleware
app.use(errorHandler);

export default app;