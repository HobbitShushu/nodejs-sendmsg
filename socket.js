const cache = require('./api/middleware/cache')

socket_list = []

/* Before make Socket, Server set Socket Info Using req*/
module.exports.makeSocket = (uid, name, chatId) => {
    socket = {}
    socket.uid = uid
    socket.name = name
    socket.chatId = chatId 
    socket_list.push(socket)

    console.log(socket_list);
}

module.exports.setSocket = (socket, name) => {
    const itemIdx = socket_list.find(function(item) { return item.name == name })
    const idx = socket_list.indexOf(itemIdx)
    if(idx > -1) {
        socket_list[idx].id = socket.id;
        socket.join(socket_list[idx].chatId)
    }
}

module.exports.send_message = (socket, name, msg) => {
    console.log(name + ' ' + msg)
    socket.emit('receive_message', name, msg);
    const itemIdx = socket_list.find(function(item) { return item.id == socket.id })
    const idx = socket_list.indexOf(itemIdx)
    if(idx > -1) 
        socket.broadcast.emit('receive_message', name, msg)
}

module.exports.joinChat = (socket) => {
    const itemIdx = socket_list.find(function(item) { return item.id == socket.id })
    const idx = socket_list.indexOf(itemIdx)
    if(idx > -1) {
        socket.join(socket_list[idx].chatId)
    }
}

module.exports.leaveSocket = (io, socket, reason) => {
    console.log('DisConnected::'+ socket.id + '::' + reason)
    const itemIdx = socket_list.find(function(item) { return item.id == socket.id })
    const idx = socket_list.indexOf(itemIdx)

    const chatId = socket_list[idx].chatId
    const name = socket_list[idx].name
    
    if(idx > -1) {
        socket.leave(chatId)
        socket_list.splice(idx, 1);
    }
    
    const notifyidx = socket_list.find(function(item) { return item.chatId == chatId })
    const parti_idx = socket_list.indexOf(notifyidx)    
    if(parti_idx > -1) {
        io.to(socket_list[parti_idx].id).emit('receive_message', 'ADMIN', name + ' is leaved')
    }
}
