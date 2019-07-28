const mysql_connection = require('../../database').mysql
const helper = require('../utils/Helper')
const cache = require('../middleware/cache')
const account = require('./Account').request_user_info

module.exports.get_chat_list = (req, res, next) => {
    data = []
    cache.hgetall('list', req.session.uid)
    .then(result => {
        for(key in result) {
            obj = {}
            obj.user_id = key
            obj.last_chat = JSON.parse(result[key])
            data.push(obj)
        }
        res.data = data;
        next()
        //return res.status(200).json({
        //    data: data
        //});
    })
    .catch(error => {
        return res.status(401).json({
            error: error,
            message: 'Fail to Get Chat List'
        })
    })
}
/*
  url&&params:chat/:chatId

*/
module.exports.get_chat_detail = (req, res, next) => {
    cache.lrange('detail', req.params.chatId, 0, -1)
    .then(result => {
        data = []
        result.forEach((row) => {
            row = JSON.parse(row)
            row.send_time = Date(row.send_time)
            data.push(row)
        })
        res.data = data
        next()
        //res.status(200).json({
        //    data: result
        //})
    })
    .catch(error => {
        return res.status(401).json({
            error: error,
            message: "Fail to Get Chatting Room"
        });
    })
}
/*
  url&&params:  
  need session
  check block time and report count
  req
    gender: 0, 1, 2
    nation: 0, 1 ...
    msg: string
*/
module.exports.send_random_msg = (req, res, next) => {
    account(req.session.uid)
    .then(result => {
        block_time = result.block_time
        if(block_time.getTime() > Date.now()){
            return res.status(301).json({
                result:"Blocked",
                last_block_time: (block_time.getTime() - Date.now())
            });
        }
        sql_query = "call send_message("
        + req.session.uid + ","
        + req.body.gender + ","
        + req.body.nation +
        ")"
        mysql_connection.query(sql_query, function (error, rows) {
            if(error) {
                return res.status(401).json({
                    error: error,
                    message: "Message Send Fail"
                });
            }
            if(rows[0][0] == undefined){
                return res.status(200).json({
                    error: 400,
                    message: "Not Found"
                });
            }
            message = {}
            const chatIndex = helper.genUuid()
            const data = JSON.stringify({
                chat_id: chatIndex,
                sender: req.session.uid,
                message: req.body.msg,
                send_time: Date.now()
            })
            promise_list = []
            promise_list.push(cache.hset('list', req.session.uid, rows[0][0].user_uid, data))
            promise_list.push(cache.hset('list', rows[0][0].user_uid, req.session.uid, data))
            promise_list.push(cache.rpush('detail', chatIndex, JSON.stringify({
                sender: req.session.uid,
                message: req.body.msg,
                send_time: Date.now()
            })))
            Promise.all(promise_list)
            .then(()=>{
                return res.status(200).json({
                    message: "Success Send Message",
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(500).json({error: error, message:"Fail to Send Message"})
            })
        });
    })
    .catch(error => {
        return res.status(500).json({
            error: error,
            message: 'Send Msg Fail'
        })
    })
}

/*
  url&&params:chat/msg/:chatId
  method: post
  req
    to
    msg
*/
module.exports.reply_msg = (req, res, next) => {
    const msg = JSON.stringify({
        chat_id: req.params.chatId,
        sender: req.session.uid,
        message: req.body.msg,
        send_time: Date.now()
    })
    cache.lrange('detail', req.params.chatId, -1, -1)
    .then(result => {
        /*[{sender, message, send_time}]*/
        result = JSON.parse(result)
        if(result.sender == 0){
            return res.status(301).json({
                message:'Its not exist Room'
            });
        }
        else {
            promise_list = []        
            promise_list.push(cache.hset('list', req.session.uid, req.body.to, msg))
            promise_list.push(cache.hset('list', req.body.to, req.session.uid, msg))
            promise_list.push(cache.rpush('detail', req.params.chatId, JSON.stringify({
                sender: req.session.uid,
                message: req.body.msg,
                send_time: Date.now()
            })))
            Promise.all(promise_list)
            .then(result => {
                return res.status(200).json({
                    last_msg: JSON.parse(msg)
                })
            })
            .catch(error => {
                return res.status(500).json({error:error})
            })
        }
    })
    .catch(error => {
        console.log(error)
        return res.status(500).json({error:error, message:'Fail to reply'})
    })
}
/*
  url&&params: msg/:chatId
  need session ( logined state )
  req
    user_id
    type: delete type - 0 or 2(report)
*/    
module.exports.delete_msg = (req, res, next) => {
    type_delete = req.body.type
    if(type_delete == 2) {
        cache.incr(req.body.user_id)
        .then(result => {
            console.log('Reported ' + str(req.body.user_id))
        })
        .catch(error => {
            console.log('Report Error')
        })
    }
    cache.hdel('list', req.session.uid, req.body.user_uid)
    .then(result => {
        cache.rpush('detail', req.params.chatId, JSON.stringify({
            sender: 0,
            message: "---Leaved---"
        }))
        .then(result => {
            console.log(result)
            return res.status(200).json({
                message: 'Success Delete Msg'
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(401).json({
                error: error,
                message: "Fail to Delete Message"
            })
        })
    })
    .catch(error => {
        return res.status(401).json({
            error: error,
            message: "Fail to Delete"
        })
    })
}