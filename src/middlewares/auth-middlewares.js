const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils/errors");
const { UserService } = require("../services");

async function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "something went wrong while signing up";
    ErrorResponse.error = new AppError(
      ["email is missing in the incoming request"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.password) {
    ErrorResponse.message = "something went wrong while signing up";
    ErrorResponse.error = new AppError(
      ["password is missing in the incoming request"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

async function checkAuth(req, res, next) {
  try {
    const response = await UserService.isAuthenticated(
      req.headers["x-access-token"]
    );
    if (response) {
      req.userId = response;
      next();
    }
  } catch (error) {
    console.log("error in verifying Auth", error);
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function isAdmin(req, res, next) {
  try {
    const admin = await UserService.isAdmin(req.userId);
    if (!admin) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not Authorized for this action" });
    }
    next();
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error);
  }
}

module.exports = {
  validateAuthRequest,
  checkAuth: checkAuth,
  isAdmin,
};
