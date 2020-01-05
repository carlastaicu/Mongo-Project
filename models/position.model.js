const mongoose = require('mongoose');

var positionSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    salary:{
        type:Number
    }
})

module.exports = mongoose.model('Position',positionSchema);
