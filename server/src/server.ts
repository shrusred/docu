import dotenv from "dotenv";
dotenv.config();
// Add after dotenv.config() in server.ts
console.log("=== OAuth Debug Info ===");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "✓ Present" : "✗ Missing"
);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import "./config/passport"; // configures Passport strategies (Google etc.)
import mongoose from "mongoose";

const app = express();

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

// CORS setup (adjust origin to frontend URL)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add both possible frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Initialize Passport, but no sessions
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.send("✅ Server is running");
});

export default app;
