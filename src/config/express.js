const express = require("express");
const router = require("../routes/route");
const middleWares = require('../middlewares/parsing_data')
const middleWaresError = require('../middlewares/error_handler')
const authRoutes = require('../routes/auth')

const app = express();

// Add Middleware
app.use(middleWares)

// Add routes for server
app.use(router);
app.use('/auth', authRoutes)

// Add MiddleWare error
app.use(middleWaresError)


module.exports = app;
