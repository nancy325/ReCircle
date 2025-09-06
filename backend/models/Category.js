const db = require('../db');

const Category = {
  getAll: (callback) => {
    const sql = `SELECT * FROM Categories`;
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM Categories WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Category;
