// authRoutes.ts - Updated with debugging
import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
  logoutUser,
  getProfile,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Local Auth - register route
router.post("/register", registerUser);

// Local Auth - login route with Passport local strategy, session disabled
router.post("/login", (req, res, next) => {
  console.log("=== Local Login Attempt ===");
  console.log("Email:", req.body.email);

  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      console.log("=== Local Login Result ===");
      console.log("Error:", err);
      console.log("User:", user ? user.email : null);
      console.log("Info:", info);

      if (err) {
        console.error("Local login error:", err);
        return next(err);
      }

      if (!user) {
        console.log("Local login failed:", info?.message);
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });
      }

      // Login successful, generate JWT token
      console.log("Local login successful, generating token");
      loginUser(req, res, user);
    }
  )(req, res, next);
});

// Google OAuth login start
router.get(
  "/google",
  (req, res, next) => {
    console.log("=== Starting Google OAuth ===");
    console.log("Request URL:", req.url);
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback route with enhanced debugging
router.get("/google/callback", (req, res, next) => {
  console.log("=== Google OAuth Callback Route Hit ===");
  console.log("Full URL:", req.url);
  console.log("Query params:", req.query);
  console.log("Query code:", req.query.code ? "✓ Present" : "✗ Missing");
  console.log("Query scope:", req.query.scope);

  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: "http://localhost:3000/auth/login?error=auth_failed",
    },
    (err, user, info) => {
      console.log("=== Passport Google Authenticate Result ===");
      console.log("Error:", err);
      console.log(
        "User:",
        user
          ? {
              id: user._id,
              email: user.email,
              name: user.name,
            }
          : null
      );
      console.log("Info:", info);

      if (err) {
        console.error("=== Passport Google Authentication Error ===");
        console.error("Error type:", err.constructor.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        return res.redirect(
          "http://localhost:3000/auth/login?error=passport_error"
        );
      }

      if (!user) {
        console.error("=== No User Returned from Google OAuth ===");
        console.error("Info object:", info);
        return res.redirect("http://localhost:3000/auth/login?error=no_user");
      }

      // Successful Google login, generate JWT and respond
      console.log("=== Google OAuth Success - Calling Controller ===");
      console.log("User for callback:", {
        id: user._id,
        email: user.email,
        name: user.name,
        authProvider: user.authProvider,
      });

      googleAuthCallback(req, res, user);
    }
  )(req, res, next);
});

// Protected route - JWT verified
router.get("/profile", authenticateToken, getProfile);

// Logout route
router.get("/logout", logoutUser);

// Health check for auth routes
router.get("/health", (req, res) => {
  res.json({
    message: "Auth routes working",
    timestamp: new Date().toISOString(),
    environment: {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
  });
});

export default router;
