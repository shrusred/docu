import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Local Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You are authenticated!" });
});

export default router;
