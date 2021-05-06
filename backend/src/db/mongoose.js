const mongoose = require("mongoose");

const databasePort = process.env.DB_PORT || 27017;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb://db:${databasePort}/${process.env.DB_NAME}`
    );
    console.log("Database connected on port: ", databasePort);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDatabase;
