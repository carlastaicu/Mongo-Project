const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    company: {
        type: mongoose.Schema.Types.String,
        ref: 'Company',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.String,
        ref: 'Department',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.String,
        ref: 'Team',
        required: true
    }
})

module.exports = mongoose.model('Project',projectSchema);
