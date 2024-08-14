const express = require("express");

const router = express.Router();

const movieController = require("../controller/movie.controller");

const validator = require("../middleware/validator");

const { movieSchema, bookMovie } = require("../validation/movie.joi");

const { validateHeader } = require("../utils/jwt");

router.post(
  "/create",
  validator.validateRequest(movieSchema),
  movieController.createMovie
);

router.get("/list-movies", movieController.listMovies);
router.delete("/delete-movie", movieController.deleteMovie);
router.get("/get-movie-by-id/:id", movieController.getMovieById);

router.post(
  "/book-seats",
  validator.validateRequest(bookMovie),
  validateHeader(),
  movieController.bookSeats
);

module.exports = router;
