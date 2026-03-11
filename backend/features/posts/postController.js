const db = require("../../database/connection");


// 🔹 SLUG GENERATOR
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =========================
   VIEW COUNT
========================= */
exports.addPostView = (req, res) => {
  const postId = req.params.id;
  const userId = req.user ? req.user.id : null;
  const ipAddress = req.ip;

  const checkSql = `
    SELECT id FROM post_view
    WHERE post_id = ?
    AND (user_id = ? OR ip_address = ?)
    LIMIT 1
  `;

  db.query(checkSql, [postId, userId, ipAddress], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });

    const countAndReturn = () => {
      db.query(
        `SELECT COUNT(*) AS views FROM post_view WHERE post_id = ?`,
        [postId],
        (err2, countResult) => {
          if (err2) return res.status(500).json({ error: "Count failed" });

          res.json({
            success: true,
            views: countResult[0].views,
          });
        }
      );
    };

    if (result.length > 0) {
      return countAndReturn(); // return actual count
    }

    const insertSql = `
      INSERT INTO post_view (post_id, user_id, ip_address)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [postId, userId, ipAddress], (err3) => {
      if (err3) return res.status(500).json({ error: "View not counted" });
      countAndReturn(); // return actual count
    });
  });
};

/* =========================
   GET POSTS BY USER
========================= */
exports.getPostsByUser = (req, res) => {
  const { userid } = req.params;

  const sql = `
    SELECT 
      post.*,
      users.name AS author,
      categories.name AS category,
      COUNT(post_view.id) AS views,
      (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    LEFT JOIN post_view ON post_view.post_id = post.id
    WHERE post.user_id = ?
    GROUP BY post.id
    ORDER BY post.created_at DESC
  `;

  db.query(sql, [userid], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

/* =========================
   GET ALL POSTS (PAGINATED)
========================= */
exports.getAllPosts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";
  const category = req.query.category || "";
  const userIdForPost = req.query.userId; // 👈 specific user's posts
  const userId = req.user.id; // logged-in user (for likes)

  let where = "WHERE post.is_delete = 0";
  let params = [];

  /* ---------------- FILTERS ---------------- */

  if (category) {
    where += " AND categories.name = ?";
    params.push(category);
  }

  if (search) {
    where += `
      AND (
        post.title LIKE ? OR
        post.content LIKE ?
      )
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (userIdForPost) {
    where += " AND post.user_id = ?";
    params.push(userIdForPost);
  }

  /* ---------------- DATA QUERY ---------------- */

  const dataSql = `
    SELECT 
      post.*,
      users.name AS author,
      categories.name AS category,

      COUNT(DISTINCT post_view.id) AS views,

      (SELECT COUNT(*) 
        FROM comments 
        WHERE post_id = post.id AND is_delete = 0) AS commentCount,

      EXISTS (
        SELECT 1 
        FROM post_likes 
        WHERE post_id = post.id 
          AND user_id = ?
      ) AS userLiked,

      (SELECT COUNT(*) 
        FROM post_likes 
        WHERE post_id = post.id) AS totalLikes

    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    LEFT JOIN post_view ON post_view.post_id = post.id
    ${where}
    GROUP BY post.id
    ORDER BY post.created_at DESC
    LIMIT ? OFFSET ?
  `;

  /* ---------------- COUNT QUERY ---------------- */

  const countSql = `
    SELECT COUNT(DISTINCT post.id) AS total
   FROM post
LEFT JOIN categories ON post.cat_id = categories.id
LEFT JOIN users ON post.user_id = users.id
    ${where}
  `;

  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(
      dataSql,
      [userId, ...params, limit, offset],
      (err, posts) => {
        if (err) return res.status(500).json(err);

        res.json({
          posts,
          totalPages,
        });
      }
    );
  });
};

/* =========================
   DASHBOARD POSTS + CHART
========================= */
exports.getDashboardPosts = (req, res) => {
  const loggedUserId = req.user.id;
  const range = req.query.range || "all";

  let dateFilter = "";
  if (range === "7")
    dateFilter = "AND post.created_at >= NOW() - INTERVAL 7 DAY";
  if (range === "30")
    dateFilter = "AND post.created_at >= NOW() - INTERVAL 30 DAY";

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

  const chartSql = `
    SELECT categories.name, COUNT(post.id) AS total
    FROM post
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.is_delete = 0 ${dateFilter}
    GROUP BY categories.name
  `;

  db.query(postSql, [loggedUserId], (err, posts) => {
    if (err) return res.status(500).json(err);

    db.query(chartSql, (err2, chartStats) => {
      if (err2) return res.status(500).json(err2);
      res.json({ posts, chartStats });
    });
  });
};

/* =========================
   CREATE POST
========================= */
exports.createPost = (req, res) => {
  const { title, image, category, content } = req.body;
  const user_id = req.user.id;
  const slug = createSlug(title);

  const sql =
    "INSERT INTO post (title, content, image, user_id, cat_id, slug) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [title, content, image, user_id, category, slug],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ msg: "Post added successfully", result });
    },
  );
};

/* =========================
   GET POST BY SLUG
========================= */
exports.getPostBySlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT 
      post.*,
      users.name AS author,
      categories.name AS category,
      categories.id as category_id,
      (SELECT COUNT(*) FROM post_view WHERE post_id = post.id) AS views,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = post.id) AS totalLikes,
      (SELECT COUNT(*) FROM comments WHERE post_id = post.id AND is_delete = 0) AS commentCount
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.slug = ?
  `;

  db.query(sql, [slug], (err, posts) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!posts.length) return res.status(404).json({ msg: "Post not found" });
    res.json(posts[0]);
  });
};

/* =========================
   UPDATE POST (ADMIN + IMPERSONATION)
========================= */
exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.impersonatedUserId || req.user.id;
  const isAdmin = req.user.role === "admin";

  const { title, content, category, image, slug } = req.body;
  // console.log(req.body);

  if (!title || !content || !category || !image || !slug) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const sql = isAdmin
    ? `UPDATE post SET title=?, content=?, cat_id=?, image=?, slug=? WHERE id=?`
    : `UPDATE post SET title=?, content=?, cat_id=?, image=?, slug=? WHERE id=? AND user_id=?`;

  const values = isAdmin
    ? [title, content, category, image, slug, postId]
    : [title, content, category, image, slug, postId, userId];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.affectedRows)
      return res.status(403).json({ msg: "Not allowed or post not found" });

    res.json({ msg: "Updated", slug });
  });
};

/* =========================
   DELETE POST
========================= */
exports.deletePost = (req, res) => {
  const { slug } = req.params;

  db.query("UPDATE post SET is_delete = 1 WHERE slug = ?", [slug], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Post deleted successfully" });
  });
};

/* =========================
   LIKE / UNLIKE POST
========================= */
exports.toggleLike = (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  db.query(
    "SELECT 1 FROM post_likes WHERE post_id=? AND user_id=?",
    [postId, userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length) {
        db.query(
          "DELETE FROM post_likes WHERE post_id=? AND user_id=?",
          [postId, userId],
          () => res.json({ liked: false }),
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
};

/* =========================
   SIMPLE PUBLIC POSTS
========================= */
exports.getHeroPosts = (req, res) => {
  const sql = `
    SELECT 
      post.*,
      users.name AS author,
      categories.name AS category
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.is_delete = 0
  `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    // console.log(data);
    res.json(data);
  });
};

exports.getBusinessPosts = (req, res) => {
  const sql = `
    SELECT 
      post.* ,
      users.name AS author,
      categories.name AS category
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    WHERE post.is_delete = 0
      AND LOWER(categories.name) = 'business'
    ORDER BY post.created_at DESC
  `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: "Database error" });
    // console.log("Business posts:", data);
    res.json(data);
  });
};
