const express = require('express')
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");
const router = express.Router();
var bodyParser = require('body-parser')
 
// create application/json parser
var jsonParser = bodyParser.json()

router.use(jsonParser);
router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieParser());
router.use(compress());
router.use(methodOverride());

// secure apps by setting various HTTP headers
router.use(helmet());

// enable CORS - Cross Origin Resource Sharing
router.use(cors());

const middleWares = router

module.exports = middleWares
