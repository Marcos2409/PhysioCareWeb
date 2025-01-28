const express = require("express");
const recordController = require("../controllers/recordController.js");

const router = express.Router();

// Rutas para registros médicos
router.get("/", recordController.renderAllRecords);
router.get("/find", recordController.findRecordsBySurname);
router.get("/:id", recordController.getRecordsByPatientId);
router.post("/", recordController.insertRecord);
router.post("/:id/appointments", recordController.addAppointment);
router.delete("/:id", recordController.deleteRecordById);

module.exports = router;
