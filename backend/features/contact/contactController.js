const db = require("../../database/connection");



/* ===============================
   SAVE CONTACT MESSAGE
================================ */
exports.sendContactMessage = (req, res) => {
  const { name, email, msg } = req.body;

  if (!name || !email || !msg) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    INSERT INTO contact (name, email, msg)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, msg], (err) => {
    if (err) {
      console.error("Contact save error:", err);
      return res.status(500).json({ message: "Failed to send message" });
    }

    res.json({ message: "Message sent successfully" });
  });
};
/*  ===========
action on inquiry (admin)
=================*/

exports.markAsRead = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE contact
    SET is_action = 1
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Inquiry marked as read" });
  });
};


/* ==============
delete inquiry 
============== */
exports.deleteContact = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM contact WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Inquiry deleted successfully" });
  });
};
/* ==========
get single inquiry 
=============*/
exports.getContactById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM contact
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length)
      return res.status(404).json({ message: "Inquiry not found" });

    res.json(result[0]);
  });
};


/* ===============================
   GET ALL INQUIRIES (ADMIN)
================================ */
exports.getAllContacts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  let where = "WHERE 1=1";
  let params = [];

  if (search) {
    where += `
      AND (
        name LIKE ? OR
        email LIKE ? OR
        msg LIKE ?
      )
    `;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const dataSql = `
    SELECT 
      id,
      name,
      email,
      msg,
      created_at,
      is_action
    FROM contact
    ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM contact
    ${where}
  `;

  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataSql, [...params, limit, offset], (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json({
        inquiries: rows,
        totalPages,
      });
    });
  });
};