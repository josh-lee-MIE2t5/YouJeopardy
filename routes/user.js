const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const passport = require("passport");
const User = require("../models/user");
const { validateUser } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/register")
  .get(userController.renderRegister)
  .post(validateUser, handleAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    handleAsync(userController.loginUser)
  );

router.get("/logout", userController.logout);

module.exports = router;
