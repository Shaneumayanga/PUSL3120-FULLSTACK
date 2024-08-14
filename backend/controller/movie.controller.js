const MovieModel = require("../models/movies.model");
const mongoose = require("mongoose");
const { successResponse, failResponse } = require("../utils/response");

module.exports.createMovie = async (req, res) => {
  try {
    const seats = Array.from({ length: 30 }, (_, i) => ({
      seat_number: `Seat ${i + 1}`,
      is_available: true,
    }));

    const movie = new MovieModel({
      movie_name: req.body.movie_name,
      image_url: req.body.image_url,
      price: req.body.price,
      show_date: new Date(req.body.show_date),
      venue: req.body.venue,
      seats: seats,
    });

    const saveResult = await movie.save();

    successResponse({ movie: saveResult }, res);
  } catch (error) {
    console.log("error", error);
    failResponse("An error occurred while creating the movie", res);
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
    _id: new mongoose.Types.ObjectId(movie_id),
  });

  return successResponse({ movie: movie }, res);
};

module.exports.bookSeats = async (req, res) => {
  try {
    const user = res.locals.user;

    //user object :
    // user {
    //   user_id: '66bb8701daf01f84886be70e',
    //   iat: 1723657668,
    //   exp: 1723744068
    // }

    const seats = req.body.seats;
    const movie_id = req.body._id;

    const existingMovie = await MovieModel.findOne({
      _id: new mongoose.Types.ObjectId(movie_id),
    });

    if (!existingMovie) {
      return failResponse("Movie not found", res);
    }

    const arrayFilters = seats.map((seat, index) => ({
      [`elem${index}.seat_number`]: seat.seat_number,
    }));

    const updateObject = seats.reduce((acc, seat, index) => {
      acc[`seats.$[elem${index}].is_available`] = false;
      return acc;
    }, {});

    const movie = await MovieModel.findOneAndUpdate(
      { _id: movie_id },
      { $set: updateObject },
      {
        arrayFilters: arrayFilters,
        new: true,
      }
    );

    if (!movie) {
      return failResponse("Failed to update seats", res);
    }

    return successResponse("Seats booked successfully", res);
  } catch (error) {
    console.error("Error booking seats:", error);
    return failResponse(`Error: ${error.message}`, res);
  }
};


// module.exports.bookSeats = async (req, res) => {
//   try {
//     const user = res.locals.user;

//     //user object :
//     // user {
//     //   user_id: '66bb8701daf01f84886be70e',
//     //   iat: 1723657668,
//     //   exp: 1723744068
//     // }

//     const seats = req.body.seats;
//     const movie_id = req.body._id;

//     const existingMovie = await MovieModel.findOne({
//       _id: new mongoose.Types.ObjectId(movie_id),
//     });

//     if (!existingMovie) {
//       return failResponse("Movie not found", res);
//     }

//     const movie = await MovieModel.findOneAndUpdate(
//       { _id: movie_id },
//       {
//         $set: {
//           "seats.$[elem].is_available": false,
//         },
//       },
//       {
//         arrayFilters: seats.map((seat) => ({
//           "elem.seat_number": seat.seat_number,
//         })),
//         new: true,
//       }
//     );

//     return successResponse("success", res);
//   } catch (error) {
//     return failResponse(`${error}`, res);
//   }
// };
