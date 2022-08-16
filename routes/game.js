const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const handleAsync = require("../utils/handleAsync");
const { validateGame, isLoggedIn, isAuthor } = require("../middleware");
//game related routes
router
  .route("/")
  .get(
    handleAsync(async (req, res) => {
      const games = await Game.find({ access: "public" }).populate("author");
      if (req.user) {
        const yourGames = await Game.find({ author: req.user._id }).populate(
          "author"
        );
        return res.render("game/index", {
          tabTitle: "All Games",
          games,
          yourGames,
        });
      }
      res.render("game/index", { tabTitle: "All Games", games });
    })
  )
  .post(
    isLoggedIn,
    validateGame,
    handleAsync(async (req, res) => {
      const { title, access, categories } = req.body;
      const game = new Game({ title, access, categories, author: req.user });
      await game.save();
      res.redirect(`/game/${game._id}`);
    })
  );

// renders the form for making a new game
router.get("/new", isLoggedIn, (req, res) => {
  res.render("game/new", { tabTitle: "New Game" });
});

router
  .route("/:id")
  .get(
    handleAsync(async (req, res) => {
      const game = await Game.findById(req.params.id).populate("author");
      res.render("game/show", {
        tabTitle: game.title,
        game,
      });
    })
  )
  .put(
    isLoggedIn,
    isAuthor,
    validateGame,
    handleAsync(async (req, res) => {
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
    })
  )
  .delete(
    isLoggedIn,
    isAuthor,
    handleAsync(async (req, res) => {
      await Game.findByIdAndDelete(req.params.id);
      res.redirect("/game");
    })
  );

//renders the edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id);
    res.render("game/edit", { tabTitle: `Edit: ${game.title}`, game });
  })
);

//renders the game to be played
router.get(
  "/:id/play",
  handleAsync(async (req, res) => {
    const game = await Game.findById(req.params.id);
    res.render("game/play", { tabTitle: `Play: ${game.title}`, game });
  })
);

module.exports = router;
