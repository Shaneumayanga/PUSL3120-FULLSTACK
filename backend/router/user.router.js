const express = require("express");

const router = express.Router();

const userController = require("../controller/user.controller");

const {
  userRegisterSchema,
  userloginSchema,
} = require("../validation/user.joi");

const validator = require("../middleware/validator");

router.post(
  "/login",
  validator.validateRequest(userloginSchema),
  userController.login
);

router.post(
  "/register",
  validator.validateRequest(userRegisterSchema),
  userController.register
);

module.exports = router;
