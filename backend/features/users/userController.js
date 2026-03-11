const db = require("../../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*------------------get users----------------*/

exports.getUsers = (req, res) => {
  const { id } = req.query;

  let sql = "SELECT * FROM users WHERE is_delete = 0 AND id= ?";
  const params = [];

  if (id) {
    sql += " AND id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (id) {
      if (!data.length) return res.status(404).json({ msg: "User not found" });
      return res.json(data[0]);
    }

    res.json(data);
  });
};

/* ---------------- ADMIN USER LIST ---------------- */
exports.getUsersAsAdmin = (req, res) => {
  const { id } = req.query;
  // console.log(id);


  let sql = `
    SELECT 
      id,
      name,
      email,
      role_id,
      is_blocked,
      created_at
    FROM users
    WHERE is_delete = 0
  `;
  const params = [];

  if (id) {
    sql += " AND id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (id) {
      if (!data.length) return res.status(404).json({ msg: "User not found" });
      // console.log(data[0]);
      return res.json(data[0]);
    }

    res.json(data);
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, data) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (!data.length) return res.status(404).json({ msg: "User not found" });

    res.json({
      user: data[0],
      impersonating: req.user.type === "impersonation",
      adminId: req.user.adminId || null,
    });
  });
};



/* ---------------- UPDATE PROFILE ---------------- */
exports.updateProfile = async (req, res) => {
  const realUserId = req.user.impersonatedUserId || req.user.id;
  const { name, email, password } = req.body;

  if (!name || !email)
    return res.status(400).json({ msg: "Name and email required" });

  try {
    let sql, values;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      sql = "UPDATE users SET name=?,email=?,password=? WHERE id=?";
      values = [name, email, hashed, realUserId];
    } else {
      sql = "UPDATE users SET name=?,email=? WHERE id=?";
      values = [name, email, realUserId];
    }

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.affectedRows)
        return res.status(404).json({ msg: "User not found" });

      // ❗ token refresh belongs to auth, but OK temporarily
      const token = jwt.sign(
        { id: realUserId, name, email, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      db.query("UPDATE users SET token=? WHERE id=?", [token, realUserId]);

      res.json({ msg: "Profile updated", token });
    });
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
};

/* ---------------- ADMIN UPDATE ---------------- */
exports.updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email)
    return res.status(400).json({ msg: "Name and email required" });

  let sql, values;

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    sql = "UPDATE users SET name=?,email=?,password=? WHERE id=?";
    values = [name, email, hashed, id];
  } else {
    sql = "UPDATE users SET name=?,email=? WHERE id=?";
    values = [name, email, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ msg: "Update failed" });
    if (!result.affectedRows)
      return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User updated" });
  });
};

/* ---------------- DELETE / BLOCK / UNBLOCK---------------- */
exports.deleteUser = (req, res) => {
  db.query(
    "UPDATE users SET is_delete=1 WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "Database error" });
      }

      if (!result.affectedRows) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ id: req.params.id, msg: "User deleted" }); // cleaner
    }
  );
};
exports.blockUser = (req, res) => {
  db.query(
    "UPDATE users SET is_blocked = 1 WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ id:req.params.id ,msg: "User blocked" });
    }
  );
};

exports.unblockUser = (req, res) => {
  db.query(
    "UPDATE users SET is_blocked = 0 WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ id:req.params.id,msg: "User unblocked" });
    }
  );
};