const db = require("../../database/connection");

// GET COMMENTS (optionally by post_id)
exports.getComments = (req, res) => {
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
};

// ADD COMMENT
exports.addComment = (req, res) => {
  const { post_id, comment } = req.body;
  const user_id = req.user.id; // coming from verifyToken middleware

  const insertSql =
    "INSERT INTO comments (comment,post_id, user_id,) VALUES (?, ?, ?)";

  db.query(insertSql, [comment,post_id, user_id,], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB Insert Failed" });
    }

    const fetchSql = `
      SELECT comments.*, users.name AS user_name
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.id = ?
    `;

    db.query(fetchSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "DB Fetch Failed" });
      }

      res.json(rows[0]);
    });
  });
};

// UPDATE COMMENT
exports.updateComment = (req, res) => {
  const { comment } = req.body;
  const { commentId } = req.params; //  correct param

  db.query(
    `UPDATE comments
     SET comment = ?, updated_at = NOW()
     WHERE id = ?`,
    [comment, commentId],
    (err) => {
      if (err) return res.status(500).json(err);

      //  Fetch updated row correctly
      db.query(
        "SELECT * FROM comments WHERE id = ?",
        [commentId], // use commentId here
        (err, rows) => {
          if (err) return res.status(500).json(err);

          if (!rows.length)
            return res.status(404).json({ message: "Comment not found" });
           
          res.json(rows[0]); //  return full updated object
        }
      );
    }
  );
};
// DELETE COMMENT (soft delete)
exports.deleteComment = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE comments SET is_delete = 1 WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(403).json({ msg: "Not allowed" });
      }

      res.json({ deletedId: id });
    }
  );
};

// APPROVE COMMENT
exports.approveComment = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE comments SET is_approved = 1 WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Comment approved" });
    }
  );
};