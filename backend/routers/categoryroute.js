var express = require("express");
var db = require("../database/connection");
const verifyToken = require("../middleware/verifyToken");
var router = express.Router();

router.get("/", (req, res) => {
  // const sql = "SELECT * FROM categories WHERE is_delete=0";

const sql = `
    SELECT 
      categories.*, 
      COUNT(post.id) AS posts
    FROM categories
    LEFT JOIN post 
      ON post.cat_id = categories.id 
      AND post.is_delete = 0
    GROUP BY categories.id
  `;


  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
//ADD CATEGORY
router.post("/add", verifyToken, (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO categories(name) VALUES (?)";

  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json({ msg: "not added" });
    res.json({ msg: "added successfully" });
  });
});

// DELETE CATEGORY
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE categories SET is_delete = 1 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category deleted successfully" });
  });
});
// UPDATE CATEGORY
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ msg: "Category name is required" });
  }

  const sql = "UPDATE categories SET name = ? WHERE id = ? AND is_delete = 0";

  db.query(sql, [name.trim(), id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category updated successfully" });
  });
});

module.exports = router;
