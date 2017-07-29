var favList = [];
function loadData() {
    $.ajax({
        url: '/index',
        method: 'GET',
        contentType: 'application/json',
       
        success: function (response) {

            console.log(response);
            response.favLocation.forEach(function (fav) {
                    var lat = fav.lat;
                    var lng = fav.lng;
                    var latlng = new google
                        .maps
                        .LatLng(lat, lng);
                    fav.latlng = latlng;
                    favList.unshift(fav);

                });
            var favTile = favList[1];
            
            console.log("test 1:fav list has " + favList.length + " items in it");
            //getPlacesInfo(favList);
          // getPlacePhoto(favTile);
          getPlacesInfo(favList);
        }

    });

}
loadData();