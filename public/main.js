let server = "https://scoot-doot.vercel.app/api";
// let server = "http://localhost:3000";

var map;
var markerLayer;
var newScooterLayer;

// TODO: create global arrays for scooters and markers
// instead of redrawing on top of existing ones
var current_scooters = new Map();

function setup_map(latitude, longitude) {
  map = L.map("mapid").setView([latitude, longitude], 18);
  L.control.scale().addTo(map);

  newScooterLayer = L.layerGroup().addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 24,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map);
}

function formatParams(params) {
  return (
    "?" +
    Object.keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
      })
      .join("&")
  );
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function getLocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

function getIcon(operator) {
  return new L.Icon({
    iconUrl: `assets/markers/${operator}.png`,
    iconSize: [25, 30],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30],
  });
}

function load_bikes(params) {
  request_url = server + "/bikes/entur" + formatParams(params);
  var operators = new Map();
  newScooterLayer.clearLayers();
  httpGetAsync(request_url, function (data) {
    var json = JSON.parse(data);

    // json = json.data;
    Object.entries(json).forEach(([key, bike]) => {
      if (!current_scooters.has(bike.id)) {
        current_scooters.set(bike.id, bike);
        L.circle([bike.lat, bike.lon], { radius: 5 }).addTo(newScooterLayer);

        markerLayer.clearLayers();
        if (operators.has(bike.operator)) {
          operators.set(bike.operator, operators.get(bike.operator) + 1);
        } else {
          operators.set(bike.operator, 1);
        }
      }
    });

    current_scooters.forEach((bike, id) => {
      let bike_info = JSON.stringify(bike, null, 2);

      L.marker([bike.lat, bike.lon], { icon: getIcon(bike.operator) })
        .addTo(markerLayer)
        .bindPopup(bike_info)
        .bindTooltip(bike_info);
    });

    // console.log("Operators: ", operators);
    const myJson = {};
    myJson.Operators = Array.from(operators.keys());
    myJson.Total = current_scooters.size;
    console.log(JSON.stringify(myJson));

    var pos = map.getCenter();
    var zoomLevel = map.getZoom();
    var params = {
      lat: pos.lat,
      lng: pos.lng,
      range: 100,
    };
    setTimeout(function () {
      load_bikes(params);
    }, 5000);
  });
}

async function main() {
  try {
    var position = await getLocation();

    var params = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (err) {
    var params = {
      lat: 40.14179,
      lng: 127.182646,
    };
  }

  var params = {
    lat: 59.911262,
    lng: 10.750193,
    range: 100,
  };

  console.log("Params: ", params);
  setup_map(params.lat, params.lng);
  map.on("dragend", function (e) {
    load_bikes(map.getCenter());
  });

  load_bikes(params);
}

main();
