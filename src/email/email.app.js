const express = require('express');
const router = require('./email.router');

const app = express();
app.use('/api/v2', router);

module.exports = app;
