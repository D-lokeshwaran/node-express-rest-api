const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: {
        type: String,
        requires: true
    },
    lastName: {
        type: String,
        requires: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema)