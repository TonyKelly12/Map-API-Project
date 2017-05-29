/**
 * Created by toned_000 on 5/29/2017.
 */
var express = require('express');
var router = express.Router();

//Register
router.get('/register', function (req, res) {
    res.render('register');
});

//Login
router.get('/login', function (req, res) {
    res.render('login');
});

module.exports = router;

