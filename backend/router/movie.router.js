const express = require("express");

const router = express.Router();

const movieController = require("../controller/movie.controller");

const validator = require("../middleware/validator");

const { movieSchema } = require("../validation/movie.joi");

router.post(
  "/create",
  validator.validateRequest(movieSchema),
  movieController.createMovie
);

router.get("/list-movies", movieController.listMovies);
router.delete("/delete-movie", movieController.deleteMovie);
router.get("/get-movie-by-id/:id", movieController.getMovieById);

module.exports = router;
