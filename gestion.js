const express = require("express");
const router = express.Router();

router.post("/checkin", function (req, res) {
  app.locals.db
    .collection("clientes")
    .find({ dni: req.body.dni }) //buscca el dni
    .toArray(function (err, data) {
      if (err) {
        res.send({ error: true, contenido: err });
      } else {
        if (data.length === 1) {
          app.locals.db //si existe numero busca la habitacion
            .collection("habitaciones")
            .find({ room: req.body.room })
            .toArray(function (err, data) {
              if (err) {
                res.send({ error: true, contenido: err });
              } else {
                if (data.length === 1) {
                  if (data[0].disponible) {//mira si la habitacion esta disponible
                    app.locals.db.collection("reservas").insertOne(
                      {
                        dni: req.body.dni, //si esta disponible realiza el check in
                        room: req.body.room,
                        in: req.body.in,
                        activa: true,
                        out: req.body.out,
                      },
                      function (err, data) {
                        if (err) {
                          res.send({ error: true, contenido: err });
                        } else {
                          res.send({
                            error: false,
                            contenido: {
                              mensaje: "Reserva realizada correctamente",
                              respuesta: data,
                            },
                          });
                        }
                      }
                    );
                  } else {
                    res.send({
                      error: false,
                      contenido: {
                        mensaje: "Habitación no disponible",
                        respuesta: data,
                      },
                    });
                  }
                } else {
                  res.send({
                    error: false,
                    contenido: {
                      mensaje: "Habitación no existente",
                      respuesta: data,
                    },
                  });
                }
              }
            });
        } else {
          res.send({
            erro: false,
            contenido: { mensaje: "Usuario no registrado", respuesta: data },
          });
        }
      }
    });
});

module.exports = router;
