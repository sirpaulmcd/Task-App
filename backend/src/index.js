const cookieParser = require("cookie-parser");
const express = require("express");

const connectToDatabase = require("./db/mongoose");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

const backendPort = process.env.BACKEND_PORT || 8000;

const app = express();

//#region Middleware ==========================================================

app.use(cookieParser());
app.use(express.json());

//#endregion

//#region Routers =============================================================

app.use(taskRouter);
app.use(userRouter);

//#endregion

//#region Connections =========================================================

connectToDatabase()
  .then(() => {
    app.listen(backendPort, () => {
      console.log("Server connected on port: ", backendPort);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//#endregion
