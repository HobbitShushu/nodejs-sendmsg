const mysql_connection = require('../../database').mysql

// Mysql 결과::[ [RowDataPakcet {data}], okPacket { result database query }]
module.exports.get_all_user = (req, res, next) => {
    mysql_connection.query("call get_all_account()", function (error, rows){
        data = []
        if(error)
            console.log("login query error::" + error);
        else {
            rows[0].forEach((row) => {
                console.log(row.user_uid + " " +
                    row.user_name + " " +
                    row.regist_time + " " +
                    row.block_time);
                data.push(row)    
            })
            return res.status(200).json({data:data})
        }
    })
};

module.exports.request_user_info = (user_index) => {
    sql_query = "call get_account("
        + user_index + ")"
    return new Promise(function(resolve, reject) {
        mysql_connection.query(sql_query, function (error, rows){
            if(error) {
                console.log("login query error::" + error);
                reject('Error')
            }
            else if(rows[0].length == 0){
                console.log('No Data')
                reject('No Data')
            }
            else {
                resolve(rows[0][0])
            }  
        })
    })
}

module.exports.try_login = (req, res, next) => {
    // if login success sess.value? [value] = value 저장
    sql_query = "call valid_login("
        + "'" + req.body.username + "'" + ","
        + "'" + req.body.password + "'" + 
        ")"
    mysql_connection.query(sql_query, function (error, rows) {
        if(error){
            console.log("login query error::" + error);
            return res.status(500).json({
                error: error,
                message: "Server Error"
            })
        }
        else if(rows[0].length == 0){
            return res.status(401).json({
                message: "Auth Fail"
            })
        }
        else {
            // rows[0] = packet Data - list
            rows[0].forEach((row) => {
                console.log(row.user_uid + " " +
                    row.user_name + " " +
                    row.age + " " +
                    row.gender + " " +
                    row.nation + " " +
                    row.regist_time + " " +
                    row.block_time);
            })
            req.session.uid = rows[0][0].user_uid
            req.session.user_name = rows[0][0].user_name
            req.session.save(() => {
                console.log("Session Saved")
                console.log(req.session.uid + " : " + req.session.user_name)
            })
            next();
            //return res.status(200).json({
            //    result: rows[0][0]
            //})
        }
    })
};

module.exports.try_regist = (req, res, next) => {
    sql_query = "call regist_account("
        + "'" + req.body.username + "'" + ","
        + req.body.password + ","
        + req.body.age + ","
        + req.body.gender + ","
        + req.body.nation +                          
        ")"
    mysql_connection.query(sql_query, function (error, rows) {
        if(error){
            console.log("query error::" + error);
            return res.status(401).json({
                error: error,
                message: "server Error"
            });
        }
        else {
            console.log(rows[0]);
            return res.status(200).json({
                message: "Success Regist New Account"
            });
        }
    });
}