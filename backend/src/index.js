const app = require("./app");
const connectToDatabase = require("../src/db/mongoose");

const backendPort = process.env.BACKEND_PORT || 8000;

//#region Connections =========================================================

const connectToServer = () => {
  app.listen(backendPort, () => {
    console.log("Server connected on port: ", backendPort);
  });
};

const makeConnections = async () => {
  await connectToDatabase();
  connectToServer();
};

makeConnections();

//#endregion
