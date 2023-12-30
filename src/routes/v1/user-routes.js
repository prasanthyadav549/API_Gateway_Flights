const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddlewares } = require("../../middlewares");

const router = express.Router();
// /api/v1/user/signup POST
router.post(
  "/signup",
  AuthMiddlewares.validateAuthRequest,
  UserController.signUp
);

// /api/v1/user/singin POST
router.post(
  "/signin",
  AuthMiddlewares.validateAuthRequest,
  UserController.signIn
);

// /api/v1/user/role POST
router.post(
  "/role",
  AuthMiddlewares.checkAuth,
  AuthMiddlewares.isAdmin,
  UserController.addRoleToUser
);

module.exports = router;
