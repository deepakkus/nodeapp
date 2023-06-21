var mongoose = require('mongoose')
var passwordHash = require('password-hash');

const PatientSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    ssn: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    pcp: {
        type: String,
        required: true,
    },
    createdOn: {
        type: String,
        required: true,
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false
      }
});

module.exports = mongoose.model('Patient', PatientSchema);