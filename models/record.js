const mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required.']
    },
    physio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'physios',
        required: [true, 'Physio is required.']
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required.'],
        minlength: [10, 'Diagnosis must be at least 10 characters.'],
        maxlength: [500, 'Diagnosis must not exceed 500 characters.']
    },
    treatment: {
        type: String,
        required: [true, 'Treatment is required.']
    },
    observations: {
        type: String,
        maxlength: [500, 'Observations must not exceed 500 characters.']
    }
});

let recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: [true, 'Patient is required.']
    },
    medicalRecord: {
        type: String,
        maxlength: [1000, 'Medical record must not exceed 1000 characters.']
    },
    appointments: [appointmentSchema]
});

let Record = mongoose.model('records', recordSchema);

module.exports = Record;
