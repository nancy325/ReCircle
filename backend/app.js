const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes'); 
const product = require('./routes/productRoutes');
// const db = require('./db');

// const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", product);

const db = require('./db');




module.exports = app;
