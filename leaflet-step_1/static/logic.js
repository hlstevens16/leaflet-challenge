//Store our API endpoint inside queryUrl
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

function markerSize(magnitude) {
  return magnitude * 30000;
}

function markerColor(magnitude) {
  if (magnitude < 1) {
    return "#ccff33"
  }
  else if (magnitude < 2) {
    return "#ffff33"
  }
  else if (magnitude < 3) {
    return "#ffcc33"
  }
  else if (magnitude < 4) {
    return "#ff9933"
  }
  else if (magnitude < 5) {
    return "#ff6633"
  }
  else {
    return "#ff3333"
  };
}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define satelitemap layer + darkmap layer + outdoor layer
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    // var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //   maxZoom: 18,
    //   id: "mapbox.outdoors",
    //   accessToken: API_KEY
    // }); 
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satelite Map": satellitemap,
      "Greyscale Map": darkmap,
      // "Outdoor Map": outdoormap
    };
  
    // Create the tectonic plate layer
    // var TectonicPlates = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
      // TectonicPlates: TectonicPlates
    };
  
    // Create our map, giving it the satelitemap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 3,
      layers: [satellitemap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    // // Query to retrieve the tectonic plate data
    // var tectonicPlatesquery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
    // // Create the tectonic plate lines and add them as layer
    // d3.json(tectonicPlatesquery, function(data) {
    // L.geoJSON(data, {
    //     style: function() {
    //       return {color: "orange", fillOpacity: 0}
    //     }
    //   }).addTo(TectonicPlates)
    // })

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
  
  }
