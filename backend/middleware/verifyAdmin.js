const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secure_blog_secret_2026";

const verifyAdmin = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ msg: "No token provided" });

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid auth format" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;

    const isAdmin = decoded.role === "admin" || decoded.role_id === 2;
    if (!isAdmin) {
      return res.status(403).json({ msg: "Admin access only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = verifyAdmin;
