var express = require("express");
var db = require("../database/connection");
var router = express.Router();
var bcrypt = require("bcrypt");


router.get("/", (req, res) => {
  const { id } = req.query;

  let sql = "SELECT * FROM users WHERE is_delete = 0";
  const params = [];

  if (id) {
    sql += " AND id = ?";
    params.push(id);
  }

  db.query(sql, params, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    // 👉 Single user request
    if (id) {
      if (data.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.json(data[0]);
    }

    // 👉 All users request
    return res.json(data);
  });
});



// Signup user
router.post("/", (req, res) => {
  try {
    // console.log(req.body);
    const { uname, email, password, role } = req.body;

    if (!uname || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const checkUser = "SELECT id FROM users WHERE email = ?";
    db.query(checkUser, [email], async (err, result) => {
      if (err) return res.status(500).json({ msg: "Database error" });

      if (result.length > 0) {
        return res.status(409).json({ msg: "Email already registered" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";

      db.query(sql, [uname, email, hashPassword, role], (err, data) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ msg: "Signup failed. Please try again." });
        }

        res.status(201).json({
          msg: "User added successfully",
          user: data,
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
});
//profile user

router.get("/profile",(req, res) => {
  const userId = req.user.id;
  // console.log(req.user)

  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (!data.length)
      return res.status(404).json({ msg: "User not found" });

    res.json({
      user: data[0],
      impersonating: req.user.type === "impersonation",
      adminId: req.user.adminId || null
    });
  });
});
//update
router.put("/:id",async (req, res) => {
  
  const { id } = req.params;
  
  const { name, email, password } = req.body;
  var hashPassword;



  if (!name || !email) {
    return res.status(400).json({ msg: "Name and email are required" });
  }
  try {
    const sql = "UPDATE users SET name=?, email=?, password=? WHERE id=?";

    if (password && password.trim() !== "") {
      hashPassword = await bcrypt.hash(password, 10);
    }

    db.query(sql, [name, email, hashPassword, id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.affectedRows === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ msg: "Profile updated successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
});


//delete user
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET is_deleted = 1 WHERE id = ? AND is_deleted = 0",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ msg: "User not found or already deleted" });

      res.json({ msg: "User deleted successfully" });
    }
  );
});
// BLOCK USER
router.put("/block/:id",(req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET is_blocked = 1 WHERE id = ? AND is_delete = 0",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.affectedRows)
        return res.status(404).json({ msg: "User not found" });

      res.json({ msg: "User blocked" });
    }
  );
});

// UNBLOCK USER
router.put("/unblock/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET is_blocked = 0 WHERE id = ? AND is_delete = 0",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.affectedRows)
        return res.status(404).json({ msg: "User not found" });

      res.json({ msg: "User unblocked" });
    }
  );
});

module.exports = router;
