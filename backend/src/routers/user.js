const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");

const auth = require("../middleware/auth");
const User = require("../models/user");
const { sendForgotPasswordEmail } = require("../emails/account");

const router = new express.Router();

//#region File upload settings ================================================

const upload = multer({
  limits: {
    fileSize: 1000000, // 1Mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Uploaded file must be of type jpg, jpeg, or png."));
    }
    cb(undefined, true);
  },
});

//#endregion

//#region Public routes =======================================================

/**
 * Register user
 */
router.post("/users", async (req, res) => {
  try {
    // Check that only valid properties exist on request
    const requestProperties = Object.keys(req.body);
    const validProperties = ["name", "username", "email", "password"];
    const requestPropertiesAreValid = requestProperties.every((property) => {
      return validProperties.includes(property);
    });
    if (!requestPropertiesAreValid) {
      return res
        .status(400)
        .send({ error: "Attempted to create user with invalid property." });
    }
    // Create new user and save in db
    const user = new User(req.body);
    const accessToken = await user.generateTokens(res);
    res.status(201).send({ user, accessToken });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Login user
 */
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const accessToken = await user.generateTokens(res);
    res.send({ user, accessToken });
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Renew access/refresh tokens
 */
router.post("/users/refresh", async (req, res) => {
  try {
    // Verify refresh token
    const refreshToken = req.cookies.refresh_jwt;
    if (!refreshToken) {
      throw new Error();
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({
      _id: payload._id,
      "refreshTokens.refreshToken": refreshToken,
    });
    if (!user) {
      throw new Error();
    }
    // Delete invalid/expired refresh tokens for user
    await user.deleteInvalidRefreshTokens();
    // Delete current refresh token
    req.user = user;
    await user.deleteRefreshToken(refreshToken, res);
    // Generate and return new access and refresh tokens (extend expiration period)
    const accessToken = await user.generateTokens(res);
    res.send({ user, accessToken });
  } catch (error) {
    res.status(401).send({ error: "Not authenticated." });
  }
});

/**
 * Verify email
 */
router.get("/users/verification/:token", async (req, res) => {
  try {
    // Verify token
    const payload = jwt.verify(
      req.params.token,
      process.env.VERIFY_EMAIL_TOKEN_SECRET
    );
    // Get user associated with token
    const user = await User.findById(payload._id);
    if (!user) {
      throw new Error();
    }
    // Indicate email has been verified
    user.verifiedEmail = true;
    await user.save();
    // TODO: Redirect to desired frontend page
    res.redirect("http://localhost:3000");
  } catch (error) {
    res.status(401).send();
  }
});

/**
 * Request password reset email
 */
router.post("/users/password/forgot", async (req, res) => {
  try {
    // Check if user with email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error();
    }
    // Send password reset email
    sendForgotPasswordEmail(user);
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Reset password
 */
router.post("/users/password/reset", async (req, res) => {
  try {
    // Verify token
    const payload = jwt.verify(
      req.body.forgotPasswordToken,
      process.env.FORGOT_PASSWORD_TOKEN_SECRET
    );
    // Get user associated with token
    const user = await User.findById(payload._id);
    if (!user) {
      throw new Error();
    }
    // Update password
    user.password = req.body.newPassword;
    await user.save();
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Get avatar
 */
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

//#endregion

//#region Private routes ======================================================

/**
 * Get self
 */
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

/**
 * Update public fields
 */
router.patch("/users/me", auth, async (req, res) => {
  // Check that only valid properties are being updated
  const updatedProperties = Object.keys(req.body);
  const validProperties = ["name", "username", "email"];
  const updatedPropertiesAreValid = updatedProperties.every((property) => {
    return validProperties.includes(property);
  });
  if (!updatedPropertiesAreValid) {
    return res
      .status(400)
      .send({ error: "Attempted to update invalid property." });
  }
  // Update user and respond
  try {
    updatedProperties.forEach((property) => {
      req.user[property] = req.body[property];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Update password
 */
router.post("/users/me/password", auth, async (req, res) => {
  try {
    // Check if input password is valid
    const passwordIsValid = await req.user.verifyPassword(req.body.oldPassword);
    if (!passwordIsValid) {
      throw new Error();
    }
    // Update password
    req.user.password = req.body.newPassword;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Delete self
 */
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Logout self from current session
 */
router.post("/users/logout", auth, async (req, res) => {
  try {
    const refreshToken = req.cookies.logout_jwt;
    if (!refreshToken) {
      throw new Error();
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await req.user.deleteRefreshToken(refreshToken, res);
    await User.writeRefreshCookies(res, "");

    res.send({ accessToken: "" });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Logout self from all sessions
 */
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    await req.user.deleteAllRefreshTokens(req, res);
    res.send({ accessToken: "" });
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Upload avatar
 */
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // Convert image file to png and resize
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    // Save in db
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/**
 * Delete avatar
 */
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//#endregion

//#region Temp dev routes =====================================================

/**
 * Get all users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Get user by ID
 */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Update user by ID
 */
router.patch("/users/:id", async (req, res) => {
  // Check that only valid properties are being updated
  const updatedProperties = Object.keys(req.body);
  const validProperties = ["name", "username", "email", "password"];
  const updatedPropertiesAreValid = updatedProperties.every((property) => {
    return validProperties.includes(property);
  });
  if (!updatedPropertiesAreValid) {
    return res
      .status(400)
      .send({ error: "Attempted to update invalid property." });
  }
  // Update user and respond
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    updatedProperties.forEach((property) => {
      user[property] = req.body[property];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Delete user by ID
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

//#endregion

module.exports = router;
