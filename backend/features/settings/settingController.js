const db = require("../../database/connection");

// GET BLOG SETTINGS
exports.getBlogSettings = (req, res) => {
  const sql = "SELECT * FROM blog_settings LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result.length) {
      return res.status(404).json({ msg: "Blog settings not found" });
    }

    res.json(result[0]);
  });
};

// UPDATE BLOG SETTINGS
exports.updateBlogSettings = (req, res) => {
  const {
    admin_email,
    contact,
    address,
    posts_per_page,
  } = req.body;

  // basic validation
  if (!admin_email || !posts_per_page) {
    return res.status(400).json({ msg: "Required fields missing" });
  }

  const sql = `
    UPDATE blog_settings
    SET
      admin_email = ?,
      contact = ?,
      address = ?,
      posts_per_page = ?
    WHERE id = 1
  `;

  db.query(
    sql,
    [admin_email, contact, address, posts_per_page],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Blog settings not found" });
      }

      res.json({ msg: "Blog settings updated successfully" });
    }
  );
};