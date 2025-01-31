const Patient = require("../models/patient.js");
const User = require("../models/user.js");

// Controlador para renderizar todos los pacientes
const renderAllPatients = (req, res) => {
  Patient.find()
    .then((resultado) => {
      res.render("patients/patient_list", { patients: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error fetching patients" });
    });
};

// Controlador para mostrar el formulario de edición de un paciente
const renderEditPatientForm = (req, res) => {
  Patient.findById(req.params["id"])
    .then((result) => {
      if (result) {
        res.render("patients/patient_edit", { patient: result });
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
    .then((patient) => {
      if (!patient) {
        res.render("error", { error: "Patient not found" });
        return;
      }

      User.findById(patient._id)
        .then((user) => {
          res.render("patients/patient_details", { patient, user });
        })
        .catch((error) => {
          res.render("error", { error: "Error fetching associated user" });
        });
    })
    .catch((error) => {
      res.render("error", { error: "Error finding patient" });
    });
};

// Controlador para mostrar el formulario de nuevo paciente
const renderNewPatientForm = (req, res) => {
  res.render("patients/new_patient");
};

// Controlador para agregar un nuevo paciente
const addNewPatient = async (req, res) => {
  const {
    name,
    surname,
    birthDate,
    address,
    insuranceNumber,
    login,
    password,
  } = req.body;

  let patientData = {
    name,
    surname,
    birthDate,
    address,
    insuranceNumber,
    image: req.file ? req.file.filename : undefined,
  };

  let userData = {
    login,
    password,
    rol: 'patient', // Aquí asignamos el rol 'patient'
  };

  try {
    const newPatient = new Patient(patientData);
    const savedPatient = await newPatient.save();

    const newUser = new User({
      _id: savedPatient._id,
      login: userData.login,
      password: userData.password,
      rol: userData.rol, // Usamos el rol de userData
    });

    await newUser.save();

    res.redirect(req.baseUrl);
  } catch (error) {
    let errors = {};

    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    }

    if (error.code === 11000) {
      errors.login = "Login already exists";
    }

    res.render("patients/new_patient", {
      errors,
      patient: patientData,
      user: userData,
    });
  }
};


// Servicio para editar pacientes
const editPatient = (req, res) => {
  const updateData = {
    name: req.body.name,
    surname: req.body.surname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    insuranceNumber: req.body.insuranceNumber,
  };

  if (req.file && req.file.filename) {
    updateData.image = req.file.filename;
  }

  Patient.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
    .then((updatedPatient) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      const errors = error.errors ? Object.keys(error.errors) : [];
      const message =
        errors.length > 0
          ? errors.map((key) => `<p>${error.errors[key].message}</p>`).join("")
          : "Error updating patient";
      res.render("error", { error: message });
    });
};

const findPatientBySurname = (req, res) => {
  const { surname } = req.query;

  if (!surname) {
    Patient.find()
      .then((result) => {
        if (result.length === 0) {
          return res.render("patients/patient_list", { patients: [], message: "No patients registered" });
        }
        return res.render("patients/patient_list", { patients: result });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Server error", result: null });
      });
  } else {
    Patient.find({ surname: { $regex: surname, $options: "i" } })
      .then((result) => {
        if (result.length === 0) {
          return res.render("patients/patient_list", { patients: [], message: "No patient found with given surname" });
        }
        return res.render("patients/patient_list", { patients: result });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Server error", result: null });
      });
  }
};

// Controlador para eliminar un paciente
const deletePatient = (req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        return User.findByIdAndDelete(req.params.id);
      } else {
        throw new Error("Patient not found");
      }
    })
    .then(() => {
      res.redirect("/patients");
    })
    .catch((error) => {
      res.status("error", { error: error.message || "Cannot delete patient" });
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
  editPatient,
};
