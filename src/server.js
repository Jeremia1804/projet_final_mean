const config = require('./config/config');
const app = require('./config/express')

require('./config/mongoose');

app.listen(config.port, ()=> {
    console.log(`server run on: http://localhost:${config.port}`)
})

module.exports = app;