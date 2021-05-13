const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../src/app");
const connectToDatabase = require("../src/db/mongoose");
const User = require("../src/models/user");

//#region Test objects ========================================================

const existingUserId = new mongoose.Types.ObjectId();

const existingUserAccessToken = jwt.sign(
  { _id: existingUserId },
  process.env.ACCESS_TOKEN_SECRET
);

const existingUser = {
  _id: existingUserId,
  name: "Michael Stevens",
  username: "Vsauce",
  email: "thisismyemail@orisit.com",
  password: "test1234",
  tokens: [
    {
      token: jwt.sign(
        { _id: existingUserId },
        process.env.REFRESH_TOKEN_SECRET
      ),
    },
  ],
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

//#region /users route ========================================================

test("Should sign up new user with valid properties.", async () => {
  // Sign up new user request
  const response = await request(app).post("/users").send(newUser).expect(201);
  // Assert that database was updated successfully
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  // Assert that returned user fields are correct
  expect(response.body).toMatchObject({
    user: {
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    },
  });
  // Assert that valid access token is returned
  const newUserId = jwt.verify(
    response.body.accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  expect(newUserId).not.toBeNull();
});

test("Should not sign up new user with invalid properties.", async () => {
  // Sign up new user request
  await request(app)
    .post("/users")
    .send({
      ...newUser,
      email: "invalidEmail",
    })
    .expect(400);
});

test("Should not sign up new user with additional properties.", async () => {
  // Sign up new user request
  await request(app)
    .post("/users")
    .send({
      ...newUser,
      invalidField: true,
    })
    .expect(400);
});

//#endregion

//#region /users/login route ==================================================

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

//#region /users/logout route =================================================
//#endregion

//#region /users/logAll route =================================================
//#endregion

//#region /users/refresh route ================================================
//#endregion

//#region /users/me route =====================================================

test("Should get profile for authenticated user.", async () => {
  const response = await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${existingUserAccessToken}`)
    .send()
    .expect(200);
  // Assert that private info not returned with user response
  expect(response.body).not.toHaveProperty("password");
  expect(response.body).not.toHaveProperty("refreshTokens");
  expect(response.body).not.toHaveProperty("avatar");
});

test("Should not get profile for unauthenticated user.", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${existingUserAccessToken}ExtraCharacters`)
    .send()
    .expect(401);
});

test("Should delete account for authenticated user.", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${existingUserAccessToken}`)
    .send()
    .expect(200);
  // Assert that account was deleted
  const user = await User.findById(existingUserId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user.", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${existingUserAccessToken}ExtraCharacters`)
    .send()
    .expect(401);
});

test("Should update name of authenticated user.", async () => {
  const newName = "Seymour Skinner";
  await request(app)
    .patch("/users/me")
    .send({
      name: newName,
    })
    .set("Authorization", `Bearer ${existingUserAccessToken}`)
    .expect(200);
  // Assert that name was correctly updated
  const user = await User.findById(existingUserId);
  expect(user.name).toEqual(newName);
});

//#endregion

//#region /users/me/avatar route ==============================================

test("Should upload avatar image.", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${existingUserAccessToken}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  // Assert that binary data has been uploaded
  const user = await User.findById(existingUserId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

//#endregion

//#region /users/:id/avatar route ==============================================

test("Should not update invalid user field for authenticated user.", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      invalidField: "Crazy Legs",
    })
    .set("Authorization", `Bearer ${existingUserAccessToken}`)
    .expect(400);
});

//#endregion
