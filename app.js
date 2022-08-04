const app = require('express')();
const { getSnacks, getSnacksByCategoryId } = require('./controllers/snacks');
const { handleServerError, handleCustomErrors } = require('./errors');

app.get('/api/snacks', getSnacks);
app.get('/api/categories/:category_id/snacks', getSnacksByCategoryId);

/////////////////////////////////////////
app.use(handleCustomErrors);
app.use(handleServerError);

module.exports = app;
