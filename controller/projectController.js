const express = require('express');

const mongoose = require('mongoose');

const Project = mongoose.model('Project');

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

   project.save((err,doc) => {
       if(!err){
        res.redirect('project/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("project/addOrEdit",{
                  viewTitle:"Insert Project",
                  project:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
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

module.exports = router;