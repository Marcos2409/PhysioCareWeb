const mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [2, 'Name must be at least 2 characters long.'],
        maxlength: [50, 'Name cannot exceed 50 characters.']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required.'],
        minlength: [2, 'Surname must be at least 2 characters long.'],
        maxlength: [50, 'Surname cannot exceed 50 characters.']
    },
    birthDate: {
        type: Date,
        required: [true, 'Birth date is required.']
    },
    address: {  
        type: String,
        required: false,
        maxlength: [100, 'Address cannot exceed 100 characters.']
    },
    insuranceNumber: {
        type: String,
        required: [true, 'Insurance number is required.'],
        match: [/^[a-zA-Z0-9]{9}$/, 'Insurance number must be exactly 9 alphanumeric characters.'],
        unique: [true, 'Insurance number must be unique.']
    },
    image: {
        type: String,
        required: false
    }
});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;