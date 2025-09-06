const db = require('../db');

const ProductImage = {
  add: (productId, imageUrl, isPrimary = false, callback) => {
    const sql = `INSERT INTO ProductImages (product_id, image_url, is_primary) VALUES (?, ?, ?)`;
    db.query(sql, [productId, imageUrl, isPrimary], callback);
  },

  getByProductId: (productId, callback) => {
    const sql = `SELECT * FROM ProductImages WHERE product_id = ?`;
    db.query(sql, [productId], callback);
  }
};

module.exports = ProductImage;
