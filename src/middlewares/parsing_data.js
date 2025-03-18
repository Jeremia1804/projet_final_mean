const express = require('express')
const httpError = require("http-errors");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(cookieParser());
router.use(compress());
router.use(methodOverride());

// secure apps by setting various HTTP headers
router.use(helmet());

// enable CORS - Cross Origin Resource Sharing
router.use(cors());

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

const middleWares = router

module.exports = middleWares
