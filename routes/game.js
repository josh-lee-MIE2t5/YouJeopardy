const express = require("express");
const router = express.Router();
const handleAsync = require("../utils/handleAsync");
const { validateGame, isLoggedIn, isAuthor } = require("../middleware");
const gameController = require("../controllers/game");
//game related routes
router
  .route("/")
  .get(handleAsync(gameController.index))
  .post(isLoggedIn, validateGame, handleAsync(gameController.makeNewGame));

//index page of all public games
router.get("/myGames", isLoggedIn, handleAsync(gameController.renderPrivates));

router.get("/searchGame", handleAsync(gameController.filterGames));

// renders the form for making a new game
router.get("/new", isLoggedIn, gameController.renderNewGameForm);

router
  .route("/:id")
  .get(handleAsync(gameController.renderSpecificGame))
  .put(isLoggedIn, isAuthor, validateGame, handleAsync(gameController.editGame))
  .delete(isLoggedIn, isAuthor, handleAsync(gameController.deleteGame));

//renders the edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  handleAsync(gameController.renderEditForm)
);

//renders the game to be played
router.get("/:id/play", handleAsync(gameController.playGame));

module.exports = router;
