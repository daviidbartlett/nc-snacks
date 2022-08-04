const db = require('../db');

exports.fetchCategoryById = async (id) => {
  const {
    rows: [category],
  } = await db.query('SELECT * FROM categories WHERE category_id = $1', [id]);

  // we get [] therefore it doesn't exist
  if (!category) {
    return Promise.reject({ status: 404, msg: 'category_id not found' });
  }

  // we get the [category] therfore it exists
  return category;
};
