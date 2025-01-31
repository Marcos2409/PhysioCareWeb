const Record = require("../models/record");
const Patient = require("../models/patient");
const Physio = require("../models/physio");

// Renderizar todos los registros
const renderAllRecords = (req, res) => {
  Record.find()
    .populate("patient")
    .then((result) => {
      const validRecords = result.filter((record) => record.patient);
      res.render("records/record_list", { records: validRecords });
    })
    .catch((error) => {
      console.error(error);
      res.render("pages/error", { error: "Error fetching records" });
    });
};

// Mostrar los detalles del registro
const renderRecordDetail = (req, res) => {
  const recordId = req.params.id;

  Record.findById(recordId)
    .populate("patient")
    .populate("appointments.physio")
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .render("error", { error: "Expediente no encontrado" });
      }
      res.render("records/record_detail", { record });
    })
    .catch((error) => {
      console.error(error);
      res.render("pages/error", {
        error: "Error al obtener el expediente médico",
      });
    });
};

// Mostrar formulario para crear nuevo registro
const renderNewRecordForm = (req, res) => {
  Patient.find()
    .then((patients) => {
      if (patients.length === 0) {
        return res.render("error", { error: "No patients available." });
      }
      res.render("records/new_record", { patients });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error: "Error fetching patients" });
    });
};

// Controlador para renderizar el formulario de creación de la cita
const renderCreateAppointmentForm = (req, res) => {
  const { id } = req.params;

  // Buscar el record por ID
  Record.findById(id)
    .then((record) => {
      if (!record) {
        return res.status(404).send("Medical record not found");
      }

      // Obtener los fisioterapeutas para el select
      Physio.find()
        .then((fysiotherapists) => {
          res.render("records/new_appointment", {
            record,
            fysiotherapists,  // Se pasan los fisioterapeutas a la vista
          });
        })
        .catch((error) => {
          console.error("Error fetching physiotherapists:", error);
          res.status(500).send("Error fetching physiotherapists");
        });
    })
    .catch((error) => {
      console.error("Error fetching record:", error);
      res.status(500).send("Internal server error");
    });
};

// Controlador para crear una nueva cita
const createAppointment = async (req, res) => {
  const { id } = req.params;  // Obtener el ID del record
  const { date, physioId, diagnosis, treatment, observations } = req.body;

  try {
    // Buscar el record por ID
    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).send('Medical record not found');
    }

    const newAppointment = {
      date,
      physio: physioId,
      diagnosis,
      treatment,
      observations,
    };

    // Añadir la cita al record
    record.appointments.push(newAppointment);
    await record.save();

    // Redirigir al detalle del record
    res.redirect(`/records/${id}`);
  } catch (error) {
    let errors = {};

    // Procesar errores de validación si existen
    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;  // Obtener el mensaje de error
      }
    }

    // Si ocurre un error de código de duplicado, manejarlo
    if (error.code === 11000) {
      errors.generic = "There was an issue saving the appointment.";
    }

    // Obtener nuevamente el record y los fisioterapeutas para pasar a la vista
    const record = await Record.findById(id);
    const fysiotherapists = await Physio.find();

    // Renderizar el formulario con los errores y los datos previos
    res.render('records/new_appointment', {
      errors,  // Pasar los errores
      record,  // Pasar el record
      fysiotherapists,  // Pasar los fisioterapeutas
      appointment: { date, physioId, diagnosis, treatment, observations },
    });
  }
};


// Controlador para crear nuevo registro
const createNewRecord = (req, res) => {
  const { patient, medicalRecord } = req.body;

  if (!patient || !medicalRecord) {
    return res.render("records/new_record", {
      error: "Both patient and medical record are required.",
    });
  }

  const newRecord = new Record({
    patient,
    medicalRecord,
    appointments: [],
  });

  newRecord
    .save()
    .then(() => {
      res.redirect("/records");
    })
    .catch((error) => {
      console.error(error);
      res.render("records/new_record", {
        error: "Error saving the medical record. Please try again.",
      });
    });
};

// Buscar registros por apellido del paciente (búsqueda parcial)
const findRecordsBySurname = async (req, res) => {
  const { surname } = req.query;

  try {
    if (!surname) {
      return res.status(400).send({ error: "A surname is required" });
    }

    const patients = await Patient.find({
      surname: { $regex: surname, $options: "i" },
    });

    if (patients.length === 0) {
      return res.status(404).send({
        error: "No patients found with the given surname",
        result: null,
      });
    }

    const patientMatch = patients.map((patient) => patient._id);
    const records = await Record.find({ patient: { $in: patientMatch } });

    if (records.length === 0) {
      return res.status(404).send({
        error: "No records found for the given patients",
        result: null,
      });
    }

    return res.status(200).send({ result: records });
  } catch (error) {
    return res.status(500).send({ error: "Server error", result: null });
  }
};

// Obtener registros por ID del paciente
const getRecordsByPatientId = async (req, res) => {
  try {
    const record = await Record.findOne({ patient: req.params.id }).populate(
      "patient"
    );

    if (!record) {
      return res.status(404).send({
        error: "Record not found for the given patient",
        result: null,
      });
    }

    return res.status(200).send({ result: record });
  } catch (error) {
    return res.status(500).send({
      error: "An error occurred while fetching the record",
      details: error.message,
    });
  }
};

// Insertar una nueva cita en un registro existente
const addAppointment = async (req, res) => {
  try {
    const record = await Record.findOne({ patient: req.params.id });

    if (!record) {
      return res.status(404).send({
        error: "Record not found for the given patient",
        result: null,
      });
    }

    const newAppointment = {
      date: req.body.date,
      physio: req.body.physio,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      observations: req.body.observations,
    };

    record.appointments.push(newAppointment);

    const updatedRecord = await record.save();
    return res.status(201).send({ result: updatedRecord });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

// Eliminar un registro por ID
const deleteRecordById = (req, res) => {
  Record.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) res.status(200).send({ result });
      else return res.status(404).send({ error: "Record not found" });
    })
    .catch((error) => {
      return res.status(500).send({ error: "Server error" });
    });
};

module.exports = {
  renderAllRecords,
  renderRecordDetail,
  renderNewRecordForm,
  createNewRecord,
  renderCreateAppointmentForm,
  createAppointment,
};
