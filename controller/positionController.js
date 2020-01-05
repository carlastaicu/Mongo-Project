const express = require('express');

const mongoose = require('mongoose');

const Position = mongoose.model('Position');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("position/addOrEdit",{
        viewTitle:"Insert Position"
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
   var position = new Position();

   position.name = req.body.name;

   position.salary = req.body.salary;

   position.save((err,doc) => {
       if(!err){
        res.redirect('position/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("position/addOrEdit",{
                  viewTitle:"Insert Position",
                  position:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Position.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('position/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("position/addOrEdit",{
                    viewTitle:'Update Position',
                    position:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Position.find((err,docs) => {
        if(!err) {
            res.render("position/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Position.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("position/addOrEdit",{
                viewTitle: "Update Position",
                position: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Position.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/position/list');
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