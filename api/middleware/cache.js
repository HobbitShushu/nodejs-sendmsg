const redis_client = require('../../database').redis
const promise = require('promise')
r_table = {'list':0, 'detail':1, 'user_info':2}

get_redis = (type, name) => {
    if(type == 'MASTER') {
        redis_client.master.select(r_table[name]);
        return redis_client.master;
    }
    else if(type == 'SLAVE'){
        redis_client.slave[0].select(r_table[name]);
        return redis_client.slave[0];
    }
}

module.exports.get_redis = (type, name) => {
    if(type == 'MASTER') {
        redis_client.master.select(r_table[name]);
        return redis_client.master;
    }
    else if(type == 'SLAVE'){
        redis_client.slave[0].select(r_table[name]);
        return redis_client.slave[0];
    }
}
module.exports.change_table = (conn, name) => {
    conn.select(r_table[name])
}

/* Incr/Decr */
module.exports.incr = (name, key) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('MASTER', name)
        conn.incr(key, function(error, result) {
            if(error)
                reject()
            else
                resolve(result)
        })
    })
}

/* hash Function*/
module.exports.hset = (name, key, field, data) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('MASTER', name)
        conn.hset(key, field, data, function(error, result) {
            if(error)
                reject()
            else
                resolve(result)
        })
    })
}

module.exports.hget = (name, key, field) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('SLAVE', name)
        conn.hget(key, field, function(error, result) {
            if(error) 
                reject();
            else 
                resolve(result);
        })
    })
}

module.exports.hdel = (name, key, field) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('MASTER', 'list')
        conn.hdel(key, field, function(error, result) {
            if(error)
                reject(error)
            else
                resolve(result)
        })
    })
}

module.exports.hgetall = (name, key) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('SLAVE', name)
        conn.hgetall(key, function(error, result) {
            if(error)
                reject();
            else
                resolve(result);
        })
    })
}

/* List Function */
module.exports.rpush = (name, key, value) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('MASTER', name)
        conn.rpush(key, value, function(error, result) {
            if(error)
                reject()
            else
                resolve(result)
        })
    })
}
module.exports.lrange = (name, key, start, end) => {
    return new Promise(function(resolve, reject) {
        const conn = get_redis('SLAVE', name)
        conn.lrange(key, start, end, function(error, result) {
            if(error) 
                reject();
            else 
                resolve(result);
        })
    })
}
