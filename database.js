const mysql = require('mysql')
const redis = require('redis')
const dbconfig = require('./config/dbconfig')

// mysql
const connection = mysql.createConnection(dbconfig.mysqlConfig)
const redisConf = dbconfig.redisConfig

const redis_client = { master:'', slave:[] }
redis_client.master = redis.createClient(redisConf.master.port, redisConf.master.host)
redis_client.master.auth(redisConf.master.password)

redis_client.slave.push(redis.createClient(redisConf.slave[0].port, redisConf.slave[0].host))
redis_client.slave[0].auth(redisConf.slave[0].password)

redis_client.slave.push(redis.createClient(redisConf.slave[1].port, redisConf.slave[1].host))
redis_client.slave[1].auth(redisConf.slave[1].password)

module.exports = {
    mysql: connection,
    redis: redis_client
}