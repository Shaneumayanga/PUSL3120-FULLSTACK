const Joi = require("joi");

const movieSchema = Joi.object({
  movie_name: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  price: Joi.string().required(),
  show_date: Joi.date().required(),
  venue: Joi.string().required(),
});

const deleteMovieSchema = Joi.object({
  _id: Joi.string().alphanum().min(24).max(24).required(),
});

const bookMovie = Joi.object({
  seats: Joi.array()
    .items(
      Joi.object({
        seat_number: Joi.string().required(),
      })
    )
    .required(),
  _id: Joi.string().alphanum().min(24).max(24).required(),
});

module.exports = {
  movieSchema,
  deleteMovieSchema,
  bookMovie,
};
