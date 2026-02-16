var express = require("express");
var db = require("../database/connection");
const verifyToken = require("../middleware/verifyToken");
var router = express.Router();
router.get("/", (req, res) => {
  const { post_id } = req.query;

  let sql = `
 
    SELECT comments.*, users.name AS user_name
    FROM comments
    JOIN users ON users.id = comments.user_id
     WHERE comments.is_delete = 0
    
  `;

  const params = [];

  if (post_id) {
    sql += " AND comments.post_id = ?";
    params.push(post_id);
  }

  sql += " ORDER BY comments.created_at DESC";
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

router.post("/add", (req, res) => {
  const { post_id, comment } = req.body;
  const user_id = req.user.id;

  const insert =
    "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";

  db.query(insert, [post_id, user_id, comment], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB Insert Failed" });
    }

    const fetchcomment = `
      SELECT comments.*, users.name AS user_name
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.id = ?
    `;

    db.query(fetchcomment, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "DB Fetch Failed" });
      }

      res.json(rows[0]);
    });
  });
});

// UPDATE COMMENT
router.put("/:id", (req, res) => {
  const { comment } = req.body;

  db.query(
    "UPDATE comments SET comment=? WHERE id=?",
    [comment, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: req.params.id, comment });
    },
  );
});

//delete the comment
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE comments SET is_delete = 1 WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(403).json({ msg: "Not allowed" });

      res.json({ deletedId: id }); //deleted id return
    },
  );
});
//approved comment
router.put("/approve/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE comments SET is_approved = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Comment approved" });
  });
});

module.exports = router;
