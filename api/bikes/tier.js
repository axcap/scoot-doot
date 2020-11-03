var request = require("request");

module.exports = (req, res) => {
  console.log(req.query);
  const options = {
    url: `https://platform.tier-services.io/v1/vehicle?lat=${req.query.lat}&lng=${req.query.lng}&radius=500`,
    headers: {
      "X-Api-Key": "bpEUTJEBTf74oGRWxaIcW7aeZMzDDODe1yBoSxi2",
    },
  };

  request(options, function (err, response, body) {
    if (err) return res.send(err);
    if (response.statusCode === 200) return res.send(response.body);
  });
};
