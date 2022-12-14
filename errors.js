exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: 'Server error' });
};
