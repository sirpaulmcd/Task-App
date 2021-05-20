const mongoose = require("mongoose");

const databaseConnectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const connectToDatabase = async () => {
  await mongoose
    .connect(databaseConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .catch((error) => {
      console.log(
        "Unable to connect to database.",
        databaseConnectionString,
        error
      );
    });
};

module.exports = connectToDatabase;
