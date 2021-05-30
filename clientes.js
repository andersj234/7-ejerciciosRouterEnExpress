const express = require("express");
const router = express.Router();

router.post("/registro", function (req, res) {
  let db = req.app.locals.db;
  db.collection("clientes")
    .find({ dni: req.body.dni })
    .toArray(function (err, data) {
      if (err) {
        res.send({ error: true, contenido: err });
      } else {
        if (data.length === 0) {
          req.app.locals.db// si no existe cliente lo puede crear
            .collection("clientes")
            .insertOne(req.body, function (err, data) {
              err
                ? res.send({ error: true, contenido: err })
                : res.send({
                    error: false,
                    contenido: {
                      respuesta: data,
                      mensaje: "Usuario registrado correctamente", //si se registra correctamente se enviara un mensaje de feedback
                    },
                  });
            });
        } else {
          res.send({
            error: false,
            contenido: { mensaje: "Usuario ya registrado" },
          });
        }
      }
    });
});

router.put("/editar", function (req, res) {
  let nombre = req.body.nombre;
  let apellido = req.body.apellido;
  let dni = req.body.dni;
  req.app.locals.db
    .collection("clientes")
    .updateOne(
      { dni: dni },// busca por dni y actualiza el nombre y apellido
      { $set: { nombre: nombre, apellido: apellido } },
      function (error, datos) {
        if (error !== null) {
          res.send({ mensaje: "Ha habido un error. " + error });
        } else {
          if (datos.matchedCount != 1) {
            if (datos.modifiedCount === 1) { // busca si ha habido una actualizacion y manda un mensaje
              res.send({ error: false, mensaje: "Usuario actualizado" });
            } else {
              res.send({ error: false, mensaje: "No se ha podido actualizar" });
            }
          } else {
            res.send({
              error: false,
              mensaje: "No se ha encontrado el usuario",
            });
          }
        }
      }
    );
});

module.exports = router;
