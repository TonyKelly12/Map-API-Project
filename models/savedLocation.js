var mongoose = require('mongoose');


// User Schema
var LocationSchema = mongoose.Schema({
    title: {
        type: String,
        index:true,
        
    },
    lat: {
        type: String,
    },

    lng: {
        type: String,
    },
    markerID: {
        type: String,
    },
    userID:{
        type: mongoose.Schema.ObjectId,
    }
    
});

var Location = module.exports = mongoose.model('Location', LocationSchema);



module.exports.getLocationByTitle = function (title, callback) {
    var query = {
        title: title
    };
    Location.findOne(query, callback);
};

module.exports.getLocationById = function (markerID, callback) {
    Location.findById(markerId, callback);
};

module.exports.getListByUser = function(userId, callback){
    var query ={
        userID: userId,
    };
    Location.find(query,callback);
};

