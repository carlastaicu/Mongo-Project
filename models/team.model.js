const mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    nrOfEmployees:{
        type:Number
    }
})

module.exports = mongoose.model('Team',teamSchema);
