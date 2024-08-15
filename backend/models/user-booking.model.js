const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieBookingSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  booked_movies: [
    {
      type: Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
  ],
});

const movieBooking = mongoose.model("movie_booking", movieBookingSchema);

module.exports = movieBooking;
