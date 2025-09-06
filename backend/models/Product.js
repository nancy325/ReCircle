const db = require('../db');

/**
 * Get all products
 */
exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
};

/**
 * Get product by ID
 */
exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

/**
 * Create a new product
 */
exports.create = async (product) => {
  const sql = `
    INSERT INTO products (
      title, description, price, quantity, condition, year_of_manufacture,
      brand, model, length_cm, width_cm, height_cm, weight_kg, material, color,
      has_original_packaging, has_manual, working_condition_description,
      category_id, seller_id, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const params = [
    product.title,
    product.description,
    product.price,
    product.quantity || 1,
    product.condition || 'good',
    product.year_of_manufacture || null,
    product.brand || null,
    product.model || null,
    product.length_cm || null,
    product.width_cm || null,
    product.height_cm || null,
    product.weight_kg || null,
    product.material || null,
    product.color || null,
    product.has_original_packaging ? 1 : 0,
    product.has_manual ? 1 : 0,
    product.working_condition_description || null,
    product.category_id,
    product.seller_id,
    product.status || 'available'
  ];
  const [result] = await db.query(sql, params);
  return result.insertId;
};

/**
 * Update product by ID
 */
exports.update = async (id, product) => {
  const fields = [];
  const params = [];
  for (const key in product) {
    fields.push(`${key} = ?`);
    params.push(product[key]);
  }
  params.push(id);
  const sql = `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
  const [result] = await db.query(sql, params);
  return result.affectedRows;
};

/**
 * Soft delete product by ID
 */
exports.softDelete = async (id) => {
  const sql = 'UPDATE products SET status = "pending", updated_at = NOW() WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows;
};
