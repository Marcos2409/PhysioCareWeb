const Physio = require("../models/physio.js");

// Controlador para renderizar todos los fisioterapeutas
const renderAllPhysios = (req, res) => {
  Physio.find()
    .then((resultado) => {
      res.render("physio_list", { physios: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error fetching physios" });
    });
};

// Controlador para buscar fisioterapeutas por especialidad
const findPhysioBySpecialty = (req, res) => {
  const { specialty } = req.query;

  if (!specialty) {
    Physio.find()
      .then((result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .send({ error: "No physio registered", result: null });
        }
        return res.status(200).send({ result: result });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Server error", result: null });
      });
  } else {
    Physio.find({ specialty: { $regex: specialty } })
      .then((result) => {
        if (result.length === 0) {
          return res.status(404).send({
            error: "No physio found with given specialty",
            result: null,
          });
        }
        return res.status(200).send({ result: result });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Server error", result: null });
      });
  }
};

// Controlador para obtener los detalles de un fisioterapeuta
const getPhysioDetails = (req, res) => {
  Physio.findById(req.params["id"])
    .then((result) => {
      if (result) res.render("physio_details", { physio: result });
      else res.render("error", { error: "Physio not found" });
    })
    .catch((error) => {
      res.render("error", { error: "Error finding physio" });
    });
};

// Controlador para renderizar el formulario de edición de un fisioterapeuta
const renderEditPhysioForm = (req, res) => {
  Physio.findById(req.params["id"])
    .then((result) => {
      if (result) {
        res.render("physio_edit", { physio: result });
      } else {
        res.render("error", { error: "Physio not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Physio not found" });
    });
};

// Controlador para eliminar un fisioterapeuta por ID
const deletePhysio = (req, res) => {
  Physio.findByIdAndDelete(req.params["id"])
    .then((result) => {
      if (result) res.status(200).send({ result: result });
      else res.status(400).send({ error: "Physio not found" });
    })
    .catch((error) => {
      return res.status(400).send({ error: "Error removing Physio" });
    });
};

module.exports = {
  renderAllPhysios,
  findPhysioBySpecialty,
  getPhysioDetails,
  renderEditPhysioForm,
  deletePhysio,
};
