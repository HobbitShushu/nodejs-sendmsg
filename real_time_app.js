const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyparser = require('body-parser')

app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.use(express.static('uploads'))
app.use(bodyparser.urlencoded({ extended : false }));
app.use(bodyparser.json());

app.get('/chat', function(req, res, next) {
    console.log('Default url view')
    res.render('index');
})

io.on('connection', (socket) => {
    console.log('socket connection ', + socket.id)
    var name = 'user' + socket.id
    io.to(socket.id).emit('change name', name)

    socket.join('test_room')

    socket.on('disconnect', function(v) {
        console.log('socket disconnect')
        socket.leave('test_room')
    });

    socket.on('send_message', function(name, msg) {
        console.log(name + ' ' + msg)
        socket.emit('receive_message', msg);
        socket.broadcast.emit('test_room', msg)
    })
})

module.exports = server