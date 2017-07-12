/**
 * Created by toned_000 on 5/29/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/user');
var Location = require('../models/savedLocation');

passport.deserializeUser(function (id, done) {
    User
        .getUserById(id, function (err, user) {
            done(err, user);
        });
});

// Get Homepage
router.get('/', ensureAuthenticated,function (req, res) {
   
    console.log(req.user);
    console.log(req.isAuthenticated);
 res.render('index');
 
});

router.get('/index', function (req, res) {
   
var userId = req.user.id;
    console.log(userId);
    var favList = Location.getListByUser(userId, function (err, favList) {
        if (err) 
            throw err;
        if (!userId) {
            return done(null, false, {message: 'Unknown User'});
        }
        console.log('The list has ' + favList.length + ' items in it')
        
        //RUN A FOR LOOP PARSING DATA FROM EACH FAV LOCATION THEN SEND IT OVER
        var favLocation = [];

        for(i = 0; i< favList.length; i++){
            var fav = favList[i] 
            
            var locationData = {
                title: fav.title,
                lat: fav.lat,
                lng: fav.lng,
                markerID:fav.markerId,
                userID:fav.userid,
            }
            favLocation.push(locationData);
            console.log(locationData.title);
            
        }
        res.send({favLocation: favLocation});
    })
});

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            //req.flash('error_msg','You are not logged in');
            res.redirect('/users/login');
        }
    };

    module.exports = router;
