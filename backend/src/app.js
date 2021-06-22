const cookieParser = require("cookie-parser");
const express = require("express");

const cors = require("./middleware/cors");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

// App is separated from index.js so it can be used for tests without
// starting a server.
const app = express();

//#region Middleware ==========================================================

app.use(cookieParser());
app.use(express.json());
app.use(cors);

//#endregion

//#region Routers =============================================================

app.use("/api/", taskRouter);
app.use("/api/", userRouter);

//#endregion

module.exports = app;
