const express = require("express");

const auth = require("../middleware/authentication");
const TaskService = require("../services/task");

const router = new express.Router();

//#region Private routes ======================================================

router.post("/tasks", auth, TaskService.createTask);
router.get("/tasks", auth, TaskService.getTasks);
router.get("/tasks/:id", auth, TaskService.getTask);
router.patch("/tasks/:id", auth, TaskService.updateTask);
router.delete("/tasks/:id", auth, TaskService.deleteTask);

//#endregion

module.exports = router;
