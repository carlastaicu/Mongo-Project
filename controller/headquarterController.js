const express = require('express');

const mongoose = require('mongoose');

const Headquarter = mongoose.model('Headquarter');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("headquarter/addOrEdit",{
        viewTitle:"Insert Headquarter"
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
   var headquarter = new Headquarter();

   headquarter.city = req.body.city;

   headquarter.streetAddress = req.body.streetAddress;

   headquarter.area = req.body.area;

   headquarter.built = req.body.built;

   headquarter.save((err,doc) => {
       if(!err){
        res.redirect('headquarter/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("headquarter/addOrEdit",{
                  viewTitle:"Insert Headquarter",
                  headquarter:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Headquarter.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('headquarter/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("headquarter/addOrEdit",{
                    viewTitle:'Update Headquarter',
                    headquarter:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {
    Headquarter.find((err,docs) => {
        if(!err) {
            res.render("headquarter/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Headquarter.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("headquarter/addOrEdit",{
                viewTitle: "Update Headquarter",
                headquarter: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Headquarter.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/headquarter/list');
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