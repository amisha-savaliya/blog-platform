var db=require("../database/connection")

// middleware/roleCheck.js
exports.adminOnly = (req, res, next) => {
  if (req.user.role_id !== 2)
    return res.status(403).json({ message: "Admin access only" });
  next();
};

exports.userOnly = (req, res, next) => {
  if (req.user.role_id !== 1)
    return res.status(403).json({ message: "User access only" });
  next();
};
