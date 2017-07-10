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
var mongo = require('mongodb');
mongoose.connect('mongodb://localhost/savedLocations');
var db = mongoose.connect;

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
    var favPlaceName = req.body.favPlaceName;
    var favPlacePosition = req.body.favPlacePosition;
    var favPlaceId = req.body.favPlaceId;
    console.log(favPlaceName);
    req
        .checkBody('favPlaceName', 'no name found')
        .notEmpty();
    req
        .checkBody('favPlacePosition', 'no position found')
        .notEmpty();
    req
        .checkBody('favPlaceId', 'no id found')
        .notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('maps', {errors: errors});
    } else {
        var favLocation = new Location({title: favPlaceName, position: favPlacePosition, markerID: favPlaceId, userID: User._id});
        console.log(favLocation);
        Location.createLocation(favLocation, function (err, favLocation) {
            if (err) 
                throw err;
           
        });
        res.send(' fav place is working' + favPlaceName);
        // function used to push the data to the users data base

    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {

        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
};
/*var options = {
    host: 'maps.googleapis.com',
    port: 80,
    path: 'maps/api/js?key=AIzaSyBYaUhJlde8EY44z5vETFJM0MUokh0bDNA&callback=initMap',
    method: 'GET'
};
http.request(options,function(res){
    var body = '';

    res.on('data', function (chunk) {
        body+=chunk;
    });
    res.on('end', function(){
        var price = JSON.parse(body);
        console.log(price);
    })
}).end();
request.get('https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js');
request.get('https://code.jquery.com/jquery-1.12.0.min.js');
request.get('https://maps.googleapis.com/maps/api/js?key=AIzaSyBYaUhJlde8EY44z5vETFJM0MUokh0bDNA&callback=initMap')
function initMap(req, res, next) {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.757172, lng: -87.117398},
        zoom: 14
    });
    //MAking Moonlte marker
    var moonlite = {lat:37.757365, lng:-87.148764};
    var marker = new google.maps.Marker({
        position: moonlite,
        map: map,
        title: 'Moonlite BBQ'
    });
    //making info window for marker
    var infowindow = new google.maps.InfoWindow({
        content: 'Do you want more info.. or more cowbell?' + 'More cowbell it is then.'
    });

    marker.addListener('click', function () {
        inforwindow.open(map,marker);

    });*/

module.exports = router;
