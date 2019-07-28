socket_list = []

module.exports.setSocket = (uid, name) => {
    socket = {}
    socket.uid = uid
    socket.name = name
    socket_list.push(socket)
}

module.exports.getSocketByName = (name) => {
    socket_list.forEach((row) => {
        console.log(row)
        if(row.name = name){
            return row
        }
    })
}