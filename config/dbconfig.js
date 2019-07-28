module.exports.mysqlConfig = {
    host         : "localhost",
    port         : 3306,
    user         : "hobbit_msg",
    password     : "hobbit1234",
    database     : "message_send",
    insecureAuth : true
};

module.exports.redisConfig = {
    master:{
        host     : "localhost",
        port     : 7000,
        password : "redispassword"
    },
    slave: [
        {
            host     : "localhost",
            port     : 7001,
            password : "redispassword"    
        },
        {
            host     : "localhost",
            port     : 7002,
            password : "redispassword"
    
        }
    ]
}