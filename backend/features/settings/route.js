var express = require("express");
var router=express.Router();
var verifyToken = require("../../middleware/verifyToken");
var settingsController = require("./settingController");
const verifyAdmin = require("../../middleware/verifyAdmin");

var router = express.Router();

// public (or admin dashboard read)
router.get("/", settingsController.getBlogSettings);

// protected (admin only)
router.put("/", verifyAdmin, settingsController.updateBlogSettings);

module.exports = router;