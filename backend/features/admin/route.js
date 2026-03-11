const express = require("express");
const router = express.Router();
const adminController = require("./adminController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/users", verifyAdmin, adminController.getUsers);
router.put("/users/:id", verifyAdmin, adminController.updateUser);
router.put("/users/block/:id", verifyAdmin, adminController.blockUser);
router.put("/users/unblock/:id", verifyAdmin, adminController.unblockUser);

module.exports = router;