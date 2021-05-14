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

const existingUserTwoId = new mongoose.Types.ObjectId();
const existingUserTwoAccessToken = jwt.sign(
  { _id: existingUserTwoId },
  process.env.ACCESS_TOKEN_SECRET
);
const existingUserTwoRefreshToken = jwt.sign(
  { _id: existingUserTwoId },
  process.env.REFRESH_TOKEN_SECRET
);
const existingUserTwo = {
  _id: existingUserTwoId,
  name: "William Butcher",
  username: "BillyBoy",
  email: "downwithsupes@cia.com",
  password: "test1234",
  refreshTokens: [
    {
      refreshToken: existingUserTwoRefreshToken,
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

/**
 * The `--runInBand` flag is used during testing because too many tests running
 * on the database async can result in duplicate errors.
 */
const initializeDatabase = async () => {
  // Clear database
  await User.deleteMany({}).exec();
  await Task.deleteMany({}).exec();
  // Add test users
  await new User(existingUserOne).save();
  await new User(existingUserTwo).save();
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
  existingUserTwo,
  existingUserTwoAccessToken,
  existingUserTwoRefreshToken,
};
