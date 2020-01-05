const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/EmployeeDB";

mongoose.connect(url,
    {useNewUrlParser:true,
    useUnifiedTopology: true},
        (err) => {
        if(!err){ console.log("MongoDB Connection Succeeded");}
        else{
            console.log("An Error Occured");
        } 
})

require('./employee.model');
require('./project.model');
require('./position.model');
require('./team.model');
require('./headquarter.model');
require('./department.model');
require('./contactData.model');