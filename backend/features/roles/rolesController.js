var db = require("../../database/connection");

// Get roles
exports.getRoles = (req, res) => {
  const sql = "SELECT * FROM role WHERE is_delete = 0";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

// Add role
exports.addRole = (req, res) => {
  const { name } = req.body;

  const sql = "INSERT INTO role (name) VALUES (?)";
  db.query(sql, [name], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Role added" });
  });
};

// Update role
exports.updateRole = (req, res) => {
  const { id } = req.params;
  const { editName } = req.body;

  const sql = "UPDATE role SET name=? WHERE id=?";
  db.query(sql, [editName, id], (err, data) => {
    if (err) return res.status(500).json(err);

    res.json({
      id,
      editName,
      msg: "Role updated",
    });
  });
};

// Soft delete role
exports.deleteRole = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE role SET is_delete=1 WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({id, msg: "Role deleted" });
  });
};
