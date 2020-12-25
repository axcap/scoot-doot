import request from "request";

var oslo = {
  lat: 59.909,
  lng: 10.746,
};

export default (req, res) => {
  console.log(req.query);

  var lat = req.query.lat || oslo.lat;
  var lng = req.query.lng || oslo.lng;
  var range = req.query.range || 200;
  var max = req.query.max || 20;
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
