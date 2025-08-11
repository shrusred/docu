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
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });

      // Login successful, generate JWT token
      loginUser(req, res, user);
    }
  )(req, res, next);
});

// Google OAuth login start
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback route with session disabled
router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/api/auth/login" },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/api/auth/login");

      // Successful Google login, generate JWT and respond
      googleAuthCallback(req, res, user);
    }
  )(req, res, next);
});

// Protected route - JWT verified
router.get("/profile", authenticateToken, getProfile);

// Logout route - mostly client side with JWT, but if you want, you can implement token blacklist
router.get("/logout", logoutUser);

export default router;
