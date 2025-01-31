const Physio = require("../models/physio.js");
const User = require("../models/user.js");

// Controlador para renderizar todos los fisioterapeutas
const renderAllPhysios = (req, res) => {
  Physio.find()
    .then((resultado) => {
      res.render("physios/physio_list", { physios: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error fetching physios" });
    });
};

const findPhysioBySpecialty = (req, res) => {
  const { specialty } = req.query;

  if (!specialty) {
    Physio.find()
      .then((physios) => {
        if (physios.length === 0) {
          return res
            .status(404)
            .render("physios/physio_list", {
              error: "No physio registered",
              physios: [],
            });
        }
        return res.render("physios/physio_list", { physios });
      })
      .catch((error) => {
        return res
          .status(500)
          .render("physios/physio_list", {
            error: "Server error",
            physios: [],
          });
      });
  } else {
    Physio.find({ specialty: specialty })
      .then((physios) => {
        if (physios.length === 0) {
          return res
            .status(404)
            .render("physios/physio_list", {
              error: "No physio found with given specialty",
              physios: [],
            });
        }
        return res.render("physios/physio_list", { physios });
      })
      .catch((error) => {
        return res
          .status(500)
          .render("physios/physio_list", {
            error: "Server error",
            physios: [],
          });
      });
  }
};


// Controlador para mostrar el formulario de nuevo fisio
const renderNewPhysioForm = (req, res) => {
  res.render("physios/new_physio");
};

// Controlador para obtener los detalles de un fisioterapeuta
const getPhysioDetails = (req, res) => {
  Physio.findById(req.params["id"])
    .then((result) => {
      if (result) res.render("physios/physio_details", { physio: result });
      else res.render("error", { error: "Physio not found" });
    })
    .catch((error) => {
      res.render("error", { error: "Error finding physio" });
    });
};

// Controlador para renderizar el formulario de edición de un fisioterapeuta
const renderEditPhysioForm = (req, res) => {
  Physio.findById(req.params["id"])
    .then((result) => {
      if (result) {
        res.render("physios/physio_edit", { physio: result });
      } else {
        res.render("error", { error: "Physio not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Physio not found" });
    });
};

// Controlador para eliminar un fisio
const deletePhysio = (req, res) => {
  Physio.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        return User.findByIdAndDelete(req.params.id);
      } else {
        throw new Error("Physio not found");
      }
    })
    .then(() => {
      res.redirect("/physios");
    })
    .catch((error) => {
      res
        .status(500)
        .send({ error: error.message || "Cannot delete physio or user" });
    });
};

// Controlador para añadir nuevo fisio
const addNewPhysio = async (req, res) => {
  const { name, surname, specialty, licenseNumber, login, password } = req.body;

  let physioData = {
    name,
    surname,
    specialty,
    licenseNumber,
    image: req.file ? req.file.filename : undefined,
  };

  let userData = {
    login,
    password,
    rol: 'physio', // Asignamos el rol 'physio' aquí
  };

  try {
    const newPhysio = new Physio(physioData);
    const savedPhysio = await newPhysio.save();

    const newUser = new User({
      _id: savedPhysio._id,
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

    res.render("physios/new_physio", {
      errors,
      physio: physioData, // Asegúrate de pasar la variable correcta aquí (physioData, no patientData)
      user: userData,
    });
  }
};

// Servicio para editar fisio
const editPhysio = (req, res) => {
  const updateData = {
    name: req.body.name,
    surname: req.body.surname,
    specialty: req.body.specialty,
    licenseNumber: req.body.licenseNumber,
  };

  if (req.file && req.file.filename) {
    updateData.image = req.file.filename;
  }

  Physio.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
    .then((updatedPhysio) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      const errors = error.errors ? Object.keys(error.errors) : [];
      const message =
        errors.length > 0
          ? errors.map((key) => `<p>${error.errors[key].message}</p>`).join("")
          : "Error updating physio";
      res.render("error", { error: message });
    });
};

module.exports = {
  renderAllPhysios,
  findPhysioBySpecialty,
  getPhysioDetails,
  renderEditPhysioForm,
  deletePhysio,
  renderNewPhysioForm,
  addNewPhysio,
  editPhysio,
};
