const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils/errors");

async function validateSignupRequest(req, res, next) {
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

module.exports = {
  validateSignupRequest,
};
