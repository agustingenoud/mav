// SERVER CODE

const express = require("express");
const { google } = require("googleapis");
var helmet = require("helmet");
var compression = require("compression");
require("dotenv").config();

const app = express();

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` listenin at ${port}`));
app.use(express.static("public")); // public folder to serve
app.use(helmet());
app.use(compression());
app.use(
  express.json({
    limit: "1mb",
  })
);

// REQUEST API
app.post("/api", async (request, response) => {
  const in_btn = request.body.btn;
  console.log(` * LALALA * ${JSON.stringify(in_btn)} `);

  // googleapis--------------------------------
  //create client instance for gAuth
  const client = await auth.getClient();
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });
  const spreadsheetId = "1WvXJ3QsqBEpKVbWfPGKCwMjX34F4XD3UejaKDWvxAzU";
  let getRows = "";

  switch (in_btn) {
    case "Television":
      console.log(`padentro del case 1: ${in_btn}`);
      getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Convenios!A:H",
        majorDimension: "COLUMNS",
      });

      break;
    case "Cine":
      console.log('Ahora "cine" está adentro del case AGREGAR');
      getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Convenios!A:H",
        majorDimension: "COLUMNS",
      });
      break;
    case "Publicidad":
      console.log('Ahora "publicidad" está adentro del case PUBLICIDAD');
      getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Convenios!A:H",
        majorDimension: "COLUMNS",
      });
      break;
    case "Animacion":
      console.log('Ahora "Animacion" está adentro del case ANIMACION');
      getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Convenios!A:H",
        majorDimension: "COLUMNS",
      });
      break;
    case "Agregar":
      console.log('Ahora "agregar" está adentro del case AGREGAR');
      getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "tv!A:H",
        majorDimension: "COLUMNS",
      });
      break;
  }

  //console.log(getRows); // From switch
  const data = getRows;
  // Fin --- googleapis

  response.json(data);
});

// REQUEST APU
app.post("/apu", async (request, response) => {
  const in_cnv = request.body.convenio;
  console.log(` * CONCONCONCON * ${JSON.stringify(in_cnv)} `);

  // googleapis--------------------------------
  //create client instance for gAuth
  const client = await auth.getClient();
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });
  const spreadsheetId = "1WvXJ3QsqBEpKVbWfPGKCwMjX34F4XD3UejaKDWvxAzU";
  let getConvenios = "";

  if (in_cnv != undefined) {
    console.log(` * UUUUU * ${JSON.stringify(in_cnv)} `);
    getConvenios = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Tabla de salarios!A:H",
      majorDimension: "COLUMNS",
    });
    const srv_cnv = getConvenios;
    console.log(srv_cnv);
    response.json(srv_cnv);
  }
});
