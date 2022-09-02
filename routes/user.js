const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const passport = require("passport");
const { validateUser, alreadyLoggedIn } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/register")
  .get(alreadyLoggedIn, userController.renderRegister)
  .post(validateUser, handleAsync(userController.registerUser));

router
  .route("/login")
  .get(alreadyLoggedIn, userController.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    handleAsync(userController.loginUser)
  );

router.get("/logout", userController.logout);

module.exports = router;
