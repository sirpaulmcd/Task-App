const bcrypt = require("bcryptjs");
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

// Reusable find by credentials method for user model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login.");
  }
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    throw new Error("Unable to login.");
  }
  return user;
};

// Run before saving (not called when using findByIdAndUpdate)
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

// Improve unique enforcement error messages
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;
