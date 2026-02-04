require("dotenv").config();
var express = require("express");
var db = require("../database/connection");
var router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to handle password reset request
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";
  db.query(sql, [email], (err, data) => {
    if (err) return res.status(500).json({ message: "DB error" });
    // console.log(data);
if (data.length === 0) {
  return res.json({ message: " email does not exist !!!, please check your email" });
}
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    const updateSql =
      "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?";

    db.query(updateSql, [resetToken, expiry, email], async (err2) => {
      if (err2) return res.status(500).json({ message: "Update failed" });

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      try {
        await transporter.sendMail({
          from: `"Blog System" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Reset Your Password",
          html: `
           
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">Blog System</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px; color:#333;">
        <h2 style="margin-top:0;">You're Invited 🎉</h2>
        <p>You’ve been invited to join <strong>Blog System</strong>.</p>
        <p>Click the button below to set up your account:</p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${resetLink}" 
             style="background:#4f46e5; color:white; padding:14px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
            Reset Your Password
          </a>
        </div>

        <p style="font-size:14px; color:#555;">
          This invitation link will expire in <strong>15 minutes</strong>.
        </p>

        <p style="font-size:13px; word-break:break-all;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetLink}">${resetLink}</a>

        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Blog System. All rights reserved.
      </div>

    </div>
  </div>


          `,
        });

        res.json({ message: "If this email exists, reset link was sent" });
      } catch (mailErr) {
        res.status(500).json({ message: "Email failed to send" });
      }
    });
  });
});



//user used link or expired
router.get("/verify-reset-token/:resetToken", (req, res) => {
  const { resetToken } = req.params;

  db.query(
    "SELECT id, reset_token_expiry FROM users WHERE reset_token=?",
    [resetToken],
    (err, data) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (!data || data.length === 0) {
        return res.status(400).json({ message: "Invalid reset link" });
      }

      const expiry = new Date(data[0].reset_token_expiry);

      if (!expiry || expiry < new Date()) {
        return res.status(400).json({ message: "Reset link expired" });
      }

      res.json({ valid: true });
    }
  );
});


// Route to handle password reset
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  db.query(
    "SELECT id FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [hashedToken],
    async (err, data) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!data.length)
        return res.status(400).json({ message: "Invalid or expired link" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?",
        [hashedPassword, data[0].id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Update failed" });

          res.json({ message: "Password reset successful" });
        }
      );
    }
  );
});

module.exports = router;
