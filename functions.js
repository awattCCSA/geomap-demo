var map = L.map("map", {
  center: [68.24, -096.28],
  zoom: 3,
  maxZoom: 18,
  zoomControl: false, // Disable the default zoom controls.
}); //add zoom level outside of square brackets

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);


// get color depending on population density value
function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

//A styling function for our GeoJSON layer so that fillColor depends on feature.properties.density property. Also adds a dashed stroke
function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "#f2cee3",
    dashArray: "2",
    fillOpacity: 0.7,
  };
}

// Function to add a hover state
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 3,
    color: "#6e1b4b",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}

/* global provincialData variable */
const geojson = L.geoJson(provincialData, {
  style,
  onEachFeature,
}).addTo(map);

// Will reset the highlated area to previous state
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

//a click listener that will zoom to the clicked province
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//adds the listeners to our province layers
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>Ape like creature Population Density</h4>" +
    (props
      ? "<b>" +
        props.prov_name_en +
        "</b><br />" +
        props.density +
        " Bigfoot / mi<sup>2</sup>"
      : "Hover over a province");
};

info.addTo(map);

//Creates a legend for the map
var legend = L.control({ position: "topleft" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);

//markers on the map

var //creating cariables for the map markers
  //Ottawa
  ottawa = L.marker([45.4215, -75.724098], { alt: "Ottawa" })
    .addTo(map)
    .bindPopup(
      "The city has many Sasquatch, which causes an exodus in the spring as they shed."
    ),
  //Edmonton
  edmonton = L.marker([53.5461, -113.4937], { alt: "Edmonton" })
    .addTo(map)
    .bindPopup("Sasquatch hold many prominent positions in office."),
  // Montreal
  montreal = L.marker([45.5019, -73.5674], { alt: "Montreal" })
    .addTo(map)
    .bindPopup("Yeti enjoy the hills of the city, as well as the poutine.");
//Halifax
halifax = L.marker([44.8857, -63.1005], { alt: "Halifax" })
  .addTo(map)
  .bindPopup(
    "Yeti from here have won several international compititions for singing sea shanties."
  );

var sasquatches = L.layerGroup([ottawa, edmonton]);
var yeti = L.layerGroup([montreal, halifax]);

var overlayMaps = {
  Sasquatches: sasquatches,
  Yeti: yeti,
};

var layerControl = L.control.layers(overlayMaps).addTo(map);

// Pop up where clicked


// var popup = L.popup();

function onMapClick(e) {
  popup
    .setContent("You clicked the map at " + features.properties.name + ".")
    .openOn(map);
}

map.on("click", onMapClick);

//Moves map controls outside of map
$(document).ready(function () {
  var newParent = document.getElementById("custom-map-controls");
  var oldParent = document.getElementsByClassName("leaflet-top leaflet-right");

  while (oldParent[0].childNodes.length > 0) {
    newParent.appendChild(oldParent[0].childNodes[0]);
  }
});
