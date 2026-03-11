const express = require("express");
const router = express.Router();
const userController = require("./userController");
const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin=require("../../middleware/verifyAdmin")

router.get("/", userController.getUsers);
router.get("/profile", verifyToken, userController.getProfile);
router.put("/:id", verifyToken, userController.updateProfile);
router.delete("/:id", verifyToken, userController.deleteUser);

// admin actions on users
router.get("/adminuser", verifyAdmin, userController.getUsersAsAdmin);
router.put("/adminuser/:id", verifyAdmin, userController.updateUserByAdmin);
router.delete("/:id", verifyAdmin, userController.deleteUser);
router.put("/block/:id", verifyAdmin, userController.blockUser);
router.put("/unblock/:id", verifyAdmin, userController.unblockUser);


module.exports = router;