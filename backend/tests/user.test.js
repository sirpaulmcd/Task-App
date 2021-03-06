const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const {
  connectToDatabase,
  initializeDatabase,
  disconnectFromDatabase,
  newUserCreationObject,
  userOne,
  userOneAccessToken,
  userOneRefreshToken,
  userOneVerifyEmailToken,
  userOneForgotPasswordToken,
} = require("./fixtures/db");

//#region Setup and Teardown ==================================================

beforeAll(async () => {
  await connectToDatabase();
});

beforeEach(async () => {
  await initializeDatabase();
});

afterAll(async () => {
  await disconnectFromDatabase();
});

//#endregion

//#region /users route ========================================================

test("Should sign up new user with valid properties.", async () => {
  // Sign up new user request
  const response = await request(app)
    .post("/api/users")
    .send(newUserCreationObject)
    .expect(201);
  // Assert that database was updated successfully
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  // Assert that returned user fields are correct
  expect(response.body).toMatchObject({
    user: {
      name: newUserCreationObject.name,
      username: newUserCreationObject.username,
      email: newUserCreationObject.email,
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
    .post("/api/users")
    .send({
      ...newUserCreationObject,
      email: "invalidEmail",
    })
    .expect(400);
});

test("Should not sign up new user with additional properties.", async () => {
  // Sign up new user request
  await request(app)
    .post("/api/users")
    .send({
      ...newUserCreationObject,
      invalidField: true,
    })
    .expect(400);
});

//#endregion

//#region /users/login route ==================================================

test("Should sign in existing user.", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not sign in nonexisting user.", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: newUserCreationObject.email,
      password: newUserCreationObject.password,
    })
    .expect(400);
});

test("Should not sign in given wrong password.", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password + "a",
    })
    .expect(400);
});

//#endregion

//#region /users/logout route =================================================

test("Should log authenticated user out.", async () => {
  await request(app)
    .post("/api/users/logout")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .set("Cookie", `logout_jwt=${userOneRefreshToken}`)
    .expect(200);
  // Asset that user has no refresh tokens
  const user = await User.findById(userOne._id);
  expect(user.refreshTokens.length).toEqual(0);
});

test("Should not log unauthenticated user out.", async () => {
  await request(app)
    .post("/api/users/logout")
    .set("Cookie", `logout_jwt=${userOneRefreshToken}`)
    .expect(401);
});

test("Should not log user out with invalid cookie.", async () => {
  await request(app)
    .post("/api/users/logout")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .set("Cookie", "logout_jwt=invalid-cookie")
    .expect(500);
});

//#endregion

//#region /users/logAll route =================================================

test("Should log authenticated user out of all sessions.", async () => {
  // Sign in user second time (2 refresh tokens)
  await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  // Assert that user has 2 refresh tokens
  let user = await User.findById(userOne._id);
  expect(user.refreshTokens.length).toEqual(2);
  // Sign user out of all sessions
  await request(app)
    .post("/api/users/logoutAll")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .set("Cookie", `refresh_jwt=${userOneRefreshToken}`)
    .expect(200);
  // Asset that user has no refresh tokens
  user = await User.findById(userOne._id);
  expect(user.refreshTokens.length).toEqual(0);
});

//#endregion

//#region /users/refresh route ================================================

test("Should refresh tokens of authenticated user", async () => {
  const response = await request(app)
    .post("/api/users/refresh")
    .set("Cookie", `refresh_jwt=${userOneRefreshToken}`)
    .expect(200);
  // Assert that valid access and refresh tokens returned in response
  const accessToken = response.body.accessToken;
  const refreshJwt = response.header["set-cookie"][0]
    .split(";")[0]
    .replace("refresh_jwt=", "");
  const logoutJwt = response.header["set-cookie"][1]
    .split(";")[0]
    .replace("logout_jwt=", "");
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  jwt.verify(refreshJwt, process.env.REFRESH_TOKEN_SECRET);
  jwt.verify(logoutJwt, process.env.REFRESH_TOKEN_SECRET);
  // Assert that user still only has one refresh token after renewal
  let user = await User.findById(userOne._id);
  expect(user.refreshTokens.length).toEqual(1);
});

test("Should not refresh tokens of unauthenticated user", async () => {
  await request(app)
    .post("/api/users/refresh")
    .set("Cookie", "logout_jwt=invalid-cookie")
    .expect(401);
});

//#endregion

//#region /users/unqiue route =================================================

//TODO: Test this route.

//#endregion

//#region /users/password route ===============================================

test("Should send password reset email if input email is valid.", async () => {
  await request(app)
    .post("/api/users/password/forgot")
    .send({
      email: userOne.email,
    })
    .expect(200);
});

test("Should not send password reset email if input email is invalid.", async () => {
  await request(app)
    .post("/api/users/password/forgot")
    .send({
      email: userOne.email + "a",
    })
    .expect(400);
});

test("Should reset password for user with valid password reset token.", async () => {
  const newPassword = "newPassword!";
  // Request password resert
  await request(app)
    .post("/api/users/password/reset")
    .send({
      forgotPasswordToken: userOneForgotPasswordToken,
      newPassword: newPassword,
    })
    .expect(200);
  // Assert password change
  const user = await User.findById(userOne._id);
  const passwordIsValid = await user.verifyPassword(newPassword);
  expect(passwordIsValid).toEqual(true);
});

test("Should not reset password for user with invalid password reset token.", async () => {
  const newPassword = "newPassword!";
  // Request password resert
  await request(app)
    .post("/api/users/password/reset")
    .send({
      forgotPasswordToken: userOneForgotPasswordToken + "a",
      newPassword: newPassword,
    })
    .expect(400);
});

//#endregion

//#region /users/me route =====================================================

test("Should get profile for authenticated user.", async () => {
  const response = await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(200);
  // Assert that private info not returned with user response
  expect(response.body).not.toHaveProperty("password");
  expect(response.body).not.toHaveProperty("refreshTokens");
  expect(response.body).not.toHaveProperty("avatar");
});

test("Should not get profile for unauthenticated user.", async () => {
  await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${userOneAccessToken}ExtraCharacters`)
    .send()
    .expect(401);
});

test("Should delete account for authenticated user.", async () => {
  await request(app)
    .delete("/api/users/me")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(200);
  // Assert that account was deleted
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user.", async () => {
  await request(app)
    .delete("/api/users/me")
    .set("Authorization", `Bearer ${userOneAccessToken}ExtraCharacters`)
    .send()
    .expect(401);
});

test("Should update name of authenticated user.", async () => {
  const newName = "Seymour Skinner";
  await request(app)
    .patch("/api/users/me")
    .send({
      name: newName,
    })
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .expect(200);
  // Assert that name was correctly updated
  const user = await User.findById(userOne._id);
  expect(user.name).toEqual(newName);
});

test("Should not update name of unauthenticated user.", async () => {
  const newName = "Seymour Skinner";
  await request(app)
    .patch("/api/users/me")
    .send({
      name: newName,
    })
    .expect(401);
});

test("Should not update invalid field for authenticated user.", async () => {
  await request(app)
    .patch("/api/users/me")
    .send({
      invalidField: "Crazy Legs",
    })
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .expect(400);
});

//#endregion

//#region /users/me/password route ============================================

test("Should update password for authenticated user when old password correct.", async () => {
  const newPassword = "newPassword!";
  // Upload avatar image for user
  await request(app)
    .post("/api/users/me/password")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send({
      oldPassword: userOne.password,
      newPassword: newPassword,
    })
    .expect(200);
  // Ensure that password updated correctly
  const user = await User.findById(userOne._id);
  const passwordIsValid = await user.verifyPassword(newPassword);
  expect(passwordIsValid).toEqual(true);
});

test("Should not update password for authenticated user when old password incorrect.", async () => {
  const newPassword = "newPassword!";
  // Upload avatar image for user
  await request(app)
    .post("/api/users/me/password")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send({
      oldPassword: "aasdasdas",
      newPassword: newPassword,
    })
    .expect(400);
});

test("Should not update password for unauthenticated user.", async () => {
  const newPassword = "newPassword!";
  // Upload avatar image for user
  await request(app)
    .post("/api/users/me/password")
    .set("Authorization", `Bearer ${userOneAccessToken}asdasd`)
    .send({
      oldPassword: userOne.password,
      newPassword: newPassword,
    })
    .expect(401);
});

//#endregion

//#region /users/me/avatar route ==============================================

test("Should upload avatar image.", async () => {
  await request(app)
    .post("/api/users/me/avatar")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  // Assert that binary data has been uploaded
  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should not upload avatar image for unauthenticated user.", async () => {
  await request(app)
    .post("/api/users/me/avatar")
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(401);
});

//#endregion

//#region /users/:id/avatar route ==============================================

test("Should return image reponse.", async () => {
  // Upload avatar image for user
  await request(app)
    .post("/api/users/me/avatar")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  // Get avatar image
  const response = await request(app)
    .get(`/api/users/${userOne._id}/avatar`)
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .expect(200);
  // Assert that png image is shown
  expect(response.header["content-type"]).toContain("image/png");
});

//#endregion

//#region /users/verification/:token route ====================================

test("Should verify email of user with valid token.", async () => {
  // Access endpoint with valid token
  await request(app)
    .get(`/api/users/verification/${userOneVerifyEmailToken}`)
    .expect(302);
  // Check to see that user's email was validated
  const user = await User.findById(userOne._id);
  expect(user.verifiedEmail).toEqual(true);
});

test("Should not verify email of user with invalid token.", async () => {
  // Access endpoint with valid token
  await request(app)
    .get(`/api/users/verification/${userOneAccessToken}`)
    .expect(401);
  // Check to see that user's email was not validated
  const user = await User.findById(userOne._id);
  expect(user.verifiedEmail).toEqual(false);
});

//#endregion
