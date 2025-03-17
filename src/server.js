var express = require("express")
var app = express()
const cors = require('cors');
require('./config/mongoose');
const config = require('./config/config');

function start(){
    app.use(cors());

    app.get("/", function (req, res){
        res.setHeader("Content-type", "text/plain")
        res.send("Start server")
    })

    app.get("/upload", function (req, res){
        res.setHeader("Content-type", "text/plain")
        res.send("Uploaded successfuly")
    })

    app.listen(config.port, ()=> {
        console.log(`server run on: http://localhost:${config.port}`)
    })
}

module.exports.start = start;