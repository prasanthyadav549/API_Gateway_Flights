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

async function validateAuth(req, res, next) {
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

module.exports = {
  validateAuthRequest,
  validateAuth,
};
