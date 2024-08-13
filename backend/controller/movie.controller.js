const MovieModel = require("../models/movies.model");
const mongoose = require("mongoose");

module.exports.createMovie = async (req, res) => {
  try {
    console.log("createMovie - call");

    const movie = new MovieModel({
      movie_name: req.body.movie_name,
      image_url: req.body.image_url,
      price: req.body.price,
      show_date: new Date(req.body.show_date),
      venue: req.body.venue,
    });

    const saveResult = await movie.save();

    res.send(saveResult);
  } catch (error) {
    console.log("error", error);
  }
};

module.exports.listMovies = async (req, res) => {
  try {
    const moviesAll = await MovieModel.find({});
    res.send(moviesAll);
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
    return res.status(422).send({msg:"Invalid movie ID"});
  }

  if (movie.is_deleted) {
    return res.status(422).send({msg:"Movie already deleted"});
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
