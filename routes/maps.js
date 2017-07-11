/**
 * Created by toned_000 on 5/31/2017.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/user');
var Location = require('../models/savedLocation');



router.use(bodyParser.json());

// Get Homepage
router.get('/home', ensureAuthenticated, function (req, res) {
    res.render('maps');
});

router.get('/', function (req, res) {
    res
        .status(200)
        .send('hello it works!');
});

router.post('/', function (req, res, next) {
    // uses body-parser to get the data from the ajax call data field
    console.log('Post function is running');
    
    var favTitle = req.body.favPlaceName;
    var markerId = req.body.favPlaceId;
    var position = req.body.favPlacePosition;
    var lat = req.body.lat;
    var lng = req.body.lng;

    var favLocation = new Location({
        title: favTitle,
        lat: lat,
        lng: lng,
        markerID:markerId
    });

    console.log(favLocation);
    

    var errors = req.validationErrors();

    if (errors) {
        res.render('maps', {errors: errors});
    } else {
        
        favLocation.save(function(err){
            if(err) throw err;
            console.log(err);
        });
    }
    res.redirect('/maps/home');
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
