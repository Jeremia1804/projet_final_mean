const express = require('express')
const verifyToken = require('../middlewares/authMiddleware');

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

// Protected route
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;

module.exports = router;