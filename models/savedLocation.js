var mongoose = require('mongoose');

var User = require('../models/user');
// User Schema
var LocationSchema = mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    position: {
        type: String
    },
    markerID: {
        type: String
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

var Location = module.exports = mongoose.model('savedLocation', LocationSchema);

module.exports.createLocation = function (favLocation, callback) {
    console.log('createLocation function is working')
    mongoose.connect('mongodb://localhost/savedLocations');
    var db = mongoose.connect;
   favLocation.save(callback);
};

module.exports.getLocationByTitle = function (title, callback) {
    var query = {
        title: title
    };
    Location.findOne(query, callback);
};

module.exports.getLocationById = function (markerID, callback) {
    Location.findById(markerId, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt
        .compare(candidatePassword, hash, function (err, isMatch) {
            if (err) 
                throw err;
            callback(null, isMatch);
        });
};