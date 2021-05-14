const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectToDatabase = require("../../src/db/mongoose");
const Task = require("../../src/models/task");
const User = require("../../src/models/user");

//#region Test objects ========================================================

const existingUserOneId = new mongoose.Types.ObjectId();
const existingUserOneAccessToken = jwt.sign(
  { _id: existingUserOneId },
  process.env.ACCESS_TOKEN_SECRET
);
const existingUserOneRefreshToken = jwt.sign(
  { _id: existingUserOneId },
  process.env.REFRESH_TOKEN_SECRET
);
const existingUserOne = {
  _id: existingUserOneId,
  name: "Michael Stevens",
  username: "Vsauce",
  email: "thisismyemail@orisit.com",
  password: "test1234",
  refreshTokens: [
    {
      refreshToken: existingUserOneRefreshToken,
    },
  ],
};

const newUserCreationObject = {
  name: "Jeff Goldblum",
  username: "FlyGuy",
  email: "jeff@test.com",
  password: "test1234",
};

//#endregion

//#region Setup and Teardown ==================================================

const initializeDatabase = async () => {
  // Clear database of users and tasks
  await User.deleteMany({}).exec();
  await Task.deleteMany({}).exec();
  // Add existing user One
  await new User(existingUserOne).save();
};

const disconnectFromDatabase = async () => {
  await mongoose.disconnect();
};

//#endregion

module.exports = {
  connectToDatabase,
  initializeDatabase,
  disconnectFromDatabase,
  newUserCreationObject,
  existingUserOne,
  existingUserOneAccessToken,
  existingUserOneRefreshToken,
};
