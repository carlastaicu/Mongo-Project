const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    }
})

module.exports = mongoose.model('Project',projectSchema);
