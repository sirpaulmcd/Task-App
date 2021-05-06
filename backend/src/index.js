const express = require("express");

const connectToDatabase = require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const backendPort = process.env.BACKEND_PORT || 8000;

const app = express();

app.use(express.json());

// Get all users
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send();
    });
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      return res.send(user);
    })
    .catch(() => {
      return res.status(500).send();
    });
});

// Create user
app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch(() => {
      res.status(500).send();
    });
});

// Get task by ID
app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).send();
      }
      return res.send(task);
    })
    .catch(() => {
      return res.status(500).send();
    });
});

// Create task
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
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
