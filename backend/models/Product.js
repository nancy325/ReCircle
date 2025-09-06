const db = require('../db');

const Product = {
  create: (productData, callback) => {
    const sql = `INSERT INTO Products (title, description, price, category_id, seller_id, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [productData.title, productData.description, productData.price, productData.category_id, productData.seller_id, productData.status || 'available'], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM Products`;
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM Products WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  updateStatus: (id, status, callback) => {
    const sql = `UPDATE Products SET status = ? WHERE id = ?`;
    db.query(sql, [status, id], callback);
  }
};

module.exports = Product;
