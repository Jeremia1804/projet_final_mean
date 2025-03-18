const config = require('./config/config');
const app = require('./config/express')

function connectMongoDb(){
    require('./config/mongoose');
}

function start(){
    connectMongoDb()
    app.listen(config.port, ()=> {
        console.log(`server run on: http://localhost:${config.port}`)
    })
    
}

module.exports.start = start;