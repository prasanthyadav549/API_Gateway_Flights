const express = require("express");
const { UserController } = require("../../controllers");
const { SignupMiddlewares } = require("../../middlewares");

const router = express.Router();
// /api/v1/signup POST
router.post(
  "/",
  SignupMiddlewares.validateSignupRequest,
  UserController.signUp
);

module.exports = router;

/**
 * sequelize hook
 * salt_rounds in bcrypt
 */
