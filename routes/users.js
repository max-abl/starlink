var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");

  res.redirect();
});

/* GET users listing. */
router.get("/save", function (req, res, next) {
  // Enregistrer

  var myHeaders = new fetch.Headers();
  myHeaders.append(
    "Authorization",
    "Basic RVNHSS1XRUItMjAyMDpFU0dJLVdFQi0yMDIwLWhlVXE5Zg=="
  );
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append(
    "update",
    'PREFIX dc: <http://purl.org/dc/elements/1.1/> \nPREFIX ns: <http://example.org/ns#> \n \nINSERT DATA \n{ \n    GRAPH <https://www.esgi.fr/2019/ESGI5/IW1/projet2> \n    { \n        <http://example/book2>  ns:student "Philippe2" . \n    } \n}'
  );

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("https://sandbox.bordercloud.com/sparql", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  res.redirect("/");
});

module.exports = router;
