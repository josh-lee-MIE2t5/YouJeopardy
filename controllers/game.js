const Game = require("../models/game");

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
  const game = await Game.findById(req.params.id).populate("author");
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
