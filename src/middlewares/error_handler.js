const express = require('express')
const httpError = require("http-errors");
const router = express.Router();

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

// error handler, send stacktrace only during development
router.use((err, req, res, next) => {
  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join('; ');
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message,
  });
  next(err);
});

const middleWaresError = router

module.exports = middleWaresError
