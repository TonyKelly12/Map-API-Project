    var favList = [];

    var favlocations = ko.observableArray();
    
    var gridPhotoModel = function (photo) {
        console.log(photo);
        this.photo = ko.observable(photo);
    }

    function favlocation(location) {
        this.title = ko.observable(location.title);
        this.address = ko.observable(location.address);
        this.phone = ko.observable(location.phone);

    }


    $(function () {
        event.preventDefault();

        $.ajax({
            url: '/index',
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                response.favLocation.forEach(function (fav) {
                    var lat = fav.lat;
                    var lng = fav.lng;
                    var latlng = new google.maps.LatLng(lat, lng);
                    fav.latlng = latlng;
                    favList.push(fav);

                });
                var favTile = favList[0];
                console.log(favTile);
                getPlacePhoto(favTile);
                
            }
        
        });
        
    });

    function getPlacePhoto(favTile, photo) {
        console.log(favTile.markerID);
        var innerHTML = document.getElementById('fav-photo');
        var service = new google.maps.places.PlacesService(innerHTML);

        service.getDetails({

            placeId: favTile.markerID
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Set the marker property on this infowindow so it isn't created again.
                console.log(place);
                if (place.photos) {
                    var photo = place.photos[0].getUrl(
                        { maxHeight: 500, maxWidth: 700 });

                    ko.applyBindings(new gridPhotoModel(photo));
                }

                LocationsViewModel(favList);
               
            }

        })


    };
 
    function LocationsViewModel(favList) {

        var self = this;
        var innerHTML = document.getElementById('table');
        var service = new google.maps.places.PlacesService(innerHTML);
        var locaddress;
        var locphone;
        var loctitle;
        for (i = 0; i < favList.length; i++) {
            
            var loc = favList[i];
            console.log(loc.markerID);

            service.getDetails({
                placeId: loc.markerID
            }, function (place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Set the marker property on this infowindow so it isn't created again.
                    if (place.name) {
                    loctitle = place.name;
                }
                    
                    if (place.formatted_address) {
                        locaddress = place.formatted_address;
                    }
                    if (place.formatted_phone_number) {
                        locphone = place.formatted_phone_number;
                    }

                    var location = {
                        title: loctitle,
                        address: locaddress,
                        phone: locphone
                    }
                    console.log(location.address);
                    favlocations.push(favlocation(location));
                }
            });
        };

        ko.applyBindings(LocationsViewModel(favlocations));



    };