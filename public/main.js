let server = "http://localhost:3000/api";
var map;

function setup_map(latitude, longitude) {
  map = L.map("mapid").setView([latitude, longitude], 18);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
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

function make_bike_flash(e, bike_id) {
  //alert("Flashing");
  //console.log(e);
  /*
  var params = {
    vehicleId: bike_id,
  };
  httpGetAsync(server + "/bikes/tier/flash" + formatParams(params), function (
    data
  ) {
    console.log(data);
  });
  */
}

function load_bikes(params) {
  Object.entries(params).forEach(([key, value]) => {
    console.log(key, value);
  });
  httpGetAsync(server + "/bikes/tier" + formatParams(params), function (data) {
    var json = JSON.parse(data);

    Object.entries(json.data).forEach(([key, bike]) => {
      let lat = bike.attributes.lat;
      let lng = bike.attributes.lng;

      let bike_info = JSON.stringify(bike, null, 2);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(bike_info)
        .bindTooltip(bike_info)
        .on("click", (e) => {
          make_bike_flash(e, bike.id);
        });
    });
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

  setup_map(params.lat, params.lng);
  map.on("dragend", function (e) {
    load_bikes(map.getCenter());
  });
  load_bikes(params);
}

main();
