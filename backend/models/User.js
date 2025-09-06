const db = require('../db');

const User = {
  create: (userData, callback) => {
    const sql = `INSERT INTO Users (email, password_hash, username, profile_image) VALUES (?, ?, ?, ?)`;
    db.query(sql, [userData.email, userData.password_hash, userData.username, userData.profile_image || null], callback);
  },

  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM Users WHERE email = ?`;
    db.query(sql, [email], callback);
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM Users WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  updateProfileImage: (id, imagePath, callback) => {
    const sql = `UPDATE Users SET profile_image = ? WHERE id = ?`;
    db.query(sql, [imagePath, id], callback);
  }
};

module.exports = User;
