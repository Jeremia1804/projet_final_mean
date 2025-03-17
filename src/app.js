var express = require("express")
var app = express()
const cors = require('cors');
require('dotenv').config();

app.use(cors());

app.get("/", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Start server")
})

app.get("/upload", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Uploaded successfuly")
})

app.listen(process.env.PORT || 8080, ()=> {
    // console.log("http://localhost:3000")
})

module.exports = app;