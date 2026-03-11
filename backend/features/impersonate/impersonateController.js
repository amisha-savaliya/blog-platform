const db = require("../../database/connection");
const jwt = require("jsonwebtoken");

// START IMPERSONATION
exports.startImpersonation = (req, res) => {
  // verifyAdmin already passed
  const adminId = req.user.id;
  const { id: targetUserId } = req.params;
 

  const sql = `
    SELECT id, name, email, role_id
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [targetUserId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!result.length)
      return res.status(404).json({ message: "User not found" });

    const user = result[0];
    // console.log(user)

    const impersonationToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role_id: user.role_id,
        isImpersonation: true,
        impersonatedBy: adminId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.json({
      token: impersonationToken,
      user,
      isImpersonation: true,
    });
  });
};

// STOP IMPERSONATION
exports.stopImpersonation = (req, res) => {
  if (!req.user.isImpersonation || !req.user.impersonatedBy) {
    return res.status(400).json({ message: "Not impersonating" });
  }

  const adminId = req.user.impersonatedBy;

  const sql = `
    SELECT id, name, role_id
    FROM users
    WHERE id = ? AND role_id = 2
  `;

  db.query(sql, [adminId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!result.length)
      return res.status(404).json({ message: "Admin not found" });

    const admin = result[0];

    const adminToken = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        role_id: admin.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Returned to admin",
      token: adminToken,
      redirectTo:"/dashboard",
    });
  });
};