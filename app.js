const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const socketManager = require('./socket')

const path = require('path')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const session = require('express-session')

const accountRouter = require('./api/routes/Account')
const chatRouter = require('./api/routes/Chatting')

// ejs views
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

// static file service
app.use(express.static('public'))

app.use(morgan('dev'));
app.use(express.static('uploads'))
app.use(bodyparser.urlencoded({ extended : false }));
app.use(bodyparser.json());

// session Setting
app.use(session({
    secret: 'sessIon@se12creat12weLcome0',
    resave: false,
    saveUninitialized: true
}));

// CORS - Cross-Origin-Resource-Sharding
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Origin-Headers',
        'Origin, X-Requested-With, Context-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        req.status(200).json({})
    }
    next();
});

io.on('connection', (socket) => {
    console.log('socket connection')
    //console.log(socket.id)
    //io.to(socket.id).emit('change name', name)
    socket.on('login', function(name) {
        console.log('login');
        socketManager.setSocket(socket, name);  
    })

    socket.on('disconnect', function(v) {
        socketManager.leaveSocket(socket, v);
    });

    socket.on('send_message', function(name, msg) {
        socketManager.send_message(socket, name, msg);
    });
})

app.use('/account', accountRouter);
app.use('/chat', chatRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    });
});

module.exports = server;