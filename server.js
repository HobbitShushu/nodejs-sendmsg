const app = require('./app')
const real_time_server = require('./real_time_app')
const mysqlDB = require('./database').mysql

mysqlDB.connect(function(err) {
    if (err)
        throw err;
    console.log('mysql connected');
});

app.listen(3000)
real_time_server.listen(3010)