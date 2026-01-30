const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secure_blog_secret_2026";

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  // 🔹 Remove "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token,SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Invalid token, but continuing as guest");
      req.user = null;
      return next();
    }

    // console.log("User from token:", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = optionalAuth;
