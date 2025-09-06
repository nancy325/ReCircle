const db = require('../db');

const CartItem = {
  add: (cartId, productId, quantity = 1, callback) => {
    const sql = `INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
    db.query(sql, [cartId, productId, quantity, quantity], callback);
  },

  remove: (cartId, productId, callback) => {
    const sql = `DELETE FROM CartItems WHERE cart_id = ? AND product_id = ?`;
    db.query(sql, [cartId, productId], callback);
  },

  getByCartId: (cartId, callback) => {
    const sql = `SELECT * FROM CartItems WHERE cart_id = ?`;
    db.query(sql, [cartId], callback);
  }
};

module.exports = CartItem;
