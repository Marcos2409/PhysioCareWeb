const Record = require("../models/record.js");

// Renderizar todos los registros
const renderAllRecords = (req, res) => {
  Record.find()
    .populate("patient")
    .then((result) => {
      res.render("record_list", { records: result });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error: "Error fetching records" });
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

// Insertar un nuevo registro
const insertRecord = (req, res) => {
  const newRecord = new Record({
    patient: req.body.patient,
    medicalRecord: req.body.medicalRecord,
  });

  newRecord
    .save()
    .then((result) => {
      return res.status(201).send({ result });
    })
    .catch((error) => {
      return res.status(400).send({ error: "Error adding record" });
    });
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
  findRecordsBySurname,
  getRecordsByPatientId,
  insertRecord,
  addAppointment,
  deleteRecordById,
};
