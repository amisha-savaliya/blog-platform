var express = require("express");
var db = require("../database/connection");
var router = express.Router();
var verifyToken=require("../middleware/verifyToken")

// Get roles
router.get("/", (req, res) => {
  const sql = "SELECT * FROM role WHERE is_delete = 0";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Add role
router.post("/add",verifyToken, (req, res) => {
  const { name } = req.body;

  const sql = "INSERT INTO role (name) VALUES (?)";
  db.query(sql, [name], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Role added" });
  });
});

// Update role
router.put("/:id",verifyToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const sql = "UPDATE role SET name=? WHERE id=?";
  db.query(sql, [name, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Role updated" });
  });
});

// Soft delete role
router.delete("/:id",verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE role SET is_delete=1 WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Role deleted" });
  });
});

module.exports = router;
