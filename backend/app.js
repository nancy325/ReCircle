const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes'); 
const product = require('./routes/productRoutes');
const cart = require('./routes/cartRoutes');
// const db = require('./db');

// const userRoutes = require("./routes/userRoutes");



const app = express();
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", product);
app.use("/api/cart", cart);

const db = require('./db');

// Example query
db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) throw err;
  console.log('The solution is: ', results[0].solution);
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);




module.exports = app;
