const fetch = require("node-fetch");
const Headers = fetch.Headers;

// Récuperation du schéma en JSON de notre base sparql
const getSchemaFromStarlink = async () => {
  var myHeaders = new fetch.Headers();
  myHeaders.append(
    "Authorization",
    "Basic RVNHSS1XRUItMjAyMDpFU0dJLVdFQi0yMDIwLWhlVXE5Zg=="
  );
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append(
    "query",
    "SELECT *\nWHERE\n{\n    GRAPH <https://www.esgi.fr/2019/ESGI5/IW1/projet2>\n    {\n        ?s ?p ?o\n    }\n}"
  );

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    let response = await fetch(
      "https://sandbox.bordercloud.com/sparql",
      requestOptions
    );
    let data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

// Récuperation de la donnée depuis WIKIDATA
const getResultFromWikidata = async (paramName) => {
  var myHeaders = new fetch.Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Cookie",
    "WMF-Last-Access=24-Jun-2020; WMF-Last-Access-Global=24-Jun-2020"
  );

  var urlencoded = new URLSearchParams();
  urlencoded.append(
    "query",
    'PREFIX bd: <http://www.bigdata.com/rdf#> \nPREFIX mwapi: <https://www.mediawiki.org/ontology#API/> \nPREFIX wikibase: <http://wikiba.se/ontology#> \nPREFIX wdt: <http://www.wikidata.org/prop/direct/> \nPREFIX p: <http://www.wikidata.org/prop/> \nPREFIX pq: <http://www.wikidata.org/prop/qualifier/> \nPREFIX wd: <http://www.wikidata.org/entity/> \n\nselect  ?itemLabel ?t ?follower\nwhere {\n  \n    SERVICE wikibase:mwapi {     \n            bd:serviceParam wikibase:endpoint "www.wikidata.org";       \n                       wikibase:api "EntitySearch";\n                       mwapi:search "' +
      paramName +
      '";\n                       mwapi:language "en". \n            ?item wikibase:apiOutputItem mwapi:item.\n     		?num wikibase:apiOrdinal true.\n    }  \n  \n  ?item wdt:P31 wd:Q5 ;\n        wdt:P2002 ?t .\n \n  OPTIONAL { ?item p:P2002 ?guid.\n\n  ?guid pq:P3744  ?follower . }\n  \n  SERVICE wikibase:label {\n		bd:serviceParam wikibase:language "en" .\n  }\n  \n} \nLIMIT 100'
  );

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    let response = await fetch(
      "https://query.wikidata.org/sparql",
      requestOptions
    );
    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getSchemaFromStarlink,
  getResultFromWikidata,
};
