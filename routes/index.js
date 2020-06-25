var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const service = require("../service/requests");
const bodyParser = require("body-parser");

router.use(bodyParser());

/* Page d'accueil */
router.get("/", async function (req, res) {
  const dataList = await service.getSchemaFromStarlink(req.params.query);

  res.render("index", {
    title: "Starlink",
    keywords: dataList.results ? dataList.results.bindings : [],
    error: req.query.error,
    info: req.query.info,
  });
});

/* Gestion du formulaire */
router.post("/", async function (req, res) {
  if (!req.body.name || req.body.name === "")
    res.redirect("/?error=Le champs ne peut être vide");

  try {
    res.redirect("/" + req.body.name);
  } catch (e) {
    console.error(e);
  }
});

/* Affichage des resulats */
router.get("/:query", async function (req, res) {
  const dataList = await service.getResultFromWikidata(req.params.query);
  const parsedData = dataList.results ? dataList.results.bindings : [];
  if (parsedData.length === 0)
    res.redirect("/?info=Aucun resultat pour cette recherche");

  if (parsedData.length !== 0)
    await service.postTripletToStarlink(req.params.query);
  res.render("result", { title: "Starlink", dataList: parsedData });
});

module.exports = router;
