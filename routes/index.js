/**
 * Created by toned_000 on 5/29/2017.
 */
var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;
