const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const optionalAuth = require("../middleware/optionalAuth");

// feature routes
router.use("/auth", require("../features/auth/route"));
router.use("/users", verifyToken, require("../features/users/route"));
router.use("/posts", require("../features/posts/route"));
router.use("/category", require("../features/category/route"));
router.use("/comments", verifyToken, require("../features/comment/route"));
router.use("/contact",require("../features/contact/route"))

router.use("/settings", require("../features/settings/route"));
router.use("/roles", require("../features/roles/route"));
router.use("/impersonate", verifyToken, require("../features/impersonate/route"));
router.use("/invite-user", require("../features/admin/invite/route"));

router.use("/contact", require("../features/contact/route"));

module.exports = router;