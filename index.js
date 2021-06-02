const express = require("express");
const mongodb = require("mongodb");
const app = express();
let MongoClient = mongodb.MongoClient;

let clientes = require("./clientes");
let gestion = require("./gestion");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/clientes", clientes);
app.use("/gestion", gestion);//requerimos los archivos de clientes y gestion donde tenemos el router

MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error, client) {
    if (error !== null) {
      console.log(error);
    } else {
      app.locals.db = client.db("hotel");
    }
  }
);

app.get("/patata", function (req, res) {
  db.collection("clientes")
    .find()
    .toArray(function (err, data) {
      err ? res.send("Fallo") : res.send({ error: false, contenido: data });
    });
});

app.listen(3000);
