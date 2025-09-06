const db = require('../db');

const Order = {
  create: (buyerId, totalAmount, callback) => {
    const sql = `INSERT INTO Orders (buyer_id, total_amount) VALUES (?, ?)`;
    db.query(sql, [buyerId, totalAmount], callback);
  },

  getByBuyerId: (buyerId, callback) => {
    const sql = `SELECT * FROM Orders WHERE buyer_id = ?`;
    db.query(sql, [buyerId], callback);
  },

  updateStatus: (orderId, status, callback) => {
    const sql = `UPDATE Orders SET status = ? WHERE id = ?`;
    db.query(sql, [status, orderId], callback);
  }
};

module.exports = Order;
