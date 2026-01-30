require("dotenv").config();
const mysql = require("mysql2");

let db;

if (process.env.DATABASE_URL) {
  console.log("Using Railway DB URL");
  db = mysql.createConnection(process.env.DATABASE_URL);
} else {
  console.log("Using Local DB");
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });
}

db.connect((err) => {
  if (err) {
    console.error("❌ DB CONNECTION FAILED:", err);
  } else {
    console.log("✅ DATABASE CONNECTED");
  }
});

module.exports = db;



 // host: "localhost",
  // user: "nodeuser",
  // password: "nodepass123",
  // database: "blog_system",
