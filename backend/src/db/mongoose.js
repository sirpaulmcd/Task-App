const mongoose = require("mongoose");

const databasePort = process.env.DB_PORT || 27017;

const connectToDatabase = async () => {
  await mongoose
    .connect(
      `mongodb://${process.env.DB_HOST}:${databasePort}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .then(() => {
      console.log("Database connected on port:", databasePort);
    })
    .catch((error) => {
      console.log(
        "Unable to connect to database.",
        `mongodb://db:${databasePort}/${process.env.DB_NAME}`,
        error
      );
    });
};

module.exports = connectToDatabase;
