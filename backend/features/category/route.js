const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");
const categoryController = require("./categoryController");

// PUBLIC
router.get("/", verifyToken,categoryController.getAllCategories);
router.get("/:name",verifyToken,categoryController.getPostsByCategory)

//  PROTECTED
router.post("/add", verifyToken, categoryController.addCategory);
router.put("/:id", verifyToken, categoryController.updateCategory);
router.delete("/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;