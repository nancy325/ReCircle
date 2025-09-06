const db = require('../db');

const verifyProductOwner = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const [products] = await db.execute(
      'SELECT seller_id FROM Products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[0].seller_id !== userId) {
      return res.status(403).json({ error: 'You can only modify your own products' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyCartOwner = async (req, res, next) => {
  try {
    const cartId = req.params.cartId || req.body.cartId;
    const userId = req.user.id;

    const [carts] = await db.execute(
      'SELECT user_id FROM Carts WHERE id = ?',
      [cartId]
    );

    if (carts.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (carts[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only access your own cart' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyProductOwner, verifyCartOwner };