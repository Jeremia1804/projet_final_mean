const express = require('express')

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));

router.get("/", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Start server successfuly")
})

router.get("/upload", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Uploaded successfuly")
})

module.exports = router;