const mongoose = require("mongoose");
const argon2 = require("argon2");

const { Schema } = mongoose;

const seatSchema = new Schema({
  seat_number: {
    type: String,
    required: true,
  },
  is_available: {
    type: Boolean,
    required: true,
    default: true,
  },
  user_id:{
    type : Schema.Types.ObjectId,
    ref: "user",
  }
});

const movieModel = new Schema(
  {
    movie_name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    show_date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    seats: {
      type: [seatSchema],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("movie", movieModel);
