const express = require("express");

const auth = require("../middleware/authentication");
const upload = require("../middleware/fileUpload");
const UserService = require("../services/user");

const router = new express.Router();

//#region Public routes =======================================================

router.post("/users", UserService.registerUser);
router.post("/users/login", UserService.loginUser);
router.post("/users/refresh", UserService.renewTokens);
router.get("/users/verification/:token", UserService.verifyEmail);
router.post("/users/password/forgot", UserService.requestPasswordResetEmail);
router.post("/users/password/reset", UserService.resetPassword);
router.get("/users/:id/avatar", UserService.getAvatar);

//#endregion

//#region Private routes ======================================================

router.get("/users/me", auth, UserService.getSelf);
router.patch("/users/me", auth, UserService.updatePublicFields);
router.post("/users/me/password", auth, UserService.updatePassword);
router.delete("/users/me", auth, UserService.deleteSelf);
router.post("/users/logout", auth, UserService.logout);
router.post("/users/logoutAll", auth, UserService.logoutAllSessions);
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  UserService.uploadAvatar
);
router.delete("/users/me/avatar", auth, UserService.deleteAvatar);

//#endregion

module.exports = router;
