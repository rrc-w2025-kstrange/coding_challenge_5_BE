import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import resourcesRoutes from "./api/v1/routes/resourcesRoutes";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import adminRoutes from "./api/v1/routes/adminRoutes";
import setupSwagger from "./config/swaggerConfig";
import { getHelmetConfig } from "./config/helmetConfig";
import cors from "cors";


// Initialize Express application
const app: Express = express();

app.use(getHelmetConfig());
app.use(cors());

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
app.use("/api/v1/resources", resourcesRoutes);
app.use("/api/v1/admin", adminRoutes);


// Define a route
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

setupSwagger(app);
// Global error handling middleware
app.use(errorHandler);

export default app;