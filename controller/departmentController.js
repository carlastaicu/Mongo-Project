const express = require('express');

const mongoose = require('mongoose');

const Department = mongoose.model('Department');
const Company = mongoose.model('Company');
const router = express.Router();

router.get("/",(req,res) => {
    res.render("department/addOrEdit",{
        viewTitle:"Insert Department"
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
   var department = new Department();

   department.name = req.body.name;

   department.nrOfEmployees = req.body.nrOfEmployees;

   department.company = req.body.company;
   Company.findOne({name: department.company}, (errTeam, company) => {
    if(company){
        handleReferenceError(req.body, company);
        res.render("department/addOrEdit",{
            viewTitle:"Insert Project",
            department:req.body
        });
    }
    else {
        department.save((err,doc) => {
            if(!err){
                res.redirect('department/list');
            }
            else{
                if(err.name == "ValidationError"){
                    handleValidationError(err,req.body);
                    res.render("department/addOrEdit",{
                        viewTitle:"Insert Project",
                        department:req.body
                    })
                }
        
                console.log("Error occured during record insertion" + err);
            }
        })
    }
})
}

function updateRecord(req,res)
{
    Department.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('department/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("department/addOrEdit",{
                    viewTitle:'Update Department',
                    department:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Department.find((err,docs) => {
        if(!err) {
            res.render("department/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Department.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("department/addOrEdit",{
                viewTitle: "Update Department",
                department: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Department.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/department/list');
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

function handleReferenceError(body, company){
    if(company == null)
        body['companyError'] = "Company does not exist";
}

module.exports = router;