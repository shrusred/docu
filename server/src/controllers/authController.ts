import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser, IUserMethods, IUserDocument } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signToken } from "../utils/jwt";
import { verifyToken } from "../utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as mongoose.Document &
      IUser &
      IUserMethods;

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken({ id: user._id });
    const decoded = verifyToken(token); // use inside middleware, etc.

    res.json({ token, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserDocument;

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.redirect(`http://localhost:3000?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: "Google OAuth failed" });
  }
};
