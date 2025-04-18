const express = require("express");
const middleWares = require('../middlewares/parsing_data')
const middleWaresError = require('../middlewares/error_handler')
const authRoutes = require('../routes/auth')
const serviceRoutes = require('../routes/service_route')
const vehicleRoutes = require('../routes/vehicle_route')
const rdvRoutes = require('../routes/rdv_route')
const route = require('../routes/route')

const app = express();

// Add Middleware
app.use(middleWares)

// Add routes for server
app.use('/auth', authRoutes)
app.use('/api', serviceRoutes)
app.use('/api', vehicleRoutes)
app.use('/api', rdvRoutes)
app.use(route)

// Add MiddleWare error
app.use(middleWaresError)


module.exports = app;
