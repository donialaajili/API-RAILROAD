const express = require("express");
const port = 3000;

const app = express();

app.listen(port, () => console.log("Le serveur a demarré au port  "+ port));