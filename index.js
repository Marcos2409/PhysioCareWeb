const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
dotenv.config();

const Patient = require("./routes/patientRoutes");
const Physio = require("./routes/physioRoutes");
const Record = require("./routes/recordRoutes");

mongoose.connect(process.env.DATABASE_URL);

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true,
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/public", express.static(__dirname + "/public"));

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use("/patients", Patient);
app.use("/physios", Physio);
app.use("/records", Record);


//Alternativa
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
//   });

app.listen(process.env.PUERTO, () =>
  console.log(`Server listening in port ${process.env.PUERTO}`)
);
