const db = require('../db');

const Cart = {
  create: (userId, callback) => {
    const sql = `INSERT INTO Carts (user_id) VALUES (?)`;
    db.query(sql, [userId], callback);
  },

  getByUserId: (userId, callback) => {
    const sql = `SELECT * FROM Carts WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  }
};

module.exports = Cart;
