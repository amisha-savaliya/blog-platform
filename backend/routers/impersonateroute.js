var express = require("express");
var db = require("../database/connection");
var router = express.Router();
var jwt = require("jsonwebtoken");

const SECRET_KEY = "super_secure_blog_secret_2026";
const verifyAdmin = require("../middleware/verifyAdmin");

router.post("/:id", verifyAdmin, async (req, res) => {

    if (req.user.role !== "admin" && req.user.role_id!==2) {
    return res.status(403).json("Only admin can impersonate");
  }

  const adminId = req.user.id;
  const { id } = req.params;

  // console.log("Admin ID:", adminId);
  // console.log("Target User ID:", id);

  const sql = "SELECT id,name,email,role_id,created_at FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];
   

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,

        role: user.role_id,

        type: "impersonation",
         adminId: adminId,
      },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    db.query("UPDATE users SET token = ? WHERE id = ?", [token, user.id]);

    res.json({
      token,
      user,
      isImpersonation: true,
    });
  });
});

router.post("/stop-impersonation", (req, res) => {
  if (!req.user.impersonatedBy) {
    return res.status(400).json({ message: "Not impersonating" });
  }

  const adminId = req.user.impersonatedBy;

  const sql = "SELECT id, name, role FROM users WHERE id = ?";
  db.query(sql, [adminId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result[0];

    const token = jwt.sign({ id: admin.id, role: admin.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "Returned to admin",
      token,
      redirectTo: "/admin/dashboard",
    });
  });
});

module.exports = router;
