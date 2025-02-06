const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
dotenv.config();

const Patient = require("./routes/patientRoutes");
const Physio = require("./routes/physioRoutes");
const Record = require("./routes/recordRoutes");
const Auth = require("./routes/authRoutes");
const User = require("./models/user");

mongoose.connect(process.env.DATABASE_URL);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
  })
);

const env = nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// Definir el filtro para formatear la fecha
env.addFilter("formatDate", (date) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/patients", Patient);
app.use("/physios", Physio);
app.use("/records", Record);
app.use("/auth", Auth);

// await Patient.deleteMany({});
// await Physio.deleteMany({});
// await Record.deleteMany({});

User.create([
  {
    login: "admin",
    password: "admin",
    rol: "admin",
  },
  {
    login: "physio",
    password: "physio",
    rol: "physio",
  },
  {
    login: "patient",
    password: "patient",
    rol: "patient",
  },
]);

app.listen(process.env.PUERTO, () => {
  console.log(`Server listening in port ${process.env.PUERTO}`);
  console.log(`http://localhost:8080/`);
});
