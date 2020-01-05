const mongoose = require('mongoose');

var departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    nrOfEmployees:{
        type:Number
    },
    company: {
        type: mongoose.Schema.Types.String,
        ref: 'Company',
        required: true
    },
})

module.exports = mongoose.model('Department',departmentSchema);
