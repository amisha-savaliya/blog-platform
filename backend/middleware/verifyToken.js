const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization token missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    /**
     * decoded example:
     * {
     *   id,
     *   role,
     *   role_id,
     *   type: "impersonation",
     *   impersonatedBy,
     *   adminId
     * }
     */

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;