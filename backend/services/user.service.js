const UserModel = require("../models/user.model");

module.exports.getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email: email });
  return user;
};
