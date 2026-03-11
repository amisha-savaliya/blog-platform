const db = require("../../database/connection");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role_id, created_at FROM users WHERE is_delete = 0",
    (err, data) => {
      if (err) return res.status(500).json({ msg: "DB error" });
      res.json(data);
    }
  );
};

exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;

  let sql, values;

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    sql = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
    values = [name, email, hashed, id];
  } else {
    sql = "UPDATE users SET name=?, email=? WHERE id=?";
    values = [name, email, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ msg: "Update failed" });
    if (!result.affectedRows)
      return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User updated" });
  });
};

exports.blockUser = (req, res) => {
  db.query(
    "UPDATE users SET is_blocked = 1 WHERE id = ?",
    [req.params.id],
    () => res.json({ msg: "User blocked" })
  );
};

exports.unblockUser = (req, res) => {
  db.query(
    "UPDATE users SET is_blocked = 0 WHERE id = ?",
    [req.params.id],
    () => res.json({ msg: "User unblocked" })
  );
};