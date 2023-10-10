import cookieSession from "cookie-session";
import "dotenv/config";
import express, { RequestHandler } from "express";
import { readFileSync } from "fs";
import helmet from "helmet";
import { createServer } from "https";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { join } from "path";

declare global {
  namespace Express {
    interface User {
      id?: string;
    }
  }
}

const PORT = 3000;
const config = {
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1 as string,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2 as string,
};

const GOOGLE_AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

passport.use(
  new Strategy(GOOGLE_AUTH_OPTIONS, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id) done(null, id);
});

const SECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

const app = express();

app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: SECONDS_IN_A_DAY,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);
app.use(passport.initialize());
app.use(passport.session());

const checkLogin: RequestHandler = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    res.status(401).json({
      error: "Login first",
    });
  }
  next();
};

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
  }),
  (req, res) => {
    console.log("Google called us back");
  }
);

app.get("/failure", (req, res) => {
  res.send("Failed to login");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get("/auth/logout", (req, res) => {
  req.logOut(() => {
    console.log("Logged out...");
  });
  res.redirect("/");
});

app.get("/secret", checkLogin, (req, res) => {
  res.send("Your personal secret value is 30");
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/index.html"));
});

createServer(
  {
    key: readFileSync("key.pem"),
    cert: readFileSync("cert.pem"),
  },
  app
).listen(PORT, () => {
  console.log("Server listening...");
});
