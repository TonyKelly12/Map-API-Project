/**
 * Created by toned_000 on 5/31/2017.
 */
var express = require('express');
var router = express.Router();




// Get Homepage
router.get('/home', ensureAuthenticated, function(req, res){
    res.render('maps');
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){


        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;