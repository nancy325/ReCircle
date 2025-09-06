const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes'); 
// const db = require('./db');

// const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const db = require('./db');

// Example query
db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) throw err;
  console.log('The solution is: ', results[0].solution);
});


module.exports = app;
