
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes'); 
// const db = require('./db');

// const userRoutes = require("./routes/userRoutes");



const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);

const db = require('./db');

// Example query
db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) throw err;
  console.log('The solution is: ', results[0].solution);
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);


app.listen(5000, () => console.log('Server running on port 5000'));

module.exports = app;
