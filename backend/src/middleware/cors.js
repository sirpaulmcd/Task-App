const cors = require("cors");

// Solves cors errors and enables cookies sent from browsers
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
