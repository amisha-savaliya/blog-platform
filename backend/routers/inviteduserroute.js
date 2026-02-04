require("dotenv").config();
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var db = require("../database/connection");
const verifyAdmin = require("../middleware/verifyAdmin");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to invite a new user by admin
router.post("/", verifyAdmin, (req, res) => {
  const { email, role } = req.body;

  const inviteToken = crypto.randomBytes(32).toString("hex");
  const link = `http://localhost:5173/setup-account/${inviteToken}`;

  // 1️⃣ Check if user already exists
  db.query(
    "SELECT id FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "User already invited or exists" });
      }

      try {
        transporter.sendMail({
          from: `"Blog System" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Set up your account",
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
          <a href="${link}" 
             style="background:#4f46e5; color:white; padding:14px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
            Setup Your Account
          </a>
        </div>

        <p style="font-size:14px; color:#555;">
          This invitation link will expire in <strong>24 hours</strong>.
        </p>

        <p style="font-size:13px; word-break:break-all;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${link}">${link}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Blog System. All rights reserved.
      </div>

    </div>
  </div>
`
,
        });
        db.query(
          `INSERT INTO user_invites (email, role, token, used, expires_at)
   VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
          [email, role, inviteToken, 0],
          (err2, data) => {
            if (err2) {
              console.log("DB ERROR:", err2); // show real reason
              return res.status(500).json({ message: "Insert failed" });
            }

            res.json({ message: "Invitation sent successfully" });
          },
        );
      } catch (mailErr) {
        console.error("Mail error:", mailErr);
        res.status(500).json({ message: "Email failed, user not saved" });
      }
    },
  );
});

//verify invite token and get invite info
router.get("/invite-info/:inviteToken", async (req, res) => {
  const { inviteToken } = req.params;

  try {
    const sql = `
      SELECT email, role
      FROM user_invites
      WHERE token = ?
      AND used = 0
      AND expires_at > NOW()
      LIMIT 1
    `;

    db.query(sql, [inviteToken], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid invite link" });
      }
  
    const invite = results[0];

    // Already used
    if (invite.used === 1) {
      return res.status(409).json({
        message: "Account setup already completed. Please login.",
        setupDone: true,
      });
    }

    //  Expired
    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({ message: "Invite link expired" });
    }

      res.json({
        email: results[0].email,
        role: results[0].role,
        setupDone: false,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//set up of invited user account
router.post("/setup", async (req, res) => {
  const { inviteToken, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const inviteSql = `
      SELECT * FROM user_invites 
      WHERE token=? AND used=0 AND expires_at>NOW() 
      LIMIT 1
    `;

    db.query(inviteSql, [inviteToken], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid or expired link" });
      }

      const invite = results[0];

      const dataSql = `
        INSERT INTO users (name, email, password, role_id,is_active) 
        VALUES (?,?,?,?,1)
      `;

      db.query(
        dataSql,
        [name, invite.email, hashedPassword, invite.role],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: "Failed to create user" });

          db.query(
            "UPDATE user_invites SET used=1 WHERE id=?",
            [invite.id],
            (err3) => {
              if (err3)
                return res
                  .status(500)
                  .json({ message: "Failed to update invite" });

              res.json({ message: "Account created successfully" });
            },
          );
        },
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
