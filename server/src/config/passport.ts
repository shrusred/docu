// passport.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "../models/User";

// ---------
// Local Strategy (email + password)
// ---------
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("Local login: User not found:", email);
          return done(null, false, { message: "User not found" });
        }

        // Use the model's comparePassword method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          console.log("Local login: Incorrect password for:", email);
          return done(null, false, { message: "Incorrect password" });
        }

        console.log("Local login successful for:", email);
        return done(null, user);
      } catch (err) {
        console.error("Local strategy error:", err);
        return done(err);
      }
    }
  )
);

// ---------
// Google OAuth Strategy
// ---------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        console.log(
          "Google OAuth for profile:",
          profile.id,
          profile.emails?.[0]?.value
        );

        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error("No email provided in Google profile");
          return done(new Error("No email provided"), undefined);
        }

        // First check by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with same email (from local registration)
          user = await User.findOne({ email });

          if (user) {
            // Update existing user with Google info
            console.log("Updating existing user with Google data:", email);
            user.googleId = profile.id;
            user.name = user.name || profile.displayName;
            user.authProvider = "google";
            await user.save();
          } else {
            // Create new Google user
            console.log("Creating new Google user:", email);
            user = await User.create({
              googleId: profile.id,
              email,
              name: profile.displayName,
              authProvider: "google",
            });
          }
        }

        console.log("Google OAuth successful for:", email);
        done(null, user);
      } catch (error) {
        console.error("Google OAuth strategy error:", error);
        done(error as any, undefined);
      }
    }
  )
);

export default passport;
