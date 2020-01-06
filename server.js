require('./models/db');

const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const expressHandlebars = require('express-handlebars');

const employeeController = require('./controller/employeeController');
const projectController = require('./controller/projectController');
const positionController = require('./controller/positionController');
const teamController = require('./controller/teamController');
const headquarterController = require('./controller/headquarterController');
const departmentController = require('./controller/departmentController');
const contactDataController = require('./controller/contactDataController');
const companyController = require('./controller/companyController');
const ceoController = require('./controller/ceoController');

var app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.set('views',path.join(__dirname,'/views/'))

app.engine('hbs',expressHandlebars({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}))

app.set('view engine','hbs');

app.listen(5000,() => {
    console.log("Server is listening on Port 5000");
})

app.use('/employee',employeeController);
app.use('/project',projectController);
app.use('/position',positionController);
app.use('/team',teamController);
app.use('/headquarter',headquarterController);
app.use('/department',departmentController);
app.use('/contactData',contactDataController);
app.use('/company',companyController);
app.use('/ceo',ceoController);