    var map;
    var favmarkers = [];
    var markers = [];
    var searchmarkers = [];
    var polygon = null;
    var infowindow;
    var service;
    var louisville = { lat: 38.252259, lng: -85.756534 };
    var userLocation;
    var userMarker;
    //this function initiates the map
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 38.252259, lng: -85.756534 },
            zoom: 14,
            gestureHandling: 'cooperative'
        });


        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'address': 'Louisville' }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);

            } else {
                window.alert('Geocode was not successful for the following reason: ' +
                    status);
            }
        });
        //use locations array as the users saved favorite places
        var locations = [
            { title: 'KFC Yum Center', location: { lat: 38.257340, lng: -85.754245 } },
            { title: 'The Old Spaghetti Factory', location: { lat: 38.255317, lng: -85.754910 } },
            { title: 'Hard Rock Cafe', location: { lat: 38.252169, lng: -85.757583 } },

        ];

        //making info window for marker
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

        //init Drawing Manager
        var drawingManger = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON
                ]
            }
        });

        //the following group uses the location array to create an array of markers on the init

        for (var i = 0; i < locations.length; i++) {
            //Get the position from the location array
            var position = locations[i].location;
            var title = locations[i].title;
            //create the marker per location and put into markers array
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            //push the marker to array of markers
            favmarkers.push(marker);
            // Extend the boundaries of the map for each marker

            //Create an onclick event to open an info window at each marker
            marker.addListener('click', function () {
                populateInfoWindow(this, infowindow);
            });
        }

        //hide and show listings event listeners
        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
        //drawing manager event listener
        document.getElementById('toggle-drawing').addEventListener('click', function () {
            toggleDrawing(drawingManger);
        });
        //Zoom to area event listener
        document.getElementById('zoom-to-area').addEventListener('click', function () {
            zoomToArea();
        });

        document.getElementById('search-within-time').addEventListener('click', function () {
            searchWithinTime();
        });

        document.getElementById('place-search').addEventListener('click', function () {
            placeSearch();
        });

        document.getElementById('clear-search').addEventListener('click', function () {
            hideSearchMarker();
        });

        document.getElementById('clear-location').addEventListener('click', function () {
            hideLocation();
        });

        document.getElementById('submit-location').addEventListener('click', function () {
            setUserLocation();
        });


        document.getElementById('place-search').addEventListener('click', placeSearch);


        var timeAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('search-within-time-text'));

        var zoomAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('zoom-to-area-text'));

        var currentLocationAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('currentLocation'));

        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('place-search-text'));

        searchBox.addListener('places_changed', function () {
            searchBoxPlaces(this);
        });
        searchBox.setBounds(map.getBounds());
        zoomAutocomplete.bindTo('bounds', map);
        timeAutocomplete.bindTo('bounds', map);
        currentLocationAutocomplete.bindTo('bounds', map);

        //Polygon Event Listener
        drawingManger.addListener('overlaycomplete', function (event) {

            if (polygon) {
                polygon.setMap(null);
                hideListings();
            }
            //switching the drawing mode to hand
            drawingManger.setDrawingMode(null);
            //creating a new editable polygon for overlay
            polygon = event.overlay;
            polygon.setEditable(true);
            //searching within the polygon
            searchWithinPolygon();
            //Make sure the search is re-done if polygone changes.
            polygon.getPath().addListener('set_at', searchWithinPolygon);
            polygon.getPath().addListener('insert_at', searchWithinPolygon);
        });
    }


    function setUserLocation() {
        var meIcon = makeMarkerIcon('0091ff');
        userLocation = document.getElementById('currentLocation').value
        var userLabel = "Me";
        console.log(userLocation);
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'address': userLocation }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                userMarker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    label: userLabel,

                    icon: meIcon,

                });
            } else {
                window.alert('Geocode was not successful for the following reason: ' +
                    status);
            }
        });
    }

    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    //this function populates the info window when marker is clicked based on position of marker
    function populateInfoWindow(marker, infowindow) {
        //check to make sure infowindow is not  already opened
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            //Make sure the marker property is cleared if  infowindow is closed
            infowindow.addListener('closeclick', function () {
                infowindow.marker(null);
            });



            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            /*  If the status is ok and pano is found, compute the position of the streetview image,
             * then calculate the heading, then get a pano from that and set the options */

            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>' +
                        '<div><input type=\"button\" value=\"Save Location\" onclick = \"saveLocation()\" </input></div>' +
                        '<div><input type=\"button\" value=\"View Route\" id = \"view-route\" </input></div>' +
                        '<div><input type=\"button\" value=\"View Details\" id = \"view-details\" </input></div>');
                    document.getElementById('view-route').addEventListener('click', function () {
                        markerDisplayDirections();
                    });
                    document.getElementById('view-details').addEventListener('click', function () {
                        getPlacesDetails(this);
                    });
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
                }
            }

            /*  USe StreetVIew service to get the closest streetvie image within 50 meters of markers position  */
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            infowindow.open(map, marker);


        }


    }

    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < favmarkers.length; i++) {
            favmarkers[i].setMap(map);
            bounds.extend(favmarkers[i].position);
        }
        map.fitBounds(bounds);
    }

    function hideListings() {
        for (var i = 0; i < favmarkers.length; i++) {
            favmarkers[i].setMap(null);

        }
        zoomHome();
    }

    function hideSearchListings() {
        for (var i = 0; i < searchmarkers.length; i++) {
            searchmarkers[i].setMap(null);

        }
        zoomHome();
    }

    function hideLocation() {
        userMarker.setMap(null);
        zoomHome();
    }

    function toggleDrawing(drawingManager) {
        if (drawingManager.map) {
            drawingManager.setMap(null);
            //In case the user drew anythin, get rid of the polygon
            if (polygon) {
                polygon.setMap(null);
            }
        } else {
            drawingManager.setMap(map);
        }
    }

    function searchWithinPolygon() {
        for (var i = 0; i < markers.length; i++) {
            if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
                favmarkers[i].setMap(map);
            } else {
                favmarkers[i].setMap(null);
            }
        }
    }
    var zoomplace;
    function zoomToArea() {
        //Init Geocoder
        var geocoder = new google.maps.Geocoder();
        //Ger the address or place that the user entered
        var address = document.getElementById('zoom-to-area-text').value;
        //Make sure the address isn't blank
        if (address == '') {
            window.alert('You must enter an area, or address.');
        } else {
            //Geocode the address/area entered to the center. Then, center the map on it
            geocoder.geocode(
                {
                    address: address,
                    componentRestrictions: { locality: 'Louisville' }
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(15);
                        zoomplace = results[0].geometry.location;
                    } else {
                        window.alert('We could not find that location - try entering more specific place.');
                    }
                }
            )
        }

    }

    function zoomHome() {
        map.setCenter(louisville);
        map.setZoom(14);
    }

    function searchWithinTime() {
        //Init the distance Matrix service.
        var distanceMatrixService = new google.maps.DistanceMatrixService;
        var address = userMarker.position;
        //check to make sure the place isnt blank.
        if (address == '') {
            window.alert('You must enter an address.');
        } else {
            hideSearchListings();
            /*Use distance matrix service to calculate duration of routes between all markers  and the destination
            * address entered by the user. Then put all the origins into an origin matrix*/
            var origins = [];
            for (var i = 0; i < 20; i++) {
                //console.log(searchmarkers[i].position);
                origins[i] = searchmarkers[i].position;
                //console.log(destinations[i]);
            }
            var destination = address;
            var mode = document.getElementById('mode').value;
            //Now that both origins and destination are defined, get all info for the distance between
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: [destination],
                travelMode: google.maps.TravelMode[mode],
                unitSystem: google.maps.UnitSystem.IMPERIAL,

            }, function (response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    window.alert('Error was: ' + status);
                } else {
                    displayMarkersWithinTime(response);
                }
            })
        }
    }

    function displayMarkersWithinTime(response) {
        var maxDuration = document.getElementById('max-duration').value;
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        /* Parse through the results, and get the distance and duration of each because there might be multiple
         * origins and destinations we have a nested loop then make sure at least 1 result was found */
        var atLeastOne = false;
        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                if (element.status === "OK") {
                    /* the distance is returned in feet, but the text is in miles. If we wanted to switch the
                     * function to show markers within a user-entered Distance, We would need the value for
                      * the distance, but for now we only need the text. */
                    var distanceText = element.distance.text;
                    /* Duration value is given in seconds so we make it in Minutes. We need both the value and
                     * the text. */
                    var duration = element.duration.value / 60;
                    var durationText = element.duration.text;
                    if (duration <= maxDuration) {
                        /* the origin[i] should = the markers[i] */
                        searchmarkers[i].setMap(map);
                        atLeastOne = true;
                        /* Create a mini info window to open immediately nd contain the distance and duration */
                        var smallInfowindow = new google.maps.InfoWindow({
                            content: durationText + ' away, ' + distanceText +
                            '<div><input type=\"button\" value=\"View Route\" onclick =' +
                            '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'/* +
                            Add button to save location here!!!!!!!!!!!!! */
                            /* '<div><input type=\"button\" value=\"Save Location\" onclick =' +
                             '\"saveLocation(&quot;' + origins[i] + '&quot;);\"></input></div>'*/
                        });
                        smallInfowindow.open(map, searchmarkers[i]);
                        /* put this in so that this small window closes if the user clicks the marker,
                         * when the big infowindow opens */
                        searchmarkers[i].smallInfowindow = infowindow;
                        google.maps.event.addListener(searchmarkers[i], 'click', function () {
                            this.smallInfowindow.close();
                        });
                    }
                }
            }
        }

    }
    function displayDirections(origin) {
        hideListings();
        var directionsService = new google.maps.DirectionsService;
        // Get the destination address from the user entered value.
        var destinationAddress = userMarker.position;
        // Get mode again from the user entered value.
        var mode = document.getElementById('mode').value;
        directionsService.route({
            // The origin is the passed in marker's position.
            origin: origin,
            // The destination is user entered address.
            destination: destinationAddress,
            travelMode: google.maps.TravelMode[mode]
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    draggable: true,
                    polylineOptions: {
                        strokeColor: 'green'
                    }
                });
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    /*this function takes users input for type  of place and displays all within 25 radius. If the user
     * has already zoomed in to a area the search will be conducted within that area if not search will be
      * conducted within the maps init location*/
    function placeSearch() {

        hideSearchListings(searchmarkers);
        var placesService = new google.maps.places.PlacesService(map);
        var bounds = map.getBounds();
        placesService.textSearch({
            query: document.getElementById('place-search-text').value,
            location: userMarker.position,
            radius: 25,

        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                createMarkersForPlaces(results);
            }
        });


    }

    // THis Function creates a marker for each result that comes back in placeSearch() and places on map

    function createMarkersForPlaces(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var icon = {
                url: place.icon,
                size: new google.maps.Size(100, 100),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(40, 40)
            };
            searchMarker = new google.maps.Marker({
                map: map,
                icon: icon,
                position: place.geometry.location,
                title: place.name,
                id: place.place_id
            });
            // Create a single infowindow to be used with the place details information
            // so that only one is open at once.
            var placeInfoWindow = new google.maps.InfoWindow();
            // If a marker is clicked, do a place details search on it in the next function.
            searchMarker.addListener('click', function () {
                if (placeInfoWindow.searchMarker == this) {
                    console.log("This infowindow already is on this marker!");
                } else {
                    getPlacesDetails(this, placeInfoWindow, this);
                }
            });
            searchmarkers.push(searchMarker);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    }

    //This function hides all markers from place search only and refocuses map to init position
    function hideSearchMarker() {
        for (var i = 0; i < searchmarkers.length; i++) {
            searchmarkers[i].setMap(null);
            zoomplace = null;
            zoomHome();
        }
    }

    function searchBoxPlaces(searchBox) {
        hideSearchMarker();
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            window.alert('We did not find any places matching that search!');
        } else {
            // For each place, get the icon, name and location.
            createMarkersForPlaces(places);
        }
    }

    function getPlacesDetails(searchMarker, infoWindow) {

        var service = new google.maps.places.PlacesService(map);

        service.getDetails({

            placeId: searchMarker.id
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Set the marker property on this infowindow so it isn't created again.
                infoWindow.searchMarker = searchMarker;
                var innerHTML = '<div>';
                if (place.name) {
                    innerHTML += '<strong>' + place.name + '</strong>';
                }
                if (place.formatted_address) {
                    innerHTML += '<br>' + place.formatted_address;
                }
                if (place.formatted_phone_number) {
                    innerHTML += place.formatted_phone_number;
                }
                if (place.opening_hours) {
                    innerHTML += '<br><br><strong>Hours:</strong><br>' +
                        place.opening_hours.weekday_text[0] + '<br>' +
                        place.opening_hours.weekday_text[1] + '<br>' +
                        place.opening_hours.weekday_text[2] + '<br>' +
                        place.opening_hours.weekday_text[3] + '<br>' +
                        place.opening_hours.weekday_text[4] + '<br>' +
                        place.opening_hours.weekday_text[5] + '<br>' +
                        place.opening_hours.weekday_text[6];
                }
                if (place.photos) {
                    innerHTML += '<br><br><div><img src="' + place.photos[0].getUrl(
                        { maxHeight: 100, maxWidth: 200 }) + '"></div>';
                }
                innerHTML += '<div><div><input type=\"button\" value=\"Save Location\" id=\"save-location\" </input></div>';

                infowindow.setContent(innerHTML);

                infowindow.open(map, searchMarker);

                $(function () {
                    console.log(searchMarker.id + 'data is being transfered');
                    $('#save-location').on('click', function (event) {
                        event.preventDefault();

                        var favPlaceName = searchMarker.title;
                        var favPlacePosition = searchMarker.position;
                        var favPlaceId = searchMarker.id;
                        var lat = favPlacePosition.toString().replace(/^\"\(([0-9-.]*),.*/g, "$1");
                        var lng = favPlacePosition.toString().replace(/.*,\s*([0-9-.]*)\)\"$/g, "$1");
                        console.log(lat + lng + 'marker prop switched to var');
                        $.ajax({
                            url: './',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ favPlaceName, lat, lng, favPlaceId }),
                            success: function (response) {
                                console.log(status)
                            }
                        });
                    });
                });

                /*console.log(searchMarker.id);
                document.getElementById('save-location').addEventListener('click', function () {
                    console.log(searchMarker.id);
                    saveLocation(searchMarker);
                }); */
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.searchMarker = null;

                });

            }

        });


    }

    function saveLocation(searchMarker) {


    }

