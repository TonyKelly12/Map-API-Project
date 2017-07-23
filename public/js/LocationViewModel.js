
function FavListModel() {
    var self = this;
    self.savedLocations = ko.observableArray();
    self.title = ko.observable();
    self.address = ko.observable();
    self.phone = ko.observable();
    self.favid = ko.observable();
    self.photo = ko.observable();
    
    console.log("Inside ViewModel");

    function getPlacesInfo() {

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
            }, function (place, status, savedLocations) {
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
                        favid: id
                    }
                    id += 1;
                   self.savedLocations().push(location);
                    console.log("after location is pushed " + self.savedLocations().length);


                };
              
            });
        
        };
 console.log(self.savedLocations().length);  // SAVED LOCATIONS ARRAY RESET TO EMPTY!!!!!
    }

    $(function () {
        getPlacesInfo();

    });

}
ko.applyBindings(new FavListModel());
