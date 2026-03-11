const express = require("express");
const router = express.Router();
const authController = require("./authController");
const verifyToken = require("../../middleware/verifyToken");





router.post("/login", authController.userLogin);
router.get("/logout", verifyToken, authController.logout);
router.post("/signup", authController.signup)
router.post("/forgot-password", authController.forgotPassword);
router.get(
  "/verify-reset-token/:resetToken",
  authController.verifyResetToken
);
router.post("/reset-password/:token", authController.resetPassword);


//adminlogin

router.post("/admin/login", authController.adminLogin);

module.exports = router;