const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const Task = require("./task");
const {
  generateJWT,
  appendTokenToResponseAsCookie,
} = require("../utils/tokens");

//#region Schema ==============================================================

const userSchema = new mongoose.Schema(
  {
    //#region Public fields ---------------------------------------------------
    name: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
      validate(value) {
        if (!validator.isAlpha(value, ["en-US"], { ignore: " " })) {
          throw new Error("Name must only contain letters and spaces.");
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
    theme: { type: String, default: "LIGHT" },
    lists: {
      type: [{ type: String, required: true }],
      default: ["Default", "Personal", "Shopping", "Wishlist", "Work"],
    },
    //#endregion
    //#region Private fields --------------------------------------------------
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
      trim: true,
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Buffer,
    },
    refreshTokens: [
      {
        refreshToken: {
          type: String,
          required: true,
        },
      },
    ],
    //#endregion
  },
  {
    timestamps: true,
  }
);

//#endregion

//#region Instance methods ====================================================

/**
 * Generates a new access token.
 * @returns Access token string.
 */
userSchema.methods.generateAccessToken = function () {
  // Generate access token
  const user = this;
  const accessToken = generateJWT(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    "15 minutes"
  );
  return accessToken;
};

/**
 * Generates a new refresh jwt token and appends it to the response.
 * @param {*} res Response to be sent to the user.
 */
userSchema.methods.generateRefreshToken = async function (res) {
  // Generate refresh token
  const user = this;
  const refreshToken = generateJWT(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    "7 days"
  );
  // Save refresh token in database
  user.refreshTokens = user.refreshTokens.concat({ refreshToken });
  await user.save();
  // Append refresh token to response as cookies
  User.writeRefreshCookies(res, refreshToken);
};

/**
 * Generates new access and refresh tokens for the user. Returns access token
 * and appends refresh tokens as cookies on response.
 * @param {*} res Response sent to the user.
 * @returns Access token string.
 */
userSchema.methods.generateTokens = async function (res) {
  // Generate access and refresh tokens
  const user = this;
  await user.generateRefreshToken(res);
  return user.generateAccessToken();
};

/**
 * Deletes the current refresh token from the db and overwrites related cookies.
 * @param {*} currentRefreshToken Current, but aged, refresh token.
 * @param {*} res Response to be sent to the user.
 */
userSchema.methods.deleteRefreshToken = async function (currentRefreshToken) {
  const user = this;
  user.refreshTokens = user.refreshTokens.filter((refreshToken) => {
    return refreshToken.refreshToken !== currentRefreshToken;
  });
  await user.save();
};

/**
 * Removes invalid refresh tokens from the database. Typically used to check
 * whether stored tokens have expired.
 */
userSchema.methods.deleteInvalidRefreshTokens = async function () {
  const user = this;
  user.refreshTokens = user.refreshTokens.filter((refreshToken) => {
    try {
      jwt.verify(refreshToken.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  });
  await user.save();
};

/**
 * Deletes all of the user's refresh tokens from the database (i.e. logs them
 * out of all sessions).
 * @param {*} req Request sent by the user.
 * @param {*} res Response sent to the user.
 */
userSchema.methods.deleteAllRefreshTokens = async function (req) {
  // Delete all refresh tokens for user in database
  req.user.refreshTokens = [];
  await req.user.save();
};

/**
 * Verifies a password against the user.
 * @param {*} password The password to be verified.
 * @returns True if password is valid, false otherwise.
 */
userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

/**
 * Called whenever JSON.stringify() is used on this object. Used to hide
 * private fields when a user object is sent in the response.
 * @returns User object with only public fields.
 */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  delete userObject.avatar;
  delete userObject.verifiedEmail;
  return userObject;
};

//#endregion

//#region Static methods ======================================================

/**
 * Finds and returns a user given a username and password.
 * @param {*} email Email of the user.
 * @param {*} password Password of the user.
 * @returns User object associated with credentials.
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login.");
  }
  const passwordIsValid = await user.verifyPassword(password);
  if (!passwordIsValid) {
    throw new Error("Unable to login.");
  }
  return user;
};

/**
 * Writes/appends refresh token cookies to the response.
 * @param {*} res Response to be sent to the user.
 * @param {String} refreshToken Refresh token to be written.
 */
userSchema.statics.writeRefreshCookies = (res, refreshToken) => {
  appendTokenToResponseAsCookie(
    res,
    "refresh_jwt",
    refreshToken,
    "/users/refresh"
  );
  appendTokenToResponseAsCookie(
    res,
    "logout_jwt",
    refreshToken,
    "/users/logout"
  );
};

//#endregion

//#region References ==========================================================

/**
 * Virtually references users with their related tasks.
 */
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//#endregion

//#region Middleware ==========================================================

/**
 * Called before saving (not called when using findByIdAndUpdate). Used to hash
 * and salt password before storing in database.
 */
userSchema.pre("save", async function (next) {
  // Run before saving
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

/**
 * Called before removing. Used to delete a user's tasks when their account is
 * deleted.
 */
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

/**
 * Improves the error message for unique field enforcement.
 */
userSchema.plugin(uniqueValidator);

//#endregion

const User = mongoose.model("User", userSchema);
module.exports = User;
