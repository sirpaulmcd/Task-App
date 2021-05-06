const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
    validate(value) {
      if (!validator.isAlpha(value, ["en-US"], { ignore: " " })) {
        throw new Error("Name must only contain letters.");
      }
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 50,
    trim: true,
    validate(value) {
      if (!validator.isAlphanumeric(value)) {
        throw new Error("Username must only contain letters and numbers.");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email must be of valid format.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
    trim: true,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
