 var savedLocations = ko.observableArray();
 var initShowPic = ko.observable(false);
 var initPic = function(location){
     console.log("initPic working " + location.title);
     if(location.showPic == false){
         console.log(location.showPic)
         initShowPic(true);
        location.showPic = true;
        console.log(location.showPic);
     }
 };
var eachLocationCLicked = function (location){
    console.log(location.title + " was clicked")
   initPic(location);
};

 /* var FavListVM = {
    
    eachLocationCLicked: function(location){
        console.log(location.title + " was clicked")
    showPic(true); 
    }
}; */

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




 ko.applyBindings();
