const express = require('express');

const mongoose = require('mongoose');

const Project = mongoose.model('Project');
// const Company = mongoose.model('Company');
// const Department = mongoose.model('Department');
// const Team = mongoose.model('Team');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("project/addOrEdit",{
        viewTitle:"Insert Project"
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
   var project = new Project();

   project.name = req.body.name;

   project.company = req.body.company;

   project.department = req.body.department;

   project.team = req.body.team;

   Company.findOne({name: project.company}, (errCompany, company) => {
    Department.findOne({name: project.department}, (errDepartment, department) => {
      Team.findOne({name: project.team}, (errTeam, team) => {
         if(company == null || department == null || team == null){
             handleReferenceError(req.body, company, department, team);
             res.render("project/addOrEdit",{
                 viewTitle:"Insert Project",
                 employee:req.body
             });
         }
         else {
             employee.save((err,doc) => {
                 if(!err){
                     res.redirect('project/list');
                 }
                 else{
                     if(err.name == "ValidationError"){
                         handleValidationError(err,req.body);
                         res.render("project/addOrEdit",{
                             viewTitle:"Insert Project",
                             employee:req.body
                         })
                     }
             
                     console.log("Error occured during record insertion" + err);
                 }
             })
         }
    })
    })
    })
}

function updateRecord(req,res)
{
    Project.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('project/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("project/addOrEdit",{
                    viewTitle:'Update Project',
                    project:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Project.find((err,docs) => {
        if(!err) {
            res.render("project/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Project.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("project/addOrEdit",{
                viewTitle: "Update Project",
                project: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Project.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/project/list');
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
        case 'name':
              body['nameError'] = err.errors[field].message;
              break;
        default:
           break;
        }
    }
}

function handleReferenceError(body, company, department, team){
    if(company == null)
        body['companyError'] = "Company does not exist";
    if(department == null)
        body['departmentError'] = "Department does not exist";
    if(team == null)
        body['teamError'] = "Team does not exist";
}

module.exports = router;