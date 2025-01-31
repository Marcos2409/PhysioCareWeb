const express = require("express");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.get("/login", authController.showLogin);
router.get("/logout", authController.logout);

router.post("/login", authController.login);

module.exports = router;