const mongoose = require('mongoose');
var validator = require("email-validator");

var companySchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    headquarter: {
        type: mongoose.Schema.Types.String,
        ref: 'Headquarter',
        required: true
    },
    stockMarketPrice: {
        type: Number
    },
    contactData: {
        type: mongoose.Schema.Types.String,
        ref: 'ContactData',
        required: true
    },
    ceo: {
        type: mongoose.Schema.Types.String,
        ref: 'CEO',
        required: true
    }
})

companySchema.path('contactData').validate((val) => {
    return validator.validate(val);
},'Invalid Email');


module.exports = mongoose.model('Company',companySchema);
