const express = require("express");
const patientController = require("../controllers/patientController.js");
const { allowedRoles } = require("../controllers/authController");

const router = express.Router();

const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let upload = multer({storage: storage});

// Rutas para pacientes
router.post("/", allowedRoles("admin", "physio"), upload.single("image"), patientController.addNewPatient);
router.post("/:id", upload.single("image"), patientController.editPatient);

router.get("/", allowedRoles("admin", "physio"), patientController.renderAllPatients);
router.get("/new", allowedRoles("admin", "physio"), patientController.renderNewPatientForm);
router.get("/find", allowedRoles("admin", "physio"), patientController.findPatientBySurname);
router.get("/edit/:id", allowedRoles("admin", "physio"), patientController.renderEditPatientForm);
router.get("/:id", allowedRoles("admin", "physio", "patient"), patientController.getPatientDetails);

router.delete("/:id", allowedRoles("admin", "physio"), patientController.deletePatient);

module.exports = router;
