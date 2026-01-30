const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secure_blog_secret_2026";

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ msg: "No token provided" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    req.user = decoded;
    return next(); 
  });
};

module.exports = verifyToken;
