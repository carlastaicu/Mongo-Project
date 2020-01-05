const mongoose = require('mongoose');
var validator = require("email-validator");

var contactDataSchema = new mongoose.Schema({
    email:{
        type:String
    },
    phoneNumber:{
        type:Number
    }
})

// custom validation for email

contactDataSchema.path('email').validate((val) => {
    return validator.validate(val);
},'Invalid Email');

module.exports = mongoose.model('ContactData',contactDataSchema);