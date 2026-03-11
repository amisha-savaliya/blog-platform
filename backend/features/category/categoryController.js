const db = require("../../database/connection");

/* =========================
   GET ALL CATEGORIES (PUBLIC)
========================= */
exports.getAllCategories = (req, res) => {
  const sql = `
    SELECT 
      categories.*, 
      COUNT(post.id) AS posts
    FROM categories
    LEFT JOIN post 
      ON post.cat_id = categories.id 
      AND post.is_delete = 0
       WHERE categories.is_delete = 0
    GROUP BY categories.id
   
  `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

/* =========================
   ADD CATEGORY (PROTECTED)
========================= */
exports.addCategory = (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ msg: "Category name is required" });
  }

  const sql = "INSERT INTO categories (name) VALUES (?)";

  db.query(sql, [name.trim()], (err) => {
    if (err) return res.status(500).json({ msg: "Not added" });
    res.json({ msg: "Added successfully" });
  });
};

/* =========================
   DELETE CATEGORY
========================= */
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE categories SET is_delete = 1 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result.affectedRows) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category deleted successfully" });
  });
};

/* =========================
   UPDATE CATEGORY
========================= */
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ msg: "Category name is required" });
  }

  const sql =
    "UPDATE categories SET name = ? WHERE id = ? AND is_delete = 0";

  db.query(sql, [name.trim(), id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result.affectedRows) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ result,msg: "Category updated successfully"});
  });
};
/*  ========================
  GET POST BY CATEGORY 
  ===========================*/

  exports.getPostsByCategory = (req, res) => {
  const { name } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const where = `
    WHERE post.is_delete = 0
      AND LOWER(categories.name) = LOWER(?)
  `;

  const countSql = `
    SELECT COUNT(DISTINCT post.id) AS total
    FROM post
    LEFT JOIN categories ON post.cat_id = categories.id
    ${where}
  `;

  const dataSql = `
    SELECT
      post.*,
      users.name AS author,
      categories.name AS category
    FROM post
    LEFT JOIN users ON post.user_id = users.id
    LEFT JOIN categories ON post.cat_id = categories.id
    ${where}
    ORDER BY post.created_at DESC
    LIMIT ? OFFSET ?
  `;

  // 1️⃣ Get total count
  db.query(countSql, [name], (err, countResult) => {
    if (err) {
      console.error("Category count error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // 2️⃣ Get paginated posts
    db.query(
      dataSql,
      [name, limit, offset],
      (err, posts) => {
        if (err) {
          console.error("Category posts error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          posts,
          totalPages,
        });
      }
    );
  });
};