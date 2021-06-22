const cors = require("cors");

// Solves cors errors and enables cookies sent from browsers
var corsOptions = {
  origin: `${process.env.FRONTEND_URI}`,
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
