var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const service = require("../service/requests");
const bodyParser = require("body-parser");

router.use(bodyParser());

/* ACCUEIL */
router.get("/", function (req, res) {
  res.render("index", {
    title: "Starlink",
    error: req.query.error,
    info: req.query.info,
  });
});

/* Formulaire */
router.post("/", function (req, res) {
  if (!req.body.name || req.body.name === "")
    res.redirect("/?error=Le champs ne peut être vide");
  res.redirect("/" + req.body.name);
});

// RECHERCHE
router.get("/:query", async function (req, res) {
  const dataList = await service.getResultFromWikidata(req.params.query);
  const parsedData = dataList.results ? dataList.results.bindings : [];
  if (parsedData.length === 0)
    res.redirect("/?info=Aucun resultat pour cette recherche");

  res.render("result", { title: "Starlink", dataList: parsedData });
});

module.exports = router;
