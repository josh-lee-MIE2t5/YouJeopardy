const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const passport = require("passport");
const User = require("../models/user");
const { validateUser } = require("../middleware");

router
  .route("/register")
  .get((req, res) => {
    res.render("user/register", { tabTitle: "Sign Up" });
  })
  .post(
    validateUser,
    handleAsync(async (req, res, next) => {
      try {
        const { username, password } = req.body;
        const user = new User({ username });
        const newUser = await User.register(user, password);
        req.logIn(newUser, (err) => {
          if (err) return next(err);
          req.flash("success", `Welcome new user: ${newUser.username}`);
          res.redirect("/game");
        });
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
      }
    })
  );

router
  .route("/login")
  .get((req, res) => {
    res.render("user/login", { tabTitle: "Login" });
  })
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    handleAsync(async (req, res) => {
      req.flash("success", "Welcome Back");
      res.redirect(req.session.returnTo);
    })
  );

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/");
});

module.exports = router;
