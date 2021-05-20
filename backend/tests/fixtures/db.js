const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectToDatabase = require("../../src/db/mongoose");
const Task = require("../../src/models/task");
const User = require("../../src/models/user");
const { generateJWT } = require("../../src/utils/tokens");

//#region User objects ========================================================

const userOneId = new mongoose.Types.ObjectId();
const userOneAccessToken = generateJWT(
  { _id: userOneId },
  process.env.ACCESS_TOKEN_SECRET
);
const userOneRefreshToken = generateJWT(
  { _id: userOneId },
  process.env.REFRESH_TOKEN_SECRET
);
const userOneEmailToken = generateJWT(
  { _id: userOneId },
  process.env.EMAIL_TOKEN_SECRET
);
const userOne = {
  _id: userOneId,
  name: "Michael Stevens",
  username: "Vsauce",
  email: "thisismyemail@orisit.com",
  password: "test1234",
  refreshTokens: [
    {
      refreshToken: userOneRefreshToken,
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwoAccessToken = generateJWT(
  { _id: userTwoId },
  process.env.ACCESS_TOKEN_SECRET
);
const userTwoRefreshToken = generateJWT(
  { _id: userTwoId },
  process.env.REFRESH_TOKEN_SECRET
);
const userTwo = {
  _id: userTwoId,
  name: "William Butcher",
  username: "BillyBoy",
  email: "downwithsupes@cia.com",
  password: "test1234",
  refreshTokens: [
    {
      refreshToken: userTwoRefreshToken,
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

//#region Task objects ========================================================

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task.",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task.",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task.",
  completed: false,
  owner: userTwo._id,
};

//#endregion

//#region Setup and Teardown ==================================================

/**
 * The `--runInBand` flag is used during testing because too many tests running
 * on the database async can result in duplicate errors.
 */
const initializeDatabase = async () => {
  // Clear database
  await User.deleteMany().exec();
  await Task.deleteMany().exec();
  // Add test users
  await new User(userOne).save();
  await new User(userTwo).save();
  // Add test tasks
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
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
  userOne,
  userOneAccessToken,
  userOneRefreshToken,
  userOneEmailToken,
  userTwo,
  userTwoAccessToken,
  userTwoRefreshToken,
  taskOne,
  taskTwo,
  taskThree,
};
