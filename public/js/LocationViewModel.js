var savedLocations = ko.observableArray();
  var showPic = ko.observable(false);
 var initPic = function(location){
     console.log("initPic working " + location.title);
     if(location.showPic == false){
         console.log(location.showPic)
        self.showPic(true);
        location.showPic = true;
        console.log(location.showPic);
     }
 };
var eachLocationCLicked = function (location){
    console.log(location.title + " was clicked " + location.photo)
   initPic(location);
};

var removeLocation = function (location){
    console.log(location.title + " remove was clicked " + location.photo);
    savedLocations.remove(location);
// WRITE AJAX CALL TO UPDATE SAVEDLOACTIONS LIST IN MONGODB
};

 /* var FavListVM = {
    
    eachLocationCLicked: function(location){
        console.log(location.title + " was clicked")
    showPic(true); 
    }
}; */

function FavListVM(){
    var self = this;
    self.location = ko.observable(location);
    self.location.title = ko.observable(location.title);
    self.location.address = ko.observable(location.address);
    self.location.phone = ko.observable(location.phone);
    self.location.photo = ko.observable(location.photo);
    self.location.favid = ko.observable(location.favid);
    self.location.showPic = ko.observable(location.showPic);
    
    
    self.initPic = function(location){
        console.log("initPic working " + self.location.title());
     if(self.location.showPic() == false){
         console.log(self.location.showPic())
         showPic(true);
        self.location.showPic() = true;
        console.log(self.location.showPic());
    };

}    
}

function getPlacesInfo(favList) {

        console.log("inside getplacesinfo");

        var locphone;
        var loctitle;
        var locaddress;
        var id = 1;
        var innerHTML2 = document.getElementById('table');

        console.log(innerHTML2);
       var service2= new google
            .maps
            .places
            .PlacesService(innerHTML2);
        console.log("test:2 fav list has " + favList.length + " items in it");
        console.log(favList);
        var favTile = favList[0];
        for (i = 0; i < favList.length; i++) {
            var loc = favList[i];

            service2.getDetails({
                placeId: loc.markerID
            }, function (place, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                       console.log("no information was passed");
                   
                } else {
                  var location;
                     if (place.name) {
                        loctitle = place.name;
                    }

                    if (place.formatted_address) {
                        locaddress = place.formatted_address;
                    }
                    if (place.formatted_phone_number) {
                        locphone = place.formatted_phone_number;
                    }
                    if (place.photos) {
                        var photo = place
                            .photos[0]
                            .getUrl({maxHeight: 500, maxWidth: 700});
                    }
                    location = {
                        title: loctitle,
                        address: locaddress,
                        phone: locphone,
                        photo: photo,
                        favid: id,
                        showPic:false
                    }
                    id += 1;
                  savedLocations.push(location);
                    console.log("after location is pushed " + savedLocations.length);
               
                };  
            });
        };
    
    
    }
 ko.applyBindings(new FavListVM(savedLocations.location));   

