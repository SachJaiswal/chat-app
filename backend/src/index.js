import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });  // Load environment variables

import express from "express";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json()); // Parse JSON payloads
// extract the token from the request header and assign it to req.user

// Routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
    try {
        await connectDB(); // Ensure DB is connected before starting server
        app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
