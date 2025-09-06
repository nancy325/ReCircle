const express = require('express');
const app = express();
app.use(express.json());

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

module.exports = app;
