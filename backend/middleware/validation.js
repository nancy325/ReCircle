const validateRegistration = (req, res, next) => {
  const { email, password, username } = req.body;
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Username validation
  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { title, description, price, category_id } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push('Valid price is required');
  }

  if (!category_id || isNaN(category_id)) {
    errors.push('Valid category is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateRegistration, validateProduct };