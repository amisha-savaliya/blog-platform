const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");

const contactCtrl = require("./contactController");



// POST contact message
router.post("/send", contactCtrl.sendContactMessage);

// manage contact by admin

router.get("/", verifyToken, contactCtrl.getAllContacts);
router.get("/:id", verifyToken, contactCtrl.getContactById);
router.put("/:id/read", verifyToken, contactCtrl.markAsRead);
router.delete("/:id", verifyToken, contactCtrl.deleteContact);

module.exports = router;

module.exports = router;