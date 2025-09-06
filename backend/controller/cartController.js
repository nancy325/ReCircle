// backend/controllers/cartController.js
const db = require('../db');

// Helper: Get or create cart for user
const getOrCreateCart = async (userId) => {
    let [cartRows] = await db.execute('SELECT id FROM Carts WHERE user_id = ?', [userId]);
    if (cartRows.length > 0) {
        return cartRows[0].id;
    } else {
        const [result] = await db.execute('INSERT INTO Carts (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
};

// @desc    Get user's cart with items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.id);

        const [cartItems] = await db.execute(
            `SELECT ci.id as cart_item_id, ci.quantity, ci.added_at,
                    p.id as product_id, p.title, p.price, p.condition,
                    c.name as category_name,
                    pi.image_url as primary_image
             FROM CartItems ci
             JOIN Products p ON ci.product_id = p.id
             JOIN Categories c ON p.category_id = c.id
             LEFT JOIN ProductImages pi ON p.id = pi.product_id AND pi.is_primary = TRUE
             WHERE ci.cart_id = ?
             AND p.status = 'available'`,
            [cartId]
        );

        // Calculate total
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });

        res.json({
            cart_id: cartId,
            items: cartItems,
            total_amount: total.toFixed(2),
            item_count: cartItems.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'message: err.message, stack: err.stack' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id || quantity < 1) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        // Check if product exists and is available
        const [productRows] = await db.execute(
            'SELECT id, price FROM Products WHERE id = ? AND status = "available"',
            [product_id]
        );

        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found or not available' });
        }

        const cartId = await getOrCreateCart(req.user.id);

        // Try to update quantity if item exists
        const [updateResult] = await db.execute(
            'UPDATE CartItems SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
            [quantity, cartId, product_id]
        );

        if (updateResult.affectedRows === 0) {
            // Insert new item
            await db.execute(
                'INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, product_id, quantity]
            );
        }

        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        // Verify item belongs to user's cart
        const [itemRows] = await db.execute(
            `SELECT ci.id
             FROM CartItems ci
             JOIN Carts c ON ci.cart_id = c.id
             WHERE ci.id = ? AND c.user_id = ?`,
            [req.params.itemId, req.user.id]
        );

        if (itemRows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await db.execute(
            'UPDATE CartItems SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [quantity, req.params.itemId]
        );

        res.json({ message: 'Cart item updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeItemFromCart = async (req, res) => {
    try {
        // Verify item belongs to user's cart
        const [itemRows] = await db.execute(
            `SELECT ci.id
             FROM CartItems ci
             JOIN Carts c ON ci.cart_id = c.id
             WHERE ci.id = ? AND c.user_id = ?`,
            [req.params.itemId, req.user.id]
        );

        if (itemRows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await db.execute('DELETE FROM CartItems WHERE id = ?', [req.params.itemId]);

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart
};