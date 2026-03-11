const db = require("../../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../../utils/mailer");


/*--------sign up the user -----------*/

exports.signup=(req,res)=>
{
   
  try {
 
    const { uname, email, password, role } = req.body;

    if (!uname || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const checkUser = "SELECT id FROM users WHERE email = ?";
    db.query(checkUser, [email], async (err, result) => {
      if (err) return res.status(500).json({ msg: "Database error" });

      if (result.length > 0) {
        return res.status(409).json({ msg: "Email already registered" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";

      db.query(sql, [uname, email, hashPassword, role], (err, data) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ msg: "Signup failed. Please try again." });
        }

        res.status(201).json({
          msg: "User added successfully",
          user: data,
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
}
/*-------------------userLogin------------*/
exports.userLogin=(req, res) => {
  const { email, password } = req.body;
  //  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const sql = `SELECT * FROM users WHERE email = ? `;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = result[0];
    // console.log("USER FOUND:", user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role_id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    db.query(
      "UPDATE users SET token = ? WHERE id = ?",
      [token, user.id],
      (err) => {
        if (err) return res.status(500).json({ msg: "Token update failed" });

        res.status(200).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            created_at: user.created_at,
          },
        });
      },
    );
  });
}

/*=====================
    adminlogin
===================== */
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND role_id=2";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Server error" });
    if (!result.length)
      return res.status(401).json({ msg: "Admin not found" });

    const admin = result[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id,name:admin.name, role: "admin", type: "admin",email:admin.email,created_at:admin.created_at },
    
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    db.query("UPDATE users SET token=? WHERE id=?", [token, admin.id]);

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: "admin",
        name:admin.name,
        created_at:admin.created_at,
      },
    });
  });
};

exports.logout= (req, res) => {
  const userId = req.user.id; // from verifyToken
  // console.log(userId)

  db.query(
    "UPDATE users SET token = NULL WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
        console.log("Affected rows:", result.affectedRows);
      res.json({ message: "Logged out successfully" });
    }
  );


}


// FORGOT PASSWORD
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const sql = "SELECT id FROM users WHERE email=?";
  db.query(sql, [email], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });

    // Always send same response (security)
    if (!data.length) {
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    db.query(
      "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
      [hashedToken, expiry, email],
      async (err2) => {
        if (err2)
          return res.status(500).json({ message: "Update failed" });

        const resetLink = `http://localhost:5173/blog/reset-password/${resetToken}`;

        try {
          await transporter.sendMail({
            from: `"Blog System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: `
              <p>You requested a password reset.</p>
              <p><a href="${resetLink}">Reset Password</a></p>
              <p>This link expires in 15 minutes.</p>
            `,
          });

          res.json({
            message: "If this email exists, a reset link has been sent",
          });
        } catch (e) {
          res.status(500).json({ message: "Email send failed" });
        }
      }
    );
  });
};

// VERIFY RESET TOKEN
exports.verifyResetToken = (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  db.query(
    "SELECT reset_token_expiry FROM users WHERE reset_token=?",
    [hashedToken],
    (err, data) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!data.length)
        return res.status(400).json({ message: "Invalid reset link" });

      const expiry = new Date(data[0].reset_token_expiry);
      if (expiry < new Date()) {
        return res.status(400).json({ message: "Reset link expired" });
      }

      res.json({ valid: true });
    }
  );
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  db.query(
    "SELECT id FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [hashedToken],
    async (err, data) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!data.length)
        return res.status(400).json({ message: "Invalid or expired link" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?",
        [hashedPassword, data[0].id],
        (err2) => {
          if (err2)
            return res.status(500).json({ message: "Update failed" });

          res.json({ message: "Password reset successful" });
        }
      );
    }
  );
};