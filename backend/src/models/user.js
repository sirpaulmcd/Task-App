const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
    validate(value) {
      if (!validator.isAlpha(value, ["en-US"], { ignore: " " })) {
        throw new Error("Name must only contain letters.");
      }
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 50,
    trim: true,
    validate(value) {
      if (!validator.isAlphanumeric(value)) {
        throw new Error("Username must only contain letters and numbers.");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email must be of valid format.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
    trim: true,
  },
  refreshTokens: [
    {
      refreshToken: {
        type: String,
        required: true,
      },
    },
  ],
});

const writeRefreshCookies = (res, refreshToken) => {
  res.cookie("refresh_jwt", refreshToken, {
    httpOnly: true,
    // secure: process.env.PRODUCTION,
    path: "/users/refresh",
    //domain: 'example.com', //set your domain
  });
  res.cookie("logout_jwt", refreshToken, {
    httpOnly: true,
    // secure: process.env.PRODUCTION,
    path: "/users/logout",
    //domain: 'example.com', //set your domain
  });
};

userSchema.methods.generateRefreshToken = async function (res) {
  const user = this;
  // Generate refresh token
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7 days" }
  );
  // Save refresh token in database
  user.refreshTokens = user.refreshTokens.concat({ refreshToken });
  await user.save();
  // Append refresh token to response as cookies
  writeRefreshCookies(res, refreshToken);
};

userSchema.methods.deleteRefreshToken = async function (
  currentRefreshToken,
  res
) {
  const user = this;
  // Remove current refresh token from database
  user.refreshTokens = user.refreshTokens.filter((refreshToken) => {
    return refreshToken.refreshToken !== currentRefreshToken;
  });
  await user.save();
  // Overwrite cookie refresh tokens with blank string
  writeRefreshCookies(res, "");
};

userSchema.methods.deleteAllRefreshTokens = async function (req, res) {
  // Delete all refresh tokens for user in database
  req.user.refreshTokens = [];
  await req.user.save();
  // Overwrite cookie refresh tokens with blank string
  writeRefreshCookies(res, "");
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  const user = this;
  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15 minutes" }
  );
  return accessToken;
};

// Generate access and refresh tokens
userSchema.methods.generateTokens = async function (res) {
  const user = this;
  await user.generateRefreshToken(res);
  return user.generateAccessToken();
};

// Reusable find by credentials method for user model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login.");
  }
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    throw new Error("Unable to login.");
  }
  return user;
};

// Run before saving (not called when using findByIdAndUpdate)
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

// Improve unique enforcement error messages
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;
