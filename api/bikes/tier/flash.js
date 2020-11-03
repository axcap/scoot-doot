import request from "request";

export default (req, res) => {
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
};
