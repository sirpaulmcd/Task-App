const jwt = require("jsonwebtoken");

/**
 * Generates a JWT.
 * @param {*} payload The poyload of the JWT.
 * @param {*} secret The secret of the JWT.
 * @param {*} durationString The duration of the JWT.
 * @returns Generated JWT.
 */
const generateJWT = (payload, secret, durationString = "1 minute") => {
  return jwt.sign(payload, secret, {
    expiresIn: durationString,
  });
};

/**
 * Appends input token to the input response as a cookie.
 * @param {*} res The response to be modified.
 * @param {*} cookieName The name of the cookie.
 * @param {*} token The JWT token corresponding to the cookie.
 * @param {*} path The path where the cookie will be sent in the req header.
 */
const appendTokenToResponseAsCookie = (res, cookieName, token, path) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    // secure: process.env.PRODUCTION,
    path: path,
    //domain: 'example.com', // set your domain
    overwrite: true,
  });
};

module.exports = {
  generateJWT,
  appendTokenToResponseAsCookie,
};
