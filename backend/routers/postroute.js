var express = require("express");
var db = require("../database/connection");
var router = express.Router();
var verifyToken = require("../middleware/verifyToken");
var optionalAuth = require("../middleware/optionalAuth");
function CreateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$:/g, "");
}

// 🔹 View count for post
router.post("/:id/view", optionalAuth, (req, res) => {
  const postId = req.params.id;
  const userId = req.user ? req.user.id : null;
  const ipAddress = req.ip;

  console.log("View from IP:", ipAddress);

  // 🔹 Prevent duplicate views from same user/IP
  const checkSql = `
    SELECT id FROM post_view
    WHERE post_id = ? 
    AND (user_id = ? OR ip_address = ?)
    LIMIT 1
  `;

  db.query(checkSql, [postId, userId, ipAddress], (err, result) => {
    if (err) {
      console.log("View check error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    // If already viewed → do not insert again
    if (result.length > 0) {
      return res.json({ success: true, message: "View already counted" });
    }

    // 🔹 Insert new view
    const insertSql = `
      INSERT INTO post_view (post_id, user_id, ip_address)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [postId, userId, ipAddress], (err2) => {
      if (err2) {
        console.log("View insert error:", err2);
        return res.status(500).json({ error: "View not counted" });
      }

      res.json({ success: true, message: "View counted" });
    });
  });
});

router.get("/:userid", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = `SELECT 
  post.*,
  users.name AS author,
  categories.name AS category,
  COUNT(post_view.id) AS views,
  (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
FROM post
LEFT JOIN users ON post.user_id = users.id
LEFT JOIN categories ON post.cat_id = categories.id
LEFT JOIN post_view ON post_view.post_id = post.id
WHERE post.user_id=?
GROUP BY post.id
ORDER BY post.created_at DESC`;

  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

router.get("/", verifyToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const userId = req.query.userId;
  const loggedUserId = req.user.id;

  let whereConditions = ["post.is_delete = 0"];

  let values = [];

  if (search) {
    whereConditions.push(`
      (post.title LIKE ? OR
       post.content LIKE ? OR
       categories.name LIKE ?)
    `);
    const likeSearch = `%${search}%`;
    values.push(likeSearch, likeSearch, likeSearch);
  }

  // filter posts of logged-in user
  if (userId) {
    whereConditions.push(`post.user_id = ${userId}`);
  }

  const whereClause =
    whereConditions.length > 0
      ? ` WHERE ${whereConditions.join(" AND ")} `
      : "";

  const countSql = `
    SELECT COUNT(*) AS total
    FROM post
    LEFT JOIN categories ON post.cat_id = categories.id
    ${whereClause}
  `;

  db.query(countSql, values, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalPosts = countResult[0].total;
    const totalPages = Math.ceil(totalPosts / limit);

    const dataSql = `
      SELECT 
        post.*,
        users.name AS author,
        categories.name AS category,
        COUNT(post_view.id) AS views,
       (SELECT COUNT(*)  FROM post_likes  WHERE post_id = post.id AND user_id = ?) AS userLiked,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = post.id ) AS totalLikes,
        (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
      FROM post
      LEFT JOIN users ON post.user_id = users.id
      LEFT JOIN categories ON post.cat_id = categories.id
      LEFT JOIN post_view ON post.id = post_view.post_id
      ${whereClause}
      GROUP BY post.id
      ORDER BY post.id DESC
      LIMIT ? OFFSET ?
    `;

    db.query(dataSql, [...values, loggedUserId, limit, offset], (err, data) => {
      if (err) return res.status(500).json(err);

      res.json({
        posts: data,
        currentPage: page,
        totalPages,
        totalPosts,
      });
    });
  });
});
router.post("/get", verifyToken, (req, res) => {
  const loggedUserId = req.user.id;
  const range = req.query.range || "all"; //  filter from frontend

  let dateFilter = "";

  if (range === "7") {
    dateFilter = "AND post.created_at >= NOW() - INTERVAL 7 DAY";
  } else if (range === "30") {
    dateFilter = "AND post.created_at >= NOW() - INTERVAL 30 DAY";
  }

  // 🔹 POSTS QUERY
  const postSql = `
    SELECT post.*, users.name AS author, categories.name AS category,
      (SELECT COUNT(*) FROM post_view WHERE post_id = post.id) AS views,
      (SELECT 1 FROM post_likes WHERE post_id = post.id AND user_id = ?) AS userLiked,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = post.id) AS totalLikes,
      (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.is_delete = 0
    ORDER BY post.id DESC
  `;

  // 🔹 CHART QUERY
  const chartSql = `
    SELECT categories.name, COUNT(post.id) AS total
    FROM post
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.is_delete = 0 ${dateFilter}
    GROUP BY categories.name
  `;

  db.query(postSql, [loggedUserId], (err, posts) => {
    if (err) return res.status(500).json(err);

    db.query(chartSql, (err, chartStats) => {
      if (err) return res.status(500).json(err);

      res.json({
        posts,
        chartStats,
      });
    });
  });
});

router.post("/add", verifyToken, async (req, res) => {
  const { title, image, category, content } = req.body;

  const user_id = req.user.id;
  const slug = CreateSlug(title);

  const sql =
    "INSERT INTO post (title, content, image, user_id, cat_id,slug) VALUES  (?, ?, ?, ?, ?,?)";

  db.query(
    sql,
    [title, content, image, user_id, category, slug],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ msg: "Post added successfully", result });
    },
  );
});

//view selected post
router.get("/slug/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  // console.log(slug);

  const postSql = `
    SELECT 
  post.id,
  post.title,
  post.content,
  post.image,
  post.user_id,
  post.cat_id AS category_id,
  post.slug,
  post.created_at,
  post.updated_at,
  users.name AS author,
  categories.name AS category,
  (SELECT COUNT(*) FROM post_view WHERE post_id = post.id) AS views,
  (SELECT COUNT(*) FROM post_likes WHERE post_id = post.id) AS totalLikes,
  (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
FROM post
LEFT JOIN users ON post.user_id = users.id
LEFT JOIN categories ON post.cat_id = categories.id
WHERE post.slug = ?

  `;

  db.query(postSql, [slug], (err, posts) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!posts.length) return res.status(404).json({ msg: "Post not found" });
    // console.log(posts[0]);
    res.json(posts[0]);
  });
});

router.put("/update/:id", verifyToken, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.impersonatedUserId || req.user.id;
 

  const isAdmin = req.user.role === "admin";

const sql = isAdmin
  ? `UPDATE post SET title=?, content=?, cat_id=?, image=?, slug=? WHERE id=?`
  : `UPDATE post SET title=?, content=?, cat_id=?, image=?, slug=? WHERE id=? AND user_id=?`;


  const { title, content, category, image, slug } = req.body;
  // console.log(req.body);

  if (!title || !content || !slug || !category || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }


  db.query(
    sql,
    [title, content, category, image, slug, postId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ msg: err.message });

      if (!result.affectedRows)
        return res.status(403).json({ msg: "Not allowed or post not found" });

      res.json({ msg: "Updated", slug });
    },
  );
});

//delete post
router.delete("/:slug", verifyToken, (req, res) => {
  const { slug } = req.params;
  const sql = "UPDATE post SET is_delete=1 WHERE slug = ?";
  db.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Post deleted successfully" });
  });
});

//like post
router.post("/:postId/like", verifyToken, (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  db.query(
    "SELECT 1 FROM post_likes WHERE post_id=? AND user_id=?",
    [postId, userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length > 0) {
        db.query(
          "DELETE FROM post_likes WHERE post_id=? AND user_id=?",
          [postId, userId],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            return res.json({ liked: false });
          },
        );
      } else {
        db.query(
          "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)",
          [postId, userId],
          () => res.json({ liked: true }),
        );
      }
    },
  );
});

module.exports = router;
