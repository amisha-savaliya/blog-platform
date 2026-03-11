const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");
const controller = require("./impersonateController");

const router = express.Router();

// Start impersonation
router.post("/:id", verifyAdmin, controller.startImpersonation);

// Stop impersonation
router.post(
  "/stop-impersonation",
  verifyToken,
  controller.stopImpersonation
);

module.exports = router;