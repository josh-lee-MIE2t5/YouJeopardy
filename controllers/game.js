const Game = require("../models/game");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const paginate = require("../utils/paginate");

module.exports.index = async (req, res) => {
  if (!req.query.page) {
    const games = await Game.paginate(
      { access: "public" },
      { populate: "author" }
    );
    res.render("game/index", { tabTitle: "All Games", games });
  } else {
    const { page } = req.query;
    const games = await Game.paginate(
      { access: "public" },
      { populate: "author", page }
    );
    res.status(200).json(games);
  }
};

module.exports.makeNewGame = async (req, res) => {
  const { title, access, categories } = req.body;
  const game = new Game({ title, access, categories, author: req.user });
  await game.save();
  res.redirect(`/game/${game._id}`);
};

module.exports.renderPrivates = async (req, res) => {
  if (!req.query.page) {
    const games = await Game.paginate(
      { author: req.user._id },
      { populate: "author" }
    );
    res.render("game/private", { tabTitle: "My Games", games });
  } else {
    const { page } = req.query;
    const games = await Game.paginate(
      { author: req.user._id },
      { populate: "author", page }
    );
    res.status(200).json(games);
  }
};

module.exports.renderNewGameForm = (req, res) => {
  res.render("game/new", { tabTitle: "New Game" });
};

module.exports.renderSpecificGame = async (req, res) => {
  if (req.params.id.length === 24) {
    try {
      const game = await Game.findById(req.params.id).populate("author");
      if (game) {
        if (game.access === "public") {
          res.render("game/show", {
            tabTitle: game.title,
            game,
          });
        } else {
          if (game.author.equals(req.user))
            return res.render("game/show", {
              tabTitle: game.title,
              game,
            });

          req.flash("error", "You do not have permission to access that game");
          res.redirect("/game");
        }
      } else {
        throw new ExpressError("Page not found", 404);
      }
    } catch (e) {
      throw new ExpressError(e.message, 404);
    }
  } else {
    throw new ExpressError("Id invalid", 404);
  }
};

module.exports.editGame = async (req, res) => {
  const { id } = req.params;
  const { title, access, categories } = req.body;
  const game = await Game.findById(id);
  game.title = title;
  game.access = access;
  game.categories = categories;
  game.author = req.user;
  await game.save();
  req.flash("success", "Game successfully edited");
  res.redirect(`/game/${game._id}`);
};
module.exports.deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  req.flash("success", "Game Deleted");
  res.redirect("/game");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id);
  res.render("game/edit", { tabTitle: `Edit: ${game.title}`, game });
};

module.exports.playGame = async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.render("game/play", { tabTitle: `Play: ${game.title}`, game });
};

module.exports.filterGames = async (req, res) => {
  try {
    const { title, author, numOfCategories, numOfQuestions } = req.query;
    if (
      !title.length &&
      !author.length &&
      !numOfCategories.length &&
      !numOfQuestions.length
    ) {
      req.flash("error", "Please apply atleast one field on filter");
      res.redirect("/game");
    }
    const user = author.length
      ? await User.findOne({ username: { $regex: author } })
      : null;
    let searchOptions = [];
    if (title.length)
      searchOptions.push({ title: { $regex: title }, access: "public" });
    if (author.length) {
      searchOptions.push({
        author: user,
        access: "public",
      });
    }
    if (numOfCategories.length) {
      searchOptions.push({
        categories: { $size: parseInt(numOfCategories) },
        access: "public",
      });
    }
    if (numOfQuestions.length) {
      searchOptions.push({
        categories: {
          $elemMatch: { questions: { $size: parseInt(numOfQuestions) } },
        },
        access: "public",
      });
    }
    const gamesOrFilt = searchOptions.length
      ? await Game.find({ $or: searchOptions }).populate("author")
      : null;
    const gamesAndFilt = searchOptions.length
      ? await Game.find({ $and: searchOptions }).populate("author")
      : null;

    for (let game of gamesAndFilt) {
      for (let i = 0; i < gamesOrFilt.length; i++) {
        if (JSON.stringify(game) === JSON.stringify(gamesOrFilt[i]))
          gamesOrFilt.splice(i, 1);
      }
    }
    const games = [...gamesAndFilt, ...gamesOrFilt];
    let hasNextPg = true;

    if (games.length) {
      if (!req.query.page) {
        if (games.length < 11) {
          hasNextPg = false;
        }
        res.render("game/filtered", {
          tabTitle: "Search",
          games: { docs: paginate(games, 10, 1), hasNextPg },
          nextUrl: req.originalUrl + "&page=2",
        });
      } else {
        const { page } = req.query;

        hasNextPg =
          Math.ceil(games.length / 10) === parseInt(page) ? false : true;
        const nextPage = paginate(games, 10, page);
        res.status(200).json({ docs: nextPage, hasNextPg, page });
      }
    } else {
      req.flash("error", "No matches found to your search");
      res.redirect("/game");
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/game");
  }
};
