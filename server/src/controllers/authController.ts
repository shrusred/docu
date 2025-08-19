// authController.ts - Updated for new User model
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/User";

console.log("=== JWT SECRET DEBUG ===");
console.log("Raw JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
console.log("JWT_SECRET type:", typeof process.env);

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // Remove manual hashing - let the User model handle it
    const newUser = new User({
      email,
      password, // Don't hash here - the pre-save hook will handle it
      name,
      authProvider: "local",
    });
    await newUser.save();

    console.log("New local user registered:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Called from authRoutes on successful local login
export const loginUser = (req: Request, res: Response, user: IUserDocument) => {
  try {
    console.log("Local login successful for:", user.email);

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    res.json({
      token,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.email.split("@")[0], // Fallback if no name
      },
    });
  } catch (error) {
    console.error("Login token generation error:", error);
    res.status(500).json({ message: "Failed to generate token" });
  }
};

// Called from authRoutes on successful Google OAuth
export const googleAuthCallback = (
  req: Request,
  res: Response,
  user: IUserDocument
) => {
  try {
    console.log("Google OAuth callback for user:", user.email);

    const token = signToken({
      id: user._id,
      email: user.email,
    });

    // Create user object for frontend
    const userObj = {
      id: user._id,
      email: user.email,
      name: user.name || user.email.split("@")[0], // Fallback name
    };

    // Redirect to your frontend callback page
    const redirectURL = "http://localhost:5001/api/auth/google/callback";

    console.log("Redirecting OAuth user to:", redirectURL);
    res.redirect(redirectURL);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    res.redirect("http://localhost:3000/auth/login?error=oauth_failed");
  }
};

// Protected profile route handler
export const getProfile = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as IUserDocument;
    console.log("Profile requested for:", user.email);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.email.split("@")[0],
        authProvider: user.authProvider || "local",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout route
export const logoutUser = (req: Request, res: Response) => {
  console.log("User logged out");
  res.json({ message: "Logged out successfully" });
};
