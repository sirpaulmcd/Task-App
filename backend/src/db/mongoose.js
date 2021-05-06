const mongoose = require("mongoose");

const databasePort = process.env.DB_PORT || 27017;

const connectToDatabase = async () => {
  await mongoose.connect(
    `mongodb://db:${databasePort}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  );
  console.log("Database connected on port: ", databasePort);
};

module.exports = connectToDatabase;
