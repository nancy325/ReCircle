const db = require('../db');

// Helper: Format response
const formatResponse = (success, data, message = '', error = '') => ({
  success,
  data,
  message,
  error,
});

// Helper: Safe pagination metadata
const getPaginationMeta = (total, page, limit) => ({
  total: parseInt(total),
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / limit),
});

// Helper: Safe parameter conversion
const safeParseInt = (value, defaultValue, min = 1, max = 100) => {
  const parsed = parseInt(value);
  if (isNaN(parsed)) return defaultValue;
  return Math.min(Math.max(parsed, min), max);
};

// 1. Get all products with filtering, sorting, pagination
exports.getAllProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      condition,
      search,
      sort = 'newest',
    } = req.query;

    // Validate and sanitize inputs
    page = safeParseInt(page, 1, 1, 100);
    limit = safeParseInt(limit, 10, 1, 50);
    const offset = (page - 1) * limit;

    // Build safe filters with parameterized queries
    let filterConditions = ['p.`status` = "available"'];
    let params = [];

    if (category && !isNaN(Number(category))) {
      filterConditions.push('p.`category_id` = ?');
      params.push(parseInt(category));
    }

    if (condition && ['new', 'like_new', 'good', 'fair', 'poor'].includes(condition)) {
      filterConditions.push('p.`condition` = ?');
      params.push(condition);
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      filterConditions.push('p.`price` >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      filterConditions.push('p.`price` <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      filterConditions.push('(p.`title` LIKE ? OR p.`description` LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    // Safe sorting
    let orderBy = 'p.`created_at` DESC';
    const sortOptions = {
      'newest': 'p.`created_at` DESC',
      'price_low_high': 'p.`price` ASC',
      'price_high_low': 'p.`price` DESC'
    };
    if (sortOptions[sort]) {
      orderBy = sortOptions[sort];
    }

    // Count total with safe query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE ${filterConditions.join(' AND ')}
    `;
    const [countRows] = await db.execute(countQuery, params);
    const total = countRows[0]?.total || 0;

    // Main query
    const mainQuery = `
      SELECT
        p.id, p.title, p.price, p.\`condition\`,
        c.name AS category_name,
        u.username AS seller_name,
        (SELECT image_url FROM productimages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE ${filterConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    
    const queryParams = [...params, limit, offset];
    const [rows] = await db.query(mainQuery, queryParams);
    return res.status(200).json(formatResponse(true, {
      products: rows,
      pagination: getPaginationMeta(total, page, limit)
    }, 'Products retrieved successfully'));

  } catch (error) {
    console.error('GetAllProducts Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

// 2. Get product by ID with seller info and images
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid product ID'));
    }

    // Product details
    const productQuery = `
      SELECT
        p.*, 
        c.name AS category_name, 
        c.description AS category_description,
        u.username AS seller_name, 
        u.email AS seller_email
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = ? AND p.\`status\` = 'available'
      LIMIT 1
    `;
    
    const [productRows] = await db.execute(productQuery, [productId]);
    
    if (productRows.length === 0) {
      return res.status(404).json(formatResponse(false, null, '', 'Product not found'));
    }

    const product = productRows[0];

    // Images
    const [images] = await db.execute(
      'SELECT id, image_url, is_primary FROM productimages WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC',
      [productId]
    );
    
    product.images = images;

    return res.status(200).json(formatResponse(true, product, 'Product details retrieved'));

  } catch (error) {
    console.error('GetProductById Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

// 3. Create new product (authenticated users only)
exports.createProduct = async (req, res) => {
  try {
    // Comment out user authentication for testing in Postman
    // const userId = req.user?.id;
    // if (!userId) {
    //   return res.status(401).json(formatResponse(false, null, '', 'Unauthorized'));
    // }

    // For testing, use a fixed user ID (replace with a valid user from your DB)
    const userId = 1; // <-- Set your test user ID here
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'category_id', 'quantity', 'condition'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json(formatResponse(false, null, '', `Missing required fields: ${missingFields.join(', ')}`));
    }

    const {
      title, description, price, category_id, quantity, condition,
      year_of_manufacture, brand, model, length_cm, width_cm, height_cm,
      weight_kg, material, color, has_original_packaging, has_manual,
      working_condition_description,
    } = req.body;

    // Validate numerical values
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid price'));
    }
    
    if (isNaN(parseInt(quantity)) || parseInt(quantity) < 1) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid quantity'));
    }

    if (isNaN(parseInt(category_id)) || parseInt(category_id) < 1) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid category'));
    }

    // Check if category exists
    const [categoryCheck] = await db.execute(
      'SELECT id FROM categories WHERE id = ?',
      [parseInt(category_id)]
    );
    
    if (categoryCheck.length === 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Category does not exist'));
    }

    const insertQuery = `
      INSERT INTO products (
        title, description, price, category_id, seller_id, status, quantity, \`condition\`,
        year_of_manufacture, brand, model, length_cm, width_cm, height_cm, weight_kg,
        material, color, has_original_packaging, has_manual, working_condition_description
      ) VALUES (?, ?, ?, ?, ?, 'available', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      title, description, parseFloat(price), parseInt(category_id), userId, 
      parseInt(quantity), condition,
      year_of_manufacture || null, 
      brand || null, 
      model || null, 
      length_cm ? parseFloat(length_cm) : null,
      width_cm ? parseFloat(width_cm) : null,
      height_cm ? parseFloat(height_cm) : null,
      weight_kg ? parseFloat(weight_kg) : null,
      material || null, 
      color || null,
      has_original_packaging ? 1 : 0,
      has_manual ? 1 : 0,
      working_condition_description || null,
    ];

    const [result] = await db.execute(insertQuery, params);

    return res.status(201).json(formatResponse(true, 
      { productId: result.insertId }, 
      'Product created successfully'
    ));

  } catch (error) {
    console.error('CreateProduct Error:', error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid category or reference'));
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(formatResponse(false, null, '', 'Duplicate entry'));
    }
    
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

// 4. Update product (only by owner)
exports.updateProduct = async (req, res) => {
  try {
    // Commented out authentication for testing
    // const userId = req.user?.id;
    // if (!userId) {
    //   return res.status(401).json(formatResponse(false, null, '', 'Unauthorized'));
    // }

    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid product ID'));
    }

    // For testing, you can use a fixed userId or skip owner check
    // const userId = 1; // <-- Set your test user ID here

    // Check ownership (optional for testing)
    // const [ownerRows] = await db.query('SELECT seller_id FROM products WHERE id = ?', [id]);
    // if (ownerRows.length === 0) {
    //   return res.status(404).json(formatResponse(false, null, '', 'Product not found'));
    // }
    // if (ownerRows[0].seller_id !== userId) {
    //   return res.status(403).json(formatResponse(false, null, '', 'Forbidden: Not product owner'));
    // }

    // Validate input
    const allowedFields = [
      'title', 'description', 'price', 'category_id', 'quantity', 'condition',
      'year_of_manufacture', 'brand', 'model', 'length_cm', 'width_cm', 'height_cm',
      'weight_kg', 'material', 'color', 'has_original_packaging', 'has_manual',
      'working_condition_description'
    ];
    const updates = [];
    const params = [];
    for (const field of allowedFields) {
      if (field in req.body) {
        // Use backticks for reserved words
        if (field === 'condition') {
          updates.push('`condition` = ?');
        } else {
          updates.push(`${field} = ?`);
        }
        params.push(req.body[field]);
      }
    }
    if (updates.length === 0) {
      return res.status(400).json(formatResponse(false, null, '', 'No valid fields to update'));
    }
    params.push(id);

    const updateQuery = `
      UPDATE products SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;

    try {
      await db.execute(updateQuery, params);
      return res.status(200).json(formatResponse(true, null, 'Product updated successfully'));
    } catch (error) {
      console.error('UpdateProduct Error:', error);
      return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
    }
  } catch (error) {
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};
// 5. Delete product (soft delete, only by owner)
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return res.status(401).json(formatResponse(false, null, '', 'Unauthorized'));
    }
    
    const productId = parseInt(id);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid product ID'));
    }

    // Check ownership
    const [ownerRows] = await db.execute(
      'SELECT seller_id FROM products WHERE id = ? AND status = "available"',
      [productId]
    );
    
    if (ownerRows.length === 0) {
      return res.status(404).json(formatResponse(false, null, '', 'Product not found'));
    }
    
    if (ownerRows[0].seller_id !== userId) {
      return res.status(403).json(formatResponse(false, null, '', 'Forbidden: Not product owner'));
    }

    // Soft delete: set status to 'deleted'
    const [result] = await db.execute(
      'UPDATE products SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(formatResponse(false, null, '', 'Product not found'));
    }

    return res.status(200).json(formatResponse(true, null, 'Product deleted successfully'));

  } catch (error) {
    console.error('DeleteProduct Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

// 6. Get all products listed by a specific user
exports.getUserProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const sellerId = parseInt(userId);
    
    if (isNaN(sellerId) || sellerId <= 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid user ID'));
    }

    let { page = 1, limit = 10 } = req.query;
    page = safeParseInt(page, 1, 1, 100);
    limit = safeParseInt(limit, 10, 1, 50);
    const offset = (page - 1) * limit;

    // Count total
    const [countRows] = await db.execute(
      'SELECT COUNT(*) as total FROM products WHERE seller_id = ? AND status = "available"',
      [sellerId]
    );
    
    const total = countRows[0]?.total || 0;

    // Main query
    const [rows] = await db.execute(
      `SELECT
        p.id, p.title, p.price, p.\`condition\`,
        c.name AS category_name,
        (SELECT image_url FROM productimages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = ? AND p.status = "available"
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [sellerId, limit, offset]
    );

    return res.status(200).json(rows);

  } catch (error) {
    console.error('GetUserProducts Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

// 7. Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const catId = parseInt(categoryId);
    
    if (isNaN(catId) || catId <= 0) {
      return res.status(400).json(formatResponse(false, null, '', 'Invalid category ID'));
    }

    let { page = 1, limit = 10 } = req.query;
    page = safeParseInt(page, 1, 1, 100);
    limit = safeParseInt(limit, 10, 1, 50);
    const offset = (page - 1) * limit;

    // Check if category exists
    const [categoryCheck] = await db.execute(
      'SELECT name FROM categories WHERE id = ?',
      [catId]
    );
    
    if (categoryCheck.length === 0) {
      return res.status(404).json(formatResponse(false, null, '', 'Category not found'));
    }

    // Count total
    const [countRows] = await db.execute(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND status = "available"',
      [catId]
    );
    
    const total = countRows[0]?.total || 0;

    // Main query
    const [rows] = await db.execute(
      `SELECT
        p.id, p.title, p.price, p.\`condition\`,
        c.name AS category_name,
        u.username AS seller_name,
        (SELECT image_url FROM productimages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.category_id = ? AND p.status = "available"
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [catId, limit, offset]
    );

    return res.status(200).json(formatResponse(true, {
      products: rows,
      pagination: getPaginationMeta(total, page, limit),
      category: categoryCheck[0].name
    }, 'Products by category retrieved successfully'));

  } catch (error) {
    console.error('GetProductsByCategory Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};
// 8. Search products by title and description
exports.searchProducts = async (req, res) => {
  try {
    let { q, page = 1, limit = 10 } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json(formatResponse(false, null, '', 'Search query must be at least 2 characters long'));
    }

    const searchTerm = q.trim();
    page = safeParseInt(page, 1, 1, 100);
    limit = safeParseInt(limit, 10, 1, 50);
    const offset = (page - 1) * limit;

    // Count total
    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total
       FROM products p
       WHERE (p.title LIKE ? OR p.description LIKE ?) AND p.status = "available"`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    
    const total = countRows[0]?.total || 0;

    // Main query
    const [rows] = await db.execute(
      `SELECT
        p.id, p.title, p.price, p.\`condition\`,
        c.name AS category_name,
        u.username AS seller_name,
        (SELECT image_url FROM productimages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE (p.title LIKE ? OR p.description LIKE ?) AND p.status = "available"
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
    );

    return res.status(200).json(formatResponse(true, {
      products: rows,
      pagination: getPaginationMeta(total, page, limit),
      searchTerm: searchTerm
    }, 'Search results retrieved successfully'));

  } catch (error) {
    console.error('SearchProducts Error:', error);
    return res.status(500).json(formatResponse(false, null, '', 'Internal server error'));
  }
};

