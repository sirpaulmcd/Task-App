const request = require("supertest");

const app = require("../src/app");
const Task = require("../src/models/task");
const {
  connectToDatabase,
  initializeDatabase,
  disconnectFromDatabase,
  userOneAccessToken,
  userTwoAccessToken,
  taskOne,
  taskTwo,
  taskThree,
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

//#region /tasks route ========================================================

test("Should create task for authenticated user.", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send({
      title: "Test task title.",
    })
    .expect(201);
  // Assert task was created
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  // Assert that task defaulted "completed" to false
  expect(task.completed).toEqual(false);
});

test("Should not create task for unauthenticated user.", async () => {
  await request(app)
    .post("/tasks")
    .send({
      title: "Test task.",
    })
    .expect(401);
});

test("Should get all of the user's tasks.", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(200);
  // Asset that 2 tasks were received
  expect(response.body.length).toEqual(2);
});

//#endregion

//#region /tasks/:id route ====================================================

test("Should get user's own task.", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(200);
  // Asset that task one was receieved
  expect(response.body.title).toContain("Royal Gala Apples");
});

test("Should not get other user's task.", async () => {
  await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(404);
});

test("Should update task for authenticated user.", async () => {
  await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send({
      title: "Whoops",
      completed: false,
    })
    .expect(200);
  // Asset that task was updated
  const task = await Task.findById(taskTwo._id);
  expect(task.title).toEqual("Whoops");
  expect(task.completed).toEqual(false);
});

test("Should delete user's own task.", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOneAccessToken}`)
    .send()
    .expect(200);
  // Assert that task was deleted
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete other user's tasks.", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwoAccessToken}`)
    .send()
    .expect(404);
});

//#endregion
