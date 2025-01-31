const express = require("express");
const recordController = require("../controllers/recordController.js");
const { allowedRoles } = require("../controllers/authController");

const router = express.Router();

// Rutas para registros médicos
router.get("/", allowedRoles("admin", "physio"), recordController.renderAllRecords);
router.get("/new", allowedRoles("admin", "physio"), recordController.renderNewRecordForm);
router.get("/:id/appointments/new", allowedRoles("admin", "physio"), recordController.renderCreateAppointmentForm);
router.get("/:id", allowedRoles("admin", "physio", "patient"), recordController.renderRecordDetail);

router.post("", allowedRoles("admin", "physio"), recordController.createNewRecord);
router.post("/:id/appointments/", allowedRoles("admin", "physio"), recordController.createAppointment);

module.exports = router;
