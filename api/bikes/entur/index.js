import request from "request";

var oslo = {
  lat: 59.54,
  lng: 10.43,
};

var prev_query;

export default (req, res) => {
  if (JSON.stringify(prev_query) == JSON.stringify(req.query)) {
    prev_query = req.query;
    console.log(prev_query);
  }

  var lat = req.query.lat || oslo.lat;
  var lng = req.query.lng || oslo.lng;
  var range = req.query.range || 200;
  var max = req.query.max || 5000;
  var operators = req.query.operators || "";
  const options = {
    url: `https://api.entur.io/mobility/v1/scooters?lat=${lat}&lon=${lng}&range=${range}&max=${max}&operators=${operators}`,
    headers: {
      "ET-Client-Name": "Organization - Yes",
    },
  };

  request(options, function (err, response, body) {
    if (err) return res.send(err);
    if (response.statusCode === 200) return res.send(response.body);
  });
};
