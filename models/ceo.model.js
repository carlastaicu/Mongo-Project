const mongoose = require('mongoose');

var ceoSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    cityOfBirth:{
        type:String
    },
    yearsInOffice:{
        type:Number
    },
    netWorth:{
        type:Number
    }
})

module.exports = mongoose.model('CEO',ceoSchema);
