const express = require('express');

const mongoose = require('mongoose');

const Employee = mongoose.model('Employee');
const Project = mongoose.model('Project');
const Position = mongoose.model('Position');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("employee/addOrEdit",{
        viewTitle:"Insert Employee"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var employee = new Employee();

   employee.fullName = req.body.fullName;

   employee.email = req.body.email;

   employee.city = req.body.city;

   employee.project = req.body.project;

   employee.position = req.body.position;
   
   Project.findOne({name: employee.project}, (errProject, project) => {
       Position.findOne({name: employee.position}, (errPosition, position) => {
            if(project == null || position == null){
                handleReferenceError(req.body, project, position);
                res.render("employee/addOrEdit",{
                    viewTitle:"Insert Employee",
                    employee:req.body
                });
            }
            else {
                employee.save((err,doc) => {
                    if(!err){
                        res.redirect('employee/list');
                    }
                    else{
                        if(err.name == "ValidationError"){
                            handleValidationError(err,req.body);
                            res.render("employee/addOrEdit",{
                                viewTitle:"Insert Employee",
                                employee:req.body
                            })
                        }
                
                        console.log("Error occured during record insertion" + err);
                    }
                })
            }
       })
   })
}

function updateRecord(req,res)
{
    Employee.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('employee/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:'Update Employee',
                    employee:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Employee.find((err,docs) => {
        if(!err) {
            res.render("employee/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Employee.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("employee/addOrEdit",{
                viewTitle: "Update Employee",
                employee: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Employee.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'fullName':
              body['fullNameError'] = err.errors[field].message;
              break;
        
        case 'email':
              body['emailError'] = err.errors[field].message;
              break;

        default:
           break;
        }
    }
}

function handleReferenceError(body, project, position){
    if(project == null)
        body['projectError'] = "Project does not exist";
    if(position == null)
        body['positionError'] = "Position does not exist";
}

module.exports = router;