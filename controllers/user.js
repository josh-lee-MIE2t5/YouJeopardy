const User = require("../models/user");
module.exports.renderRegister = (req, res) => {
  res.render("user/register", { tabTitle: "Sign Up" });
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login", { tabTitle: "Login" });
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome Back");
  res.redirect(req.session.returnTo);
};

module.exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/");
};
