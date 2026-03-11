var express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const commentController = require("./commentController");

var router = express.Router();

router.get("/", commentController.getComments);

router.post("/add", verifyToken, commentController.addComment);

router.put("/:commentId", verifyToken, commentController.updateComment);

router.delete("/:id", verifyToken, commentController.deleteComment);

router.put("/approve/:id", verifyToken, commentController.approveComment);

module.exports = router;