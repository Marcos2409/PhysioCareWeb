const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, "Login is required."],
    minlength: [4, "Login must be at least 4 characters."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [7, "Diagnosis must be at least 7 characters."],
  },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'patient', 'physio'],
  }
});

let User = mongoose.model("users", userSchema);
module.exports = User;
