var savedLocations = [];

function FavListModel() {
     var self = this;

    self.title = ko.observable();
    self.address = ko.observable();
    self.phone = ko.observable();
    self.favid = ko.observable();
    self.photo = ko.observable();
    self.savedLocations = ko.observableArray();
    console.log("Inside ViewModel");

    function getPlacesInfo() {
        console.log("inside getplacesinfo");
        
        var innerHTML = document.getElementById('table');

console.log(innerHTML);
        var service = new google
            .maps
            .places
            .PlacesService(innerHTML);
        
        var locphone;
        var loctitle;
        var locaddress;
        var id = 1;

        console.log("test:2 fav list has " + favList.length + " items in it");
        console.log(favList);
        var favTile = favList[0];
        for (i = 0; i < favList.length; i++) {
            var loc = favList[i];

            service.getDetails({
                placeId: loc.markerID
            }, function (place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {

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
                    var location = {
                        title: loctitle,
                        address: locaddress,
                        phone: locphone,
                        photo: photo,
                        favid: id
                    }
                    id += 1;
                    self
                        .savedLocations()
                        .push(location);
                    console.log(self.savedLocations().length);

                } else {
                    console.log("no information was passed");
                };

            });
            console.log(self.savedLocations().length);
        };
        

    }
    $(function() {
        getPlacesInfo();
    });

    
}
ko.applyBindings(new FavListModel());
function makeList(location) {
    console.log("makeList function running");
    console.log(location);

};
