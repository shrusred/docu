import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import "./config/passport"; // configures Passport strategies (Google etc.)

const app = express();

// CORS setup (adjust origin to your frontend URL)
app.use(
  cors({
    origin: "http://localhost:3000",
    // credentials: true,  <-- usually false for JWT in Authorization header
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
