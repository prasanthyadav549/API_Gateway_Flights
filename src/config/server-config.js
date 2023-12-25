const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALTED_ROUNDS: process.env.SALTED_ROUNDS,
};
