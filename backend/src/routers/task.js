const express = require("express");

const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new express.Router();

//#region Private routes ======================================================

/**
 * Create task
 */
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Get all your tasks. Parameters:
 * - /tasks?completed=(bool)
 * - /tasks?limit=(int)
 * - /tasks?skip=(int)
 * - /tasks?sortBy=(property):(asc/desc)
 */
router.get("/tasks", auth, async (req, res) => {
  try {
    // Handle match query params (if any)
    const match = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    // Handle sort query params (if any)
    const sort = {};
    if (req.query.sortBy) {
      const [property, order] = req.query.sortBy.split(":");
      sort[property] = order === "desc" ? -1 : 1;
    }
    // Populate user with tasks of the appropriate parameters
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Get your task by ID
 */
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Update your task by ID
 */
router.patch("/tasks/:id", auth, async (req, res) => {
  // Check that only valid properties are being updated
  const updatedProperties = Object.keys(req.body);
  const validProperties = ["description", "completed"];
  const updatedPropertiesAreValid = updatedProperties.every((property) => {
    return validProperties.includes(property);
  });
  if (!updatedPropertiesAreValid) {
    return res
      .status(400)
      .send({ error: "Attempted to update invalid property." });
  }
  // Update task and respond
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updatedProperties.forEach((property) => {
      task[property] = req.body[property];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Delete task by ID
 */
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//#endregion

module.exports = router;
