import request from "request";

export default (req, res) => {
  console.log(req.query);
  const options = {
    url: `https://json.geoiplookup.io/api`,
  };

  request(options, function (err, response, body) {
    if (err) return res.send(err);
    if (response.statusCode === 200) return res.send(response.body);
  });
};
