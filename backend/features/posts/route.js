const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");
const optionalAuth = require("../../middleware/optionalAuth");

const postCtrl = require("./postController");

// views
router.post("/:id/view", optionalAuth, postCtrl.addPostView);

//  STATIC ROUTES FIRST
router.get("/heropost",verifyToken,postCtrl.getHeroPosts)
router.get("/businesspost", verifyToken, postCtrl.getBusinessPosts);

// posts
router.get("/", verifyToken, postCtrl.getAllPosts);
router.post("/get", verifyToken, postCtrl.getDashboardPosts);

router.post("/add", verifyToken, postCtrl.createPost);
router.get("/slug/:slug", optionalAuth, postCtrl.getPostBySlug);
router.put("/update/:id", verifyToken, postCtrl.updatePost);
router.delete("/:slug", verifyToken, postCtrl.deletePost);

// likes
router.post("/:postId/like", verifyToken, postCtrl.toggleLike);

//  DYNAMIC ROUTE LAST
router.get("/:userid", verifyToken, postCtrl.getPostsByUser);

module.exports = router;
