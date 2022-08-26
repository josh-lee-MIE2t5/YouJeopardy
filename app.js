if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const User = require("./models/user");

//routers
const gameRoutes = require("./routes/game");
const userRoutes = require("./routes/user");

//mongo connection
mongoose.connect("mongodb://localhost:27017/youjeopardy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Mongo connected");
});

//configuring ejs and the views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//builtin express middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const secret = process.env.SESSION_SECRET || "averygoodsecret";

const sessionConfig = {
  secret,
  name: "session",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/register", "/logout"].includes(req.originalUrl)) {
    if (req.originalUrl) {
      if (req.originalUrl.includes("?page=")) {
        req.session.returnTo = "/game";
      } else {
        req.session.returnTo = req.originalUrl;
      }
    } else {
      req.session.returnTo = "/";
    }
  }
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/game", gameRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home", { tabTitle: "YouJeopardy" });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page does not exist", 404));
});

app.use((err, req, res, next) => {
  if (err) {
    const { status = 404, message = "Not Found" } = err;
    res.status(err.status).render("error", {
      tabTitle: "Page not found",
      error: `Status ${status}: ${message}`,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
