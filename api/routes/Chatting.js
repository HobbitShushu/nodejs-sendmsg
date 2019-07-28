const express = require('express');
const router = express.Router();

const socket = require('../../socket')
const ChatController = require('../controllers/Chatting')

router.get('/', ChatController.get_chat_list, function(req, res, next) {
    res.render('chat_list', res.data)
});

router.post('/', ChatController.send_random_msg);

router.post('/msg', ChatController.send_random_msg);

router.delete('/:chatId', ChatController.delete_msg);

router.get('/:chatId', ChatController.get_chat_detail, function(req, res, next) {
    res.render('chat_room', res.data)
});
/* For Testing Socket.Io*/
router.get('/real_time/:chatId', ChatController.get_chat_detail, function(req, res, next) {
    data = {}
    data.uid = req.session.uid
    data.name = req.session.user_name
    data.msg = res.data
    socket.setSocket(req.session.uid, req.session.user_name)
    res.render('real_time_chat', res.data)
});

router.post('/msg/:chatId', ChatController.reply_msg);


// patch
//router.patch('/', AccountController.account_update_information);

module.exports = router;