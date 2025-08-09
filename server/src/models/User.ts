import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
  password?: string;
  googleId?: string;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema definition (model: doc, statics, methods)
const userSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
});

// Hash password if modified
userSchema.pre("save", async function (next) {
  const user = this as IUser & mongoose.Document;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password!, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser & mongoose.Document;
  if (!user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

const User = model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);

export default User;
export type IUserDocument = mongoose.Document & IUser & IUserMethods;

export { IUser, IUserMethods };
