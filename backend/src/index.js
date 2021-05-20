const app = require("./app");
const connectToDatabase = require("../src/db/mongoose");

//#region Connections =========================================================

const connectToServer = () => {
  app.listen(process.env.BACKEND_PORT, () => {
    console.log("Server connected on port: ", process.env.BACKEND_PORT);
  });
};

const makeConnections = async () => {
  await connectToDatabase();
  console.log("Database connected on port:", process.env.DB_PORT);
  connectToServer();
};

makeConnections();

//#endregion
