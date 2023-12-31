const { UserRepository, RoleRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { Auth, Enums } = require("../utils/common");
const { ServerConfig } = require("../config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/server-config");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const { CUSTOMER, ADMIN } = Enums.USER_ROLES_ENUMS;

async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName(CUSTOMER);
    console.log("role:", role);
    user.addRole(role);
    return user;
  } catch (error) {
    console.log("error in user service create method", error);
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "ValidationError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create new User object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signIn(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "No user found for the given email",
        StatusCodes.NOT_FOUND
      );
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid password", StatusCodes.NOT_FOUND);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    throw new AppError(
      "something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing JWT token", StatusCodes.BAD_REQUEST);
    }
    const response = Auth.verifyToken(token);
    const user = await userRepository.get(response.id);
    if (!user) {
      throw new AppError(
        "No user found for this token",
        StatusCodes.BAD_REQUEST
      );
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("token expired", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "something went wrong while verifying the token",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function addRoleToUser(data) {
  try {
    const user = await userRepository.get(data.id);
    if (!user) {
      throw new AppError(
        "no user found with the given id",
        StatusCodes.NOT_FOUND
      );
    }
    const adminRole = await roleRepository.getRoleByName(data.role);
    if (!adminRole) {
      throw new AppError(
        "No user found with the given role",
        StatusCodes.NOT_FOUND
      );
    }
    user.addRole(adminRole);
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAdmin(id) {
  try {
    const user = await userRepository.get(id);
    if (!user) {
      throw new AppError(
        "no user found with the given id",
        StatusCodes.NOT_FOUND
      );
    }
    const adminRole = await roleRepository.getRoleByName(ADMIN);
    if (!adminRole) {
      throw new AppError(
        "No user found with the given role",
        StatusCodes.NOT_FOUND
      );
    }
    return user.hasRole(adminRole);
  } catch (error) {}
}
module.exports = {
  createUser,
  signIn,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
};
