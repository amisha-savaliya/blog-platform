const db = require("../../../database/connection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../../../utils/mailer");

// 🔹 INVITE USER (ADMIN)
exports.inviteUser = (req, res) => {
  const { email, role } = req.body;

  const inviteToken = crypto.randomBytes(32).toString("hex");
  const inviteLink = `http://localhost:5173/setup-account/${inviteToken}`;

  db.query(
    "SELECT id FROM users WHERE email=?",
    [email],
    async (err, existing) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (existing.length > 0) {
        return res.status(400).json({
          message: "User already exists or already invited",
        });
      }

      try {
        await transporter.sendMail({
          from: `"Blog System" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Set up your account",
          html: `
            <p>You have been invited to Blog System</p>
            <a href="${inviteLink}">Setup Account</a>
            <p>This link expires in 24 hours</p>
          `,
        });

        const sql = `
          INSERT INTO user_invites (email, role, token, used, expires_at)
          VALUES (?, ?, ?, 0, DATE_ADD(NOW(), INTERVAL 1 DAY))
        `;

        db.query(sql, [email, role, inviteToken], (err2) => {
          if (err2)
            return res.status(500).json({ message: "Invite save failed" });

          res.json({ message: "Invitation sent successfully" });
        });
      } catch (errMail) {
        res.status(500).json({ message: "Email failed to send" });
      }
    }
  );
};

// 🔹 VERIFY INVITE TOKEN
exports.getInviteInfo = (req, res) => {
  const { inviteToken } = req.params;

  const sql = `
    SELECT email, role, used, expires_at
    FROM user_invites
    WHERE token = ?
    LIMIT 1
  `;

  db.query(sql, [inviteToken], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!results.length)
      return res.status(400).json({ message: "Invalid invite link" });

    const invite = results[0];

    if (invite.used) {
      return res.status(409).json({
        message: "Account already set up",
        setupDone: true,
      });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ message: "Invite link expired" });
    }

    res.json({
      email: invite.email,
      role: invite.role,
      setupDone: false,
    });
  });
};

// 🔹 SETUP ACCOUNT
exports.setupAccount = async (req, res) => {
  const { inviteToken, name, password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const inviteSql = `
    SELECT * FROM user_invites
    WHERE token=? AND used=0 AND expires_at>NOW()
    LIMIT 1
  `;

  db.query(inviteSql, [inviteToken], (err, invites) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!invites.length)
      return res.status(400).json({ message: "Invalid or expired invite" });

    const invite = invites[0];

    const userSql = `
      INSERT INTO users (name, email, password, role_id, is_active)
      VALUES (?, ?, ?, ?, 1)
    `;

    db.query(
      userSql,
      [name, invite.email, hashedPassword, invite.role],
      (err2) => {
        if (err2)
          return res.status(500).json({ message: "User creation failed" });

        db.query(
          "UPDATE user_invites SET used=1 WHERE id=?",
          [invite.id],
          () => res.json({ message: "Account created successfully" })
        );
      }
    );
  });
};