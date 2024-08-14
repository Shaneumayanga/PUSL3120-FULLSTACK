const MovieModel = require("../models/movies.model");
const mongoose = require("mongoose");
const { successResponse, failResponse } = require("../utils/response");

module.exports.createMovie = async (req, res) => {
  try {
    const movie = new MovieModel({
      movie_name: req.body.movie_name,
      image_url: req.body.image_url,
      price: req.body.price,
      show_date: new Date(req.body.show_date),
      venue: req.body.venue,
    });

    const saveResult = await movie.save();

    successResponse({ movie: saveResult }, res);
  } catch (error) {
    console.log("error", error);
  }
};

module.exports.listMovies = async (req, res) => {
  try {
    const moviesAll = await MovieModel.find({});
    successResponse({ movies: moviesAll }, res);
  } catch (error) {
    console.log("error", error);
  }
};

module.exports.deleteMovie = async (req, res) => {
  const body = req.body;
  const movie_id = body._id;

  const movie = await MovieModel.find({
    _id: new mongoose.Types.ObjectId(movie_id),
  });

  if (!movie) {
    return failResponse("Invalid movie ID", res);
  }

  if (movie.is_deleted) {
    return failResponse("Movie already deleted", res);
  }

  await MovieModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(movie_id),
    },
    {
      is_deleted: true,
    },
    {
      new: true,
    }
  );

  return res.send("movie deleted");
};

module.exports.getMovieById = async (req, res) => {
  const movie_id = req.params.id;

  const movie = await MovieModel.findOne({
    _id : new mongoose.Types.ObjectId(movie_id),
  });

  return successResponse({ movie: movie }, res);
};
