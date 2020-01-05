const express = require('express');

const mongoose = require('mongoose');

const Team = mongoose.model('Team');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("team/addOrEdit",{
        viewTitle:"Insert Team"
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
   var team = new Team();

   team.name = req.body.name;

   team.nrOfEmployees = req.body.nrOfEmployees;

   team.save((err,doc) => {
       if(!err){
        res.redirect('team/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("team/addOrEdit",{
                  viewTitle:"Insert Team",
                  team:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Team.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('team/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("team/addOrEdit",{
                    viewTitle:'Update Team',
                    team:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Team.find((err,docs) => {
        if(!err) {
            res.render("team/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Team.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("team/addOrEdit",{
                viewTitle: "Update Team",
                team: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Team.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/team/list');
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