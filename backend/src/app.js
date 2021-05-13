const cookieParser = require("cookie-parser");
const express = require("express");

const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

// App is separated from index.js so it can be used for tests without
// starting a server.
const app = express();

//#region Middleware ==========================================================

app.use(cookieParser());
app.use(express.json());

//#endregion

//#region Routers =============================================================

app.use(taskRouter);
app.use(userRouter);

//#endregion

module.exports = app;
