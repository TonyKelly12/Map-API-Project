/**
 * Created by toned_000 on 5/31/2017.
 */
var express = require('express');
var router = express.Router();
var request = require ('request');
var http = require('http');


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
