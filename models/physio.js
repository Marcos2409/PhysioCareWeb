const mongoose = require('mongoose');

let physioSchema = new mongoose.Schema({
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
    specialty: {
        type: String,
        required: [true, 'Specialty is required.'],
        enum: {
            values: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
            message: 'Specialty must be one of: Sports, Neurological, Pediatric, Geriatric, Oncological.'
        }
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required.'],
        match: [/^[a-zA-Z]\d{7}$/, 'License number must be exactly 1 letter and 7 numeric characters.'],
        unique: [true, 'License number must be unique.']
    },
    image: {
        type: String,
        required: false
    }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;