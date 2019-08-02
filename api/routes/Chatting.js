const express = require('express');
const router = express.Router();

const socket = require('../../socket')
const ChatController = require('../controllers/Chatting')
const checkSession = require('../middleware/check_session').checkSession

router.get('/', checkSession, ChatController.get_chat_list, function(req, res, next) {
    res.render('chat_list', res.data)
});

router.post('/', checkSession, ChatController.send_random_msg);

router.post('/msg', checkSession, ChatController.send_random_msg);

router.delete('/:chatId', checkSession, ChatController.delete_msg);

router.get('/:chatId', checkSession, ChatController.get_chat_detail, function(req, res, next) {
    res.render('chat_room', res.data)
});

/* For Testing Socket.Io*/
router.get('/real_time/:chatId', checkSession, ChatController.get_chat_detail, function(req, res, next) {
    data = {}
    data.uid = req.session.uid
    data.name = req.session.user_name
    data.msg = res.data
    socket.makeSocket(req.session.uid, req.session.user_name, req.params.chatId)
    res.render('real_time_chat', data)
});

router.post('/msg/:chatId', checkSession, ChatController.reply_msg);


// patch
//router.patch('/', AccountController.account_update_information);

module.exports = router;