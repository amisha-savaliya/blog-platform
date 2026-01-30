
require("dotenv").config();
var express = require("express");
var db = require("./database/connection");
var path = require("path");
var cors = require("cors");
var userRoute = require("./routers/Userroute");
var categoryRoute = require("./routers/categoryroute");
var postRoute = require("./routers/postroute");
var commentRoute = require("./routers/commentroute");
var settingRoute = require("./routers/settingroute");
var roleRouter = require("./routers/roleroute");
var impersonateRoute=require("./routers/impersonateroute")
var bcrypt = require("bcrypt");
var app = express();
var jwt = require("jsonwebtoken");
var verifyToken = require("./middleware/verifyToken");
const { adminOnly } = require("./middleware/RoleCheck");
var cookieParser = require("cookie-parser");
var adminAuth = require("./routers/adminAuth");
const optionalAuth = require("./middleware/optionalAuth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const SECRET_KEY = "super_secure_blog_secret_2026";

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.set("trust proxy", true);


app.use(cookieParser());

app.post("/get", (req, res) => {
  const sql = `SELECT  post.* ,  users.name AS author,  
  categories.name AS category FROM post LEFT JOIN users ON post.user_id = 
  users.id LEFT JOIN categories ON post.cat_id = categories.id WHERE post.is_delete=0`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// single post for all users to show
app.get("/posts/:slug", (req, res) => {
  const { slug } = req.params;
  const sql = `SELECT  post.* , users.name AS author,  
  categories.name AS category FROM post LEFT JOIN users ON post.user_id = 
  users.id LEFT JOIN categories ON post.cat_id = categories.id WHERE post.slug= ?`;
  db.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json({ msg: err.message });
    if (result.length === 0)
      return res.status(404).json({ msg: "Post not found" });

    res.json(result[0]);
  });
});

app.use("/admin", adminAuth);
app.use("/users", verifyToken, userRoute);
app.use("/signup", userRoute);
app.use("/posts", postRoute);
app.use("/category", categoryRoute);
app.use("/comment", verifyToken, commentRoute);
app.use("/roles", roleRouter);
app.use("/settings", settingRoute);
app.use("/impersonate", verifyToken,impersonateRoute);




app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const sql = `SELECT * FROM users WHERE email = ? AND role_id = 1`;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role_id,
        name: user.name,
        email:user.email,
        created_at:user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

db.query(
  "UPDATE users SET token = ? WHERE id = ?",
  [token, user.id],
  (err) => {
    if (err) return res.status(500).json({ msg: "Token update failed" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        created_at: user.created_at,
      },
    });
  });
});
});


app.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const sql = "UPDATE users SET token = NULL WHERE token = ?";
  db.query(sql, [token]);

  res.json({ message: "Logged out successfully" });
});

app.get("/allpost", optionalAuth,(req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || "";
  const category = req.query.category || "";

  const offset = (page - 1) * limit;
  const userId = req.user?.id ; 
  // console.log(userId);
 

  let where = "WHERE post.is_delete = 0";
  let params = [];

  // Search filter
  if (search) {
    where += `
      AND (
        post.title LIKE ? OR 
        post.content LIKE ? OR 
        categories.name LIKE ?
      )
    `;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  //  filter
  if (category) {
    where += " AND categories.name = ?";
    params.push(category);
  }

  //  Data query
  const sql = `
    SELECT 
        post.*,
        users.name AS author,
        categories.name AS category,
        COUNT(DISTINCT post_view.id) AS views,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = post.id ) AS totalLikes,EXISTS(
  SELECT 1 FROM post_likes
  WHERE post_likes.post_id = post.id
  AND post_likes.user_id = ?
) AS userLiked,
        (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
      FROM post
      LEFT JOIN users ON post.user_id = users.id
      LEFT JOIN categories ON post.cat_id = categories.id
      LEFT JOIN post_view ON post.id = post_view.post_id
    ${where}
    GROUP BY post.id
    ORDER BY post.created_at DESC
    LIMIT ? OFFSET ?
  `;

  //  Count query (same WHERE!)
  const countSql = `
    SELECT COUNT(*) AS total
    FROM post
    LEFT JOIN categories ON post.cat_id = categories.id
    ${where}
  `;

  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(sql, [...params,userId, limit, offset], (err, post) => {
      if (err) return res.status(500).json(err);

      res.json({
        post,
        totalPages,
        currentPage: page,
      });
    });
  });
});



app.get("/category/:name", (req, res) => {
  const { name } = req.params;
   const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const dataSql = `
    SELECT post.*, categories.name AS category
    FROM post
    JOIN categories ON categories.id = post.cat_id
    WHERE LOWER(categories.name) = LOWER(?)
    ORDER BY post.created_at DESC
    LIMIT ? OFFSET ?

  
  `;

   // Count total posts (for total pages)
  const countSql = `
   SELECT COUNT(*) AS total
FROM post
JOIN categories ON post.cat_id = categories.id
WHERE LOWER(categories.name) = LOWER(?)`;

    db.query(countSql, [name], (err, countResult) => {
    if (err) return res.status(500).json({ error: "Server error" });

    const totalPosts = countResult[0].total;

  db.query(dataSql, [name, limit, offset], (err, posts) => {
  if (err) return res.status(500).json({ error: "Server error" });

  res.json({
    posts,                
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
  });
});

});
});

app.post("/contact", (req, res) => {
  const { name, email, msg } = req.body;
  const sql = "INSERT INTO contact (name,email,msg) VALUES  (?, ?, ?)";

  db.query(sql, [name, email, msg], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    res.status(201).json({ msg: "inquiry added", result });
  });
});


app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("express server running at", PORT));


// app.listen(5000, () => {
//   console.log("express server running at http://localhost:5000/");
// });
// module.exports = SECRET_KEY;
