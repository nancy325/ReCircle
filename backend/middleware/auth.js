const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("SECRET:", process.env.JWT_SECRET);
console.log("Decoded:", decoded);

    // Verify user still exists in database
    const [users] = await db.promise().query(
      'SELECT id, email, username FROM Users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = users[0]; // Attach user info to request
    next(); // Continue to the next middleware/route
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = { authenticateToken };