const express = require("express");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");
const User = require("../models/user");

const router = new express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

// Get authenticated user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// Get user by ID
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

// Create user
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const accessToken = await user.generateTokens(res);
    res.status(201).send({ user, accessToken });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update user
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

// Delete user
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

// Login user
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

// Renew access and refresh tokens
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
    // Delete previous refresh token
    req.user = user;
    await user.deleteRefreshToken(refreshToken, res);
    // Generate new access and refresh tokens
    const accessToken = await user.generateTokens(res);
    res.send({ user, accessToken });
  } catch (error) {
    res.status(401).send({ error: "Not authenticated." });
  }
});

// Logout user from current session
router.post("/users/logout", auth, async (req, res) => {
  try {
    const refreshToken = req.cookies.logout_jwt;
    if (!refreshToken) {
      throw new Error();
    }
    await req.user.deleteRefreshToken(refreshToken, res);
    res.send({ accessToken: "" });
  } catch (error) {
    res.status(500).send();
  }
});

// Logout user from all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    await req.user.deleteAllRefreshTokens(req, res);
    res.send({ accessToken: "" });
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
