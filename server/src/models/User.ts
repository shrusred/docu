// models/User.ts - Fixed version
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
  password?: string;
  googleId?: string;
  name?: string; // Add name field
  authProvider?: "local" | "google"; // Add auth provider
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String }, // Add name field to schema
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password ONLY for local auth users with passwords
userSchema.pre("save", async function (next) {
  const user = this as IUser & mongoose.Document;

  // Skip password hashing for OAuth users or if password isn't modified
  if (
    !user.isModified("password") ||
    !user.password ||
    user.authProvider === "google"
  ) {
    return next();
  }

  try {
    console.log("Hashing password for local user:", user.email);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    console.error("Password hashing error:", err);
    next(err as Error);
  }
});

// Compare passwords - only for local auth users
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser & mongoose.Document;

  // OAuth users don't have passwords to compare
  if (!user.password || user.authProvider === "google") {
    return false;
  }

  return bcrypt.compare(candidatePassword, user.password);
};

const User = model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);

export default User;
export type IUserDocument = mongoose.Document & IUser & IUserMethods;
