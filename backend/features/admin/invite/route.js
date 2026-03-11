const express = require("express");
const router = express.Router();
const verifyAdmin = require("../../../middleware/verifyAdmin");
const controller = require("./inviteController");

router.post("/", verifyAdmin, controller.inviteUser);
router.get("/invite-info/:inviteToken", controller.getInviteInfo);
router.post("/setup", controller.setupAccount);

module.exports = router;