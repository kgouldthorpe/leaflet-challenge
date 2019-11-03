function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });    
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Earthquake Locations": earthquakes
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [39.82, -98.57],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {
    
    var epicenters = response.features;
    console.log(epicenters);

  
    // // Initialize an array to hold bike markers
    var quakeMarkers = [];
        
    // Loop through data for each of variable
    for (var index = 0; index < epicenters.length; index++) {
        var epicenter = epicenters[index];

        var lat = epicenter.geometry.coordinates[0];
        var long = epicenter.geometry.coordinates[1];
        var coords = [long,lat];
        var title = epicenter.properties.title;
        var mag = epicenter.properties.mag;
        //console.log(coords);
        // For each epicenter, create a marker and bind a popup with information on the quake
        var quakeMarker = L.marker(coords)
            .bindPopup("<h3>" + title + "<h3><h3>Magnitude: " + mag + "<h3>");
        //console.log(quakeMarker);
        // Add the marker to the quakeMarkers array
        quakeMarkers.push(quakeMarker);
        // console.log(quakeMarkers);
    }

    // Create a layer group made from the quake markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
}

// Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", createMarkers);
