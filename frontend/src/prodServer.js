const express = require("express");
const path = require("path");

const app = express();

// When site is visited, serve production files from build directory
app.use(express.static(path.join(__dirname, "../", "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

app.listen(process.env.REACT_APP_FRONTEND_PORT);

console.log(
  "Frontend production server connected on port:",
  process.env.REACT_APP_FRONTEND_PORT
);
