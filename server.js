var request = require("request");
const express = require("express");
import tier from "./api/bikes/tier/tier";
import flash from "./api/bikes/tier/flash";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/bikes/tier", (req, res) => {
  tier(req, res);
});

app.get("/bikes/tier/flash", (req, res) => {
  flash(req, res);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
