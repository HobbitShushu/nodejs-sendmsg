const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/Account')

// login page
//router.get('/', AccountController.get_all_user);
router.get('/', function(req, res, next){
    console.log('Login Page')
    res.render('account')
});

// try login
router.post('/', AccountController.try_login, function(req, res, next){
    res.redirect('/chat')
});

// try regist account
router.post('/regist', AccountController.try_regist);

// try logout
//router.get('/logout', AccountController.account_logout);

// try account delete
//router.delete('/', AccountController.account_delete);

// patch
//router.patch('/', AccountController.account_update_information);

module.exports = router;