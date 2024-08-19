const UserModel = require("../models/user.model");

const userService = require("../services/user.service");
const { successResponse, failResponse } = require("../utils/response");
const mongoose = require("mongoose");

const { generateToken, validateToken } = require("../utils/jwt");
const UserBookingModel = require("../models/user-booking.model");

module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await userService.getUserByEmail(email);

  if (!user) {
    return failResponse("Invalid email or password", res);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return failResponse("Invalid email or password", res);
  }

  const token = generateToken({ user_id: user._id });

  return successResponse({ access_token: token }, res);
};

module.exports.register = async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    return failResponse("please try a different email", res);
  }

  const user = new UserModel({
    ...req.body,
  });

  await user.save();

  return successResponse({ user_name: user.name }, res);
};

module.exports.profileData = async (req, res) => {
  try {
    const user = res.locals.user;

    const user_id = user.user_id;

    const userByID = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(user_id),
    });

    return successResponse({ user: userByID }, res);
  } catch (error) {
    return failResponse(`${error.message}`, res);
  }
};

module.exports.getUserTickets = async (req, res) => {
  try {
    const user = res.locals.user;
    const user_id = user.user_id;

    const tickets = await UserBookingModel.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "booked_movies",
          foreignField: "_id",
          as: "tickets",
        },
      },
      {
        $unwind: "$tickets",
      },
      {
        $addFields: {
          seats: {
            $filter: {
              input: "$tickets.seats",
              as: "seat",
              cond: {
                $eq: ["$$seat.user_id", new mongoose.Types.ObjectId(user_id)],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          tickets: { $push: "$tickets" },
          seats: { $push: "$seats" },
        },
      },
    ]);

    return successResponse({ tickets: tickets }, res);
  } catch (error) {
    return failResponse(`${error.message}`, res);
  }
};
