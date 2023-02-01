var map = L.map("map", {
  center: [68.24, -096.28],
  zoomSnap: 0.25,
  zoom: 3,
  maxZoom: 10,
  zoomControl: false, // Disable the default zoom controls.
}); //add zoom level outside of square brackets

//removes leaflet attribution
document.getElementsByClassName(
  "leaflet-control-attribution"
)[0].style.display = "none";

// get color depending on provincial geographical classification code 
function getColor(d) {
  return d == 10 //Newfoundland and Labrador
    ? "#800026"
    : d == 11 //Prince Edward Island
    ? "#BD0026"
    : d == 12 //Nova Scotial
    ? "#ccebc5"
    : d == 13 //New Brunswick
    ? "#bc80bd"
    : d == 24 //Quebec
    ? "#d9d9d9"
    : d == 35 //Ontario
    ? "#fccde5"
    : d == 46 //Manitoba
    ? "#b3de69"
    : d == 47 //Saskatchewan
    ? "#fdb462"
    : d == 48 //Alberta
    ? "#80b1d3"
    : d == 59 //British Columbia
    ? "#fb8072"
    : d == 60 //Yukon
    ? "#bebada"
    : d == 61 //Northwest Territories
    ? "#ffffb3"
    : d == 62 //Nunavut
    ? "#E0D7FF"
    : "#FFEDA0";
}

//A styling function for our GeoJSON layer so that fillColor depends on feature.properties.density property. Also adds a dashed stroke
function style(feature) {
  return {
    fillColor: getColor(feature.properties.prov_code),
    weight: 2,
    opacity: 1,
    color: "#4A6AA3",
    dashArray: "2",
    fillOpacity: 0.8,
  };
}

// Function to add a hover state
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#6050A8",
    dashArray: "",
    fillOpacity: 1,
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
    "<h4>Random Facts around Canada</h4>" +
    (props
      ? "<strong>" +
        props.prov_name_en +
        "</strong><br /><br/>" +
        props.fact
      : "Hover over a province");
};

info.addTo(map);


//markers on the map

var //creating cariables for the map markers
  //Ottawa
  ottawa = L.marker([45.4215, -75.724098], { alt: "Ottawa" })
    .addTo(map)
    .bindPopup(
      '<h4 class="cityName">Ottawa, ON</h4>The city has many <a href="https://allthatsinteresting.com/bigfoot-facts" target="_blank">Sasquatch</a>, which causes an exodus in the spring as they shed.'
    ),
  //Edmonton
  edmonton = L.marker([53.5461, -113.4937], { alt: "Edmonton" })
    .addTo(map)
    .bindPopup(
      '<h4 class="cityName">Edmonton, AB</h4><a href="https://www.britannica.com/topic/Sasquatch" target="_blank">Sasquatch</a> hold many prominent positions in office.'
    ),
  // Montreal
  montreal = L.marker([45.5019, -73.5674], { alt: "Montreal" })
    .addTo(map)
    .bindPopup(
      '<h4 class="cityName">Montreal, QC</h4><a href="https://www.livescience.com/25072-yeti-abominable-snowman.html" target="_blank">Yeti</a> enjoy the hills of the city, as well as the poutine.'
    );
  //Halifax
  halifax = L.marker([44.8857, -63.1005], { alt: "Halifax" })
    .addTo(map)
    .bindPopup(
      '<h4 class="cityName">Halifax, NS</h4><a href="https://www.natgeotv.com/ca/hunt-for-the-abominable-snowman/facts" target="_blank">Yeti</a> from here have won several international compititions for singing sea shanties.'
    );


// Layers control panel
var sasquatches = L.layerGroup([ottawa, edmonton]);
var yeti = L.layerGroup([montreal, halifax]);
var allCryptids = L.layerGroup([ottawa, edmonton, montreal, halifax]);

var overlayMaps = {
  Sasquatches: sasquatches,
  Yeti: yeti,
  Both: allCryptids,
};

var layerControl = L.control.layers(overlayMaps).addTo(map);

