const app = require('./app')
const mysqlDB = require('./database').mysql

mysqlDB.connect(function(err) {
    if (err)
        throw err;
    console.log('mysql connected');
});

app.listen(3000)    