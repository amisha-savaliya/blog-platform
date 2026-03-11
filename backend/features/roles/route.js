var express = require("express");
var router = express.Router();

var verifyToken = require("../../middleware/verifyToken");
var roleController = require("./rolesController");
const optionalAuth = require("../../middleware/optionalAuth");

router.get("/", roleController.getRoles);
router.post("/add", verifyToken, roleController.addRole);
router.put("/:id", verifyToken, roleController.updateRole);
router.delete("/:id", verifyToken, roleController.deleteRole);

module.exports = router;