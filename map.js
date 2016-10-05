var map, geocoder;
var firebase = new Firebase("https://gmif-d2f6b.firebaseio.com/ ");

 // Initialize Firebase
      // var config = {
      //   apiKey: "AIzaSyA_fvD_Ydzt859FnndImjQ5kHSPJ3XoPoM",
      //   authDomain: "gmif-d2f6b.firebaseapp.com",
      //   databaseURL: "https://gmif-d2f6b.firebaseio.com",
      //   storageBucket: "gmif-d2f6b.appspot.com",
      // };
      // var firebase=firebase.initializeApp(config);
      // console.log(firebase)

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCurrentPosition, errFunc);
} else {
    alert("Geolocation is not supported by this browser.");
}

function initMap(position) {
    var mapDiv = document.getElementById('map')
    map = new google.maps.Map(mapDiv, {
        center: {
            lat: 28.5821294,
            lng: 77.32549879999999
        },
        zoom: 10,
        // disableDoubleClickZoom: true
    });
    geocoder = new google.maps.Geocoder();
    map.addListener('click', function(e) {
        var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        console.log(latlng);
        geocoder.geocode({'latLng': latlng},function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var add = results[0].formatted_address;
                        var value = add.split(",");

                        count = value.length;
                        country = value[count - 1];
                        state = value[count - 2];
                        city = value[count - 3];
                        $("#clickedAddress").html(city);

                        //push the data into firebase database...
                        pushLoaction(e,city);
                    } else {
                        $("#clickedAddress").html("address not found");
                    }
                } else {
                    $("#clickedAddress").html("Geocoder failed due to: " + status);
                }
            }
        );
    });
    function pushLoaction(e,area){
       console.log(area);
        firebase.push({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            abc: "xyz",
            area: area
        });
    }
    // Create a heatmap.
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map,
        radius: 18
    });


    firebase.on("child_added", function(snapshot, prevChildKey) {
        // Get latitude and longitude from the cloud.
        var newPosition = snapshot.val();

        // Create a google.maps.LatLng object for the position of the marker.
        // A LatLng object literal (as above) could be used, but the heatmap
        // in the next step requires a google.maps.LatLng object.
        var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

        // Place a marker at that location.
        var marker = new google.maps.Marker({
          position: latLng,
          label:"A",
          map: map
        });
        // heatmap.getData().push(latLng);

    });

}

function showCurrentPosition(position) {
    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    setTimeout(function() {
        map.panTo(pos);
        map.setZoom(14);
    }, 1000);
}

function errFunc(error) {
    console.log(error)
}