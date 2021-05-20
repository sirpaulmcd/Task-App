const jwt = require("jsonwebtoken");
const sharp = require("sharp");

const User = require("../models/user");
const { sendForgotPasswordEmail } = require("../emails/account");

class UserService {
  //#region Public ============================================================

  static registerUser = async (req, res) => {
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
  };

  static loginUser = async (req, res) => {
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
  };

  /**
   * Renew access/refresh tokens.
   */
  static renewTokens = async (req, res) => {
    try {
      // Verify refresh token
      const refreshToken = req.cookies.refresh_jwt;
      if (!refreshToken) {
        throw new Error();
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
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
  };

  static verifyEmail = async (req, res) => {
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
  };

  static requestPasswordResetEmail = async (req, res) => {
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
  };

  /**
   * Reset password
   */
  static resetPassword = async (req, res) => {
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
  };

  static getAvatar = async (req, res) => {
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
  };

  //#endregion

  //#region Private ===========================================================

  static getSelf = async (req, res) => {
    res.send(req.user);
  };

  static updatePublicFields = async (req, res) => {
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
  };

  static updatePassword = async (req, res) => {
    try {
      // Check if input password is valid
      const passwordIsValid = await req.user.verifyPassword(
        req.body.oldPassword
      );
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
  };

  static deleteSelf = async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (error) {
      res.status(500).send();
    }
  };

  static logout = async (req, res) => {
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
  };

  static logoutAllSessions = async (req, res) => {
    try {
      await req.user.deleteAllRefreshTokens(req, res);
      res.send({ accessToken: "" });
    } catch (error) {
      res.status(500).send();
    }
  };

  static uploadAvatar = async (req, res) => {
    // Convert image file to png and resize
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    // Save in db
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  };

  static deleteAvatar = async (req, res) => {
    try {
      req.user.avatar = undefined;
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  };

  //#endregion
}

module.exports = UserService;
