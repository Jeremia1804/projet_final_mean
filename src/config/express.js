const express = require("express");
const router = require("../routes/route");
const middleWares = require('../middlewares/parsing_data')

const app = express();

// Add routes for server
app.use(router);

// Add Middleware
app.use(middleWares)

module.exports = app;
