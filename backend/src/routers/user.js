const express = require("express");
const router = new express.Router();
const User = require("../models/user");

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
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
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
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
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
