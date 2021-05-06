const express = require("express");

const connectToDatabase = require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const backendPort = process.env.BACKEND_PORT || 8000;

const app = express();

app.use(express.json());

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
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
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update user
app.patch("/users/:id", async (req, res) => {
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
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

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

// Get task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (error) {
    return res.status(500).send();
  }
});

// Create task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update task
app.patch("/tasks/:id", async (req, res) => {
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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

connectToDatabase()
  .then(() => {
    app.listen(backendPort, () => {
      console.log("Server connected on port: ", backendPort);
    });
  })
  .catch((error) => {
    console.log(error);
  });
