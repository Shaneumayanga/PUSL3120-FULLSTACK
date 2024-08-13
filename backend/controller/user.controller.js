const UserModel = require("../models/user.model");

const userService = require("../services/user.service");
const { successResponse, failResponse } = require("../utils/response");

const { generateToken, validateToken } = require("../utils/jwt");

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
