const Patient = require("../models/patient.js");

// Controlador para renderizar todos los pacientes
const renderAllPatients = (req, res) => {
  Patient.find()
    .then((resultado) => {
      res.render("patient_list", { patients: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error fetching patients" });
    });
};

// Controlador para mostrar el formulario de nuevo paciente
const renderNewPatientForm = (req, res) => {
  res.render("new_patient");
};

// Controlador para agregar un nuevo paciente
const addNewPatient = (req, res) => {
  const { name, surname, birthDate, address, insuranceNumber } = req.body;

  if (!name || !surname || !birthDate || !insuranceNumber) {
    console.log("body: " + req.body);
    return res
      .status(400)
      .render("error", { error: "All fields are required: " + req.body});
  }

  let newPatient = new Patient({
    name,
    surname,
    birthDate,
    address,
    insuranceNumber,
  });

  newPatient
    .save()
    .then((result) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      let errores = Object.keys(error.errors);
      let msg = "";
      if (errores.length > 0) {
        errores.forEach((clave) => {
          msg += "<p>" + error.errors[clave].message + "</p>";
        });
      } else {
        msg = "Error adding patient";
      }
      res.render("error", { error: msg });
    });
};

// Controlador para buscar pacientes por apellido (parcial)
const findPatientBySurname = (req, res) => {
  const { surname } = req.query;

  if (!surname) {
    Patient.find()
      .then((result) => {
        if (result.length === 0) {
          return res
            .status(404)
            .send({ error: "No patients registered", result: null });
        }
        return res.status(200).send({ result: result });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Server error", result: null });
      });
  }

  Patient.find({ surname: { $regex: surname, $options: "i" } })
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send({ error: "No patient found with given surname", result: null });
      }
      return res.status(200).send({ result: result });
    })
    .catch((error) => {
      return res.status(500).send({ error: "Server error", result: null });
    });
};

// Controlador para mostrar el formulario de edición de un paciente
const renderEditPatientForm = (req, res) => {
  Patient.findById(req.params["id"])
    .then((result) => {
      if (result) {
        res.render("patient_edit", { patient: result });
      } else {
        res.render("error", { error: "Patient not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Patient not found" });
    });
};

// Controlador para mostrar los detalles de un paciente
const getPatientDetails = (req, res) => {
  Patient.findById(req.params["id"])
    .then((result) => {
      if (result) res.render("patient_details", { patient: result });
      else res.render("error", { error: "Patient not found" });
    })
    .catch((error) => {
      res.render("error", { error: "Error finding patient" });
    });
};

// Controlador para eliminar un paciente
const deletePatient = (req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Cannot delete patient" });
    });
};

module.exports = {
  renderAllPatients,
  renderNewPatientForm,
  addNewPatient,
  findPatientBySurname,
  renderEditPatientForm,
  getPatientDetails,
  deletePatient,
};
