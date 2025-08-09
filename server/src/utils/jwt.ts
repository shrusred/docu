import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Ensure JWT_SECRET is available and typed correctly
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Sign JWT Token
export const signToken = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify JWT Token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
