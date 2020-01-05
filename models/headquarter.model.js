const mongoose = require('mongoose');

var headquarterSchema = new mongoose.Schema({
    city:{
        type:String
    },
    streetAddress:{
        type:String
    },
    area:{
        type:Number
    },
    built:{
        type:Date
    }
})

module.exports = mongoose.model('Headquarter',headquarterSchema);
