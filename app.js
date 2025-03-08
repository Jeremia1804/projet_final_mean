var express = require("express")
var app = express()

app.get("/", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Start server")
})

app.get("/upload", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Uploaded successfuly")
})

app.listen(3000, ()=> {
    console.log("http://localhost:3000")
})