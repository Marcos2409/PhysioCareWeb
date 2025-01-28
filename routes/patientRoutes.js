const express = require("express");
const patientController = require("../controllers/patientController.js");

const router = express.Router();

// Rutas para pacientes
router.get("/", patientController.renderAllPatients);
router.get("/new", patientController.renderNewPatientForm);
router.post("/", patientController.addNewPatient);
router.get("/find", patientController.findPatientBySurname);
router.get("/edit/:id", patientController.renderEditPatientForm);
router.get("/:id", patientController.getPatientDetails);
router.delete("/:id", patientController.deletePatient);

module.exports = router;
