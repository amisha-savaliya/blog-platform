var express = require("express");
var mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "nodeuser",
  password: "nodepass123",
  database: "blog_system",
});
db.connect((err) => {
  if (err) {
    console.log("not connect ");
  } else {
    console.log("connected");
  }
});

module.exports = db;
