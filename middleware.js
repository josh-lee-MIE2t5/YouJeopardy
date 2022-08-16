const { gameSchema, userSchema } = require("./schema");
const Game = require("./models/game");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

module.exports.validateGame = function (req, res, next) {
  const { error } = gameSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 404);
  } else {
    next();
  }
};

module.exports.validateUser = function (req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 404);
  } else {
    next();
  }
};

module.exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Must be logged in");
    res.redirect("/login");
  }
};

module.exports.isAuthor = async function (req, res, next) {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game.author.equals(req.user._id)) {
      req.flash("error", "You do not have permissions for that");
      return res.redirect(`/game/${id}`);
    }
    next();
  } catch (e) {
    res.send("error", { tabTitle: "Error", error: e });
  }
};
