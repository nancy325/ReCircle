const db = require('../db');

const OrderItem = {
  add: (orderId, productId, quantity, price, callback) => {
    const sql = `INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
    db.query(sql, [orderId, productId, quantity, price], callback);
  },

  getByOrderId: (orderId, callback) => {
    const sql = `SELECT * FROM OrderItems WHERE order_id = ?`;
    db.query(sql, [orderId], callback);
  }
};

module.exports = OrderItem;
