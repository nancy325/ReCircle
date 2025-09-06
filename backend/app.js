const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const product = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", product);
app.use("/api/payment", paymentRoutes);

const db = require('./db');

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

module.exports = app;
