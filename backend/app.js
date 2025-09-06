<<<<<<< HEAD

=======
>>>>>>> 64960f6b607050b3a794e2b947ac3aa8523990f0
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes'); 
const product = require('./routes/productRoutes');
// const db = require('./db');

// const userRoutes = require("./routes/userRoutes");

<<<<<<< HEAD


const app = express();
app.use(express.json());


=======
const app = express();
app.use(express.json());

// Routes
>>>>>>> 64960f6b607050b3a794e2b947ac3aa8523990f0
app.use("/api/auth", authRoutes);
app.use("/api/products", product);

const db = require('./db');

<<<<<<< HEAD
// Example query
db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) throw err;
  console.log('The solution is: ', results[0].solution);
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

=======
>>>>>>> 64960f6b607050b3a794e2b947ac3aa8523990f0



module.exports = app;
