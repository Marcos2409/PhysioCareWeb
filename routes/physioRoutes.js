const express = require("express");
const physioController = require("../controllers/physioController.js");

const router = express.Router();

// Rutas para fisioterapeutas
router.get("/", physioController.renderAllPhysios);
router.get("/find", physioController.findPhysioBySpecialty);
router.get("/:id", physioController.getPhysioDetails);
router.get("/edit/:id", physioController.renderEditPhysioForm);
router.delete("/:id", physioController.deletePhysio);

module.exports = router;
