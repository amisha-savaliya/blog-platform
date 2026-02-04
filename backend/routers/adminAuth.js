var express = require("express");
var db = require("../database/connection");

const router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const SECRET_KEY = "super_secure_blog_secret_2026";

// routes/adminAuth.js
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  

  const sql = `
    SELECT * FROM users 
    WHERE email = ? AND role_id = 2
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0)
      return res.status(401).json({ message: "Admin account not found" });

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: 2, name: user.name,role:"admin" },
      SECRET_KEY,
      { expiresIn: "1d" },
    );
  const updateSql = "UPDATE users SET token = ? WHERE id = ?";
    db.query(updateSql, [token, user.id], (updateErr) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({ message: "Token save failed" });
      }

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role_id,
        },
      });
    });
  });
});

module.exports = router;
