const db = require('../db');

const Favorite = {
  add: (userId, productId, callback) => {
    const sql = `INSERT INTO Favorites (user_id, product_id) VALUES (?, ?)`;
    db.query(sql, [userId, productId], callback);
  },

  remove: (userId, productId, callback) => {
    const sql = `DELETE FROM Favorites WHERE user_id = ? AND product_id = ?`;
    db.query(sql, [userId, productId], callback);
  },

  getByUserId: (userId, callback) => {
    const sql = `SELECT * FROM Favorites WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  }
};

module.exports = Favorite;
