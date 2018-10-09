const functions = require('firebase-functions')
const express = require('express');
const router = require('./events.router');

const app = express();
process.env = functions.config().config

// Middleware
app.use('/api/v2', router);

module.exports = app;