/* var savedLocations = ko.observableArray();
var showPic = ko.observable(false);
var picINIT2 = function (location) {
    console.log("initPic working " + self.location.title);
    if (self.location.showPic == false) {
        console.log(self.location.showPic)
        self.showPic(true);
        self.location.showPic = true;
        console.log(location.showPic);
    }
};
var eachLocationCLicked = function (location) {
    console.log(location.title + " was clicked " + location.photo)
    initPic(location);
};

function FavListVM() {
    var self = this;
    self.location = ko.observable(location);
    self.location.title = ko.observable(location.title);
    self.location.address = ko.observable(location.address);
    self.location.phone = ko.observable(location.phone);
    self.location.photo = ko.observable(location.photo);
    self.location.favid = ko.observable(location.favid);
    self.location.showPic = ko.observable(location.showPic);

    self.initPic = function (location) {
        console.log("initPic working " + self.location.title());
        if (self.location.showPic() == false) {
            console.log(self.location.showPic())
            showPic(true);
            self
                .location
                .showPic() = true;
            console.log(self.location.showPic());
        };

    }
}
*/





var removeLocation = function (location) {
    console.log(location.title + " remove was clicked " + location.photo);
    FavListVM.savedLocations.remove(location);
    // WRITE AJAX CALL TO UPDATE SAVEDLOACTIONS LIST IN MONGODB
};



var FavListVM = {

    location: ko.observable(location),
    savedLocations: ko.observableArray(),
    title: ko.observable(location.title),
    address: ko.observable(location.address),
    phone: ko.observable(location.phone),
    photo: ko.observable(location.photo),
    rating:ko.observable( location.rating),
    types: ko.observable(location.types),
    reviews:ko.observable(location.reviews),
    favid: ko.observable(location.favid),
    showPic: ko.observable(location.showPic),
    
    
    initPic: function () {
        console.log("initPic working " + FavListVM.title);
        if (FavListVM.showPic = false) {
            console.log(FavListVM.showPic)
            
            FavListVM.showPic = true;
            console.log(FavListVM.showPic);
            return FavListVM.showPic;
        } else{
            console.log("show pic came back true")
        };

    }
};



function getPlacesInfo(favList) {

    console.log("inside getplacesinfo");

    var locphone;
    var loctitle;
    var locaddress;
    var id = 1;
    var table = document.getElementById('table');

    console.log();
    var service2 = new google
        .maps
        .places
        .PlacesService(table);
    console.log("test:2 fav list has " + favList.length + " items in it");
    console.log(favList);
    
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
                if (place.rating) {
                    var rating = place.rating; 
                    
                }
                 if (place.types) {
                    var types = place.types; //returns a array
                    
                }
                if (place.reviews) {
                    var reviews = place.reviews;// returns a list
                    
                }
                                
                FavListVM.location = {
                    title: loctitle,
                    address: locaddress,
                    phone: locphone,
                    photo: photo,
                    rating: rating,
                    types: types,
                    reviews:reviews,
                    favid: id,
                    showPic: false,
                   
                }
                id += 1;
                FavListVM.savedLocations.push(FavListVM.location);
                

            };
        });
    };
    console.log(FavListVM.savedLocations); //STILL A GOOGLE OBJECT 
IndexPhotoVM(FavListVM.savedLocations[0]);
}
ko.applyBindings(FavListVM );
