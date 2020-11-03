var request = require("request");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/bikes/tier", (req, res) => {
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
});

app.get("/bikes/tier/flash", (req, res) => {
  console.log(req.query);
  const options = {
    url: `https://platform.tier-services.io/v1/vehicle/${req.query.vehicleId}/flash`,
    method: "POST",
    headers: {
      "X-Api-Key": "bpEUTJEBTf74oGRWxaIcW7aeZMzDDODe1yBoSxi2",
    },
  };

  request(options, function (err, response, body) {
    console.log(response.statusCode);
    if (err) return res.send(err);
    if (response.statusCode === 403) return res.send(response);
    if (response.statusCode === 200) return res.send(response.body);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
