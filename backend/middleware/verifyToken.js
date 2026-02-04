const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  // console.log("AUTH HEADER:", req.headers.authorization);


  if (!header) {
    return res.status(401).json({ msg: "No token provided" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    req.user = decoded;
    return next(); 
  });
};

module.exports = verifyToken;
