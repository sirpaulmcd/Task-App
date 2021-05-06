const express = require("express");

const connectToDatabase = require("./db/mongoose");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");

const backendPort = process.env.BACKEND_PORT || 8000;

const app = express();

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

connectToDatabase()
  .then(() => {
    app.listen(backendPort, () => {
      console.log("Server connected on port: ", backendPort);
    });
  })
  .catch((error) => {
    console.log(error);
  });
