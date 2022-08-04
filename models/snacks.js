const db = require('../db');

exports.fetchSnacks = async (sortBy = 'snack_name', min_rating) => {
  const validSortBys = ['rating', 'snack_name'];

  if (!validSortBys.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  let queryStr = `SELECT * FROM snacks `;
  let injectArr = [];
  if (min_rating) {
    queryStr += `WHERE rating >= $1 `;
    injectArr.push(min_rating);
  }

  queryStr += `ORDER BY ${sortBy} asc;`;

  const { rows: snacks } = await db.query(queryStr, injectArr);

  return snacks;
};

exports.fetchSnacksByCategoryId = async (id) => {
  const { rows: snacks } = await db.query(
    'SELECT * FROM snacks WHERE category_id = $1;',
    [id]
  );

  return snacks;
};
