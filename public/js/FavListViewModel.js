function FavListVM(){
    var self = this;

    self.savedLocations = ko.observableArray();
    
    self.initPic = function(location){
        console.log("initPic working " + location.title);
     if(location.showPic == false){
         console.log(location.showPic)
         initShowPic(true);
        location.showPic = true;
        console.log(location.showPic);
    };

}
}
ko.applyBindings(new FavListVM());