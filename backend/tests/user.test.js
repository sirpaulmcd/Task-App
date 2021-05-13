const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const connectToDatabase = require("../src/db/mongoose");
const User = require("../src/models/user");

//#region Test objects ========================================================

const existingUser = {
  name: "Michael Stevens",
  username: "Vsauce",
  email: "myname@orisit.com",
  password: "test1234",
};

const newUser = {
  name: "Jeff Goldblum",
  username: "FlyGuy",
  email: "jeff@test.com",
  password: "test1234",
};

//#endregion

//#region Setup and Teardown ==================================================

beforeAll(async () => {
  await connectToDatabase();
});

beforeEach(async () => {
  await User.deleteMany();
  await new User(existingUser).save();
});

afterAll(async () => {
  mongoose.disconnect();
});

//#endregion

//#region Tests ===============================================================

test("Should sign up a new user.", async () => {
  await request(app).post("/users").send(newUser).expect(201);
});

test("Should sign in existing user.", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: existingUser.email,
      password: existingUser.password,
    })
    .expect(200);
});

test("Should not sign in nonexisting user.", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: newUser.email,
      password: newUser.password,
    })
    .expect(400);
});

test("Should not sign in given wrong password.", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: existingUser.email,
      password: existingUser.password + "a",
    })
    .expect(400);
});

//#endregion
