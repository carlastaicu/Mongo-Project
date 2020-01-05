const mongoose = require('mongoose');
var validator = require("email-validator");

var employeeSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: 'This field is required'
    },
    email:{
        type:String
    },
    city:{
        type:String
    },
    project:{
        type: mongoose.Schema.Types.String,
        ref: 'Project',
        required: true
    },
    position:{
        type: mongoose.Schema.Types.String,
        ref: 'Position',
        required: true
    }
})

// custom validation for email

employeeSchema.path('email').validate((val) => {
    return validator.validate(val);
},'Invalid Email');

module.exports = mongoose.model('Employee',employeeSchema);