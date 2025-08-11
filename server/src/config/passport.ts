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
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
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
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email provided"), undefined);

          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            password: null, // no password for Google users
          });
        }

        done(null, user);
      } catch (error) {
        done(error as any, undefined);
      }
    }
  )
);

export default passport;
