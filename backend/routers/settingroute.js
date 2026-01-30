var express = require("express");
var db = require("../database/connection");
var router = express.Router();

/* GET blog settings */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM blog_settings LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

/* UPDATE blog settings */
router.put("/", (req, res) => {
  const {
    admin_email,
    contact,
    address,
    posts_per_page,
  } = req.body;

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
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Blog settings updated successfully" });
    }
  );
});

module.exports = router;
