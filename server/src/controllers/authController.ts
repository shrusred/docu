import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1d";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Called from authRoutes on successful local login
export const loginUser = (req: Request, res: Response, user: IUserDocument) => {
  try {
    const token = signToken({ id: user._id });
    res.json({
      token,
      message: "Logged in successfully",
      user: { id: user._id, email: user.email },
    });
  } catch {
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
    const token = signToken({ id: user._id });
    // Redirect to frontend with token (adjust frontend URL as needed)
    res.redirect(`http://localhost:3000?token=${token}`);
  } catch {
    res.status(500).json({ message: "Failed to generate token" });
  }
};

// Protected profile route handler
export const getProfile = (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = req.user as IUserDocument;
  res.json({ user: { id: user._id, email: user.email } });
};

// Logout route (for JWT, usually handled client-side by deleting token)
export const logoutUser = (req: Request, res: Response) => {
  // Just respond OK; no server-side token invalidation here
  res.json({ message: "Logged out successfully" });
};
