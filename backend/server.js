require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
//to show logs
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

// all routes
app.use("/blog", require("./routes/route"));

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// app.use((req, res, next) => {
//   const start = Date.now();

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     console.log(
//       `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
//     );
//   });

//   next();
// });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Express server running at", PORT)
);