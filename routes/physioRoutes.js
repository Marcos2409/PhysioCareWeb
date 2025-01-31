const express = require("express");
const physioController = require("../controllers/physioController.js");
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

// Rutas para fisioterapeutas
router.post("/", allowedRoles("admin"), upload.single("image"), physioController.addNewPhysio);
router.post("/:id", upload.single("image"), physioController.editPhysio);

router.get("/", allowedRoles("admin", "physio", "patient"), physioController.renderAllPhysios);
router.get("/new", allowedRoles("admin"), physioController.renderNewPhysioForm);
router.get("/find", allowedRoles("admin"), physioController.findPhysioBySpecialty);
router.get("/edit/:id", allowedRoles("admin"), physioController.renderEditPhysioForm);
router.get("/:id", allowedRoles("admin", "physio", "patient"), physioController.getPhysioDetails);

router.delete("/:id", allowedRoles("admin"), physioController.deletePhysio);

module.exports = router;