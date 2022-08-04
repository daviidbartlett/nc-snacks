const { fetchSnacks, fetchSnacksByCategoryId } = require('../models/snacks.js');

const { fetchCategoryById } = require('../models/categories');

exports.getSnacks = async (req, res, next) => {
  const { sort_by, min_rating } = req.query;
  fetchSnacks(sort_by, min_rating)
    .then((snacks) => {
      res.status(200).send({ snacks });
    })
    .catch(next);
};

exports.getSnacksByCategoryId = (req, res, next) => {
  const { category_id } = req.params;

  Promise.all([
    fetchSnacksByCategoryId(category_id),
    fetchCategoryById(category_id),
  ])
    .then(([snacks]) => {
      res.status(200).send({ snacks });
    })
    .catch(next);
};
